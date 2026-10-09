/**
 * Maps a blog's category to the page that category is really about, so every
 * article can link back to its parent treatment.
 *
 * Blogs carry 2,543 organic visits a month between them; the treatment pages
 * carry 134. Readers land on an article and have no route onward to the page
 * that actually answers "can you treat this for me" — there is no such link
 * today. This gives each article exactly one, chosen from the category it
 * already has, so nothing has to be tagged by hand.
 *
 * Every destination below was checked against the live site. Categories that
 * are not about a treatment — conference write-ups, awards, uncategorised —
 * map to null on purpose: a forced link to a loosely related treatment page is
 * worse than no link, both for the reader and as a relevance signal.
 */

export type ParentTopic = {
  /** Path on this site. */
  href: string;
  /** Link text — the treatment's own name, never "click here". */
  label: string;
  /** One line explaining the connection, shown beside the link. */
  blurb: string;
};

const T = (slug: string, label: string, blurb: string): ParentTopic => ({
  href: `/treatments/${slug}`,
  label,
  blurb,
});

const PARENT_BY_CATEGORY: Record<string, ParentTopic | null> = {
  // ── category slug matches the treatment slug ──────────────────────────
  ivf: T("ivf", "IVF Treatment", "How IVF works at Bavishi, step by step."),
  "female-infertility": T(
    "female-infertility",
    "Female Infertility",
    "How female infertility is investigated and treated.",
  ),
  "male-infertility": T(
    "male-infertility",
    "Male Infertility",
    "How male-factor infertility is investigated and treated.",
  ),
  iui: T("iui", "IUI Treatment", "How IUI works, who it suits, and what it costs."),
  icsi: T("icsi", "ICSI Treatment", "How a single sperm is injected into the egg."),
  pcos: T("pcos", "PCOS Treatment", "How PCOS is managed when you are trying to conceive."),
  pgt: T("pgt", "PGT — Genetic Testing", "How embryos are screened before transfer."),
  endometriosis: T(
    "endometriosis",
    "Endometriosis Treatment",
    "How endometriosis is treated when fertility is the goal.",
  ),
  "ivf-failure": T(
    "ivf-failure",
    "After a Failed IVF Cycle",
    "How a failed cycle is analysed before trying again.",
  ),
  "ovarian-rejuvenation": T(
    "ovarian-rejuvenation",
    "Ovarian Rejuvenation",
    "Who ovarian PRP may help, assessed honestly.",
  ),
  azoospermia: T(
    "azoospermia",
    "Azoospermia Treatment",
    "What can be done when there is no sperm in the semen.",
  ),
  "ovarian-reserve": T(
    "ovarian-reserve",
    "Low Ovarian Reserve",
    "What the numbers mean, and which protocols suit a low reserve.",
  ),

  // ── category name differs from the treatment slug ─────────────────────
  fibroid: T("fibroids", "Uterine Fibroids", "Which fibroids affect conception, and how they're treated."),
  "low-amh": T(
    "ovarian-reserve",
    "Low AMH & Ovarian Reserve",
    "What a low AMH actually means for your treatment plan.",
  ),
  freezing: T(
    "egg-freezing",
    "Egg Freezing",
    "How eggs are frozen, the best age, and what affects success.",
  ),
  "female-egg-quality": T(
    "ovarian-reserve",
    "Egg Quality & Ovarian Reserve",
    "How egg quality is assessed, and what can be done about it.",
  ),

  // ── maternity sits under /services, not /treatments ───────────────────
  maternity: {
    href: "/services/normal-delivery",
    label: "Maternity Services",
    blurb: "The full range of maternity and birthing care at Bavishi.",
  },
  "diet-chart-for-pregnant-lady": {
    href: "/services/high-risk-pregnancy-care",
    label: "Pregnancy Care",
    blurb: "How your pregnancy is monitored at Bavishi.",
  },

  // ── city round-ups point at the centre, not a treatment ───────────────
  ahmedabad: {
    href: "/locations/ahmedabad",
    label: "Our Ahmedabad Centre",
    blurb: "Timings, address and contact details for Ahmedabad.",
  },
  mumbai: {
    href: "/locations/mumbai",
    label: "Our Mumbai Centres",
    blurb: "Timings, addresses and contact details across Mumbai.",
  },
  "vadodara-blogs": {
    href: "/locations/vadodara",
    label: "Our Vadodara Centre",
    blurb: "Timings, address and contact details for Vadodara.",
  },

  // ── deliberately no parent link ───────────────────────────────────────
  cme: null,            // conference and training write-ups
  awards: null,         // award announcements
  uncategorized: null,  // nothing reliable to point at
};

/** The parent page for a blog's category, or null if it has no sensible one. */
export const parentTopicFor = (categorySlug?: string | null): ParentTopic | null =>
  (categorySlug && PARENT_BY_CATEGORY[categorySlug]) || null;
