import React from "react";

/* =====================================================================
 * Auto-linking inside patient review text.
 * ---------------------------------------------------------------------
 * Reviews name doctors and treatments constantly ("Dr. Deep Gajiwala",
 * "IVF", "IUI"), and those are exactly the pages a reader wants next. So
 * the renderer turns known phrases into links.
 *
 * WHY IT IS DONE HERE AND NOT IN THE TEXT: review text is not ours. It
 * arrives from the Google Places sync and from the admin panel, and anyone
 * on the internet can write a Google review. Rendering that text as HTML so
 * it could carry its own <a> tags would hand a stranger an injection point
 * on every location page. Instead the text stays a plain string, and this
 * module wraps matched phrases in real React elements — nothing from the
 * data is ever interpreted as markup.
 *
 * RESTRAINT: "IVF" appears in nearly every review. Linking all of them
 * would bury the page in repeated identical links, which helps no reader
 * and reads as keyword stuffing. So: each destination is linked at most
 * once per review, at most MAX_LINKS links per review, and doctors are
 * matched before treatments because a named clinician is the more useful
 * and more specific destination.
 * ===================================================================== */

/** Links allowed in a single review, counting all destinations. */
const MAX_LINKS = 3;

type Target = { href: string; phrases: string[] };

/* Doctors first — longer, more specific phrases. Short forms are listed
 * only where reviews actually use them; "Dr. Deep sir" and "Dr. Falguni
 * madam" are how patients write, and the reference page links those too. */
const DOCTORS: Target[] = [
  /* Patients almost never write a doctor's full registered name. Across the
   * real reviews they write "Dr. Deep sir", "Dr.deep gajiwala", "deep sir",
   * "doctor Deep Gajiwala" -- so each doctor lists the forms that actually
   * appear. A bare first name is never matched: "deep" alone is an ordinary
   * English word, and "Patel" is half of Gujarat. */
  { href: "/doctors/deep-gajiwala", phrases: [
      "Dr. Deep Gajiwala", "Dr Deep Gajiwala", "Dr.Deep Gajiwala",
      "Doctor Deep Gajiwala", "doctor Deep Gajiwala", "Deep Gajiwala",
      "Dr. Deep sir", "Dr Deep sir", "Dr.Deep sir", "Deep sir",
      "Dr. Deep", "Dr Deep", "Dr.Deep",
  ] },
  { href: "/doctors/himanshu-bavishi", phrases: [
      "Dr. Himanshu Bavishi", "Dr Himanshu Bavishi", "Dr.Himanshu Bavishi",
      "Himanshu Bavishi", "Dr. Himanshu sir", "Himanshu sir", "Dr. Himanshu",
  ] },
  { href: "/doctors/falguni-bavishi", phrases: [
      "Dr. Falguni Bavishi", "Dr Falguni Bavishi", "Falguni Bavishi",
      "Dr. Falguni Madam", "Dr. Falguni madam", "Dr Falguni madam",
      "Falguni madam", "Dr. Falguni", "Dr Falguni",
  ] },
  { href: "/doctors/parth-bavishi", phrases: [
      "Dr. Parth Bavishi", "Dr Parth Bavishi", "Parth Bavishi",
      "Dr. Parth sir", "Parth sir", "Dr. Parth",
  ] },
  { href: "/doctors/janki-bavishi", phrases: ["Dr. Janki Bavishi", "Dr Janki Bavishi", "Janki Bavishi", "Dr. Janki"] },
  { href: "/doctors/jaydeep-patel", phrases: ["Dr. Jaydeep Patel", "Dr Jaydeep Patel", "Jaydeep Patel"] },
  { href: "/doctors/binal-shah", phrases: ["Dr. Binal Shah", "Dr Binal Shah", "Binal Shah"] },
  { href: "/doctors/deepali-pandya", phrases: ["Dr. Deepali Pandya", "Dr Deepali Pandya", "Deepali Pandya"] },
  { href: "/doctors/mita-shah", phrases: ["Dr. Mita Shah", "Dr Mita Shah"] },
  { href: "/doctors/surbhi-vegad", phrases: ["Dr. Surbhi Vegad", "Dr Surbhi Vegad"] },
  { href: "/doctors/chetna-vyas", phrases: ["Dr. Chetna Vyas", "Dr Chetna Vyas"] },
  { href: "/doctors/rakhee-patel", phrases: ["Dr. Rakhee Patel", "Dr Rakhee Patel"] },

  /* NOT linked, deliberately: Dr. Disha, Dr. Aashita, Dr. Suraj and Pratik
   * are named in review after review at the Surat centre but have no page on
   * this site, so there is nowhere honest to send the reader. Worth adding
   * pages for them -- they are the names patients remember. */
];

/* Treatments. Deliberately a short list: only terms a patient actually
 * writes in a review and that have a page worth landing on. */
const TREATMENTS: Target[] = [
  { href: "/treatments/egg-freezing", phrases: ["egg freezing"] },
  { href: "/treatments/egg-donation", phrases: ["egg donation"] },
  { href: "/treatments/sperm-donation", phrases: ["sperm donation"] },
  { href: "/treatments/surrogacy", phrases: ["surrogacy"] },
  { href: "/treatments/male-infertility", phrases: ["male infertility"] },
  { href: "/treatments/female-infertility", phrases: ["female infertility"] },
  { href: "/treatments/ivf-failure", phrases: ["failed IVF", "IVF failure"] },
  { href: "/treatments/icsi", phrases: ["ICSI"] },
  { href: "/treatments/iui", phrases: ["IUI"] },
  { href: "/treatments/ivf", phrases: ["IVF"] },
];

const TARGETS: Target[] = [...DOCTORS, ...TREATMENTS];

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* One pass, longest phrase first so "Dr. Deep Gajiwala" wins over "Dr. Deep
 * sir" and "IVF failure" wins over "IVF". \b keeps "IVF" from matching
 * inside a longer word. */
const ENTRIES: { re: RegExp; href: string }[] = TARGETS.flatMap((t) =>
  t.phrases.map((p) => ({ phrase: p, href: t.href })),
)
  .sort((a, b) => b.phrase.length - a.phrase.length)
  .map(({ phrase, href }) => ({ re: new RegExp(`\\b${escapeRe(phrase)}\\b`, "i"), href }));

const LINK_CLASS =
  "font-medium text-[color:var(--rose)] underline decoration-[color:var(--rose)]/30 underline-offset-2 transition-colors hover:decoration-[color:var(--rose)]";

/**
 * Turn a review into React nodes, linking known doctors and treatments.
 *
 * Returns the plain string unchanged when nothing matches, so the common
 * case costs nothing and the markup stays identical to before.
 */
export function linkifyReview(text: string): React.ReactNode {
  if (!text) return text;

  type Hit = { start: number; end: number; href: string };
  const hits: Hit[] = [];
  const usedHrefs = new Set<string>();

  for (const { re, href } of ENTRIES) {
    if (hits.length >= MAX_LINKS) break;
    if (usedHrefs.has(href)) continue; // one link per destination per review
    const m = re.exec(text);
    if (!m || m.index === undefined) continue;
    const start = m.index;
    const end = start + m[0].length;
    // skip anything overlapping a phrase already matched
    if (hits.some((h) => start < h.end && end > h.start)) continue;
    hits.push({ start, end, href });
    usedHrefs.add(href);
  }

  if (hits.length === 0) return text;

  hits.sort((a, b) => a.start - b.start);
  const out: React.ReactNode[] = [];
  let cursor = 0;
  hits.forEach((h, i) => {
    if (h.start > cursor) out.push(text.slice(cursor, h.start));
    out.push(
      <a key={`${h.href}-${i}`} href={h.href} className={LINK_CLASS}>
        {text.slice(h.start, h.end)}
      </a>,
    );
    cursor = h.end;
  });
  if (cursor < text.length) out.push(text.slice(cursor));
  return out;
}
