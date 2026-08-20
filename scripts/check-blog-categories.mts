/* =====================================================================
 * Regression guard for blog category mis-tagging (see
 * scripts/fix-blog-category-mismatches.mts for the incident this guards
 * against). Flags any published blog where:
 *   - categoryTitle is empty/"Uncategorized", or
 *   - the title contains a strong topic keyword that doesn't match the
 *     assigned category's expected keyword set.
 *
 * Advisory only — prints a report, does not write anything. Run manually
 * after a bulk import/enrichment pass, e.g.:
 *   npx tsx --tsconfig tsconfig.json scripts/check-blog-categories.mts
 * ===================================================================== */
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;
if (!projectId || !token) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN required");

const sanity = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token });

type Post = { pgId: number | null; title: string; slug: string; categoryTitle: string | null };

// Keyword -> categories it's compatible with. A title hit on a keyword whose
// category set doesn't include the post's stored category is flagged.
const KEYWORD_RULES: { keyword: RegExp; categories: string[] }[] = [
  { keyword: /\bsperm\b|\bsemen\b|varicocele|azoospermia|oligospermia|asthenospermia|teratozoospermia|necrozoospermia|hypospermia|\bdfi\b|dna fragmentation|male infertility|male factor/i, categories: ["Male Infertility", "IVF", "ICSI"] },
  { keyword: /postpartum|\bdelivery\b|trimester|\blabou?r\b|newborn|c-section|cesarean|breastfeed|nutrition during pregnancy|high risk pregnancy|multiple pregnancy/i, categories: ["Maternity"] },
  { keyword: /\bpcos\b|polycystic/i, categories: ["PCOS"] },
  { keyword: /\bfibroid/i, categories: ["Fibroid"] },
  { keyword: /\biui\b/i, categories: ["IUI"] },
  { keyword: /\bicsi\b/i, categories: ["ICSI", "Male Infertility"] },
  { keyword: /\bpgt\b|genetic testing/i, categories: ["PGT"] },
  { keyword: /\blow amh\b|amh level/i, categories: ["Low AMH", "Ovarian Reserve"] },
  { keyword: /egg freez|embryo freez|sperm freez|cryopreserv/i, categories: ["Freezing"] },
  { keyword: /egg donat|donor egg/i, categories: ["Egg Donation"] },
];

function flag(post: Post): string | null {
  const category = post.categoryTitle ?? "Uncategorized";
  if (category === "Uncategorized") return "no category assigned";
  for (const rule of KEYWORD_RULES) {
    if (rule.keyword.test(post.title) && !rule.categories.includes(category)) {
      return `title matches ${rule.keyword} but category is "${category}" (expected one of: ${rule.categories.join(", ")})`;
    }
  }
  return null;
}

async function main() {
  const posts = await sanity.fetch<Post[]>(
    `*[_type == "blog" && status != "draft"]{ pgId, title, slug, categoryTitle } | order(pgId asc)`,
  );
  const flagged = posts
    .map((p) => ({ p, reason: flag(p) }))
    .filter((x): x is { p: Post; reason: string } => x.reason !== null);

  console.log(`Checked ${posts.length} published posts. ${flagged.length} flagged for review.\n`);
  for (const { p, reason } of flagged) {
    console.log(`- [${p.pgId}] ${p.slug}\n    ${reason}`);
  }
  if (flagged.length) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
