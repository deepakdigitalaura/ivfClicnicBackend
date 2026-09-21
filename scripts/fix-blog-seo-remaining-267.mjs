#!/usr/bin/env node
// Fills SEO Meta Title/Description and Social Share Title/Description on the
// 267 published blog posts that were missing at least one of these 4 fields,
// found in the 21 Sep 2026 full-site audit (282 of 283 published blogs were
// missing at least one; 250 were missing all four; the remaining 16 were
// already handled in earlier batches -- see fix-title-meta-priority-pages.mjs
// and fix-blog-seo-batch-1.mjs).
//
// Social Share Title/Description are set equal to SEO Meta Title/Description
// per post -- standard practice, keeps this one title + one description per
// post to draft and review instead of four separate strings each.
//
// Usage: node scripts/fix-blog-seo-remaining-267.mjs [--dry-run]
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;
const dryRun = process.argv.includes("--dry-run");

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN env vars");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

const posts = [
  { slug: "understanding-sperm-cramps-symptoms-causes-diagnosis-treatment", title: "Sperm Cramps: Is It Real? Causes, Symptoms & Relief", desc: "Yes, sperm cramps are real. Here's what causes them, how to tell if it's normal, and when the pain means something more." },
  { slug: "how-letrozole-works-a-comprehensive-guide-to-boosting-ovulation-for-fertility", title: "Letrozole for Fertility: How It Works & What to Expect", desc: "How letrozole boosts ovulation, who it works best for, and what results to expect — explained simply by fertility specialists." },
  { slug: "post-embryo-transfer-timeline-what-happens-after-3-5-7-and-9-days", title: "Post-Embryo Transfer Timeline: Day 3, 5, 7 & 9", desc: "What's actually happening in your body 3, 5, 7, and 9 days after embryo transfer, and which symptoms are truly normal." },
  { slug: "how-long-does-it-take-for-letrozole-to-get-out-of-your-system", title: "How Long Does Letrozole Stay In Your System?", desc: "Fully cleared in 10–14 days — with a half-life of about 2 days. Here's the full timeline, hour by hour and day by day." },
  { slug: "the-postpartum-journey-how-long-does-it-take-to-heal-after-giving-birth", title: "How Long Does It Take to Heal After Giving Birth?", desc: "A realistic postpartum healing timeline — what to expect week by week, and when to call your doctor." },
  { slug: "when-to-take-a-pregnancy-test-after-iui-timing-and-accuracy-explained", title: "When to Take a Pregnancy Test After IUI", desc: "The right day to test after IUI for accurate results, and why testing too early can give a false negative." },
  { slug: "uterine-fibroids-symptoms-causes-and-treatment", title: "Uterine Fibroids: Symptoms, Causes & Treatment", desc: "How to recognise fibroid symptoms, what causes them, and the full range of treatment options available today." },
  { slug: "iui-side-effects-on-the-body-and-emotions-a-complete-guide", title: "IUI Side Effects: Physical and Emotional Guide", desc: "What IUI actually feels like — the physical side effects and the emotional ups and downs — explained honestly." },
  { slug: "understanding-hypospermia-signs-symptoms-and-treatment-options", title: "Hypospermia: Signs, Symptoms & Treatment", desc: "Low semen volume explained — what causes hypospermia, how it's diagnosed, and treatment options that can help." },
  { slug: "how-human-fertilization-works-step-by-step-explanation", title: "How Human Fertilization Works, Step by Step", desc: "From ovulation to fertilisation — a clear, step-by-step explanation of exactly how conception happens." },
  { slug: "necrozoospermia-symptoms-causes-and-treatment-options", title: "Necrozoospermia: Symptoms, Causes & Treatment", desc: "When sperm appear dead on a semen analysis — what necrozoospermia means, why it happens, and how it's treated." },
  { slug: "how-low-amh-affects-menstrual-cycle-regularity", title: "How Low AMH Affects Your Menstrual Cycle", desc: "Does low AMH change your cycle length or regularity? Here's what the science actually says." },
  { slug: "how-to-improve-your-chances-of-conceiving-naturally-with-low-amh-levels", title: "Conceiving Naturally With Low AMH: Is It Possible?", desc: "Low AMH doesn't rule out natural conception. Practical ways to improve your chances, explained by specialists." },
  { slug: "can-endometriosis-come-back-after-surgery-recurrence-rates-prevention-tips", title: "Can Endometriosis Come Back After Surgery?", desc: "Real recurrence rates after endometriosis surgery, and practical steps that may help lower your risk." },
  { slug: "celebrating-the-divine-joy-six-babies-born-on-janmashtami-at-bavishi-fertility-institute", title: "Six Babies Born on Janmashtami at Bavishi Fertility", desc: "A heartwarming look at six babies born on Janmashtami at Bavishi Fertility Institute — a celebration of new life." },
  { slug: "best-ivf-hospitals-in-ahmedabad", title: "7 Best IVF Hospitals in Ahmedabad (2026 Guide)", desc: "A researched comparison of Ahmedabad's leading IVF hospitals — success rates, technology, and what sets each apart." },
  { slug: "how-does-letrozole-help-with-ovulation-and-pregnancy", title: "How Does Letrozole Help With Ovulation?", desc: "How letrozole triggers ovulation, who it's prescribed for, and how it compares to other fertility medications." },
  { slug: "nourishing-your-body-after-embryo-transfer-a-comprehensive-guide", title: "What to Eat After Embryo Transfer: Full Guide", desc: "Foods that support implantation after embryo transfer, and what's best to avoid during the two-week wait." },
  { slug: "why-dont-embryos-stick-key-reasons-you-need-to-know", title: "Why Don't Embryos Stick? Key Reasons Explained", desc: "The main reasons a healthy-looking embryo may not implant, and what can be done to improve the odds next time." },
  { slug: "how-does-follicle-count-affect-ivf-success-rates", title: "How Follicle Count Affects IVF Success Rates", desc: "Why the number of follicles matters for IVF outcomes, and what a low or high count really means for your cycle." },
  { slug: "understanding-frozen-embryo-transfer-fet-in-ivf", title: "Frozen Embryo Transfer (FET): Complete Guide", desc: "How frozen embryo transfer works, how it compares to fresh transfer, and why many clinics now prefer it." },
  { slug: "endometrial-lining-remedies-for-abnormal-thickness", title: "Endometrial Lining: Remedies for Abnormal Thickness", desc: "What counts as an abnormal endometrial lining, and the treatments that can help thicken or normalise it before transfer." },
  { slug: "twin-pregnancy-delivery-options-normal-delivery-vs-c-section", title: "Twin Pregnancy: Normal Delivery vs C-Section", desc: "How doctors decide between normal delivery and C-section for twins, and what factors matter most for a safe birth." },
  { slug: "what-is-the-max-number-of-eggs-that-you-can-retrieve-in-an-ivf-cycle", title: "Max Number of Eggs Retrieved in an IVF Cycle", desc: "How many eggs is \"normal\" in one IVF cycle, what affects the number, and why more isn't always better." },
  { slug: "dos-and-donts-during-ivf-stimulation-a-comprehensive-guide", title: "Do's and Don'ts During IVF Stimulation: Full Guide", desc: "What to do — and avoid — during the IVF stimulation phase, from diet to activity, explained by fertility specialists." },
  { slug: "azoospermia-can-you-have-a-baby-with-zero-sperm-count", title: "Azoospermia: Can You Have a Baby With Zero Sperm Count?", desc: "Zero sperm count in a semen analysis doesn't mean no biological children. Real options explained clearly." },
  { slug: "ivf-pregnancy-week-by-week-symptoms-and-safety", title: "IVF Pregnancy Week by Week: Symptoms & Safety", desc: "What to expect week by week after an IVF pregnancy, and the safety precautions worth knowing early on." },
  { slug: "stories-from-indian-celebrities-of-egg-freezing", title: "Indian Celebrities Who Chose Egg Freezing", desc: "How Indian celebrities have opened up about egg freezing, and what their stories reveal about the choice." },
  { slug: "understanding-the-success-rate-of-ivf-treatment", title: "Understanding IVF Success Rates: What to Know", desc: "What IVF success rates actually mean, how they're calculated, and the factors that influence yours specifically." },
  { slug: "choosing-between-a-day-5-vs-day-3-embryo-transfer", title: "Day 5 vs Day 3 Embryo Transfer: Which Is Better?", desc: "How doctors decide between a day 3 and day 5 (blastocyst) transfer, and what the evidence says about success rates." },
  { slug: "essential-precautions-to-take-after-embryo-transfer-for-ivf-success", title: "Precautions to Take After Embryo Transfer", desc: "The do's and don'ts that genuinely matter after embryo transfer, and which common restrictions are actually myths." },
  { slug: "asthenospermia-understanding-the-condition-and-exploring-assisted-reproductive-technologies-art-options", title: "Asthenospermia: Causes, Symptoms & Treatment Options", desc: "Low sperm motility explained — what causes it, how it's diagnosed, and the ART treatments that can help you conceive." },
  { slug: "trying-to-conceive-after-40-what-you-need-to-know", title: "Trying to Conceive After 40: What to Know", desc: "Realistic fertility expectations after 40, and the treatment options that can genuinely improve your chances." },
  { slug: "foods-to-avoid-during-pregnancy-and-why", title: "Foods to Avoid During Pregnancy, and Why", desc: "A clear list of foods to avoid in pregnancy and the specific health risks behind each one." },
  { slug: "complete-pregnancy-diet-chart-by-trimester-what-to-eat-in-the-first-second-third-trimester", title: "Pregnancy Diet Chart by Trimester: What to Eat", desc: "A trimester-by-trimester pregnancy diet chart — what to eat, what to avoid, and why it changes as your baby grows." },
  { slug: "blighted-ovum-symptoms-causes-and-more", title: "Blighted Ovum: Symptoms, Causes and More", desc: "What a blighted ovum is, how it's diagnosed, why it happens, and what it means for future pregnancies." },
  { slug: "fibroids-in-young-women-and-teenagers-early-symptoms-and-myths", title: "Fibroids in Young Women & Teenagers: Symptoms & Myths", desc: "Fibroids aren't just an older-age condition. Early symptoms, common myths, and when to see a doctor — explained simply." },
  { slug: "iui-process-explained-what-to-expect-at-every-step", title: "The IUI Process: What to Expect at Every Step", desc: "A step-by-step walkthrough of the IUI process, from initial consultation to the two-week wait." },
  { slug: "breaking-free-from-varicocele-pain-3-innovative-ways-to-find-relief", title: "Varicocele Pain Relief: 3 Effective Approaches", desc: "Three genuinely effective ways to manage varicocele pain, from home care to minimally invasive treatment." },
  { slug: "what-is-the-relationship-between-pcos-and-amh-level", title: "PCOS and AMH: What's the Connection?", desc: "Why women with PCOS often have higher AMH levels, and what that actually means for your fertility." },
  { slug: "importance-of-folic-acid-before-and-during-pregnancy", title: "Why Folic Acid Matters Before & During Pregnancy", desc: "How much folic acid you need, when to start taking it, and the birth defects it helps protect against." },
  { slug: "the-miracle-of-implantation-recognizing-the-signs", title: "Signs of Implantation: What to Look For", desc: "The early signs of implantation, how they differ from PMS, and when it's realistic to expect them." },
  { slug: "how-male-infertility-affects-ivf-treatment", title: "How Male Infertility Affects IVF Treatment", desc: "Why male-factor infertility changes the IVF approach, and the specific techniques used to work around it." },
  { slug: "icsi-vs-ivf-success-rates-benefits-and-risks-compared", title: "ICSI vs IVF: Success Rates, Benefits & Risks", desc: "A side-by-side comparison of ICSI and conventional IVF — success rates, costs, and who actually needs which." },
  { slug: "how-does-the-number-of-eggs-affect-ivf-success-rate", title: "How Egg Number Affects IVF Success Rate", desc: "Why more eggs generally means better odds in IVF, and where the real limits of that relationship are." },
  { slug: "prp-ovarian-rejuvenation-boosting-egg-quality-and-fertility", title: "PRP Ovarian Rejuvenation: Does It Boost Fertility?", desc: "How PRP ovarian rejuvenation works, who it's suited for, and what the evidence says about egg quality improvement." },
  { slug: "how-to-get-pregnant-without-removing-fibroid-or-without-surgery", title: "Can You Get Pregnant With Fibroids, Without Surgery?", desc: "Yes, often. When fibroids need removal before conceiving, and when they don't — explained by fertility specialists." },
  { slug: "why-do-some-embryos-not-implant-even-if-they-look-healthy", title: "Why Healthy-Looking Embryos Don't Always Implant", desc: "Embryo grading isn't the full story. The other factors that determine whether implantation succeeds." },
  { slug: "common-risks-in-twin-pregnancy-and-how-do-doctors-manage-them", title: "Twin Pregnancy Risks and How Doctors Manage Them", desc: "The most common risks in a twin pregnancy, and the monitoring and care that keeps both babies safe." },
  { slug: "understanding-thin-endometrium-causes-impact-and-treatment-options", title: "Thin Endometrium: Causes, Impact & Treatment", desc: "What causes a thin uterine lining, how it affects implantation, and the treatments that can help thicken it." },
  { slug: "how-do-male-fertility-supplements-impact-ivf-results", title: "Do Male Fertility Supplements Improve IVF Results?", desc: "Which male fertility supplements have real evidence behind them, and which are mostly marketing." },
  { slug: "the-connection-between-quality-sleep-and-ivf-success-a-hormonal-perspective", title: "Sleep and IVF Success: The Hormonal Link", desc: "How poor sleep affects the hormones involved in IVF, and simple changes that may improve your outcomes." },
  { slug: "fibroids-and-diet-foods-that-may-help-manage-symptoms-naturally", title: "Fibroids and Diet: Foods That May Help Manage Symptoms", desc: "Can diet really help manage fibroid symptoms? Foods that may help, and what the evidence actually says." },
  { slug: "how-to-improve-ovulation-naturally-when-you-have-pcos", title: "Improving Ovulation Naturally With PCOS", desc: "Practical, evidence-based ways to support regular ovulation when you have PCOS." },
  { slug: "secondary-infertility-why-getting-pregnant-again-can-be-hard", title: "Secondary Infertility: Why It Happens", desc: "Why conceiving a second time can be harder than the first, and when it's worth seeing a specialist." },
  { slug: "is-ivf-painful", title: "Is IVF Painful? What to Actually Expect", desc: "A honest, step-by-step look at which parts of IVF involve discomfort, and which don't." },
  { slug: "natural-iui-vs-medicated-iui-which-is-more-effective", title: "Natural IUI vs Medicated IUI: Which Works Better?", desc: "How natural-cycle and medicated IUI compare in success rates, cost, and who each is better suited for." },
  { slug: "how-long-should-you-see-a-gynecologist-after-delivery", title: "When to See a Gynecologist After Delivery", desc: "The recommended postpartum check-up timeline, and warning signs that mean you shouldn't wait." },
  { slug: "how-to-prepare-for-your-first-iui-cycle-tips-and-advice", title: "Preparing for Your First IUI Cycle: Tips & Advice", desc: "Practical steps to prepare for your first IUI cycle, from lifestyle changes to what to expect on the day." },
  { slug: "ivf-treatment-cost-in-ahmedabad-across-india", title: "IVF Treatment Cost in Ahmedabad & Across India", desc: "A realistic breakdown of IVF costs in Ahmedabad compared to other major Indian cities." },
  { slug: "indian-celebrities-who-improved-fertility-through-yoga", title: "Indian Celebrities Who Improved Fertility With Yoga", desc: "How yoga has helped Indian celebrities support their fertility, and the science behind it." },
  { slug: "how-do-thyroid-disorders-affect-fertility-in-women", title: "How Thyroid Disorders Affect Fertility in Women", desc: "The link between thyroid function and fertility, and how thyroid disorders are managed during treatment." },
  { slug: "ivf-after-age-40-realistic-success-rates-and-treatment-strategies", title: "IVF After 40: Realistic Success Rates & Strategies", desc: "Honest IVF success rates after 40, and the treatment strategies that can improve your specific odds." },
  { slug: "high-risk-pregnancy-due-to-diabetes-bp-thyroid-disorders", title: "High-Risk Pregnancy Due to Diabetes, BP & Thyroid", desc: "How diabetes, high blood pressure, and thyroid disorders affect pregnancy risk — and how they're managed safely." },
  { slug: "risks-and-benefits-of-laser-assisted-hatching-in-ivf", title: "Laser Assisted Hatching: Risks and Benefits", desc: "How laser assisted hatching works, who benefits most from it, and the risks worth knowing about." },
  { slug: "ovarian-rejuvenation-for-restoring-fertility-a-new-ray-of-hope", title: "Ovarian Rejuvenation: A New Option for Fertility", desc: "How ovarian rejuvenation aims to restore fertility, and who is actually a good candidate for it." },
  { slug: "iui-success-rate-what-to-expect-after-iui-treatment", title: "IUI Success Rate: What to Expect", desc: "Realistic IUI success rates by age and diagnosis, and what to do if the first cycle doesn't work." },
  { slug: "the-hidden-threat-to-fertility-how-obesity-affects-your-chances", title: "How Obesity Affects Your Fertility Chances", desc: "The real impact of weight on fertility for both men and women, and steps that can help improve outcomes." },
  { slug: "how-to-improve-your-chances-of-iui-success-naturally", title: "Improving Your IUI Success Naturally", desc: "Lifestyle and timing changes that may genuinely improve your chances of IUI success." },
  { slug: "pregnancy-signs-symptoms", title: "Early Pregnancy Signs and Symptoms", desc: "The earliest signs of pregnancy, how soon they appear, and which ones are worth confirming with a test." },
  { slug: "how-many-times-can-a-person-undergo-ivf-procedure", title: "How Many IVF Cycles Can You Safely Undergo?", desc: "Is there a real limit to how many IVF cycles you can do? What doctors actually consider before recommending more." },
  { slug: "natural-conception-with-low-amh-levels", title: "Natural Conception With Low AMH Levels", desc: "Is natural conception still possible with low AMH? What the numbers mean and realistic next steps." },
  { slug: "advantages-and-disadvantages-of-pgt", title: "PGT (Preimplantation Genetic Testing): Pros & Cons", desc: "The real benefits and limitations of PGT — who it helps most, and where it falls short." },
  { slug: "embryo-transfer-procedure-for-in-vitro-fertilization-ivf", title: "The Embryo Transfer Procedure, Explained", desc: "A clear walkthrough of exactly what happens during embryo transfer, start to finish." },
  { slug: "iui-vs-ivf-a-breakdown-of-the-procedures-and-what-to-expect", title: "IUI vs IVF: Procedures and What to Expect", desc: "A side-by-side breakdown of IUI and IVF — process, cost, and success rates — to help you understand your options." },
  { slug: "ivf-for-women-with-thyroid-disorders-what-patients-should-know", title: "IVF for Women With Thyroid Disorders", desc: "What patients with thyroid disorders should know before and during an IVF cycle." },
  { slug: "preparing-for-your-first-ivf-cycle-tips-and-advice", title: "Preparing for Your First IVF Cycle: Tips & Advice", desc: "Practical guidance to prepare for your first IVF cycle — physically, emotionally, and logistically." },
  { slug: "boosting-implantation-success-the-power-of-embryo-glue", title: "Embryo Glue: Does It Really Boost Implantation?", desc: "What embryo glue actually is, how it's meant to help implantation, and what the evidence shows." },
  { slug: "ivf-cost-in-ahmedabad-whats-included-how-to-plan-your-budget", title: "IVF Cost in Ahmedabad: What's Included & Budgeting", desc: "A transparent look at what's included in IVF cost in Ahmedabad, and how to plan your budget realistically." },
  { slug: "understanding-reality-behind-ivf-success-rates", title: "The Reality Behind IVF Success Rates", desc: "Why published IVF success rates can be misleading, and how to interpret them for your own situation." },
  { slug: "the-link-between-pcos-and-infertility", title: "The Link Between PCOS and Infertility", desc: "How PCOS causes infertility, and the treatment paths that give the best chances of conceiving." },
  { slug: "step-by-step-guide-to-the-icsi-procedure", title: "The ICSI Procedure: A Step-by-Step Guide", desc: "Exactly what happens during ICSI, from sperm selection to fertilisation — explained step by step." },
  { slug: "understanding-negative-signs-after-embryo-transfer-when-to-worry", title: "Negative Signs After Embryo Transfer: When to Worry", desc: "Which symptoms after embryo transfer are normal, and which ones genuinely warrant a call to your clinic." },
  { slug: "frozen-vs-fresh-embryo-transfer-which-is-better", title: "Frozen vs Fresh Embryo Transfer: Which Is Better?", desc: "How frozen and fresh embryo transfer compare in success rates, and how doctors decide which to recommend." },
  { slug: "is-icsi-better-for-men-with-low-sperm-count", title: "Is ICSI Better for Men With Low Sperm Count?", desc: "When ICSI genuinely improves outcomes for low sperm count, and when standard IVF works just as well." },
  { slug: "what-is-the-difference-between-pcod-pcos", title: "PCOD vs PCOS: What's the Difference?", desc: "A clear explanation of how PCOD and PCOS differ, and why the distinction matters for treatment." },
  { slug: "how-can-i-increase-my-amh-levels", title: "Can You Increase Your AMH Levels?", desc: "What genuinely affects AMH levels, and realistic expectations for improving egg reserve." },
  { slug: "step-by-step-process-of-embryo-freezing-in-an-ivf-cycle", title: "Embryo Freezing Process: Step-by-Step Guide", desc: "How embryo freezing works during an IVF cycle, from vitrification to storage — explained step by step." },
  { slug: "best-types-of-exercise-to-support-your-ivf-journey", title: "Best Types of Exercise During Your IVF Journey", desc: "Which exercises are safe and helpful during IVF, and which activities are best avoided." },
  { slug: "pcos-diet-tips-to-support-natural-conception", title: "PCOS Diet Tips to Support Natural Conception", desc: "Practical, evidence-based diet changes that may help support natural conception with PCOS." },
  { slug: "is-ivf-possible-without-injections-understanding-easy-ivf-and-injection-free-ivf", title: "Is IVF Possible Without Injections?", desc: "What 'easy IVF' and injection-free protocols actually involve, and who they're realistically suited for." },
  { slug: "how-to-improve-male-infertility", title: "How to Improve Male Infertility", desc: "Lifestyle changes, treatments, and medical options that can genuinely improve male fertility." },
  { slug: "the-role-of-endometrial-receptivity-in-ivf-success", title: "Endometrial Receptivity and IVF Success", desc: "Why the uterine lining needs to be 'receptive,' not just thick enough, and how it's tested and improved." },
  { slug: "twin-and-multiple-pregnancies-after-ivf-risks-and-care", title: "Twin & Multiple Pregnancies After IVF: Risks & Care", desc: "The added risks of twin or multiple pregnancies after IVF, and how they're monitored and managed." },
  { slug: "a-guide-to-the-different-types-of-ivf-treatments", title: "A Guide to the Different Types of IVF Treatments", desc: "An overview of the different IVF-related treatments available, and which situations call for each one." },
  { slug: "teratozoospermia-uncovering-the-causes-symptoms-and-solutions", title: "Teratozoospermia: Causes, Symptoms & Solutions", desc: "Abnormal sperm shape explained — what causes teratozoospermia, and the fertility treatments that can help." },
  { slug: "top-fertility-treatments-for-women-with-pcos", title: "Top Fertility Treatments for Women With PCOS", desc: "The most effective fertility treatments for PCOS, from lifestyle changes to IVF." },
  { slug: "life-after-iui-precautions-lifestyle-tips-and-what-to-expect", title: "Life After IUI: Precautions and What to Expect", desc: "What to do — and expect — in the days after IUI, from activity to symptoms worth watching for." },
  { slug: "preparing-for-pgt-what-to-expect-before-during-and-after-the-procedure", title: "Preparing for PGT: What to Expect", desc: "What happens before, during, and after PGT (preimplantation genetic testing) — explained step by step." },
  { slug: "step-by-step-process-of-an-iui-procedure-what-to-expect", title: "The IUI Procedure, Step by Step", desc: "Exactly what happens during an IUI procedure, from preparation to the moment itself." },
  { slug: "egg-freezing-preserving-your-fertility-for-the-future", title: "Egg Freezing: Preserving Your Fertility for the Future", desc: "How egg freezing works, who it's for, and what to know before you start the process." },
  { slug: "can-ivf-work-with-low-amh", title: "Can IVF Work With Low AMH?", desc: "Yes, IVF can still work with low AMH — here's what affects your odds and how protocols are adjusted." },
  { slug: "ivf-for-single-women-in-india-navigating-new-art-law", title: "IVF for Single Women in India: The ART Law Explained", desc: "What India's ART Act actually allows for single women pursuing IVF, explained in plain language." },
  { slug: "egg-freezing-vs-embryo-freezing-making-the-right-choice-for-your-fertility-journey", title: "Egg Freezing vs Embryo Freezing: Which Is Right?", desc: "How egg freezing and embryo freezing differ, and which one may suit your situation better." },
  { slug: "lifestyle-changes-that-boost-fertility-in-pcos-women", title: "Lifestyle Changes That Boost Fertility With PCOS", desc: "Practical, evidence-based lifestyle changes that can genuinely improve fertility outcomes with PCOS." },
  { slug: "prp-vs-traditional-fertility-treatments-whats-the-difference", title: "PRP vs Traditional Fertility Treatments", desc: "How PRP therapy compares to traditional fertility treatments, and where it fits into a treatment plan." },
  { slug: "how-pre-implantation-genetic-testing-boosts-ivf-success", title: "How PGT Boosts IVF Success", desc: "How preimplantation genetic testing improves IVF outcomes, and who benefits most from it." },
  { slug: "pgt-vs-tgt-vs-prt-which-embryo-testing-method-is-right-for-you", title: "PGT vs TGT vs PRT: Which Embryo Test Is Right?", desc: "A clear comparison of PGT, TGT, and PRT embryo testing methods, and how to choose the right one." },
  { slug: "is-iui-painful-everything-you-need-to-know", title: "Is IUI Painful? Everything You Need to Know", desc: "An honest look at what IUI actually feels like, and how to manage any discomfort." },
  { slug: "innovative-treatments-for-low-amh", title: "Innovative Treatments for Low AMH", desc: "Newer treatment approaches for low AMH, and what the evidence says about their effectiveness." },
  { slug: "pgt-for-couples-with-recurrent-ivf-failure-or-miscarriages-does-it-help", title: "Does PGT Help With Recurrent IVF Failure?", desc: "Whether PGT genuinely improves outcomes for couples with recurrent IVF failure or miscarriage." },
  { slug: "understanding-the-reasons-for-ivf-failure", title: "Understanding the Reasons for IVF Failure", desc: "The most common reasons an IVF cycle doesn't succeed, and what can be done differently next time." },
  { slug: "endometriosis-and-ivf-what-to-expect-and-how-to-prepare", title: "Endometriosis and IVF: What to Expect", desc: "How endometriosis affects IVF outcomes, and how to prepare for the best possible chances." },
  { slug: "lifestyle-changes-to-boost-ivf-success-and-increase-your-chances-of-a-healthy-pregnancy", title: "Lifestyle Changes to Boost IVF Success", desc: "Evidence-based lifestyle changes that can genuinely improve your chances of IVF success." },
  { slug: "ivf-pregnancy-with-pcos-and-endometriosis", title: "IVF Pregnancy With PCOS and Endometriosis", desc: "How PCOS and endometriosis together affect an IVF pregnancy, and how care is adjusted." },
  { slug: "top-10-reasons-to-consider-egg-freezing", title: "Top 10 Reasons to Consider Egg Freezing", desc: "The most common — and compelling — reasons women choose to freeze their eggs." },
  { slug: "how-to-test-for-female-infertility", title: "How to Test for Female Infertility", desc: "The complete female fertility work-up, from hormone panels to imaging — explained clearly." },
  { slug: "is-natural-cycle-ivf-better-for-women-with-poor-ovarian-reserve", title: "Is Natural Cycle IVF Better for Poor Ovarian Reserve?", desc: "Whether natural cycle IVF genuinely offers an advantage for women with poor ovarian reserve." },
  { slug: "when-is-the-right-time-to-freeze-your-eggs", title: "When Is the Right Time to Freeze Your Eggs?", desc: "The age and factors that determine the ideal time to freeze your eggs for the best results." },
  { slug: "what-to-expect-during-each-stage-of-ivf", title: "What to Expect at Each Stage of IVF", desc: "A stage-by-stage walkthrough of the full IVF process, from consultation to pregnancy test." },
  { slug: "does-stress-affect-ivf-success", title: "Does Stress Affect IVF Success?", desc: "What the research actually says about stress and IVF outcomes, and practical ways to manage it." },
  { slug: "egg-quality-vs-egg-quantity-what-really-matters", title: "Egg Quality vs Egg Quantity: What Matters More?", desc: "How egg quality and quantity each affect fertility, and why one isn't automatically more important." },
  { slug: "the-dfi-test-a-crucial-diagnostic-tool-for-male-infertility", title: "The DFI Test: A Key Tool for Male Infertility", desc: "What the sperm DNA fragmentation (DFI) test measures, and when it's worth doing." },
  { slug: "bavishi-fertility-institute-expands-to-bhavnagar-with-state-of-the-art-ai-enabled-ivf-and-womens-hospital", title: "Bavishi Fertility Institute Expands to Bhavnagar", desc: "Bavishi Fertility Institute opens a new AI-enabled IVF and women's hospital in Bhavnagar." },
  { slug: "when-to-consider-sperm-dna-fragmentation-testing-in-low-sperm-count-cases", title: "When to Consider Sperm DNA Fragmentation Testing", desc: "When sperm DNA fragmentation testing is worth doing for low sperm count cases, and what it reveals." },
  { slug: "government-vs-private-ivf-centres-in-ahmedabad-which-one-is-better", title: "Government vs Private IVF Centres in Ahmedabad", desc: "An honest comparison of government and private IVF centres in Ahmedabad — cost, care, and outcomes." },
  { slug: "is-egg-freezing-a-good-option-if-i-want-to-delay-pregnancy", title: "Is Egg Freezing Good for Delaying Pregnancy?", desc: "Whether egg freezing is a genuinely good option if you want to delay pregnancy, and what to consider." },
  { slug: "inauguration-of-our-new-branch-in-nikol", title: "New Bavishi Fertility Branch Opens in Nikol", desc: "Bavishi Fertility Institute inaugurates a new centre in Nikol, Ahmedabad." },
  { slug: "preserving-hope-ivf-and-fertility-preservation-for-cancer-patients", title: "Fertility Preservation for Cancer Patients", desc: "How IVF and fertility preservation options help cancer patients protect their chances of having children later." },
  { slug: "the-emotional-rollercoaster-of-ivf-why-mental-health-support-is-essential", title: "IVF and Mental Health: Why Support Matters", desc: "Why the emotional side of IVF deserves real support, and where to find it during treatment." },
  { slug: "what-is-epigenetics-does-it-affect-ivf-pregnancies-only", title: "What Is Epigenetics? Does It Affect IVF Only?", desc: "A simple explanation of epigenetics, and whether it affects IVF pregnancies differently from natural ones." },
  { slug: "role-of-exercise-in-ivf-success", title: "The Role of Exercise in IVF Success", desc: "How much and what type of exercise is safe and helpful during an IVF cycle." },
  { slug: "fibroids-and-ivf-should-you-remove-them-before-treatment", title: "Fibroids and IVF: Remove Before Treatment?", desc: "When fibroids should be removed before IVF, and when they can safely be left alone." },
  { slug: "imsi-technique-for-ivf-advanced-sperm-selection-for-better-success", title: "IMSI: Advanced Sperm Selection for IVF", desc: "How the IMSI technique selects better sperm for IVF, and who benefits most from it." },
  { slug: "who-should-consider-a-blastocyst-transfer-in-ivf", title: "Who Should Consider a Blastocyst Transfer?", desc: "Which patients are the best candidates for a blastocyst (day 5) transfer, and why." },
  { slug: "pregnancy-complications", title: "Common Pregnancy Complications and How to Manage Them", desc: "The most common pregnancy complications, their warning signs, and how they're safely managed." },
  { slug: "ovarian-rejuvenation-ivf-what-to-know-when-combining-treatments", title: "Combining Ovarian Rejuvenation With IVF", desc: "What to know when combining ovarian rejuvenation with an IVF cycle." },
  { slug: "myth-twins-and-ivf", title: "Dispelling the Myth: Twins and IVF", desc: "Does IVF really mean a higher chance of twins? Separating fact from myth." },
  { slug: "endometriosis-and-menopause-what-to-expect-and-how-to-manage-symptoms", title: "Endometriosis and Menopause: What to Expect", desc: "How endometriosis symptoms change around menopause, and how to manage them." },
  { slug: "the-relationship-between-egg-freezing-and-future-ivf-success-rates", title: "Egg Freezing and Future IVF Success Rates", desc: "How the age at which you freeze your eggs affects future IVF success rates." },
  { slug: "understanding-male-fertility-azoospermia-vs-oligospermia", title: "Azoospermia vs Oligospermia: What's the Difference?", desc: "How zero sperm count (azoospermia) differs from low sperm count (oligospermia), and what each means for treatment." },
  { slug: "understanding-endometrial-thickness-a-key-factor-in-female-fertility", title: "Endometrial Thickness: A Key Fertility Factor", desc: "Why endometrial thickness matters for fertility, and what counts as healthy versus concerning." },
  { slug: "finding-fertility-options-with-low-amh-a-detailed-guide", title: "Fertility Options With Low AMH: A Detailed Guide", desc: "A detailed look at the fertility options available when AMH levels are low." },
  { slug: "parenting-after-ivf-unique-challenges-and-rewards", title: "Parenting After IVF: Challenges and Rewards", desc: "The unique emotional experience of parenting after IVF — the challenges and the rewards." },
  { slug: "13-best-ivf-clinics-in-mumbai", title: "13 Best IVF Clinics in Mumbai (2026 Guide)", desc: "A researched comparison of Mumbai's leading IVF clinics — success rates, technology, and patient experience." },
  { slug: "in-vitro-egg-aspiration-how-the-ivf-egg-retrieval-process-works", title: "How the IVF Egg Retrieval Process Works", desc: "A clear explanation of egg retrieval (aspiration) during IVF, from preparation to recovery." },
  { slug: "bavishi-fertility-institute-nikol-ahmedabad-celebrates-its-first-anniversary", title: "Bavishi Fertility Nikol Celebrates First Anniversary", desc: "Bavishi Fertility Institute's Nikol, Ahmedabad centre marks its first year serving patients." },
  { slug: "the-role-of-nutrition-in-boosting-ivf-success", title: "The Role of Nutrition in Boosting IVF Success", desc: "How nutrition genuinely affects IVF outcomes, and practical dietary changes worth making." },
  { slug: "unlocking-hope-getting-pregnant-with-pcos-and-irregular-periods", title: "Getting Pregnant With PCOS and Irregular Periods", desc: "How PCOS and irregular periods affect conception, and the treatment paths that can help." },
  { slug: "ovarian-follicles-the-tiny-heroes-of-fertility", title: "Ovarian Follicles: The Tiny Heroes of Fertility", desc: "What ovarian follicles are, how they develop, and why they matter so much for fertility." },
  { slug: "ivf-failure-doesnt-mean-the-end-what-can-you-do-next", title: "IVF Failure Isn't the End: What to Do Next", desc: "Practical next steps after an IVF cycle doesn't work, and how to move forward with a clear plan." },
  { slug: "fertility-ovulation-facts-to-help-you-get-pregnant", title: "Fertility & Ovulation Facts to Help You Conceive", desc: "Key facts about ovulation and fertility that can help you time conception more effectively." },
  { slug: "silent-endometriosis-can-you-have-it-without-symptoms", title: "Silent Endometriosis: Can You Have It Without Symptoms?", desc: "Yes — endometriosis can exist without obvious symptoms. Here's how it's still detected." },
  { slug: "normal-delivery-tips-to-increase-your-chances-of-a-natural-birth", title: "Tips to Increase Your Chances of Normal Delivery", desc: "Practical, evidence-based tips that may improve your chances of a natural, normal delivery." },
  { slug: "twin-pregnancy-understanding-common-risks-and-how-doctors-manage-them", title: "Twin Pregnancy: Common Risks and How They're Managed", desc: "The common risks in a twin pregnancy, and the specific care that keeps both babies safe." },
  { slug: "understanding-varicocele-how-serious-is-the-diagnosis", title: "Understanding Varicocele: How Serious Is It?", desc: "How serious a varicocele diagnosis actually is, and when it genuinely needs treatment." },
  { slug: "how-to-recognize-signs-of-ovulation-for-better-fertility-planning", title: "Signs of Ovulation for Better Fertility Planning", desc: "How to recognise the physical signs of ovulation to time conception more effectively." },
  { slug: "embracing-positivity-activities-to-nurture-your-journey-to-motherhood-after-embryo-transfer", title: "Staying Positive During the Two-Week Wait", desc: "Activities and mindset shifts that can help you stay positive after embryo transfer." },
  { slug: "pgt-and-its-role-in-preventing-recurrent-miscarriages", title: "PGT's Role in Preventing Recurrent Miscarriage", desc: "How preimplantation genetic testing can help reduce the risk of recurrent miscarriage." },
  { slug: "personalized-medicine-how-ivf-treatment-is-customized", title: "How IVF Treatment Is Personalized to You", desc: "How fertility specialists tailor IVF protocols to each patient's specific situation." },
  { slug: "how-to-protect-your-mental-health-during-ivf-and-fertility-treatments", title: "Protecting Your Mental Health During IVF", desc: "Practical ways to protect your mental health while going through IVF and fertility treatment." },
  { slug: "how-age-affects-fertility-myths-vs-facts", title: "How Age Affects Fertility: Myths vs Facts", desc: "Separating fact from myth about how age really affects fertility in both men and women." },
  { slug: "when-is-macs-most-useful-indications-ideal-candidates-limitations", title: "When Is MACS Most Useful in IVF?", desc: "Who benefits most from MACS sperm selection, and where its limitations lie." },
  { slug: "icsi-dos-and-donts", title: "ICSI: Do's and Don'ts", desc: "What to do — and avoid — before and after an ICSI cycle, explained clearly." },
  { slug: "boosting-male-fertility-tips-to-improve-sperm-quality", title: "Tips to Improve Sperm Quality Naturally", desc: "Practical, evidence-based ways to boost male fertility and improve sperm quality." },
  { slug: "essential-tests-for-male-infertility-what-to-expect", title: "Essential Tests for Male Infertility", desc: "The full range of tests used to diagnose male infertility, and what each one involves." },
  { slug: "how-does-age-impact-the-success-rate-of-iui-procedures", title: "How Age Impacts IUI Success Rates", desc: "How IUI success rates change with age, and when IVF may be a better option instead." },
  { slug: "ovarian-cysts-symptoms-causes-treatment-diagnosis", title: "Ovarian Cysts: Symptoms, Causes & Treatment", desc: "How ovarian cysts are diagnosed, what causes them, and the treatment options available." },
  { slug: "genetic-testing-before-and-during-pregnancy-a-comprehensive-guide", title: "Genetic Testing Before & During Pregnancy", desc: "A complete guide to genetic testing options before and during pregnancy." },
  { slug: "understanding-sperm-dna-fragmentation-causes-treatment-and-ivf-options", title: "Sperm DNA Fragmentation: Causes & Treatment", desc: "What causes sperm DNA fragmentation, how it's treated, and its impact on IVF outcomes." },
  { slug: "bavishi-fertility-institute-hosts-fogsi-recognized-training-program-in-ahmedabad", title: "Bavishi Hosts FOGSI-Recognized Training Program", desc: "Bavishi Fertility Institute hosts a FOGSI-recognised training program for medical professionals in Ahmedabad." },
  { slug: "endometrial-scratching-before-ivf-evidence-benefits-and-risks", title: "Endometrial Scratching Before IVF: Does It Help?", desc: "What the evidence says about endometrial scratching before IVF, and its real benefits and risks." },
  { slug: "the-thyroid-connection-understanding-its-role-in-female-fertility-health", title: "The Thyroid's Role in Female Fertility", desc: "How thyroid function affects female fertility, and why thyroid health matters for conception." },
  { slug: "can-natural-cycle-ivf-reduce-the-risk-of-ovarian-hyperstimulation", title: "Can Natural Cycle IVF Reduce OHSS Risk?", desc: "Whether natural cycle IVF genuinely lowers the risk of ovarian hyperstimulation syndrome." },
  { slug: "questions-to-ask-ivf-specialist-at-1st-visit", title: "Questions to Ask Your IVF Specialist at Visit 1", desc: "The key questions worth asking your fertility specialist during your very first consultation." },
  { slug: "the-miracle-of-bonding-connecting-with-your-baby-before-birth", title: "Bonding With Your Baby Before Birth", desc: "How prenatal bonding works, and simple ways to connect with your baby before they're born." },
  { slug: "ivf-and-career-balancing-work-and-fertility-treatments", title: "Balancing Work and IVF Treatment", desc: "Practical advice for balancing a career with the demands of an IVF cycle." },
  { slug: "personalized-ivf-the-future-of-fertility-treatment", title: "Personalized IVF: The Future of Fertility Care", desc: "How personalised IVF protocols are shaping the next generation of fertility treatment." },
  { slug: "endometriosis-and-gut-health-the-hidden-connection", title: "Endometriosis and Gut Health: The Hidden Link", desc: "The surprising connection between endometriosis and gut health, and why it matters for symptom management." },
  { slug: "impact-of-age-repeated-ivf-cycles-on-pregnancy", title: "Impact of Age and Repeated IVF Cycles", desc: "How age and multiple IVF cycles together affect your chances of a successful pregnancy." },
  { slug: "understanding-ovarian-reserve-and-rejuvenation-a-guide", title: "Ovarian Reserve and Rejuvenation: A Guide", desc: "A clear guide to understanding ovarian reserve, and what rejuvenation treatments can and can't do." },
  { slug: "the-match-system-revolutionizing-ivf-with-unparalleled-accuracy-and-safety", title: "The MATCH System: Improving IVF Accuracy & Safety", desc: "How the MATCH system improves accuracy and safety in the IVF lab process." },
  { slug: "celebrating-6-years-of-care-compassion-and-miracles-at-bavishi-fertility-institute-vadodara", title: "6 Years of Care at Bavishi Fertility, Vadodara", desc: "Bavishi Fertility Institute's Vadodara centre celebrates 6 years of patient care and successful pregnancies." },
  { slug: "demystifying-ivf-facts-and-myths", title: "Demystifying IVF: Facts vs Myths", desc: "Separating IVF facts from common myths, in plain, reassuring language." },
  { slug: "unlocking-the-puzzle-of-recurrent-ivf-failure-endometriosis-and-uterine-factors", title: "Recurrent IVF Failure: Endometriosis & Uterine Factors", desc: "How endometriosis and uterine factors contribute to recurrent IVF failure, and what can be done." },
  { slug: "the-journey-to-blastocyst-stage-and-implantation-understanding-your-chances-and-how-bavishi-fertility-institutes-can-help", title: "Blastocyst Stage and Implantation: Your Chances", desc: "Understanding your chances at the blastocyst stage, and how Bavishi Fertility Institute supports implantation." },
  { slug: "are-ivf-babies-healthy-as-naturally-conceived", title: "Are IVF Babies as Healthy as Naturally Conceived?", desc: "What long-term studies actually show about the health of IVF-conceived babies." },
  { slug: "boosting-your-ivf-success-a-comprehensive-guide-for-couples", title: "Boosting IVF Success: A Guide for Couples", desc: "A comprehensive, practical guide for couples looking to improve their chances of IVF success." },
  { slug: "dr-nilesh-jains-expert-guidance-on-fertility-treatments-in-mumbai", title: "Dr. Nilesh Jain on Fertility Treatments in Mumbai", desc: "Dr. Nilesh Jain shares expert guidance on fertility treatment options available in Mumbai." },
  { slug: "the-ultimate-guide-to-diet-in-lactation-nourishing-your-body-and-baby", title: "Diet During Lactation: The Ultimate Guide", desc: "What to eat while breastfeeding to nourish both your body and your baby." },
  { slug: "ivf-stimulation-protocols-a-comprehensive-guide", title: "IVF Stimulation Protocols: A Comprehensive Guide", desc: "An overview of the different IVF stimulation protocols, and how doctors choose the right one for you." },
  { slug: "when-can-you-start-exercising-after-delivery", title: "When Can You Start Exercising After Delivery?", desc: "A safe, realistic timeline for returning to exercise after giving birth." },
  { slug: "male-infertility-treatment-options-in-ahmedabad-what-you-should-know", title: "Male Infertility Treatment Options in Ahmedabad", desc: "What men should know about the male infertility treatment options available in Ahmedabad." },
  { slug: "postpartum-mental-health-recognizing-baby-blues-and-postpartum-depression", title: "Postpartum Mental Health: Baby Blues vs Depression", desc: "How to tell the difference between normal baby blues and postpartum depression, and when to seek help." },
  { slug: "bavishi-fertility-institute-recognized-as-the-leading-ivf-chain-of-gujarat-by-radio-city", title: "Bavishi Named Leading IVF Chain of Gujarat", desc: "Bavishi Fertility Institute recognised as the leading IVF chain of Gujarat by Radio City." },
  { slug: "era-test-explained-does-it-really-improve-egg-quality", title: "ERA Test Explained: Does It Improve Outcomes?", desc: "What the ERA test actually measures, and whether it genuinely improves IVF outcomes." },
  { slug: "oncofertility-preserving-fertility-before-cancer-treatment", title: "Oncofertility: Preserving Fertility Before Cancer Care", desc: "How oncofertility helps preserve fertility options before starting cancer treatment." },
  { slug: "bavishi-fertility-institute-most-trusted-fertility-chain-hospital-in-gujarat", title: "Bavishi: Most Trusted Fertility Chain in Gujarat", desc: "Why Bavishi Fertility Institute is recognised as the most trusted fertility chain hospital in Gujarat." },
  { slug: "success-rate-of-ivf-treatments-in-ahmedabad-what-to-expect-in-2025", title: "IVF Success Rates in Ahmedabad: 2025 Outlook", desc: "What to realistically expect from IVF success rates in Ahmedabad this year." },
  { slug: "why-dr-himanshu-bavishi-is-the-best-ivf-specialist-in-ahmedabad-and-india", title: "Why Dr. Himanshu Bavishi Leads IVF Care in India", desc: "What sets Dr. Himanshu Bavishi apart as a leading IVF specialist in Ahmedabad and across India." },
  { slug: "bavishi-fertility-institute-conducts-an-educational-programme-at-rajkot", title: "Bavishi Hosts Educational Program in Rajkot", desc: "Bavishi Fertility Institute conducts an educational programme for medical professionals in Rajkot." },
  { slug: "the-power-of-egg-freezing-empowering-choices-for-the-modern-generation", title: "Egg Freezing: Empowering Choices Today", desc: "How egg freezing gives modern women more control over their fertility timeline." },
  { slug: "bed-rest-myth-during-ivf", title: "Debunking the Bed Rest Myth in IVF", desc: "Why strict bed rest after embryo transfer isn't actually necessary — what the evidence really shows." },
  { slug: "12-tips-for-getting-pregnant-faster-with-pcos-a-step-by-step-guide", title: "12 Tips to Get Pregnant Faster With PCOS", desc: "A step-by-step guide with 12 practical tips to improve your chances of conceiving with PCOS." },
  { slug: "from-ivf-to-motherhood-the-journey-of-hope-and-happiness", title: "From IVF to Motherhood: A Journey of Hope", desc: "A heartfelt look at the journey from IVF treatment to motherhood." },
  { slug: "ovarian-hyperstimulation-syndrome", title: "Ovarian Hyperstimulation Syndrome (OHSS) Explained", desc: "What OHSS is, its warning signs, and how it's prevented and managed during IVF." },
  { slug: "ivf-babies-meet-in-vadodara-a-momentous-event-creating-awareness", title: "IVF Babies Meet-Up Raises Awareness in Vadodara", desc: "A momentous IVF babies meet-up in Vadodara raises awareness about fertility treatment." },
  { slug: "egg-freezing-your-fertility-time-capsule", title: "Egg Freezing: Your Fertility Time Capsule", desc: "How egg freezing works as a way to preserve your fertility options for the future." },
  { slug: "how-to-choose-the-best-ivf-clinic-in-ahmedabad", title: "How to Choose the Best IVF Clinic in Ahmedabad", desc: "The key factors to consider when choosing an IVF clinic in Ahmedabad." },
  { slug: "high-risk-pregnancy-a-guide-to-lifestyle-diet-and-rest-tips", title: "High-Risk Pregnancy: Lifestyle, Diet & Rest Tips", desc: "Practical lifestyle, diet, and rest guidance for managing a high-risk pregnancy safely." },
  { slug: "reasons-behind-low-amh-levels-ways-to-increase", title: "Low AMH Levels: Causes and Ways to Increase It", desc: "What causes low AMH levels, what it means for your fertility, and practical ways that may help improve it." },
  { slug: "ivf-failure-treatment-is-possible", title: "IVF Failure: Treatment Is Still Possible", desc: "Why one failed IVF cycle isn't the end of the road, and the treatment paths that follow." },
  { slug: "building-families-with-hope-the-power-of-assisted-reproductive-technology", title: "How Assisted Reproductive Technology Builds Families", desc: "How assisted reproductive technology has given hope to families struggling to conceive." },
  { slug: "how-many-embryos-should-be-transferred-risks-of-multiple-pregnancy-explained", title: "How Many Embryos Should Be Transferred?", desc: "Why doctors recommend transferring fewer embryos, and the real risks of multiple pregnancy." },
  { slug: "recurrent-miscarriage-why-does-it-keep-happening-and-what-can-you-do", title: "Recurrent Miscarriage: Why It Happens & What to Do", desc: "The most common causes of recurrent miscarriage, and the treatment paths worth exploring." },
  { slug: "miscarriages-during-ivf-signs-causes-prevention-hope", title: "Miscarriage During IVF: Signs, Causes & Prevention", desc: "The signs of miscarriage during an IVF pregnancy, what causes it, and steps that may help prevent it." },
  { slug: "dr-himanshu-bavishi-speaks-on-ivf-at-sogog-conference", title: "Dr. Himanshu Bavishi Speaks on IVF at SOGOG", desc: "Dr. Himanshu Bavishi shares insights on IVF at the SOGOG conference." },
  { slug: "embryo-glue-a-game-changer-in-ivf-success-rates", title: "Embryo Glue: A Game-Changer for IVF Success?", desc: "Whether embryo glue genuinely improves IVF success rates, and what the evidence shows." },
  { slug: "what-are-microplastics-how-do-they-affect-reproductive-health", title: "Microplastics and Reproductive Health", desc: "What microplastics are, and the emerging evidence on how they may affect reproductive health." },
  { slug: "superfoods-for-male-fertility-what-fertility-specialists-recommend", title: "Superfoods for Male Fertility: Specialist Picks", desc: "Fertility specialist–approved superfoods that can help support healthy sperm production." },
  { slug: "iui-for-unexplained-infertility", title: "IUI for Unexplained Infertility: How It Works", desc: "Why IUI is often the first recommended step for unexplained infertility, and how it works." },
  { slug: "bavishi-fertility-institute-wins-patient-centric-hospital-award", title: "Bavishi Wins Patient-Centric Hospital Award", desc: "Bavishi Fertility Institute recognised with the Patient-Centric Hospital Award." },
  { slug: "icsi-vs-ivf-do-you-actually-need-icsi-or-is-it-being-upsold-to-you", title: "ICSI vs IVF: Do You Actually Need ICSI?", desc: "An honest look at when ICSI is genuinely necessary, and when standard IVF is enough." },
  { slug: "why-are-couples-from-other-cities-choosing-ahmedabad-for-ivf-treatment", title: "Why Couples Travel to Ahmedabad for IVF", desc: "What's drawing couples from other cities specifically to Ahmedabad for IVF treatment." },
  { slug: "how-does-the-climate-and-lifestyle-in-ahmedabad-affect-fertility", title: "How Ahmedabad's Climate & Lifestyle Affect Fertility", desc: "Whether Ahmedabad's climate and lifestyle genuinely have an impact on fertility." },
  { slug: "10-signs-you-should-see-fertility-specialist-and-when-not-to-wait", title: "10 Signs You Should See a Fertility Specialist", desc: "The 10 signs that mean it's time to see a fertility specialist, and when not to wait." },
  { slug: "blastocyst-transfer-in-special-situations-pcos-poor-responders-recurrent-ivf-failure-endometriosis-uterine-factors", title: "Blastocyst Transfer in Special Situations", desc: "How blastocyst transfer decisions change for PCOS, poor responders, and recurrent IVF failure cases." },
  { slug: "dr-parth-bavishi-wins-bharat-excellence-award-for-ivf", title: "Dr. Parth Bavishi Wins Bharat Excellence Award", desc: "Dr. Parth Bavishi honoured with the Bharat Excellence Award for his work in IVF." },
  { slug: "male-infertility-signs-causes-treatment", title: "Male Infertility: Signs, Causes & Treatment", desc: "The full picture of male infertility — warning signs, common causes, and treatment options." },
  { slug: "food-for-better-egg-quality-how-sugar-affects-your-eggs", title: "How Sugar Affects Egg Quality", desc: "How excess sugar intake may affect egg quality, and foods that support better outcomes instead." },
  { slug: "how-to-interpret-amh-afc-and-other-ovarian-reserve-rests-what-the-numbers-really-mean", title: "How to Interpret AMH, AFC & Ovarian Reserve Tests", desc: "What your AMH, AFC, and other ovarian reserve test numbers actually mean." },
  { slug: "how-to-choose-the-right-treatment-after-45", title: "Choosing the Right Fertility Treatment After 45", desc: "BFI's approach to choosing the right fertility treatment path for patients over 45." },
  { slug: "cracking-opens-the-possibilities-how-laser-assisted-hatching-is-changing-the-game-for-ivf-patients", title: "How Laser Assisted Hatching Is Changing IVF", desc: "How laser assisted hatching is improving outcomes for IVF patients." },
  { slug: "rebuilding-families-fertility-treatment-options-for-cancer-survivors", title: "Fertility Treatment Options for Cancer Survivors", desc: "The fertility treatment paths available to cancer survivors hoping to build a family." },
  { slug: "checking-if-ivf-is-the-last-option-to-conceive", title: "Is IVF Really Your Last Option to Conceive?", desc: "When IVF genuinely is the best path forward, and when other options should be tried first." },
  { slug: "team-excellence-and-innovation-at-bavishi-fertility-institute", title: "Team Excellence and Innovation at Bavishi Fertility", desc: "How the Bavishi Fertility Institute team drives excellence and innovation in fertility care." },
  { slug: "the-unseen-struggle-understanding-male-infertility", title: "The Unseen Struggle: Understanding Male Infertility", desc: "Why male infertility remains under-discussed, and what men need to know." },
  { slug: "ectopic-pregnancy", title: "Ectopic Pregnancy: Signs, Causes & Treatment", desc: "How ectopic pregnancy is diagnosed, its warning signs, and the treatment that follows." },
  { slug: "from-diagnosis-to-conception-managing-pcos-for-a-healthy-pregnancy", title: "Managing PCOS From Diagnosis to Pregnancy", desc: "A guide to managing PCOS from diagnosis through to a healthy pregnancy." },
  { slug: "dr-parth-bavishi-honoured-with-the-prestigious-achiever-award-at-fertivision-2025", title: "Dr. Parth Bavishi Honoured at Fertivision 2025", desc: "Dr. Parth Bavishi receives the prestigious Achiever Award at Fertivision 2025." },
  { slug: "thyroid-disorders-in-early-pregnancy", title: "Thyroid Disorders in Early Pregnancy", desc: "How thyroid disorders are managed in early pregnancy, and why early detection matters." },
  { slug: "unexplained-infertility-when-tests-are-normal-but-you-still-cant-conceive", title: "Unexplained Infertility: When Tests Come Back Normal", desc: "What happens when every fertility test comes back normal but conception still isn't happening." },
  { slug: "dr-himanshu-bavishi-social-medical-egg-freezing-vadodara-bogs-isar", title: "Dr. Himanshu Bavishi on Egg Freezing at BOGS x ISAR", desc: "Dr. Himanshu Bavishi speaks on social and medical egg freezing at the Vadodara BOGS x ISAR meet." },
  { slug: "dr-falguni-bavishi-at-sogog-conference-on-iui-success", title: "Dr. Falguni Bavishi on IUI Success at SOGOG", desc: "Dr. Falguni Bavishi presents on IUI success rates at the SOGOG conference." },
  { slug: "insights-on-fertility-dr-bavishi-team-at-palanpur-society", title: "Dr. Bavishi's Team Shares Fertility Insights, Palanpur", desc: "The Bavishi team shares fertility insights with the Palanpur medical society." },
  { slug: "lifestyle-diet-rest-tips-for-high-risk-pregnancy", title: "Lifestyle, Diet & Rest Tips for High-Risk Pregnancy", desc: "Practical guidance on lifestyle, diet, and rest for managing a high-risk pregnancy." },
  { slug: "bavishi-fertility-institute-hosts-joint-educational-cme-with-east-ahmedabad-gynaecologist-association", title: "Bavishi Hosts Joint CME With East Ahmedabad Gynaecologists", desc: "Bavishi Fertility Institute hosts a joint educational CME with the East Ahmedabad Gynaecologist Association." },
  { slug: "cme-program-on-infertility-management-successfully-conducted-at-idar", title: "CME Program on Infertility Management Held at Idar", desc: "A CME program on infertility management successfully conducted at Idar." },
  { slug: "advancing-ovarian-science-a-full-day-scientific-program-in-surat", title: "Advancing Ovarian Science: A Program in Surat", desc: "A full-day scientific program on advancing ovarian science held in Surat." },
  { slug: "bavishi-fertility-institute-honoured-at-times-healthcare-leaders-awards-2025", title: "Bavishi Honoured at Times Healthcare Leaders Awards", desc: "Bavishi Fertility Institute honoured at the Times Healthcare Leaders Awards 2025." },
  { slug: "bavishi-fertility-institute-conducts-a-successful-cme-program-at-bardoli", title: "Bavishi Conducts Successful CME Program at Bardoli", desc: "Bavishi Fertility Institute conducts a successful CME program at Bardoli." },
  { slug: "r-j-lajja-of-my-fm-taking-interview-of-dr-parth-bavishi", title: "RJ Lajja of My FM Interviews Dr. Parth Bavishi", desc: "RJ Lajja of My FM interviews Dr. Parth Bavishi on fertility care and IVF." },
  { slug: "vegetarian-diet-chart-for-pregnant-lady-protein-rich-indian-meal-plan", title: "Vegetarian Pregnancy Diet: Protein-Rich Meal Plan", desc: "A protein-rich Indian vegetarian meal plan designed for pregnancy nutrition needs." },
  { slug: "do-and-dont-for-fertility", title: "Do's and Don'ts for Fertility", desc: "The key lifestyle do's and don'ts that genuinely support fertility." },
  { slug: "bavishi-fertility-institute-hosts-knowledge-sharing-program-with-bharuch-ob-gy-society", title: "Bavishi Hosts Knowledge Program With Bharuch OB-GY", desc: "Bavishi Fertility Institute hosts a knowledge-sharing program with the Bharuch OB & GY Society." },
  { slug: "do-i-need-an-ultrasound-in-every-pregnancy-visit-is-it-safe", title: "Do You Need an Ultrasound at Every Visit?", desc: "Whether an ultrasound is necessary at every pregnancy visit, and if it's safe." },
  { slug: "decoding-your-semen-analysis-report-a-simple-guide", title: "Decoding Your Semen Analysis Report", desc: "A simple, jargon-free guide to understanding your semen analysis report." },
  { slug: "empowering-women-in-medicine-knowledge-sharing-program-on-advanced-fertility-and-ivf-techniques-at-nikol", title: "Advanced Fertility Techniques Program at Nikol", desc: "A knowledge-sharing program on advanced fertility and IVF techniques held at Nikol." },
  { slug: "factors-to-consider-right-clinic-for-ivf-journey", title: "Factors to Consider When Choosing an IVF Clinic", desc: "The key factors worth weighing when choosing the right clinic for your IVF journey." },
  { slug: "icsi-treatment-for-men-with-poor-sperm-morphology-does-it-really-help", title: "ICSI for Poor Sperm Morphology: Does It Help?", desc: "Whether ICSI treatment genuinely helps when sperm morphology is poor, explained clearly." },
  { slug: "bavishi-fertility-institute-wins-ivf-chain-of-the-year-west-for-5th-time", title: "Bavishi Wins IVF Chain of the Year – West, 5th Time", desc: "Bavishi Fertility Institute wins IVF Chain of the Year – West for the fifth time." },
  { slug: "questions-to-discuss-with-doctor-during-multiple-ivf-cycles", title: "Questions to Ask During Multiple IVF Cycles", desc: "Key questions worth discussing with your doctor if you're going through multiple IVF cycles." },
  { slug: "complications-of-delaying-your-ivf-journey", title: "The Complications of Delaying Your IVF Journey", desc: "Why delaying IVF treatment can reduce your options, and what to consider before waiting." },
  { slug: "how-to-improve-female-egg-quality-with-an-indian-fertility-diet", title: "Improve Egg Quality With an Indian Fertility Diet", desc: "How an Indian-style fertility diet can help support better egg quality." },
  { slug: "ivf-vs-icsi-why-we-use-icsi-and-the-male-partners-role", title: "IVF vs ICSI: Why We Use ICSI, and the Male's Role", desc: "Why ICSI is often used for all patients, and the male partner's role in the process." },
  { slug: "celebrated-republic-day-with-hope-and-happiness-at-bavishi-fertility-institute", title: "Republic Day Celebrations at Bavishi Fertility", desc: "Bavishi Fertility Institute celebrates Republic Day with hope and happiness." },
  { slug: "dr-himanshu-bavishi-aogs-2026-recurrent-pregnancy-loss-panel", title: "Dr. Himanshu Bavishi on Recurrent Pregnancy Loss", desc: "Dr. Himanshu Bavishi moderates a panel on recurrent pregnancy loss at AOGS 2026." },
];

// Only fill fields that are actually empty -- never overwrite an existing
// value. The dry-run of the original blanket-.set() version of this script
// found 23 posts already had a non-empty seoMetaTitle (evidently from an
// earlier bulk-enrichment pass, per the sibling fix-blog-seo-truncation.mjs
// script's comment) that this would otherwise have silently replaced, some
// of them already perfectly good. Field-by-field patching avoids that.
const empty = (v) => v === null || v === undefined || (typeof v === "string" && v.trim() === "");

let changed = 0;
let notFound = 0;
let skippedNoop = 0;
for (const p of posts) {
  const doc = await client.fetch(
    `*[_type == "blog" && slug == $slug][0]{_id, seoMetaTitle, seoMetaDescription, seoOgTitle, seoOgDescription}`,
    { slug: p.slug },
  );
  if (!doc) {
    console.log(`  NOT FOUND: ${p.slug}`);
    notFound++;
    continue;
  }

  const patch = {};
  if (empty(doc.seoMetaTitle)) patch.seoMetaTitle = p.title;
  if (empty(doc.seoMetaDescription)) patch.seoMetaDescription = p.desc;
  if (empty(doc.seoOgTitle)) patch.seoOgTitle = p.title;
  if (empty(doc.seoOgDescription)) patch.seoOgDescription = p.desc;

  if (Object.keys(patch).length === 0) {
    if (dryRun) console.log(`${p.slug}\n  all 4 fields already filled -- skipping`);
    skippedNoop++;
    continue;
  }

  if (dryRun) {
    console.log(`${p.slug}`);
    for (const [field, value] of Object.entries(patch)) {
      console.log(`  ${field}: (empty) -> "${value}"`);
    }
    const kept = ["seoMetaTitle", "seoMetaDescription", "seoOgTitle", "seoOgDescription"].filter((f) => !(f in patch));
    if (kept.length) console.log(`  kept existing: ${kept.join(", ")}`);
  }
  if (!dryRun) {
    await client.patch(doc._id).set(patch).commit();
    changed++;
    if (changed % 25 === 0) console.log(`  ...${changed} done`);
  }
}

console.log(
  dryRun
    ? `\n[dry-run] No writes performed. ${posts.length - notFound - skippedNoop} posts would be updated (some fields only, where empty). ${skippedNoop} already fully filled, skipped. ${notFound} not found.`
    : `\nDone. Updated ${changed} posts (some fields only, where empty). ${skippedNoop} already fully filled, skipped. ${notFound} not found.`
);
