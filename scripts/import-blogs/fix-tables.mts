/* =====================================================================
 * Table-fix pass — scans all imported blog posts for WordPress source
 * content that contains HTML <table> elements and re-imports only those
 * posts so the tables render as styled AnimatedComparisonTable blocks
 * instead of the flat paragraph text produced by the original import.
 *
 * Safe to re-run: upserts are idempotent by slug (PATCH if exists).
 * Non-table posts are skipped entirely (fast path: just a WP HTML fetch
 * + cheerio check — no Payload write unless a table is found).
 *
 * Run:
 *   PAYLOAD_URL=https://ivf-clicnic-backend-weld.vercel.app \
 *   SEED_ADMIN_EMAIL=... SEED_ADMIN_PASSWORD=... \
 *   npx tsx --tsconfig tsconfig.json scripts/import-blogs/fix-tables.mts
 * ===================================================================== */
import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";
import { extract } from "./extract.mts";
import { uploadImageFromUrl } from "./media.mts";
import { doctorUrl } from "@/lib/doctors";

const BASE = process.env.PAYLOAD_URL ?? "http://localhost:3000";
const EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@bfi.local";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "BfiPayload!2026";
const WP_BASE = "https://ivfclinic.com";
const DELAY_MS = 500; // polite pacing against the live WP site

const SLUGS_FILE = path.resolve(import.meta.dirname, "wp-canonical-slugs.txt");
const LOG_FILE = path.resolve(import.meta.dirname, "fix-tables.log.json");

/* ── Helpers ─────────────────────────────────────────────────────── */

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const login = async (): Promise<string> => {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) throw new Error(`login HTTP ${res.status}: ${await res.text()}`);
  return (await res.json()).token;
};

const upsert = async (
  collection: string,
  slug: string,
  data: Record<string, unknown>,
  auth: Record<string, string>,
): Promise<number> => {
  const found = await fetch(
    `${BASE}/api/${collection}?where[slug][equals]=${encodeURIComponent(slug)}&depth=0&limit=1`,
    { headers: auth },
  ).then((r) => r.json());
  const body = JSON.stringify(data);
  const res = found.docs?.length
    ? await fetch(`${BASE}/api/${collection}/${found.docs[0].id}`, { method: "PATCH", headers: auth, body })
    : await fetch(`${BASE}/api/${collection}`, { method: "POST", headers: auth, body });
  const out = await res.json();
  if (!res.ok) throw new Error(`${collection}/${slug} HTTP ${res.status}: ${JSON.stringify(out)}`);
  return out.doc.id as number;
};

const slugify = (s: string): string =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const truncate = (s: string, max: number): string =>
  s.length <= max ? s : s.slice(0, max - 1).trimEnd() + "…";

/* ── Quick check: does this WP post's HTML contain a <table>? ──────── */
async function wpHasTable(slug: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${WP_BASE}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_fields=content&limit=1`,
    );
    if (!res.ok) return false;
    const arr = await res.json() as any[];
    if (!arr.length) return false;
    const html = String(arr[0].content?.rendered ?? "");
    const $ = cheerio.load(html);
    return $("table").length > 0;
  } catch {
    return false;
  }
}

/* ── Auto-tagging (mirrors run-all.mts) ────────────────────────────── */
const TREATMENT_KEYWORDS: Record<string, string[]> = {
  ivf: ["ivf", "in-vitro-fertili", "test-tube-baby"],
  icsi: ["icsi"],
  iui: ["iui", "intra-uterine-insemination", "intrauterine-insemination"],
  picsi: ["picsi"],
  imsi: ["imsi"],
  macs: ["macs", "magnetic-activated-cell-sorting"],
  "spindle-view-icsi": ["spindle-view"],
  "blastocyst-transfer": ["blastocyst"],
  "laser-hatching": ["laser-assisted-hatching", "laser-hatching"],
  "ivf-failure": ["ivf-failure", "failed-ivf", "repeated-ivf-failure", "recurrent-ivf-failure"],
  "egg-donation": ["egg-donation", "egg-donor"],
  "sperm-donation": ["sperm-donation", "sperm-donor"],
  "embryo-donation": ["embryo-donation"],
  "male-infertility": ["male-infertility", "male-factor-infertility", "sperm-count", "sperm-quality", "sperm-health"],
  "female-infertility": ["female-infertility"],
  "fertility-preservation": ["fertility-preservation", "egg-freezing", "embryo-freezing", "sperm-freezing", "preserving-fertility", "preserve-fertility"],
  endometriosis: ["endometriosis"],
  azoospermia: ["azoospermia", "zero-sperm-count", "zero-sperm"],
  cryopreservation: ["cryopreservation", "freezing"],
  "recurrent-miscarriage": ["miscarriage", "recurrent-pregnancy-loss", "pregnancy-loss"],
  oligospermia: ["oligospermia", "low-sperm-count"],
  asthenospermia: ["asthenospermia", "sperm-motility"],
  "surgical-sperm-retrieval": ["surgical-sperm-retrieval", "tesa", "pesa", "micro-tese", "testicular-sperm"],
  varicocele: ["varicocele"],
  "erectile-dysfunction": ["erectile-dysfunction"],
  "conceive-naturally": ["conceive-naturally", "natural-pregnancy", "get-pregnant-naturally", "natural-cycle"],
  "prp-infertility": ["prp"],
  pcos: ["pcos", "polycystic"],
  "ovarian-reserve": ["ovarian-reserve", "low-amh", "amh-level", "amh-test"],
  "ovarian-rejuvenation": ["ovarian-rejuvenation"],
  fibroids: ["fibroid"],
};

const LOCATION_KEYWORDS: Record<string, string[]> = {
  ahmedabad: ["ahmedabad"],
  mumbai: ["mumbai"],
  vadodara: ["vadodara", "baroda"],
  surat: ["surat"],
  bhuj: ["bhuj"],
  bhavnagar: ["bhavnagar"],
  anand: ["anand"],
  varanasi: ["varanasi"],
};

function autoTag(slug: string, title: string): { treatmentSlugs: string[]; locationSlugs: string[] } {
  const haystack = `${slug} ${title}`.toLowerCase();
  const treatmentSlugs = Object.entries(TREATMENT_KEYWORDS)
    .filter(([, kws]) => kws.some((k) => haystack.includes(k)))
    .map(([s]) => s);
  const locationSlugs = Object.entries(LOCATION_KEYWORDS)
    .filter(([, kws]) => kws.some((k) => haystack.includes(k)))
    .map(([s]) => s);
  return { treatmentSlugs, locationSlugs };
}

/* ── Main ─────────────────────────────────────────────────────────── */

type Result = {
  slug: string;
  status: "skipped" | "patched" | "failed";
  blogId?: number;
  tableCount?: number;
  error?: string;
};

async function run() {
  const slugs = fs
    .readFileSync(SLUGS_FILE, "utf-8")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  console.log(`[fix-tables] ${slugs.length} slugs to scan`);

  const token = await login();
  const auth = { Authorization: `JWT ${token}`, "Content-Type": "application/json" };
  const authHeader = auth.Authorization;

  // Ensure writer/reviewer authors exist (idempotent)
  const writerId = await upsert(
    "authors",
    "bfi-editorial",
    { name: "BFI Editorial Team", slug: "bfi-editorial", role: "Medical Content Writer" },
    auth,
  );
  const reviewerId = await upsert(
    "authors",
    "parth-bavishi-author",
    {
      name: "Dr. Parth Bavishi",
      slug: "parth-bavishi-author",
      role: "Co-director & IVF Specialist",
      credentials: "MBBS, MD (Obstetrics & Gynaecology)",
      bio: "Co-director of Bavishi Fertility Institute and IVF specialist focused on male-factor infertility, advanced sperm retrieval and repeated-IVF-failure cases.",
      sameAs: [{ url: doctorUrl("parth-bavishi") }],
    },
    auth,
  );
  console.log(`[fix-tables] writer=${writerId} reviewer=${reviewerId}`);

  const results: Result[] = [];
  let patched = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const progress = `[${i + 1}/${slugs.length}]`;

    try {
      // Phase 1: quick table check (1 WP API call, no Payload write)
      const hasTable = await wpHasTable(slug);
      if (!hasTable) {
        console.log(`${progress} skip  ${slug}`);
        results.push({ slug, status: "skipped" });
        skipped++;
        await sleep(DELAY_MS);
        continue;
      }

      console.log(`${progress} TABLE ${slug} — re-importing…`);

      // Phase 2: full extract (uses fixed htmlToLexical with table support)
      const post = await extract(slug);
      const { treatmentSlugs, locationSlugs } = autoTag(slug, post.title);

      const categoryId = post.categoryName
        ? await upsert(
            "categories",
            slugify(post.categoryName),
            { title: post.categoryName, slug: slugify(post.categoryName) },
            auth,
          )
        : undefined;

      const heroImageId = post.heroImageUrl
        ? await uploadImageFromUrl(BASE, authHeader, post.heroImageUrl, post.heroImageAlt)
        : undefined;

      const readMins = Math.max(1, Math.round(post.wordCount / 200));
      const metaTitle = truncate(`${post.title} — Bavishi Fertility Institute`, 60);
      const metaDescription = truncate(post.excerpt, 160);

      const blogId = await upsert(
        "blogs",
        slug,
        {
          title: post.title,
          slug,
          excerpt: post.excerpt,
          ...(heroImageId ? { heroImage: heroImageId } : {}),
          content: post.lexicalBody,
          author: writerId,
          reviewedBy: reviewerId,
          ...(categoryId ? { category: categoryId } : {}),
          readMins,
          publishedAt: post.datePublished,
          lastUpdatedAt: post.dateModified,
          treatmentSlugs: treatmentSlugs.map((s) => ({ slug: s })),
          locationSlugs: locationSlugs.map((s) => ({ slug: s })),
          faqs: post.faqs.map((f) => ({ question: f.question, answer: f.answer })),
          _status: "published",
          seo: { metaTitle, metaDescription },
        },
        auth,
      );

      // Count comparisonTable blocks in the extracted content
      const lexRoot = (post.lexicalBody as any)?.root?.children ?? [];
      const tableCount = lexRoot.filter(
        (n: any) => n.type === "block" && n.fields?.blockType === "comparisonTable",
      ).length;

      console.log(`${progress} PATCH ${slug} -> blog=${blogId} tables=${tableCount}`);
      results.push({ slug, status: "patched", blogId, tableCount });
      patched++;
    } catch (e) {
      const msg = (e as Error).message;
      console.error(`${progress} FAIL  ${slug}: ${msg}`);
      results.push({ slug, status: "failed", error: msg });
      failed++;
    }

    fs.writeFileSync(LOG_FILE, JSON.stringify(results, null, 2));
    await sleep(DELAY_MS);
  }

  console.log(`\n[fix-tables] done: ${patched} patched, ${skipped} skipped, ${failed} failed`);
  if (results.filter((r) => r.status === "failed").length) {
    console.log("[fix-tables] failed slugs:");
    for (const r of results.filter((r) => r.status === "failed")) {
      console.log(`  - ${r.slug}: ${r.error}`);
    }
  }
  if (results.filter((r) => r.status === "patched").length) {
    console.log("[fix-tables] patched slugs:");
    for (const r of results.filter((r) => r.status === "patched")) {
      console.log(`  - ${r.slug} (${r.tableCount} table(s))`);
    }
  }
}

run().catch((e) => {
  console.error("[fix-tables] fatal:", e);
  process.exit(1);
});
