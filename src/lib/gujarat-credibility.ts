/* =====================================================================
 * Gujarat credibility content — awards and press for the Gujarat
 * location pages (Ahmedabad hub, its three centres, and Surat).
 * ---------------------------------------------------------------------
 * Both lists are selections from catalogues that already exist in this
 * repo. Nothing here is new content: /awards and /press remain the full
 * record, and these are the subsets that are actually about Gujarat, so a
 * reader on a Gujarat page sees recognition earned in their own state
 * rather than a national list they can't place.
 *
 * Selection is a filter over the real data rather than a hand-copied
 * list, so when a Gujarat award is added to src/lib/awards.ts it appears
 * here too and cannot fall out of sync.
 * ===================================================================== */

import { PRESS_AWARDS, ACADEMIC_AWARDS, type AwardEntry } from "@/lib/awards";
import { PRESS_CLIPPINGS, type PressClipping } from "@/lib/press";
import type { AwardItem } from "@/lib/homepage";

/* Gujarat, Ahmedabad, or the West zone that Gujarat sits in. "West" is
 * included because the ET Healthworld and Dynergic wins are awarded by
 * region, and West India is the region Gujarat belongs to — the card text
 * says so plainly, so nothing is implied that the award doesn't. */
const GUJARAT = /gujarat|ahmedabad|west/i;

/* One catalogue entry carries the institute name in `title` and the actual
 * award in `desc`, which reads backwards on a card. Corrected here rather
 * than in awards.ts, because the /awards page lays that entry out
 * differently and reads correctly as it stands. */
const RELABELLED: Record<string, { title: string; desc: string }> = {
  "/assets/awards/most-trusted-fertility-chain-gujarat.png": {
    title: "Most Trusted Fertility Chain Hospital in Gujarat",
    desc: "Bavishi Fertility Institute",
  },
};

const toItem = (a: AwardEntry): AwardItem => {
  const fix = a.img ? RELABELLED[a.img] : undefined;
  return { img: a.img!, title: fix?.title ?? a.title, desc: fix?.desc ?? a.desc };
};

/** Gujarat and Ahmedabad awards, in catalogue order. `img` is required by
 *  the award card, so entries without a photo — the catalogue has a few —
 *  are left to the /awards page. */
export const GUJARAT_AWARDS: AwardItem[] = [...PRESS_AWARDS, ...ACADEMIC_AWARDS]
  .filter((a) => Boolean(a.img) && GUJARAT.test(`${a.title} ${a.desc}`))
  .map(toItem);

/** Press coverage for a city.
 *
 *  A city with its own printed edition shows only that edition — Ahmedabad
 *  has four Times of India clippings. A city with none shows the Gujarat
 *  record instead, labelled as such: the remaining clippings are Gujarati
 *  papers from the Vadodara edition, and presenting them as local coverage
 *  for a city they were not printed in would be untrue.
 *
 *  Returns the label the section should use, so the heading always matches
 *  what the cards actually are. */
export function pressForCity(cityName: string): {
  items: PressClipping[];
  label: string;
  publications: string;
} {
  const local = PRESS_CLIPPINGS.filter(
    (c) => c.edition?.toLowerCase() === cityName.toLowerCase(),
  );
  const items = local.length > 0 ? local : PRESS_CLIPPINGS;
  const label = local.length > 0 ? cityName : "Gujarat";
  const names = Array.from(new Set(items.map((c) => c.publication)));
  const publications =
    names.length === 1
      ? names[0]
      : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  return { items, label, publications };
}
