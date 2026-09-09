#!/usr/bin/env node
/* =====================================================================
 * Patch about-page global in production DB with enriched content from
 * old ivfclinic.com website. Run: node scripts/patch-about-content.mjs
 * ===================================================================== */
import pg from "pg";
const { Client } = pg;

const DB_URI =
  process.env.DATABASE_URI ??
  "postgresql://postgres.acugkaaiyzbckwafudxa:deepakDigitalAura@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres";

const client = new Client({ connectionString: DB_URI, ssl: { rejectUnauthorized: false } });
await client.connect();
console.log("[patch] Connected to production database.\n");

// ─── 1. MAIN about_page ROW ───────────────────────────────────────────────
await client.query(`UPDATE about_page SET
  hero_eyebrow       = 'About Bavishi Fertility Institute — IVF Pioneers Since 1986',
  hero_paragraph     = 'Founded and led by the well-known experts of the Bavishi family — Dr. Himanshu Bavishi & Dr. Falguni Bavishi — all Bavishi Fertility Institute clinics offer meticulous attention of the highest order in a pleasant and avant-garde environment to make your treatment Simple, Safe, Smart and Successful.',
  seo_meta_title     = 'About Bavishi Fertility Institute — IVF Pioneers Since 1986',
  seo_meta_description = 'Founded in 1986, led by Dr. Himanshu & Dr. Falguni Bavishi, Bavishi Fertility Institute has guided 30,000+ families to parenthood across 14 centres. Ranked All India No.1 — discover our story, legacy and values.',
  seo_og_title       = 'About Bavishi Fertility Institute — India''s Trusted IVF Legacy Since 1986',
  seo_og_description = '30,000+ pregnancies. 14 centres across 8 cities. National Fertility Award 6 years running. IVF Pioneers Since 1986 — the story of India''s pioneering fertility institute.',
  updated_at         = NOW()
WHERE id = 1`);
console.log("[patch] about_page main row ✓");

// ─── 2. STORY PARAGRAPHS ─────────────────────────────────────────────────
const p1 = `From 1986 to the present day, our rich and cultural significance has given us some of the most remarkable accomplishments a fertility clinic can achieve. Bavishi Fertility Institute was formally established by <strong style="color:var(--plum)">Dr. Himanshu Bavishi</strong> and <strong style="color:var(--plum)">Dr. Falguni Bavishi</strong> in Ahmedabad with a simple but powerful belief: that world-class fertility care should be within every family's reach — delivered with science, sincerity and a deeply human touch. Today, our centres perform more than 3,000 IVF cycles every year with the best results in the world.`;
const p2 = `Bavishi Fertility Institute was ranked all India No. 1 in 2020 & ranked <strong style="color:var(--plum)">&ldquo;Number one in western India&rdquo;</strong> for the fifth time in a row in Times of India, a national survey of fertility clinics (2016, 2017, 2018, 2019, 2020). A familial team that stands with you at every step of your fertility journey — welcoming, listening and advising patients before, during and after their journey is our priority.`;
const p3 = `What began as a single clinic has grown into a multi-centre institute that pioneered IVF in India, achieved national firsts, and today welcomes the second generation of Bavishi doctors. The institute has also championed public awareness through books like 'Devna Didhela, Mangine Lidhela', 'Vismitlo', 'Aapnu Adbhut Sarjan' and 'Your Miracle in Making', and through initiatives such as the Divya Santan organisation, Jan Jagruti Abhiyan and Parivar Milan campaigns. Our values guide everything we do: <strong style="color:var(--plum)">Simple, Safe, Smart and Successful</strong>.`;

await client.query(`UPDATE about_page_story_paragraphs SET value = $1 WHERE _parent_id = 1 AND _order = 1`, [p1]);
await client.query(`UPDATE about_page_story_paragraphs SET value = $1 WHERE _parent_id = 1 AND _order = 2`, [p2]);
await client.query(`UPDATE about_page_story_paragraphs SET value = $1 WHERE _parent_id = 1 AND _order = 3`, [p3]);
console.log("[patch] story_paragraphs ✓");

// ─── 3. AT-A-GLANCE STATS ────────────────────────────────────────────────
await client.query(`UPDATE about_page_at_a_glance SET value = 'Since 1986', label = 'Pioneering fertility care in India' WHERE _parent_id = 1 AND _order = 1`);
await client.query(`UPDATE about_page_at_a_glance SET value = '6×', label = 'National Fertility Award winner' WHERE _parent_id = 1 AND _order = 5`);
console.log("[patch] at_a_glance stats ✓");

// ─── 4. MILESTONES — fix 1990 → 1986 ─────────────────────────────────────
await client.query(
  `UPDATE about_page_milestones SET y = '1986', d = 'Establishment of a fertility practice in Ahmedabad — the seed of what would become one of India''s most trusted fertility networks and the beginning of ''IVF Pioneers Since 1986''.' WHERE _parent_id = 1 AND y = '1990'`
);
// Add 2026 milestone if missing
const m2026 = await client.query(`SELECT id FROM about_page_milestones WHERE _parent_id = 1 AND y = '2026'`);
if (m2026.rows.length === 0) {
  const maxOrd = await client.query(`SELECT MAX(_order) AS mo FROM about_page_milestones WHERE _parent_id = 1`);
  const nextOrd = (maxOrd.rows[0].mo || 0) + 1;
  const maxId = await client.query(`SELECT MAX(id) AS mi FROM about_page_milestones`);
  const nextId = (maxId.rows[0].mi || 0) + 1;
  await client.query(
    `INSERT INTO about_page_milestones (id, _parent_id, _order, y, t, d) VALUES ($1, 1, $2, $3, $4, $5)`,
    [nextId, nextOrd, "2026", "National Fertility Award — 6th time", "Received the 'Best IVF Chain in India – West' award by The Economic Times for the sixth consecutive year — reinforcing Bavishi Fertility Institute's position as the nation's most trusted fertility network."]
  );
  console.log("[patch] milestones: 2026 entry added ✓");
}
console.log("[patch] milestones ✓");

// ─── 5. TRUST PILLARS ────────────────────────────────────────────────────
await client.query(
  `UPDATE about_page_trust_pillars SET t = '30+ Years of Experience', d = 'Since 1986, a family-led institute that pioneered IVF in India and has guided 30,000+ families to parenthood across 14 centres in 8 cities.' WHERE _parent_id = 1 AND icon = 'Award'`
);
await client.query(
  `UPDATE about_page_trust_pillars SET d = 'Gynaecologists, obstetricians, embryologists, psychologists, nutritionists, consultants, coordinators and managers — exclusively dedicated to resolving patients'' issues and treating them. Shared infrastructure with more than 35+ years of experience.' WHERE _parent_id = 1 AND icon = 'Users'`
);
await client.query(
  `UPDATE about_page_trust_pillars SET d = 'Class 1000 IVF labs — 10× cleaner than the international standard — with time-lapse imaging, vitrification and PGT. Big data, cloud computing and AI guide every personalised treatment plan.' WHERE _parent_id = 1 AND icon = 'Microscope'`
);
await client.query(
  `UPDATE about_page_trust_pillars SET d = 'When you choose Bavishi Fertility Institute, your choice is right. Only the most innovative and experienced fertility clinics can make complex IVF treatment simple, safe, smart and successful — and that''s our ''EASY IVF''.' WHERE _parent_id = 1 AND icon = 'Sparkles'`
);
console.log("[patch] trust_pillars ✓");

// ─── 6. PATIENT STATS ────────────────────────────────────────────────────
await client.query(
  `UPDATE about_page_patient_stats SET value = '35+', label = 'Years of fertility expertise' WHERE _parent_id = 1 AND label ILIKE '%year%'`
);
console.log("[patch] patient_stats ✓");

// ─── VERIFY ──────────────────────────────────────────────────────────────
console.log("\n=== VERIFICATION ===");
const row = await client.query(`SELECT hero_eyebrow, seo_meta_title FROM about_page WHERE id = 1`);
console.log("[verify] hero_eyebrow:", row.rows[0]?.hero_eyebrow);
console.log("[verify] seo_meta_title:", row.rows[0]?.seo_meta_title);

const ag = await client.query(`SELECT value, label FROM about_page_at_a_glance WHERE _parent_id = 1 ORDER BY _order`);
console.log("[verify] at_a_glance:", ag.rows.map(r => `${r.value}/${r.label}`).join(" | "));

const ms = await client.query(`SELECT y, t FROM about_page_milestones WHERE _parent_id = 1 ORDER BY _order LIMIT 3`);
console.log("[verify] first 3 milestones:", ms.rows.map(r => `${r.y}:${r.t}`).join(", "));

const tp = await client.query(`SELECT icon, t FROM about_page_trust_pillars WHERE _parent_id = 1 ORDER BY _order`);
console.log("[verify] trust_pillars:", tp.rows.map(r => `${r.icon}:${r.t}`).join(" | "));

await client.end();
console.log("\n[patch] Done — production about-page data updated.");
