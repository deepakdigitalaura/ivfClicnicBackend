#!/usr/bin/env node
/**
 * Apply a hand-curated patient_name (+ quote where needed) for every
 * testimonial_videos row that still showed a generic/broken placeholder
 * ("BFI Patient", "IVF", "for", leftover episode-series titles, etc).
 *
 * Each entry below was derived by reading the REAL YouTube title for that
 * video (Gujarati/Hindi included) — see scripts/testimonials-review.json
 * for the full dump this was built from. Rows not listed here already had
 * a correct, specific name and are left untouched.
 *
 * Run: node scripts/patch-curate-testimonials.mjs
 */
import pg from "pg";

const { Client } = pg;

const DB_URI =
  process.env.DATABASE_URI ??
  "postgresql://postgres.acugkaaiyzbckwafudxa:deepakDigitalAura@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres";

const EPISODE_QUOTE =
  "A true story of struggle and triumph on the path to parenthood, shared in our patient stories series.";
const YEARS_QUOTE = (n) =>
  `After ${n} years of marriage, this family found success with IVF at Bavishi Fertility Institute.`;

/** youtube_id -> { name?, quote? } — only fields present are updated. */
const OVERRIDES = {
  hcrTlAG07c8: { name: "Dr. Vipul & Dr. Vaibhavi" },
  "SbkV-1fSonM": { name: "Jigesh & Jinal" },
  Ko_1GCx0kwE: { name: "Shilled Oza" },
  llJJm3TmbCA: { name: "Rushi & Siddhi" },
  "6bH_RnV-_2Y": { name: "Anita Thakkar" },
  KKf6tNrlvoc: { name: "Rekha" },
  ApUvVhP1F2s: { name: "Acharya Family" },
  Stic7iwuvlU: { name: "Manguben Chaudhary" },
  EY98PyumZ1U: { name: "Gondaliya Family" },
  n2z95eV60jE: { name: "Bhargav Patel" },
  mq46CnngGyY: { name: "Dr. Rugvi" },
  "274_mV_xnfs": { name: "Vivekanand & Bandna" },
  lN42_g7G00s: { name: "Chirali & Ritesh" },
  uYbQaV6VEd4: { name: "Priya Mohod" },
  v2oy6QZjQvs: { name: "Madhvika & Pranay" },
  XGYK6MZD3ak: { name: "Dipali Doshi" },
  Fa8ZzqH0n_s: { name: "Vriddhi Shah" },
  z31XQVZfO3s: { name: "Rajendra Devda" },
  yNKg1p38lOY: { name: "Dr. Mayank & Dr. Prakruti" },
  "-jM7ly3AOFI": { name: "Bindiya & Mehul Mervana" },
  uRPM2WHhjIE: { name: "Pankti Dave" },
  "0gT3g_ZPvQc": { name: "Chirag & Brinda" },
  N7_towuWWjY: {
    name: "Megha & Aakash",
    quote: "Megha and Aakash's dream of parenthood came true at Bavishi Fertility Institute.",
  },
  R0uaWxFsquc: {
    name: "Sharadaben & Jitubhai",
    quote: "After 35 years of marriage, Bavishi Fertility Institute helped Sharadaben and Jitubhai welcome their child.",
  },
  GXKSH_W3v6E: {
    name: "Nila & Vishnu",
    quote: "After 16 years of marriage, Bavishi Fertility Institute gave Nila and Vishnu the joy of parenthood.",
  },
  IK1sZLDAito: {
    name: "Naina & Deepak",
    quote: "After 20 years of hope, Bavishi Fertility Institute helped Naina and Deepak become parents.",
  },
  uAqg2DUaRyY: {
    name: "Egg Freezing Awareness",
    quote: "Even while building your career, egg freezing can help you achieve motherhood on your own timeline.",
  },
  EdxW_0MOiOM: {
    name: "Sheetal & Pranav",
    quote: "After 22 IVF cycles, Bavishi Fertility Institute finally blessed Sheetal and Pranav with parenthood.",
  },
  "842QDkSLXD4": {
    name: "Egg Freezing Awareness",
    quote: "Building a career doesn't mean giving up on motherhood — egg freezing keeps that dream possible.",
  },
  kt9GROuYlGA: {
    name: "Bhikhiben & Babubhai",
    quote: "In just one IVF cycle, Bhikhiben and Babubhai experienced the joy of parenthood at Bavishi Fertility Institute.",
  },
  "5jlLhlqoqGo": {
    name: "IVF Cost Guide",
    quote: "An honest look at what a fair IVF treatment cycle should cost in Ahmedabad.",
  },
  YvOYFm5GPmA: {
    name: "IVF Cost Guide",
    quote: "Understanding what counts as a reasonable cost for an IVF treatment cycle.",
  },
  h25xJbR65kQ: { name: "23 Years to Success", quote: YEARS_QUOTE(23) },
  "8eietbeNbfw": {
    name: "IVF Q&A",
    quote: "Honest answers to common questions and concerns about IVF side effects.",
  },
  ZfUz2hK3JMk: {
    name: "Disha & Mitul",
    quote: "Disha and Mitul found success at Bavishi Fertility Institute after their fertility journey.",
  },
  ZvTrpBdQpik: {
    name: "Aasha & Vishal",
    quote: "Aasha and Vishal found success at Bavishi Fertility Institute after their fertility journey.",
  },
  oCZ0JkKBJmA: {
    name: "IVF Success Tips",
    quote: "Simple, practical tips to help maximize your chances of IVF success.",
  },
  "ugoz-3OnR3M": { name: "Chirali & Ritesh Shah" },
  uqaJOoKZLAk: { name: "12 Years of Hope" },
  WEt1_WuoINM: {
    name: "8 Years to Triplets",
    quote: "After 8 years of marriage, this family welcomed triplets in a single successful IVF cycle at Bavishi Fertility Institute.",
  },
  HOv7NYmP13w: { name: "BFI Patient" },
  J0wtgJYVYfQ: { name: "BFI Patient" },
  OeW6OTdwrQo: { name: "Mayank Patel" },
  "OMgQwSBj-8A": { name: "Kamal Vandra" },
  FpohcDMyc3M: { name: "Megha Patel" },
  "2_rKrBmiPJA": { quote: "Our IVF journey at Bavishi Fertility Institute blessed us with a baby boy." },

  // "દેવના દીધેલા માગીને લીધેલા" patient-stories series — unify by episode number
  Nin53vofIIQ: { name: "True Story — Episode 26", quote: EPISODE_QUOTE },
  "8UMLy_yFlQ8": { name: "True Story — Episode 25", quote: EPISODE_QUOTE },
  YuyDY8vJxlw: { name: "True Story — Episode 24", quote: EPISODE_QUOTE },
  uFHp3GYuaKE: { name: "True Story — Episode 23", quote: EPISODE_QUOTE },
  TXqDm3jGK9w: { name: "True Story — Episode 22", quote: EPISODE_QUOTE },
  Oa1wi2dmI9U: { name: "True Story — Episode 21", quote: EPISODE_QUOTE },
  rkmJHlf5myc: { name: "True Story — Episode 20", quote: EPISODE_QUOTE },
  KvE6PeYRL68: { name: "True Story — Episode 19", quote: EPISODE_QUOTE },
  "-k8ur4dmrbE": { name: "True Story — Episode 18", quote: EPISODE_QUOTE },
  vjpc4lLvnt8: { name: "True Story — Episode 17", quote: EPISODE_QUOTE },
  zBtb86IPaH8: { name: "True Story — Episode 16 (Part 2)", quote: EPISODE_QUOTE },
  CwqJJ8EoxpU: { name: "True Story — Episode 15 (Part 1)", quote: EPISODE_QUOTE },
  vgw0s6Vz_WU: { name: "True Story — Episode 14", quote: EPISODE_QUOTE },
  hwyKJITCgFk: { name: "True Story — Episode 13", quote: EPISODE_QUOTE },
  e7dYx1Lg96I: { name: "True Story — Episode 12", quote: EPISODE_QUOTE },
  epeD4FMj52w: { name: "True Story — Episode 11", quote: EPISODE_QUOTE },
  a_jMimXquMs: { name: "True Story — Episode 10", quote: EPISODE_QUOTE },
  "7MPhnbEztlE": { name: "True Story — Episode 9", quote: EPISODE_QUOTE },
  "9dNfzSvBmx0": { name: "True Story — Episode 8", quote: EPISODE_QUOTE },
  "8M6ieor3Cz0": { name: "True Story — Episode 7", quote: EPISODE_QUOTE },
  "OpjKLK3m--4": { name: "True Story — Episode 6", quote: EPISODE_QUOTE },
  tQkygsrdQqo: { name: "True Story — Episode 5", quote: EPISODE_QUOTE },
  "IjmT08Ugw-g": { name: "True Story — Episode 4", quote: EPISODE_QUOTE },
  "5JtRcctsqz0": { name: "True Story — Episode 3", quote: EPISODE_QUOTE },
  "O4MS-DOdLPc": { name: "True Story — Episode 2", quote: EPISODE_QUOTE },
  "_gO-OlmoTmI": { name: "True Story — Episode 1", quote: EPISODE_QUOTE },

  DzeTsUKbp5E: { name: "13 Years to Success", quote: YEARS_QUOTE(13) },
  ybPkHTfbPT4: { name: "17 Years to Success", quote: YEARS_QUOTE(17) },
  DCWuox7cZ6Q: {
    name: "Success in Their First Cycle",
    quote: "After 7 years of marriage, this family found success in their very first IVF cycle at Bavishi Fertility Institute.",
  },
  "hX-a-GBztoI": { name: "9 Years to Success", quote: YEARS_QUOTE(9) },
  ISj61VpkTlc: { name: "12 Years to Success", quote: YEARS_QUOTE(12) },
  uF3EDMrBqRs: { name: "24 Years to Success", quote: YEARS_QUOTE(24) },
  tXr2cXJqHIo: { name: "13 Years to Success", quote: YEARS_QUOTE(13) },
  dHtLelAWOs4: { name: "7 Years to Success", quote: YEARS_QUOTE(7) },
  "4uwvc0XSoJY": { name: "8 Years to Success", quote: YEARS_QUOTE(8) },
  "3LBzRw2k9YI": { name: "22 Years to Success", quote: YEARS_QUOTE(22) },
  gJL3Vn9SpOc: { name: "7 Years to Success", quote: YEARS_QUOTE(7) },
  ALf0Re3vBW4: { name: "14 Years to Success", quote: YEARS_QUOTE(14) },
  APCGoUqrZwI: {
    name: "Lokesh & Poonam",
    quote: "Lokesh and Poonam found success with IVF at Bavishi Fertility Institute after years of waiting.",
  },
  tKRxaWyibgI: { name: "4 Years to Success", quote: YEARS_QUOTE(4) },
  uwh7xVeLKTE: { name: "10 Years to Success", quote: YEARS_QUOTE(10) },
  "0vO4G8l6fr8": { name: "11 Years to Success", quote: YEARS_QUOTE(11) },
  p5FeRgiTcNA: { name: "25 Years to Success", quote: YEARS_QUOTE(25) },
  "8h_sFhuDRGc": { name: "22 Years to Success", quote: YEARS_QUOTE(22) },
  "8mkMqZTtC74": {
    name: "Pranavbhai & Sheetalben",
    quote: "Pranavbhai and Sheetalben found success with IVF at Bavishi Fertility Institute.",
  },
  "zO91KruM-m0": { name: "Bhavna Mishra" },
  wA91XZ15CZI: { name: "Chetan Bhai (Ahmedabad)" },
  Kq5tVsR66Io: { quote: "Words cannot express how grateful we are to the BFI team for changing our lives." },
  xHqTCirHpyM: { name: "Dr. Naren Hajari" },
  s8pMxnlipK8: { name: "Family of Mr. Prafulchandra" },
  "O3H-VGdqmls": { name: "Mr. Prafulchandra" },
  AvAT2koY31k: { name: "Lata Rajesh Maru" },
};

async function main() {
  const client = new Client({ connectionString: DB_URI, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log("Connected to production DB.\n");

  const { rows } = await client.query(
    `SELECT id, youtube_id, patient_name, quote FROM testimonial_videos`
  );
  const byYoutubeId = new Map(rows.map((r) => [r.youtube_id, r]));

  let updated = 0;
  let missing = 0;

  for (const [youtubeId, patch] of Object.entries(OVERRIDES)) {
    const row = byYoutubeId.get(youtubeId);
    if (!row) {
      console.log(`[MISSING] ${youtubeId} not found in DB`);
      missing++;
      continue;
    }

    const newName = patch.name ?? row.patient_name;
    const newQuote = patch.quote ?? row.quote;

    if (newName === row.patient_name && newQuote === row.quote) continue;

    console.log(`[UPDATE] ${youtubeId}`);
    if (newName !== row.patient_name) console.log(`  name : "${row.patient_name}" -> "${newName}"`);
    if (newQuote !== row.quote) console.log(`  quote: "${row.quote.slice(0, 40)}" -> "${newQuote.slice(0, 40)}"`);

    await client.query(
      `UPDATE testimonial_videos SET patient_name = $1, quote = $2, updated_at = NOW() WHERE id = $3`,
      [newName, newQuote, row.id]
    );
    updated++;
  }

  console.log(`\nDone. ${updated} rows updated, ${missing} youtube_ids not found.`);
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
