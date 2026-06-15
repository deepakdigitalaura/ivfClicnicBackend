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

/** The 4 senior promoter doctors — shown as feature cards in the header panel. */
const SENIOR_SLUGS = ["himanshu-bavishi", "falguni-bavishi", "parth-bavishi", "janki-bavishi"];

/** Assign navRole + navOrder so the header/footer menus are built from the DB. */
const getNavFields = (slug: string, indexAmongSpecialists: number) => {
  const seniorIdx = SENIOR_SLUGS.indexOf(slug);
  if (seniorIdx !== -1) {
    return { navRole: "senior-specialist", navOrder: (seniorIdx + 1) * 10 };
  }
  return { navRole: "specialist", navOrder: (indexAmongSpecialists + 1) * 10 };
};

let specialistCounter = 0;
const docs = DOCTORS.map((d) => {
  const isSenior = SENIOR_SLUGS.includes(d.slug);
  const navFields = getNavFields(d.slug, isSenior ? 0 : specialistCounter);
  if (!isSenior) specialistCounter++;
  return {
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
    ...navFields,
    _status: "published",
  };
});

const out = join(__dirname, "doctors.json");
writeFileSync(out, JSON.stringify(docs, null, 2) + "\n", "utf8");
console.log(`[gen-doctors] wrote ${docs.length} doctors → ${out}`);
