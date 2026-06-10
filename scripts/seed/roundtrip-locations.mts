/* =====================================================================
 * Locations round-trip parity gate (Wave 4.5, Phase B; required before any
 * route migration). Proves the CMS round-trips the location content losslessly:
 *
 *     resolveCity(slug, seededDoc)             === cityToResolved(cityBySlug(slug))
 *     resolveCentre(citySlug, slug, seededDoc) === centreToResolved(centreBySlug(...))
 *
 * for EVERY city in CITIES and centre in CENTRES. `seededDoc` is the exact doc
 * body the seed pipeline writes (built here in-memory from the same gen
 * transform), so this validates the gen↔resolve inverse relationship
 * deterministically with NO database.
 *
 * NOTE: the resolver is CODE-AUTHORITATIVE for Class-A fields, so parity holds
 * by construction for them; this gate's real assurance is over the Class-B
 * editorial fields (gen wrapping ↔ resolver unwrapping) plus the optional-field
 * present/absent semantics.
 *
 * Run:  npm run seed:locations:roundtrip
 * Exits non-zero (and prints the first differing path) on any mismatch.
 * ===================================================================== */
import { CITIES, CENTRES, type City, type Centre } from "@/lib/locations";
import {
  cityToResolved,
  centreToResolved,
  resolveCity,
  resolveCentre,
  type CitySource,
  type CentreSource,
} from "@/lib/location-content";

/** Mirror of gen-locations.mts: serialise into the doc body the seed writes. */
const wrap = (arr: string[], key: string) => arr.map((v) => ({ [key]: v }));

function toCitySeedDoc(c: City): CitySource {
  const r = cityToResolved(c);
  return {
    slug: r.slug,
    name: r.name,
    region: r.region,
    country: r.country,
    helpline: r.helpline,
    helplineLabel: r.helplineLabel,
    whatsapp: r.whatsapp,
    heroImage: r.heroImage,
    ...(r.hero360Url ? { hero360Url: r.hero360Url } : {}),
    intro: wrap(r.intro, "value"),
    faqs: r.faqs,
    ...(r.womensHealth ? { womensHealth: wrap(r.womensHealth, "value") } : {}),
    built: r.built,
  } as CitySource;
}

function toCentreSeedDoc(c: Centre): CentreSource {
  const r = centreToResolved(c);
  return {
    slug: r.slug,
    citySlug: r.citySlug,
    name: r.name,
    fullName: r.fullName,
    ...(r.isHeadOffice ? { isHeadOffice: r.isHeadOffice } : {}),
    area: r.area,
    address: r.address,
    pin: r.pin,
    phone: r.phone,
    phoneLabel: r.phoneLabel,
    hours: r.hours,
    opening: {
      opens: r.opening.opens,
      closes: r.opening.closes,
      ...(r.opening.days ? { days: wrap(r.opening.days, "value") } : {}),
    },
    ...(r.geo ? { geo: { lat: r.geo.lat, lng: r.geo.lng } } : {}),
    mapQuery: r.mapQuery,
    image: r.image,
    ...(r.hero360Url ? { hero360Url: r.hero360Url } : {}),
    nearby: wrap(r.nearby, "value"),
    landmarks: wrap(r.landmarks, "value"),
    howToReach: wrap(r.howToReach, "value"),
    facilities: wrap(r.facilities, "value"),
    doctors: wrap(r.doctors, "value"),
    treatments: wrap(r.treatments, "value"),
    intro: r.intro,
    faqs: r.faqs,
    gallery: r.gallery,
    sameAs: wrap(r.sameAs ?? [], "value"),
    ...(r.womensHealth ? { womensHealth: wrap(r.womensHealth, "value") } : {}),
    ...(r.reviewsKey ? { reviewsKey: r.reviewsKey } : {}),
    built: r.built,
  } as CentreSource;
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

for (const c of CITIES) {
  const expected = cityToResolved(c);
  const actual = resolveCity(c.slug, toCitySeedDoc(c));
  const diff = firstDiff(expected, actual);
  if (diff) failures.push(`  ✗ city/${c.slug} — first diff at: ${diff}`);
  else pass++;
}

for (const c of CENTRES) {
  const expected = centreToResolved(c);
  const actual = resolveCentre(c.citySlug, c.slug, toCentreSeedDoc(c));
  const diff = firstDiff(expected, actual);
  if (diff) failures.push(`  ✗ centre/${c.citySlug}/${c.slug} — first diff at: ${diff}`);
  else pass++;
}

const total = CITIES.length + CENTRES.length;
console.log(`[roundtrip-locations] ${pass}/${total} docs (${CITIES.length} cities + ${CENTRES.length} centres) round-trip byte-identically.`);
if (failures.length) {
  console.error(`[roundtrip-locations] ${failures.length} FAILED:`);
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("[roundtrip-locations] PASS — resolve(seed) === toResolved(code) for all cities and centres.");
