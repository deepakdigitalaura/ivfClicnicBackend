/* =====================================================================
 * About-BFI round-trip parity gate (Wave 4.5, Phase E). Proves the CMS round-
 * trips the About content losslessly:
 *
 *     resolveAbout(seededDoc) === ABOUT_DEFAULTS
 *
 * `seededDoc` is the exact doc body the seed pipeline writes (built here in-
 * memory from the same gen transform as scripts/seed/gen-about.mts), so this
 * validates the gen↔resolve inverse relationship deterministically with NO
 * database.
 *
 * Run:  npm run seed:about:roundtrip
 * Exits non-zero (and prints the first differing path) on any mismatch.
 * ===================================================================== */
import { ABOUT_DEFAULTS, resolveAbout, type AboutSource } from "@/lib/about";

/** Mirror of gen-about.mts: serialise ABOUT_DEFAULTS into the doc body the seed
 *  writes. The seo.ogImage upload relation is omitted (resolver carries the
 *  default string), matching the seed fixture. */
function toAboutSeedDoc(): AboutSource {
  const d = ABOUT_DEFAULTS;
  return {
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
  } as AboutSource;
}

/** Deep structural equality. Object key ORDER is ignored; a key whose value is
 *  `undefined` is treated as absent. Array order IS significant. Returns the
 *  first differing path. */
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
      const diff = firstDiff(a[i], b[i], `${path}[${i}]`);
      if (diff) return diff;
    }
    return null;
  }

  const oa = a as Record<string, unknown>, ob = b as Record<string, unknown>;
  const keys = new Set([...Object.keys(oa), ...Object.keys(ob)].filter((k) => oa[k] !== undefined || ob[k] !== undefined));
  for (const k of keys) {
    const diff = firstDiff(oa[k], ob[k], path ? `${path}.${k}` : k);
    if (diff) return diff;
  }
  return null;
}

const expected = ABOUT_DEFAULTS;
const actual = resolveAbout(toAboutSeedDoc());
const diff = firstDiff(expected, actual);

if (diff) {
  console.error(`[roundtrip-about] 0/1 — FAILED. First diff at: ${diff}`);
  process.exit(1);
}
console.log("[roundtrip-about] 1/1 — PASS — resolveAbout(seed) === ABOUT_DEFAULTS.");
