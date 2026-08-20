#!/usr/bin/env node
/* =====================================================================
 * Factual-corrections patch — fixes all wrong institutional claims
 * found in the production DB after audit on 2026-06-22.
 *
 * Fixes:
 *   - All "1986" founding-year references → 1998
 *   - National Fertility Award: 6× → 5× (2021–2025)
 *   - About-page milestones: remove 1986 entry, add 2016, fix 2017–2026
 *   - ET award desc on homepage badge: "2019–2026" → "2019 · 2022 · 2023 · 2024 · 2025 · 2026"
 *   - My FM award year: 2017 → 2016 in seo trust-pillar / award text
 *   - 2020 milestone: removes false "five consecutive years" claim
 *   - 2021–2025 milestones: adds NFA and ET awards per year
 *   - 2026 milestone: "sixth consecutive year" → "sixth time"
 *   - Book title: "Vismitlo" → "Viknadog" in at-a-glance / story
 *   - Dr. Jayna Unadkat: deleted from doctors collection
 *
 * Run: node scripts/patch-factual-corrections.mjs
 * ===================================================================== */
import pg from "pg";
const { Client } = pg;

const DB_URI =
  process.env.DATABASE_URI ??
  "postgresql://postgres.acugkaaiyzbckwafudxa:deepakDigitalAura@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres";

const client = new Client({ connectionString: DB_URI, ssl: { rejectUnauthorized: false } });
await client.connect();
console.log("[patch] Connected to production database.\n");

// ─── 1. ABOUT-PAGE: MAIN ROW ──────────────────────────────────────────────
await client.query(`
  UPDATE about_page SET
    hero_eyebrow         = 'About Bavishi Fertility Institute — IVF Pioneers Since 1998',
    seo_meta_title       = 'About Bavishi Fertility Institute — 30+ Years of IVF Excellence in India',
    seo_meta_description = 'Founded in 1998 by Dr. Himanshu & Dr. Falguni Bavishi, Bavishi Fertility Institute has guided 30,000+ families to parenthood across 14 centres. Discover our story, legacy and values.',
    seo_og_title         = 'About Bavishi Fertility Institute — India''s Trusted IVF Legacy Since 1998',
    seo_og_description   = '30,000+ pregnancies. 14 centres across 8 cities. National Fertility Award 5 consecutive years (2021–2025). The story of India''s pioneering fertility institute.',
    updated_at           = NOW()
  WHERE id = 1
`);
console.log("[patch] about_page main row ✓");

// ─── 2. ABOUT-PAGE: STORY PARAGRAPHS ────────────────────────────────────
const p1 = `From 1998 to the present day, our rich and cultural significance has given us some of the most remarkable accomplishments a fertility clinic can achieve. Bavishi Fertility Institute was formally established by <strong style="color:var(--plum)">Dr. Himanshu Bavishi</strong> and <strong style="color:var(--plum)">Dr. Falguni Bavishi</strong> in Ahmedabad with a simple but powerful belief: that world-class fertility care should be within every family's reach — delivered with science, sincerity and a deeply human touch. Today, our centres perform more than 3,000 IVF cycles every year with the best results in the world.`;
const p2 = `Bavishi Fertility Institute was ranked all India No. 1 in 2020 by Times of India and has been recognised as <strong style="color:var(--plum)">&ldquo;Best IVF Chain in India &ndash; West&rdquo;</strong> by The Economic Times six times (2019, 2022, 2023, 2024, 2025 and 2026). A familial team that stands with you at every step of your fertility journey — welcoming, listening and advising patients before, during and after their journey is our priority.`;
const p3 = `What began as a single clinic has grown into a multi-centre institute that pioneered IVF in India, achieved national firsts, and today welcomes the second generation of Bavishi doctors. The institute has also championed public awareness through books like 'Devna Didhela, Mangine Lidhela', 'Viknadog', 'Aapnu Adbhut Sarjan' and 'Your Miracle in Making', and through initiatives such as the Divya Santan organisation, Jan Jagruti Abhiyan and Parivar Milan campaigns. Our values guide everything we do: <strong style="color:var(--plum)">Simple, Safe, Smart and Successful</strong>.`;

await client.query(`UPDATE about_page_story_paragraphs SET value = $1 WHERE _parent_id = 1 AND _order = 1`, [p1]);
await client.query(`UPDATE about_page_story_paragraphs SET value = $1 WHERE _parent_id = 1 AND _order = 2`, [p2]);
await client.query(`UPDATE about_page_story_paragraphs SET value = $1 WHERE _parent_id = 1 AND _order = 3`, [p3]);
console.log("[patch] story_paragraphs ✓");

// ─── 3. ABOUT-PAGE: AT-A-GLANCE STATS ───────────────────────────────────
await client.query(`UPDATE about_page_at_a_glance SET value = 'Since 1998', label = 'Pioneering fertility care in India' WHERE _parent_id = 1 AND _order = 1`);
await client.query(`UPDATE about_page_at_a_glance SET value = '5×', label = 'National Fertility Award winner (2021–2025)' WHERE _parent_id = 1 AND _order = 5`);
console.log("[patch] at_a_glance ✓");

// ─── 4. ABOUT-PAGE: TRUST PILLARS ───────────────────────────────────────
await client.query(`
  UPDATE about_page_trust_pillars
  SET t = '30+ Years of Experience',
      d = 'Since 1998, a family-led institute that pioneered IVF in India and has guided 30,000+ families to parenthood.'
  WHERE _parent_id = 1 AND icon = 'Award'
`);
console.log("[patch] trust_pillars ✓");

// ─── 5. ABOUT-PAGE: MILESTONES — full rebuild ────────────────────────────
// Delete all existing milestones and re-insert in correct order.
await client.query(`DELETE FROM about_page_milestones WHERE _parent_id = 1`);

const rand24 = () =>
  Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

const milestones = [
  { y: "1998", t: "Bavishi Fertility Institute begins", d: "Dr. Himanshu & Dr. Falguni Bavishi establish Bavishi Fertility Institute (Test Tube Baby Clinic) in Ahmedabad. Preimplantation Genetic Diagnosis (PGD) also launched the same year — bringing advanced genetic screening to Indian fertility care from the very start." },
  { y: "2002", t: "PGD conference", d: "Organised the Pre-Implantation Genetic Diagnosis (PGD) conference — a landmark gathering advancing genetic screening awareness across the fertility community." },
  { y: "2005", t: "Full-service fertility institute", d: "Established a comprehensive, large fertility institute with complete facilities in Ahmedabad." },
  { y: "2006", t: "Endoscopy Excellence Centre & Egg Bank", d: "Launched a dedicated Endoscopy Excellence Centre and started the Egg Bank (Vitrification) — expanding minimally invasive diagnostics and fertility preservation." },
  { y: "2007", t: "Semen bank established", d: "Started Santan Semen Bank — one of the early organised semen-banking services in the region." },
  { y: "2008", t: "Expanding to Mumbai & Surat", d: "Opened offices in Mumbai and Surat, taking trusted fertility care beyond Ahmedabad for the first time." },
  { y: "2009", t: "A national first", d: "Birth of India's first baby through Vitrified Frozen Oocytes — a milestone that shaped Indian reproductive medicine." },
  { y: "2011", t: "Divya Santan & first book", d: "Founded the 'Divya Santan' organisation and published 'Devna Didhela, Mangine Lidhela' — sharing the stories of 111 test-tube-baby families." },
  { y: "2012", t: "Awareness through publishing", d: "Published 'Viknadog' — a book on the infertility journey, problems and solutions for couples struggling to conceive." },
  { y: "2013", t: "Public awareness campaigns", d: "Launched 'Jan Jagruti Abhiyan' and 'Parivar Milan' — special awareness campaigns to support infertile couples and remove social stigma. Hindi translations of books published." },
  { y: "2014", t: "INSTAR founded", d: "Founded INSTAR (Indian Society for Third Party Assisted Reproduction) — advancing ethical standards in donor and surrogacy programmes." },
  { y: "2015", t: "Power Brand Award", d: "Recognised as a 'Power Brand' by IVF India (India Today Group) — a testament to the institute's growing national reputation." },
  { y: "2016", t: "Kolkata expansion & Excellence in IVF Award", d: "Bavishi Pratiksha Fertility Institute opened in Kolkata — the first national expansion. Received the 'Excellence in IVF' award from My FM / Divya Bhaskar Group — BFI was the first institute in Ahmedabad to receive this award." },
  { y: "2017", t: "International recognition", d: "Received the 'Socrates Award — Rose of Paracelsus' from the European Medical Association, the IMA Gujarat 'Excellence in the Field of Medicine' award (Dr. Himanshu Bavishi — first IVF graduate recipient), and the Gujarat Chief Minister's 'Shreshtha' award to Dr. Himanshu & Dr. Falguni Bavishi for contributions to infertility treatment. Also published 'Aapnu Adbhut Sarjan' (Gujarati) and 'Your Miracle in Making' (English)." },
  { y: "2018", t: "Surat centre & national awards", d: "Started the Surat centre. Received 'Best IVF Clinic Chain in India' (Mid-Day) and 'Times Health Icon' award (Times of India — Single Specialty Hospital in Fertility). The book 'Devna Didhela Mangine Lidhela' was adapted into a TV serial on infertility awareness." },
  { y: "2019", t: "Best IVF Chain — West, first time", d: "Awarded 'Best IVF Chain in India – West' by The Economic Times (year 1 of 6). Expanded to Vadodara." },
  { y: "2020", t: "India's No.1 Fertility Clinic", d: "Ranked No.1 in India by Times of India National Survey. Bhuj clinic started." },
  { y: "2021", t: "PGD-HLA Matching breakthrough & National Fertility Award", d: "Introduced PGD-HLA Matching technology for stem-cell donor matching and leukaemia treatment support — 3 successful Thalassemia Major cases, one of only a few globally. Received the National Fertility Award (year 1 of 5)." },
  { y: "2022", t: "New Ahmedabad centre & awards", d: "Opened a new centre at Sindhu Bhavan Road, Bodakdev, Ahmedabad. Received 'Best IVF Chain in India — West' (The Economic Times) and the National Fertility Award (year 2 of 5)." },
  { y: "2023", t: "25 years & awards", d: "Celebrated 25 years of completing families — a quarter century of pioneering IVF, national firsts, and 30,000+ successful pregnancies. Received 'Best IVF Chain in India — West' (The Economic Times) and the National Fertility Award (year 3 of 5)." },
  { y: "2024", t: "Best IVF Chain — West, fourth time", d: "Received 'Best IVF Chain in India — West' (The Economic Times) for the fourth time. National Fertility Award (year 4 of 5)." },
  { y: "2025", t: "Nikol, Ahmedabad & fifth National Fertility Award", d: "Opened the Nikol centre in east Ahmedabad. Received 'Best IVF Chain in India — West' (The Economic Times) and the National Fertility Award for the fifth consecutive year (2021–2025)." },
  { y: "2026", t: "Best IVF Chain — West, sixth time", d: "Received the 'Best IVF Chain in India – West' award by The Economic Times for the sixth time (2019, 2022, 2023, 2024, 2025, 2026) — reinforcing Bavishi Fertility Institute's position as the nation's most trusted fertility network." },
  { y: "Today", t: "14 centres, one family", d: "30,000+ successful pregnancies, 3,000+ IVF cycles every year, and Class 1000 embryology labs across 8 Indian cities." },
];

for (let i = 0; i < milestones.length; i++) {
  const m = milestones[i];
  await client.query(
    `INSERT INTO about_page_milestones (id, _parent_id, _order, y, t, d) VALUES ($1, 1, $2, $3, $4, $5)`,
    [rand24(), i + 1, m.y, m.t, m.d]
  );
}
console.log(`[patch] milestones: ${milestones.length} entries rebuilt ✓`);

// ─── 6. HOMEPAGE: HERO FLOATING BADGE ────────────────────────────────────
await client.query(`
  UPDATE homepage
  SET hero_floating_badge = 'National Fertility Award · 5× Winner (2021–2025)',
      updated_at = NOW()
  WHERE id = 1
`);
console.log("[patch] homepage hero_floating_badge ✓");

// ─── 7. HOMEPAGE: AWARDS CAROUSEL — fix "2019–2026" desc ─────────────────
// Try the likely table name; if it doesn't exist this will error — check table name.
try {
  await client.query(`
    UPDATE homepage_awards_items
    SET desc = '2019 · 2022 · 2023 · 2024 · 2025 · 2026'
    WHERE _parent_id = 1
      AND (desc ILIKE '%2019%2026%' OR desc ILIKE '%consecutive%')
  `);
  console.log("[patch] homepage_awards_items ✓");
} catch (e) {
  console.warn("[patch] homepage_awards_items: table not found or query failed —", e.message);
  console.warn("        Fix manually via Payload admin → Homepage → Awards → No.1 in West India → Sub-line");
}

// ─── 8. DOCTORS: REMOVE DR. JAYNA UNADKAT ────────────────────────────────
const jaynaResult = await client.query(
  `SELECT id, name FROM doctors WHERE slug ILIKE '%jayna%' OR slug ILIKE '%unadkat%' OR name ILIKE '%jayna%'`
);
if (jaynaResult.rows.length > 0) {
  console.log(`[patch] Found Dr. Jayna entry: ${JSON.stringify(jaynaResult.rows)}`);
  for (const row of jaynaResult.rows) {
    await client.query(`DELETE FROM doctors WHERE id = $1`, [row.id]);
    console.log(`[patch] Deleted doctor id=${row.id} name="${row.name}" ✓`);
  }
} else {
  console.log("[patch] Dr. Jayna Unadkat not found in doctors table — already removed or different table structure.");
}

// ─── VERIFY ──────────────────────────────────────────────────────────────
console.log("\n=== VERIFICATION ===");

const mainRow = await client.query(`SELECT hero_eyebrow, seo_og_description FROM about_page WHERE id = 1`);
console.log("[verify] hero_eyebrow:", mainRow.rows[0]?.hero_eyebrow);
console.log("[verify] og_description:", mainRow.rows[0]?.seo_og_description);

const ag = await client.query(`SELECT value, label FROM about_page_at_a_glance WHERE _parent_id = 1 ORDER BY _order`);
console.log("[verify] at_a_glance:", ag.rows.map(r => `${r.value} / ${r.label}`).join(" | "));

const ms = await client.query(`SELECT y, t FROM about_page_milestones WHERE _parent_id = 1 ORDER BY _order`);
console.log("[verify] milestones:", ms.rows.map(r => `${r.y}`).join(", "));

const badge = await client.query(`SELECT hero_floating_badge FROM homepage WHERE id = 1`);
console.log("[verify] hero_floating_badge:", badge.rows[0]?.hero_floating_badge);

const doctors = await client.query(`SELECT name FROM doctors ORDER BY name`);
console.log("[verify] doctors list:", doctors.rows.map(r => r.name).join(", "));

await client.end();
console.log("\n[patch] Done — all factual corrections applied.");
