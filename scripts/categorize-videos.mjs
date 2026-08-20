#!/usr/bin/env node
/**
 * Categorize all 514 BFI YouTube videos into testimonial vs educational.
 * Reads /tmp/bfi_all_channel.txt (from yt-dlp full channel dump).
 *
 * Run: node scripts/categorize-videos.mjs
 */
import { readFileSync, writeFileSync } from "fs";

const raw = readFileSync(new URL("./bfi_all_channel.txt", import.meta.url), "utf8").trim().split("\n");
const videos = raw.map((line) => {
  const parts = line.split("|||");
  const id = parts[0].trim();
  const title = (parts[1] ?? "").trim();
  const dur = parts[2]?.trim();
  const duration = dur === "NA" || !dur ? null : parseFloat(dur);
  return { id, title, duration };
});

console.log(`Total from channel: ${videos.length}`);

// --- IDs to EXCLUDE completely ---
const EXCLUDE = new Set([
  "EpJiQ0pG-ls", // Garba song — unrelated
  "bOmtl_Z5gPs", // SHRESHTI award promo — not a video
  "YJ26esPB64k", // TOI No.1 ranking clip (11s)
  "jhDiyYCyGpo", // Channel intro promo
  "nglrzjFzc60", // "Top IVF Clinic" promo text
]);

// --- Known SHORT-format IDs (reels/shorts the user doesn't want) ---
// These are the IDs that only appear in the /shorts tab and have no spoken content
// Identified from the shorts tab + duration = NA
const KNOWN_SHORTS = new Set([
  "-T5WFpnHmks","-aa0d3rIn7I","-favdCbOehs","-gU4uND5Dhk","-vVJXt1S8RQ",
  "0BTMmmRU9Ck","0TiVITsyAHk","0ta3wiYvVcM","1pWXHWcoG00","1zHT_G1jflo",
  "3DeLdmmFg68","3K_ldSJuGnQ","4BsVuPEVefk","4rYrtF9Mn0s","5tYql8gfAnU",
  "5vt-9lmywyw","6ETbgiZolQ0","6oOe9bYkyD8","7OxYcAOrSdY","7dVR4cbk7TQ",
  "8JSUUnlCH38","8sPH6w3wL1I","9FnsMXOz33k","9KXGXSEXQS8","A-S-k7EmQJs",
  "AOmNFnDxZHg","APDOzceSGC4","AfMGhtC0CrE","BKIKzoFpYKw","BUGFidSLgnk",
  "BUHPq8YJ6pc","BSvvQfn4JlE","C1utGyTRqXw","CFPMhD0ZE-w","D2GKiTEAaYQ",
  "DWPHo9V_FzM","F-jBAGczFdA","G3nnj3B_AUg","G8sfasE9dDw","I45xK5jtUS4",
  "ISmgFzjcb9E","IjR1Cbl8Do4","J7UKshqEIi8","JuCkkKrzEyQ","KkzxobttgtQ",
  "L00wYVihy2Q","L3IN2lE3P1Y","LKwGKmJa4X0","LfjDd7gXEOg","MSh2gk4fH6w",
  "NSHYpjurJsU","NwkvuJ-8dvk","PyGzh8GaXCM","QTGu0NwofO8","QhdEsuyI6No",
  "RBaicvB7jrk","SP4xuGIFpF4","ShKW7KXcaU4","T99lep7HeqU","TIXebgaHnis",
  "TcEETRofhe8","UstIAVMFnCI","UzKQL2_sT00","Vc9grtDl1rw","VVsdB0b5pp4",
  "VfRSGCay7BU","X3G-NigRlec","YJmA0kujTsU","YUgEcMFmfTE","YkYCbGCR-Vc",
  "YohsKtqEAXg","ZHmMq8Eprr8","ZQNEDOc52nM","ZUkZ_Gk1MYs","ZvvNxYZFtNU",
  "Zeh7fsIBKIw","_4C8rVAD7qc","_jNlbjrH70M","_jysocW37Bs","_qtcQe5Cng4",
  "aFfTXIBL4Vw","cAOTm4Tfy6c","cYlqpS_CkhQ","cwK-K83hX7o","dUzI2NzObDM",
  "dV5vZXfsYO0","f52NK9huEkg","g4qRlC24NmI","guteYfUFEIc","h3Mke3vO0bs",
  "hN1zMHpPkLw","hzMi6fUMtvE","i-x3yQ2OuBU","jfp7kCwKrnA","jzA5GHDHeas",
  "keoK6F-CCXE","l2-XWL9kvTw","lAHVu6VheKk","lof7G9ocUHk","lvknvzhq6yE",
  "mR9R0JSx0Pk","nFFLwlQEFbQ","nNA61QDm2eI","o1TANVWy1v0","o8DVC2LqvS0",
  "pbGNG0J4TX8","qPZsEUerG2E","qVJMttbDRHc","qZ4ZXV1ueD0","rTxFwNBds1Y",
  "rjn-KFoCDPA","s-nUx86Zly8","s0vke3QY0w0","spBpm12eVdc","stEtpPDzuWM",
  "tXwYPcOz8NU","vjWrXuelL9g","vVPd0ks7jhA","wQRU-6NU3uA","xHQNDIvDsn4",
  "xk-00HwB43c","ycZafeTo1IA","yt5QsO5ZU4c","zsxe1lSuu-0","ZQNEDOc52nM",
  "HnM7lsIbbkg","VJFmuJwf8rU","lAHVu6VheKk","SxRhrUoBLyQ","JlU_4vHE2mU",
  "H40jjkI56D8", // duplicate — in main list already
  "-aa0d3rIn7I","HnM7lsIbbkg","VJFmuJwf8rU",
  "3DeLdmmFg68","7dVR4cbk7TQ", // shorts versions of full testimonials
]);

// --- Force TESTIMONIAL (patient stories, reviews, journeys) ---
const FORCE_TESTIMONIAL = new Set([
  // Named patient stories (full-length)
  "tfc645Tz3vw","hcrTlAG07c8","SbkV-1fSonM","ag4asJqSUA4","Ko_1GCx0kwE",
  "llJJm3TmbCA","mE28yGOxJlE","6bH_RnV-_2Y","KKf6tNrlvoc","ApUvVhP1F2s",
  "Stic7iwuvlU","EY98PyumZ1U","n2z95eV60jE","mq46CnngGyY","274_mV_xnfs",
  "lN42_g7G00s","uYbQaV6VEd4","v2oy6QZjQvs","XGYK6MZD3ak","Fa8ZzqH0n_s",
  "z31XQVZfO3s","yNKg1p38lOY","-jM7ly3AOFI","uRPM2WHhjIE","0gT3g_ZPvQc",
  "ZhNgmXLKpdU","u8-Z-X8ywYY","ber4YBT5Yno","dUC9eTcyjbI","n-q9hOywpB4",
  "3YwYR2wUHbI","jug_x6bp3G0","Le6kf91b7ws","6TFzhwgOliw","6SX-mYSTisU",
  "eIFracsANxY","1bNR2SWmxBY","GsyFum1c7WI","HZeK3QG2MDc","ugoz-3OnR3M",
  "uqaJOoKZLAk","aNFVaf5jYOw","HOv7NYmP13w","J0wtgJYVYfQ","wA91XZ15CZI",
  "hJ1ri7zHZcY","hdmPc7lgERo","bfBMj5giT4Q","lHHwoPzy3RI","Kq5tVsR66Io",
  "xHqTCirHpyM","s8pMxnlipK8","O3H-VGdqmls","AvAT2koY31k","WEt1_WuoINM",
  "H40jjkI56D8","SP4xuGIFpF4",
  // IVF Success reviews
  "DzeTsUKbp5E","ybPkHTfbPT4","DCWuox7cZ6Q","hX-a-GBztoI","ISj61VpkTlc",
  "uF3EDMrBqRs","tXr2cXJqHIo","dHtLelAWOs4","4uwvc0XSoJY","3LBzRw2k9YI",
  "gJL3Vn9SpOc","ALf0Re3vBW4","28kkDGp1r4M","APCGoUqrZwI","tKRxaWyibgI",
  "uwh7xVeLKTE","8mkMqZTtC74","0vO4G8l6fr8","p5FeRgiTcNA","8h_sFhuDRGc",
  "zO91KruM-m0","2_rKrBmiPJA",
  // Gujarati story compilations & IVF success
  "N7_towuWWjY","GXKSH_W3v6E","IK1sZLDAito","EdxW_0MOiOM",
  "ZfUz2hK3JMk","ZvTrpBdQpik","kt9GROuYlGA","5jlLhlqoqGo",
  "R0uaWxFsquc","h25xJbR65kQ",
  // Katha episodes (True Stories series)
  "Nin53vofIIQ","8UMLy_yFlQ8","YuyDY8vJxlw","uFHp3GYuaKE",
  "TXqDm3jGK9w","Oa1wi2dmI9U","rkmJHlf5myc","KvE6PeYRL68",
  "-k8ur4dmrbE","vjpc4lLvnt8","zBtb86IPaH8","CwqJJ8EoxpU",
  "vgw0s6Vz_WU","hwyKJITCgFk","e7dYx1Lg96I","epeD4FMj52w",
  "a_jMimXquMs","7MPhnbEztlE","9dNfzSvBmx0","8M6ieor3Cz0",
  "OpjKLK3m--4","tQkygsrdQqo","IjmT08Ugw-g","5JtRcctsqz0",
  "O4MS-DOdLPc","_gO-OlmoTmI",
  // Patient compilation clips
  "uCgCmrCwb_M","JYXU4sDWRok","4M_szNqtRMA","ghEfjiKCDI0",
  "d_ksCCxklEQ","OeW6OTdwrQo","OMgQwSBj-8A","FpohcDMyc3M",
  "kEEuhIj1-u8","Xqqk4_4nx4w",
  "Jg_QvK520WQ","IRgQSgZ_YO4","bvMFywZol2E","ienDYFQZExE",
  "lyfOlwatZ80","54hVHVZ99XY",
  "uAqg2DUaRyY","842QDkSLXD4","YvOYFm5GPmA","iW35M6n19Kw",
]);

// --- Force category for specific IDs (non-Latin titles, known specialties) ---
const FORCE_CATEGORY = {
  // Dr. Binal Shah — endometriosis specialist
  "wg9xQ5BKTVg":"Endometriosis & Uterus","XRq8a-jSDDA":"Endometriosis & Uterus",
  "fkYfM3KKEpM":"Endometriosis & Uterus","OvrQ6SFVi7o":"Endometriosis & Uterus",
  "q3nzZKuVuYw":"Endometriosis & Uterus","-1zr_K1EcdY":"Endometriosis & Uterus",
  "JTFjG_rqpj0":"Endometriosis & Uterus","nba5pScZfTo":"Endometriosis & Uterus",
  "H_ivkpHLqFw":"Endometriosis & Uterus",
  // Dr. Surabhi Vegad — laparoscopy / uterus
  "7lePkzEPcuA":"Endometriosis & Uterus","wF1pyYou-qE":"Endometriosis & Uterus",
  "XiFqaOmdscM":"Endometriosis & Uterus","S4oe8n7xR0A":"Endometriosis & Uterus",
  "6DHdAmVdyP0":"Endometriosis & Uterus","bB4eN0lq09Y":"Endometriosis & Uterus",
  "o_8Pf3Ai7PU":"Endometriosis & Uterus","CG-T8lGxMY8":"Endometriosis & Uterus",
  "jW_PIwizHBk":"Endometriosis & Uterus","yy9AYz8oXfY":"Endometriosis & Uterus",
  "QG0ko-RP2vo":"Endometriosis & Uterus",
  // Dr. Aashita Jain — IVF / embryology / pre-IVF
  "SAaLSS5RQxo":"IVF","Pi-1-Tt2BiA":"IVF","ArTilwSYfo4":"IVF","IV_elAzcej0":"IVF",
  "woDU9baBxiI":"IVF","XeYtCiON62s":"IVF","-WnkLeNE8iI":"Female Fertility",
  "9_D-OOcjGqE":"Female Infertility","0wn2120vOSQ":"IVF","3aO91ECJflY":"ICSI",
  "5v76BK6Eu6M":"Embryo & Transfer","6azQ8d_sItU":"Fertility Preservation",
  "-yw0GGugVNk":"PCOS / PCOD","1BtBdRmEcZA":"Endometriosis & Uterus",
  "2gXwQWmeddg":"Endometriosis & Uterus",
  // Dr. Suman Singh — laser hatching / IVF
  "Rghx_KPnFJM":"IVF","QHQXcKSJ2wc":"IVF","XBKvNWan2HU":"IVF",
  // Dr. Lekshmy Rana — blastocyst / natural conception
  "OMCTgxMo5_c":"IVF","LI586YgzkG4":"IVF","dlWeX3VsrxE":"Fertility Tips",
  // Dr. Mita Shah
  "43tb4Argg60":"IUI",
  // Dr. Parth Bavishi — non-Latin "5 things" tips series
  "0TvakkJrO8w":"Fertility Tips","LaIKBaxmWTQ":"Fertility Tips",
  "tNcBjU01Yvo":"Fertility Tips","1HFwsunJMcs":"Fertility Tips",
  "fzMEGbTso5c":"Fertility Tips","zoNpyKlxHKk":"Fertility Tips",
  "lFE8rLtd9Co":"Fertility Tips","uFxmpbInoqk":"Fertility Tips",
  "uOLkF_u7zSA":"Fertility Tips","qKXEtIR-JSg":"Fertility Tips",
  "7ExXZCkoqFY":"Fertility Tips","XVH2ULHiOVo":"Fertility Tips",
  "daXccR_eqrY":"Fertility Tips","EK3oCom5huc":"Fertility Tips",
  "d3e1RQ0lam4":"Fertility Tips",
  "_jEgFL09spA":"Embryo & Transfer","hLwH-BNpmzI":"Embryo & Transfer",
  "-JWA8mFrh6A":"Embryo & Transfer",
  "XR02J2T607c":"Female Fertility","bNZiMbg4Wkw":"Female Fertility",
  "fzC7O-1FDGA":"Fertility Tips","wauuLcQKs_k":"Fertility Tips",
  "sCoAcmEyb80":"Fertility Tips",
  "3DWXBtSrwJI":"Fertility Tips","kjyylA9L3KM":"Fertility Tips",
  "Q6UkOn2bMVo":"Fertility Tips",
  // COVID
  "oNZJacS94uQ":"COVID & Fertility","4jQkdYsxOmc":"COVID & Fertility",
  "59rn9Liy7S8":"COVID & Fertility","zyZja-4wW6M":"COVID & Fertility",
  "XNPAn4hj1no":"COVID & Fertility","jPXkE4ac1QE":"COVID & Fertility",
  "UJwxmLqShYU":"COVID & Fertility",
};

// --- Education category assignment ---
function getCategory(id, title) {
  if (FORCE_CATEGORY[id]) return FORCE_CATEGORY[id];
  if (/ivf\s*cost|cost.*ivf|examination\s*cost|factors.*cost/i.test(title)) return "IVF Cost";
  if (/amh|ovarian\s*(reserve|age|rejuven|strength)/i.test(title)) return "AMH & Ovarian Reserve";
  if (/sperm|semen|male\s*infertil|y\s*chromosome|azoosperm|oligosperm|varicocele/i.test(title)) return "Male Infertility";
  if (/pcos|pcod/i.test(title)) return "PCOS / PCOD";
  if (/embryo\s*(transfer|freez|grad|qualit|select)|poor.*embryo|blastocyst/i.test(title)) return "Embryo & Transfer";
  if (/egg\s*freez|embryo\s*freez|fertility\s*preserv|cryopreserv/i.test(title)) return "Fertility Preservation";
  if (/endometri|chocolate\s*cyst|adenomyos|polyp|fibroid|hystero|laparoscop|fallopian/i.test(title)) return "Endometriosis & Uterus";
  if (/pregnan|iron\s*tablet|protein.*pregnan|c[\.\-]section|heartbeat|sonograph/i.test(title)) return "Pregnancy";
  if (/\biui\b|intra.?uterine\s*insem/i.test(title)) return "IUI";
  if (/pgs|pgt|preimplant|genetic/i.test(title)) return "Genetics & PGS";
  if (/prp/i.test(title)) return "PRP Therapy";
  if (/covid/i.test(title)) return "COVID & Fertility";
  if (/icsi|intra.?cytoplasmic/i.test(title)) return "ICSI";
  if (/female\s*infertil|sign.*infertil|what\s*is\s*infertil|causes.*infertil/i.test(title)) return "Female Infertility";
  if (/period|ovulat|fertile\s*period|ovarian\s*cyst|menopause|vitamin\s*d|hormone|letrozol|delivery|natural.*pregnan/i.test(title)) return "Female Fertility";
  if (/mobile\s*phone|night\s*scroll|diet.*vs|myth|conceive\s*fast|naturally|naturally/i.test(title)) return "Fertility Tips";
  if (/ivf|in\s*vitro/i.test(title)) return "IVF";
  if (/fertil/i.test(title)) return "Fertility Tips";
  // Catch remaining non-Latin Dr. Parth/Himanshu videos as IVF tips
  if (/Dr\.\s*(Parth|Himanshu|Falguni|Janki)\s*Bavishi/i.test(title)) return "Fertility Tips";
  if (/Dr\.\s*(Binal\s*Shah|Surabhi|Aashita|Lekshmy|Suman|Mita)/i.test(title)) return "IVF";
  return "IVF"; // catch-all: all BFI videos are fertility-related
}

// --- Testimonial title patterns ---
const TESTIMONIAL_RE = [
  /testimonial/i, /success\s*stor/i, /ivf\s*success/i,
  /journey\s*to\s*parenthood/i, /patient\s*stor/i, /patient\s*review/i,
  /review.*bavishi/i, /bavishi.*review/i, /miracle.*happened/i,
  /dream.*came\s*true/i, /years\s*of\s*(waiting|hope)/i,
  /heartfelt\s*(stor|experience|testimonial)/i,
  /from\s*(loss|failed|doubts|hope|fear|struggle|ivf\s*miracle)/i,
  /inspiring.*journey/i, /twin\s*(blessing|joy)/i,
  /\bkatha\b/i, /true\s*stor(y|ies)\s*of\s*beat/i,
  /feedback.*happy|happy.*patient/i, /dr\s*bavishi\s*testimonial/i,
];

// --- Process ---
const testimonials = [];
const education = [];
const excluded = [];
const skippedShorts = [];

for (const v of videos) {
  if (EXCLUDE.has(v.id)) { excluded.push(v); continue; }
  if (KNOWN_SHORTS.has(v.id)) { skippedShorts.push(v); continue; }

  const isTestimonial =
    FORCE_TESTIMONIAL.has(v.id) ||
    TESTIMONIAL_RE.some((p) => p.test(v.title));

  if (isTestimonial) {
    testimonials.push({ id: v.id, title: v.title });
  } else {
    education.push({ id: v.id, title: v.title, category: getCategory(v.id, v.title) });
  }
}

console.log(`\nTotal: ${videos.length}`);
console.log(`Excluded (promos etc): ${excluded.length}`);
console.log(`Skipped (shorts format): ${skippedShorts.length}`);
console.log(`Testimonials: ${testimonials.length}`);
console.log(`Education: ${education.length}`);

// Education category breakdown
const cats = {};
education.forEach(v => { cats[v.category] = (cats[v.category] || 0) + 1; });
console.log("\nEducation categories:");
Object.entries(cats).sort((a,b) => b[1]-a[1])
  .forEach(([k,v]) => console.log(`  ${k.padEnd(30)} ${v}`));

console.log("\n--- Sample testimonials (first 5) ---");
testimonials.slice(0,5).forEach(v => console.log(`  ${v.id} | ${v.title.slice(0,70)}`));
console.log("\n--- Sample education (first 5) ---");
education.slice(0,5).forEach(v => console.log(`  ${v.id} | [${v.category}] ${v.title.slice(0,60)}`));

writeFileSync(new URL("./bfi_testimonials.json", import.meta.url), JSON.stringify(testimonials, null, 2));
writeFileSync(new URL("./bfi_education.json", import.meta.url), JSON.stringify(education, null, 2));
console.log(`\nSaved: scripts/bfi_testimonials.json (${testimonials.length}) + scripts/bfi_education.json (${education.length})`);
