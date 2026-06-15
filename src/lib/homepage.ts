/* =====================================================================
 * Homepage resolver — maps the `homepage` global to the plain,
 * client-serialisable model the <HomePage> sections render (Wave 4.2).
 * ---------------------------------------------------------------------
 * The CMS `homepage` global is the source of truth for the homepage's
 * EDITORIAL content (hero copy, stats, the two "Why" blocks, Suraksha,
 * awards, events, video IDs, FAQs and the final CTA). This module shapes a
 * global doc into `HomepageData`, falling back PER-SECTION to the typed
 * HOMEPAGE_DEFAULTS so an empty/partial CMS renders byte-identically (same
 * convention as src/lib/footer.ts → FOOTER_DEFAULTS and src/lib/services.ts).
 *
 * ICONS: the Lucide-driven "Why Bavishi" cards carry icon NAMES (strings),
 * never Lucide components — so the model crosses the server→client boundary as
 * props. <HomePage> maps names → components via resolveIcon() (src/lib/icon-map).
 * The image-driven "Why Choose" pillars already use plain image URLs.
 *
 * HEADINGS are stored as { lead, em } text only — each call site keeps its own
 * decorative <em className="…"> in the component, so markup stays byte-identical
 * while the words become editable.
 *
 * What stays CODE-OWNED (not here): calculators, dynamic Doctors/Treatments,
 * review aggregation (Testimonials), the About/Media/Locations/Inquiry copy and
 * the blog listing. Pure module (no payload / server-only imports) — safe to
 * bundle into the client <HomePage> (its in-browser default content).
 * ===================================================================== */
import { destinationHref } from "@/lib/internal-links";
import type { IconName } from "@/lib/icon-map";

/* ---------- Resolved (serialisable) model ---------- */

/** A two-part heading: plain lead text + the decorative <em> word(s). The
 *  component supplies the per-section <em> className, so markup is unchanged. */
export type Heading = { lead: string; em: string };

export type HeroContent = {
  eyebrow: string;
  /** Full headline passed to <WordReveal text>. */
  headline: string;
  /** The word highlighted inside the headline (<WordReveal italicWord>). */
  headlineItalic: string;
  paragraph: string;
  badges: string[];
  /** Three button labels, in order (primary, then two ghost buttons). */
  ctas: string[];
  /** Floating award chip text on the hero image. */
  floatingBadge: string;
  /** Hero image URL (replaceable in the inline editor). */
  image: string;
};

export type StatItem = { value: string; l: string };

/** A Lucide-icon "Why Bavishi" card (icon carried as a curated NAME). */
export type WhyCard = { icon: IconName; t: string; d: string };

/** An image-icon "Why Choose" pillar (Simple / Safe / Smart / Successful). */
export type WhyChooseBlock = {
  icon: string; // image URL
  alt: string;
  title: string;
  subtitle: string;
  points: { h: string; d: string }[];
};

export type SurakshaContent = {
  badge: string;
  heading: Heading;
  paragraph: string;
  features: string[];
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  image: string;
  imageAlt: string;
};

export type AwardItem = { img: string; title: string; desc: string };
export type EventPoster = { src: string; alt: string };

/** Patient success-story video (id + name + quote + star rating). */
export type VideoStory = { id: string; n: string; q: string; r: number };
/** Educational video (id + title + description). */
export type EduVideo = { id: string; t: string; d: string };
/** Resource video (id + category + title + byline). */
export type ResourceVideo = { id: string; c: string; t: string; date: string };

export type FaqItem = { q: string; a: string };

export type FinalCtaContent = {
  eyebrow: string;
  heading: Heading;
  paragraph: string;
  /** Animated counters: value, suffix, label. */
  stats: { v: number; s: string; l: string }[];
  /** Three button labels, in order. */
  ctas: string[];
};

/** The homepage's "About the Institute" summary section (its own copy — distinct
 *  from the /about-bfi page). Editorial text + the {k,v} stat grid + the floating
 *  "Since 1983" chip + the section image. CTA links stay code-owned. */
export type HomeAboutContent = {
  eyebrow: string;
  heading: Heading;
  subtitle: string;
  stats: { k: string; v: string }[];
  primaryCta: string;
  secondaryCta: string;
  sinceValue: string;
  sinceLabel: string;
  image: string;
  imageAlt: string;
};

export type HomepageSeo = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
};

/* ---------- Section layout (page builder) ----------
 * The homepage is assembled from a fixed catalogue of section components. The
 * CMS `layout` lets a non-technical editor REORDER and SHOW/HIDE these known
 * sections — it never introduces new HTML. HOME_SECTIONS is the canonical order
 * (identical to the original fixed JSX sequence) so an empty/absent layout
 * renders byte-identically. Adding a section to the page = unhiding it; removing
 * = hiding it; dragging a row = reordering. */
export const HOME_SECTIONS = [
  "hero", "stats", "whyBavishi", "suraksha", "treatments", "successStories",
  "videoHub", "about", "doctors", "whyChoose", "awards", "media", "testimonials",
  "events", "blogs", "locations", "faq", "calculators", "inquiry", "finalCta",
] as const;
export type HomeSection = (typeof HOME_SECTIONS)[number];
export type HomeSectionLayout = { section: HomeSection; visible: boolean };

/** Human-friendly labels for the layout select (admin + reference). */
export const HOME_SECTION_LABELS: Record<HomeSection, string> = {
  hero: "Top Banner",
  stats: "Stats Strip",
  whyBavishi: "Why Bavishi Cards",
  suraksha: "Suraksha Kavach",
  treatments: "Treatments Grid",
  successStories: "Patient Success Stories",
  videoHub: "Education Videos",
  about: "About the Institute",
  doctors: "Our Doctors",
  whyChoose: "Why Choose Pillars",
  awards: "Awards Carousel",
  media: "Media Coverage",
  testimonials: "Google Reviews",
  events: "Upcoming Events",
  blogs: "Knowledge & Resources",
  locations: "Our Locations",
  faq: "FAQs",
  calculators: "Fertility Calculators",
  inquiry: "Inquiry Form",
  finalCta: "Closing Call-to-Action",
};

/** The canonical layout — every section, in order, visible. Used as the
 *  byte-identical fallback whenever the CMS layout is empty. */
export const DEFAULT_HOME_LAYOUT: HomeSectionLayout[] = HOME_SECTIONS.map(
  (section) => ({ section, visible: true }),
);

/** Client-ready, fully-resolved homepage content. */
export type HomepageData = {
  /** Section render order + visibility. Absent/empty → DEFAULT_HOME_LAYOUT. */
  layout?: HomeSectionLayout[];
  hero: HeroContent;
  stats: StatItem[];
  whyBavishi: { eyebrow: string; heading: Heading; subtitle: string; cards: WhyCard[] };
  whyChoose: { eyebrow: string; heading: Heading; subtitle: string; blocks: WhyChooseBlock[] };
  suraksha: SurakshaContent;
  about: HomeAboutContent;
  awards: { eyebrow: string; heading: Heading; subtitle: string; items: AwardItem[] };
  events: { eyebrow: string; heading: Heading; posters: EventPoster[] };
  videos: { stories: VideoStory[]; edu: EduVideo[]; resources: ResourceVideo[] };
  faq: { eyebrow: string; heading: Heading; items: FaqItem[] };
  finalCta: FinalCtaContent;
  /** Header-only copy for sections whose item data is sourced elsewhere
   *  (videos collection / doctors). The cards themselves stay code/entity-owned. */
  treatments: { eyebrow: string; heading: Heading; subtitle: string; ctaLabel: string; items: { icon: IconName; t: string; d: string }[] };
  successStories: { eyebrow: string; heading: Heading; subtitle: string; ctaLabel: string };
  videoHub: { eyebrow: string; heading: Heading; subtitle: string; ctaLabel: string };
  doctors: { eyebrow: string; heading: Heading; subtitle: string; ctaLabel: string };
  blogs: { eyebrow: string; heading: Heading; ctaLabel: string };
  testimonials: { eyebrow: string; heading: Heading };
  media: { eyebrow: string; heading: Heading; logos: { src: string; alt: string }[] };
  /** City cards: name (c), centre count (n), slug (s, the link target). */
  locations: { eyebrow: string; heading: Heading; subtitle: string; cities: { c: string; n: number; s: string }[] };
  calculators: { eyebrow: string; heading: Heading; subtitle: string; items: string[] };
  /** Contact rows carry editable text only — the icon stays code-owned (it maps
   *  to the contact method, by index). */
  inquiry: { eyebrow: string; heading: Heading; subtitle: string; contacts: { h: string; d: string }[] };
  seo: HomepageSeo;
};

/* ---------- Asset paths (mirror the component's module consts) ---------- */
const heroImg = "/assets/hero-mother-baby1.png";
const surakshaImg = "/assets/suraksha-parenthood.png";
const aboutImg = "/assets/about-clinic.jpg";
const whyIcons = {
  simple: "/assets/Simple-1.png",
  safe: "/assets/Safe-1.png",
  smart: "/assets/Smart-1.png",
  successful: "/assets/success-1.png",
};

/**
 * Typed fallback — the exact homepage editorial content as it shipped before
 * the CMS, so an empty `homepage` global renders byte-identically. The seeded
 * global mirrors this.
 */
export const HOMEPAGE_DEFAULTS: HomepageData = {
  hero: {
    eyebrow: "Trusted Since 1983",
    headline: "India's Trusted Fertility Center for 40+ Years",
    headlineItalic: "Fertility",
    paragraph:
      "Helping families achieve parenthood through advanced fertility treatments, compassionate care, and personalised IVF programs.",
    badges: [
      "30,000+ Successful Pregnancies",
      "40+ Years Experience",
      "14 Fertility Centres",
      "Leading IVF Specialists",
    ],
    ctas: ["Book Consultation", "Check IVF Eligibility", "Video Consultation"],
    floatingBadge: "National Fertility Award · 5× Winner",
    image: heroImg,
  },
  stats: [
    { value: "30,000+", l: "Successful Pregnancies" },
    { value: "40+", l: "Years Legacy" },
    { value: "15+", l: "Locations" },
    { value: "100+", l: "Experts" },
    { value: "5× Winner", l: "National Fertility Award" },
    { value: "Rank #1", l: "Best IVF Center in India" },
    { value: "300+", l: "International Patients" },
  ],
  whyBavishi: {
    eyebrow: "Why Bavishi Fertility Center",
    heading: { lead: "A different kind of", em: "fertility experience." },
    subtitle:
      "Premium, transparent and deeply personal. We've redefined what fertility care should feel like.",
    cards: [
      { icon: "Sparkles", t: "Transparent Treatment Plans", d: "Clear pricing, honest timelines and no hidden costs across every step of your journey." },
      { icon: "Microscope", t: "Advanced Fertility Technology", d: "State-of-the-art embryology labs, time-lapse imaging and PGT for the highest success rates." },
      { icon: "Stethoscope", t: "Experienced IVF Specialists", d: "Led by world-renowned doctors with decades of clinical experience and global training." },
      { icon: "HeartPulse", t: "Personalised Care Journey", d: "Every plan is tailored — emotionally and clinically — to your unique fertility story." },
    ],
  },
  whyChoose: {
    eyebrow: "The Bavishi Fertility Institute Difference",
    heading: { lead: "Why Choose", em: "Bavishi Fertility Institute?" },
    subtitle:
      "Four pillars that define our approach to fertility care — Simple, Safe, Smart and Successful.",
    blocks: [
      {
        icon: whyIcons.simple, alt: "Simple IVF care",
        title: "Simple", subtitle: "Making IVF Easy",
        points: [
          { h: "Personalized Plans", d: "Tailored treatment for your needs." },
          { h: "Minimal Discomfort", d: "Fewer injections, fewer visits." },
          { h: "Quick Recovery", d: "Light anesthesia, early discharge." },
          { h: "Painless Transfer", d: "Stress-free embryo transfer." },
        ],
      },
      {
        icon: whyIcons.safe, alt: "Safe IVF treatment",
        title: "Safe", subtitle: "IVF with Maximum Safety",
        points: [
          { h: "Zero Error Protocols", d: "Double-check system for accuracy." },
          { h: "OHSS-Free Treatment", d: "Safe stimulation protocols." },
          { h: "Advanced IVF Labs", d: "Pure air quality & contamination control." },
          { h: "Strict Confidentiality", d: "Privacy ensured at every step." },
        ],
      },
      {
        icon: whyIcons.smart, alt: "Smart IVF technology",
        title: "Smart", subtitle: "Intelligent IVF for Better Outcomes",
        points: [
          { h: "Smart Monitoring", d: "Real-time tracking for best outcomes." },
          { h: "Optimized Lab Techniques", d: "Cutting-edge embryo selection." },
          { h: "AI Monitoring", d: "Smart embryo tracking." },
          { h: "Time-Saving", d: "Fewer visits, remote options." },
        ],
      },
      {
        icon: whyIcons.successful, alt: "Successful IVF outcomes",
        title: "Successful", subtitle: "Proven IVF Excellence",
        points: [
          { h: "20,000+ IVF Success Stories", d: "Families who trusted us with parenthood." },
          { h: "100+ Years of Combined Expertise", d: "A family of seasoned fertility specialists." },
          { h: "Safe & Healthy Pregnancy Focus", d: "Care that extends beyond conception." },
          { h: "Unique IVF Packages", d: "Suraksha Kavach benefits & refund protection." },
        ],
      },
    ],
  },
  suraksha: {
    badge: "Exclusive Program",
    heading: { lead: "Suraksha Kavach —", em: "peace of mind, guaranteed." },
    paragraph:
      "India's most trusted IVF refund & protection program. Reduce financial risk, increase confidence, and focus on what truly matters — your journey to parenthood.",
    features: ["Refund Guarantee", "Risk Reduction", "Multiple IVF Cycles", "Priority Care"],
    primaryCta: { label: "Explore Suraksha Kavach", href: destinationHref("suraksha-kavach") },
    secondaryCta: { label: "Learn More", href: "/#book" },
    image: surakshaImg,
    imageAlt: "Expecting parents — the journey to parenthood, protected",
  },
  about: {
    eyebrow: "About the Institute",
    heading: { lead: "A legacy of", em: "life-changing care." },
    subtitle:
      "For over four decades, Bavishi Fertility Institute has stood at the forefront of reproductive medicine in India — pioneering IVF, leading clinical research, and building one of the country's most respected fertility networks.",
    stats: [
      { k: "Legacy", v: "40+ Years" },
      { k: "Recognition", v: "Award-Winning" },
      { k: "Patient Care", v: "Personalised" },
      { k: "IVF Leadership", v: "India's First" },
    ],
    primaryCta: "Read More",
    secondaryCta: "Our Story",
    sinceValue: "Since 1983",
    sinceLabel: "Pioneering fertility care",
    image: aboutImg,
    imageAlt: "Bavishi Fertility Institute",
  },
  awards: {
    eyebrow: "Awards & Recognition",
    heading: { lead: "Our Awards &", em: "Achievements." },
    subtitle: "Awarded for Excellence in IVF & Fertility Care.",
    items: [
      { img: "/assets/awards/ivf-chain-of-the-year.png", title: "IVF Chain of the Year – West", desc: "Economic Times Healthworld · 2025" },
      { img: "/assets/awards/patient-centric-award.png", title: "Patient Centric Hospital Award", desc: "IHW Patient First Awards" },
      { img: "/assets/awards/bharat-excellence-award.png", title: "Bharat Excellence Award", desc: "For IVF & Infertility Care" },
      { img: "/assets/awards/times-healthcare-award.png", title: "Times Healthcare Leaders Award", desc: "Times Healthcare · 2025" },
    ],
  },
  events: {
    eyebrow: "Upcoming Events",
    heading: { lead: "Learn directly from", em: "our specialists." },
    posters: [
      { src: "/assets/events/event-1.webp", alt: "Special Consultation with Dr. Himanshu Bavishi — upcoming visit schedule" },
      { src: "/assets/events/event-2.webp", alt: "Bavishi Fertility — upcoming events & visit plan" },
    ],
  },
  videos: {
    stories: [
      { id: "6bH_RnV-_2Y", n: "Anita Thakkar", q: "15 years of waiting and a failed IVF elsewhere — then our miracle finally happened at Bavishi Fertility Institute.", r: 5 },
      { id: "KKf6tNrlvoc", n: "Rekha's Journey", q: "From loss to a twin blessing — an inspiring IVF journey with the Bavishi Fertility Institute team by our side.", r: 5 },
      { id: "SbkV-1fSonM", n: "Jigesh & Jinal", q: "After failed treatments everywhere else, Bavishi Fertility Institute's personal care made us parents at last.", r: 5 },
    ],
    edu: [
      { id: "22xqpk3-z2I", t: "How to Increase Sperm Count", d: "Practical, science-backed advice from our specialists." },
      { id: "eON_mr8bz-A", t: "Egg Freezing vs Embryo Freezing", d: "Dr. Parth Bavishi explains which option suits you." },
      { id: "Pzbwv2EZlrM", t: "Ovarian Cyst Before IVF — What to Do", d: "Do you need to remove a cyst before starting IVF?" },
      { id: "bNZiMbg4Wkw", t: "Natural Pregnancy After 40?", d: "Understanding your real chances and options." },
    ],
    resources: [
      { id: "AO_J6jKeCck", c: "IVF Guide", t: "How Many Eggs Are Actually Needed for IVF?", date: "Dr. Parth Bavishi" },
      { id: "5oKbplu1Qzs", c: "After Transfer", t: "Which Medicines Are Necessary After Embryo Transfer?", date: "Dr. Parth Bavishi" },
      { id: "f3N5WJtGwmk", c: "Fertility Preservation", t: "5 Things to Know Before Egg Freezing", date: "Dr. Parth Bavishi" },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    heading: { lead: "Answers to your", em: "first questions." },
    items: [
      { q: "What is IVF and how does it work?", a: "IVF (In-Vitro Fertilisation) is a process where an egg is fertilised by sperm outside the body. The resulting embryo is then transferred to the uterus. The process involves ovarian stimulation, egg retrieval, fertilisation, embryo culture and transfer." },
      { q: "What are the success rates at Bavishi Fertility Centre?", a: "Our success rates are among the highest in India — typically 55–70% per cycle for women under 35, with rates personalised based on age, diagnosis and treatment plan." },
      { q: "How much does IVF cost?", a: "IVF costs vary based on the protocol, medication and additional procedures required. Use our IVF Cost Calculator for a transparent estimate or speak to our team for a personalised quote." },
      { q: "Is fertility treatment painful?", a: "Most fertility treatments cause minimal discomfort. Egg retrieval is performed under sedation. Our team prioritises your comfort at every step." },
      { q: "How do I get started?", a: "Begin with a consultation — in-person or by video. Our specialists will review your history and design a personalised plan." },
      { q: "Do you offer video consultations?", a: "Yes. Secure video consultations are available with all our senior specialists, across India and internationally." },
      { q: "What is the Suraksha Kavach refund program?", a: "Suraksha Kavach is our pioneering refund-and-protection program: eligible patients pay only for success, with a refund guarantee if treatment outcomes are not achieved." },
    ],
  },
  finalCta: {
    eyebrow: "Begin Today",
    heading: { lead: "Ready to begin your", em: "parenthood journey?" },
    paragraph:
      "Speak with our fertility experts today — confidential, compassionate and complimentary.",
    stats: [
      { v: 30000, s: "+", l: "Pregnancies" },
      { v: 40, s: "+", l: "Years" },
      { v: 15, s: "+", l: "Centres" },
    ],
    ctas: ["Book Consultation", "WhatsApp Now", "Call Now"],
  },
  treatments: {
    eyebrow: "Treatments",
    heading: { lead: "Fertility care,", em: "complete and considered." },
    subtitle: "Every treatment we offer is delivered with the same standard of clinical excellence and emotional care.",
    ctaLabel: "View All Treatments",
    items: [
      { icon: "Stethoscope", t: "Male Infertility", d: "Comprehensive evaluation and treatment for male factors." },
      { icon: "HeartPulse", t: "Female Infertility", d: "Personalised pathways for every female fertility concern." },
      { icon: "Sparkles", t: "Advanced Fertility Techniques", d: "Latest assisted reproduction protocols." },
      { icon: "Dna", t: "PGT — Genetic Testing", d: "Pre-implantation testing for healthier embryos." },
      { icon: "Activity", t: "IUI", d: "Intrauterine insemination for select fertility profiles." },
      { icon: "FlaskConical", t: "IVF / ICSI / ART", d: "Advanced in-vitro fertilisation with ICSI." },
      { icon: "Microscope", t: "Fertility Preservation", d: "Egg, sperm and embryo freezing for the future." },
      { icon: "Baby", t: "Sperm Donation", d: "Screened, ethical donor sperm programs." },
      { icon: "Baby", t: "Egg Donation", d: "Carefully matched egg donor programs." },
      { icon: "Baby", t: "Embryo Donation", d: "A compassionate path to parenthood." },
      { icon: "HeartPulse", t: "Fibroids", d: "Diagnosis and fertility-preserving treatment." },
      { icon: "HeartPulse", t: "Endometriosis", d: "Specialised endometriosis fertility care." },
      { icon: "Sparkles", t: "Ovarian Rejuvenation", d: "Advanced therapy for diminished ovarian reserve." },
      { icon: "Activity", t: "High Risk Obstetrics", d: "Expert care for complex pregnancies." },
      { icon: "Baby", t: "Maternity Services", d: "End-to-end maternity and newborn care." },
    ],
  },
  successStories: {
    eyebrow: "Success Stories",
    heading: { lead: "30,000+ journeys.", em: "One promise kept." },
    subtitle: "Real stories from real families who began their parenthood journey with us.",
    ctaLabel: "View More Success Stories",
  },
  videoHub: {
    eyebrow: "Education",
    heading: { lead: "Learn from the", em: "experts." },
    subtitle: "Clear, trustworthy fertility education from our specialists.",
    ctaLabel: "Watch All Videos",
  },
  doctors: {
    eyebrow: "Meet the Specialists",
    heading: { lead: "Meet Our", em: "Promoter Doctors." },
    subtitle: "A family of fertility experts trusted by generations.",
    ctaLabel: "View All Doctors",
  },
  blogs: {
    eyebrow: "Knowledge & Resources",
    heading: { lead: "Knowledge,", em: "beautifully explained." },
    ctaLabel: "Explore Resources",
  },
  testimonials: {
    eyebrow: "Testimonials",
    heading: { lead: "Words from", em: "our families." },
  },
  media: {
    eyebrow: "As Featured In",
    heading: { lead: "Media coverage", em: "across India." },
    logos: [
      { src: "/assets/media/news-gujarati.png", alt: "News18 Gujarati" },
      { src: "/assets/media/sandesh-tv.png", alt: "Sandesh News" },
      { src: "/assets/media/my-fm.png", alt: "MY FM" },
    ],
  },
  inquiry: {
    eyebrow: "Book an Appointment",
    heading: { lead: "Start your", em: "parenthood journey." },
    subtitle: "Share a few details and our fertility counsellor will call you back — confidential, compassionate and complimentary.",
    contacts: [
      { h: "Call us", d: "+91 97126 22288" },
      { h: "WhatsApp", d: "Chat with our team 24×7" },
      { h: "Response time", d: "We typically respond within 30 minutes" },
    ],
  },
  locations: {
    eyebrow: "Our Locations",
    heading: { lead: "Find a Bavishi Fertility Institute Centre", em: "near you." },
    subtitle: "15 centres across 8 cities — premium fertility care, close to home wherever you are.",
    cities: [
      { c: "Ahmedabad", n: 3, s: "ahmedabad" },
      { c: "Mumbai", n: 5, s: "mumbai" },
      { c: "Vadodara", n: 1, s: "vadodara" },
      { c: "Surat", n: 1, s: "surat" },
      { c: "Bhuj", n: 1, s: "bhuj" },
      { c: "Bhavnagar", n: 1, s: "bhavnagar" },
      { c: "Anand", n: 1, s: "anand" },
      { c: "Varanasi", n: 1, s: "varanasi" },
    ],
  },
  calculators: {
    eyebrow: "Fertility Tools",
    heading: { lead: "Free calculators by", em: "our experts." },
    subtitle: "Practical, science-backed tools to help you understand your fertility — privately and instantly.",
    items: [
      "IVF Success Rate Calculator",
      "Fertile Period Calculator",
      "Risk of Repeat Miscarriage Calculator",
      "Natural Pregnancy Calculator",
      "IVF Cost Calculator",
      "AMH Level Interpreter",
      "Ovulation Calculator",
      "Semen Analysis Calculator",
    ],
  },
  seo: {
    metaTitle: "Bavishi Fertility Centre — India's Trusted IVF Experts for 40+ Years",
    metaDescription:
      "Premium fertility care across 15 centres in India. 30,000+ successful pregnancies, advanced IVF, ICSI, IUI, and personalised treatment plans by leading specialists.",
    ogTitle: "Bavishi Fertility Centre — India's Trusted IVF Experts",
    ogDescription:
      "30,000+ pregnancies. 40+ years of legacy. 15 centres. Personalised, transparent and compassionate fertility care.",
    ogImage: heroImg,
  },
};

/* =====================================================================
 * CMS source shape (kept loose so it stays decoupled from the generated
 * payload-types, same convention as FooterSource / ServiceSource).
 * ===================================================================== */
type HeadingSource = { lead?: string | null; em?: string | null } | null | undefined;
type TextItem = { text?: string | null };
type PointSource = { h?: string | null; d?: string | null };

export type HomepageSource =
  | {
      layout?: { section?: string | null; visible?: boolean | null }[] | null;
      hero?: {
        eyebrow?: string | null;
        headline?: string | null;
        headlineItalic?: string | null;
        paragraph?: string | null;
        badges?: TextItem[] | null;
        floatingBadge?: string | null;
        image?: string | null;
      } | null;
      stats?: { value?: string | null; label?: string | null }[] | null;
      whyBavishi?: {
        eyebrow?: string | null;
        heading?: HeadingSource;
        subtitle?: string | null;
        cards?: { icon?: string | null; t?: string | null; d?: string | null }[] | null;
      } | null;
      whyChoose?: {
        eyebrow?: string | null;
        heading?: HeadingSource;
        subtitle?: string | null;
        blocks?: {
          icon?: string | null; alt?: string | null;
          title?: string | null; subtitle?: string | null;
          points?: PointSource[] | null;
        }[] | null;
      } | null;
      suraksha?: {
        badge?: string | null;
        heading?: HeadingSource;
        paragraph?: string | null;
        features?: TextItem[] | null;
        primaryCta?: { label?: string | null; href?: string | null } | null;
        secondaryCta?: { label?: string | null; href?: string | null } | null;
        image?: string | null;
        imageAlt?: string | null;
      } | null;
      about?: {
        eyebrow?: string | null;
        heading?: HeadingSource;
        subtitle?: string | null;
        stats?: { k?: string | null; v?: string | null }[] | null;
        primaryCta?: string | null;
        secondaryCta?: string | null;
        sinceValue?: string | null;
        sinceLabel?: string | null;
        image?: string | null;
        imageAlt?: string | null;
      } | null;
      awards?: {
        eyebrow?: string | null;
        heading?: HeadingSource;
        subtitle?: string | null;
        items?: { img?: string | null; title?: string | null; desc?: string | null }[] | null;
      } | null;
      events?: {
        eyebrow?: string | null;
        heading?: HeadingSource;
        posters?: { src?: string | null; alt?: string | null }[] | null;
      } | null;
      videos?: {
        stories?: { id?: string | null; n?: string | null; q?: string | null; r?: number | null }[] | null;
        edu?: { id?: string | null; t?: string | null; d?: string | null }[] | null;
        resources?: { id?: string | null; c?: string | null; t?: string | null; date?: string | null }[] | null;
      } | null;
      faq?: {
        eyebrow?: string | null;
        heading?: HeadingSource;
        items?: { q?: string | null; a?: string | null }[] | null;
      } | null;
      finalCta?: {
        eyebrow?: string | null;
        heading?: HeadingSource;
        paragraph?: string | null;
        stats?: { v?: number | null; s?: string | null; l?: string | null }[] | null;
      } | null;
      treatments?: {
        eyebrow?: string | null;
        heading?: HeadingSource;
        subtitle?: string | null;
        ctaLabel?: string | null;
        items?: { icon?: string | null; t?: string | null; d?: string | null }[] | null;
      } | null;
      successStories?: { eyebrow?: string | null; heading?: HeadingSource; subtitle?: string | null; ctaLabel?: string | null } | null;
      videoHub?: { eyebrow?: string | null; heading?: HeadingSource; subtitle?: string | null; ctaLabel?: string | null } | null;
      doctors?: { eyebrow?: string | null; heading?: HeadingSource; subtitle?: string | null; ctaLabel?: string | null } | null;
      blogs?: { eyebrow?: string | null; heading?: HeadingSource; ctaLabel?: string | null } | null;
      testimonials?: { eyebrow?: string | null; heading?: HeadingSource } | null;
      media?: {
        eyebrow?: string | null;
        heading?: HeadingSource;
        logos?: { src?: string | null; alt?: string | null }[] | null;
      } | null;
      inquiry?: {
        eyebrow?: string | null;
        heading?: HeadingSource;
        subtitle?: string | null;
        contacts?: { h?: string | null; d?: string | null }[] | null;
      } | null;
      locations?: {
        eyebrow?: string | null;
        heading?: HeadingSource;
        subtitle?: string | null;
        cities?: { c?: string | null; n?: number | null; s?: string | null }[] | null;
      } | null;
      calculators?: {
        eyebrow?: string | null;
        heading?: HeadingSource;
        subtitle?: string | null;
        items?: { name?: string | null }[] | null;
      } | null;
      seo?: {
        metaTitle?: string | null;
        metaDescription?: string | null;
        ogTitle?: string | null;
        ogDescription?: string | null;
        ogImage?: unknown;
      } | null;
    }
  | null
  | undefined;

/* ---------- Small helpers (mirror src/lib/services.ts) ---------- */
// Resolve the two heading parts INDEPENDENTLY, each falling back to its default.
// The editor commits one field at a time (e.g. blurring the lead writes only
// `heading.lead`), so the other part is absent from the draft. The old
// `h?.lead ? {lead, em: h.em ?? ""} : def` form turned that absent part into ""
// — editing the lead silently wiped the <em> on screen (and vice-versa lost an
// em-only edit). Per-field fallback keeps the untouched part intact. `??` only
// substitutes null/undefined, so an explicitly-cleared "" is still respected.
const heading = (h: HeadingSource, def: Heading): Heading => ({
  lead: h?.lead ?? def.lead,
  em: h?.em ?? def.em,
});
const texts = (a: TextItem[] | null | undefined): string[] =>
  (a ?? []).filter((x) => x != null).map((x) => x.text ?? "").filter(Boolean);

/** Merge a CMS list over its typed default list BY INDEX.
 *
 *  The inline editor commits ONE row at a time onto an otherwise-absent section,
 *  so a half-edited draft holds e.g. just `treatments.items[2]`. The old
 *  "use the whole CMS array, else the whole default" rule then either rendered
 *  only that single row (dropping every other card) or threw on a hole (reading
 *  `.icon` of undefined → the editor subtree unmounts → content "vanishes").
 *
 *  Index-merging fixes both: each row is resolved from the CMS override when
 *  present, otherwise from the default at that index, so editing one row keeps
 *  the rest intact and a hole simply uses its default. When the CMS list has no
 *  usable rows at all we return the default list unchanged (so an empty CMS is
 *  byte-identical, and a fully-populated CMS that matches the defaults resolves
 *  to the same values — the SEO parity surface is unaffected). */
function mergeList<S, R>(
  srcArr: readonly (S | null | undefined)[] | null | undefined,
  def: readonly R[],
  map: (src: S | undefined, def: R | undefined, i: number) => R | null,
): R[] {
  const s = Array.isArray(srcArr) ? srcArr : [];
  if (!s.some((x) => x != null)) return def as R[];
  const len = Math.max(s.length, def.length);
  const out: R[] = [];
  for (let i = 0; i < len; i++) {
    const row = map(s[i] ?? undefined, def[i], i);
    if (row != null) out.push(row);
  }
  return out;
}

/**
 * Map the `homepage` global → HomepageData, falling back PER-SECTION to
 * HOMEPAGE_DEFAULTS so an empty/partial CMS renders byte-identically. A section
 * is taken from the CMS only when its content is actually present (non-empty
 * array / set heading); otherwise the typed default is used verbatim.
 */
export function resolveHomepage(src: HomepageSource): HomepageData {
  const d = HOMEPAGE_DEFAULTS;
  if (!src) return d;

  // Resolve the section layout: take the editor's order/visibility for known
  // sections, then append any section the editor never touched (so nothing
  // silently disappears). Empty/absent CMS layout → exact canonical order.
  const known = new Set<string>(HOME_SECTIONS);
  const seen = new Set<string>();
  const layout: HomeSectionLayout[] = [];
  for (const row of src.layout ?? []) {
    const section = row?.section;
    if (!section || !known.has(section) || seen.has(section)) continue;
    seen.add(section);
    layout.push({ section: section as HomeSection, visible: row?.visible !== false });
  }
  for (const section of HOME_SECTIONS) {
    if (!seen.has(section)) layout.push({ section, visible: true });
  }

  const hero: HeroContent = src.hero?.headline
    ? {
        eyebrow: src.hero.eyebrow ?? d.hero.eyebrow,
        headline: src.hero.headline,
        headlineItalic: src.hero.headlineItalic ?? d.hero.headlineItalic,
        paragraph: src.hero.paragraph ?? d.hero.paragraph,
        badges: src.hero.badges?.length ? texts(src.hero.badges) : d.hero.badges,
        // Button labels are code-owned (their links + icons live in the
        // component), so they always come from defaults — not admin-editable.
        ctas: d.hero.ctas,
        floatingBadge: src.hero.floatingBadge ?? d.hero.floatingBadge,
        image: src.hero.image || d.hero.image,
      }
    : d.hero;

  const stats: StatItem[] = mergeList(src.stats, d.stats, (s, def) => ({
    value: s?.value ?? def?.value ?? "",
    l: s?.label ?? def?.l ?? "",
  }));

  const whyBavishi = src.whyBavishi?.cards?.length
    ? {
        eyebrow: src.whyBavishi.eyebrow ?? d.whyBavishi.eyebrow,
        heading: heading(src.whyBavishi.heading, d.whyBavishi.heading),
        subtitle: src.whyBavishi.subtitle ?? d.whyBavishi.subtitle,
        cards: mergeList(src.whyBavishi.cards, d.whyBavishi.cards, (c, def) => ({
          icon: (c?.icon ?? def?.icon ?? "Sparkles") as IconName,
          t: c?.t ?? def?.t ?? "",
          d: c?.d ?? def?.d ?? "",
        })),
      }
    : d.whyBavishi;

  const whyChoose = src.whyChoose?.blocks?.length
    ? {
        eyebrow: src.whyChoose.eyebrow ?? d.whyChoose.eyebrow,
        heading: heading(src.whyChoose.heading, d.whyChoose.heading),
        subtitle: src.whyChoose.subtitle ?? d.whyChoose.subtitle,
        blocks: mergeList(src.whyChoose.blocks, d.whyChoose.blocks, (b, def) => ({
          icon: b?.icon ?? def?.icon ?? "",
          alt: b?.alt ?? def?.alt ?? "",
          title: b?.title ?? def?.title ?? "",
          subtitle: b?.subtitle ?? def?.subtitle ?? "",
          points: mergeList(b?.points, def?.points ?? [], (p, dp) => ({
            h: p?.h ?? dp?.h ?? "",
            d: p?.d ?? dp?.d ?? "",
          })),
        })),
      }
    : d.whyChoose;

  const suraksha: SurakshaContent = src.suraksha?.heading?.lead
    ? {
        badge: src.suraksha.badge ?? d.suraksha.badge,
        heading: heading(src.suraksha.heading, d.suraksha.heading),
        paragraph: src.suraksha.paragraph ?? d.suraksha.paragraph,
        features: src.suraksha.features?.length ? texts(src.suraksha.features) : d.suraksha.features,
        primaryCta: {
          label: src.suraksha.primaryCta?.label || d.suraksha.primaryCta.label,
          href: src.suraksha.primaryCta?.href || d.suraksha.primaryCta.href,
        },
        secondaryCta: {
          label: src.suraksha.secondaryCta?.label || d.suraksha.secondaryCta.label,
          href: src.suraksha.secondaryCta?.href || d.suraksha.secondaryCta.href,
        },
        image: src.suraksha.image || d.suraksha.image,
        imageAlt: src.suraksha.imageAlt ?? d.suraksha.imageAlt,
      }
    : d.suraksha;

  const about: HomeAboutContent = src.about?.heading?.lead
    ? {
        eyebrow: src.about.eyebrow ?? d.about.eyebrow,
        heading: heading(src.about.heading, d.about.heading),
        subtitle: src.about.subtitle ?? d.about.subtitle,
        stats: mergeList(src.about.stats, d.about.stats, (s, def) => ({
          k: s?.k ?? def?.k ?? "",
          v: s?.v ?? def?.v ?? "",
        })),
        primaryCta: src.about.primaryCta || d.about.primaryCta,
        secondaryCta: src.about.secondaryCta || d.about.secondaryCta,
        sinceValue: src.about.sinceValue ?? d.about.sinceValue,
        sinceLabel: src.about.sinceLabel ?? d.about.sinceLabel,
        image: src.about.image || d.about.image,
        imageAlt: src.about.imageAlt ?? d.about.imageAlt,
      }
    : d.about;

  const awards = src.awards?.items?.length
    ? {
        eyebrow: src.awards.eyebrow ?? d.awards.eyebrow,
        heading: heading(src.awards.heading, d.awards.heading),
        subtitle: src.awards.subtitle ?? d.awards.subtitle,
        items: mergeList(src.awards.items, d.awards.items, (a, def) => ({
          img: a?.img ?? def?.img ?? "",
          title: a?.title ?? def?.title ?? "",
          desc: a?.desc ?? def?.desc ?? "",
        })),
      }
    : d.awards;

  const events = src.events?.posters?.length
    ? {
        eyebrow: src.events.eyebrow ?? d.events.eyebrow,
        heading: heading(src.events.heading, d.events.heading),
        posters: mergeList(src.events.posters, d.events.posters, (p, def) => ({
          src: p?.src ?? def?.src ?? "",
          alt: p?.alt ?? def?.alt ?? "",
        })),
      }
    : d.events;

  const videos = {
    stories: mergeList(src.videos?.stories, d.videos.stories, (s, def) => ({
      id: s?.id ?? def?.id ?? "",
      n: s?.n ?? def?.n ?? "",
      q: s?.q ?? def?.q ?? "",
      r: s?.r ?? def?.r ?? 5,
    })),
    edu: mergeList(src.videos?.edu, d.videos.edu, (v, def) => ({
      id: v?.id ?? def?.id ?? "",
      t: v?.t ?? def?.t ?? "",
      d: v?.d ?? def?.d ?? "",
    })),
    resources: mergeList(src.videos?.resources, d.videos.resources, (v, def) => ({
      id: v?.id ?? def?.id ?? "",
      c: v?.c ?? def?.c ?? "",
      t: v?.t ?? def?.t ?? "",
      date: v?.date ?? def?.date ?? "",
    })),
  };

  const faq = src.faq?.items?.length
    ? {
        eyebrow: src.faq.eyebrow ?? d.faq.eyebrow,
        heading: heading(src.faq.heading, d.faq.heading),
        items: mergeList(src.faq.items, d.faq.items, (f, def) => ({
          q: f?.q ?? def?.q ?? "",
          a: f?.a ?? def?.a ?? "",
        })),
      }
    : d.faq;

  const finalCta: FinalCtaContent = src.finalCta?.heading?.lead
    ? {
        eyebrow: src.finalCta.eyebrow ?? d.finalCta.eyebrow,
        heading: heading(src.finalCta.heading, d.finalCta.heading),
        paragraph: src.finalCta.paragraph ?? d.finalCta.paragraph,
        stats: mergeList(src.finalCta.stats, d.finalCta.stats, (s, def) => ({
          v: s?.v ?? def?.v ?? 0,
          s: s?.s ?? def?.s ?? "",
          l: s?.l ?? def?.l ?? "",
        })),
        // Button labels are code-owned — always from defaults, not admin-editable.
        ctas: d.finalCta.ctas,
      }
    : d.finalCta;

  const treatments = {
    eyebrow: src.treatments?.eyebrow ?? d.treatments.eyebrow,
    heading: heading(src.treatments?.heading, d.treatments.heading),
    subtitle: src.treatments?.subtitle ?? d.treatments.subtitle,
    ctaLabel: src.treatments?.ctaLabel || d.treatments.ctaLabel,
    items: mergeList(src.treatments?.items, d.treatments.items, (x, def) => ({
      icon: (x?.icon ?? def?.icon ?? "Sparkles") as IconName,
      t: x?.t ?? def?.t ?? "",
      d: x?.d ?? def?.d ?? "",
    })),
  };

  // Header-only sections: resolve each field against the default (no "is present"
  // gate — the header text is independent of any item array).
  const successStories = {
    eyebrow: src.successStories?.eyebrow ?? d.successStories.eyebrow,
    heading: heading(src.successStories?.heading, d.successStories.heading),
    subtitle: src.successStories?.subtitle ?? d.successStories.subtitle,
    ctaLabel: src.successStories?.ctaLabel || d.successStories.ctaLabel,
  };
  const videoHub = {
    eyebrow: src.videoHub?.eyebrow ?? d.videoHub.eyebrow,
    heading: heading(src.videoHub?.heading, d.videoHub.heading),
    subtitle: src.videoHub?.subtitle ?? d.videoHub.subtitle,
    ctaLabel: src.videoHub?.ctaLabel || d.videoHub.ctaLabel,
  };
  const doctors = {
    eyebrow: src.doctors?.eyebrow ?? d.doctors.eyebrow,
    heading: heading(src.doctors?.heading, d.doctors.heading),
    subtitle: src.doctors?.subtitle ?? d.doctors.subtitle,
    ctaLabel: src.doctors?.ctaLabel || d.doctors.ctaLabel,
  };
  const blogs = {
    eyebrow: src.blogs?.eyebrow ?? d.blogs.eyebrow,
    heading: heading(src.blogs?.heading, d.blogs.heading),
    ctaLabel: src.blogs?.ctaLabel || d.blogs.ctaLabel,
  };
  const testimonials = {
    eyebrow: src.testimonials?.eyebrow ?? d.testimonials.eyebrow,
    heading: heading(src.testimonials?.heading, d.testimonials.heading),
  };
  const media = {
    eyebrow: src.media?.eyebrow ?? d.media.eyebrow,
    heading: heading(src.media?.heading, d.media.heading),
    logos: mergeList(src.media?.logos, d.media.logos, (l, def) => ({
      src: l?.src ?? def?.src ?? "",
      alt: l?.alt ?? def?.alt ?? "",
    })),
  };
  const inquiry = {
    eyebrow: src.inquiry?.eyebrow ?? d.inquiry.eyebrow,
    heading: heading(src.inquiry?.heading, d.inquiry.heading),
    subtitle: src.inquiry?.subtitle ?? d.inquiry.subtitle,
    contacts: mergeList(src.inquiry?.contacts, d.inquiry.contacts, (c, def) => ({
      h: c?.h ?? def?.h ?? "",
      d: c?.d ?? def?.d ?? "",
    })),
  };
  const locations = {
    eyebrow: src.locations?.eyebrow ?? d.locations.eyebrow,
    heading: heading(src.locations?.heading, d.locations.heading),
    subtitle: src.locations?.subtitle ?? d.locations.subtitle,
    cities: mergeList(src.locations?.cities, d.locations.cities, (x, def) => ({
      c: x?.c ?? def?.c ?? "",
      n: x?.n ?? def?.n ?? 1,
      s: x?.s ?? def?.s ?? "",
    })),
  };
  const calculators = {
    eyebrow: src.calculators?.eyebrow ?? d.calculators.eyebrow,
    heading: heading(src.calculators?.heading, d.calculators.heading),
    subtitle: src.calculators?.subtitle ?? d.calculators.subtitle,
    items: mergeList(src.calculators?.items, d.calculators.items, (x, def) => (x?.name ?? def ?? "") || null),
  };

  // SEO meta is consumed by generateMetadata() (a server context); the ogImage
  // upload relation is resolved there, so it is intentionally NOT shaped here.
  const seo: HomepageSeo = {
    metaTitle: src.seo?.metaTitle || d.seo.metaTitle,
    metaDescription: src.seo?.metaDescription || d.seo.metaDescription,
    ogTitle: src.seo?.ogTitle || d.seo.ogTitle,
    ogDescription: src.seo?.ogDescription || d.seo.ogDescription,
    ogImage: d.seo.ogImage,
  };

  return { layout, hero, stats, whyBavishi, whyChoose, suraksha, about, treatments, awards, events, videos, faq, finalCta, successStories, videoHub, doctors, blogs, testimonials, media, inquiry, locations, calculators, seo };
}

/**
 * Build a FULLY-POPULATED homepage source for the inline editor's draft.
 *
 * The editor edits a SOURCE draft, and the CMS source is mostly empty (sections
 * render from HOMEPAGE_DEFAULTS). Editing one field then committed a sparse
 * array (e.g. `treatments.items = [{},{},{t}]`), and Saving 400'd because the
 * empty rows fail Payload's required-field validation. Seeding the draft with
 * every section/row/field already present (in SOURCE shape, filled from the
 * resolved defaults) fixes that: editing one field leaves all the others intact
 * and complete, so the POST always carries valid rows.
 *
 * Editor-only. The PUBLIC site never calls this — it resolves the raw CMS source
 * directly, so output stays byte-identical. And resolveHomepage(materialized)
 * === the same resolved data, so the live preview is unchanged.
 */
export function materializeHomepageSource(src: HomepageSource): NonNullable<HomepageSource> {
  const r = resolveHomepage(src);
  const s = (src ?? {}) as NonNullable<HomepageSource>;
  // Helpers for the few fields whose SOURCE shape differs from the resolved one.
  const t = (text: string) => ({ text });
  return {
    ...s,
    hero: {
      ...(s.hero ?? {}),
      eyebrow: r.hero.eyebrow,
      headline: r.hero.headline,
      headlineItalic: r.hero.headlineItalic,
      paragraph: r.hero.paragraph,
      badges: r.hero.badges.map(t),
      floatingBadge: r.hero.floatingBadge,
      image: r.hero.image,
    },
    stats: r.stats.map((x) => ({ value: x.value, label: x.l })),
    whyBavishi: { ...(s.whyBavishi ?? {}), eyebrow: r.whyBavishi.eyebrow, heading: r.whyBavishi.heading, subtitle: r.whyBavishi.subtitle, cards: r.whyBavishi.cards },
    whyChoose: { ...(s.whyChoose ?? {}), eyebrow: r.whyChoose.eyebrow, heading: r.whyChoose.heading, subtitle: r.whyChoose.subtitle, blocks: r.whyChoose.blocks },
    suraksha: { ...(s.suraksha ?? {}), badge: r.suraksha.badge, heading: r.suraksha.heading, paragraph: r.suraksha.paragraph, features: r.suraksha.features.map(t), primaryCta: r.suraksha.primaryCta, secondaryCta: r.suraksha.secondaryCta, image: r.suraksha.image, imageAlt: r.suraksha.imageAlt },
    about: { ...(s.about ?? {}), eyebrow: r.about.eyebrow, heading: r.about.heading, subtitle: r.about.subtitle, stats: r.about.stats, primaryCta: r.about.primaryCta, secondaryCta: r.about.secondaryCta, sinceValue: r.about.sinceValue, sinceLabel: r.about.sinceLabel, image: r.about.image, imageAlt: r.about.imageAlt },
    treatments: { ...(s.treatments ?? {}), eyebrow: r.treatments.eyebrow, heading: r.treatments.heading, subtitle: r.treatments.subtitle, ctaLabel: r.treatments.ctaLabel, items: r.treatments.items },
    awards: { ...(s.awards ?? {}), eyebrow: r.awards.eyebrow, heading: r.awards.heading, subtitle: r.awards.subtitle, items: r.awards.items },
    events: { ...(s.events ?? {}), eyebrow: r.events.eyebrow, heading: r.events.heading, posters: r.events.posters },
    videos: { ...(s.videos ?? {}), stories: r.videos.stories, edu: r.videos.edu, resources: r.videos.resources },
    successStories: { ...(s.successStories ?? {}), eyebrow: r.successStories.eyebrow, heading: r.successStories.heading, subtitle: r.successStories.subtitle, ctaLabel: r.successStories.ctaLabel },
    videoHub: { ...(s.videoHub ?? {}), eyebrow: r.videoHub.eyebrow, heading: r.videoHub.heading, subtitle: r.videoHub.subtitle, ctaLabel: r.videoHub.ctaLabel },
    doctors: { ...(s.doctors ?? {}), eyebrow: r.doctors.eyebrow, heading: r.doctors.heading, subtitle: r.doctors.subtitle, ctaLabel: r.doctors.ctaLabel },
    blogs: { ...(s.blogs ?? {}), eyebrow: r.blogs.eyebrow, heading: r.blogs.heading, ctaLabel: r.blogs.ctaLabel },
    testimonials: { ...(s.testimonials ?? {}), eyebrow: r.testimonials.eyebrow, heading: r.testimonials.heading },
    media: { ...(s.media ?? {}), eyebrow: r.media.eyebrow, heading: r.media.heading, logos: r.media.logos },
    locations: { ...(s.locations ?? {}), eyebrow: r.locations.eyebrow, heading: r.locations.heading, subtitle: r.locations.subtitle, cities: r.locations.cities },
    calculators: { ...(s.calculators ?? {}), eyebrow: r.calculators.eyebrow, heading: r.calculators.heading, subtitle: r.calculators.subtitle, items: r.calculators.items.map((name) => ({ name })) },
    inquiry: { ...(s.inquiry ?? {}), eyebrow: r.inquiry.eyebrow, heading: r.inquiry.heading, subtitle: r.inquiry.subtitle, contacts: r.inquiry.contacts },
    faq: { ...(s.faq ?? {}), eyebrow: r.faq.eyebrow, heading: r.faq.heading, items: r.faq.items },
    finalCta: { ...(s.finalCta ?? {}), eyebrow: r.finalCta.eyebrow, heading: r.finalCta.heading, paragraph: r.finalCta.paragraph, stats: r.finalCta.stats },
  } as NonNullable<HomepageSource>;
}
