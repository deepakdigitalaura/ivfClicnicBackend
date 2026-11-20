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
 * Manual run:  node scripts/create-cme-rajkot.mjs [--dry-run]
 * ===================================================================== */
import { createClient } from "next-sanity";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DRY = process.argv.includes("--dry-run");
const log = (...a) => console.log("[create-cme-rajkot]", ...a);

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
    "_id": "blog-bfi-rajkot-obstetrics-gynaecological-society-infertility-conference-2026",
    "_type": "blog",
    "slug": "bfi-rajkot-obstetrics-gynaecological-society-infertility-conference-2026",
    "title": "Bavishi Fertility Institute and the Rajkot Obstetrics & Gynaecological Society Hold a Full-Day Infertility Conference",
    "status": "published",
    "publishedAt": "2026-11-03T06:30:00.000Z",
    "lastUpdatedAt": "2026-11-03T06:30:00.000Z",
    "categorySlug": "cme",
    "categoryTitle": "CME",
    "readMins": 3,
    "excerpt": "Bavishi Fertility Institute and the Rajkot Obstetrics and Gynaecological Society held a full-day conference on infertility and IVF in Rajkot on 1 November 2026, with Dr. Himanshu Bavishi, Dr. Falguni Bavishi and Dr. Parth Bavishi presenting alongside local consultants.",
    "heroImageUrl": "/blog-media/nov-2026/rajkot-cme-group-hero.webp",
    "heroImageAlt": "Faculty and organisers at the Bavishi Fertility Institute and Rajkot Obstetrics and Gynaecological Society infertility conference",
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
      "female-infertility",
      "male-infertility"
    ],
    "locationSlugs": [],
    "faqs": [
      {
        "question": "What was the Rajkot conference about?",
        "answer": "A full-day academic conference on infertility and IVF, organised by Bavishi Fertility Institute with the Rajkot Obstetrics and Gynaecological Society and held in Rajkot on Sunday, 1 November 2026."
      },
      {
        "question": "Who spoke at the conference?",
        "answer": "Fertility and IVF specialists Dr. Himanshu Bavishi, Dr. Falguni Bavishi and Dr. Parth Bavishi from Bavishi Fertility Institute, alongside consultants from Rajkot."
      },
      {
        "question": "Who was the conference for?",
        "answer": "Practising obstetricians and gynaecologists from Rajkot and the surrounding region. It was continuing medical education for clinicians rather than a patient event."
      },
      {
        "question": "When should a couple be referred to a fertility specialist?",
        "answer": "The usual guidance is assessment after a year of trying, or after six months where the female partner is over 35. Earlier referral is appropriate where there is a known condition such as PCOS, endometriosis, previous pelvic surgery or an abnormal semen analysis. Your own doctor decides this with you."
      }
    ],
    "seoMetaTitle": "BFI and Rajkot Obstetrics & Gynaecological Society Hold a Full-Day Infertility Conference",
    "seoMetaDescription": "Bavishi Fertility Institute and the Rajkot Obstetrics and Gynaecological Society held a full-day conference on infertility and IVF in Rajkot on 1 November 2026.",
    "seoOgTitle": "BFI and Rajkot Obstetrics & Gynaecological Society Hold a Full-Day Infertility Conference",
    "seoOgDescription": "Bavishi Fertility Institute and the Rajkot Obstetrics and Gynaecological Society held a full-day conference on infertility and IVF in Rajkot on 1 November 2026.",
    "contentRaw": "{\"root\":{\"type\":\"root\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"type\":\"block\",\"fields\":{\"blockType\":\"statStrip\",\"items\":[{\"value\":\"1 Nov 2026\",\"label\":\"Date (Sunday)\",\"id\":\"80ea9e56eba1\"},{\"value\":\"Rajkot\",\"label\":\"Venue\",\"id\":\"5caffb4dfb3a\"},{\"value\":\"Full day\",\"label\":\"Conference length\",\"id\":\"27fcd789f999\"},{\"value\":\"3\",\"label\":\"BFI faculty speaking\",\"id\":\"3908fe9cfe94\"}],\"id\":\"e30cb11c86de\",\"blockName\":\"\"},\"format\":\"\",\"version\":2},{\"type\":\"block\",\"fields\":{\"blockType\":\"highlightCard\",\"badge\":\"Rajkot Obstetrics & Gynaecological Society — 1 November 2026\",\"icon\":\"Users\",\"color\":\"rose\",\"tagline\":\"A full-day conference on infertility and IVF, organised by Bavishi Fertility Institute together with the Rajkot Obstetrics and Gynaecological Society.\",\"facts\":[{\"label\":\"Organised by\",\"value\":\"BFI with the Rajkot Obstetrics & Gynaecological Society\",\"id\":\"1a2bc46d70f2\"},{\"label\":\"Date\",\"value\":\"Sunday, 1 November 2026\",\"id\":\"7ad8fb66309f\"},{\"label\":\"Venue\",\"value\":\"Rajkot, Gujarat\",\"id\":\"88c3bf16ae90\"},{\"label\":\"BFI faculty\",\"value\":\"Dr. Himanshu Bavishi, Dr. Falguni Bavishi, Dr. Parth Bavishi\",\"id\":\"8ce4df2b9de5\"}],\"bestSuitedFor\":\"Practising obstetricians and gynaecologists in Rajkot and the surrounding region\",\"id\":\"71d00332462f\",\"blockName\":\"\"},\"format\":\"\",\"version\":2},{\"type\":\"paragraph\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"A full-day conference on infertility and IVF was held in Rajkot on \",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1},{\"mode\":\"normal\",\"text\":\"Sunday, 1 November 2026\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":1,\"version\":1},{\"mode\":\"normal\",\"text\":\", organised by Bavishi Fertility Institute together with the Rajkot Obstetrics and Gynaecological Society. The meeting was well attended by practising obstetricians and gynaecologists from Rajkot and the surrounding region.\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\",\"textFormat\":0,\"textStyle\":\"\"},{\"type\":\"paragraph\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"Fertility and IVF specialists \",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1},{\"mode\":\"normal\",\"text\":\"Dr. Himanshu Bavishi\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":1,\"version\":1},{\"mode\":\"normal\",\"text\":\", \",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1},{\"mode\":\"normal\",\"text\":\"Dr. Falguni Bavishi\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":1,\"version\":1},{\"mode\":\"normal\",\"text\":\" and \",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1},{\"mode\":\"normal\",\"text\":\"Dr. Parth Bavishi\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":1,\"version\":1},{\"mode\":\"normal\",\"text\":\" presented alongside consultants from Rajkot, with the day given over to discussion across the range of topics that come up in everyday infertility practice.\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\",\"textFormat\":0,\"textStyle\":\"\"},{\"type\":\"block\",\"fields\":{\"blockType\":\"externalImage\",\"url\":\"/blog-media/nov-2026/rajkot-cme-himanshu-bavishi.webp\",\"alt\":\"Dr. Himanshu Bavishi speaking at the infertility conference in Rajkot, November 2026\",\"caption\":\"Dr. Himanshu Bavishi, Founder & Chief IVF Specialist, Bavishi Fertility Institute.\",\"credit\":\"Photo: Bavishi Fertility Institute\",\"id\":\"83ee471e0c68\",\"blockName\":\"\"},\"format\":\"\",\"version\":2},{\"type\":\"block\",\"fields\":{\"blockType\":\"externalImage\",\"url\":\"/blog-media/nov-2026/rajkot-cme-falguni-bavishi.webp\",\"alt\":\"Dr. Falguni Bavishi speaking at the infertility conference in Rajkot, November 2026\",\"caption\":\"Dr. Falguni Bavishi presenting at the Rajkot conference.\",\"credit\":\"Photo: Bavishi Fertility Institute\",\"id\":\"3fdbaee494aa\",\"blockName\":\"\"},\"format\":\"\",\"version\":2},{\"type\":\"block\",\"fields\":{\"blockType\":\"externalImage\",\"url\":\"/blog-media/nov-2026/rajkot-cme-parth-bavishi.webp\",\"alt\":\"Dr. Parth Bavishi speaking at the infertility conference in Rajkot, November 2026\",\"caption\":\"Dr. Parth Bavishi, Co-director & IVF Specialist, Bavishi Fertility Institute.\",\"credit\":\"Photo: Bavishi Fertility Institute\",\"id\":\"41a84bf38bcb\",\"blockName\":\"\"},\"format\":\"\",\"version\":2},{\"tag\":\"h2\",\"type\":\"heading\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"Why a day with the local society matters\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\"},{\"type\":\"paragraph\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"Most couples with difficulty conceiving see their own gynaecologist first, often for a year or more before a fertility clinic is involved. What happens in that period — which tests are ordered, how the results are read, and when a referral is made — shapes how much time a couple has left when they do arrive.\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\",\"textFormat\":0,\"textStyle\":\"\"},{\"type\":\"paragraph\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"A meeting of this kind exists to narrow the gap between the two settings. Discussing cases in the same room lets the specialists and the referring clinicians compare how they would actually handle a situation, rather than relying on a guideline summary that has no room for the awkward cases.\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\",\"textFormat\":0,\"textStyle\":\"\"},{\"tag\":\"h2\",\"type\":\"heading\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"Themes across the day\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\"},{\"type\":\"list\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"type\":\"listitem\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"Investigating the couple, not the woman: \",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":1,\"version\":1},{\"mode\":\"normal\",\"text\":\"both partners are assessed from the start. A male factor is involved in a large share of cases, and a semen analysis is quick and changes the plan more often than expected.\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\",\"value\":1},{\"type\":\"listitem\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"Reading the common tests: \",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":1,\"version\":1},{\"mode\":\"normal\",\"text\":\"ovarian reserve markers, tubal assessment and semen parameters — what each usefully tells a clinician, and the decisions none of them can settle on its own.\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\",\"value\":2},{\"type\":\"listitem\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"When simpler treatment is right: \",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":1,\"version\":1},{\"mode\":\"normal\",\"text\":\"ovulation induction and IUI suit many couples, and moving to IVF without a proper work-up is as questionable as delaying it for years.\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\",\"value\":3},{\"type\":\"listitem\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"Timing and age: \",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":1,\"version\":1},{\"mode\":\"normal\",\"text\":\"the single factor that changes outcomes most, and the one most often left out of the conversation until late.\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\",\"value\":4}],\"direction\":\"ltr\",\"textFormat\":1,\"listType\":\"bullet\",\"start\":1,\"tag\":\"ul\"},{\"tag\":\"h2\",\"type\":\"heading\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"Referral and timing\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\"},{\"type\":\"paragraph\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"A recurring theme was the point at which a couple is referred on. The usual guidance — assessment after a year of trying, or six months where the female partner is over 35 — is well known, but it is applied unevenly in practice, and the cost of waiting falls almost entirely on the couple.\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\",\"textFormat\":0,\"textStyle\":\"\"},{\"type\":\"paragraph\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"Where a cause is identified early, the options are wider and simpler. Conditions such as \",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1},{\"type\":\"link\",\"version\":1,\"format\":\"\",\"indent\":0,\"direction\":\"ltr\",\"fields\":{\"url\":\"/treatments/pcos\",\"newTab\":false,\"linkType\":\"custom\"},\"children\":[{\"mode\":\"normal\",\"text\":\"PCOS\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}]},{\"mode\":\"normal\",\"text\":\", \",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1},{\"type\":\"link\",\"version\":1,\"format\":\"\",\"indent\":0,\"direction\":\"ltr\",\"fields\":{\"url\":\"/treatments/endometriosis\",\"newTab\":false,\"linkType\":\"custom\"},\"children\":[{\"mode\":\"normal\",\"text\":\"endometriosis\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}]},{\"mode\":\"normal\",\"text\":\" and \",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1},{\"type\":\"link\",\"version\":1,\"format\":\"\",\"indent\":0,\"direction\":\"ltr\",\"fields\":{\"url\":\"/treatments/male-infertility\",\"newTab\":false,\"linkType\":\"custom\"},\"children\":[{\"mode\":\"normal\",\"text\":\"male-factor infertility\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}]},{\"mode\":\"normal\",\"text\":\" all respond differently depending on how long they have gone unaddressed, which is why the referral conversation matters as much as the treatment one.\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\",\"textFormat\":0,\"textStyle\":\"\"},{\"type\":\"block\",\"fields\":{\"blockType\":\"externalImage\",\"url\":\"/blog-media/nov-2026/rajkot-cme-group.webp\",\"alt\":\"Faculty and organisers at the infertility conference held with the Rajkot Obstetrics and Gynaecological Society\",\"caption\":\"Faculty and organisers of the Rajkot Obstetrics and Gynaecological Society conference, 1 November 2026.\",\"credit\":\"Photo: Bavishi Fertility Institute\",\"id\":\"538d837523f6\",\"blockName\":\"\"},\"format\":\"\",\"version\":2},{\"tag\":\"h2\",\"type\":\"heading\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"Continuing education as routine practice\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\"},{\"type\":\"paragraph\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"Academic meetings of this kind are a routine part of professional practice in reproductive medicine, and BFI clinicians take part in them through the year — at society conferences, hospital CME programmes and joint sessions with local associations. The value is in the exchange rather than the presentation: protocols vary between centres more than published evidence explains, and sessions like this are how that variation narrows.\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\",\"textFormat\":0,\"textStyle\":\"\"},{\"type\":\"block\",\"fields\":{\"blockType\":\"conclusionPanel\",\"headline\":\"In Short\",\"points\":[{\"icon\":\"Sparkles\",\"text\":\"A full-day infertility and IVF conference was held in Rajkot on Sunday, 1 November 2026, organised by Bavishi Fertility Institute with the Rajkot Obstetrics and Gynaecological Society.\",\"id\":\"73270dfac15e\"},{\"icon\":\"Sparkles\",\"text\":\"Dr. Himanshu Bavishi, Dr. Falguni Bavishi and Dr. Parth Bavishi presented alongside consultants from Rajkot.\",\"id\":\"2324a3299cfa\"},{\"icon\":\"Sparkles\",\"text\":\"Discussion covered assessing both partners, reading the common tests, when simpler treatment is appropriate, and the timing of referral.\",\"id\":\"9e9570080eca\"},{\"icon\":\"Sparkles\",\"text\":\"This was an academic meeting for practising clinicians, not patient-facing treatment advice.\",\"id\":\"d47156844d0c\"}],\"id\":\"4d2d174e49f3\",\"blockName\":\"\"},\"format\":\"\",\"version\":2},{\"type\":\"paragraph\",\"format\":\"\",\"indent\":0,\"version\":1,\"children\":[{\"mode\":\"normal\",\"text\":\"If you have questions about your own fertility or test results, those are best discussed with a specialist who has your full history. You can read more about \",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1},{\"type\":\"link\",\"version\":1,\"format\":\"\",\"indent\":0,\"direction\":\"ltr\",\"fields\":{\"url\":\"/treatments/ivf\",\"newTab\":false,\"linkType\":\"custom\"},\"children\":[{\"mode\":\"normal\",\"text\":\"IVF treatment\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}]},{\"mode\":\"normal\",\"text\":\" or about how \",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1},{\"type\":\"link\",\"version\":1,\"format\":\"\",\"indent\":0,\"direction\":\"ltr\",\"fields\":{\"url\":\"/treatments/female-infertility\",\"newTab\":false,\"linkType\":\"custom\"},\"children\":[{\"mode\":\"normal\",\"text\":\"female infertility\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}]},{\"mode\":\"normal\",\"text\":\" is investigated at Bavishi Fertility Institute.\",\"type\":\"text\",\"style\":\"\",\"detail\":0,\"format\":0,\"version\":1}],\"direction\":\"ltr\",\"textFormat\":0,\"textStyle\":\"\"},{\"type\":\"block\",\"fields\":{\"blockType\":\"inlineCta\",\"accent\":\"rose\",\"headline\":\"Questions about your fertility treatment?\",\"subtext\":\"Speak to a fertility specialist at Bavishi Fertility Institute — 14 centres across India.\",\"buttons\":[{\"label\":\"Book a Consultation\",\"url\":\"https://ivfclinic.com/contact\",\"variant\":\"primary\",\"id\":\"f89962257fae\"},{\"label\":\"IVF Treatment at BFI\",\"url\":\"https://ivfclinic.com/treatments/ivf\",\"variant\":\"secondary\",\"id\":\"364130c2fc69\"}],\"id\":\"9e8eaf5642df\",\"blockName\":\"\"},\"format\":\"\",\"version\":2}],\"direction\":\"ltr\"}}"
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

    // Revision switch: bump lastUpdatedAt in this file to push a corrected body
    // live. Otherwise leave the document alone, so an edit made in the admin
    // panel survives the next deploy.
    if (existing.lastUpdatedAt !== doc.lastUpdatedAt) {
      await client.createOrReplace(doc);
      log(`${doc.slug} -> rewritten (revision bumped)`);
    } else {
      log(`${doc.slug} -> already current, left alone`);
    }
  }
}

main().catch((e) => {
  console.error("[create-cme-rajkot]", e);
  process.exit(1);
});
