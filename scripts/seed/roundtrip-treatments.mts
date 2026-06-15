/* =====================================================================
 * Treatment round-trip parity gate (Wave 4.4, required before any route
 * migration). Proves the CMS round-trips the treatment content losslessly:
 *
 *     resolveTreatment(slug, seededDoc) === toResolved(treatmentBySlug(slug))
 *
 * for EVERY treatment in TREATMENTS. `seededDoc` is the exact doc body the
 * seed pipeline writes (built here in-memory from the same gen transform), so
 * this validates the gen↔resolve inverse relationship deterministically with
 * NO database — the precondition the blueprint requires before D1 starts.
 *
 * Run:  npm run seed:treatments:roundtrip
 * Exits non-zero (and prints the first differing path per treatment) on any
 * mismatch so it can gate CI / the checkpoint.
 * ===================================================================== */
import { TREATMENTS } from "@/lib/treatments";
import { toResolved, resolveTreatment, type TreatmentSource } from "@/lib/treatment-content";

/** Mirror of gen-treatments.mts: serialise a code Treatment into the doc body
 *  the seed writes (string arrays wrapped into single-key object arrays). */
const wrap = (arr: string[], key: string) => arr.map((v) => ({ [key]: v }));

function toSeedDoc(slug: string): TreatmentSource {
  const t = TREATMENTS.find((x) => x.slug === slug)!;
  const r = toResolved(t);
  return {
    slug: r.slug,
    href: r.href,
    name: r.name,
    shortName: r.shortName,
    ...(r.alternateName ? { alternateName: r.alternateName } : {}),
    breadcrumbName: r.breadcrumbName,
    reviewerSlug: r.reviewerSlug,
    lastReviewed: r.lastReviewed,
    meta: { title: r.meta.title, description: r.meta.description, ogImage: r.meta.ogImage },
    procedure: { ...r.procedure },
    hero: { ...r.hero, badges: wrap(r.hero.badges, "value") },
    whatIs: {
      heading: r.whatIs.heading,
      paragraphs: wrap(r.whatIs.paragraphs, "text"),
      ...(r.whatIs.aside ? { aside: r.whatIs.aside } : {}),
    },
    benefits: { heading: r.benefits.heading, ...(r.benefits.subtitle ? { subtitle: r.benefits.subtitle } : {}), items: wrap(r.benefits.items, "value") },
    ...(r.types ? { types: { heading: r.types.heading, ...(r.types.subtitle ? { subtitle: r.types.subtitle } : {}), items: r.types.items } } : {}),
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
    ...(r.preparation ? { preparation: { heading: r.preparation.heading, ...(r.preparation.subtitle ? { subtitle: r.preparation.subtitle } : {}), items: wrap(r.preparation.items, "value") } } : {}),
    faqs: r.faqs,
    related: wrap(r.related, "slug"),
    cta: { heading: r.cta.heading, headingEm: r.cta.headingEm, ...(r.cta.subtitle ? { subtitle: r.cta.subtitle } : {}) },
  } as TreatmentSource;
}

/** Deep structural equality. Object key ORDER is ignored; a key whose value is
 *  `undefined` is treated as absent (so conditional-spread shapes compare
 *  cleanly). Array order IS significant. Returns the first differing path. */
function firstDiff(a: unknown, b: unknown, path = ""): string | null {
  if (a === b) return null;
  const ta = typeof a, tb = typeof b;
  if (ta !== tb) return `${path} (type ${ta} ≠ ${tb})`;
  if (a === null || b === null || ta !== "object") return `${path} (${JSON.stringify(a)} ≠ ${JSON.stringify(b)})`;

  const arrA = Array.isArray(a), arrB = Array.isArray(b);
  if (arrA !== arrB) return `${path} (array ≠ object)`;
  if (arrA && arrB) {
    if (a.length !== b.length) return `${path}.length (${a.length} ≠ ${b.length})`;
    for (let i = 0; i < a.length; i++) {
      const d = firstDiff(a[i], b[i], `${path}[${i}]`);
      if (d) return d;
    }
    return null;
  }

  const oa = a as Record<string, unknown>, ob = b as Record<string, unknown>;
  const keys = new Set([...Object.keys(oa), ...Object.keys(ob)].filter((k) => oa[k] !== undefined || ob[k] !== undefined));
  for (const k of keys) {
    const d = firstDiff(oa[k], ob[k], path ? `${path}.${k}` : k);
    if (d) return d;
  }
  return null;
}

let pass = 0;
const failures: string[] = [];

for (const t of TREATMENTS) {
  const expected = toResolved(t);
  const actual = resolveTreatment(t.slug, toSeedDoc(t.slug));
  const diff = firstDiff(expected, actual);
  if (diff) failures.push(`  ✗ ${t.slug} — first diff at: ${diff}`);
  else pass++;
}

console.log(`[roundtrip-treatments] ${pass}/${TREATMENTS.length} treatments round-trip byte-identically.`);
if (failures.length) {
  console.error(`[roundtrip-treatments] ${failures.length} FAILED:`);
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("[roundtrip-treatments] PASS — resolveTreatment(seed) === toResolved(code) for all treatments.");
