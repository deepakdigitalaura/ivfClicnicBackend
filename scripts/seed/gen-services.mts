/* =====================================================================
 * Generate the Services seed fixture FROM the code defaults — so the seeded
 * CMS is byte-identical to the pre-CMS content with zero hand-transcription.
 * Emits scripts/seed/services.json (array of `services` doc bodies whose shape
 * mirrors src/collections/Services.ts). Re-run whenever the defaults change:
 *   npm run seed:services:gen
 * ===================================================================== */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { WOMENS_HEALTH_ALL, WOMENS_HEALTH_SERVICES, SERVICE_CONTENT } from "@/lib/womens-health";
import { iconKey } from "@/lib/icon-map";
import { toResolved } from "@/lib/services";

const __dirname = dirname(fileURLToPath(import.meta.url));

const wrap = (arr: string[], key: string) => arr.map((v) => ({ [key]: v }));

const docs = WOMENS_HEALTH_ALL.filter((k) => SERVICE_CONTENT[k]).map((key) => {
  const reg = WOMENS_HEALTH_SERVICES[key];
  const r = toResolved(SERVICE_CONTENT[key]);
  return {
    slug: r.slug,
    name: reg.name,
    desc: reg.desc,
    icon: iconKey(reg.icon),
    href: reg.href,
    published: reg.published,
    ...(reg.fallback ? { fallback: reg.fallback } : {}),
    schemaType: r.schemaType,
    shortName: r.shortName,
    breadcrumbName: r.breadcrumbName,
    reviewerSlug: r.reviewerSlug,
    lastReviewed: r.lastReviewed,
    hero: { ...r.hero, badges: wrap(r.hero.badges, "badge") },
    overview: {
      heading: r.overview.heading,
      paragraphs: wrap(r.overview.paragraphs, "text"),
      ...(r.overview.aside ? { aside: r.overview.aside } : {}),
    },
    benefits: { heading: r.benefits.heading, ...(r.benefits.subtitle ? { subtitle: r.benefits.subtitle } : {}), items: wrap(r.benefits.items, "item") },
    whoFor: { heading: r.whoFor.heading, ...(r.whoFor.subtitle ? { subtitle: r.whoFor.subtitle } : {}), items: wrap(r.whoFor.items, "item") },
    process: {
      heading: r.process.heading,
      ...(r.process.subtitle ? { subtitle: r.process.subtitle } : {}),
      steps: r.process.steps,
      ...(r.process.note ? { note: r.process.note } : {}),
    },
    whyUs: { heading: r.whyUs.heading, items: r.whyUs.items },
    ...(r.infoNote ? { infoNote: { heading: r.infoNote.heading, paragraphs: wrap(r.infoNote.paragraphs, "text") } } : {}),
    faqs: r.faqs,
    related: wrap(r.related.map((x) => x.key), "key"),
    seo: { metaTitle: r.meta.title, metaDescription: r.meta.description },
    _status: "published",
  };
});

const out = join(__dirname, "services.json");
writeFileSync(out, JSON.stringify(docs, null, 2) + "\n", "utf8");
console.log(`[gen-services] wrote ${docs.length} services → ${out}`);
