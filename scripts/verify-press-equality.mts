/* =====================================================================
 * One-off equality check: confirms every seeded `press` Sanity doc
 * deep-equals its corresponding entry in PRESS_CLIPPINGS (src/lib/press.ts).
 * Run before flipping the frontend to Sanity — must print ALL CLEAN.
 *
 * Run: npx tsx --env-file=.env.local --tsconfig tsconfig.json \
 *   scripts/verify-press-equality.mts
 * ===================================================================== */
import { createClient } from "next-sanity";
import { PRESS_CLIPPINGS } from "../src/lib/press";

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

type Doc = {
  slug: string; headline: string; headlineOriginal?: string | null; standfirst?: string | null;
  publication: string; edition?: string | null; date?: string | null; byline?: string | null;
  language: string; summary: string; bodyText: string[]; doctorsQuoted: string[];
  image: string; thumb: string; width: number; height: number;
};

async function main() {
  const docs = await sanity.fetch<Doc[]>(
    `*[_type == "press"]{ "slug": slug.current, headline, headlineOriginal, standfirst, publication, edition, date, byline, language, summary, bodyText, doctorsQuoted, image, thumb, width, height }`,
  );

  let allGood = true;
  for (const c of PRESS_CLIPPINGS) {
    const d = docs.find((x) => x.slug === c.slug);
    if (!d) { console.log(`❌ ${c.slug}: MISSING from Sanity`); allGood = false; continue; }

    const checks: [string, unknown, unknown][] = [
      ["headline", d.headline, c.headline],
      ["headlineOriginal", d.headlineOriginal ?? undefined, c.headlineOriginal],
      ["standfirst", d.standfirst ?? undefined, c.standfirst],
      ["publication", d.publication, c.publication],
      ["edition", d.edition ?? undefined, c.edition],
      ["date", d.date ?? undefined, c.date],
      ["byline", d.byline ?? undefined, c.byline],
      ["language", d.language, c.language],
      ["summary", d.summary, c.summary],
      ["bodyText", d.bodyText.join("\n"), c.bodyText.join("\n")],
      ["doctorsQuoted", d.doctorsQuoted.join(","), c.doctorsQuoted.join(",")],
      ["image", d.image, c.image],
      ["thumb", d.thumb, c.thumb],
      ["width", d.width, c.width],
      ["height", d.height, c.height],
    ];
    const mismatches = checks.filter(([, a, b]) => JSON.stringify(a) !== JSON.stringify(b));
    if (mismatches.length) {
      allGood = false;
      console.log(`❌ ${c.slug}: MISMATCH`);
      for (const [field, a, b] of mismatches) {
        console.log(`   ${field}: sanity=${JSON.stringify(a)} !== code=${JSON.stringify(b)}`);
      }
    } else {
      console.log(`✅ ${c.slug}: OK`);
    }
  }

  console.log(allGood ? "\n✅ ALL CLEAN — safe to flip the frontend" : "\n❌ ISSUES FOUND — do not flip yet");
  process.exit(allGood ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });
