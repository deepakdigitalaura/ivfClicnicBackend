/* =====================================================================
 * Ahmedabad reading list — city and centre pages
 * ---------------------------------------------------------------------
 * getBlogsByLocationSlug returns three posts, which suits a treatment
 * page but is thin for a city with fifteen articles of its own plus the
 * Gujarat CME and conference write-ups. This is the curated, code-owned
 * list the reading carousel renders instead.
 *
 * Titles and blurbs are copied from the live posts rather than retyped,
 * so they cannot drift from what the blog actually says. Every slug is
 * verified against sitemap.xml.
 *
 * tag "Ahmedabad" = the city own patient-facing and centre posts
 * tag "Gujarat"   = CME, conference and recognition write-ups from the
 *                   wider Gujarat network
 * ===================================================================== */

export type ReadingItem = { slug: string; title: string; blurb: string; tag: string };

export const AHMEDABAD_READING: ReadingItem[] = [
  { slug: "best-ivf-hospitals-in-ahmedabad", title: "7 Best IVF Hospitals in Ahmedabad (2026 Guide)", blurb: "A researched comparison of Ahmedabad's leading IVF hospitals — success rates, technology, and w", tag: "Ahmedabad" },
  { slug: "ivf-cost-in-ahmedabad-whats-included-how-to-plan-your-budget", title: "IVF Cost in Ahmedabad: What's Included & Budgeting", blurb: "A transparent look at what's included in IVF cost in Ahmedabad, and how to plan your budget rea", tag: "Ahmedabad" },
  { slug: "ivf-treatment-cost-in-ahmedabad-across-india", title: "IVF Treatment Cost in Ahmedabad & Across India", blurb: "A realistic breakdown of IVF costs in Ahmedabad compared to other major Indian cities.", tag: "Ahmedabad" },
  { slug: "how-to-choose-the-best-ivf-clinic-in-ahmedabad", title: "How to Choose the Best IVF Clinic in Ahmedabad", blurb: "The key factors to consider when choosing an IVF clinic in Ahmedabad.", tag: "Ahmedabad" },
  { slug: "success-rate-of-ivf-treatments-in-ahmedabad-what-to-expect-in-2025", title: "IVF Success Rates in Ahmedabad: 2025 Outlook", blurb: "What to realistically expect from IVF success rates in Ahmedabad this year.", tag: "Ahmedabad" },
  { slug: "male-infertility-treatment-options-in-ahmedabad-what-you-should-know", title: "Male Infertility Treatment Options in Ahmedabad", blurb: "What men should know about the male infertility treatment options available in Ahmedabad.", tag: "Ahmedabad" },
  { slug: "government-vs-private-ivf-centres-in-ahmedabad-which-one-is-better", title: "Government vs Private IVF Centres in Ahmedabad", blurb: "An honest comparison of government and private IVF centres in Ahmedabad — cost, care, and outco", tag: "Ahmedabad" },
  { slug: "why-are-couples-from-other-cities-choosing-ahmedabad-for-ivf-treatment", title: "Why Couples Travel to Ahmedabad for IVF", blurb: "What's drawing couples from other cities specifically to Ahmedabad for IVF treatment.", tag: "Ahmedabad" },
  { slug: "how-does-the-climate-and-lifestyle-in-ahmedabad-affect-fertility", title: "How Ahmedabad's Climate & Lifestyle Affect Fertility", blurb: "Whether Ahmedabad's climate and lifestyle genuinely have an impact on fertility.", tag: "Ahmedabad" },
  { slug: "why-dr-himanshu-bavishi-is-the-best-ivf-specialist-in-ahmedabad-and-india", title: "Why Dr. Himanshu Bavishi Leads IVF Care in India", blurb: "What sets Dr. Himanshu Bavishi apart as a leading IVF specialist in Ahmedabad and across India.", tag: "Ahmedabad" },
  { slug: "bavishi-fertility-institute-nikol-ahmedabad-celebrates-its-first-anniversary", title: "Bavishi Fertility Nikol Celebrates First Anniversary", blurb: "Bavishi Fertility Institute's Nikol, Ahmedabad centre marks its first year serving patients.", tag: "Ahmedabad" },
  { slug: "inauguration-of-our-new-branch-in-nikol", title: "New Bavishi Fertility Branch Opens in Nikol", blurb: "Bavishi Fertility Institute inaugurates a new centre in Nikol, Ahmedabad.", tag: "Ahmedabad" },
  { slug: "empowering-women-in-medicine-knowledge-sharing-program-on-advanced-fertility-and-ivf-techniques-at-nikol", title: "Advanced Fertility Techniques Program at Nikol", blurb: "A knowledge-sharing program on advanced fertility and IVF techniques held at Nikol.", tag: "Ahmedabad" },
  { slug: "bavishi-fertility-institute-hosts-fogsi-recognized-training-program-in-ahmedabad", title: "Bavishi Hosts FOGSI-Recognized Training Program", blurb: "Bavishi Fertility Institute hosts a FOGSI-recognised training program for medical professionals", tag: "Ahmedabad" },
  { slug: "bavishi-fertility-institute-hosts-joint-educational-cme-with-east-ahmedabad-gynaecologist-association", title: "Bavishi Hosts Joint CME With East Ahmedabad Gynaecologists", blurb: "Bavishi Fertility Institute hosts a joint educational CME with the East Ahmedabad Gynaecologist", tag: "Ahmedabad" },
  { slug: "advancing-ovarian-science-a-full-day-scientific-program-in-surat", title: "Advancing Ovarian Science: A Program in Surat", blurb: "A full-day scientific program on advancing ovarian science held in Surat.", tag: "Gujarat" },
  { slug: "bavishi-fertility-institute-conducts-a-successful-cme-program-at-bardoli", title: "Bavishi Conducts Successful CME Program at Bardoli", blurb: "Bavishi Fertility Institute conducts a successful CME program at Bardoli.", tag: "Gujarat" },
  { slug: "bavishi-fertility-institute-conducts-an-educational-programme-at-rajkot", title: "Bavishi Hosts Educational Program in Rajkot", blurb: "Bavishi Fertility Institute conducts an educational programme for medical professionals in Rajk", tag: "Gujarat" },
  { slug: "cme-program-on-infertility-management-successfully-conducted-at-idar", title: "CME Program on Infertility Management Held at Idar", blurb: "A CME program on infertility management successfully conducted at Idar.", tag: "Gujarat" },
  { slug: "bfi-rajkot-obstetrics-gynaecological-society-infertility-conference-2026", title: "BFI and Rajkot Obstetrics & Gynaecological Society Hold a Full-Day Infertility Conference", blurb: "Bavishi Fertility Institute and the Rajkot Obstetrics and Gynaecological Society held a full-da", tag: "Gujarat" },
  { slug: "dr-falguni-bavishi-at-sogog-conference-on-iui-success", title: "Dr. Falguni Bavishi on IUI Success at SOGOG", blurb: "Dr. Falguni Bavishi presents on IUI success rates at the SOGOG conference.", tag: "Gujarat" },
  { slug: "dr-himanshu-bavishi-speaks-on-ivf-at-sogog-conference", title: "Dr. Himanshu Bavishi Speaks on IVF at SOGOG", blurb: "Dr. Himanshu Bavishi shares insights on IVF at the SOGOG conference.", tag: "Gujarat" },
  { slug: "dr-himanshu-bavishi-social-medical-egg-freezing-vadodara-bogs-isar", title: "Dr. Himanshu Bavishi on Egg Freezing at BOGS x ISAR", blurb: "Dr. Himanshu Bavishi speaks on social and medical egg freezing at the Vadodara BOGS x ISAR meet", tag: "Gujarat" },
  { slug: "bavishi-fertility-institute-most-trusted-fertility-chain-hospital-in-gujarat", title: "Bavishi: Most Trusted Fertility Chain in Gujarat", blurb: "Why Bavishi Fertility Institute is recognised as the most trusted fertility chain hospital in G", tag: "Gujarat" },
  { slug: "bavishi-fertility-institute-recognized-as-the-leading-ivf-chain-of-gujarat-by-radio-city", title: "Bavishi Named Leading IVF Chain of Gujarat", blurb: "Bavishi Fertility Institute recognised as the leading IVF chain of Gujarat by Radio City.", tag: "Gujarat" },
  { slug: "celebrating-6-years-of-care-compassion-and-miracles-at-bavishi-fertility-institute-vadodara", title: "6 Years of Care at Bavishi Fertility, Vadodara", blurb: "Bavishi Fertility Institute's Vadodara centre celebrates 6 years of patient care and successful", tag: "Gujarat" },
  { slug: "ivf-babies-meet-in-vadodara-a-momentous-event-creating-awareness", title: "IVF Babies Meet-Up Raises Awareness in Vadodara", blurb: "A momentous IVF babies meet-up in Vadodara raises awareness about fertility treatment.", tag: "Gujarat" },
];

/** Ahmedabad posts first, then the wider Gujarat write-ups. */
export const ahmedabadReading = (max = 30): ReadingItem[] =>
  [...AHMEDABAD_READING]
    .sort((a, b) => Number(a.tag !== "Ahmedabad") - Number(b.tag !== "Ahmedabad"))
    .slice(0, max);
