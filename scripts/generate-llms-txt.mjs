#!/usr/bin/env node
// Regenerates public/llms.txt -- the index AI assistants (ChatGPT, Claude,
// Perplexity, Gemini) read to understand what this site covers, served at
// https://ivfclinic.com/llms.txt
//
// Every URL is taken from the live sitemap and every title/description is read
// from the page itself, so the file can never contain a link that 404s. Run it
// again whenever a batch of new pages or blogs goes live:
//
//   node scripts/generate-llms-txt.mjs
//
// Then commit the regenerated public/llms.txt.
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const BASE = "https://ivfclinic.com";
const CONCURRENCY = 12;

const SUMMARY =
  "India's trusted IVF experts since 1998 - 30,000+ successful pregnancies, " +
  "14 centres, personalised fertility care you can rely on.";

// Section order matches the structure signed off with the client.
const SECTIONS = [
  ["Home", (p) => p === "/"],
  ["Awards", (p) => p === "/awards"],
  ["Blogs", (p) => p === "/blogs" || p.startsWith("/blogs/")],
  ["About bfi", (p) => p === "/about-bfi"],
  ["Calculators", (p) => p === "/calculators" || p.startsWith("/calculators/")],
  ["Camps", (p) => p === "/camps"],
  ["Cookie policy", (p) => p === "/cookie-policy"],
  ["Contact", (p) => p === "/contact"],
  ["Doctors", (p) => p === "/doctors" || p.startsWith("/doctors/")],
  ["Cme", (p) => p === "/cme"],
  ["Locations", (p) => p === "/locations" || p.startsWith("/locations/")],
  ["Education videos", (p) => p === "/education-videos"],
  ["Press", (p) => p === "/press" || p.startsWith("/press/")],
  ["Refund policy", (p) => p === "/refund-policy"],
  ["Privacy policy", (p) => p === "/privacy-policy"],
  ["Services", (p) => p.startsWith("/services/")],
  ["Terms of service", (p) => p === "/terms-of-service"],
  ["Treatments", (p) => p === "/treatments" || p.startsWith("/treatments/")],
  ["Suraksha kavach", (p) => p === "/suraksha-kavach"],
  ["Testimonial videos", (p) => p === "/testimonial-videos"],
  ["Why bfi", (p) => p === "/why-bfi"],
];

const UA = { "User-Agent": "Mozilla/5.0 (compatible; BFI-llms-builder/1.0)" };

async function fetchText(url) {
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x2F;/g, "/");
}

const tidy = (s) => decodeEntities(s ?? "").replace(/\s+/g, " ").trim();

async function scrape(url) {
  const html = await fetchText(url);
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  const desc =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i)?.[1] ??
    html.match(/<meta[^>]+content=["']([\s\S]*?)["'][^>]+name=["']description["']/i)?.[1] ??
    "";
  return { url, title: tidy(title), desc: tidy(desc) };
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        try {
          out[i] = await fn(items[i]);
        } catch (err) {
          out[i] = { url: items[i], err: String(err) };
        }
      }
    }),
  );
  return out;
}

const xml = await fetchText(`${BASE}/sitemap.xml`);
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
console.log(`sitemap urls: ${urls.length}`);

const results = await mapLimit(urls, CONCURRENCY, scrape);
const failed = results.filter((r) => r.err);
const pages = results.filter((r) => !r.err);
if (failed.length) {
  console.warn(`WARNING: ${failed.length} page(s) could not be fetched and are omitted:`);
  for (const f of failed) console.warn(`  ${f.url} -- ${f.err}`);
}

const pathOf = (url) => (url.startsWith(BASE) ? url.slice(BASE.length) : url) || "/";

const lines = ["# ivfclinic.com llms.txt", "", `> ${SUMMARY}`, ""];
const assigned = new Set();

for (const [heading, matches] of SECTIONS) {
  const items = pages
    .filter((p) => matches(pathOf(p.url)))
    .sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
  if (!items.length) continue;
  lines.push(`## ${heading}`, "");
  for (const { title, url, desc } of items) {
    assigned.add(url);
    lines.push(desc ? `[${title}](${url}): ${desc}` : `[${title}](${url})`);
  }
  lines.push("");
  console.log(`  ${heading.padEnd(20)} ${items.length}`);
}

const unassigned = pages.filter((p) => !assigned.has(p.url));
if (unassigned.length) {
  console.warn(`WARNING: ${unassigned.length} live page(s) matched no section and were left out:`);
  for (const p of unassigned) console.warn(`  ${p.url}`);
}

const text = `${lines.join("\n").trimEnd()}\n`;

// Safety net: every link written must be one the sitemap actually lists.
const live = new Set(pages.map((p) => p.url));
const written = [...text.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map((m) => m[1]);
const bogus = written.filter((u) => !live.has(u));
if (bogus.length) {
  console.error(`ABORT: ${bogus.length} url(s) are not in the sitemap:`);
  for (const u of bogus.slice(0, 10)) console.error(`  ${u}`);
  process.exit(1);
}

const outPath = path.join(fileURLToPath(new URL("../public/", import.meta.url)), "llms.txt");
await writeFile(outPath, text, "utf8");
console.log(`\nWrote ${outPath} -- ${written.length} entries, ${Buffer.byteLength(text)} bytes.`);
