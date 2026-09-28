/* =====================================================================
 * One-time migration: copy every code-only Treatment / Maternity Service /
 * Doctor into Sanity as a real document, using the same materialize*Source()
 * helpers the admin "Override" button already uses one at a time. Produces
 * byte-identical live content (DB now wins over the code fallback for these
 * slugs) so resolveTreatment/resolveService/resolveDoctor render the same
 * page — this only changes the source of truth, not what's on screen.
 *
 * Run:
 *   npx tsx --env-file=.env.local --tsconfig tsconfig.json \
 *     scripts/migrate-builtins-to-db.mts [--dry-run]
 * ===================================================================== */
import { createClient } from "next-sanity";
import { TREATMENTS } from "../src/lib/treatments";
import { materializeTreatmentSource } from "../src/lib/treatment-content";
import { SERVICE_CONTENT } from "../src/lib/womens-health";
import { materializeServiceSource } from "../src/lib/services";
import { DOCTORS } from "../src/lib/doctors";
import { materializeDoctorSource } from "../src/lib/doctors";

const DRY = process.argv.includes("--dry-run");
const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN!,
});

const unwrap = (arr?: { value?: string }[]): string[] => (arr ?? []).map((x) => x.value ?? "").filter(Boolean);

async function migrateTreatments() {
  const existing: { slug: string }[] = await sanity.fetch(`*[_type == "treatment"]{slug}`);
  const existingSlugs = new Set(existing.map((d) => d.slug));
  const missing = TREATMENTS.filter((t) => !existingSlugs.has(t.slug));
  console.log(`Treatments: ${existing.length} already in DB, ${missing.length} to migrate.`);
  for (const t of missing) {
    const full = materializeTreatmentSource(t.slug, null) as Record<string, unknown>;
    const doc = {
      _id: `treatment-${t.slug}`,
      _type: "treatment",
      slug: t.slug,
      href: full.href,
      navCategory: undefined,
      navOrder: 0,
      hero: full.hero,
      meta: full.meta,
      whatIs: full.whatIs,
      benefits: full.benefits,
      whoNeedsIt: full.whoNeedsIt,
      process: full.process,
      risks: full.risks,
      faqs: full.faqs,
      cta: full.cta,
    };
    console.log(`  + ${t.slug}`);
    if (!DRY) await sanity.createIfNotExists(doc);
  }
}

async function migrateServices() {
  const existing: { slug: string }[] = await sanity.fetch(`*[_type == "service"]{slug}`);
  const existingSlugs = new Set(existing.map((d) => d.slug));
  const missing = Object.values(SERVICE_CONTENT).filter((s) => !existingSlugs.has(s.slug));
  console.log(`Services: ${existing.length} already in DB, ${missing.length} to migrate.`);
  for (const s of missing) {
    const full = materializeServiceSource(s.slug, null) as Record<string, unknown>;
    const doc = {
      _id: `service-${s.slug}`,
      _type: "service",
      slug: s.slug,
      hero: full.hero,
      seo: full.seo,
      overview: full.overview,
      benefits: full.benefits,
      whoFor: full.whoFor,
      process: full.process,
      whyUs: full.whyUs,
      faqs: full.faqs,
    };
    console.log(`  + ${s.slug}`);
    if (!DRY) await sanity.createIfNotExists(doc);
  }
}

async function migrateDoctors() {
  const existing: { slug: string }[] = await sanity.fetch(`*[_type == "doctor"]{slug}`);
  const existingSlugs = new Set(existing.map((d) => d.slug));
  const missing = DOCTORS.filter((d) => !existingSlugs.has(d.slug));
  console.log(`Doctors: ${existing.length} already in DB, ${missing.length} to migrate.`);
  for (const d of missing) {
    const full = materializeDoctorSource(d.slug, null) as Record<string, unknown>;
    const doc = {
      _id: `doctor-${d.slug}`,
      _type: "doctor",
      slug: d.slug,
      name: full.name,
      credentials: full.credentials,
      specialty: full.specialty,
      role: full.role,
      imageUrl: full.image,
      experienceLabel: full.experienceLabel,
      experienceYears: full.experienceYears,
      cities: unwrap(full.cities as { value?: string }[]),
      shortBio: full.shortBio,
      bio: unwrap(full.bio as { value?: string }[]),
      treatments: unwrap(full.treatments as { value?: string }[]),
      locations: unwrap(full.locations as { value?: string }[]),
      languages: unwrap(full.languages as { value?: string }[]),
      knowsAbout: unwrap(full.knowsAbout as { value?: string }[]),
      alumniOf: unwrap(full.alumniOf as { value?: string }[]),
      memberOf: unwrap(full.memberOf as { value?: string }[]),
      awards: unwrap(full.awards as { value?: string }[]),
      training: unwrap(full.training as { value?: string }[]),
      publications: unwrap(full.publications as { value?: string }[]),
      sameAs: unwrap(full.sameAs as { value?: string }[]),
      verified: full.verified,
      visitsAllCentres: full.visitsAllCentres,
      navRole: full.navRole ?? undefined,
      navOrder: full.navOrder ?? 0,
    };
    console.log(`  + ${d.slug}`);
    if (!DRY) await sanity.createIfNotExists(doc);
  }
}

async function main() {
  if (DRY) console.log("--- DRY RUN: no writes will be made ---\n");
  await migrateTreatments();
  await migrateServices();
  await migrateDoctors();
  console.log(DRY ? "\nDry run complete." : "\nMigration complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
