/* =====================================================================
 * Press clippings — real newspaper coverage of Bavishi Fertility Institute.
 * ---------------------------------------------------------------------
 * Powers the /press "In the news" gallery. These are scans of printed
 * articles supplied by the clinic.
 *
 * RULES (do not break these):
 *  - Every entry must correspond to a real scan in /public/assets/media/press.
 *  - `headline` is transcribed from the clipping, never invented.
 *  - Gujarati headlines keep the original in `headlineOriginal`; `headline`
 *    carries a plain-English rendering so the card is scannable and the page
 *    stays indexable.
 *  - `summary` describes only what the clipping actually says.
 *  - `date` is set ONLY where the clipping (or its filing stamp) states it.
 *    Never guess a date to fill the field — omit it instead.
 * ===================================================================== */

export type PressClipping = {
  /** Stable slug — matches the image filenames in /assets/media/press. */
  slug: string;
  /** Headline as printed (English), or an English rendering for Gujarati. */
  headline: string;
  /** Original-language headline, for non-English papers. */
  headlineOriginal?: string;
  /** Standfirst / sub-headline as printed, when the clipping carries one. */
  standfirst?: string;
  /** Newspaper name. */
  publication: string;
  /** City edition, where printed on the clipping. */
  edition?: string;
  /** Human date label. Omitted when the clipping carries no legible date. */
  date?: string;
  /** Language the article is printed in. */
  language: "English" | "Gujarati";
  /** What the article covers — factual, drawn from the clipping itself. */
  summary: string;
  /** BFI doctors quoted in the article, as named in print. */
  doctorsQuoted: string[];
  /** Full-resolution scan. */
  image: string;
  /** Grid thumbnail. */
  thumb: string;
  /** Intrinsic size of `image`, to reserve layout space. */
  width: number;
  height: number;
};

const DIR = "/assets/media/press";

export const PRESS_CLIPPINGS: PressClipping[] = [
  {
    slug: "yug-prabhav-100-ivf-babies-meet",
    headline:
      "Vadodara's first-ever gathering of more than 100 IVF test-tube babies",
    headlineOriginal:
      "વડોદરામાં સૌપ્રથમ વખત એક સાથે ૧૦૦થી વધુ IVF ટેસ્ટ ટ્યુબ બાળકોનો મેળાવડો યોજવાનો પ્રયાસ",
    publication: "Yug Prabhav",
    edition: "Vadodara",
    date: "14 October 2024",
    language: "Gujarati",
    summary:
      "Report on the reunion of over 100 IVF babies hosted at Bavishi Fertility Institute, Vadodara, to build public awareness of test-tube baby treatment. Dr Himanshu Bavishi speaks on how correct treatment at the right time makes conception possible in almost all cases, and Dr Falguni Bavishi explains how IVF can prevent hereditary disease being passed to the child.",
    doctorsQuoted: ["Dr Himanshu Bavishi", "Dr Falguni Bavishi"],
    image: `${DIR}/yug-prabhav-100-ivf-babies-meet.jpg`,
    thumb: `${DIR}/yug-prabhav-100-ivf-babies-meet-thumb.jpg`,
    width: 1654,
    height: 2338,
  },
  {
    slug: "vadodara-samachar-100-ivf-babies-meet",
    headline:
      "For the first time in Vadodara's history, a gathering of more than 100 IVF test-tube babies",
    headlineOriginal:
      "વડોદરાના ઇતિહાસમાં સૌપ્રથમ વખત એક સાથે ૧૦૦ થી વધુ IVF ટેસ્ટ ટ્યુબ બાળકો નો મેળાવડો યોજાયો",
    publication: "Vadodara Samachar",
    edition: "Vadodara",
    date: "13 October 2024",
    language: "Gujarati",
    summary:
      "Coverage of the test-tube baby reunion held at Bavishi Fertility Institute, Vadodara. Dr Himanshu Bavishi describes the institute's 28-year record of helping thousands of childless couples through a combination of technology and trust.",
    doctorsQuoted: ["Dr Himanshu Bavishi"],
    image: `${DIR}/vadodara-samachar-100-ivf-babies-meet.jpg`,
    thumb: `${DIR}/vadodara-samachar-100-ivf-babies-meet-thumb.jpg`,
    width: 1654,
    height: 2338,
  },
  {
    slug: "yatharth-100-ivf-babies-meet",
    headline:
      "A gathering of more than 100 IVF test-tube babies is held — a first in Vadodara's history",
    headlineOriginal:
      "એક સાથે ૧૦૦થી વધુ IVF ટેસ્ટ ટ્યુબ બાળકોનો મેળાવડો યોજાયો",
    publication: "Yatharth",
    edition: "Vadodara",
    date: "13 October 2024",
    language: "Gujarati",
    summary:
      "Report on the IVF babies' reunion at Bavishi Fertility Institute, Vadodara. Dr Himanshu Bavishi and Dr Falguni Bavishi speak on treatment success, on IVF's role in avoiding hereditary conditions, and on how far affordability and public acceptance of IVF have improved.",
    doctorsQuoted: ["Dr Himanshu Bavishi", "Dr Falguni Bavishi"],
    image: `${DIR}/yatharth-100-ivf-babies-meet.jpg`,
    thumb: `${DIR}/yatharth-100-ivf-babies-meet-thumb.jpg`,
    width: 1654,
    height: 2338,
  },
  {
    slug: "toi-single-dad-via-surrogacy",
    headline: "He is among last to be single dad via surrogacy",
    standfirst:
      "Pritesh Dave, 37, Becomes Dad To Twins Before New Surrogacy Law Kicks In",
    publication: "The Times of India",
    edition: "Ahmedabad",
    language: "English",
    summary:
      "A Father's Day feature on Pritesh Dave, among the last single men to become a parent through surrogacy before the new surrogacy law came into force. Infertility specialist Dr Parth Bavishi explains that the new rules do not allow surrogacy for single men, women, live-in and same-sex couples, and Dr Janki Bavishi notes the interest among single men who can no longer take this route.",
    doctorsQuoted: ["Dr Parth Bavishi", "Dr Janki Bavishi"],
    image: `${DIR}/toi-single-dad-via-surrogacy.jpg`,
    thumb: `${DIR}/toi-single-dad-via-surrogacy-thumb.jpg`,
    width: 2338,
    height: 1654,
  },
  {
    slug: "toi-dads-made-single-by-covid",
    headline: "Dads made single by Covid tend to babies and grief",
    publication: "The Times of India",
    edition: "Ahmedabad",
    language: "English",
    summary:
      "A Father's Day report on men widowed during the second Covid wave who are raising newborns alone. Fertility specialist Dr Falguni Bavishi describes a couple from Nadiad who were expecting a child after 23 years of married life.",
    doctorsQuoted: ["Dr Falguni Bavishi"],
    image: `${DIR}/toi-dads-made-single-by-covid.jpg`,
    thumb: `${DIR}/toi-dads-made-single-by-covid-thumb.jpg`,
    width: 2338,
    height: 1654,
  },
  {
    slug: "toi-12-year-wait-for-baby",
    headline: "12-yr wait for baby, Covid kills mom after delivery",
    standfirst: "Sister-In-Law In Oz To Adopt Child",
    publication: "The Times of India",
    edition: "Ahmedabad",
    date: "7 June 2021",
    language: "English",
    summary:
      "A report on a family from Anand who lost a mother to Covid a day after she delivered a son conceived following 12 years of yearning and multiple IVF cycles. Dr Falguni Bavishi, the IVF specialist handling the family's surrogacy treatment, calls it a rare situation created by the pandemic for hopeful mothers.",
    doctorsQuoted: ["Dr Falguni Bavishi"],
    image: `${DIR}/toi-12-year-wait-for-baby.jpg`,
    thumb: `${DIR}/toi-12-year-wait-for-baby-thumb.jpg`,
    width: 2338,
    height: 1095,
  },
  {
    slug: "toi-low-sperm-motility-genes-study",
    headline:
      "When going gets tough: Low sperm motility could run in genes, finds study",
    standfirst: "Experts Probe Genetic Reasons For Male Infertility",
    publication: "The Times of India",
    edition: "Ahmedabad",
    language: "English",
    summary:
      "Coverage of an international study that identified six new genes responsible for severe sperm motility disorder. Fertility specialist Dr Himanshu Bavishi explains that low motility is an important factor in male infertility — a factor in 40% of cases of childlessness — and that specific tests can identify live sperm that cannot move.",
    doctorsQuoted: ["Dr Himanshu Bavishi"],
    image: `${DIR}/toi-low-sperm-motility-genes-study.jpg`,
    thumb: `${DIR}/toi-low-sperm-motility-genes-study-thumb.jpg`,
    width: 2223,
    height: 1601,
  },
];

/** Distinct publications, in first-appearance order — used for the filter row. */
export function pressPublications(): string[] {
  return [...new Set(PRESS_CLIPPINGS.map((c) => c.publication))];
}
