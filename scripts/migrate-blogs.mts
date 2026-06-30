/* =====================================================================
 * One-time migration: old Payload `blogs` Postgres table -> Sanity `blog` documents.
 *
 * Idempotent: each doc gets a deterministic _id: "blog-pg-<id>".
 *
 * Run:
 *   PG_URI=... SANITY_API_TOKEN=... NEXT_PUBLIC_SANITY_PROJECT_ID=... NEXT_PUBLIC_SANITY_DATASET=... \
 *   BLOB_READ_WRITE_TOKEN=... \
 *     npx tsx --tsconfig tsconfig.json scripts/migrate-blogs.mts [--dry-run] [--limit=N]
 * ===================================================================== */
import { Client } from "pg";
import { createClient } from "next-sanity";
import { list } from "@vercel/blob";

const DRY_RUN = process.argv.includes("--dry-run");
const LIMIT_ARG = (() => {
  const a = process.argv.find((s) => s.startsWith("--limit="));
  return a ? parseInt(a.split("=")[1]) : 279;
})();

const PG_URI = process.env.PG_URI;
if (!PG_URI) throw new Error("PG_URI env var is required");
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
if (!projectId || !dataset || !token) throw new Error("Sanity env vars required");
if (!blobToken) throw new Error("BLOB_READ_WRITE_TOKEN is required");

const sanity = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function groupBy<T extends Record<string, unknown>>(arr: T[], key: string): Map<number, T[]> {
  const m = new Map<number, T[]>();
  for (const row of arr) {
    const k = row[key] as number;
    if (!m.has(k)) m.set(k, []);
    m.get(k)!.push(row);
  }
  return m;
}

async function main() {
  // 1. Postgres
  const pg = new Client({ connectionString: PG_URI, ssl: { rejectUnauthorized: false } });
  await pg.connect();

  // 2. Authors map
  const { rows: authorRows } = await pg.query(
    `SELECT id, name, slug, role, credentials, avatar_id, bio FROM authors ORDER BY id`,
  );
  const authorMap = new Map<number, (typeof authorRows)[0]>(authorRows.map((r) => [r.id, r]));

  // 3. Categories map
  const { rows: catRows } = await pg.query(`SELECT id, title, slug FROM categories ORDER BY id`);
  const catMap = new Map<number, (typeof catRows)[0]>(catRows.map((r) => [r.id, r]));

  // 4. Media map (id -> {filename, alt})
  const { rows: mediaRows } = await pg.query(`SELECT id, filename, alt FROM media ORDER BY id`);
  const mediaMap = new Map<number, { filename: string; alt: string }>(
    mediaRows.map((r) => [r.id, { filename: r.filename as string, alt: (r.alt as string) ?? "" }]),
  );

  // 5. Blob URL map (filename -> public URL)
  console.log("Fetching Blob file list...");
  const blobMap = new Map<string, string>();
  let cursor: string | undefined;
  do {
    const result = await list({ token: blobToken!, limit: 1000, cursor });
    for (const blob of result.blobs) {
      const filename = blob.pathname.split("/").pop() ?? blob.pathname;
      blobMap.set(filename, blob.url);
    }
    cursor = result.cursor;
  } while (cursor);
  console.log(`Loaded ${blobMap.size} Blob URLs`);

  const resolveMedia = (mediaId: number | null): { url: string; alt: string } | null => {
    if (!mediaId) return null;
    const m = mediaMap.get(mediaId);
    if (!m?.filename) return null;
    const url = blobMap.get(m.filename);
    return url ? { url, alt: m.alt } : null;
  };

  // 6. Load blogs
  const { rows: blogs } = await pg.query(
    `SELECT * FROM blogs ORDER BY id LIMIT $1`,
    [LIMIT_ARG],
  );
  console.log(`Read ${blogs.length} blogs from Postgres (limit=${LIMIT_ARG})`);

  // 7. Child rows
  const { rows: faqRows } = await pg.query(
    `SELECT _parent_id, _order, question, answer FROM blogs_faqs ORDER BY _parent_id, _order`,
  );
  const { rows: treatmentRows } = await pg.query(
    `SELECT _parent_id, _order, slug FROM blogs_treatment_slugs ORDER BY _parent_id, _order`,
  );
  const { rows: locationRows } = await pg.query(
    `SELECT _parent_id, _order, slug FROM blogs_location_slugs ORDER BY _parent_id, _order`,
  );

  const faqsByBlog = groupBy(faqRows as Record<string, unknown>[], "_parent_id");
  const treatmentsByBlog = groupBy(treatmentRows as Record<string, unknown>[], "_parent_id");
  const locationsByBlog = groupBy(locationRows as Record<string, unknown>[], "_parent_id");

  // 8. Migrate
  let written = 0;
  let skipped = 0;
  const failed: number[] = [];

  for (const blog of blogs) {
    if (!blog.title || !blog.slug) {
      console.warn(`[skip] id=${blog.id} missing title/slug`);
      skipped++;
      continue;
    }

    const author = authorMap.get(blog.author_id);
    const reviewer = blog.reviewed_by_id ? authorMap.get(blog.reviewed_by_id) : null;
    const category = blog.category_id ? catMap.get(blog.category_id) : null;

    const hero = resolveMedia(blog.hero_image_id);
    const authorAvatar = author?.avatar_id ? resolveMedia(author.avatar_id as number) : null;
    const reviewerAvatar = reviewer?.avatar_id ? resolveMedia(reviewer.avatar_id as number) : null;
    const ogImage = blog.seo_og_image_id ? resolveMedia(blog.seo_og_image_id) : null;

    const faqs = (faqsByBlog.get(blog.id) ?? []).map((f) => ({
      question: f.question as string,
      answer: f.answer as string,
    }));
    const treatmentSlugs = (treatmentsByBlog.get(blog.id) ?? []).map((t) => t.slug as string);
    const locationSlugs = (locationsByBlog.get(blog.id) ?? []).map((l) => l.slug as string);

    // Preserve content byte-for-byte as a JSON string
    const contentRaw = blog.content ? JSON.stringify(blog.content) : null;

    const doc = {
      _id: `blog-pg-${blog.id}`,
      _type: "blog",
      pgId: blog.id as number,
      title: blog.title as string,
      slug: blog.slug as string,
      excerpt: (blog.excerpt as string) ?? null,
      heroImageUrl: hero?.url ?? null,
      heroImageAlt: hero?.alt ?? null,
      heroTextDark: (blog.hero_text_dark as boolean) ?? false,
      heroImagePosition: (blog.hero_image_position as string) ?? null,
      contentRaw,
      authorSlug: (author?.slug as string) ?? null,
      authorName: (author?.name as string) ?? null,
      authorRole: (author?.role as string) ?? null,
      authorCredentials: (author?.credentials as string) ?? null,
      authorAvatarUrl: authorAvatar?.url ?? null,
      authorBioText: (author?.bio as string) ?? null,
      reviewerSlug: (reviewer?.slug as string) ?? null,
      reviewerName: (reviewer?.name as string) ?? null,
      reviewerRole: (reviewer?.role as string) ?? null,
      reviewerCredentials: (reviewer?.credentials as string) ?? null,
      reviewerAvatarUrl: reviewerAvatar?.url ?? null,
      categoryTitle: (category?.title as string) ?? null,
      categorySlug: (category?.slug as string) ?? null,
      readMins: (blog.read_mins as number) ?? null,
      publishedAt: blog.published_at ? new Date(blog.published_at as string).toISOString() : null,
      lastUpdatedAt: blog.last_updated_at ? new Date(blog.last_updated_at as string).toISOString() : null,
      treatmentSlugs: treatmentSlugs.length ? treatmentSlugs : null,
      locationSlugs: locationSlugs.length ? locationSlugs : null,
      faqs: faqs.length ? faqs : null,
      seoMetaTitle: (blog.seo_meta_title as string) ?? null,
      seoMetaDescription: (blog.seo_meta_description as string) ?? null,
      seoOgTitle: (blog.seo_og_title as string) ?? null,
      seoOgDescription: (blog.seo_og_description as string) ?? null,
      seoOgImageUrl: ogImage?.url ?? null,
      status: (blog._status as string) ?? "published",
    };

    if (DRY_RUN) {
      const preview = { ...doc, contentRaw: doc.contentRaw ? `<${doc.contentRaw.length} chars>` : null };
      console.log("[dry-run]", JSON.stringify(preview, null, 2));
      written++;
      continue;
    }

    try {
      await sanity.createOrReplace(doc);
      written++;
      console.log(`[ok] id=${blog.id} slug=${blog.slug}`);
    } catch (e) {
      console.error(`[fail] id=${blog.id}:`, (e as Error).message);
      failed.push(blog.id as number);
    }
    await sleep(200);
  }

  await pg.end();
  console.log(`\nDone. read=${blogs.length} written=${written} skipped=${skipped} failed=${failed.length}`);
  if (failed.length) console.log("Failed ids:", failed.join(", "));
}

main().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
