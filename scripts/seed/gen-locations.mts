/* =====================================================================
 * Generate the Cities + Centres seed fixtures FROM the code defaults — so the
 * seeded CMS is byte-identical to the pre-CMS content with zero hand-
 * transcription. Emits scripts/seed/cities.json + scripts/seed/centres.json
 * (arrays of doc bodies whose shape mirrors src/collections/Cities.ts and
 * src/collections/Centres.ts). Built from cityToResolved()/centreToResolved()
 * (the same canonical serializers the round-trip parity gate compares against),
 * so resolveCity(slug, seedDoc) === cityToResolved(cityBySlug(slug)) and
 * resolveCentre(citySlug, slug, seedDoc) === centreToResolved(centreBySlug(...)).
 *
 * Class-A fields (citySlug, isHeadOffice, geo, opening, doctors[], treatments[],
 * womensHealth[], reviewsKey, built) are serialised for editor visibility +
 * roundtrip parity; the resolver ignores them at render (code-authoritative).
 *
 * Re-run whenever the defaults change:  npm run seed:locations:gen
 * ===================================================================== */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { CITIES, CENTRES } from "@/lib/locations";
import { cityToResolved, centreToResolved } from "@/lib/location-content";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Wrap a string[] into a single-key array-of-object shape, e.g. { value }. */
const wrap = (arr: string[], key: string) => arr.map((v) => ({ [key]: v }));

const cityDocs = CITIES.map((src) => {
  const r = cityToResolved(src);
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
    _status: "published",
  };
});

const centreDocs = CENTRES.map((src) => {
  const r = centreToResolved(src);
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
    _status: "published",
  };
});

const cityOut = join(__dirname, "cities.json");
const centreOut = join(__dirname, "centres.json");
writeFileSync(cityOut, JSON.stringify(cityDocs, null, 2) + "\n", "utf8");
writeFileSync(centreOut, JSON.stringify(centreDocs, null, 2) + "\n", "utf8");
console.log(`[gen-locations] wrote ${cityDocs.length} cities → ${cityOut}`);
console.log(`[gen-locations] wrote ${centreDocs.length} centres → ${centreOut}`);
