import { readFileSync } from "node:fs";
import { SUCCESS_BENCHMARKS_DEFAULTS as d } from "../src/lib/success-benchmarks";
import { SUCCESS_BENCHMARKS_STRINGS as S } from "../src/lib/success-benchmarks-strings";
import { UI_STRINGS } from "../src/lib/ui-strings";

const src = readFileSync("src/components/success-benchmarks-page.tsx", "utf8");
const keys = new Set<string>();
for (const m of src.matchAll(/t\("((?:[^"\\]|\\.)*)"\)/g)) keys.add(m[1]);
for (const m of src.matchAll(/(?:label|title|desc): "((?:[^"\\]|\\.)*)"/g)) keys.add(m[1]);
const h = d.hero;
[h.eyebrow, h.headline, h.headlineEm, h.paragraph, h.quote].forEach((k) => keys.add(k));
d.stats.forEach((x) => { keys.add(x.label); keys.add(x.suffix); });
d.pillars.forEach((p) => { keys.add(p.title); keys.add(p.description); p.highlights.forEach((x) => keys.add(x)); });
d.closingBadges.forEach((b) => keys.add(b.text));
keys.delete("");
let miss = 0;
for (const k of keys) if (!S[k] && !UI_STRINGS[k]) { miss++; console.log("MISSING:", JSON.stringify(k)); }
console.log(`${keys.size} keys, ${miss} missing`);
