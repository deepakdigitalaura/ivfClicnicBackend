/* =====================================================================
 * One-time update: Dr. Priyanka Sinha → Sanity
 * Uses the doctor's own intake form (July 2026) — the data now lives in
 * the DOCTORS array in src/lib/doctors.ts, and this script writes that
 * exact entry to Sanity so code defaults and CMS stay byte-identical.
 * Idempotent — createOrReplace with the deterministic _id.
 *
 * Run:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=<id> NEXT_PUBLIC_SANITY_DATASET=production \
 *   SANITY_API_TOKEN=<token> npx tsx --tsconfig tsconfig.json scripts/update-doctor-priyanka.mts
 * ===================================================================== */
import { createClient } from "next-sanity";
import { DOCTORS, defaultDoctorNavRole, defaultDoctorNavOrder } from "@/lib/doctors";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;
if (!projectId || !token) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN required");

const sanity = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token });

const SLUG = "priyanka-sinha";

async function main() {
  const d = DOCTORS.find((doc) => doc.slug === SLUG);
  if (!d) throw new Error(`${SLUG} not found in DOCTORS array`);

  const doc = {
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

  console.log("Updating Dr. Priyanka Sinha…");
  await sanity.createOrReplace(doc);
  console.log(`  ✓ doctor-${SLUG} written`);

  console.log("\nDone. Revalidating doctor cache…");
  const revalidateSecret = process.env.REVALIDATE_SECRET;
  if (!revalidateSecret) {
    console.log("  REVALIDATE_SECRET not set — skip (revalidate manually or save any doctor in /admin-panel)");
    return;
  }
  const revalidateUrl = `https://ivf-clicnic-backend-weld.vercel.app/api/revalidate?secret=${revalidateSecret}&tags=sanity-doctors`;
  try {
    const res = await fetch(revalidateUrl, { method: "POST" });
    console.log(`  revalidate → ${res.status}`);
  } catch (e) {
    console.log(`  revalidate failed (can retry manually): ${e}`);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
