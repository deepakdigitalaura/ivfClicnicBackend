/* =====================================================================
 * About-BFI resolver — maps the `about-page` global to the plain,
 * client-serialisable model the <AboutPage> sections render (Wave 4.5, Phase E).
 * ---------------------------------------------------------------------
 * The CMS `about-page` global is the source of truth for the page's STRUCTURED
 * editorial data — the hero copy, the "At a glance" / "Patient First" stat
 * grids, the legacy timeline, the trust pillars, the city network, and the
 * network/final-CTA headings + CTA labels. This module shapes the global doc
 * into `AboutData`, falling back PER-SECTION to the typed ABOUT_DEFAULTS so an
 * empty/partial/unavailable CMS renders byte-identically (same convention as
 * src/lib/homepage.ts → HOMEPAGE_DEFAULTS).
 *
 * SCOPE (Wave 4.5 Phase E, "structured-data only"): the inline-<strong> "Our
 * Story" / "Patient First" prose, every decorative <SectionHead> <em> title,
 * the hero/CTA button hrefs+icons, the JSON-LD graph, and the reused <Doctors>/
 * <AwardsCarousel> sections all stay CODE-OWNED in the component — only the
 * structured copy above becomes editable. The "15 centres / Mumbai · 6 centres"
 * marketing copy is curated (independent of CENTRES) and is preserved verbatim
 * here; do NOT reconcile it to src/lib/locations.ts.
 *
 * ICONS: trust pillars carry icon NAMES (strings), never Lucide components — so
 * the model crosses the server→client boundary as props. <AboutPage> maps names
 * → components via resolveIcon() (src/lib/icon-map). ABOUT_DEFAULTS stores names
 * directly. HEADINGS are { lead, em } text only — the component keeps its own
 * decorative <em className="…">, so markup stays byte-identical while the words
 * become editable.
 *
 * Pure module (no payload / server-only imports) — safe to bundle into the
 * client <AboutPage> (its in-browser default content).
 * ===================================================================== */
import type { IconName } from "@/lib/icon-map";

/* ---------- Resolved (serialisable) model ---------- */

/** A two-part heading: plain lead text + the decorative <em> word(s). The
 *  component supplies the per-section <em> className, so markup is unchanged. */
export type AboutHeading = { lead: string; em: string };

export type AboutHero = { eyebrow: string; headline: string; headlineItalic: string; paragraph: string; image: string };
export type StatTuple = { n: string; l: string };
export type Milestone = { y: string; t: string; d: string };
/** A trust pillar (icon carried as a curated NAME, mapped to a component in the view). */
export type TrustPillar = { icon: IconName; t: string; d: string };
export type CitySummary = { c: string; n: string };
/** A small eyebrow label + two-part heading, used by the editable section headers. */
export type AboutSectionHeading = { eyebrow: string; heading: AboutHeading };
export type AboutTextSection = AboutSectionHeading & { paragraphs: string[] };

export type AboutSeo = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
};

/** Client-ready, fully-resolved About-BFI content. */
export type AboutData = {
  hero: AboutHero;
  story: AboutTextSection;
  atAGlance: StatTuple[];
  legacy: AboutSectionHeading;
  milestones: Milestone[];
  trust: AboutSectionHeading;
  trustPillars: TrustPillar[];
  patientFirst: AboutTextSection;
  patientStats: StatTuple[];
  meetSpecialists: AboutSectionHeading & { subtitle: string };
  network: AboutSectionHeading & { subtitle: string; cities: CitySummary[] };
  finalCta: { heading: AboutHeading; ctas: string[] };
  seo: AboutSeo;
};

/**
 * Typed fallback — the exact About-BFI structured content as it shipped before
 * the CMS, so an empty `about-page` global renders byte-identically. The seeded
 * global mirrors this. NOTE the verbatim marketing copy ("15", "6 centres") —
 * curated, NOT derived from CENTRES; preserve as-is.
 */
export const ABOUT_DEFAULTS: AboutData = {
  hero: {
    eyebrow: "About Bavishi Fertility Institute — IVF Pioneers Since 1986",
    headline: "Over three decades of fertility excellence — built on hope",
    headlineItalic: "fertility excellence",
    paragraph:
      "Founded and led by the well-known experts of the Bavishi family — Dr. Himanshu Bavishi & Dr. Falguni Bavishi — all Bavishi Fertility Institute clinics offer meticulous attention of the highest order in a pleasant and avant-garde environment to make your treatment Simple, Safe, Smart and Successful.",
    image: "/assets/about-bavishi-family.png",
  },
  story: {
    eyebrow: "Our Story",
    heading: { lead: "A family's vision, an", em: "institution's legacy" },
    paragraphs: [
      "From 1986 to the present day, our rich and cultural significance has given us some of the most remarkable accomplishments a fertility clinic can achieve. Bavishi Fertility Institute was formally established by <strong style=\"color:var(--plum)\">Dr. Himanshu Bavishi</strong> and <strong style=\"color:var(--plum)\">Dr. Falguni Bavishi</strong> in Ahmedabad with a simple but powerful belief: that world-class fertility care should be within every family's reach — delivered with science, sincerity and a deeply human touch. Today, our centres perform more than 3,000 IVF cycles every year with the best results in the world.",
      "Bavishi Fertility Institute was ranked all India No. 1 in 2020 & ranked <strong style=\"color:var(--plum)\">&ldquo;Number one in western India&rdquo;</strong> for the fifth time in a row in Times of India, a national survey of fertility clinics (2016, 2017, 2018, 2019, 2020). A familial team that stands with you at every step of your fertility journey — welcoming, listening and advising patients before, during and after their journey is our priority.",
      "What began as a single clinic has grown into a multi-centre institute that pioneered IVF in India, achieved national firsts, and today welcomes the second generation of Bavishi doctors. The institute has also championed public awareness through books like 'Devna Didhela, Mangine Lidhela', 'Vismitlo', 'Aapnu Adbhut Sarjan' and 'Your Miracle in Making', and through initiatives such as the Divya Santan organisation, Jan Jagruti Abhiyan and Parivar Milan campaigns. Our values guide everything we do: <strong style=\"color:var(--plum)\">Simple, Safe, Smart and Successful</strong>.",
    ],
  },
  atAGlance: [
    { n: "Since 1986", l: "Pioneering fertility care in India" },
    { n: "30,000+", l: "Successful pregnancies" },
    { n: "3,000+", l: "IVF cycles every year" },
    { n: "14", l: "Centres across 8 cities" },
    { n: "6×", l: "National Fertility Award winner" },
  ],
  legacy: {
    eyebrow: "30+ Years of Legacy",
    heading: { lead: "Milestones that shaped", em: "Indian fertility care" },
  },
  milestones: [
    { y: "1986", t: "The foundation", d: "Establishment of a fertility practice in Ahmedabad — the seed of what would become one of India's most trusted fertility networks and the beginning of 'IVF Pioneers Since 1986'." },
    { y: "1998", t: "Bavishi Fertility Institute begins", d: "Dr. Himanshu & Dr. Falguni Bavishi establish Bavishi Fertility Institute (Test Tube Baby Clinic) in Ahmedabad. Preimplantation Genetic Diagnosis (PGD) also launched the same year — bringing advanced genetic screening to Indian fertility care from the very start." },
    { y: "2002", t: "Test Tube Baby Fair", d: "Organised 'Testtube Balakono Melavado 2004' — a landmark gathering celebrating test-tube baby families and spreading awareness about IVF across Gujarat." },
    { y: "2005", t: "Full-service fertility institute", d: "Established a comprehensive fertility institute with complete facilities in Ahmedabad." },
    { y: "2006", t: "Andrology & Endoscopy Institute", d: "Launched a dedicated Andrology and Endoscopy Institute, expanding male infertility and minimally invasive diagnostics." },
    { y: "2007", t: "Semen bank established", d: "Started Santan Semen Bank — one of the early organised semen-banking services in the region." },
    { y: "2008", t: "Expanding to Mumbai & Surat", d: "Opened offices in Mumbai and Surat, taking trusted fertility care beyond Ahmedabad for the first time." },
    { y: "2009", t: "A national first", d: "Birth of India's first baby through Vitrified Frozen Oocytes — a milestone that shaped Indian reproductive medicine." },
    { y: "2011", t: "Divya Santan & first book", d: "Founded the 'Divya Santan' organisation and published 'Devna Didhela, Mangine Lidhela' — sharing the stories of 111 test-tube-baby families." },
    { y: "2012", t: "Awareness through publishing", d: "Published 'Vismitlo' — a book on the infertility journey, problems and solutions for couples struggling to conceive." },
    { y: "2013", t: "Public awareness campaigns", d: "Launched 'Jan Jagruti Abhiyan' and 'Parivar Milan' — special awareness campaigns to support infertile couples and remove social stigma." },
    { y: "2014", t: "INSTAR founded", d: "Founded INSTAR (Indian Society of Third Party Assisted Reproduction) — advancing ethical standards in donor and surrogacy programmes." },
    { y: "2015", t: "Power Brand Award", d: "Recognised as a 'Power Brand' by IVF India — a testament to the institute's growing national reputation." },
    { y: "2017", t: "National & international recognition", d: "Received the 'Excellence in IVF' award (My FM / Divya Bhaskar Group — Ahmedabad Institute was the first to receive it), the 'Rose of Paracelsus' award (European Medical Association), the IMA Gujarat 'Excellence in the Field of Medicine' award (Dr. Himanshu Bavishi — first IVF graduate recipient), and the Gujarat Chief Minister's 'Shreshtha' award to Dr. Himanshu & Dr. Falguni Bavishi for contributions to infertility treatment. Also published 'Aapnu Adbhut Sarjan' (Gujarati) and 'Your Miracle in Making' (English)." },
    { y: "2018", t: "Surat centre & national awards", d: "Started the Surat centre. Received 'Best IVF Clinic Chain in India' (Mid-Day) and 'Times Health Icon' award. The book 'Devna Didhela Mangine Lidhela' was adapted into a TV serial on infertility awareness." },
    { y: "2019", t: "Best IVF Chain — West", d: "Awarded 'Best IVF Chain in India – West' by The Economic Times. Expanded to Vadodara." },
    { y: "2020", t: "India's No.1 Fertility Clinic", d: "Ranked No.1 in India by Times of India National Survey. No.1 in Western India for five consecutive years (2016–2020). Expanded to Bhuj." },
    { y: "2021", t: "PGD-HLA Matching breakthrough", d: "Introduced PGD-HLA Matching technology for stem-cell donor matching and leukemia treatment support — a highly specialised capability available in very few centres worldwide." },
    { y: "2022", t: "New Ahmedabad centre", d: "Opened a new centre at Sindhu Bhavan Road, Bodakdev, Ahmedabad — bringing world-class fertility care to the west side of the city." },
    { y: "2023", t: "25 years completed", d: "Celebrated 25 years of completing families — a quarter century of pioneering IVF, national firsts, and 30,000+ successful pregnancies." },
    { y: "2024", t: "IVF Chain of the Year — West", d: "Received the 'IVF / Fertility Chain of the Year – West' award for the fourth time." },
    { y: "2025", t: "Nikol, Ahmedabad", d: "Opened the Nikol centre in east Ahmedabad — making expert fertility care accessible across the city." },
    { y: "2026", t: "National Fertility Award — 6th time", d: "Received the 'Best IVF Chain in India – West' award by The Economic Times for the sixth consecutive year — reinforcing Bavishi Fertility Institute's position as the nation's most trusted fertility network." },
    { y: "Today", t: "14 centres, one family", d: "30,000+ successful pregnancies, 3,000+ IVF cycles every year, and Class 1000 embryology labs across 8 Indian cities." },
  ],
  trust: {
    eyebrow: "Why Bavishi Fertility Center",
    heading: { lead: "Why families across India", em: "trust Bavishi Fertility Institute" },
  },
  trustPillars: [
    { icon: "Award", t: "30+ Years of Experience", d: "Since 1998, a family-led institute that pioneered IVF in India and has guided 30,000+ families to parenthood." },
    { icon: "HeartPulse", t: "Outcomes That Matter", d: "3,000+ IVF cycles a year with a focus on safe stimulation, best-quality embryos and healthy single pregnancies." },
    { icon: "Users", t: "A Family of Specialists", d: "Gynaecologists, obstetricians, embryologists, psychologists, nutritionists, consultants, coordinators and managers — exclusively dedicated to resolving patients' issues and treating them. Shared infrastructure with more than 35+ years of experience." },
    { icon: "Microscope", t: "World-Class Technology", d: "Class 1000 IVF labs — 10× cleaner than the international standard — with time-lapse imaging, vitrification and PGT." },
    { icon: "ShieldCheck", t: "Transparency & Ethics", d: "Honest counselling, no hidden costs, double-witnessing of every sample, and the Suraksha Kavach assurance." },
    { icon: "Sparkles", t: "Simple · Safe · Smart · Successful", d: "When you choose Bavishi Fertility Institute, your choice is right. Only the most innovative and experienced fertility clinics can make complex IVF treatment simple, safe, smart and successful — and that's our 'EASY IVF'." },
  ],
  patientFirst: {
    eyebrow: "Patient First",
    heading: { lead: "More than treatment —", em: "a community of hope" },
    paragraphs: [
      "Fertility is a deeply personal journey, and no two stories are the same. Beyond advanced laboratories and protocols, what truly sets Bavishi Fertility Institute apart is how we walk beside you — with patience, transparency and genuine care at every step.",
      "Through emotional counselling, nutrition guidance and our patient support community, families never feel alone. And with the <strong style=\"color:var(--plum)\">Suraksha Kavach</strong> assurance, you can focus on what matters most — your journey to your baby.",
    ],
  },
  patientStats: [
    { n: "30,000+", l: "Happy families" },
    { n: "30+", l: "Years of fertility expertise" },
    { n: "300+", l: "International patients a year" },
    { n: "8", l: "Cities, one standard of care" },
  ],
  meetSpecialists: {
    eyebrow: "Meet the Specialists",
    heading: { lead: "Meet Our", em: "Promoter Doctors." },
    subtitle: "A family of fertility experts trusted by generations.",
  },
  network: {
    eyebrow: "Our Network",
    heading: { lead: "14 centres across", em: "8 Indian cities" },
    subtitle: "World-class fertility care, close to home — wherever you are.",
    cities: [
      { c: "Ahmedabad", n: "3 centres" }, { c: "Mumbai", n: "5 centres" },
      { c: "Vadodara", n: "1 centre" }, { c: "Surat", n: "1 centre" },
      { c: "Bhuj", n: "1 centre" }, { c: "Bhavnagar", n: "1 centre" },
      { c: "Anand", n: "1 centre" }, { c: "Varanasi", n: "1 centre" },
    ],
  },
  finalCta: {
    heading: { lead: "Begin your journey with", em: "people who care." },
    ctas: ["Book Free Consultation", "WhatsApp Us"],
  },
  seo: {
    metaTitle: "About Bavishi Fertility Institute — 30+ Years of IVF Excellence in India",
    metaDescription:
      "Founded in 1998 by Dr. Himanshu & Dr. Falguni Bavishi, Bavishi Fertility Institute has guided 30,000+ families to parenthood across 14 centres. Discover our story, legacy and values.",
    ogTitle: "About Bavishi Fertility Institute — India's Trusted IVF Legacy Since 1998",
    ogDescription:
      "30,000+ pregnancies. 14 centres across 8 cities. National Fertility Award 6 years running. The story of India's pioneering fertility institute.",
    ogImage: "/assets/about-clinic.jpg",
  },
};

/* =====================================================================
 * CMS source shape (kept loose so it stays decoupled from the generated
 * payload-types, same convention as HomepageSource / ServiceSource).
 * ===================================================================== */
type HeadingSource = { lead?: string | null; em?: string | null } | null | undefined;
type StatSource = { value?: string | null; label?: string | null };

export type AboutSource =
  | {
      hero?: {
        eyebrow?: string | null;
        headline?: string | null;
        headlineItalic?: string | null;
        paragraph?: string | null;
        image?: string | null;
      } | null;
      story?: {
        eyebrow?: string | null;
        heading?: HeadingSource;
        paragraphs?: { value?: string | null }[] | null;
      } | null;
      atAGlance?: StatSource[] | null;
      legacy?: { eyebrow?: string | null; heading?: HeadingSource } | null;
      milestones?: { y?: string | null; t?: string | null; d?: string | null }[] | null;
      trust?: { eyebrow?: string | null; heading?: HeadingSource } | null;
      trustPillars?: { icon?: string | null; t?: string | null; d?: string | null }[] | null;
      patientFirst?: {
        eyebrow?: string | null;
        heading?: HeadingSource;
        paragraphs?: { value?: string | null }[] | null;
      } | null;
      patientStats?: StatSource[] | null;
      meetSpecialists?: {
        eyebrow?: string | null;
        heading?: HeadingSource;
        subtitle?: string | null;
      } | null;
      network?: {
        eyebrow?: string | null;
        heading?: HeadingSource;
        subtitle?: string | null;
        cities?: { c?: string | null; n?: string | null }[] | null;
      } | null;
      finalCta?: {
        heading?: HeadingSource;
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

/* ---------- Small helpers (mirror src/lib/homepage.ts) ---------- */
const heading = (h: HeadingSource, def: AboutHeading): AboutHeading =>
  h?.lead ? { lead: h.lead, em: h.em ?? "" } : def;
const stats = (a: StatSource[] | null | undefined): StatTuple[] =>
  (a ?? []).map((s) => ({ n: s.value ?? "", l: s.label ?? "" }));

/**
 * Map the `about-page` global → AboutData, falling back PER-SECTION to
 * ABOUT_DEFAULTS so an empty/partial CMS renders byte-identically. A section is
 * taken from the CMS only when its content is actually present (non-empty array
 * / set heading); otherwise the typed default is used verbatim. SEO meta is
 * consumed by generateMetadata() (a server context) where the ogImage upload
 * relation is resolved, so ogImage here always carries the default string.
 */
export function resolveAbout(src: AboutSource): AboutData {
  const d = ABOUT_DEFAULTS;
  if (!src) return d;

  const hero: AboutHero = src.hero?.headline
    ? {
        eyebrow: src.hero.eyebrow ?? d.hero.eyebrow,
        headline: src.hero.headline,
        headlineItalic: src.hero.headlineItalic ?? d.hero.headlineItalic,
        paragraph: src.hero.paragraph ?? d.hero.paragraph,
        image: src.hero.image || d.hero.image,
      }
    : { ...d.hero, image: src.hero?.image || d.hero.image };

  const story: AboutTextSection = src.story?.heading?.lead
    ? {
        eyebrow: src.story.eyebrow ?? d.story.eyebrow,
        heading: heading(src.story.heading, d.story.heading),
        paragraphs: src.story.paragraphs?.length ? src.story.paragraphs.map((p) => p.value ?? "") : d.story.paragraphs,
      }
    : d.story;

  const atAGlance = src.atAGlance?.length ? stats(src.atAGlance) : d.atAGlance;
  const legacy: AboutSectionHeading = src.legacy?.heading?.lead
    ? { eyebrow: src.legacy.eyebrow ?? d.legacy.eyebrow, heading: heading(src.legacy.heading, d.legacy.heading) }
    : d.legacy;
  const milestones = src.milestones?.length
    ? src.milestones.map((m) => ({ y: m.y ?? "", t: m.t ?? "", d: m.d ?? "" }))
    : d.milestones;
  const trust: AboutSectionHeading = src.trust?.heading?.lead
    ? { eyebrow: src.trust.eyebrow ?? d.trust.eyebrow, heading: heading(src.trust.heading, d.trust.heading) }
    : d.trust;
  const trustPillars = src.trustPillars?.length
    ? src.trustPillars.map((p) => ({ icon: (p.icon ?? "Sparkles") as IconName, t: p.t ?? "", d: p.d ?? "" }))
    : d.trustPillars;
  const patientFirst: AboutTextSection = src.patientFirst?.heading?.lead
    ? {
        eyebrow: src.patientFirst.eyebrow ?? d.patientFirst.eyebrow,
        heading: heading(src.patientFirst.heading, d.patientFirst.heading),
        paragraphs: src.patientFirst.paragraphs?.length ? src.patientFirst.paragraphs.map((p) => p.value ?? "") : d.patientFirst.paragraphs,
      }
    : d.patientFirst;
  const patientStats = src.patientStats?.length ? stats(src.patientStats) : d.patientStats;

  const meetSpecialists: AboutSectionHeading & { subtitle: string } = src.meetSpecialists?.heading?.lead
    ? {
        eyebrow: src.meetSpecialists.eyebrow ?? d.meetSpecialists.eyebrow,
        heading: heading(src.meetSpecialists.heading, d.meetSpecialists.heading),
        subtitle: src.meetSpecialists.subtitle ?? d.meetSpecialists.subtitle,
      }
    : d.meetSpecialists;

  const network = src.network?.cities?.length
    ? {
        eyebrow: src.network.eyebrow ?? d.network.eyebrow,
        heading: heading(src.network.heading, d.network.heading),
        subtitle: src.network.subtitle ?? d.network.subtitle,
        cities: src.network.cities.map((c) => ({ c: c.c ?? "", n: c.n ?? "" })),
      }
    : { ...d.network, eyebrow: src.network?.eyebrow ?? d.network.eyebrow };

  const finalCta = src.finalCta?.heading?.lead
    ? {
        heading: heading(src.finalCta.heading, d.finalCta.heading),
        // Button labels are code-owned — always from defaults, not admin-editable.
        ctas: d.finalCta.ctas,
      }
    : d.finalCta;

  const seo: AboutSeo = {
    metaTitle: src.seo?.metaTitle || d.seo.metaTitle,
    metaDescription: src.seo?.metaDescription || d.seo.metaDescription,
    ogTitle: src.seo?.ogTitle || d.seo.ogTitle,
    ogDescription: src.seo?.ogDescription || d.seo.ogDescription,
    ogImage: d.seo.ogImage,
  };

  return { hero, story, atAGlance, legacy, milestones, trust, trustPillars, patientFirst, patientStats, meetSpecialists, network, finalCta, seo };
}

/**
 * Produce a fully-populated AboutSource by merging `src` with the resolved
 * (default-overlaid) content. Used by the inline editor to seed the draft so
 * every section/row/field is present before any edit — prevents sparse POST
 * bodies (mirrors materializeHomepageSource / materializeServiceSource).
 */
export function materializeAboutSource(src: AboutSource): NonNullable<AboutSource> {
  const r = resolveAbout(src);
  const s = (src ?? {}) as NonNullable<AboutSource>;
  const stat = (t: StatTuple) => ({ value: t.n, label: t.l });
  return {
    ...s,
    hero: {
      eyebrow: r.hero.eyebrow,
      headline: r.hero.headline,
      headlineItalic: r.hero.headlineItalic,
      paragraph: r.hero.paragraph,
      image: r.hero.image,
    },
    story: {
      eyebrow: r.story.eyebrow,
      heading: { lead: r.story.heading.lead, em: r.story.heading.em },
      paragraphs: r.story.paragraphs.map((value) => ({ value })),
    },
    atAGlance: r.atAGlance.map(stat),
    legacy: { eyebrow: r.legacy.eyebrow, heading: { lead: r.legacy.heading.lead, em: r.legacy.heading.em } },
    milestones: r.milestones.map((m) => ({ y: m.y, t: m.t, d: m.d })),
    trust: { eyebrow: r.trust.eyebrow, heading: { lead: r.trust.heading.lead, em: r.trust.heading.em } },
    trustPillars: r.trustPillars.map((p) => ({ icon: p.icon, t: p.t, d: p.d })),
    patientFirst: {
      eyebrow: r.patientFirst.eyebrow,
      heading: { lead: r.patientFirst.heading.lead, em: r.patientFirst.heading.em },
      paragraphs: r.patientFirst.paragraphs.map((value) => ({ value })),
    },
    patientStats: r.patientStats.map(stat),
    meetSpecialists: {
      eyebrow: r.meetSpecialists.eyebrow,
      heading: { lead: r.meetSpecialists.heading.lead, em: r.meetSpecialists.heading.em },
      subtitle: r.meetSpecialists.subtitle,
    },
    network: {
      eyebrow: r.network.eyebrow,
      heading: { lead: r.network.heading.lead, em: r.network.heading.em },
      subtitle: r.network.subtitle,
      cities: r.network.cities.map((c) => ({ c: c.c, n: c.n })),
    },
    finalCta: {
      heading: { lead: r.finalCta.heading.lead, em: r.finalCta.heading.em },
    },
    seo: {
      metaTitle: r.seo.metaTitle,
      metaDescription: r.seo.metaDescription,
      ogTitle: r.seo.ogTitle,
      ogDescription: r.seo.ogDescription,
      ...(s.seo?.ogImage != null ? { ogImage: s.seo.ogImage } : {}),
    },
  };
}
