/* =====================================================================
 * Women's Health & Maternity services — data registry + page content
 * ---------------------------------------------------------------------
 * Single source of truth powering BOTH:
 *   1. the reusable <AvailableServicesSection> shown on location pages
 *      (light registry: name / desc / icon / href / published), and
 *   2. the dedicated maternity service pages at /services/[slug]
 *      (rich SERVICE_CONTENT + serviceGraph JSON-LD).
 *
 * Mirrors the treatment/location architecture: a service = one object,
 * a location opts in by listing service KEYS (`womensHealth: string[]`)
 * on its City/Centre data — so adding a service or wiring another
 * location is data-only, no UI changes.
 *
 * Internal-linking ("no dead ends", see src/lib/internal-links.ts): each
 * service carries the CANONICAL `/services/...` URL its page lives at,
 * plus a `published` gate. While `published: false` a card links to
 * `fallback`; once the page ships we flip that boolean and every location
 * card across the site activates its crawlable Location → Service link.
 * ===================================================================== */
import type { LucideIcon } from "lucide-react";
import {
  ScanLine, Feather, Baby, Stethoscope, ShieldCheck, Users,
  HeartPulse, Activity, ClipboardList, CalendarCheck, Eye, Clock,
  Microscope, Sparkles, Hand,
} from "lucide-react";
import {
  ORG_ID, WEBSITE_ID, abs, breadcrumbSchema, faqSchema,
} from "@/lib/seo";
import { doctorBySlug, reviewerNode, physicianSchema } from "@/lib/doctors";

export type WomensHealthService = {
  key: string;
  name: string;
  desc: string;
  icon: LucideIcon;
  /** Canonical URL the dedicated service page lives at. */
  href: string;
  /** True once that page exists. Gates the live, crawlable link. */
  published: boolean;
  /** Where the card points until `published` flips true. */
  fallback?: string;
};

export const WOMENS_HEALTH_SERVICES: Record<string, WomensHealthService> = {
  "3d-4d-sonography": {
    key: "3d-4d-sonography",
    name: "3D/4D Sonography",
    desc: "Advanced 3D & 4D ultrasound imaging for clear, detailed views of your baby's growth and wellbeing.",
    icon: ScanLine,
    href: "/services/3d-4d-sonography",
    published: true,
    fallback: "/contact",
  },
  "painless-delivery": {
    key: "painless-delivery",
    name: "Painless Delivery",
    desc: "Epidural-supported labour for a calm, comfortable and well-managed birth experience.",
    icon: Feather,
    href: "/services/painless-delivery",
    published: true,
    fallback: "/contact",
  },
  "normal-delivery": {
    key: "normal-delivery",
    name: "Normal Delivery",
    desc: "Safe, natural vaginal birth guided by experienced obstetricians and a caring, watchful team.",
    icon: Baby,
    href: "/services/normal-delivery",
    published: true,
    fallback: "/contact",
  },
  "fetal-medicine": {
    key: "fetal-medicine",
    name: "Fetal Medicine",
    desc: "Specialised assessment and care for your baby's health and development throughout pregnancy.",
    icon: Stethoscope,
    href: "/services/fetal-medicine",
    published: true,
    fallback: "/contact",
  },
  "high-risk-pregnancy-care": {
    key: "high-risk-pregnancy-care",
    name: "High Risk Pregnancy Care",
    desc: "Expert monitoring and management for complex and high-risk pregnancies, every step of the way.",
    icon: ShieldCheck,
    href: "/services/high-risk-pregnancy-care",
    published: true,
    fallback: "/contact",
  },
  "twin-pregnancy-care": {
    key: "twin-pregnancy-care",
    name: "Twin Pregnancy Care",
    desc: "Dedicated, closely-monitored care for twin and multiple pregnancies through to safe delivery.",
    icon: Users,
    href: "/services/twin-pregnancy-care",
    published: true,
    fallback: "/contact",
  },
};

/** The full women's-health service set, in display order (keys). */
export const WOMENS_HEALTH_ALL: string[] = [
  "3d-4d-sonography",
  "painless-delivery",
  "normal-delivery",
  "fetal-medicine",
  "high-risk-pregnancy-care",
  "twin-pregnancy-care",
];

/** Resolve service KEYS → full objects, preserving order, dropping unknowns. */
export const womensHealthServices = (keys: string[]): WomensHealthService[] =>
  keys.map((k) => WOMENS_HEALTH_SERVICES[k]).filter((s): s is WomensHealthService => Boolean(s));

/** Live href for a service card: the published page, else its fallback. */
export const serviceHref = (s: WomensHealthService): string =>
  s.published ? s.href : (s.fallback ?? s.href);

/* =====================================================================
 * RICH PAGE CONTENT  (powers /services/[slug])
 * ---------------------------------------------------------------------
 * Lighter than the Treatment model but the same shape of building blocks,
 * so it renders through the shared <ServicePage> template and emits the
 * same calibre of MedicalWebPage + MedicalProcedure/MedicalTest + FAQ +
 * reviewedBy JSON-LD. Maternity is gynaecology/obstetrics, so the medical
 * reviewer is a verified obstetrician-gynaecologist (Dr. Falguni Bavishi).
 * ===================================================================== */

export type ServiceHeading = { lead: string; em?: string };
export type ServiceFAQ = { q: string; a: string };
export type ServiceStep = { icon: LucideIcon; t: string; d: string };
export type ServicePoint = { icon: LucideIcon; t: string; d: string };

export type ServiceContent = {
  key: string;
  slug: string;
  /** schema.org @type for the "about"/procedure node. */
  schemaType: "MedicalProcedure" | "MedicalTest" | "MedicalTherapy";
  /** Plain-language label used inside copy ("the scan", "your delivery"…). */
  shortName: string;
  meta: { title: string; description: string };
  breadcrumbName: string;
  reviewerSlug: string;
  lastReviewed: string;
  hero: {
    eyebrow: string;
    h1: string;
    h1Em: string;
    tagline: string;
    badges: string[];
    image: string;
    imageAlt: string;
  };
  overview: {
    heading: ServiceHeading;
    paragraphs: string[];
    aside?: { title: string; body: string };
  };
  benefits: { heading: ServiceHeading; subtitle?: string; items: string[] };
  whoFor: { heading: ServiceHeading; subtitle?: string; items: string[] };
  process: { heading: ServiceHeading; subtitle?: string; steps: ServiceStep[]; note?: string };
  whyUs: { heading: ServiceHeading; items: ServicePoint[] };
  /** Optional explainer / myth-busting block (e.g. "What is 5D/7D ultrasound?"). */
  infoNote?: { heading: ServiceHeading; paragraphs: string[] };
  faqs: ServiceFAQ[];
  /** Other service keys to cross-link at the bottom (no dead ends). */
  related: string[];
};

const MATERNITY_REVIEWER = "binal-shah";

export const SERVICE_CONTENT: Record<string, ServiceContent> = {
  /* ---------------------------------------------------------------- */
  "3d-4d-sonography": {
    key: "3d-4d-sonography",
    slug: "3d-4d-sonography",
    schemaType: "MedicalTest",
    shortName: "3D/4D sonography",
    meta: {
      title: "3D/4D Sonography in Ahmedabad — Bavishi Fertility & Birthing",
      description:
        "Advanced 3D & 4D pregnancy ultrasound at Bavishi Fertility & Birthing — lifelike images of your baby, safe radiation-free imaging and expert fetal assessment. Book your scan.",
    },
    breadcrumbName: "3D/4D Sonography",
    reviewerSlug: MATERNITY_REVIEWER,
    lastReviewed: "2026-06-01",
    hero: {
      eyebrow: "Maternity Services",
      h1: "3D / 4D",
      h1Em: "Sonography",
      tagline:
        "See your baby like never before. Our advanced 3D and 4D ultrasound gives you a clear, lifelike view of your little one — while our specialists carefully track healthy growth and development.",
      badges: ["Radiation-free & painless", "Expert sonographers", "Keepsake images"],
      image: "/assets/3d-4d sonography.png",
      imageAlt: "Expecting mother during a 3D/4D pregnancy sonography at Bavishi Fertility & Birthing",
    },
    overview: {
      heading: { lead: "A clear, lifelike window", em: "into your pregnancy" },
      paragraphs: [
        "3D/4D sonography is an advanced ultrasound technology that turns ordinary 2D scans into detailed, lifelike images of your developing baby. 3D produces sharp still pictures of your baby's face and body, while 4D adds real-time motion — so you can watch your baby yawn, stretch and move.",
        "Beyond the joyful bonding experience, these scans are a powerful clinical tool. Our fetal medicine specialists use them to assess facial structure, limbs, spine and overall development, and to pick up certain anomalies early — all with the same safe, radiation-free sound-wave technology as a routine scan.",
      ],
      aside: {
        title: "Best time for a 4D scan",
        body: "24–34 weeks usually gives the clearest facial views. Anomaly-focused scans are also performed around 11–14 and 19–22 weeks, with extra scans for IVF, twin and high-risk pregnancies.",
      },
    },
    benefits: {
      heading: { lead: "Why 3D/4D imaging", em: "matters" },
      subtitle: "More clarity for you, more clinical detail for your doctor.",
      items: [
        "Crystal-clear, three-dimensional views of facial features and body structure",
        "Real-time monitoring of fetal movements, stretches and expressions (4D)",
        "Early detection of certain congenital anomalies",
        "Detailed assessment of limbs, spine and organ development",
        "A deeper bonding experience for parents and family",
        "Completely non-invasive, radiation-free and painless",
      ],
    },
    whoFor: {
      heading: { lead: "Who should", em: "consider it" },
      subtitle: "Recommended at key milestones — and especially valuable for closely-watched pregnancies.",
      items: [
        "Parents wanting a clear, detailed look at their baby",
        "Anomaly screening around 11–14 and 19–22 weeks",
        "IVF and assisted-conception pregnancies",
        "Twin and multiple pregnancies",
        "High-risk pregnancies needing growth and wellbeing checks",
        "When earlier scans suggest a closer structural look is needed",
      ],
    },
    process: {
      heading: { lead: "What to", em: "expect" },
      subtitle: "A relaxed, family-friendly appointment that usually takes 20–30 minutes.",
      steps: [
        { icon: ClipboardList, t: "No special prep", d: "No fasting needed — a light meal beforehand is perfectly fine. Wear comfortable clothing." },
        { icon: Hand, t: "Comfortable positioning", d: "You recline on the examination bed and warm gel is applied to the abdomen." },
        { icon: ScanLine, t: "Live imaging", d: "Real-time 3D/4D images appear on a large screen for you and your family to watch together." },
        { icon: Eye, t: "Specialist assessment", d: "The sonographer and fetal medicine specialist review growth, structure and wellbeing." },
        { icon: Sparkles, t: "Keepsake images", d: "You take home high-quality printed pictures of your baby's first portrait." },
      ],
      note: "If your baby is not well-positioned, we may suggest a short walk, a position change or a quick reschedule for the best views.",
    },
    whyUs: {
      heading: { lead: "Why choose", em: "Bavishi Fertility & Birthing" },
      items: [
        { icon: Microscope, t: "Advanced equipment", d: "State-of-the-art 3D/4D ultrasound systems for the sharpest, most detailed imaging." },
        { icon: Stethoscope, t: "Fetal medicine expertise", d: "Experienced specialists and trained sonographers interpret every scan." },
        { icon: ShieldCheck, t: "Complete monitoring", d: "2D, 3D, 4D and Doppler under one roof — including IVF, twin and high-risk care." },
      ],
    },
    infoNote: {
      heading: { lead: "What is", em: "5D or 7D ultrasound?" },
      paragraphs: [
        "Medically, there are only 2D, 3D and 4D ultrasounds. The so-called \"5D\" or \"7D\" scans are simply 3D/4D ultrasounds with enhanced software filters, colour effects or smoother rendering — not a newer or superior technology.",
        "They do not provide any additional medical information or diagnostic advantage. The labels are largely marketing terms meant to make the experience sound more advanced than it truly is. At Bavishi Fertility & Birthing we focus on accurate, high-quality 3D/4D imaging interpreted by fetal medicine specialists — not gimmicks.",
      ],
    },
    faqs: [
      { q: "Is 3D/4D sonography safe for my baby?", a: "Yes. It uses the same harmless sound-wave technology as a standard 2D scan, with no radiation involved, and is performed by trained professionals." },
      { q: "Do I need to fast before the scan?", a: "No fasting is required. You can eat normally — a light meal beforehand is fine." },
      { q: "When is the best time for a 4D scan?", a: "Around 24–34 weeks usually gives the clearest views of your baby's face. Your doctor may also advise scans at other stages for medical assessment." },
      { q: "Can my family come along?", a: "Absolutely. Partners and close family are welcome to share the experience and watch your baby on the screen." },
      { q: "What if my baby isn't in a good position?", a: "The sonographer may ask you to change position or take a short walk, or suggest rescheduling — babies move, and we want the best possible images." },
    ],
    related: ["fetal-medicine", "high-risk-pregnancy-care", "twin-pregnancy-care"],
  },

  /* ---------------------------------------------------------------- */
  "painless-delivery": {
    key: "painless-delivery",
    slug: "painless-delivery",
    schemaType: "MedicalProcedure",
    shortName: "painless delivery",
    meta: {
      title: "Painless Delivery (Epidural) in Ahmedabad — Bavishi Fertility & Birthing",
      description:
        "Painless normal delivery with epidural analgesia at Bavishi Fertility & Birthing — expert anaesthetists, continuous monitoring and calm, comfortable births. Book a consultation.",
    },
    breadcrumbName: "Painless Delivery",
    reviewerSlug: MATERNITY_REVIEWER,
    lastReviewed: "2026-06-01",
    hero: {
      eyebrow: "Maternity Services",
      h1: "Painless",
      h1Em: "Delivery",
      tagline:
        "Childbirth without the fear of pain. Epidural-supported labour lets you stay calm, awake and fully present — for a comfortable, positive and well-managed birth experience.",
      badges: ["Expert anaesthetists", "Stay awake & aware", "Continuous monitoring"],
      image: "/assets/hero-mother-baby.jpg",
      imageAlt: "Mother holding her newborn after a calm, painless delivery at Bavishi Fertility & Birthing",
    },
    overview: {
      heading: { lead: "Comfortable, well-managed", em: "childbirth" },
      paragraphs: [
        "Painless delivery uses epidural analgesia — medicine delivered near the nerves of the lower spine — to greatly reduce the pain of labour while you stay awake, aware and in control. It does not cause complete numbness, so you can still feel pressure and push effectively.",
        "By taking the edge off contractions, an epidural helps you rest during long labour, conserve energy for the pushing stage and experience birth more positively. Our obstetric and anaesthesia teams manage every step together for the safety of both mother and baby.",
      ],
      aside: {
        title: "Does it lead to a C-section?",
        body: "No — current evidence shows epidural analgesia does not increase the chance of a caesarean. In many cases the relaxation it brings supports a smoother normal delivery.",
      },
    },
    benefits: {
      heading: { lead: "The benefits of", em: "epidural birth" },
      subtitle: "Calmer for mother, steady for baby.",
      items: [
        "Significant relief from labour pain and stress",
        "Stay awake, alert and emotionally present at birth",
        "Better rest during long labour — energy saved for pushing",
        "Often supports better cervical dilation and effective pushing",
        "Calmer mother means steadier fetal heart rate and blood flow",
        "Positive, less frightening birth memories",
      ],
    },
    whoFor: {
      heading: { lead: "Is it", em: "right for you" },
      subtitle: "Suitable for most healthy pregnancies — your team will confirm after assessment.",
      items: [
        "Most healthy women planning a vaginal birth",
        "First-time mothers anxious about labour pain",
        "Long or anticipated prolonged labour",
        "Medical situations where controlled pain relief is advised",
        "Not suitable with certain bleeding/clotting issues or specific spine conditions",
        "Decided together after reviewing your medical history",
      ],
    },
    process: {
      heading: { lead: "How painless", em: "delivery works" },
      subtitle: "A coordinated plan from your first consultation to after birth.",
      steps: [
        { icon: ClipboardList, t: "Pre-delivery consultation", d: "We review your history and discuss pain-relief options so you know exactly what to expect." },
        { icon: Feather, t: "Epidural placement", d: "When active labour is established (around 4–5 cm), an experienced anaesthetist places the epidural." },
        { icon: Activity, t: "Continuous monitoring", d: "Your baby's heart rate, your blood pressure and contractions are watched closely throughout." },
        { icon: HeartPulse, t: "Comfortable labour", d: "Doses are adjusted as labour progresses, keeping you comfortable yet able to push." },
        { icon: Baby, t: "Supported birth & recovery", d: "Trained nurses guide your pushing and positioning; mother and newborn are monitored after delivery." },
      ],
    },
    whyUs: {
      heading: { lead: "Why choose", em: "Bavishi Fertility & Birthing" },
      items: [
        { icon: Stethoscope, t: "Experienced anaesthetists", d: "Skilled specialists administer and manage your epidural for safe, reliable relief." },
        { icon: Activity, t: "Continuous safety monitoring", d: "Mother and baby are monitored at every stage in a sterile, fully-equipped setting." },
        { icon: ShieldCheck, t: "24×7 maternity support", d: "Round-the-clock obstetric and emergency cover for complete peace of mind." },
      ],
    },
    faqs: [
      { q: "When during labour is the epidural given?", a: "Usually once active labour is established (around 4–5 cm dilation), though the timing is tailored to your comfort and your doctor's assessment." },
      { q: "Will an epidural increase my chance of a C-section?", a: "No. Research shows epidurals do not raise caesarean rates; the relaxation they provide can actually help a normal delivery progress." },
      { q: "Will it affect my baby or breastfeeding?", a: "The medication stays mostly around the spinal nerves with minimal transfer to the baby, and it does not affect your ability to breastfeed." },
      { q: "What if the epidural doesn't work fully?", a: "Your anaesthetist can reposition the catheter or adjust the dose to achieve proper, even pain relief." },
      { q: "Will I be able to push?", a: "Yes. An epidural reduces pain without full numbness, so you can still feel pressure and push effectively with your team's guidance." },
    ],
    related: ["normal-delivery", "high-risk-pregnancy-care", "twin-pregnancy-care"],
  },

  /* ---------------------------------------------------------------- */
  "normal-delivery": {
    key: "normal-delivery",
    slug: "normal-delivery",
    schemaType: "MedicalProcedure",
    shortName: "normal delivery",
    meta: {
      title: "Normal (Vaginal) Delivery in Ahmedabad — Bavishi Fertility & Birthing",
      description:
        "Safe, natural normal delivery at Bavishi Fertility & Birthing — experienced obstetricians, watchful labour care and a calm birth environment with full emergency backup. Book a consultation.",
    },
    breadcrumbName: "Normal Delivery",
    reviewerSlug: MATERNITY_REVIEWER,
    lastReviewed: "2026-06-01",
    hero: {
      eyebrow: "Maternity Services",
      h1: "Normal",
      h1Em: "Delivery",
      tagline:
        "A safe, natural birth, gently guided. Our obstetric team supports spontaneous vaginal delivery wherever it is safe — with watchful monitoring and full backup if plans need to change.",
      badges: ["Experienced obstetricians", "Watchful monitoring", "Faster recovery"],
      image: "/assets/hero-mother-baby1.png",
      imageAlt: "Happy family after a safe normal delivery at Bavishi Fertility & Birthing",
    },
    overview: {
      heading: { lead: "Natural birth,", em: "expertly supported" },
      paragraphs: [
        "A normal (vaginal) delivery is the birth of your baby through the birth canal, the way nature intends. For most healthy pregnancies it is the safest route, offering quicker recovery, a shorter hospital stay and an easier start to bonding and breastfeeding.",
        "Our experienced obstetricians and midwifery team support you through every stage of labour — encouraging movement and comfort measures, monitoring you and your baby closely, and stepping in promptly with the full resources of a maternity unit should the situation change.",
      ],
      aside: {
        title: "Pain relief is your choice",
        body: "A normal delivery can be fully natural, or supported with epidural analgesia for a painless experience. We help you choose what feels right for you.",
      },
    },
    benefits: {
      heading: { lead: "Why a normal", em: "delivery" },
      subtitle: "When it's safe, vaginal birth offers real advantages for mother and baby.",
      items: [
        "Faster recovery and a shorter hospital stay",
        "No major surgery and fewer associated risks",
        "Early skin-to-skin contact and easier breastfeeding",
        "Beneficial for the baby's lungs and immunity",
        "Lower risk of complications in future pregnancies",
        "An empowering, actively-involved birth experience",
      ],
    },
    whoFor: {
      heading: { lead: "Who can plan", em: "a normal birth" },
      subtitle: "Most uncomplicated pregnancies — confirmed by ongoing assessment.",
      items: [
        "Healthy, low-risk single pregnancies",
        "Baby in a head-down (vertex) position",
        "No major medical or obstetric complications",
        "Adequate progress through labour",
        "Many mothers after a previous vaginal birth",
        "Selected cases after careful review, even with prior caesarean",
      ],
    },
    process: {
      heading: { lead: "Your labour,", em: "stage by stage" },
      subtitle: "Watchful, supportive care from early labour to holding your baby.",
      steps: [
        { icon: ClipboardList, t: "Birth planning", d: "We discuss your preferences, pain-relief options and what to expect during antenatal visits." },
        { icon: Clock, t: "Early & active labour", d: "You're supported with movement, breathing and comfort measures as contractions build." },
        { icon: Activity, t: "Close monitoring", d: "Your baby's heart rate and your progress are checked regularly for safety." },
        { icon: Baby, t: "Birth", d: "Guided pushing brings your baby into the world, with the team supporting a gentle delivery." },
        { icon: HeartPulse, t: "Golden hour & recovery", d: "Skin-to-skin contact, first feed and watchful postnatal care for you and your newborn." },
      ],
      note: "If labour does not progress safely, our team is fully prepared to move to assisted or caesarean delivery without delay.",
    },
    whyUs: {
      heading: { lead: "Why choose", em: "Bavishi Fertility & Birthing" },
      items: [
        { icon: Stethoscope, t: "Experienced obstetric team", d: "Senior obstetricians and midwives committed to safe, natural birth wherever possible." },
        { icon: ShieldCheck, t: "Full emergency backup", d: "On-site operation theatre and newborn care, ready instantly if plans need to change." },
        { icon: Feather, t: "Painless option available", d: "Choose a fully natural birth or add epidural analgesia for a painless delivery." },
      ],
    },
    faqs: [
      { q: "Is a normal delivery safer than a C-section?", a: "For most low-risk pregnancies, vaginal birth is the safest option, with faster recovery and fewer surgical risks. Your doctor will advise the safest route for your specific situation." },
      { q: "Can I have a painless normal delivery?", a: "Yes. A normal delivery can be supported with an epidural for effective pain relief while you remain awake and able to push." },
      { q: "How long does recovery take?", a: "Most mothers recover quickly after a vaginal birth and are usually discharged sooner than after a caesarean, though every recovery is individual." },
      { q: "Can I have a normal delivery after a previous C-section?", a: "In selected cases, yes (VBAC). It depends on the reason for your earlier caesarean and your current pregnancy — our team will assess your suitability carefully." },
      { q: "What happens if labour doesn't progress?", a: "Your safety comes first. If labour stalls or concerns arise, the team is fully prepared to support an assisted or caesarean delivery promptly." },
    ],
    related: ["painless-delivery", "high-risk-pregnancy-care", "3d-4d-sonography"],
  },

  /* ---------------------------------------------------------------- */
  "fetal-medicine": {
    key: "fetal-medicine",
    slug: "fetal-medicine",
    schemaType: "MedicalTest",
    shortName: "fetal medicine",
    meta: {
      title: "Fetal Medicine Services in Ahmedabad — Bavishi Fertility & Birthing",
      description:
        "Specialist fetal medicine at Bavishi Fertility & Birthing — anomaly scans, NT/Doppler, fetal growth monitoring and expert assessment of your baby's health before birth. Book a consultation.",
    },
    breadcrumbName: "Fetal Medicine",
    reviewerSlug: MATERNITY_REVIEWER,
    lastReviewed: "2026-06-01",
    hero: {
      eyebrow: "Maternity Services",
      h1: "Fetal",
      h1Em: "Medicine",
      tagline:
        "Caring for your baby before birth. Our fetal medicine specialists assess your baby's growth, structure and wellbeing — catching concerns early and guiding the right plan with clarity and reassurance.",
      badges: ["Specialist assessment", "Advanced scanning", "Early detection"],
      image: "/assets/Fatal medicine.png",
      imageAlt: "Fetal medicine specialist reviewing a detailed pregnancy scan at Bavishi Fertility & Birthing",
    },
    overview: {
      heading: { lead: "Specialised care", em: "for your baby" },
      paragraphs: [
        "Fetal medicine is the branch of maternity care focused on the health, growth and development of your baby during pregnancy. Using advanced ultrasound and screening, our specialists assess fetal anatomy, monitor growth and identify conditions that may need closer attention — often well before birth.",
        "Early, accurate information means better planning. Whether it's reassurance after a routine scan or detailed evaluation of a suspected concern, our team explains findings clearly and guides you through the next steps with compassion and expertise.",
      ],
      aside: {
        title: "Especially important for",
        body: "IVF and assisted-conception pregnancies, advanced maternal age, twins, and any pregnancy where earlier screening suggests a closer look is needed.",
      },
    },
    benefits: {
      heading: { lead: "What fetal medicine", em: "offers" },
      subtitle: "A complete picture of your baby's wellbeing through pregnancy.",
      items: [
        "First-trimester screening and NT (nuchal translucency) scans",
        "Detailed anomaly (TIFFA) scans of fetal anatomy",
        "Fetal growth and wellbeing monitoring",
        "Doppler studies of blood flow to the baby",
        "Early detection of structural and chromosomal concerns",
        "Expert counselling and a clear management plan",
      ],
    },
    whoFor: {
      heading: { lead: "Who benefits", em: "most" },
      subtitle: "Recommended routinely, and essential for closely-watched pregnancies.",
      items: [
        "All pregnancies, for routine screening milestones",
        "IVF and assisted-conception pregnancies",
        "Advanced maternal age or previous pregnancy concerns",
        "Twin and multiple pregnancies",
        "When a scan or blood test flags a possible issue",
        "Families with a history of genetic or inherited conditions",
      ],
    },
    process: {
      heading: { lead: "How the", em: "assessment works" },
      subtitle: "Thorough evaluation, explained in plain language.",
      steps: [
        { icon: ClipboardList, t: "History & timing", d: "We review your pregnancy and plan scans at the right gestational milestones." },
        { icon: ScanLine, t: "Detailed scanning", d: "Advanced ultrasound assesses anatomy, growth and blood flow in fine detail." },
        { icon: Eye, t: "Specialist review", d: "A fetal medicine specialist interprets the findings and looks for any concerns." },
        { icon: Stethoscope, t: "Counselling", d: "Results are explained clearly, with time for your questions and worries." },
        { icon: ShieldCheck, t: "Care plan", d: "Together we agree the right monitoring or management plan for your baby." },
      ],
    },
    whyUs: {
      heading: { lead: "Why choose", em: "Bavishi Fertility & Birthing" },
      items: [
        { icon: Microscope, t: "Advanced imaging", d: "High-resolution 2D/3D/4D and Doppler for precise fetal assessment." },
        { icon: Stethoscope, t: "Specialist-led care", d: "Experienced fetal medicine expertise, integrated with your maternity team." },
        { icon: HeartPulse, t: "Continuity of care", d: "Seamless link from IVF and pregnancy through to delivery, all under one roof." },
      ],
    },
    faqs: [
      { q: "What is a fetal medicine specialist?", a: "A doctor with focused expertise in the health, growth and development of the baby during pregnancy, including detailed scanning and management of complex cases." },
      { q: "Which scans are part of fetal medicine?", a: "These typically include the first-trimester/NT scan, the detailed anomaly (TIFFA) scan, growth scans and Doppler studies — chosen to suit your pregnancy." },
      { q: "Are these scans safe?", a: "Yes. Ultrasound uses safe sound waves with no radiation, and is a routine, well-established part of pregnancy care." },
      { q: "Why is fetal medicine important for IVF pregnancies?", a: "IVF and twin pregnancies benefit from closer monitoring, and our fetal medicine team provides the detailed assessment these pregnancies often need." },
      { q: "What happens if a problem is found?", a: "Our specialists explain the findings clearly and guide you through the options and a tailored care plan, with compassionate support at every step." },
    ],
    related: ["3d-4d-sonography", "high-risk-pregnancy-care", "twin-pregnancy-care"],
  },

  /* ---------------------------------------------------------------- */
  "high-risk-pregnancy-care": {
    key: "high-risk-pregnancy-care",
    slug: "high-risk-pregnancy-care",
    schemaType: "MedicalProcedure",
    shortName: "high-risk pregnancy care",
    meta: {
      title: "High Risk Pregnancy Care in Ahmedabad — Bavishi Fertility & Birthing",
      description:
        "Expert high-risk pregnancy care at Bavishi Fertility & Birthing — close monitoring and management of complications for mother and baby, with full emergency and newborn backup. Book a consultation.",
    },
    breadcrumbName: "High Risk Pregnancy Care",
    reviewerSlug: MATERNITY_REVIEWER,
    lastReviewed: "2026-06-01",
    hero: {
      eyebrow: "Maternity Services",
      h1: "High Risk",
      h1Em: "Pregnancy Care",
      tagline:
        "When your pregnancy needs extra watching, you deserve extra expertise. Our specialists provide close monitoring and skilled management of complex pregnancies — protecting both mother and baby, every step of the way.",
      badges: ["Specialist-led", "Close monitoring", "24×7 emergency backup"],
      image: "/assets/suraksha-parenthood.png",
      imageAlt: "Specialist monitoring a high-risk pregnancy at Bavishi Fertility & Birthing",
    },
    overview: {
      heading: { lead: "Extra care for", em: "complex pregnancies" },
      paragraphs: [
        "A high-risk pregnancy is one where the mother, the baby, or both face a greater chance of complications. This can be due to existing health conditions, pregnancy-related problems, age, or factors such as twins or an IVF conception. With the right care, the large majority of high-risk pregnancies still reach a safe, healthy delivery.",
        "Our specialists provide closer, more frequent monitoring and a proactive plan tailored to your situation — coordinating obstetrics, fetal medicine and, where needed, other specialists, with the full resources of a maternity unit ready at all times.",
      ],
      aside: {
        title: "Reassurance matters",
        body: "\"High risk\" does not mean something will go wrong — it means we watch more closely and act early, so most pregnancies still reach a safe, happy delivery.",
      },
    },
    benefits: {
      heading: { lead: "Conditions we", em: "monitor & manage" },
      subtitle: "A proactive plan for the situations that need it most.",
      items: [
        "Gestational diabetes and high blood pressure / pre-eclampsia",
        "Twin and multiple pregnancies",
        "Pregnancies after IVF or with previous loss",
        "Advanced maternal age or pre-existing medical conditions",
        "Concerns with fetal growth or amniotic fluid",
        "Placental issues and other obstetric complications",
      ],
    },
    whoFor: {
      heading: { lead: "Who needs", em: "high-risk care" },
      subtitle: "If any of these apply, specialist supervision is recommended.",
      items: [
        "Diabetes, thyroid, hypertension or heart conditions",
        "Previous miscarriage, preterm birth or pregnancy loss",
        "Pregnancy at a younger or older maternal age",
        "Twin or multiple pregnancy",
        "Conception through IVF or other fertility treatment",
        "Complications detected during this pregnancy",
      ],
    },
    process: {
      heading: { lead: "Our approach to", em: "your care" },
      subtitle: "Watchful, coordinated and tailored to you.",
      steps: [
        { icon: ClipboardList, t: "Risk assessment", d: "A thorough review of your history and pregnancy identifies the specific risks to plan for." },
        { icon: CalendarCheck, t: "Tailored monitoring", d: "More frequent visits, scans and tests are scheduled to track mother and baby." },
        { icon: Activity, t: "Active management", d: "Conditions like blood pressure or diabetes are managed promptly to keep them controlled." },
        { icon: Users, t: "Coordinated specialists", d: "Obstetrics, fetal medicine and other experts work together on your plan." },
        { icon: ShieldCheck, t: "Safe delivery planning", d: "Your delivery is planned in advance with full emergency and newborn-care backup." },
      ],
    },
    whyUs: {
      heading: { lead: "Why choose", em: "Bavishi Fertility & Birthing" },
      items: [
        { icon: Stethoscope, t: "Specialist expertise", d: "Experienced obstetricians and fetal medicine specialists for complex pregnancies." },
        { icon: ShieldCheck, t: "Complete backup", d: "On-site operation theatre and newborn care, ready around the clock." },
        { icon: HeartPulse, t: "Continuity from IVF", d: "Especially attuned to IVF and assisted-conception pregnancies that need extra care." },
      ],
    },
    faqs: [
      { q: "What makes a pregnancy 'high risk'?", a: "Factors include existing conditions (like diabetes or hypertension), pregnancy complications, maternal age, multiple pregnancy, or conception through IVF. Your doctor assesses your individual risk." },
      { q: "Does high risk mean my baby is in danger?", a: "No. It means closer monitoring is needed. With specialist care, the great majority of high-risk pregnancies reach a safe, healthy delivery." },
      { q: "Will I need more scans and visits?", a: "Usually yes — more frequent check-ups, scans and tests help us track your wellbeing and your baby's, and act early if anything changes." },
      { q: "Can I still have a normal delivery?", a: "Often, yes, depending on your situation. Your delivery plan is decided with your safety and your baby's as the priority." },
      { q: "Is high-risk care important after IVF?", a: "IVF and twin pregnancies frequently benefit from closer supervision, which is a core strength of our maternity and fetal medicine team." },
    ],
    related: ["twin-pregnancy-care", "fetal-medicine", "painless-delivery"],
  },

  /* ---------------------------------------------------------------- */
  "twin-pregnancy-care": {
    key: "twin-pregnancy-care",
    slug: "twin-pregnancy-care",
    schemaType: "MedicalProcedure",
    shortName: "twin pregnancy care",
    meta: {
      title: "Twin & Multiple Pregnancy Care in Ahmedabad — Bavishi Fertility & Birthing",
      description:
        "Specialist twin and multiple pregnancy care at Bavishi Fertility & Birthing — close monitoring, expert fetal assessment and safe delivery planning for mother and babies. Book a consultation.",
    },
    breadcrumbName: "Twin Pregnancy Care",
    reviewerSlug: MATERNITY_REVIEWER,
    lastReviewed: "2026-06-01",
    hero: {
      eyebrow: "Maternity Services",
      h1: "Twin Pregnancy",
      h1Em: "Care",
      tagline:
        "Two babies, twice the care. Twin and multiple pregnancies need closer monitoring and specialist expertise — and our team provides exactly that, guiding you safely through to a happy delivery.",
      badges: ["Specialist monitoring", "Fetal medicine expertise", "Safe delivery planning"],
      image: "/assets/Twin pregnancy.png",
      imageAlt: "Specialist twin pregnancy care at Bavishi Fertility & Birthing",
    },
    overview: {
      heading: { lead: "Dedicated care for", em: "twins & multiples" },
      paragraphs: [
        "Carrying twins or more is a joyful but more demanding pregnancy. It carries a higher chance of conditions such as preterm birth, growth differences between babies, gestational diabetes and high blood pressure — so it needs closer monitoring and specialist expertise from early on.",
        "Twin pregnancies are also more common after IVF, where our care begins. Our obstetric and fetal medicine teams track both babies' growth carefully, manage any complications early, and plan a safe delivery — so you can focus on welcoming your little ones.",
      ],
      aside: {
        title: "Common after IVF",
        body: "Multiple pregnancies occur more often with fertility treatment. As an IVF institute, we are especially experienced in caring for twins from conception through delivery.",
      },
    },
    benefits: {
      heading: { lead: "What twin care", em: "includes" },
      subtitle: "Extra attention for two (or more) growing babies.",
      items: [
        "Close monitoring of both babies' growth and wellbeing",
        "Specialist fetal medicine assessment and detailed scans",
        "Early detection and management of complications",
        "Monitoring for gestational diabetes and blood pressure",
        "Nutrition and lifestyle guidance for a twin pregnancy",
        "Careful, individualised delivery planning",
      ],
    },
    whoFor: {
      heading: { lead: "Who this", em: "is for" },
      subtitle: "Specialist supervision is recommended for every multiple pregnancy.",
      items: [
        "All twin and higher-order multiple pregnancies",
        "Twin pregnancies conceived through IVF or fertility treatment",
        "Mothers with additional risk factors carrying multiples",
        "When scans show growth differences between babies",
        "Pregnancies needing extra reassurance and monitoring",
        "Planning a safe, well-timed delivery for multiples",
      ],
    },
    process: {
      heading: { lead: "How we care for", em: "you and your babies" },
      subtitle: "More frequent, more detailed, tailored to a multiple pregnancy.",
      steps: [
        { icon: ClipboardList, t: "Early specialist review", d: "We confirm the type of twin pregnancy, which shapes the right monitoring plan." },
        { icon: CalendarCheck, t: "Frequent monitoring", d: "More regular visits and scans track both babies' growth and your wellbeing." },
        { icon: ScanLine, t: "Detailed fetal scans", d: "Specialist scans check growth balance, fluid and blood flow for each baby." },
        { icon: Activity, t: "Proactive management", d: "Any complications are picked up early and managed promptly to keep you well." },
        { icon: ShieldCheck, t: "Safe delivery plan", d: "We plan the safest mode and timing of delivery, with full backup ready." },
      ],
    },
    whyUs: {
      heading: { lead: "Why choose", em: "Bavishi Fertility & Birthing" },
      items: [
        { icon: HeartPulse, t: "IVF-to-delivery continuity", d: "As a fertility institute, we care for many twin pregnancies from conception onward." },
        { icon: Microscope, t: "Advanced fetal imaging", d: "Detailed scanning to monitor each baby's growth and wellbeing precisely." },
        { icon: ShieldCheck, t: "Safe, equipped delivery", d: "Experienced teams and full emergency and newborn-care backup for multiples." },
      ],
    },
    faqs: [
      { q: "Why do twin pregnancies need special care?", a: "Carrying more than one baby raises the chance of preterm birth, growth differences and conditions like high blood pressure, so closer monitoring and specialist input improve outcomes." },
      { q: "Are twins more common after IVF?", a: "Yes, multiple pregnancies are more common with fertility treatment. As an IVF institute, we are highly experienced in caring for twin pregnancies." },
      { q: "Will I need more scans?", a: "Yes. Twin pregnancies are monitored more frequently to track both babies' growth, fluid and wellbeing throughout." },
      { q: "Can I deliver twins normally?", a: "Sometimes, depending on the babies' positions and your pregnancy. Your delivery plan is individualised with safety as the priority, with full backup available." },
      { q: "What complications are watched for?", a: "These include preterm labour, growth differences between babies, gestational diabetes, high blood pressure and, in shared-placenta twins, specific conditions your specialist will monitor." },
    ],
    related: ["high-risk-pregnancy-care", "fetal-medicine", "3d-4d-sonography"],
  },
};

/* ---------- Lookups & static params ---------- */

export const serviceContentBySlug = (slug: string): ServiceContent | undefined =>
  SERVICE_CONTENT[slug];

/** Static params for /services/[slug] — every published service that has content. */
export const builtServiceParams = (): { slug: string }[] =>
  Object.values(WOMENS_HEALTH_SERVICES)
    .filter((s) => s.published && SERVICE_CONTENT[s.key])
    .map((s) => ({ slug: s.key }));

/* =====================================================================
 * Schema builder — mirrors treatmentGraph (MedicalWebPage +
 * MedicalProcedure/MedicalTest + Breadcrumb + FAQ + reviewedBy).
 * ---------------------------------------------------------------------
 * Takes the minimal, icon-free subset both the typed code default
 * (ServiceContent) and the CMS-resolved model (ResolvedService, src/lib/
 * services.ts) satisfy — so the route can feed it either, unchanged. Stays a
 * pure builder with no Payload import (client bundles stay clean).
 * ===================================================================== */
export type ServiceGraphInput = {
  key: string;
  slug: string;
  breadcrumbName: string;
  reviewerSlug: string;
  lastReviewed: string;
  schemaType: "MedicalProcedure" | "MedicalTest" | "MedicalTherapy";
  meta: { title: string; description: string };
  faqs: { q: string; a: string }[];
};

export function serviceGraph(s: ServiceGraphInput): Record<string, unknown>[] {
  const reg = WOMENS_HEALTH_SERVICES[s.key];
  const serviceName = reg?.name ?? s.breadcrumbName;
  const url = abs(reg?.href ?? `/services/${s.slug}`);
  const reviewer = doctorBySlug(s.reviewerSlug);

  const nodes: Record<string, unknown>[] = [
    {
      "@type": "MedicalWebPage",
      "@id": `${url}#webpage`,
      url,
      name: s.meta.title,
      description: s.meta.description,
      about: { "@type": s.schemaType, name: serviceName },
      lastReviewed: s.lastReviewed,
      isPartOf: { "@id": WEBSITE_ID },
      ...(reviewer ? { reviewedBy: reviewerNode(reviewer) } : {}),
    },
    {
      "@type": s.schemaType,
      name: serviceName,
      description: s.meta.description,
      provider: { "@id": ORG_ID },
    },
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Maternity Services", url: "/#treatments" },
      { name: s.breadcrumbName, url: WOMENS_HEALTH_SERVICES[s.key]?.href ?? `/services/${s.slug}` },
    ]),
    faqSchema(s.faqs),
  ];

  // Include the reviewer's full Physician node so `reviewedBy` resolves.
  if (reviewer) nodes.push(physicianSchema(reviewer));

  return nodes;
}

/** Convenience for the registry object behind a content slug. */
export const serviceRegistryBySlug = (slug: string): WomensHealthService | undefined =>
  WOMENS_HEALTH_SERVICES[slug];

/** Resolve related-service KEYS → registry objects for cross-link cards. */
export const relatedServices = (keys: string[]): WomensHealthService[] => womensHealthServices(keys);
