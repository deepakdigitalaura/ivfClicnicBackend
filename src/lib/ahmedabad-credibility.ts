/* =====================================================================
 * Ahmedabad credibility content — awards and press, for the Ahmedabad
 * city and centre pages.
 * ---------------------------------------------------------------------
 * Both lists are selections from catalogues that already exist in this
 * repo. Nothing here is new content: /awards and /press remain the full
 * record, and these are the subsets that are actually about Gujarat and
 * Ahmedabad, so a reader on an Ahmedabad page sees recognition earned in
 * their own state rather than a national list they can't place.
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
 * region, and West India is the region Ahmedabad belongs to — the card
 * text says so plainly, so nothing is implied that the award doesn't. */
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

/** Gujarat and Ahmedabad awards, newest-looking first (catalogue order).
 *  `img` is required by the award card, so entries without a photo — the
 *  catalogue has a few — are left to the /awards page. */
export const GUJARAT_AWARDS: AwardItem[] = [...PRESS_AWARDS, ...ACADEMIC_AWARDS]
  .filter((a) => Boolean(a.img) && GUJARAT.test(`${a.title} ${a.desc}`))
  .map(toItem);

/** Press coverage printed in the Ahmedabad editions. The remaining
 *  clippings in the catalogue are Vadodara editions and belong on that
 *  city's pages, not this one. */
export const AHMEDABAD_PRESS: PressClipping[] = PRESS_CLIPPINGS.filter(
  (c) => c.edition === "Ahmedabad",
);
