/* =====================================================================
 * Pilot blog import — extracts a hand-picked set of real posts from the
 * live ivfclinic.com WordPress site, cleans + converts them, and upserts
 * them into the `blogs` collection via the Payload REST API (same
 * idempotent-by-slug pattern as scripts/seed-blog-sample.mjs).
 *
 * Run: npx tsx --tsconfig tsconfig.json scripts/import-blogs/run.mts
 * (dev server must be running — PAYLOAD_URL defaults to localhost:3000)
 * ===================================================================== */
import { extract } from "./extract.mts";
import { uploadImageFromUrl } from "./media.mts";
import { doctorUrl } from "@/lib/doctors";
import { SITE } from "@/lib/seo";

const BASE = process.env.PAYLOAD_URL ?? "http://localhost:3000";
const EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@bfi.local";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "BfiPayload!2026";

type PilotPost = {
  slug: string;
  treatmentSlugs: string[];
  locationSlugs: string[];
};

/** Pilot batch — spans the main treatment families + the two locations
 *  with the richest existing CMS data, to prove treatment-wise AND
 *  location-wise placement end to end before scaling to the full ~280. */
const PILOT: PilotPost[] = [
  { slug: "iui-vs-ivf-which-fertility-treatment-is-right-for-you", treatmentSlugs: ["ivf", "iui"], locationSlugs: [] },
  { slug: "understanding-varicocele-how-serious-is-the-diagnosis", treatmentSlugs: ["varicocele", "male-infertility"], locationSlugs: [] },
  { slug: "egg-freezing-preserving-your-fertility-for-the-future", treatmentSlugs: ["fertility-preservation", "cryopreservation"], locationSlugs: [] },
  { slug: "how-to-choose-the-best-ivf-clinic-in-ahmedabad", treatmentSlugs: ["ivf"], locationSlugs: ["ahmedabad"] },
  { slug: "ivf-treatment-cost-in-ahmedabad-across-india", treatmentSlugs: ["ivf"], locationSlugs: ["ahmedabad"] },
  { slug: "the-link-between-pcos-and-infertility", treatmentSlugs: ["pcos"], locationSlugs: [] },
  { slug: "uterine-fibroids-symptoms-causes-and-treatment", treatmentSlugs: ["fibroids"], locationSlugs: [] },
  { slug: "dr-nilesh-jains-expert-guidance-on-fertility-treatments-in-mumbai", treatmentSlugs: ["ivf"], locationSlugs: ["mumbai"] },
];

const login = async (): Promise<string> => {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) throw new Error(`login HTTP ${res.status}: ${await res.text()}`);
  return (await res.json()).token;
};

const upsert = async (collection: string, slug: string, data: Record<string, unknown>, auth: Record<string, string>) => {
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
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const truncate = (s: string, max: number): string => (s.length <= max ? s : s.slice(0, max - 1).trimEnd() + "…");

async function run() {
  const token = await login();
  const auth = { Authorization: `JWT ${token}`, "Content-Type": "application/json" };
  const authHeader = auth.Authorization;

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
      // Local path so "View Full Profile" links to /doctors/parth-bavishi
      // on this site, not the external live site URL.
      sameAs: [{ url: doctorUrl("parth-bavishi") }],
    },
    auth,
  );
  console.log(`[import-blogs] writer=${writerId} reviewer=${reviewerId}`);

  for (const pilot of PILOT) {
    try {
      const post = await extract(pilot.slug);

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
        pilot.slug,
        {
          title: post.title,
          slug: pilot.slug,
          excerpt: post.excerpt,
          ...(heroImageId ? { heroImage: heroImageId } : {}),
          content: post.lexicalBody,
          author: writerId,
          reviewedBy: reviewerId,
          ...(categoryId ? { category: categoryId } : {}),
          readMins,
          publishedAt: post.datePublished,
          lastUpdatedAt: post.dateModified,
          treatmentSlugs: pilot.treatmentSlugs.map((slug) => ({ slug })),
          locationSlugs: pilot.locationSlugs.map((slug) => ({ slug })),
          faqs: post.faqs.map((f) => ({ question: f.question, answer: f.answer })),
          _status: "published",
          seo: { metaTitle, metaDescription },
        },
        auth,
      );

      console.log(
        `[import-blogs] OK ${pilot.slug} -> blog=${blogId} words=${post.wordCount} readMins=${readMins} faqs=${post.faqs.length} hero=${heroImageId ?? "none"}`,
      );
    } catch (e) {
      console.error(`[import-blogs] FAILED ${pilot.slug}:`, (e as Error).message);
    }
  }
}

run().catch((e) => {
  console.error("[import-blogs] fatal:", e);
  process.exit(1);
});
