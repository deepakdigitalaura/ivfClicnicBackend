#!/usr/bin/env node
/* =====================================================================
 * Patch about-page global — add internal links to doctor names,
 * treatment pages, and location pages throughout the About BFI content.
 * Run: node scripts/patch-about-internal-links.mjs
 * ===================================================================== */
import pg from "pg";
const { Client } = pg;

const DB_URI =
  process.env.DATABASE_URI ??
  "postgresql://postgres.acugkaaiyzbckwafudxa:deepakDigitalAura@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres";

const client = new Client({ connectionString: DB_URI, ssl: { rejectUnauthorized: false } });
await client.connect();
console.log("[patch] Connected to production database.\n");

// ─── helper: link builder ────────────────────────────────────────────────
const a = (href, text, style = 'color:var(--plum)') =>
  `<a href="${href}" style="${style}">${text}</a>`;
const aU = (href, text) => a(href, text, 'color:var(--plum);text-decoration:underline');

// ─── 1. HERO PARAGRAPH ──────────────────────────────────────────────────
const heroRow = await client.query(`SELECT hero_paragraph FROM about_page WHERE id = 1`);
let heroPara = heroRow.rows[0]?.hero_paragraph ?? '';
if (heroPara && !heroPara.includes('href=')) {
  heroPara = heroPara
    .replace(/Dr\.\s*Himanshu\s+Bavishi/g, `${a('/doctors/himanshu-bavishi', 'Dr. Himanshu Bavishi')}`)
    .replace(/Dr\.\s*Falguni\s+Bavishi/g, `${a('/doctors/falguni-bavishi', 'Dr. Falguni Bavishi')}`)
    .replace(/ & /, ' &amp; ');
  await client.query(`UPDATE about_page SET hero_paragraph = $1, updated_at = NOW() WHERE id = 1`, [heroPara]);
  console.log("[patch] hero_paragraph ✓");
} else {
  console.log("[patch] hero_paragraph — already has links or empty, skipped");
}

// ─── 2. STORY PARAGRAPHS ────────────────────────────────────────────────
const storyRows = await client.query(
  `SELECT id, _order, value FROM about_page_story_paragraphs WHERE _parent_id = 1 ORDER BY _order`
);
for (const row of storyRows.rows) {
  let v = row.value;
  if (!v || v.includes('href="/doctors') || v.includes("href='/doctors")) continue;

  if (row._order === 1) {
    // Wrap existing <strong> doctor names with <a> links
    v = v.replace(
      /<strong style="color:var\(--plum\)">Dr\. Himanshu Bavishi<\/strong>/,
      `<a href="/doctors/himanshu-bavishi"><strong style="color:var(--plum)">Dr. Himanshu Bavishi</strong></a>`
    );
    v = v.replace(
      /<strong style="color:var\(--plum\)">Dr\. Falguni Bavishi<\/strong>/,
      `<a href="/doctors/falguni-bavishi"><strong style="color:var(--plum)">Dr. Falguni Bavishi</strong></a>`
    );
    // Link "Ahmedabad" (first occurrence outside a tag)
    v = v.replace(
      / in Ahmedabad with/,
      ` in ${aU('/locations/ahmedabad', 'Ahmedabad')} with`
    );
    // Link "IVF" in "3,000 IVF cycles"
    v = v.replace(
      /3,000 IVF cycles/,
      `3,000 ${aU('/what-is-ivf', 'IVF')} cycles`
    );
  }

  if (row._order === 2) {
    // Link "IVF" inside the "Best IVF Chain" strong
    v = v.replace(
      /Best IVF Chain/,
      `Best ${a('/what-is-ivf', 'IVF')} Chain`
    );
  }

  if (row._order === 3) {
    // Link "IVF" in "pioneered IVF in India"
    v = v.replace(
      /pioneered IVF in India/,
      `pioneered ${aU('/what-is-ivf', 'IVF')} in India`
    );
    // Add second-generation doctor links
    v = v.replace(
      /second generation of Bavishi doctors/,
      `second generation of Bavishi doctors — ${aU('/doctors/parth-bavishi', 'Dr. Parth Bavishi')} and ${aU('/doctors/janki-bavishi', 'Dr. Janki Bavishi')}`
    );
  }

  await client.query(`UPDATE about_page_story_paragraphs SET value = $1 WHERE id = $2`, [v, row.id]);
}
console.log("[patch] story_paragraphs ✓");

// ─── 3. MILESTONES ──────────────────────────────────────────────────────
const msRows = await client.query(
  `SELECT id, y, t, d FROM about_page_milestones WHERE _parent_id = 1 ORDER BY _order`
);
for (const row of msRows.rows) {
  let d = row.d;
  if (!d || d.includes('href=')) continue;

  // Doctor links in 1998/founding milestone
  if (row.y === '1998' || (row.t && row.t.includes('Institute begins'))) {
    d = d.replace(/Dr\. Himanshu/g, `${a('/doctors/himanshu-bavishi', 'Dr. Himanshu')}`);
    d = d.replace(/Dr\. Falguni Bavishi/g, `${a('/doctors/falguni-bavishi', 'Dr. Falguni Bavishi')}`);
    if (d.includes(' in Ahmedabad')) d = d.replace(/ in Ahmedabad/, ` in ${a('/locations/ahmedabad', 'Ahmedabad')}`);
  }

  // Location links by year
  if (row.y === '2005' && d.includes('Ahmedabad')) {
    d = d.replace(/ in Ahmedabad/, ` in ${a('/locations/ahmedabad', 'Ahmedabad')}`);
  }
  if (row.y === '2008') {
    d = d.replace(/Mumbai/, a('/locations/mumbai', 'Mumbai'));
    d = d.replace(/Surat/, a('/locations/surat', 'Surat'));
    if (d.includes('beyond Ahmedabad')) d = d.replace(/Ahmedabad/, a('/locations/ahmedabad', 'Ahmedabad'));
  }
  if (row.y === '2009' && d.includes('Vitrified Frozen Oocytes')) {
    d = d.replace(/Vitrified Frozen Oocytes/, `Vitrified Frozen Oocytes (${aU('/cryopreservation', 'Cryopreservation')})`);
  }
  if (row.y === '2014' && d.includes('INSTAR')) {
    d = d.replace(/donor and surrogacy/, `${a('/egg-donation', 'egg donation')}, ${a('/sperm-donation', 'sperm donation')} and surrogacy`);
  }
  if (row.y === '2017') {
    d = d.replace(/Dr\. Himanshu Bavishi/g, a('/doctors/himanshu-bavishi', 'Dr. Himanshu Bavishi'));
    d = d.replace(/Dr\. Falguni Bavishi/g, a('/doctors/falguni-bavishi', 'Dr. Falguni Bavishi'));
  }
  if (row.y === '2018' && d.includes('Surat centre')) {
    d = d.replace(/Surat centre/, `${a('/locations/surat', 'Surat')} centre`);
  }
  if (row.y === '2019' && d.includes('Vadodara')) {
    d = d.replace(/Vadodara/, a('/locations/vadodara', 'Vadodara'));
  }
  if (row.y === '2020' && d.includes('Bhuj')) {
    d = d.replace(/Bhuj/, a('/locations/bhuj', 'Bhuj'));
  }
  if (row.y === '2022' && d.includes('Sindhu Bhavan')) {
    d = d.replace(/Sindhu Bhavan Road, Bodakdev/, a('/locations/ahmedabad/sindhu-bhavan-road', 'Sindhu Bhavan Road, Bodakdev'));
    d = d.replace(/, Ahmedabad/, `, ${a('/locations/ahmedabad', 'Ahmedabad')}`);
  }
  if (row.y === '2025' && d.includes('Nikol')) {
    d = d.replace(/Nikol centre/, `${a('/locations/ahmedabad/nikol', 'Nikol')} centre`);
    d = d.replace(/east Ahmedabad/, `east ${a('/locations/ahmedabad', 'Ahmedabad')}`);
  }

  if (d !== row.d) {
    await client.query(`UPDATE about_page_milestones SET d = $1 WHERE id = $2`, [d, row.id]);
  }
}
console.log("[patch] milestones ✓");

// ─── 4. TRUST PILLARS ───────────────────────────────────────────────────
const tpRows = await client.query(
  `SELECT id, icon, t, d FROM about_page_trust_pillars WHERE _parent_id = 1 ORDER BY _order`
);
for (const row of tpRows.rows) {
  let d = row.d;
  if (!d || d.includes('href=')) continue;

  if (row.icon === 'Award') {
    d = d.replace(/pioneered IVF/, `pioneered ${a('/what-is-ivf', 'IVF')}`);
  }
  if (row.icon === 'HeartPulse') {
    d = d.replace(/IVF cycles/, `${a('/what-is-ivf', 'IVF')} cycles`);
  }
  if (row.icon === 'Users') {
    d = d.replace(
      /Shared infrastructure/,
      `${aU('/doctors', 'Meet our doctors')} — shared infrastructure`
    );
  }
  if (row.icon === 'Microscope') {
    d = d.replace(/IVF labs/, `${a('/what-is-ivf', 'IVF')} labs`);
    d = d.replace(/vitrification/, aU('/cryopreservation', 'vitrification'));
  }
  if (row.icon === 'Sparkles') {
    d = d.replace(/complex IVF treatment/, `complex ${a('/what-is-ivf', 'IVF')} treatment`);
  }

  if (d !== row.d) {
    await client.query(`UPDATE about_page_trust_pillars SET d = $1 WHERE id = $2`, [d, row.id]);
  }
}
console.log("[patch] trust_pillars ✓");

// ─── VERIFY ─────────────────────────────────────────────────────────────
console.log("\n=== VERIFICATION ===");
const vHero = await client.query(`SELECT hero_paragraph FROM about_page WHERE id = 1`);
const heroLinks = (vHero.rows[0]?.hero_paragraph?.match(/href=/g) || []).length;
console.log(`[verify] hero_paragraph: ${heroLinks} links`);

const vStory = await client.query(`SELECT value FROM about_page_story_paragraphs WHERE _parent_id = 1 ORDER BY _order`);
for (let i = 0; i < vStory.rows.length; i++) {
  const links = (vStory.rows[i].value?.match(/href=/g) || []).length;
  console.log(`[verify] story_paragraphs[${i + 1}]: ${links} links`);
}

const vMs = await client.query(`SELECT y, d FROM about_page_milestones WHERE _parent_id = 1 AND d LIKE '%href=%' ORDER BY _order`);
console.log(`[verify] milestones with links: ${vMs.rows.length} (${vMs.rows.map(r => r.y).join(', ')})`);

const vTp = await client.query(`SELECT icon, d FROM about_page_trust_pillars WHERE _parent_id = 1 AND d LIKE '%href=%' ORDER BY _order`);
console.log(`[verify] trust_pillars with links: ${vTp.rows.length} (${vTp.rows.map(r => r.icon).join(', ')})`);

await client.end();
console.log("\n[patch] Done — internal links added to production about-page.");
