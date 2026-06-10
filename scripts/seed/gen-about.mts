/* =====================================================================
 * Generate the About-BFI global seed fixture FROM the code default — so the
 * seeded CMS is byte-identical to the pre-CMS content with zero hand-
 * transcription. Emits scripts/seed/about-page.json (the doc body posted to
 * /api/globals/about-page by scripts/seed-globals.mjs). Built from
 * ABOUT_DEFAULTS (the same canonical default the round-trip parity gate compares
 * against), so resolveAbout(seedDoc) === ABOUT_DEFAULTS.
 *
 * The "15 / 6 centres" marketing copy is curated (NOT derived from CENTRES) and
 * is carried through verbatim. The seo.ogImage upload relation is intentionally
 * omitted (no media doc to reference) — generateMetadata falls back to the code
 * default image when it is empty.
 *
 * Re-run whenever ABOUT_DEFAULTS changes:  npm run seed:about:gen
 * ===================================================================== */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { ABOUT_DEFAULTS } from "@/lib/about";

const __dirname = dirname(fileURLToPath(import.meta.url));

const d = ABOUT_DEFAULTS;
const doc = {
  hero: {
    eyebrow: d.hero.eyebrow,
    headline: d.hero.headline,
    headlineItalic: d.hero.headlineItalic,
    paragraph: d.hero.paragraph,
  },
  atAGlance: d.atAGlance.map((s) => ({ value: s.n, label: s.l })),
  milestones: d.milestones.map((m) => ({ y: m.y, t: m.t, d: m.d })),
  trustPillars: d.trustPillars.map((p) => ({ icon: p.icon, t: p.t, d: p.d })),
  patientStats: d.patientStats.map((s) => ({ value: s.n, label: s.l })),
  network: {
    heading: { lead: d.network.heading.lead, em: d.network.heading.em },
    subtitle: d.network.subtitle,
    cities: d.network.cities.map((c) => ({ c: c.c, n: c.n })),
  },
  finalCta: {
    heading: { lead: d.finalCta.heading.lead, em: d.finalCta.heading.em },
    ctas: d.finalCta.ctas.map((text) => ({ text })),
  },
  seo: {
    metaTitle: d.seo.metaTitle,
    metaDescription: d.seo.metaDescription,
    ogTitle: d.seo.ogTitle,
    ogDescription: d.seo.ogDescription,
  },
};

const out = join(__dirname, "about-page.json");
writeFileSync(out, JSON.stringify(doc, null, 2) + "\n", "utf8");
console.log(`[gen-about] wrote about-page global → ${out}`);
