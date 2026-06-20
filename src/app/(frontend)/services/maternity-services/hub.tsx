"use client";
import {
  ScanLine, Feather, Baby, Stethoscope, ShieldCheck, Users,
  Award, MapPin, HeartPulse, Clock, Activity, Microscope,
} from "lucide-react";
import { CategoryHubPage, type HubCard, type HubStat, type HubFaq, type HubWhyPoint } from "@/components/category-hub-page";

const cards: HubCard[] = [
  {
    title: "3D/4D Sonography",
    desc: "Advanced 3D & 4D ultrasound imaging for clear, detailed views of your baby's growth and wellbeing.",
    href: "/services/3d-4d-sonography",
    icon: ScanLine,
  },
  {
    title: "Painless Delivery",
    desc: "Epidural-supported labour for a calm, comfortable and well-managed birth experience.",
    href: "/services/painless-delivery",
    icon: Feather,
  },
  {
    title: "Normal Delivery",
    desc: "Safe, natural vaginal birth guided by experienced obstetricians and a caring, watchful team.",
    href: "/services/normal-delivery",
    icon: Baby,
  },
  {
    title: "Fetal Medicine",
    desc: "Specialised assessment and care for your baby's health and development throughout pregnancy.",
    href: "/services/fetal-medicine",
    icon: Stethoscope,
  },
  {
    title: "High-Risk Pregnancy Care",
    desc: "Expert monitoring and management for complex and high-risk pregnancies, every step of the way.",
    href: "/services/high-risk-pregnancy-care",
    icon: ShieldCheck,
  },
  {
    title: "Twin Pregnancy Care",
    desc: "Dedicated, closely-monitored care for twin and multiple pregnancies through to safe delivery.",
    href: "/services/twin-pregnancy-care",
    icon: Users,
  },
];

const stats: HubStat[] = [
  { value: "5,000+", label: "Safe deliveries" },
  { value: "30+", label: "Years of obstetric care" },
  { value: "24/7", label: "Emergency obstetric team" },
  { value: "100%", label: "Consultant-led deliveries" },
];

const whyPoints: HubWhyPoint[] = [
  {
    icon: Stethoscope,
    title: "Senior Obstetricians, Always",
    desc: "Every delivery at Bavishi is led by a consultant obstetrician — not a trainee. Our experienced team handles normal, high-risk, and complex deliveries with the same level of personal attention.",
  },
  {
    icon: ShieldCheck,
    title: "Modern Labour & Birthing Suites",
    desc: "Comfortable, private labour rooms equipped with fetal monitoring, immediate access to the operation theatre, and a neonatal ICU on standby — so you feel safe and cared for throughout.",
  },
  {
    icon: HeartPulse,
    title: "Painless Delivery Expertise",
    desc: "Our anaesthesia team specialises in labour epidurals. We offer 24/7 epidural availability so your birth experience is calm, comfortable, and entirely within your control.",
  },
  {
    icon: Microscope,
    title: "Advanced Fetal Diagnostics",
    desc: "State-of-the-art 3D/4D ultrasound, fetal echocardiography, Doppler studies, and genetic screening — all available in-house for comprehensive prenatal assessment.",
  },
  {
    icon: Users,
    title: "IVF Pregnancy Specialists",
    desc: "As a leading fertility centre, we have unique expertise in managing IVF pregnancies, including twins and higher-order multiples, with the extra care these precious pregnancies deserve.",
  },
  {
    icon: Award,
    title: "Continuity of Care",
    desc: "From fertility treatment through pregnancy and delivery — many patients experience their complete journey at Bavishi. This continuity means your team knows your history inside and out.",
  },
];

const faqs: HubFaq[] = [
  {
    q: "What is painless delivery and is it safe?",
    a: "Painless delivery uses an epidural — a local anaesthetic administered through a thin catheter in the lower back — to numb pain during labour while keeping you fully awake and alert. It is one of the safest and most widely used pain relief methods in obstetrics worldwide. Our anaesthesia team has extensive experience with labour epidurals and monitors both mother and baby throughout.",
  },
  {
    q: "Do you encourage normal delivery or C-section?",
    a: "We strongly encourage and support normal (vaginal) delivery whenever it's safe to do so. Our approach is to allow natural labour to progress with close monitoring, intervening only when medically necessary. Our normal delivery rates are well above the national average. However, when a C-section is genuinely needed for the safety of mother or baby, we perform it without hesitation.",
  },
  {
    q: "What makes a pregnancy 'high-risk'?",
    a: "A pregnancy is considered high-risk when there are factors that increase the chance of complications for mother or baby. Common reasons include: advanced maternal age (over 35), IVF/ART conception, twin or multiple pregnancy, pre-existing conditions (diabetes, hypertension, thyroid disorders), previous C-section or complicated delivery, recurrent miscarriage, or pregnancy complications like pre-eclampsia or gestational diabetes.",
  },
  {
    q: "How is twin pregnancy care different?",
    a: "Twin pregnancies need more frequent monitoring — typically fortnightly scans after 16 weeks, with additional growth scans and Doppler studies. There's a higher risk of preterm delivery, growth restriction, and preeclampsia. Our team creates an individualised monitoring plan, and we discuss delivery timing and method (vaginal vs. C-section) based on the type of twin pregnancy (identical vs. fraternal, shared placenta vs. separate).",
  },
  {
    q: "What fetal medicine services do you offer?",
    a: "Our fetal medicine unit provides advanced prenatal diagnosis and management: detailed anomaly scans, fetal echocardiography, first-trimester combined screening (NT scan + dual markers), non-invasive prenatal testing (NIPT), Doppler velocimetry for growth monitoring, and 3D/4D imaging. When an anomaly is detected, our team provides counselling and a management plan.",
  },
  {
    q: "Can I deliver at Bavishi even if I didn't do IVF here?",
    a: "Absolutely. While many of our maternity patients are IVF-conceived pregnancies from our fertility programme, our maternity services are open to all women. Whether you conceived naturally or through treatment elsewhere, you'll receive the same high standard of obstetric care.",
  },
  {
    q: "What should I look for in a maternity hospital?",
    a: "Key factors include: consultant-led deliveries (not just residents), 24/7 emergency obstetric and anaesthesia cover, an in-house neonatal ICU, high normal-delivery rates (indicating a non-interventionist philosophy), modern labour rooms with privacy, and a team experienced in high-risk pregnancies. Bavishi meets all of these criteria.",
  },
];

export function MaternityServicesHub() {
  return (
    <CategoryHubPage
      eyebrow="Maternity Services"
      title="Safe, Caring"
      titleAccent="Pregnancy & Delivery"
      subtitle="From your first scan to the moment you hold your baby — Bavishi Fertility & Birthing provides complete maternity care with experienced obstetricians, modern labour suites, and a focus on your comfort and safety."
      breadcrumbLabel="Maternity Services"
      cards={cards}
      cardsSectionTitle="Our Maternity Services"
      cardsSectionSubtitle="Click on any service below to learn what it involves, who it's for, and how our team delivers the best possible care."
      stats={stats}
      overviewTitle="Complete"
      overviewTitleAccent="Maternity Care"
      overviewParagraphs={[
        "Bavishi Fertility & Birthing offers end-to-end maternity care — from the earliest weeks of pregnancy through a safe delivery and postnatal recovery. As a centre that helps thousands of couples achieve pregnancy through IVF and other fertility treatments, we understand how precious every pregnancy is.",
        "Our maternity programme is built on three pillars: experienced consultant-led care (every delivery is managed by a senior obstetrician, not a trainee), modern infrastructure (private labour suites, 24/7 epidural availability, in-house neonatal ICU), and a philosophy that prioritises natural birth while being fully prepared for any complication.",
        "Whether yours is a straightforward pregnancy, a high-risk case requiring extra monitoring, a twin pregnancy, or an IVF-conceived pregnancy — our team has the expertise and infrastructure to ensure the safest possible outcome for you and your baby.",
      ]}
      overviewBullets={[
        "Consultant-led care at every delivery — not trainee-managed",
        "24/7 epidural and emergency obstetric availability",
        "In-house neonatal ICU for immediate newborn care",
        "Special expertise in IVF and multiple-pregnancy management",
        "High normal-delivery rate with a non-interventionist approach",
        "Continuity from fertility treatment through maternity and delivery",
      ]}
      signsTitle="When to Choose"
      signsTitleAccent="Specialist Maternity Care"
      signsSubtitle="All pregnancies benefit from quality obstetric care, but specialist maternity services are especially important if any of the following apply."
      signs={[
        "Pregnancy achieved through IVF, ICSI, or other ART procedures",
        "Twin or multiple pregnancy",
        "Age over 35 at the time of delivery",
        "Pre-existing medical conditions (diabetes, hypertension, thyroid, cardiac)",
        "Previous complicated delivery or C-section",
        "History of preterm birth or cervical incompetence",
        "Diagnosed fetal anomaly or growth concern",
        "Gestational diabetes or pregnancy-induced hypertension",
        "Desire for painless (epidural) delivery with specialist anaesthesia support",
      ]}
      whyTitle="Why Choose Bavishi"
      whyTitleAccent="Fertility & Birthing?"
      whyPoints={whyPoints}
      faqs={faqs}
      heroImage="/assets/hero-mother-baby1.png"
      heroImageAlt="Happy pregnant mother — Bavishi Fertility & Birthing maternity care"
      ctaHeading="Plan Your Maternity Journey"
      ctaSubtitle="Speak with our obstetric team to discuss your pregnancy care and delivery preferences."
      logoSrc="/assets/bavishi-fertility-birthing.png"
      logoAlt="Bavishi Fertility & Birthing"
    />
  );
}
