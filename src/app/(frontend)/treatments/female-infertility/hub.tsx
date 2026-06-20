"use client";
import {
  Leaf, Droplets, Activity, Egg, Sparkles, ShieldCheck, HeartPulse,
  Award, MapPin, Stethoscope, Microscope, Users,
} from "lucide-react";
import { CategoryHubPage, type HubCard, type HubStat, type HubFaq, type HubWhyPoint } from "@/components/category-hub-page";

const cards: HubCard[] = [
  {
    title: "Conceive Naturally",
    desc: "Timing, lifestyle optimisation, and expert guidance to maximise your chances of natural conception.",
    href: "/conceive-naturally",
    icon: Leaf,
  },
  {
    title: "PRP for Infertility",
    desc: "Platelet-rich plasma therapy for ovarian and endometrial rejuvenation in selected cases.",
    href: "/prp-infertility",
    icon: Droplets,
  },
  {
    title: "PCOS (Polycystic Ovary Syndrome)",
    desc: "Ovulation-focused management and fertility treatment tailored to your PCOS profile.",
    href: "/pcos",
    icon: Activity,
  },
  {
    title: "Poor Ovarian Reserve / Low AMH",
    desc: "Tailored stimulation protocols and advanced techniques for women with a diminished egg count.",
    href: "/ovarian-reserve",
    icon: Egg,
  },
  {
    title: "Ovarian Rejuvenation",
    desc: "Innovative PRP-based ovarian rejuvenation to support a very low reserve.",
    href: "/ovarian-rejuvenation",
    icon: Sparkles,
  },
  {
    title: "Fibroids",
    desc: "Fertility-preserving evaluation and treatment of uterine fibroids affecting conception.",
    href: "/fibroids",
    icon: ShieldCheck,
  },
  {
    title: "Endometriosis",
    desc: "Specialised endometriosis care with a focus on preserving and improving fertility outcomes.",
    href: "/endometriosis",
    icon: HeartPulse,
  },
];

const stats: HubStat[] = [
  { value: "30,000+", label: "Successful pregnancies" },
  { value: "30+", label: "Years of experience" },
  { value: "14", label: "Centres across India" },
  { value: "1 in 4", label: "Women affected by PCOS in India" },
];

const whyPoints: HubWhyPoint[] = [
  {
    icon: Stethoscope,
    title: "Female Fertility Specialists",
    desc: "Our team includes senior gynaecologists, reproductive endocrinologists, and IVF specialists with decades of combined experience in treating complex female infertility.",
  },
  {
    icon: Microscope,
    title: "Advanced Diagnostics",
    desc: "3D ultrasound, hysteroscopy, laparoscopy, AMH profiling, and hormonal assessment — all available in-house for a complete, same-day diagnostic workup.",
  },
  {
    icon: HeartPulse,
    title: "Personalised Protocols",
    desc: "No two women are alike. We design individualised treatment plans based on your age, AMH, diagnosis, and previous treatment history — not a one-size-fits-all approach.",
  },
  {
    icon: ShieldCheck,
    title: "Fertility-Preserving Approach",
    desc: "Whether treating fibroids, endometriosis, or ovarian cysts, we always prioritise approaches that preserve and protect your reproductive potential.",
  },
  {
    icon: Award,
    title: "Nationally Recognised Excellence",
    desc: "Multiple national awards for IVF success rates and patient care. Our outcomes are benchmarked against international standards.",
  },
  {
    icon: Users,
    title: "Holistic Support System",
    desc: "From fertility counsellors and nutritionists to yoga and emotional wellness support — we treat the whole person, not just the diagnosis.",
  },
];

const faqs: HubFaq[] = [
  {
    q: "What are the most common causes of female infertility?",
    a: "The most common causes include ovulation disorders (such as PCOS), blocked or damaged fallopian tubes, endometriosis, uterine fibroids, age-related decline in egg quality and quantity (diminished ovarian reserve), and hormonal imbalances. In about 10–15% of cases, no specific cause is identified (unexplained infertility).",
  },
  {
    q: "At what age does female fertility start to decline?",
    a: "Fertility begins to gradually decline from age 30 and more noticeably after 35. After 40, the decline accelerates significantly — both in the number and quality of eggs. However, with modern treatments like IVF, ICSI, and tailored protocols for low ovarian reserve, many women above 35 achieve successful pregnancies at Bavishi Fertility Institute.",
  },
  {
    q: "What is AMH and why does it matter?",
    a: "AMH (Anti-Müllerian Hormone) is a blood test that estimates your ovarian reserve — the number of eggs remaining. A low AMH level suggests fewer eggs but does NOT mean you cannot conceive. It helps your doctor choose the right stimulation protocol. We offer a free AMH Level Interpreter tool on our website to help you understand your results.",
  },
  {
    q: "Can PCOS be cured?",
    a: "PCOS is a lifelong hormonal condition that can be effectively managed but not cured. Treatment focuses on restoring regular ovulation through lifestyle changes, medications (like letrozole or clomiphene), and if needed, IVF. Many women with PCOS conceive successfully with the right treatment approach — it is one of the most treatable causes of infertility.",
  },
  {
    q: "Do fibroids always affect fertility?",
    a: "Not always. The impact depends on the size, number, and location of the fibroids. Submucosal fibroids (inside the uterine cavity) are most likely to affect implantation and should usually be removed before fertility treatment. Intramural and subserosal fibroids may or may not require treatment depending on their size and position.",
  },
  {
    q: "How is endometriosis diagnosed and treated for fertility?",
    a: "Endometriosis is definitively diagnosed via laparoscopy, though ultrasound can identify endometriomas (chocolate cysts). For fertility, treatment depends on severity — mild cases may respond to ovulation induction + IUI, while moderate-to-severe cases often benefit from laparoscopic excision followed by IVF. Our surgeons specialise in fertility-preserving endometriosis surgery.",
  },
  {
    q: "When should I see a fertility specialist?",
    a: "If you're under 35 and haven't conceived after 12 months of regular unprotected intercourse, or under 6 months if you're over 35. See a specialist sooner if you have irregular or absent periods, known endometriosis, PCOS, a history of pelvic surgery, or recurrent miscarriages.",
  },
];

export function FemaleInfertilityHub() {
  return (
    <CategoryHubPage
      eyebrow="Female Infertility"
      title="Personalised Pathways for"
      titleAccent="Female Fertility"
      subtitle="From PCOS and endometriosis to low ovarian reserve — our experienced gynaecologists create individualised treatment plans addressing the root cause, not just the symptoms. Every woman's fertility journey is unique, and so is our approach."
      breadcrumbLabel="Female Infertility"
      cards={cards}
      cardsSectionTitle="Female Infertility Conditions We Treat"
      cardsSectionSubtitle="Each condition has its own dedicated page with in-depth information on causes, symptoms, diagnosis, and the treatment options available at Bavishi Fertility Institute."
      stats={stats}
      overviewTitle="Understanding"
      overviewTitleAccent="Female Infertility"
      overviewParagraphs={[
        "Female infertility is the difficulty in conceiving or carrying a pregnancy to term. It affects millions of women in India and around the world — and is often caused by treatable conditions that, once identified, respond well to modern medical and surgical interventions.",
        "The female reproductive system is complex, and fertility depends on a chain of events: regular ovulation, healthy fallopian tubes for egg transport, a receptive uterine lining for implantation, and the right hormonal environment to sustain a pregnancy. A problem at any step can make conception challenging.",
        "At Bavishi Fertility Institute, we begin every evaluation with a compassionate, judgement-free conversation followed by a systematic diagnostic workup. Our specialists take the time to understand your medical history, lifestyle, and goals — because the right treatment for you depends on far more than a single test result.",
      ]}
      overviewBullets={[
        "Ovulation disorders account for ~25% of female infertility",
        "PCOS affects 1 in 4 Indian women of reproductive age",
        "Age is the single biggest factor in egg quality",
        "Many causes are treatable without needing IVF",
        "Early diagnosis leads to better outcomes",
        "Emotional and nutritional support improve success rates",
      ]}
      signsTitle="Signs of"
      signsTitleAccent="Female Infertility"
      signsSubtitle="These signs don't always mean infertility, but they warrant a specialist evaluation — especially if you've been trying to conceive."
      signs={[
        "Irregular, very heavy, or absent menstrual periods",
        "Severe menstrual cramps or pelvic pain",
        "Pain during intercourse",
        "Inability to conceive after 12 months (6 months if over 35)",
        "Two or more miscarriages",
        "Known diagnosis of PCOS, endometriosis, or fibroids",
        "History of pelvic inflammatory disease or STIs",
        "Previous abdominal or pelvic surgery",
        "Unexplained weight gain, acne, or excess facial hair (signs of hormonal imbalance)",
      ]}
      whyTitle="Why Choose Bavishi"
      whyTitleAccent="Fertility Institute?"
      whyPoints={whyPoints}
      faqs={faqs}
      heroImage="/assets/conditions/conceive-naturally.png"
      heroImageAlt="Female fertility care and diagnosis illustration"
      ctaHeading="Your Fertility, Your Plan"
      ctaSubtitle="Speak with our specialists to explore the best path forward for your unique situation."
    />
  );
}
