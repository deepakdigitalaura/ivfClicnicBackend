/* =====================================================================
 * Seed the remaining code-only doctors into Sanity, generated directly
 * from the DOCTORS array in src/lib/doctors.ts so the content written is
 * byte-identical to what the live site already renders — no hand
 * transcription. Skips deep-gajiwala/suman-singh (already seeded with
 * their own real intake-form data) and only CREATES docs that don't yet
 * exist (createIfNotExists), so it never clobbers an admin edit.
 *
 * Also aligns the navOrder of the two already-seeded doctors to their
 * position in the DOCTORS array, so the header menu order matches the
 * original code order exactly once everyone is in Sanity.
 *
 * Run:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=<id> NEXT_PUBLIC_SANITY_DATASET=production \
 *   SANITY_API_TOKEN=<token> npx tsx --tsconfig tsconfig.json scripts/seed-remaining-doctors.mts
 * ===================================================================== */
import { createClient } from "next-sanity";
import { DOCTORS, defaultDoctorNavRole, defaultDoctorNavOrder } from "@/lib/doctors";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;
if (!projectId || !token) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN required");

const sanity = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token });

const ALREADY_SEEDED = new Set(["deep-gajiwala", "suman-singh"]);

async function main() {
  const toSeed = DOCTORS.filter((d) => !ALREADY_SEEDED.has(d.slug));
  console.log(`Seeding ${toSeed.length} doctors into Sanity (skipping ${[...ALREADY_SEEDED].join(", ")})…`);

  for (const d of toSeed) {
    const doc: Record<string, unknown> = {
      _id: `doctor-${d.slug}`,
      _type: "doctor",
      slug: d.slug,
      name: d.name,
      imageUrl: d.image,
      credentials: d.credentials,
      specialty: d.specialty,
      role: d.role,
      experienceLabel: d.experienceLabel,
      ...(d.experienceYears != null ? { experienceYears: d.experienceYears } : {}),
      cities: d.cities,
      shortBio: d.shortBio,
      bio: d.bio,
      treatments: d.treatments,
      locations: d.locations,
      languages: d.languages,
      knowsAbout: d.knowsAbout,
      alumniOf: d.alumniOf,
      memberOf: d.memberOf,
      awards: d.awards,
      ...(d.training ? { training: d.training } : {}),
      ...(d.publications ? { publications: d.publications } : {}),
      sameAs: d.sameAs,
      verified: d.verified,
      visitsAllCentres: !!d.visitsAllCentres,
      navRole: defaultDoctorNavRole(d.slug),
      navOrder: defaultDoctorNavOrder(d.slug),
    };
    await sanity.createIfNotExists(doc as { _id: string; _type: string });
    console.log(`  ✓ ${d.slug}`);
  }

  console.log("\nAligning navOrder for already-seeded doctors to match code array order…");
  for (const slug of ALREADY_SEEDED) {
    const navOrder = defaultDoctorNavOrder(slug);
    await sanity.patch(`doctor-${slug}`).set({ navOrder }).commit();
    console.log(`  ✓ ${slug} → navOrder ${navOrder}`);
  }

  console.log("\nDone. Revalidating doctor cache…");
  const revalidateUrl = "https://ivfclinic.com/api/revalidate?secret=bfi-revalidate-9x7k2&tags=sanity-doctors";
  try {
    const res = await fetch(revalidateUrl, { method: "POST" });
    console.log(`  revalidate → ${res.status}`);
  } catch (e) {
    console.log(`  revalidate failed (can retry manually): ${e}`);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
