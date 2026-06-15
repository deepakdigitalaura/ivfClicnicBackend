/* =====================================================================
 * Generate the Treatments seed fixture FROM the code defaults — so the seeded
 * CMS is byte-identical to the pre-CMS content with zero hand-transcription.
 * Emits scripts/seed/treatments.json (array of `treatments` doc bodies whose
 * shape mirrors src/collections/Treatments.ts). Built from toResolved() (the
 * same canonical serializer the round-trip parity gate compares against), so
 * resolveTreatment(slug, seedDoc) === toResolved(treatmentBySlug(slug)).
 * Re-run whenever the defaults change:  npm run seed:treatments:gen
 * ===================================================================== */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { TREATMENTS } from "@/lib/treatments";
import { toResolved } from "@/lib/treatment-content";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Wrap a string[] into a single-key array-of-object shape, e.g. { value }. */
const wrap = (arr: string[], key: string) => arr.map((v) => ({ [key]: v }));

const getNavMapping = (slug: string): { navCategory?: string; navOrder?: number } => {
  switch (slug) {
    // Advanced IVF
    case "ivf": return { navCategory: "advanced-ivf", navOrder: 10 };
    case "ivf-failure": return { navCategory: "advanced-ivf", navOrder: 20 };
    case "iui": return { navCategory: "advanced-ivf", navOrder: 30 };
    case "icsi": return { navCategory: "advanced-ivf", navOrder: 40 };
    case "picsi": return { navCategory: "advanced-ivf", navOrder: 50 };
    case "imsi": return { navCategory: "advanced-ivf", navOrder: 60 };
    case "macs": return { navCategory: "advanced-ivf", navOrder: 70 };
    case "spindle-view-icsi": return { navCategory: "advanced-ivf", navOrder: 80 };
    case "blastocyst-transfer": return { navCategory: "advanced-ivf", navOrder: 90 };
    case "laser-hatching": return { navCategory: "advanced-ivf", navOrder: 100 };


    // Donor Services
    case "egg-donation": return { navCategory: "donor-services", navOrder: 10 };
    case "sperm-donation": return { navCategory: "donor-services", navOrder: 20 };
    case "embryo-donation": return { navCategory: "donor-services", navOrder: 30 };


    // Male Infertility
    case "oligospermia": return { navCategory: "male-infertility", navOrder: 10 };
    case "asthenospermia": return { navCategory: "male-infertility", navOrder: 20 };
    case "azoospermia": return { navCategory: "male-infertility", navOrder: 30 };
    case "surgical-sperm-retrieval": return { navCategory: "male-infertility", navOrder: 40 };
    case "varicocele": return { navCategory: "male-infertility", navOrder: 50 };
    case "erectile-dysfunction": return { navCategory: "male-infertility", navOrder: 60 };

    // Female Infertility
    case "conceive-naturally": return { navCategory: "female-infertility", navOrder: 10 };
    case "prp-infertility": return { navCategory: "female-infertility", navOrder: 20 };
    case "pcos": return { navCategory: "female-infertility", navOrder: 30 };
    case "ovarian-reserve": return { navCategory: "female-infertility", navOrder: 40 };
    case "ovarian-rejuvenation": return { navCategory: "female-infertility", navOrder: 50 };
    case "fibroids": return { navCategory: "female-infertility", navOrder: 60 };
    case "endometriosis": return { navCategory: "female-infertility", navOrder: 70 };

    // Fertility Preservation
    case "cryopreservation": return { navCategory: "fertility-preservation", navOrder: 10 };


    default: return {};
  }
};

const docs = TREATMENTS.map((src) => {
  const r = toResolved(src);
  const nav = getNavMapping(r.slug);
  return {
    slug: r.slug,
    href: r.href,
    name: r.name,
    shortName: r.shortName,
    ...(r.alternateName ? { alternateName: r.alternateName } : {}),
    breadcrumbName: r.breadcrumbName,
    reviewerSlug: r.reviewerSlug,
    lastReviewed: r.lastReviewed,
    ...nav,
    meta: { title: r.meta.title, description: r.meta.description, ogImage: r.meta.ogImage },
    procedure: { ...r.procedure },
    hero: { ...r.hero, badges: wrap(r.hero.badges, "value") },
    whatIs: {
      heading: r.whatIs.heading,
      paragraphs: wrap(r.whatIs.paragraphs, "text"),
      ...(r.whatIs.aside ? { aside: r.whatIs.aside } : {}),
    },
    benefits: { heading: r.benefits.heading, ...(r.benefits.subtitle ? { subtitle: r.benefits.subtitle } : {}), items: wrap(r.benefits.items, "value") },
    ...(r.types
      ? { types: { heading: r.types.heading, ...(r.types.subtitle ? { subtitle: r.types.subtitle } : {}), items: r.types.items } }
      : {}),
    whoNeedsIt: { heading: r.whoNeedsIt.heading, ...(r.whoNeedsIt.subtitle ? { subtitle: r.whoNeedsIt.subtitle } : {}), items: wrap(r.whoNeedsIt.items, "value") },
    process: {
      heading: r.process.heading,
      ...(r.process.subtitle ? { subtitle: r.process.subtitle } : {}),
      steps: r.process.steps,
      ...(r.process.note ? { note: r.process.note } : {}),
    },
    ...(r.timeline
      ? {
          timeline: {
            heading: r.timeline.heading,
            ...(r.timeline.subtitle ? { subtitle: r.timeline.subtitle } : {}),
            items: r.timeline.items,
            ...(r.timeline.chips ? { chips: wrap(r.timeline.chips, "value") } : {}),
            ...(r.timeline.chipsNote ? { chipsNote: r.timeline.chipsNote } : {}),
          },
        }
      : {}),
    ...(r.video ? { video: { ...r.video } } : {}),
    ...(r.technology
      ? { technology: { heading: r.technology.heading, ...(r.technology.eyebrow ? { eyebrow: r.technology.eyebrow } : {}), ...(r.technology.subtitle ? { subtitle: r.technology.subtitle } : {}), items: r.technology.items } }
      : {}),
    ...(r.whyUs ? { whyUs: { heading: r.whyUs.heading, items: r.whyUs.items } } : {}),
    success: { factors: wrap(r.success.factors, "value"), ...(r.success.note ? { note: r.success.note } : {}) },
    cost: { includes: wrap(r.cost.includes, "value") },
    risks: { heading: r.risks.heading, ...(r.risks.subtitle ? { subtitle: r.risks.subtitle } : {}), items: r.risks.items },
    ...(r.preparation
      ? { preparation: { heading: r.preparation.heading, ...(r.preparation.subtitle ? { subtitle: r.preparation.subtitle } : {}), items: wrap(r.preparation.items, "value") } }
      : {}),
    faqs: r.faqs,
    related: wrap(r.related, "slug"),
    cta: { heading: r.cta.heading, headingEm: r.cta.headingEm, ...(r.cta.subtitle ? { subtitle: r.cta.subtitle } : {}) },
    _status: "published",
  };
});

const out = join(__dirname, "treatments.json");
writeFileSync(out, JSON.stringify(docs, null, 2) + "\n", "utf8");
console.log(`[gen-treatments] wrote ${docs.length} treatments → ${out}`);
