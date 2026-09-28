import { readFileSync } from "node:fs";
import { SAFE_TREATMENT_DEFAULTS as d } from "../src/lib/safe-treatment";
import { SAFE_TREATMENT_STRINGS as S } from "../src/lib/safe-treatment-strings";
import { UI_STRINGS } from "../src/lib/ui-strings";

const src = readFileSync("src/components/safe-treatment-page.tsx", "utf8");
const keys = new Set<string>();
for (const m of src.matchAll(/t\("((?:[^"\\]|\\.)*)"\)/g)) keys.add(m[1].replace(/\\'/g, "'"));
for (const m of src.matchAll(/^\s+"((?:[^"\\]|\\.)*)",?$/gm)) keys.add(m[1]);
const h = d.hero;
[h.eyebrow, h.headline, h.headlineEm, h.paragraph, h.mottoLabel, h.mottoText, ...d.protocols].forEach((k) => keys.add(k));
d.features.forEach((f) => { keys.add(f.title); keys.add(f.description); });
d.stats.forEach((s) => { keys.add(s.suffix); keys.add(s.label); keys.add(s.sub); });
keys.delete("");
let miss = 0;
for (const k of keys) if (!S[k] && !UI_STRINGS[k]) { miss++; console.log("MISSING:", k); }
console.log(`${keys.size} keys, ${miss} missing`);
