/* =====================================================================
 * Category hub page resolver — shared shape for the 4 CategoryHubPage-based
 * landing pages (/treatments/advanced-fertility-techniques, male-infertility,
 * female-infertility, /services/maternity-services). One Sanity document
 * type (`categoryHubPage`) serves all 4, distinguished by `slug`. Same
 * per-section-fallback convention as src/lib/why-bfi.ts: an empty/partial
 * doc renders byte-identically from HUB_DEFAULTS[slug].
 *
 * Pure module (no server-only imports) — safe to bundle into client hub.tsx
 * files and the admin form.
 * ===================================================================== */
import type { IconName } from "@/lib/icon-map";

export type HubSlug =
  | "advanced-fertility-techniques"
  | "male-infertility"
  | "female-infertility"
  | "maternity-services";

export const HUB_SLUGS: HubSlug[] = [
  "advanced-fertility-techniques",
  "male-infertility",
  "female-infertility",
  "maternity-services",
];

export const HUB_LABELS: Record<HubSlug, string> = {
  "advanced-fertility-techniques": "Advanced Fertility Techniques",
  "male-infertility": "Male Infertility",
  "female-infertility": "Female Infertility",
  "maternity-services": "Maternity Services",
};

export type CHCard = { title: string; desc: string; href: string; icon: IconName };
export type CHStat = { value: string; label: string };
export type CHWhyPoint = { icon: IconName; title: string; desc: string };
export type CHFaq = { q: string; a: string };

export type CategoryHubData = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  breadcrumbLabel: string;
  cards: CHCard[];
  cardsSectionTitle: string;
  cardsSectionSubtitle: string;
  stats: CHStat[];
  overviewTitle: string;
  overviewTitleAccent: string;
  overviewParagraphs: string[];
  overviewBullets: string[];
  signsTitle: string;
  signsTitleAccent: string;
  signsSubtitle: string;
  signs: string[];
  whyTitle: string;
  whyTitleAccent: string;
  whyPoints: CHWhyPoint[];
  faqs: CHFaq[];
  heroImage: string;
  heroImageAlt: string;
  ctaHeading: string;
  ctaSubtitle: string;
};

export const HUB_DEFAULTS: Record<HubSlug, CategoryHubData> = {
  "advanced-fertility-techniques": {
    eyebrow: "Advanced Fertility Techniques",
    title: "World-Class",
    titleAccent: "Assisted Reproduction",
    subtitle:
      "From IVF and ICSI to cutting-edge sperm selection and donor programmes — Bavishi Fertility Institute combines 30+ years of expertise with the latest reproductive technology across 14 centres in India. Over 30,000 families created and counting.",
    breadcrumbLabel: "Advanced Fertility Techniques",
    cards: [
      { title: "IVF (In Vitro Fertilisation)", desc: "Advanced in-vitro fertilisation with ICSI for the best chance of success.", href: "/what-is-ivf", icon: "FlaskConical" },
      { title: "ICSI (Intracytoplasmic Sperm Injection)", desc: "A single healthy sperm injected directly into each mature egg for precise fertilisation.", href: "/icsi-treatment-intracytoplasmic-sperm-injection", icon: "Microscope" },
      { title: "IUI (Intrauterine Insemination)", desc: "A less invasive fertility treatment placing prepared sperm directly in the uterus.", href: "/intra-uterine-insemination-iui", icon: "Activity" },
      { title: "PICSI", desc: "Physiological sperm selection mimicking natural binding for healthier fertilisation.", href: "/physiological-intracytoplasmic-sperm-injection-picsi", icon: "Filter" },
      { title: "IMSI", desc: "High-magnification (6000×) sperm selection for better embryo quality.", href: "/intracytoplasmic-morphologically-selected-sperm-injection-imsi", icon: "Eye" },
      { title: "MACS (Magnetic Activated Cell Sorting)", desc: "Magnetic sorting technology to select the healthiest, most viable sperm.", href: "/magnetic-activated-cell-sorting-macs", icon: "Magnet" },
      { title: "Spindle View ICSI", desc: "Real-time spindle imaging for safer, more precise ICSI injection.", href: "/spindle-view-icsi", icon: "Eye" },
      { title: "Blastocyst Transfer", desc: "Day-5 blastocyst culture and transfer for stronger implantation rates.", href: "/blastocyst-culture-blastocyst-transfer", icon: "Layers" },
      { title: "Laser Assisted Hatching", desc: "Laser-assisted embryo hatching to improve implantation success.", href: "/laser-assisted-hatching", icon: "Zap" },
      { title: "IVF Failure — What's Next?", desc: "Specialised work-up and a fresh, evidence-based plan after a failed IVF cycle.", href: "/ivf-failure", icon: "ShieldCheck" },
      { title: "Preimplantation Genetic Testing (PGT)", desc: "Genetic testing of IVF embryos before transfer to improve success and reduce miscarriage.", href: "/pgt", icon: "Dna" },
      { title: "Egg Donation", desc: "Carefully matched, fully-screened egg-donor programme with high success rates.", href: "/egg-donation", icon: "Egg" },
      { title: "Sperm Donation", desc: "Screened, ethical donor-sperm programme following ICMR guidelines.", href: "/sperm-donation", icon: "Droplets" },
      { title: "Cryopreservation (Egg / Sperm / Embryo Freezing)", desc: "Safe, long-term freezing of eggs, sperm, and embryos to preserve your fertility.", href: "/cryopreservation", icon: "Snowflake" },
    ],
    cardsSectionTitle: "Our Advanced Treatments & Techniques",
    cardsSectionSubtitle: "Each technique has a dedicated page with detailed information — how it works, who it's for, what to expect, and why Bavishi is the right choice.",
    stats: [
      { value: "30,000+", label: "Successful pregnancies" },
      { value: "30+", label: "Years of IVF excellence" },
      { value: "14", label: "Centres with Class 1000 labs" },
      { value: "~100%", label: "Vitrification survival rate" },
    ],
    overviewTitle: "What is",
    overviewTitleAccent: "Assisted Reproduction?",
    overviewParagraphs: [
      "Assisted Reproductive Technology (ART) refers to a range of medical procedures designed to help couples and individuals achieve pregnancy when natural conception has not been successful. The most well-known is IVF — but modern reproductive medicine offers a much wider toolkit.",
      "At Bavishi Fertility Institute, we offer the full spectrum of ART: from simpler interventions like IUI (intrauterine insemination) to advanced IVF with ICSI, sophisticated sperm selection techniques (PICSI, IMSI, MACS), blastocyst culture, laser-assisted hatching, and comprehensive donor programmes. Each technique addresses a different clinical need.",
      "Our philosophy is simple — we use the least invasive effective treatment first. Not every patient needs IVF. But when IVF is the right path, our Class 1000 labs, experienced embryologists, and cutting-edge technology give you the best possible chance of success.",
    ],
    overviewBullets: [
      "IUI is the first-line ART for mild male factor or unexplained infertility",
      "IVF with ICSI is the gold standard for most moderate-to-severe causes",
      "Advanced sperm selection improves outcomes in male factor cases",
      "Blastocyst culture + vitrification maximise cumulative success",
      "Donor programmes offer a path when own gametes aren't viable",
      "Cryopreservation preserves future fertility for medical or personal reasons",
    ],
    signsTitle: "When is Advanced",
    signsTitleAccent: "Fertility Treatment Recommended?",
    signsSubtitle: "Your fertility specialist may recommend advanced techniques if any of the following apply to your situation.",
    signs: [
      "Failed to conceive after timed intercourse and/or ovulation induction",
      "Blocked, damaged, or absent fallopian tubes",
      "Moderate-to-severe male factor infertility",
      "Advanced maternal age (over 35–38)",
      "Low ovarian reserve or poor AMH levels",
      "Unexplained infertility after basic investigations",
      "Previous failed IUI cycles (typically 3–6 attempts)",
      "Need for genetic testing of embryos (PGT)",
      "Fertility preservation before cancer treatment or for personal reasons",
    ],
    whyTitle: "Why Choose Bavishi for",
    whyTitleAccent: "Advanced Fertility?",
    whyPoints: [
      { icon: "Microscope", title: "Class 1000 IVF Laboratories", desc: "Our labs meet international clean-room standards with HEPA-filtered air, positive pressure, and next-generation embryo incubators that replicate the body's environment for optimal embryo development." },
      { icon: "Dna", title: "Full Range of Sperm Selection", desc: "Not just standard ICSI — we offer PICSI, IMSI, MACS, and Spindle View ICSI to select the best sperm for fertilisation based on your specific diagnosis." },
      { icon: "FlaskConical", title: "Blastocyst Culture Expertise", desc: "Day-5 blastocyst culture with extended observation gives the strongest embryos the best chance. Our lab consistently achieves high blastocyst formation rates." },
      { icon: "Snowflake", title: "Near-Perfect Vitrification", desc: "Our rapid-freezing (vitrification) technique achieves close to 100% embryo survival, giving you flexibility to plan frozen embryo transfers at the ideal time." },
      { icon: "Stethoscope", title: "Senior Specialists at Every Step", desc: "From your first consultation through egg retrieval and embryo transfer, senior IVF consultants — not trainees — are personally involved at every critical stage." },
      { icon: "Award", title: "Award-Winning Outcomes", desc: "Nationally recognised for high IVF success rates. Our protocols are continuously refined based on data from over 30,000 treatment cycles." },
    ],
    faqs: [
      { q: "What is the difference between IVF and IUI?", a: "IUI (Intrauterine Insemination) is a simpler procedure where prepared sperm is placed directly inside the uterus during ovulation. IVF (In Vitro Fertilisation) involves stimulating the ovaries, retrieving eggs, fertilising them in the lab, and transferring the resulting embryo(s) to the uterus. IUI is less invasive and less expensive but has a lower success rate per cycle. Your doctor will recommend the right option based on your diagnosis." },
      { q: "What is ICSI and when is it needed?", a: "ICSI (Intracytoplasmic Sperm Injection) involves injecting a single selected sperm directly into the egg under a microscope. It's recommended when sperm count or motility is low, after previous IVF fertilisation failure, when using surgically retrieved sperm, or when using frozen eggs. At Bavishi, ICSI is standard in most IVF cycles to maximise fertilisation rates." },
      { q: "What are PICSI, IMSI, and MACS?", a: "These are advanced sperm selection techniques used alongside ICSI. PICSI selects sperm based on their ability to bind to hyaluronan (mimicking natural selection). IMSI uses 6000× magnification to identify morphologically superior sperm. MACS uses magnetic sorting to separate healthy sperm from those with DNA damage. Your embryologist recommends the best technique based on your semen analysis." },
      { q: "How long does one IVF cycle take?", a: "A typical IVF cycle takes about 2–3 weeks from the start of ovarian stimulation to embryo transfer. This includes 8–14 days of daily hormone injections, 3–4 monitoring visits, egg retrieval (a 15-minute procedure under sedation), and embryo transfer 3–5 days later. Results from the pregnancy test come about 14 days after transfer." },
      { q: "What is the success rate of IVF?", a: "Success rates depend on several factors including age, diagnosis, egg quality, and the clinic's protocols. At Bavishi Fertility Institute, our cumulative success rates (across multiple cycles) are among the highest in India. Women under 35 with good ovarian reserve generally have the best outcomes. Your doctor will give you a realistic, personalised success estimate based on your specific situation." },
      { q: "What happens to unused embryos?", a: "Surplus good-quality embryos are frozen by vitrification (rapid freezing) and stored safely for future use. Our vitrification technique achieves near-100% survival rates. Frozen embryo transfers (FET) are often as successful as fresh transfers and give you the option to try again without repeating the stimulation and retrieval steps." },
      { q: "Is egg/embryo freezing safe?", a: "Yes. Vitrification is a well-established technique used worldwide. Eggs and embryos can be stored safely for years without degradation. Studies show no increased risk of birth defects or developmental problems in children born from frozen eggs or embryos compared to fresh cycles." },
    ],
    heroImage: "/assets/ivf-icsi.png",
    heroImageAlt: "IVF and ICSI advanced fertility treatment",
    ctaHeading: "Start Your Journey Today",
    ctaSubtitle: "Our fertility specialists will recommend the technique best suited to your unique situation.",
  },

  "male-infertility": {
    eyebrow: "Male Infertility",
    title: "Comprehensive Care for",
    titleAccent: "Male Infertility",
    subtitle:
      "Nearly 40% of infertility cases involve a male factor. Our specialists use advanced diagnostics and cutting-edge treatments to address every cause — from hormonal imbalances to structural issues — so you can take confident steps toward fatherhood.",
    breadcrumbLabel: "Male Infertility",
    cards: [
      { title: "Low Sperm Count (Oligospermia)", desc: "Diagnosis and treatment for a low sperm count to improve your chances of conception.", href: "/oligospermia", icon: "Beaker" },
      { title: "Low Sperm Motility (Asthenospermia)", desc: "Improving and bypassing poor sperm motility with targeted therapies and advanced ART.", href: "/asthenospermia", icon: "Activity" },
      { title: "Zero Sperm Count (Azoospermia)", desc: "Sperm retrieval techniques and ICSI for men with no sperm in the ejaculate.", href: "/azoospermia", icon: "Microscope" },
      { title: "Surgical Sperm Retrieval (PESA / TESA / Micro-TESE)", desc: "Minimally invasive surgical procedures to retrieve sperm directly for use with ICSI.", href: "/surgical-sperm-retrieval", icon: "Target" },
      { title: "Erectile Dysfunction", desc: "Confidential evaluation and treatment for ED with integrated fertility support.", href: "/erectile-dysfunction", icon: "HeartPulse" },
    ],
    cardsSectionTitle: "Male Infertility Conditions We Treat",
    cardsSectionSubtitle: "Each condition has its own dedicated page with detailed information on causes, diagnosis, treatment options, and what to expect at Bavishi Fertility Institute.",
    stats: [
      { value: "40%", label: "Of infertility cases involve a male factor" },
      { value: "30+", label: "Years of andrology expertise" },
      { value: "14", label: "Centres across India" },
      { value: "90%+", label: "Sperm retrieval success rate" },
    ],
    overviewTitle: "What is",
    overviewTitleAccent: "Male Infertility?",
    overviewParagraphs: [
      "Male infertility refers to a man's inability to cause pregnancy in a fertile female partner. It is a surprisingly common condition — affecting roughly 1 in 6 couples trying to conceive — and is the sole or contributing factor in nearly half of all infertility cases worldwide.",
      "The most common causes involve problems with sperm production or delivery. These can range from hormonal disorders and genetic conditions to physical blockages, varicocele (enlarged veins in the scrotum), infections, or lifestyle factors. In many cases, targeted medical or surgical treatment can significantly improve fertility outcomes.",
      "At Bavishi Fertility Institute, we take a systematic, evidence-based approach. Every patient receives a thorough diagnostic workup — including WHO 2021-standard semen analysis, hormone profiling, and advanced testing when needed — before we recommend any treatment. Our goal is always to identify the root cause and choose the least invasive effective treatment.",
    ],
    overviewBullets: [
      "Male factor is involved in ~50% of infertility cases",
      "A semen analysis is the first and most important test",
      "Many causes are treatable with medication or minor surgery",
      "Advanced ART (IVF/ICSI) can overcome severe male factor",
      "Lifestyle changes alone can improve sperm quality in 3 months",
      "Even zero sperm count has treatment options via sperm retrieval",
    ],
    signsTitle: "Signs You Should",
    signsTitleAccent: "See a Specialist",
    signsSubtitle: "If you or your partner have been trying to conceive for 12 months (or 6 months if she is over 35), or if you notice any of the following, consult a fertility specialist.",
    signs: [
      "Difficulty conceiving after 12 months of unprotected intercourse",
      "Known low sperm count or abnormal semen analysis results",
      "History of testicular injury, surgery, or undescended testes",
      "Swelling, pain, or a lump in the testicle area",
      "Difficulty with erections or ejaculation",
      "Previous groin, prostate, or genital surgery",
      "History of sexually transmitted infections",
      "Family history of fertility problems or genetic conditions",
      "Varicocele (enlarged veins felt in the scrotum)",
    ],
    whyTitle: "Why Choose Bavishi",
    whyTitleAccent: "Fertility Institute?",
    whyPoints: [
      { icon: "Stethoscope", title: "Dedicated Male Fertility Specialists", desc: "Our andrologists and urologists specialise exclusively in male reproductive health — from hormonal evaluation to microsurgical sperm retrieval." },
      { icon: "Microscope", title: "State-of-the-Art Andrology Lab", desc: "WHO 2021-compliant semen analysis, DNA fragmentation testing, and advanced sperm selection techniques (MACS, IMSI, PICSI) all under one roof." },
      { icon: "FlaskConical", title: "Advanced Sperm Retrieval", desc: "PESA, TESA, TESE and Micro-TESE performed by experienced microsurgeons with high retrieval success rates, even in severe azoospermia." },
      { icon: "ShieldCheck", title: "Confidential & Comfortable", desc: "Male infertility consultations are handled with complete discretion. Separate evaluation rooms and a no-judgement approach ensure your comfort." },
      { icon: "Award", title: "Proven Track Record", desc: "Over 30,000 successful pregnancies and 30+ years of experience treating the full spectrum of male factor infertility." },
      { icon: "MapPin", title: "14 Centres, One Standard", desc: "Every Bavishi centre — from Ahmedabad to Mumbai to Varanasi — follows the same protocols, lab standards, and quality benchmarks." },
    ],
    faqs: [
      { q: "What causes male infertility?", a: "Male infertility can result from low sperm production, abnormal sperm function, or blockages preventing sperm delivery. Contributing factors include varicocele, hormonal imbalances, infections, genetic conditions, lifestyle factors (smoking, excessive alcohol, obesity), and environmental exposures. In about 30% of cases, no identifiable cause is found (idiopathic infertility)." },
      { q: "How is male infertility diagnosed?", a: "Diagnosis typically starts with a thorough semen analysis (evaluating count, motility, and morphology per WHO 2021 standards), followed by a physical examination, hormone profile (FSH, LH, testosterone, prolactin), and if needed, scrotal ultrasound and genetic testing. Advanced tests like sperm DNA fragmentation may be recommended in specific cases." },
      { q: "Can male infertility be treated?", a: "Yes, in most cases. Treatment depends on the underlying cause — hormonal therapy for imbalances, antibiotics for infections, microsurgery for varicocele or blockages, and assisted reproductive techniques (IUI, IVF with ICSI) when natural conception isn't possible. Even men with zero sperm count (azoospermia) can father biological children through surgical sperm retrieval combined with ICSI." },
      { q: "What is the difference between TESA, PESA, and Micro-TESE?", a: "All three are surgical sperm retrieval procedures. PESA (percutaneous epididymal aspiration) uses a needle to aspirate sperm from the epididymis. TESA (testicular aspiration) retrieves tissue from the testis itself. Micro-TESE is a microsurgical approach that identifies sperm-producing areas under high magnification — it has the highest success rate for non-obstructive azoospermia." },
      { q: "Does lifestyle affect male fertility?", a: "Significantly. Smoking, excessive alcohol, recreational drugs, obesity, prolonged heat exposure (hot baths, tight clothing, laptops on lap), high stress, and poor sleep can all reduce sperm quality. Improving these factors often leads to measurable improvement in semen parameters within 3 months (one full sperm production cycle)." },
      { q: "How long does it take to see improvement after treatment?", a: "Sperm production (spermatogenesis) takes approximately 72–74 days, so most treatments — whether medical or lifestyle-based — need at least 3 months to show results on a repeat semen analysis. Surgical interventions like varicocele repair may take 3–6 months to show full improvement." },
    ],
    heroImage: "/assets/male-infertility-hero.png",
    heroImageAlt: "Male infertility diagnosis and treatment illustration",
    ctaHeading: "Expert Male Fertility Care, One Call Away",
    ctaSubtitle: "Confidential consultations with India's leading male fertility specialists. We're here to help.",
  },

  "female-infertility": {
    eyebrow: "Female Infertility",
    title: "Personalised Pathways for",
    titleAccent: "Female Fertility",
    subtitle:
      "From PCOS and endometriosis to low ovarian reserve — our experienced gynaecologists create individualised treatment plans addressing the root cause, not just the symptoms. Every woman's fertility journey is unique, and so is our approach.",
    breadcrumbLabel: "Female Infertility",
    cards: [
      { title: "Conceive Naturally", desc: "Timing, lifestyle optimisation, and expert guidance to maximise your chances of natural conception.", href: "/conceive-naturally", icon: "Leaf" },
      { title: "PRP for Infertility", desc: "Platelet-rich plasma therapy for ovarian and endometrial rejuvenation in selected cases.", href: "/prp-infertility", icon: "Droplets" },
      { title: "PMOS-PCOS (Polyendocrine Metabolic Ovarian Syndrome)", desc: "Ovulation-focused management and fertility treatment tailored to your PMOS-PCOS profile.", href: "/pcos", icon: "Activity" },
      { title: "Poor Ovarian Reserve / Low AMH", desc: "Tailored stimulation protocols and advanced techniques for women with a diminished egg count.", href: "/ovarian-reserve", icon: "Egg" },
      { title: "Ovarian Rejuvenation", desc: "Innovative PRP-based ovarian rejuvenation to support a very low reserve.", href: "/ovarian-rejuvenation", icon: "Sparkles" },
      { title: "Fibroids", desc: "Fertility-preserving evaluation and treatment of uterine fibroids affecting conception.", href: "/fibroids", icon: "ShieldCheck" },
      { title: "Endometriosis", desc: "Specialised endometriosis care with a focus on preserving and improving fertility outcomes.", href: "/endometriosis", icon: "HeartPulse" },
    ],
    cardsSectionTitle: "Female Infertility Conditions We Treat",
    cardsSectionSubtitle: "Each condition has its own dedicated page with in-depth information on causes, symptoms, diagnosis, and the treatment options available at Bavishi Fertility Institute.",
    stats: [
      { value: "30,000+", label: "Successful pregnancies" },
      { value: "30+", label: "Years of experience" },
      { value: "14", label: "Centres across India" },
      { value: "1 in 4", label: "Women affected by PCOS in India" },
    ],
    overviewTitle: "Understanding",
    overviewTitleAccent: "Female Infertility",
    overviewParagraphs: [
      "Female infertility is the difficulty in conceiving or carrying a pregnancy to term. It affects millions of women in India and around the world — and is often caused by treatable conditions that, once identified, respond well to modern medical and surgical interventions.",
      "The female reproductive system is complex, and fertility depends on a chain of events: regular ovulation, healthy fallopian tubes for egg transport, a receptive uterine lining for implantation, and the right hormonal environment to sustain a pregnancy. A problem at any step can make conception challenging.",
      "At Bavishi Fertility Institute, we begin every evaluation with a compassionate, judgement-free conversation followed by a systematic diagnostic workup. Our specialists take the time to understand your medical history, lifestyle, and goals — because the right treatment for you depends on far more than a single test result.",
    ],
    overviewBullets: [
      "Ovulation disorders account for ~25% of female infertility",
      "PCOS affects 1 in 4 Indian women of reproductive age",
      "Age is the single biggest factor in egg quality",
      "Many causes are treatable without needing IVF",
      "Early diagnosis leads to better outcomes",
      "Emotional and nutritional support improve success rates",
    ],
    signsTitle: "Signs of",
    signsTitleAccent: "Female Infertility",
    signsSubtitle: "These signs don't always mean infertility, but they warrant a specialist evaluation — especially if you've been trying to conceive.",
    signs: [
      "Irregular, very heavy, or absent menstrual periods",
      "Severe menstrual cramps or pelvic pain",
      "Pain during intercourse",
      "Inability to conceive after 12 months (6 months if over 35)",
      "Two or more miscarriages",
      "Known diagnosis of PCOS, endometriosis, or fibroids",
      "History of pelvic inflammatory disease or STIs",
      "Previous abdominal or pelvic surgery",
      "Unexplained weight gain, acne, or excess facial hair (signs of hormonal imbalance)",
    ],
    whyTitle: "Why Choose Bavishi",
    whyTitleAccent: "Fertility Institute?",
    whyPoints: [
      { icon: "Stethoscope", title: "Female Fertility Specialists", desc: "Our team includes senior gynaecologists, reproductive endocrinologists, and IVF specialists with decades of combined experience in treating complex female infertility." },
      { icon: "Microscope", title: "Advanced Diagnostics", desc: "3D ultrasound, hysteroscopy, laparoscopy, AMH profiling, and hormonal assessment — all available in-house for a complete, same-day diagnostic workup." },
      { icon: "HeartPulse", title: "Personalised Protocols", desc: "No two women are alike. We design individualised treatment plans based on your age, AMH, diagnosis, and previous treatment history — not a one-size-fits-all approach." },
      { icon: "ShieldCheck", title: "Fertility-Preserving Approach", desc: "Whether treating fibroids, endometriosis, or ovarian cysts, we always prioritise approaches that preserve and protect your reproductive potential." },
      { icon: "Award", title: "Nationally Recognised Excellence", desc: "Multiple national awards for IVF success rates and patient care. Our outcomes are benchmarked against international standards." },
      { icon: "Users", title: "Holistic Support System", desc: "From fertility counsellors and nutritionists to yoga and emotional wellness support — we treat the whole person, not just the diagnosis." },
    ],
    faqs: [
      { q: "What are the most common causes of female infertility?", a: "The most common causes include ovulation disorders (such as PCOS), blocked or damaged fallopian tubes, endometriosis, uterine fibroids, age-related decline in egg quality and quantity (diminished ovarian reserve), and hormonal imbalances. In about 10–15% of cases, no specific cause is identified (unexplained infertility)." },
      { q: "At what age does female fertility start to decline?", a: "Fertility begins to gradually decline from age 30 and more noticeably after 35. After 40, the decline accelerates significantly — both in the number and quality of eggs. However, with modern treatments like IVF, ICSI, and tailored protocols for low ovarian reserve, many women above 35 achieve successful pregnancies at Bavishi Fertility Institute." },
      { q: "What is AMH and why does it matter?", a: "AMH (Anti-Müllerian Hormone) is a blood test that estimates your ovarian reserve — the number of eggs remaining. A low AMH level suggests fewer eggs but does NOT mean you cannot conceive. It helps your doctor choose the right stimulation protocol. We offer a free AMH Level Interpreter tool on our website to help you understand your results." },
      { q: "Can PCOS be cured?", a: "PCOS is a lifelong hormonal condition that can be effectively managed but not cured. Treatment focuses on restoring regular ovulation through lifestyle changes, medications (like letrozole or clomiphene), and if needed, IVF. Many women with PCOS conceive successfully with the right treatment approach — it is one of the most treatable causes of infertility." },
      { q: "Do fibroids always affect fertility?", a: "Not always. The impact depends on the size, number, and location of the fibroids. Submucosal fibroids (inside the uterine cavity) are most likely to affect implantation and should usually be removed before fertility treatment. Intramural and subserosal fibroids may or may not require treatment depending on their size and position." },
      { q: "How is endometriosis diagnosed and treated for fertility?", a: "Endometriosis is definitively diagnosed via laparoscopy, though ultrasound can identify endometriomas (chocolate cysts). For fertility, treatment depends on severity — mild cases may respond to ovulation induction + IUI, while moderate-to-severe cases often benefit from laparoscopic excision followed by IVF. Our surgeons specialise in fertility-preserving endometriosis surgery." },
      { q: "When should I see a fertility specialist?", a: "If you're under 35 and haven't conceived after 12 months of regular unprotected intercourse, or under 6 months if you're over 35. See a specialist sooner if you have irregular or absent periods, known endometriosis, PCOS, a history of pelvic surgery, or recurrent miscarriages." },
    ],
    heroImage: "/assets/conditions/conceive-naturally.png",
    heroImageAlt: "Female fertility care and diagnosis illustration",
    ctaHeading: "Your Fertility, Your Plan",
    ctaSubtitle: "Speak with our specialists to explore the best path forward for your unique situation.",
  },

  "maternity-services": {
    eyebrow: "Maternity Services",
    title: "Safe, Caring",
    titleAccent: "Pregnancy & Delivery",
    subtitle:
      "From your first scan to the moment you hold your baby — Bavishi Fertility & Birthing provides complete maternity care with experienced obstetricians, modern labour suites, and a focus on your comfort and safety.",
    breadcrumbLabel: "Maternity Services",
    cards: [
      { title: "3D/4D Sonography", desc: "Advanced 3D & 4D ultrasound imaging for clear, detailed views of your baby's growth and wellbeing.", href: "/services/3d-4d-sonography", icon: "ScanLine" },
      { title: "Painless Delivery", desc: "Epidural-supported labour for a calm, comfortable and well-managed birth experience.", href: "/services/painless-delivery", icon: "Feather" },
      { title: "Normal Delivery", desc: "Safe, natural vaginal birth guided by experienced obstetricians and a caring, watchful team.", href: "/services/normal-delivery", icon: "Baby" },
      { title: "Fetal Medicine", desc: "Specialised assessment and care for your baby's health and development throughout pregnancy.", href: "/services/fetal-medicine", icon: "Stethoscope" },
      { title: "High-Risk Pregnancy Care", desc: "Expert monitoring and management for complex and high-risk pregnancies, every step of the way.", href: "/services/high-risk-pregnancy-care", icon: "ShieldCheck" },
      { title: "Twin Pregnancy Care", desc: "Dedicated, closely-monitored care for twin and multiple pregnancies through to safe delivery.", href: "/services/twin-pregnancy-care", icon: "Users" },
    ],
    cardsSectionTitle: "Our Maternity Services",
    cardsSectionSubtitle: "Click on any service below to learn what it involves, who it's for, and how our team delivers the best possible care.",
    stats: [
      { value: "5,000+", label: "Safe deliveries" },
      { value: "30+", label: "Years of obstetric care" },
      { value: "24/7", label: "Emergency obstetric team" },
      { value: "100%", label: "Consultant-led deliveries" },
    ],
    overviewTitle: "Complete",
    overviewTitleAccent: "Maternity Care",
    overviewParagraphs: [
      "Bavishi Fertility & Birthing offers end-to-end maternity care — from the earliest weeks of pregnancy through a safe delivery and postnatal recovery. As a centre that helps thousands of couples achieve pregnancy through IVF and other fertility treatments, we understand how precious every pregnancy is.",
      "Our maternity programme is built on three pillars: experienced consultant-led care (every delivery is managed by a senior obstetrician, not a trainee), modern infrastructure (private labour suites, 24/7 epidural availability, in-house neonatal ICU), and a philosophy that prioritises natural birth while being fully prepared for any complication.",
      "Whether yours is a straightforward pregnancy, a high-risk case requiring extra monitoring, a twin pregnancy, or an IVF-conceived pregnancy — our team has the expertise and infrastructure to ensure the safest possible outcome for you and your baby.",
    ],
    overviewBullets: [
      "Consultant-led care at every delivery — not trainee-managed",
      "24/7 epidural and emergency obstetric availability",
      "In-house neonatal ICU for immediate newborn care",
      "Special expertise in IVF and multiple-pregnancy management",
      "High normal-delivery rate with a non-interventionist approach",
      "Continuity from fertility treatment through maternity and delivery",
    ],
    signsTitle: "When to Choose",
    signsTitleAccent: "Specialist Maternity Care",
    signsSubtitle: "All pregnancies benefit from quality obstetric care, but specialist maternity services are especially important if any of the following apply.",
    signs: [
      "Pregnancy achieved through IVF, ICSI, or other ART procedures",
      "Twin or multiple pregnancy",
      "Age over 35 at the time of delivery",
      "Pre-existing medical conditions (diabetes, hypertension, thyroid, cardiac)",
      "Previous complicated delivery or C-section",
      "History of preterm birth or cervical incompetence",
      "Diagnosed fetal anomaly or growth concern",
      "Gestational diabetes or pregnancy-induced hypertension",
      "Desire for painless (epidural) delivery with specialist anaesthesia support",
    ],
    whyTitle: "Why Choose Bavishi",
    whyTitleAccent: "Fertility & Birthing?",
    whyPoints: [
      { icon: "Stethoscope", title: "Senior Obstetricians, Always", desc: "Every delivery at Bavishi is led by a consultant obstetrician — not a trainee. Our experienced team handles normal, high-risk, and complex deliveries with the same level of personal attention." },
      { icon: "ShieldCheck", title: "Modern Labour & Birthing Suites", desc: "Comfortable, private labour rooms equipped with fetal monitoring, immediate access to the operation theatre, and a neonatal ICU on standby — so you feel safe and cared for throughout." },
      { icon: "HeartPulse", title: "Painless Delivery Expertise", desc: "Our anaesthesia team specialises in labour epidurals. We offer 24/7 epidural availability so your birth experience is calm, comfortable, and entirely within your control." },
      { icon: "Microscope", title: "Advanced Fetal Diagnostics", desc: "State-of-the-art 3D/4D ultrasound, fetal echocardiography, Doppler studies, and genetic screening — all available in-house for comprehensive prenatal assessment." },
      { icon: "Users", title: "IVF Pregnancy Specialists", desc: "As a leading fertility centre, we have unique expertise in managing IVF pregnancies, including twins and higher-order multiples, with the extra care these precious pregnancies deserve." },
      { icon: "Award", title: "Continuity of Care", desc: "From fertility treatment through pregnancy and delivery — many patients experience their complete journey at Bavishi. This continuity means your team knows your history inside and out." },
    ],
    faqs: [
      { q: "What is painless delivery and is it safe?", a: "Painless delivery uses an epidural — a local anaesthetic administered through a thin catheter in the lower back — to numb pain during labour while keeping you fully awake and alert. It is one of the safest and most widely used pain relief methods in obstetrics worldwide. Our anaesthesia team has extensive experience with labour epidurals and monitors both mother and baby throughout." },
      { q: "Do you encourage normal delivery or C-section?", a: "We strongly encourage and support normal (vaginal) delivery whenever it's safe to do so. Our approach is to allow natural labour to progress with close monitoring, intervening only when medically necessary. Our normal delivery rates are well above the national average. However, when a C-section is genuinely needed for the safety of mother or baby, we perform it without hesitation." },
      { q: "What makes a pregnancy 'high-risk'?", a: "A pregnancy is considered high-risk when there are factors that increase the chance of complications for mother or baby. Common reasons include: advanced maternal age (over 35), IVF/ART conception, twin or multiple pregnancy, pre-existing conditions (diabetes, hypertension, thyroid disorders), previous C-section or complicated delivery, recurrent miscarriage, or pregnancy complications like pre-eclampsia or gestational diabetes." },
      { q: "How is twin pregnancy care different?", a: "Twin pregnancies need more frequent monitoring — typically fortnightly scans after 16 weeks, with additional growth scans and Doppler studies. There's a higher risk of preterm delivery, growth restriction, and preeclampsia. Our team creates an individualised monitoring plan, and we discuss delivery timing and method (vaginal vs. C-section) based on the type of twin pregnancy (identical vs. fraternal, shared placenta vs. separate)." },
      { q: "What fetal medicine services do you offer?", a: "Our fetal medicine unit provides advanced prenatal diagnosis and management: detailed anomaly scans, fetal echocardiography, first-trimester combined screening (NT scan + dual markers), non-invasive prenatal testing (NIPT), Doppler velocimetry for growth monitoring, and 3D/4D imaging. When an anomaly is detected, our team provides counselling and a management plan." },
      { q: "Can I deliver at Bavishi even if I didn't do IVF here?", a: "Absolutely. While many of our maternity patients are IVF-conceived pregnancies from our fertility programme, our maternity services are open to all women. Whether you conceived naturally or through treatment elsewhere, you'll receive the same high standard of obstetric care." },
      { q: "What should I look for in a maternity hospital?", a: "Key factors include: consultant-led deliveries (not just residents), 24/7 emergency obstetric and anaesthesia cover, an in-house neonatal ICU, high normal-delivery rates (indicating a non-interventionist philosophy), modern labour rooms with privacy, and a team experienced in high-risk pregnancies. Bavishi meets all of these criteria." },
    ],
    heroImage: "/assets/hero-mother-baby1.png",
    heroImageAlt: "Happy pregnant mother — Bavishi Fertility & Birthing maternity care",
    ctaHeading: "Plan Your Maternity Journey",
    ctaSubtitle: "Speak with our obstetric team to discuss your pregnancy care and delivery preferences.",
  },
};

export type CategoryHubSource =
  | {
      eyebrow?: string; title?: string; titleAccent?: string; subtitle?: string; breadcrumbLabel?: string;
      cards?: { title?: string; desc?: string; href?: string; icon?: string }[] | null;
      cardsSectionTitle?: string; cardsSectionSubtitle?: string;
      stats?: { value?: string; label?: string }[] | null;
      overviewTitle?: string; overviewTitleAccent?: string;
      overviewParagraphs?: { value?: string }[] | null;
      overviewBullets?: { value?: string }[] | null;
      signsTitle?: string; signsTitleAccent?: string; signsSubtitle?: string;
      signs?: { value?: string }[] | null;
      whyTitle?: string; whyTitleAccent?: string;
      whyPoints?: { icon?: string; title?: string; desc?: string }[] | null;
      faqs?: { q?: string; a?: string }[] | null;
      heroImage?: string; heroImageAlt?: string; ctaHeading?: string; ctaSubtitle?: string;
    }
  | null
  | undefined;

export function resolveCategoryHub(slug: HubSlug, src: CategoryHubSource): CategoryHubData {
  const d = HUB_DEFAULTS[slug];
  if (!src) return d;

  return {
    eyebrow: src.eyebrow || d.eyebrow,
    title: src.title || d.title,
    titleAccent: src.titleAccent ?? d.titleAccent,
    subtitle: src.subtitle || d.subtitle,
    breadcrumbLabel: src.breadcrumbLabel || d.breadcrumbLabel,
    cards: src.cards?.length
      ? src.cards.map((c) => ({ title: c.title ?? "", desc: c.desc ?? "", href: c.href ?? "", icon: (c.icon ?? "Sparkles") as IconName }))
      : d.cards,
    cardsSectionTitle: src.cardsSectionTitle || d.cardsSectionTitle,
    cardsSectionSubtitle: src.cardsSectionSubtitle || d.cardsSectionSubtitle,
    stats: src.stats?.length ? src.stats.map((s) => ({ value: s.value ?? "", label: s.label ?? "" })) : d.stats,
    overviewTitle: src.overviewTitle || d.overviewTitle,
    overviewTitleAccent: src.overviewTitleAccent ?? d.overviewTitleAccent,
    overviewParagraphs: src.overviewParagraphs?.length ? src.overviewParagraphs.map((p) => p.value ?? "").filter(Boolean) : d.overviewParagraphs,
    overviewBullets: src.overviewBullets?.length ? src.overviewBullets.map((b) => b.value ?? "").filter(Boolean) : d.overviewBullets,
    signsTitle: src.signsTitle || d.signsTitle,
    signsTitleAccent: src.signsTitleAccent ?? d.signsTitleAccent,
    signsSubtitle: src.signsSubtitle ?? d.signsSubtitle,
    signs: src.signs?.length ? src.signs.map((s) => s.value ?? "").filter(Boolean) : d.signs,
    whyTitle: src.whyTitle || d.whyTitle,
    whyTitleAccent: src.whyTitleAccent ?? d.whyTitleAccent,
    whyPoints: src.whyPoints?.length
      ? src.whyPoints.map((p) => ({ icon: (p.icon ?? "Sparkles") as IconName, title: p.title ?? "", desc: p.desc ?? "" }))
      : d.whyPoints,
    faqs: src.faqs?.length ? src.faqs.map((f) => ({ q: f.q ?? "", a: f.a ?? "" })) : d.faqs,
    heroImage: src.heroImage || d.heroImage,
    heroImageAlt: src.heroImageAlt ?? d.heroImageAlt,
    ctaHeading: src.ctaHeading || d.ctaHeading,
    ctaSubtitle: src.ctaSubtitle || d.ctaSubtitle,
  };
}

export function materializeCategoryHubSource(slug: HubSlug, src: CategoryHubSource): NonNullable<CategoryHubSource> {
  const r = resolveCategoryHub(slug, src);
  const s = (src ?? {}) as NonNullable<CategoryHubSource>;
  return {
    ...s,
    eyebrow: r.eyebrow,
    title: r.title,
    titleAccent: r.titleAccent,
    subtitle: r.subtitle,
    breadcrumbLabel: r.breadcrumbLabel,
    cards: r.cards,
    cardsSectionTitle: r.cardsSectionTitle,
    cardsSectionSubtitle: r.cardsSectionSubtitle,
    stats: r.stats,
    overviewTitle: r.overviewTitle,
    overviewTitleAccent: r.overviewTitleAccent,
    overviewParagraphs: r.overviewParagraphs.map((value) => ({ value })),
    overviewBullets: r.overviewBullets.map((value) => ({ value })),
    signsTitle: r.signsTitle,
    signsTitleAccent: r.signsTitleAccent,
    signsSubtitle: r.signsSubtitle,
    signs: r.signs.map((value) => ({ value })),
    whyTitle: r.whyTitle,
    whyTitleAccent: r.whyTitleAccent,
    whyPoints: r.whyPoints,
    faqs: r.faqs,
    heroImage: r.heroImage,
    heroImageAlt: r.heroImageAlt,
    ctaHeading: r.ctaHeading,
    ctaSubtitle: r.ctaSubtitle,
  };
}
