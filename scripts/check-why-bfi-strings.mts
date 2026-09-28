// Every English string rendered on /why-bfi must have hi+gu in WHY_BFI_STRINGS.
// Run: npx tsx scripts/check-why-bfi-strings.mts
import { WHY_BFI_DEFAULTS as d } from "../src/lib/why-bfi";
import { WHY_BFI_STRINGS } from "../src/lib/why-bfi-strings";
import { UI_STRINGS } from "../src/lib/ui-strings";
const S = { ...UI_STRINGS, ...WHY_BFI_STRINGS };
import { readFileSync } from "node:fs";

const need = new Set<string>();
const add = (x?: string) => {
  if (x) need.add(x);
};
add(d.hero.eyebrow); add(d.hero.headline); add(d.hero.headlineEm); add(d.hero.quote); add(d.hero.quoteFooter);
d.stats.forEach((s) => { add(s.label); add(s.sub); });
d.reasons.forEach((r) => { add(r.title); add(r.description); });
d.ethics.forEach((r) => { add(r.title); add(r.description); });
d.journey.forEach((e) => { add(e.eraLabel); e.entries.forEach((en) => en.items.forEach(add)); });

// literal keys used in the component via t("...") + the string arrays it maps over
const src = readFileSync("src/components/why-bfi-page.tsx", "utf8");
for (const m of src.matchAll(/\bt\("(.*?)"\)/g)) add(m[1].split("\\'").join("'"));
for (const line of src.split(/\r?\n/)) {
  const m = line.match(/^\s+"([^"]+)",\s*$/);
  if (m) add(m[1]);
}

const missing = [...need].filter((k) => !S[k] || !S[k].hi || !S[k].gu);
console.log(`${need.size} strings checked, ${missing.length} missing`);
missing.forEach((k) => console.log("  MISSING:", k));
process.exit(missing.length ? 1 : 0);
