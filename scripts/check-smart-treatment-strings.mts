import { readFileSync } from "node:fs";
import { SMART_TREATMENT_DEFAULTS as d } from "../src/lib/smart-treatment";
import { SMART_TREATMENT_STRINGS as S } from "../src/lib/smart-treatment-strings";
import { UI_STRINGS } from "../src/lib/ui-strings";

const src = readFileSync("src/components/smart-treatment-page.tsx", "utf8");
const keys = new Set<string>();
for (const m of src.matchAll(/t\("((?:[^"\\]|\\.)*)"\)/g)) keys.add(m[1].replace(/\\'/g, "'"));
for (const m of src.matchAll(/text: "((?:[^"\\]|\\.)*)"/g)) keys.add(m[1]);
const h = d.hero;
[h.eyebrow, h.headline, h.headlineEm, h.paragraph].forEach((k) => keys.add(k));
d.pillars.forEach((p) => keys.add(p.label));
d.features.forEach((f) => { keys.add(f.title); keys.add(f.description); f.highlights.forEach((x) => keys.add(x)); });
d.packages.forEach((p) => { keys.add(p.title); keys.add(p.description); });
keys.delete("");
let miss = 0;
for (const k of keys) if (!S[k] && !UI_STRINGS[k]) { miss++; console.log("MISSING:", k); }
console.log(`${keys.size} keys, ${miss} missing`);
