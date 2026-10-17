/* =====================================================================
 * Why BFI page resolver — maps the `whyBfiPage` singleton to the plain,
 * client-serialisable model <WhyBfiPage> renders. Same convention as
 * src/lib/suraksha-kavach.ts: PER-SECTION fallback to the typed
 * WHY_BFI_DEFAULTS so an empty/partial doc renders byte-identically.
 *
 * SCOPE: hero, stats, the 12 "reasons" cards, the nested journey timeline
 * (5 eras, each with year-entries, each with bullet items), and the 4
 * ethics cards are all editable. The two decorative banner sections
 * ("Lab & Safety" and "Promise Banner") stay code-owned — they repeat
 * copy that's already editable elsewhere on this page (infrastructure/
 * ethics) rather than introducing net-new structured content.
 *
 * ICONS: reasons/ethics/journey entries carry icon NAMES (strings), mapped
 * to Lucide components in the view via resolveIcon().
 *
 * Pure module (no server-only imports) — safe to bundle into the client
 * <WhyBfiPage> component.
 * ===================================================================== */
import type { IconName } from "@/lib/icon-map";

export type WBHero = { eyebrow: string; headline: string; headlineEm: string; quote: string; quoteFooter: string };
export type WBStat = { value: number; suffix: string; label: string; sub: string };
export type WBReason = { icon: IconName; title: string; description: string };
export type WBJourneyEntry = { year: string; icon: IconName; items: string[] };
export type WBJourneyEra = { era: string; eraLabel: string; entries: WBJourneyEntry[] };
export type WBEthic = { icon: IconName; title: string; description: string };

export type WhyBfiData = {
  hero: WBHero;
  stats: WBStat[];
  reasons: WBReason[];
  journey: WBJourneyEra[];
  ethics: WBEthic[];
};

export const WHY_BFI_DEFAULTS: WhyBfiData = {
  hero: {
    eyebrow: "India's No. 1 Fertility Clinic",
    headline: "Why Choose Bavishi Fertility Institute?",
    headlineEm: "Bavishi Fertility Institute?",
    quote: "The right treatment at the right time at the right place in the right numbers can almost always bring success.",
    quoteFooter: "Bavishi Fertility Institute",
  },
  stats: [
    { value: 30000, suffix: "+", label: "Successful Pregnancies", sub: "and counting" },
    { value: 25, suffix: "+", label: "Years of Trust", sub: "pioneering IVF since 1998" },
    { value: 14, suffix: "", label: "Centres", sub: "across 8 cities in India" },
    { value: 1998, suffix: "", label: "Est.", sub: "pioneering fertility care" },
  ],
  reasons: [
    { icon: "Award", title: "Pioneers Since 1998", description: "Working in women's health since 1990 and pioneering ART/IVF in India since 1998, in collaboration with the Diamond Institute, USA. Ranked No. 1 fertility clinic in All India." },
    { icon: "Baby", title: "30,000+ Successful Pregnancies", description: "Over 30,000 happy families and counting. Thousands of couples who entrusted us with their dream have welcomed healthy babies through our proven protocols." },
    { icon: "Lightbulb", title: "Path-Breaking Innovations", description: "India's first live birth with frozen eggs, first international surrogacy, first Suraksha Kavach program — we don't follow trends, we set them." },
    { icon: "Sparkles", title: "Personalization & Customization", description: "One size doesn't fit all. Every protocol is highly customised to your unique physiology. We offer 365-day, 24/7 service because fertility doesn't follow a calendar." },
    { icon: "Shield", title: "Ethics — Your Eggs, Your Sperm", description: "Fully dedicated to ethical practice. Your eggs and your sperm are guaranteed — we follow a strict code of Availability, Adequacy, Affordability, and Adaptability." },
    { icon: "Building2", title: "All Under One Roof", description: "A true one-stop clinic: surgeries, IUI, IVF, ICSI, laser-assisted hatching, PGT, donor services, surrogacy, and counselling — everything you need, in one place." },
    { icon: "Stethoscope", title: "Expert Team", description: "Experienced infertility gynaecologists, internationally accredited embryologists, and competent midwives — a multidisciplinary team dedicated to your success." },
    { icon: "Eye", title: "Honest & Transparent", description: "We discuss pros and cons openly, share realistic success expectations, and are completely transparent about costs — no hidden charges, no surprises." },
    { icon: "HeartHandshake", title: "Counselling & Hand-Holding", description: "Thorough counselling at every step. Emotional support, psychological guidance, and a compassionate team that holds your hand through the entire journey." },
    { icon: "FlaskConical", title: "Class 1000 IVF Labs", description: "Our labs maintain 10× superior air quality to the international Class 10,000 standard — protecting your embryos with the purest environment possible." },
    { icon: "Heart", title: "OHSS-Free Clinic", description: "Zero cases of severe Ovarian Hyperstimulation Syndrome for over 10 years. Our protocols are designed for safety as much as success." },
    { icon: "Scale", title: "Value-Based Services", description: "High-quality treatment at affordable prices. Economy of scale across 14 centres means we offer a range of packages without compromising on care." },
  ],
  journey: [
    {
      era: "1990 – 2001", eraLabel: "Foundations",
      entries: [
        { year: "1990", icon: "Building2", items: ["Established our women's health & gynaecology hospital — the foundation Bavishi Fertility Institute would grow from."] },
        { year: "1998", icon: "FlaskConical", items: ["Pioneered ART/IVF in India, launching our test-tube baby clinic in collaboration with the Diamond Institute, USA."] },
      ],
    },
    {
      era: "2002 – 2013", eraLabel: "Pioneering & Growth",
      entries: [
        { year: "2002", icon: "Microscope", items: ["Introduced Preimplantation Genetic Diagnosis (PGD) in India."] },
        { year: "2004", icon: "Users", items: ["Hosted the “Test Tube Baby Reunion – 2004,” bringing together IVF families from across the country."] },
        { year: "2005", icon: "Building2", items: ["Opened a large, fully-equipped, state-of-the-art fertility institute."] },
        { year: "2006", icon: "Star", items: ["Established the Endoscopy Excellence Institute.", "Launched India's first international surrogacy program."] },
        { year: "2007", icon: "HeartHandshake", items: ["Launched Santan Semen Bank, our dedicated sperm bank."] },
        { year: "2008", icon: "MapPin", items: ["Expanded with new offices in Mumbai and Surat."] },
        { year: "2009", icon: "Baby", items: ["India's first baby born from vitrified (frozen) eggs — a landmark first for Indian fertility medicine."] },
        { year: "2010", icon: "MapPin", items: ["Began operations in Mumbai (Bavishi Fertility Institute) and Delhi (Bavishi Bhagat Fertility Institute).", "Launched Suraksha Kavach — the world's only IVF protection program."] },
        { year: "2011", icon: "BookOpen", items: ["Founded the “Divya Santan” organisation and published “Devna Didhela, Mangine Lidhela,” chronicling the journeys of 111 IVF families."] },
        { year: "2012", icon: "BookOpen", items: ["Published “Vighnahod,” addressing the real struggles and solutions faced by childless couples."] },
        { year: "2013", icon: "HandHeart", items: ["Launched the “Jan Jagruti Abhiyan” awareness campaign and “Parivar Milan” initiative to support childless couples; translated both books into Hindi."] },
      ],
    },
    {
      era: "2014 – 2020", eraLabel: "National Recognition",
      entries: [
        { year: "2014", icon: "Microscope", items: ["Founded the Indian Society for Third-Party Assisted Reproduction (INSTAR).", "Introduced PGT (Preimplantation Genetic Testing) across all centres."] },
        { year: "2015", icon: "Trophy", items: ["Named a “Power Brand” by IVF India (India Today Group)."] },
        { year: "2016", icon: "MapPin", items: ["Established Bavishi Pratiksha Fertility Institute in Kolkata."] },
        { year: "2017", icon: "Award", items: ["Won the “Excellence in IVF” award from My FM.", "Received the “Rose of Paracelsus” award from the European Medical Association.", "Published “Aapnu Adbhut Sarjan” (Gujarati) and “Your Miracle in Making” (English) for expectant mothers."] },
        { year: "2018", icon: "Award", items: ["Opened in Surat.", "“Devna Didhela Mangine Lidhela” adapted into a TV serial.", "Awarded “Best IVF Clinic Chain in India” by Midday.", "Achieved 30,000+ successful pregnancies milestone."] },
        { year: "2019", icon: "Trophy", items: ["Awarded “Best IVF Chain in India – West” by The Economic Times.", "Opened in Vadodara."] },
        { year: "2020", icon: "Star", items: ["Ranked the #1 fertility clinic in All India by the Times of India National Survey.", "Ranked #1 in West India for the 5th consecutive year running (2016–2020).", "Opened in Bhuj."] },
      ],
    },
    {
      era: "2021 – 2025", eraLabel: "Innovation & Expansion",
      entries: [
        { year: "2021", icon: "HeartHandshake", items: ["Achieved 3 successful bone-marrow transplants for thalassemia major using PGD-HLA donor-sibling matching — among only a handful of such cases worldwide."] },
        { year: "2022", icon: "MapPin", items: ["Opened a new clinic on Sindhu Bhavan Road, Bodakdev, Ahmedabad.", "Expanded to 14 centres across 8 cities in India."] },
        { year: "2023", icon: "Sparkles", items: ["Celebrated 25 years of Bavishi Fertility Institute."] },
        { year: "2024", icon: "Trophy", items: ["Won “IVF/Fertility Chain of the Year – West” for the fourth time."] },
        { year: "2025", icon: "MapPin", items: ["Opened a new centre in Nikol, Ahmedabad."] },
      ],
    },
  ],
  ethics: [
    { icon: "CheckCircle2", title: "Availability", description: "365/24/7 service. Your fertility journey doesn't follow office hours — neither do we." },
    { icon: "CheckCircle2", title: "Adequacy", description: "Complete, thorough care from diagnosis to delivery. No shortcuts, no half-measures." },
    { icon: "CheckCircle2", title: "Affordability", description: "World-class IVF treatment at honest prices. Multiple package options to suit every budget." },
    { icon: "CheckCircle2", title: "Adaptability", description: "Every protocol, every plan, every decision is adapted to your unique medical and personal needs." },
  ],
};

export type WhyBfiSource =
  | {
      hero?: { eyebrow?: string; headline?: string; headlineEm?: string; quote?: string; quoteFooter?: string } | null;
      stats?: { value?: number; suffix?: string; label?: string; sub?: string }[] | null;
      reasons?: { icon?: string; title?: string; description?: string }[] | null;
      journey?: { era?: string; eraLabel?: string; entries?: { year?: string; icon?: string; items?: { value?: string }[] }[] }[] | null;
      ethics?: { icon?: string; title?: string; description?: string }[] | null;
    }
  | null
  | undefined;

export function resolveWhyBfi(src: WhyBfiSource): WhyBfiData {
  const d = WHY_BFI_DEFAULTS;
  if (!src) return d;

  const hero: WBHero = src.hero?.headline
    ? {
        eyebrow: src.hero.eyebrow ?? d.hero.eyebrow,
        headline: src.hero.headline,
        headlineEm: src.hero.headlineEm ?? d.hero.headlineEm,
        quote: src.hero.quote ?? d.hero.quote,
        quoteFooter: src.hero.quoteFooter ?? d.hero.quoteFooter,
      }
    : d.hero;

  const stats = src.stats?.length ? src.stats.map((s) => ({ value: s.value ?? 0, suffix: s.suffix ?? "", label: s.label ?? "", sub: s.sub ?? "" })) : d.stats;
  const reasons = src.reasons?.length
    ? src.reasons.map((r) => ({ icon: (r.icon ?? "Sparkles") as IconName, title: r.title ?? "", description: r.description ?? "" }))
    : d.reasons;
  const ethics = src.ethics?.length
    ? src.ethics.map((e) => ({ icon: (e.icon ?? "CheckCircle2") as IconName, title: e.title ?? "", description: e.description ?? "" }))
    : d.ethics;

  const journey: WBJourneyEra[] = src.journey?.length
    ? src.journey.map((era) => ({
        era: era.era ?? "",
        eraLabel: era.eraLabel ?? "",
        entries: (era.entries ?? []).map((e) => ({
          year: e.year ?? "",
          icon: (e.icon ?? "Sparkles") as IconName,
          items: (e.items ?? []).map((it) => it.value ?? "").filter(Boolean),
        })),
      }))
    : d.journey;

  return { hero, stats, reasons, journey, ethics };
}

export function materializeWhyBfiSource(src: WhyBfiSource): NonNullable<WhyBfiSource> {
  const r = resolveWhyBfi(src);
  const s = (src ?? {}) as NonNullable<WhyBfiSource>;
  return {
    ...s,
    hero: r.hero,
    stats: r.stats,
    reasons: r.reasons,
    ethics: r.ethics,
    journey: r.journey.map((era) => ({
      era: era.era,
      eraLabel: era.eraLabel,
      entries: era.entries.map((e) => ({ year: e.year, icon: e.icon, items: e.items.map((value) => ({ value })) })),
    })),
  };
}
