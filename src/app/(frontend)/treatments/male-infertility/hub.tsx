"use client";
import {
  Beaker, Activity, Microscope, Target, ShieldCheck, HeartPulse,
  Award, Users, Clock, MapPin, Stethoscope, FlaskConical,
} from "lucide-react";
import { CategoryHubPage, type HubCard, type HubStat, type HubFaq, type HubWhyPoint } from "@/components/category-hub-page";

const cards: HubCard[] = [
  {
    title: "Low Sperm Count (Oligospermia)",
    desc: "Diagnosis and treatment for a low sperm count to improve your chances of conception.",
    href: "/oligospermia",
    icon: Beaker,
  },
  {
    title: "Low Sperm Motility (Asthenospermia)",
    desc: "Improving and bypassing poor sperm motility with targeted therapies and advanced ART.",
    href: "/asthenospermia",
    icon: Activity,
  },
  {
    title: "Zero Sperm Count (Azoospermia)",
    desc: "Sperm retrieval techniques and ICSI for men with no sperm in the ejaculate.",
    href: "/azoospermia",
    icon: Microscope,
  },
  {
    title: "Surgical Sperm Retrieval (PESA / TESA / Micro-TESE)",
    desc: "Minimally invasive surgical procedures to retrieve sperm directly for use with ICSI.",
    href: "/surgical-sperm-retrieval",
    icon: Target,
  },
  {
    title: "Varicocele / Micro Surgery",
    desc: "Microsurgical repair of fertility-affecting varicocele to restore natural sperm production.",
    href: "/varicocele",
    icon: ShieldCheck,
  },
  {
    title: "Erectile Dysfunction",
    desc: "Confidential evaluation and treatment for ED with integrated fertility support.",
    href: "/erectile-dysfunction",
    icon: HeartPulse,
  },
];

const stats: HubStat[] = [
  { value: "40%", label: "Of infertility cases involve a male factor" },
  { value: "30+", label: "Years of andrology expertise" },
  { value: "14", label: "Centres across India" },
  { value: "90%+", label: "Sperm retrieval success rate" },
];

const whyPoints: HubWhyPoint[] = [
  {
    icon: Stethoscope,
    title: "Dedicated Male Fertility Specialists",
    desc: "Our andrologists and urologists specialise exclusively in male reproductive health — from hormonal evaluation to microsurgical sperm retrieval.",
  },
  {
    icon: Microscope,
    title: "State-of-the-Art Andrology Lab",
    desc: "WHO 2021-compliant semen analysis, DNA fragmentation testing, and advanced sperm selection techniques (MACS, IMSI, PICSI) all under one roof.",
  },
  {
    icon: FlaskConical,
    title: "Advanced Sperm Retrieval",
    desc: "PESA, TESA, TESE and Micro-TESE performed by experienced microsurgeons with high retrieval success rates, even in severe azoospermia.",
  },
  {
    icon: ShieldCheck,
    title: "Confidential & Comfortable",
    desc: "Male infertility consultations are handled with complete discretion. Separate evaluation rooms and a no-judgement approach ensure your comfort.",
  },
  {
    icon: Award,
    title: "Proven Track Record",
    desc: "Over 30,000 successful pregnancies and 30+ years of experience treating the full spectrum of male factor infertility.",
  },
  {
    icon: MapPin,
    title: "14 Centres, One Standard",
    desc: "Every Bavishi centre — from Ahmedabad to Mumbai to Varanasi — follows the same protocols, lab standards, and quality benchmarks.",
  },
];

const faqs: HubFaq[] = [
  {
    q: "What causes male infertility?",
    a: "Male infertility can result from low sperm production, abnormal sperm function, or blockages preventing sperm delivery. Contributing factors include varicocele, hormonal imbalances, infections, genetic conditions, lifestyle factors (smoking, excessive alcohol, obesity), and environmental exposures. In about 30% of cases, no identifiable cause is found (idiopathic infertility).",
  },
  {
    q: "How is male infertility diagnosed?",
    a: "Diagnosis typically starts with a thorough semen analysis (evaluating count, motility, and morphology per WHO 2021 standards), followed by a physical examination, hormone profile (FSH, LH, testosterone, prolactin), and if needed, scrotal ultrasound and genetic testing. Advanced tests like sperm DNA fragmentation may be recommended in specific cases.",
  },
  {
    q: "Can male infertility be treated?",
    a: "Yes, in most cases. Treatment depends on the underlying cause — hormonal therapy for imbalances, antibiotics for infections, microsurgery for varicocele or blockages, and assisted reproductive techniques (IUI, IVF with ICSI) when natural conception isn't possible. Even men with zero sperm count (azoospermia) can father biological children through surgical sperm retrieval combined with ICSI.",
  },
  {
    q: "What is the difference between TESA, PESA, and Micro-TESE?",
    a: "All three are surgical sperm retrieval procedures. PESA (percutaneous epididymal aspiration) uses a needle to aspirate sperm from the epididymis. TESA (testicular aspiration) retrieves tissue from the testis itself. Micro-TESE is a microsurgical approach that identifies sperm-producing areas under high magnification — it has the highest success rate for non-obstructive azoospermia.",
  },
  {
    q: "Does lifestyle affect male fertility?",
    a: "Significantly. Smoking, excessive alcohol, recreational drugs, obesity, prolonged heat exposure (hot baths, tight clothing, laptops on lap), high stress, and poor sleep can all reduce sperm quality. Improving these factors often leads to measurable improvement in semen parameters within 3 months (one full sperm production cycle).",
  },
  {
    q: "How long does it take to see improvement after treatment?",
    a: "Sperm production (spermatogenesis) takes approximately 72–74 days, so most treatments — whether medical or lifestyle-based — need at least 3 months to show results on a repeat semen analysis. Surgical interventions like varicocele repair may take 3–6 months to show full improvement.",
  },
];

export function MaleInfertilityHub() {
  return (
    <CategoryHubPage
      eyebrow="Male Infertility"
      title="Comprehensive Care for"
      titleAccent="Male Infertility"
      subtitle="Nearly 40% of infertility cases involve a male factor. Our specialists use advanced diagnostics and cutting-edge treatments to address every cause — from hormonal imbalances to structural issues — so you can take confident steps toward fatherhood."
      breadcrumbLabel="Male Infertility"
      cards={cards}
      cardsSectionTitle="Male Infertility Conditions We Treat"
      cardsSectionSubtitle="Each condition has its own dedicated page with detailed information on causes, diagnosis, treatment options, and what to expect at Bavishi Fertility Institute."
      stats={stats}
      overviewTitle="What is"
      overviewTitleAccent="Male Infertility?"
      overviewParagraphs={[
        "Male infertility refers to a man's inability to cause pregnancy in a fertile female partner. It is a surprisingly common condition — affecting roughly 1 in 6 couples trying to conceive — and is the sole or contributing factor in nearly half of all infertility cases worldwide.",
        "The most common causes involve problems with sperm production or delivery. These can range from hormonal disorders and genetic conditions to physical blockages, varicocele (enlarged veins in the scrotum), infections, or lifestyle factors. In many cases, targeted medical or surgical treatment can significantly improve fertility outcomes.",
        "At Bavishi Fertility Institute, we take a systematic, evidence-based approach. Every patient receives a thorough diagnostic workup — including WHO 2021-standard semen analysis, hormone profiling, and advanced testing when needed — before we recommend any treatment. Our goal is always to identify the root cause and choose the least invasive effective treatment.",
      ]}
      overviewBullets={[
        "Male factor is involved in ~50% of infertility cases",
        "A semen analysis is the first and most important test",
        "Many causes are treatable with medication or minor surgery",
        "Advanced ART (IVF/ICSI) can overcome severe male factor",
        "Lifestyle changes alone can improve sperm quality in 3 months",
        "Even zero sperm count has treatment options via sperm retrieval",
      ]}
      signsTitle="Signs You Should"
      signsTitleAccent="See a Specialist"
      signsSubtitle="If you or your partner have been trying to conceive for 12 months (or 6 months if she is over 35), or if you notice any of the following, consult a fertility specialist."
      signs={[
        "Difficulty conceiving after 12 months of unprotected intercourse",
        "Known low sperm count or abnormal semen analysis results",
        "History of testicular injury, surgery, or undescended testes",
        "Swelling, pain, or a lump in the testicle area",
        "Difficulty with erections or ejaculation",
        "Previous groin, prostate, or genital surgery",
        "History of sexually transmitted infections",
        "Family history of fertility problems or genetic conditions",
        "Varicocele (enlarged veins felt in the scrotum)",
      ]}
      whyTitle="Why Choose Bavishi"
      whyTitleAccent="Fertility Institute?"
      whyPoints={whyPoints}
      faqs={faqs}
      heroImage="/assets/male infertility/ChatGPT Image Jun 4, 2026, 04_12_19 PM.png"
      heroImageAlt="Male infertility diagnosis and treatment illustration"
      ctaHeading="Expert Male Fertility Care, One Call Away"
      ctaSubtitle="Confidential consultations with India's leading male fertility specialists. We're here to help."
    />
  );
}
