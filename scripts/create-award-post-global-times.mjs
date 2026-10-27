#!/usr/bin/env node
/* =====================================================================
 * Tag blog articles with the centre city they relate to.
 *
 * Setting locationSlugs on a blog makes the article template render a link
 * to that city's page -- so this adds internal links to the location pages
 * without editing a single sentence of anyone's prose.
 *
 * WHY THIS WAS NEEDED
 *   Eleven of the location pages were linked only from the footer. Of 307
 *   published articles, just 20 carried a location tag, and five cities had
 *   none at all. Location pages earn 147 visits a month between them, with
 *   most of them on zero.
 *
 * HOW EACH PAIRING WAS CHOSEN
 *   1. the city is named in the article title or slug   (strongest)
 *   2. the city is named in the article body
 *   3. the article is about treatment cost, success rates, choosing a clinic
 *      or a core treatment that every centre offers -- used only to bring a
 *      city up to five, and only for articles that already earn traffic
 *
 *   An article whose title names one city is never tagged with another, so
 *   "choosing a clinic in Ahmedabad" cannot end up pointing at Varanasi.
 *   No article carries more than three cities; no city gets more than eight.
 *
 * The full reasoning, pairing by pairing, is in
 * October 2026/location-tagging-plan.csv.
 *
 * SAFE TO RE-RUN
 *   Tags are merged into whatever is already on the document, never replaced,
 *   and a document already carrying the tag is left untouched. Nothing else
 *   on the blog is written.
 *
 * Manual run:  node scripts/create-award-post.mjs [--dry-run]
 * ===================================================================== */
import { createClient } from "next-sanity";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DRY = process.argv.includes("--dry-run");
const log = (...a) => console.log("[create-award-post]", ...a);

function loadEnvLocal() {
  const envPath = join(ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  try {
    for (const raw of readFileSync(envPath, "utf8").split("\n")) {
      const m = /^([A-Z0-9_]+)=(.*)$/.exec(raw.trim());
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch { /* ignore */ }
}
loadEnvLocal();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

const DOCS = [
  {
    "_id": "blog-bavishi-fertility-institute-mumbai-global-times-award-2026",
    "_type": "blog",
    "slug": "bavishi-fertility-institute-mumbai-global-times-award-2026",
    "title": "Bavishi Fertility Institute, Mumbai Honoured at the Global Times Awards 2026",
    "status": "published",
    "publishedAt": "2026-10-26T06:30:00.000Z",
    "lastUpdatedAt": "2026-10-27T14:30:00.000Z",
    "categorySlug": "cme",
    "categoryTitle": "CME",
    "readMins": 2,
    "excerpt": "Bavishi Fertility Institute's Mumbai centre was presented an award for excellence and leadership in healthcare at the Global Times Awards ceremony in Mumbai on 24 October 2026.",
    "heroImageUrl": "/blog-media/oct-2026/global-times-award-mumbai-hero.webp",
    "heroImageAlt": "Bavishi Fertility Institute receiving its award at the Global Times Awards 2026 ceremony in Mumbai",
    "heroImagePosition": "center center",
    "heroTextDark": false,
    "authorName": "Dr. Himanshu Bavishi",
    "authorSlug": "himanshu-bavishi",
    "authorRole": "Founder & Chief IVF Specialist",
    "authorCredentials": "MBBS, MD (Obstetrics & Gynaecology)",
    "authorAvatarUrl": "/assets/doctors/himanshu.webp",
    "authorBioText": "Dr. Himanshu Bavishi is the Director of Bavishi Fertility Institute (BFI). He achieved India's first IVF twin birth using vitrified frozen oocytes and successfully delivered three thalassaemia-major-free children for an at-risk couple using PGT-M. He is the author of 'A Practical Guide to Intrauterine Insemination' and Founder President of BSTAR (Indian Society for Third-Party Assisted Reproductive Techniques).",
    "treatmentSlugs": [
      "ivf",
      "iui",
      "icsi"
    ],
    "locationSlugs": [
      "mumbai"
    ],
    "faqs": [],
    "seoMetaTitle": "Bavishi Fertility Institute, Mumbai Honoured at the Global Times Awards 2026",
    "seoMetaDescription": "Bavishi Fertility Institute's Mumbai centre was presented an award for excellence and leadership in healthcare at the Global Times Awards ceremony in Mumbai on 24 October 2026.",
    "seoOgTitle": "Bavishi Fertility Institute, Mumbai Honoured at the Global Times Awards 2026",
    "seoOgDescription": "Bavishi Fertility Institute's Mumbai centre was presented an award for excellence and leadership in healthcare at the Global Times Awards ceremony in Mumbai on 24 October 2026.",
    "contentRaw": "{\"root\":{\"type\":\"root\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"type\":\"block\",\"fields\":{\"blockType\":\"statStrip\",\"items\":[{\"value\":\"24 Oct 2026\",\"label\":\"Date of the ceremony\",\"id\":\"d69c12d1c218\"},{\"value\":\"Mumbai\",\"label\":\"Where it was presented\",\"id\":\"d1231fbb0746\"},{\"value\":\"Global Times\",\"label\":\"Awarding body\",\"id\":\"95deba1bdf49\"},{\"value\":\"Healthcare\",\"label\":\"Award category\",\"id\":\"ff1686c4553a\"}],\"id\":\"dbe3906fd0f1\",\"blockName\":\"\"},\"format\":\"\",\"version\":2},{\"type\":\"block\",\"fields\":{\"blockType\":\"highlightCard\",\"badge\":\"Global Times Awards 2026 — Healthcare\",\"icon\":\"Award\",\"color\":\"gold\",\"tagline\":\"Bavishi Fertility Institute, Mumbai was presented an award at the Global Times Awards ceremony held in Mumbai on 24 October 2026.\",\"facts\":[{\"label\":\"Presented to\",\"value\":\"Bavishi Fertility Institute — Mumbai\",\"id\":\"c03187ee86c2\"},{\"label\":\"Awarded by\",\"value\":\"Global Times Awards\",\"id\":\"c4ab194c90b4\"},{\"label\":\"Citation\",\"value\":\"For Excellence & Leadership in Healthcare\",\"id\":\"582df762983a\"},{\"label\":\"Date\",\"value\":\"24 October 2026\",\"id\":\"ca0569d7e966\"}],\"bestSuitedFor\":\"Recognition of the Mumbai centre's clinical and support teams\",\"id\":\"e43ec10467a4\",\"blockName\":\"\"},\"format\":\"\",\"version\":2},{\"type\":\"paragraph\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"Bavishi Fertility Institute’s Mumbai centre was recognised at the \",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1},{\"mode\":\"normal\",\"text\":\"Global Times Awards 2026\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":1,\"version\":1},{\"mode\":\"normal\",\"text\":\", presented at a ceremony in Mumbai on 24 October 2026. The citation on the trophy reads \",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1},{\"mode\":\"normal\",\"text\":\"“For Excellence & Leadership Healthcare — Most Trusted Fertility & IVF Clinic in Mumbai”\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":2,\"version\":1},{\"mode\":\"normal\",\"text\":\", which is the awarding body’s own wording for the category.\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\",\"textFormat\":0,\"textStyle\":\"\"},{\"type\":\"block\",\"fields\":{\"blockType\":\"externalImage\",\"url\":\"/blog-media/oct-2026/global-times-award-mumbai.webp\",\"alt\":\"The award being presented to Bavishi Fertility Institute at the Global Times Awards 2026 in Mumbai, alongside the trophy and its citation plaque\",\"caption\":\"The award being received at the Global Times Awards ceremony, Mumbai, 24 October 2026, and the citation on the trophy.\",\"credit\":\"Photos: Bavishi Fertility Institute\",\"id\":\"1078215c278f\",\"blockName\":\"\"},\"format\":\"\",\"version\":2},{\"tag\":\"h2\",\"type\":\"heading\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"What the award recognises\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\"},{\"type\":\"paragraph\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"Awards of this kind are decided by the organising body against its own criteria, and this one sits in its healthcare category. For a fertility centre the practical meaning is narrower than the title suggests: it reflects how a clinic is regarded for the consistency of its care and the way it works with the couples who come to it — not a measure of treatment outcomes, which no award can assess.\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\",\"textFormat\":0,\"textStyle\":\"\"},{\"type\":\"paragraph\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"That distinction matters to anyone reading this while deciding where to seek treatment. An award is one signal among several, and it is worth far less than the questions you ask in a consultation: what your own diagnosis is, what the realistic options are, and what a cycle would involve for you specifically.\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\",\"textFormat\":0,\"textStyle\":\"\"},{\"tag\":\"h2\",\"type\":\"heading\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"The Mumbai centre\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\"},{\"type\":\"paragraph\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"Bavishi Fertility Institute has run fertility services in Mumbai as part of a group of centres across India. The Mumbai team offers the full range of treatments — \",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1},{\"type\":\"link\",\"version\":1,\"format\":\"\",\"indent\":0,\"direction\":\"ltr\",\"fields\":{\"url\":\"/treatments/ivf\",\"newTab\":false,\"linkType\":\"custom\"},\"children\":[{\"mode\":\"normal\",\"text\":\"IVF\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}]},{\"mode\":\"normal\",\"text\":\", \",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1},{\"type\":\"link\",\"version\":1,\"format\":\"\",\"indent\":0,\"direction\":\"ltr\",\"fields\":{\"url\":\"/treatments/iui\",\"newTab\":false,\"linkType\":\"custom\"},\"children\":[{\"mode\":\"normal\",\"text\":\"IUI\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}]},{\"mode\":\"normal\",\"text\":\", \",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1},{\"type\":\"link\",\"version\":1,\"format\":\"\",\"indent\":0,\"direction\":\"ltr\",\"fields\":{\"url\":\"/treatments/icsi\",\"newTab\":false,\"linkType\":\"custom\"},\"children\":[{\"mode\":\"normal\",\"text\":\"ICSI\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}]},{\"mode\":\"normal\",\"text\":\" and investigations for both \",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1},{\"type\":\"link\",\"version\":1,\"format\":\"\",\"indent\":0,\"direction\":\"ltr\",\"fields\":{\"url\":\"/treatments/female-infertility\",\"newTab\":false,\"linkType\":\"custom\"},\"children\":[{\"mode\":\"normal\",\"text\":\"female\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}]},{\"mode\":\"normal\",\"text\":\" and \",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1},{\"type\":\"link\",\"version\":1,\"format\":\"\",\"indent\":0,\"direction\":\"ltr\",\"fields\":{\"url\":\"/treatments/male-infertility\",\"newTab\":false,\"linkType\":\"custom\"},\"children\":[{\"mode\":\"normal\",\"text\":\"male infertility\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}]},{\"mode\":\"normal\",\"text\":\" — with the same protocols used across the group.\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\",\"textFormat\":0,\"textStyle\":\"\"},{\"type\":\"list\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"type\":\"listitem\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"Both partners assessed: \",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":1,\"version\":1},{\"mode\":\"normal\",\"text\":\"a work-up covers the female and male side from the start, because a male factor is involved in a large share of cases.\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\",\"value\":1},{\"type\":\"listitem\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"One protocol across centres: \",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":1,\"version\":1},{\"mode\":\"normal\",\"text\":\"a couple moving between BFI centres is treated to the same standards rather than starting again.\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\",\"value\":2},{\"type\":\"listitem\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"Counselling alongside treatment: \",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":1,\"version\":1},{\"mode\":\"normal\",\"text\":\"the emotional load of fertility treatment is part of what the team is there for, not an afterthought.\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\",\"value\":3}],\"direction\":\"ltr\",\"textFormat\":1,\"listType\":\"bullet\",\"start\":1,\"tag\":\"ul\"},{\"type\":\"block\",\"fields\":{\"blockType\":\"conclusionPanel\",\"headline\":\"In Short\",\"points\":[{\"icon\":\"Sparkles\",\"text\":\"Bavishi Fertility Institute, Mumbai was presented an award at the Global Times Awards ceremony in Mumbai on 24 October 2026.\",\"id\":\"3d83564340f4\"},{\"icon\":\"Sparkles\",\"text\":\"The citation, in the organisers' words, is “For Excellence & Leadership Healthcare — Most Trusted Fertility & IVF Clinic in Mumbai”.\",\"id\":\"4301b14f71cf\"},{\"icon\":\"Sparkles\",\"text\":\"An award reflects reputation and consistency of care. It is not a measure of treatment outcomes, and no clinic can promise those.\",\"id\":\"87f75242eb89\"},{\"icon\":\"Sparkles\",\"text\":\"The team thanks the doctors, embryologists, nurses and support staff at the Mumbai centre, and the couples who placed their trust in it.\",\"id\":\"4a880fec6c53\"}],\"id\":\"0f8999afa8d4\",\"blockName\":\"\"},\"format\":\"\",\"version\":2},{\"type\":\"paragraph\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"If you are considering fertility treatment, the useful next step is a consultation where your own history and test results are reviewed — not a comparison of awards. You can read more about the \",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1},{\"type\":\"link\",\"version\":1,\"format\":\"\",\"indent\":0,\"direction\":\"ltr\",\"fields\":{\"url\":\"/locations/mumbai\",\"newTab\":false,\"linkType\":\"custom\"},\"children\":[{\"mode\":\"normal\",\"text\":\"Mumbai centre\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}]},{\"mode\":\"normal\",\"text\":\" or about how \",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1},{\"type\":\"link\",\"version\":1,\"format\":\"\",\"indent\":0,\"direction\":\"ltr\",\"fields\":{\"url\":\"/treatments/ivf\",\"newTab\":false,\"linkType\":\"custom\"},\"children\":[{\"mode\":\"normal\",\"text\":\"IVF treatment\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}]},{\"mode\":\"normal\",\"text\":\" works at Bavishi Fertility Institute.\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\",\"textFormat\":0,\"textStyle\":\"\"},{\"type\":\"block\",\"fields\":{\"blockType\":\"inlineCta\",\"accent\":\"rose\",\"headline\":\"Considering fertility treatment in Mumbai?\",\"subtext\":\"Book a consultation with the team at Bavishi Fertility Institute, Mumbai.\",\"buttons\":[{\"label\":\"Book a Consultation\",\"url\":\"https://ivfclinic.com/contact\",\"variant\":\"primary\",\"id\":\"be918360a4aa\"},{\"label\":\"Our Mumbai Centre\",\"url\":\"https://ivfclinic.com/locations/mumbai\",\"variant\":\"secondary\",\"id\":\"9475644452a1\"}],\"id\":\"5cde6bc90ac0\",\"blockName\":\"\"},\"format\":\"\",\"version\":2}],\"direction\":\"ltr\"}}"
  }
];

const nodeCount = (raw) => {
  try {
    return JSON.parse(raw).root.children.length;
  } catch {
    return 0;
  }
};

async function main() {
  for (const doc of DOCS) {
    log(`${doc.slug} - ${nodeCount(doc.contentRaw)} nodes, category ${doc.categorySlug}`);
  }

  if (DRY) {
    log(`[dry-run] ${DOCS.length} post prepared, nothing written.`);
    return;
  }

  if (!projectId || !token) {
    log("no Sanity write token here - skipping (expected outside deploy).");
    return;
  }

  const client = createClient({
    projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token,
  });

  for (const doc of DOCS) {
    const existing = await client.fetch(
      `*[_id == $id][0]{ lastUpdatedAt }`,
      { id: doc._id },
    );

    if (!existing) {
      await client.createOrReplace(doc);
      log(`${doc.slug} -> seeded`);
      continue;
    }

    // Revision switch, same as the October seeding script: bump lastUpdatedAt
    // in this file to push a corrected body live. Otherwise leave the document
    // alone, so an edit made in the admin panel survives the next deploy.
    if (existing.lastUpdatedAt !== doc.lastUpdatedAt) {
      await client.createOrReplace(doc);
      log(`${doc.slug} -> rewritten (revision bumped)`);
    } else {
      log(`${doc.slug} -> already current, left alone`);
    }
  }
}

main().catch((e) => {
  console.error("[create-award-post]", e);
  process.exit(1);
});
