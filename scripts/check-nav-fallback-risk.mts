/* Read-only Phase 1 verification for BFI-Sanity-Fallback-Merge-Fix-Prompt.md.
 * Checks whether the header/footer nav all-or-nothing gap (getNavTreatments /
 * getNavLocations sourcing ONLY from Sanity, no code fallback) is already
 * silently dropping items from production nav today, or is still dormant. */
import { createClient } from "next-sanity";

const s = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const totalTreatments = await s.fetch<number>('count(*[_type=="treatment"])');
const withNavCategory = await s.fetch<number>('count(*[_type=="treatment" && defined(navCategory) && navCategory != ""])');
const missingNavCategory = await s.fetch<{ slug: string; navCategory: string | null }[]>(
  '*[_type=="treatment" && !defined(navCategory)]{ slug, navCategory } | order(slug asc)',
);

const totalCities = await s.fetch<number>('count(*[_type=="city"])');
const publishedCities = await s.fetch<number>('count(*[_type=="city" && built != false])');
const allCitySlugs = await s.fetch<{ slug: string; built: boolean | null }[]>(
  '*[_type=="city"]{ slug, built } | order(slug asc)',
);

const totalCentres = await s.fetch<number>('count(*[_type=="centre"])');
const publishedCentres = await s.fetch<number>('count(*[_type=="centre" && built != false])');
const centresMissingOrUnpublished = await s.fetch<{ slug: string; citySlug: string; built: boolean | null }[]>(
  '*[_type=="centre" && built == false]{ slug, citySlug, built } | order(citySlug asc)',
);

console.log("=== Treatments (code registry has 34) ===");
console.log("total in Sanity:", totalTreatments);
console.log("with navCategory set:", withNavCategory);
console.log("MISSING navCategory (would vanish from IVF Treatments / Maternity Services nav menus):", missingNavCategory.length);
if (missingNavCategory.length) console.log(JSON.stringify(missingNavCategory, null, 2));

console.log("\n=== Cities (code registry has 8) ===");
console.log("total in Sanity:", totalCities);
console.log("published (built != false):", publishedCities);
console.log("all city docs:", JSON.stringify(allCitySlugs, null, 2));

console.log("\n=== Centres ===");
console.log("total in Sanity:", totalCentres);
console.log("published (built != false):", publishedCentres);
console.log("unpublished (built === false, would vanish from Locations nav):", centresMissingOrUnpublished.length);
if (centresMissingOrUnpublished.length) console.log(JSON.stringify(centresMissingOrUnpublished, null, 2));
