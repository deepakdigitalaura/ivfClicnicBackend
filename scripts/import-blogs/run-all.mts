/* =====================================================================
 * Full-scale blog import — processes every remaining post from the live
 * ivfclinic.com sitemaps (post-sitemap1.xml + post-sitemap2.xml) that
 * wasn't already covered by the 8-post pilot (see run.mts).
 *
 * Treatment/location tagging is AUTO-DETECTED by matching the post's
 * slug + title against keyword lists derived from TREATMENTS_REGISTRY /
 * CITIES (best-effort — editors can refine tags later via the Payload
 * admin or the /edit/blog/[slug] inline editor).
 *
 * Resilient: failures on one post (404, redirect, parse edge case) are
 * logged and skipped — does not abort the run. Safe to re-run; upserts
 * are idempotent by slug.
 *
 * Run: npx tsx --tsconfig tsconfig.json scripts/import-blogs/run-all.mts
 * (dev server must be running — PAYLOAD_URL defaults to localhost:3000)
 * ===================================================================== */
import fs from "node:fs";
import path from "node:path";
import { extract } from "./extract.mts";
import { uploadImageFromUrl } from "./media.mts";
import { doctorUrl } from "@/lib/doctors";

const BASE = process.env.PAYLOAD_URL ?? "http://localhost:3000";
const EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@bfi.local";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "BfiPayload!2026";
const DELAY_MS = 400; // polite pacing against the live WP site

const SLUGS_FILE = path.resolve(
  import.meta.dirname,
  process.env.SLUGS_FILE ?? "remaining-slugs.txt",
);
const LOG_FILE = path.resolve(import.meta.dirname, "run-all.log.json");

/* ── Auto-tagging keyword maps ──────────────────────────────────── */
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

/* ── Payload helpers (same pattern as run.mts) ──────────────────── */
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
) => {
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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ── Run ─────────────────────────────────────────────────────────── */
type Result = { slug: string; status: "ok" | "failed"; blogId?: number; error?: string; treatmentSlugs?: string[]; locationSlugs?: string[] };

async function run() {
  const slugs = fs.readFileSync(SLUGS_FILE, "utf-8").split("\n").map((s) => s.trim()).filter(Boolean);
  console.log(`[run-all] ${slugs.length} posts to import`);

  const token = await login();
  const auth = { Authorization: `JWT ${token}`, "Content-Type": "application/json" };
  const authHeader = auth.Authorization;

  // Reuse the same writer/reviewer authors created by the pilot run.
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
  console.log(`[run-all] writer=${writerId} reviewer=${reviewerId}`);

  const results: Result[] = [];

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const progress = `[${i + 1}/${slugs.length}]`;
    try {
      const post = await extract(slug);
      const { treatmentSlugs, locationSlugs } = autoTag(slug, post.title);

      const categoryId = post.categoryName
        ? await upsert("categories", slugify(post.categoryName), { title: post.categoryName, slug: slugify(post.categoryName) }, auth)
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

      console.log(
        `${progress} OK ${slug} -> blog=${blogId} words=${post.wordCount} faqs=${post.faqs.length} treat=[${treatmentSlugs}] loc=[${locationSlugs}] hero=${heroImageId ?? "none"}`,
      );
      results.push({ slug, status: "ok", blogId, treatmentSlugs, locationSlugs });
    } catch (e) {
      const msg = (e as Error).message;
      console.error(`${progress} FAILED ${slug}: ${msg}`);
      results.push({ slug, status: "failed", error: msg });
    }

    fs.writeFileSync(LOG_FILE, JSON.stringify(results, null, 2));
    await sleep(DELAY_MS);
  }

  const ok = results.filter((r) => r.status === "ok").length;
  const failed = results.filter((r) => r.status === "failed");
  console.log(`\n[run-all] done: ${ok} ok, ${failed.length} failed`);
  if (failed.length) {
    console.log("[run-all] failed slugs:");
    for (const f of failed) console.log(`  - ${f.slug}: ${f.error}`);
  }
}

run().catch((e) => {
  console.error("[run-all] fatal:", e);
  process.exit(1);
});
