/* =====================================================================
 * Generate the Doctors seed fixture FROM the code defaults — so the seeded
 * CMS is byte-identical to the pre-CMS content with zero hand-transcription.
 * Emits scripts/seed/doctors.json (array of `doctors` doc bodies whose shape
 * mirrors src/collections/Doctors.ts — every string array wrapped as { value }).
 * Re-run whenever the defaults change:  npm run seed:doctors:gen
 * ===================================================================== */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { DOCTORS } from "@/lib/doctors";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Wrap a string[] into the collection's array-of-{ value } shape. */
const wrap = (arr: string[] | undefined) => (arr ?? []).map((value) => ({ value }));

const docs = DOCTORS.map((d) => ({
  slug: d.slug,
  name: d.name,
  credentials: d.credentials,
  specialty: d.specialty,
  role: d.role,
  image: d.image,
  experienceLabel: d.experienceLabel,
  ...(d.experienceYears != null ? { experienceYears: d.experienceYears } : {}),
  medicalSpecialty: wrap(d.medicalSpecialty),
  cities: wrap(d.cities),
  locations: wrap(d.locations),
  treatments: wrap(d.treatments),
  shortBio: d.shortBio,
  bio: wrap(d.bio),
  knowsAbout: wrap(d.knowsAbout),
  alumniOf: wrap(d.alumniOf),
  memberOf: wrap(d.memberOf),
  awards: wrap(d.awards),
  training: wrap(d.training),
  publications: wrap(d.publications),
  languages: wrap(d.languages),
  sameAs: wrap(d.sameAs),
  verified: d.verified,
  visitsAllCentres: !!d.visitsAllCentres,
  _status: "published",
}));

const out = join(__dirname, "doctors.json");
writeFileSync(out, JSON.stringify(docs, null, 2) + "\n", "utf8");
console.log(`[gen-doctors] wrote ${docs.length} doctors → ${out}`);
