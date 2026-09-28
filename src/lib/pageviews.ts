import { promises as fs } from "fs";
import path from "path";

/** Cookie-less traffic counter: one line per hit, appended to a per-day log file.
 *  No identifiers are stored (no IP, no UA) so it needs no cookie-consent gate —
 *  it exists to reconcile GA's consent-gated numbers against real total traffic. */
const DIR = path.join(process.cwd(), "data", "pageviews");

function todayFile(d = new Date()) {
  return path.join(DIR, `${d.toISOString().slice(0, 10)}.log`);
}

export async function recordPageview() {
  await fs.mkdir(DIR, { recursive: true });
  await fs.appendFile(todayFile(), "1\n");
}

async function countLines(file: string) {
  try {
    const content = await fs.readFile(file, "utf8");
    return content ? content.split("\n").filter(Boolean).length : 0;
  } catch {
    return 0;
  }
}

export async function getPageviewStats() {
  const today = await countLines(todayFile());
  let total = 0;
  try {
    const files = await fs.readdir(DIR);
    const counts = await Promise.all(files.map((f) => countLines(path.join(DIR, f))));
    total = counts.reduce((a, b) => a + b, 0);
  } catch {
    total = today;
  }
  return { today, total };
}
