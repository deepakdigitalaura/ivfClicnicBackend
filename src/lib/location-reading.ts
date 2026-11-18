/* =====================================================================
 * Location reading lists - the Ahmedabad and Surat carousels
 * ---------------------------------------------------------------------
 * getBlogsByLocationSlug returns three posts, which suits a treatment page
 * but is thin for a city page. This is the curated, code-owned list the
 * reading carousel renders instead.
 *
 * Generated from the live CMS: every published post in the "ahmedabad",
 * "cme", "awards" and "vadodara-blogs" categories. Titles and blurbs come from the posts
 * themselves rather than being retyped, so they cannot drift from what the
 * blog actually says. Every slug is verified against sitemap.xml.
 *
 * `scope` is who the post is FOR, `tag` is what the card shows:
 *   scope "ahmedabad" - the city's own patient-facing and centre posts
 *   scope "surat"     - the same, for Surat
 *   scope "gujarat"   - CME, conference and award write-ups, read by both
 *
 * The CME tag names what a post IS rather than where it happened: most are
 * from the Gujarat network, but several report sessions elsewhere in India.
 *
 * NOTE: Surat currently has exactly ONE post of its own against Ahmedabad's
 * seventeen, so its carousel is mostly the shared Gujarat material. Writing
 * Surat city articles is the real fix; this file only renders what exists.
 * ===================================================================== */

export type ReadingItem = {
  slug: string;
  title: string;
  blurb: string;
  tag: string;
  scope: "ahmedabad" | "surat" | "gujarat";
};

export const LOCATION_READING: ReadingItem[] = [
  { slug: "best-ivf-hospitals-in-ahmedabad", title: "7 Best IVF Hospitals in Ahmedabad (2026 Guide)", blurb: "Choosing the right IVF hospital is a crucial step in the journey to parenthood.", tag: "Ahmedabad", scope: "ahmedabad" },
  { slug: "empowering-women-in-medicine-knowledge-sharing-program-on-advanced-fertility-and-ivf-techniques-at-nikol", title: "Advanced Fertility Techniques Program at Nikol", blurb: "In a remarkable event celebrating women in medicine, over 80 lady doctors gathered at a knowledge-sharing program organized by the Women Doctors…", tag: "Ahmedabad", scope: "ahmedabad" },
  { slug: "advancing-ovarian-science-a-full-day-scientific-program-in-surat", title: "Advancing Ovarian Science: A Program in Surat", blurb: "A full-day scientific program focusing on the ovary and its crucial role in fertility was successfully organized by Bavishi Fertility Institute in.", tag: "Surat", scope: "surat" },
  { slug: "bavishi-fertility-institute-nikol-ahmedabad-celebrates-its-first-anniversary", title: "Bavishi Fertility Nikol Celebrates First Anniversary", blurb: "Bavishi Fertility Institute, Nikol proudly celebrated its first anniversary on 29th January 2026, marking a significant milestone in its journey of…", tag: "Ahmedabad", scope: "ahmedabad" },
  { slug: "bavishi-fertility-institute-hosts-fogsi-recognized-training-program-in-ahmedabad", title: "Bavishi Hosts FOGSI-Recognized Training Program", blurb: "At Bavishi Fertility Institute, we are committed to advancing fertility care by nurturing knowledge, skill, and clinical excellence. In line with this.", tag: "Ahmedabad", scope: "ahmedabad" },
  { slug: "bavishi-fertility-institute-hosts-joint-educational-cme-with-east-ahmedabad-gynaecologist-association", title: "Bavishi Hosts Joint CME With East Ahmedabad Gynaecologists", blurb: "Bavishi Fertility Institute, in collaboration with the East Ahmedabad Gynaecologist Association, successfully organized a joint educational CME…", tag: "Ahmedabad", scope: "ahmedabad" },
  { slug: "celebrating-the-divine-joy-six-babies-born-on-janmashtami-at-bavishi-fertility-institute", title: "Celebrating the Divine Joy: Six Babies Born on Janmashtami at Bavishi Fertility Institute", blurb: "Janmashtami, the birth anniversary of Lord Krishna, is one of the most cherished festivals in India. It marks the arrival of the playful, divine child.", tag: "Ahmedabad", scope: "ahmedabad" },
  { slug: "government-vs-private-ivf-centres-in-ahmedabad-which-one-is-better", title: "Government vs Private IVF Centres in Ahmedabad", blurb: "In recent years, IVF (In Vitro Fertilization) has transformed the journey to parenthood for thousands of couples across India.", tag: "Ahmedabad", scope: "ahmedabad" },
  { slug: "how-does-the-climate-and-lifestyle-in-ahmedabad-affect-fertility", title: "How Ahmedabad's Climate & Lifestyle Affect Fertility", blurb: "Fertility is influenced not only by genetics and medical conditions but also by the environment and lifestyle we live in.", tag: "Ahmedabad", scope: "ahmedabad" },
  { slug: "how-to-choose-the-best-ivf-clinic-in-ahmedabad", title: "How to Choose the Best IVF Clinic in Ahmedabad", blurb: "Choosing the right IVF clinic is one of the most important decisions you'll make on your journey to parenthood.", tag: "Ahmedabad", scope: "ahmedabad" },
  { slug: "ivf-cost-in-ahmedabad-whats-included-how-to-plan-your-budget", title: "IVF Cost in Ahmedabad: What's Included & Budgeting", blurb: "When considering IVF (In Vitro Fertilization) in Ahmedabad, understanding the costs involved is crucial.", tag: "Ahmedabad", scope: "ahmedabad" },
  { slug: "success-rate-of-ivf-treatments-in-ahmedabad-what-to-expect-in-2025", title: "IVF Success Rates in Ahmedabad: 2025 Outlook", blurb: "IVF (In Vitro Fertilization) has brought the joy of parenthood to countless families in Ahmedabad.", tag: "Ahmedabad", scope: "ahmedabad" },
  { slug: "ivf-treatment-cost-in-ahmedabad-across-india", title: "IVF Treatment Cost in Ahmedabad & Across India", blurb: "At Bavishi Fertility Institute, we believe in complete transparency, affordability, and individualized fertility care. IVF treatment is a significant.", tag: "Ahmedabad", scope: "ahmedabad" },
  { slug: "male-infertility-treatment-options-in-ahmedabad-what-you-should-know", title: "Male Infertility Treatment Options in Ahmedabad", blurb: "Infertility is not just a female concern-male factors contribute to nearly 40-50% of all infertility cases.", tag: "Ahmedabad", scope: "ahmedabad" },
  { slug: "inauguration-of-our-new-branch-in-nikol", title: "New Bavishi Fertility Branch Opens in Nikol", blurb: "We are thrilled to announce the grand opening of our brand-new branch in Nikol! This expansion marks a significant milestone in our mission to make.", tag: "Ahmedabad", scope: "ahmedabad" },
  { slug: "team-excellence-and-innovation-at-bavishi-fertility-institute", title: "Team Excellence and Innovation at Bavishi Fertility Institute", blurb: "On December 19th, the dynamic team of Bavishi Fertility Institute convened for a pivotal meeting, emphasizing their unwavering commitment to…", tag: "Ahmedabad", scope: "ahmedabad" },
  { slug: "why-are-couples-from-other-cities-choosing-ahmedabad-for-ivf-treatment", title: "Why Couples Travel to Ahmedabad for IVF", blurb: "In recent years, Ahmedabad has emerged as one of the most trusted and preferred destinations for fertility treatments in India.", tag: "Ahmedabad", scope: "ahmedabad" },
  { slug: "why-dr-himanshu-bavishi-is-the-best-ivf-specialist-in-ahmedabad-and-india", title: "Why Dr. Himanshu Bavishi Leads IVF Care in India", blurb: "With 25+ years of experience and 30,000+ IVF babies, Dr. Himanshu Bavishi has set the benchmark for ethical, advanced and result-oriented fertility…", tag: "Ahmedabad", scope: "ahmedabad" },
  { slug: "celebrating-6-years-of-care-compassion-and-miracles-at-bavishi-fertility-institute-vadodara", title: "6 Years of Care at Bavishi Fertility, Vadodara", blurb: "At Bavishi Fertility Institute (BFI), Vadodara, we recently celebrated a remarkable milestone - six successful years of creating families and…", tag: "Gujarat", scope: "gujarat" },
  { slug: "bavishi-fertility-institute-conducts-a-successful-cme-program-at-bardoli", title: "Bavishi Conducts Successful CME Program at Bardoli", blurb: "Bavishi Fertility Institute recently organized a highly successful Continuing Medical Education (CME) program at Bardoli, which witnessed enthusiastic.", tag: "CME", scope: "gujarat" },
  { slug: "bavishi-fertility-institute-hosts-knowledge-sharing-program-with-bharuch-ob-gy-society", title: "Bavishi Fertility Institute hosts knowledge sharing program with Bharuch OB & GY Society", blurb: "Bavishi Fertility Institute, one of India's most trusted names in fertility care, recently conducted a highly successful and interactive academic…", tag: "CME", scope: "gujarat" },
  { slug: "bavishi-fertility-institute-mumbai-global-times-award-2026", title: "Bavishi Fertility Institute, Mumbai Honoured at the Global Times Awards 2026", blurb: "Bavishi Fertility Institute's Mumbai centre was presented an award for excellence and leadership in healthcare at the Global Times Awards ceremony in…", tag: "CME", scope: "gujarat" },
  { slug: "bavishi-fertility-institute-conducts-an-educational-programme-at-rajkot", title: "Bavishi Hosts Educational Program in Rajkot", blurb: "A landmark educational event was held on 21st September 2025 at Rajkot, bringing together specialist gynaecologist doctors for an engaging…", tag: "CME", scope: "gujarat" },
  { slug: "bfi-rajkot-obstetrics-gynaecological-society-infertility-conference-2026", title: "BFI and Rajkot Obstetrics & Gynaecological Society Hold a Full-Day Infertility Conference", blurb: "Bavishi Fertility Institute and the Rajkot Obstetrics and Gynaecological Society held a full-day conference on infertility and IVF in Rajkot on 1…", tag: "CME", scope: "gujarat" },
  { slug: "cme-program-on-infertility-management-successfully-conducted-at-idar", title: "CME Program on Infertility Management Held at Idar", blurb: "A Continuing Medical Education (CME) program was successfully conducted on 27 January 2026 at Idar, under the aegis of the Indian Medical Association…", tag: "CME", scope: "gujarat" },
  { slug: "dr-falguni-bavishi-at-sogog-conference-on-iui-success", title: "Dr. Falguni Bavishi on IUI Success at SOGOG", blurb: "At Bavishi Fertility Institute, we are proud to announce that Dr. Falguni Bavishi, our esteemed fertility expert, was invited as a distinguished…", tag: "CME", scope: "gujarat" },
  { slug: "dr-himanshu-bavishi-aogs-2026-recurrent-pregnancy-loss-panel", title: "Dr. Himanshu Bavishi Moderates Panel on Recurrent Pregnancy Loss at AOGS Annual Conference 2026", blurb: "Dr. Himanshu Bavishi moderated a panel discussion on 'Recurrent Pregnancy Loss: Current Controversies' with senior gynaecologists at the AOGS Annual…", tag: "CME", scope: "gujarat" },
  { slug: "dr-himanshu-bavishi-social-medical-egg-freezing-vadodara-bogs-isar", title: "Dr. Himanshu Bavishi on Egg Freezing at BOGS x ISAR", blurb: "Dr. Himanshu Bavishi addressed gynaecologists at a joint BOGS x ISAR Gujarat Chapter scientific meet in Vadodara, sharing BFI's clinical perspective…", tag: "CME", scope: "gujarat" },
  { slug: "dr-himanshu-bavishi-progesterone-in-womens-health-gangtok", title: "Dr. Himanshu Bavishi on Progesterone in Women's Health at a National Fertility Conference", blurb: "Dr. Himanshu Bavishi delivered a session on \"Progesterone in Women's Health\" at a national fertility conference in Gangtok on 10 October 2026…", tag: "CME", scope: "gujarat" },
  { slug: "dr-himanshu-bavishi-speaks-on-ivf-at-sogog-conference", title: "Dr. Himanshu Bavishi Speaks on IVF at SOGOG", blurb: "Dr. Himanshu Bavishi, the esteemed founder and leading fertility expert at Bavishi Fertility Institute, was honored to be invited as an authority…", tag: "CME", scope: "gujarat" },
  { slug: "insights-on-fertility-dr-bavishi-team-at-palanpur-society", title: "Insights on Fertility: Dr. Bavishi Team at Palanpur Society", blurb: "Dr. Himanshu Bavishi, Dr. Falguni Bavishi, and Dr. Parth Bavishi had the honor of being invited by the Palanpur Obstetrics and Gynaecologist Society…", tag: "CME", scope: "gujarat" },
  { slug: "ivf-babies-meet-in-vadodara-a-momentous-event-creating-awareness", title: "IVF Babies Meet-Up Raises Awareness in Vadodara", blurb: "In an inspiring event that marked a milestone in the history of Vadodara, Bavishi Fertility Institute brought together over 100 IVF (test-tube)…", tag: "Gujarat", scope: "gujarat" },
  { slug: "r-j-lajja-of-my-fm-taking-interview-of-dr-parth-bavishi", title: "RJ Lajja of My FM taking interview of Dr Parth Bavishi", blurb: "Renowned radio host RJ Lajja from My FM recently conducted an insightful interview with Dr. Parth Bavishi, a leading fertility specialist.", tag: "CME", scope: "gujarat" },
  { slug: "bavishi-fertility-institute-honoured-at-times-healthcare-leaders-awards-2025", title: "Bavishi Fertility Institute Honoured at Times Healthcare Leaders Awards 2025", blurb: "We are thrilled to announce that Bavishi Fertility Institute has been named a winner at the prestigious Times Healthcare Leaders Awards 2025…", tag: "Awards", scope: "gujarat" },
  { slug: "bavishi-fertility-institute-wins-patient-centric-hospital-award", title: "Bavishi Fertility Institute Wins \\\"Patient-Centric Hospital Award\\\"", blurb: "Bavishi Fertility Institute is honored to receive the prestigious \"Patient-Centric Hospital in Reproductive Health\" award at the IHW Patient First…", tag: "Awards", scope: "gujarat" },
  { slug: "bavishi-fertility-institute-wins-ivf-chain-of-the-year-west-for-5th-time", title: "Bavishi Fertility Institute Wins IVF Chain of the Year - West for 5th Time!", blurb: "Bavishi Fertility Institute is honored to receive the IVF Chain of the Year - West award by Economic Times for the fifth consecutive year.", tag: "Awards", scope: "gujarat" },
  { slug: "bavishi-fertility-institute-recognized-as-the-leading-ivf-chain-of-gujarat-by-radio-city", title: "Bavishi Named Leading IVF Chain of Gujarat", blurb: "We are thrilled to share a proud moment in our journey of delivering hope and creating families.", tag: "Awards", scope: "gujarat" },
  { slug: "bavishi-fertility-institute-most-trusted-fertility-chain-hospital-in-gujarat", title: "Bavishi: Most Trusted Fertility Chain in Gujarat", blurb: "Bavishi Fertility Institute has been awarded the title of Most Trusted Fertility Chain Hospital in Gujarat, featured on News18 Gujarati.", tag: "Awards", scope: "gujarat" },
  { slug: "dr-parth-bavishi-honoured-with-the-prestigious-achiever-award-at-fertivision-2025", title: "Dr. Parth Bavishi Honoured with the Prestigious Achiever Award at Fertivision 2025", blurb: "The Indian Fertility Society (IFS), a nationally respected professional body representing IVF doctors and embryologists across India, recognizes…", tag: "Awards", scope: "gujarat" },
  { slug: "dr-parth-bavishi-wins-bharat-excellence-award-for-ivf", title: "Dr. Parth Bavishi Wins Bharat Excellence Award for IVF", blurb: "Dr. Parth Bavishi was honored with the esteemed Bharat Excellence Award for his exceptional contributions to the field of Infertility and IVF.", tag: "Awards", scope: "gujarat" },
];

const forScope = (city: "ahmedabad" | "surat", max: number) =>
  LOCATION_READING.filter((p) => p.scope === city || p.scope === "gujarat").slice(0, max);

/** Ahmedabad's own posts first, then the shared Gujarat write-ups. */
export const ahmedabadReading = (max = 60): ReadingItem[] => forScope("ahmedabad", max);

/** Surat's own post first, then the shared Gujarat write-ups. */
export const suratReading = (max = 60): ReadingItem[] => forScope("surat", max);

/** The list for a location page, or [] for a city with nothing scoped to it
 *  (which hides the carousel rather than showing another city's articles). */
export const readingForCity = (citySlug: string, max = 60): ReadingItem[] =>
  citySlug === "ahmedabad" ? ahmedabadReading(max)
  : citySlug === "surat" ? suratReading(max)
  : [];
