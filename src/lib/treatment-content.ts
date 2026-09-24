/* =====================================================================
 * Treatments resolver — maps a `treatments` collection doc to the plain,
 * client-serialisable model the <TreatmentPage> template renders, and that
 * treatmentGraph() turns into JSON-LD (Wave 4.4).
 * ---------------------------------------------------------------------
 * Mirrors src/lib/services.ts exactly. The CMS `treatments` collection holds
 * the per-page CONTENT; this module shapes a doc into `ResolvedTreatment`,
 * falling back PER-SECTION to the typed code defaults in src/lib/treatments.ts
 * (`treatmentBySlug`/`TREATMENTS`) so an empty/unavailable CMS renders
 * byte-identically (same convention as footer/header/services).
 *
 * REGISTRY STAYS CODE-OWNED (Wave 4.4 constraint #1): TREATMENTS_REGISTRY,
 * TREATMENT_CARD_META, treatmentCardData() and treatmentRef() are NOT sourced
 * from the CMS — only the Treatment page objects are. The related-treatment
 * cross-links therefore stay plain slug strings here (the template still calls
 * treatmentCardData() on them), so doctor/location/blog/menu integrations carry
 * zero blast radius.
 *
 * ICONS: the resolved model carries icon NAMES (strings), never Lucide
 * components — so it crosses the server→client boundary as props. The template
 * maps names → components via ICON_MAP (src/lib/icon-map.ts). The code defaults
 * still hold real components, so toResolved() serialises them via iconKey().
 *
 * Pure module (no payload / server-only imports) — safe to bundle into the
 * client <TreatmentPage> (used as the in-browser fallback when no props arrive).
 * ===================================================================== */
import { iconKey, type IconName } from "@/lib/icon-map";
import { treatmentBySlug, type Treatment, type Heading } from "@/lib/treatments";
import { mediaUrl, type UploadValue } from "@/fields/image";
import { testimonialsForTreatment, type VideoTestimonial } from "@/lib/video-testimonials";
import { pickLocale, type Locale, type LocalizedField } from "@/lib/i18n";

/* ---------- Resolved (serialisable) model — mirrors Treatment 1:1, with the
 * Lucide component fields replaced by icon NAMES. ---------- */
export type ResolvedIconCard = { icon: IconName; t: string; d: string; href?: string };
export type ResolvedStep = { icon: IconName; n: string; t: string; d: string };

export type ResolvedTreatment = {
  slug: string;
  href: string;
  name: string;
  shortName: string;
  alternateName?: string;
  breadcrumbName: string;
  meta: { title: string; description: string; ogTitle?: string; ogDescription?: string; ogImage: string };
  procedure: { procedureType?: string; bodyLocation?: string; howPerformed?: string; followup?: string };
  lastReviewed: string;
  reviewerSlug: string;
  hero: { eyebrow: string; h1: string; h1Em: string; tagline: string; badges: string[]; image: string; imageAlt: string };
  whatIs: { heading: Heading; paragraphs: string[]; aside?: { title: string; body: string } };
  benefits: { heading: Heading; subtitle?: string; items: string[] };
  types?: { heading: Heading; subtitle?: string; items: ResolvedIconCard[] };
  whoNeedsIt: { heading: Heading; subtitle?: string; items: string[] };
  process: { heading: Heading; subtitle?: string; steps: ResolvedStep[]; note?: string };
  timeline?: { heading: Heading; subtitle?: string; items: { day: string; t: string; d: string }[]; chips?: string[]; chipsNote?: string };
  video?: { id: string; title: string; description: string; eyebrow: string; heading: Heading };
  technology?: { heading: Heading; eyebrow?: string; subtitle?: string; items: ResolvedIconCard[] };
  whyUs?: { heading: Heading; items: ResolvedIconCard[] };
  success: { factors: string[]; note?: string; heading: string; description: string; callout: string };
  cost: { includes: string[]; heading: string; description: string };
  patientStories: { heading: Heading; subtitle: string };
  specialists: { heading: Heading; subtitle: string };
  faqsSection: Heading;
  relatedSection: Heading;
  blogSection: { heading: Heading; subtitle: string };
  labels: {
    whatIs: string; benefits: string; types: string; whoNeedsIt: string; process: string;
    timeline: string; whyUs: string; successCard: string; costCard: string;
    successFactors: string; risks: string; preparation: string; patientStories: string;
    specialists: string; faq: string; exploreMore: string; blog: string;
  };
  risks: { heading: Heading; subtitle?: string; items: { t: string; d: string; help: string }[] };
  preparation?: { heading: Heading; subtitle?: string; items: string[] };
  faqs: { q: string; a: string }[];
  related: string[];
  cta: { heading: string; headingEm: string; subtitle?: string };
};

/** Serialise a typed code default (icon components → names) into the resolved
 *  model. This is the byte-identical fallback path AND the canonical shape the
 *  round-trip parity gate compares against. */
export function toResolved(t: Treatment): ResolvedTreatment {
  return {
    slug: t.slug,
    href: t.href,
    name: t.name,
    shortName: t.shortName,
    ...(t.alternateName ? { alternateName: t.alternateName } : {}),
    breadcrumbName: t.breadcrumbName,
    meta: { title: t.meta.title, description: t.meta.description, ogTitle: t.meta.ogTitle, ogDescription: t.meta.ogDescription, ogImage: t.meta.ogImage },
    procedure: {
      ...(t.procedure.procedureType ? { procedureType: t.procedure.procedureType } : {}),
      ...(t.procedure.bodyLocation ? { bodyLocation: t.procedure.bodyLocation } : {}),
      ...(t.procedure.howPerformed ? { howPerformed: t.procedure.howPerformed } : {}),
      ...(t.procedure.followup ? { followup: t.procedure.followup } : {}),
    },
    lastReviewed: t.lastReviewed,
    reviewerSlug: t.reviewerSlug,
    hero: { ...t.hero, badges: [...t.hero.badges] },
    whatIs: {
      heading: t.whatIs.heading,
      paragraphs: [...t.whatIs.paragraphs],
      ...(t.whatIs.aside ? { aside: { title: t.whatIs.aside.title, body: t.whatIs.aside.body } } : {}),
    },
    benefits: { heading: t.benefits.heading, ...(t.benefits.subtitle ? { subtitle: t.benefits.subtitle } : {}), items: [...t.benefits.items] },
    ...(t.types
      ? {
          types: {
            heading: t.types.heading,
            ...(t.types.subtitle ? { subtitle: t.types.subtitle } : {}),
            items: t.types.items.map((x) => ({ icon: iconKey(x.icon), t: x.t, d: x.d, ...(x.href ? { href: x.href } : {}) })),
          },
        }
      : {}),
    whoNeedsIt: { heading: t.whoNeedsIt.heading, ...(t.whoNeedsIt.subtitle ? { subtitle: t.whoNeedsIt.subtitle } : {}), items: [...t.whoNeedsIt.items] },
    process: {
      heading: t.process.heading,
      ...(t.process.subtitle ? { subtitle: t.process.subtitle } : {}),
      steps: t.process.steps.map((s) => ({ icon: iconKey(s.icon), n: s.n, t: s.t, d: s.d })),
      ...(t.process.note ? { note: t.process.note } : {}),
    },
    ...(t.timeline
      ? {
          timeline: {
            heading: t.timeline.heading,
            ...(t.timeline.subtitle ? { subtitle: t.timeline.subtitle } : {}),
            items: t.timeline.items.map((i) => ({ day: i.day, t: i.t, d: i.d })),
            ...(t.timeline.chips ? { chips: [...t.timeline.chips] } : {}),
            ...(t.timeline.chipsNote ? { chipsNote: t.timeline.chipsNote } : {}),
          },
        }
      : {}),
    ...(t.video
      ? { video: { id: t.video.id, title: t.video.title, description: t.video.description, eyebrow: t.video.eyebrow, heading: t.video.heading } }
      : {}),
    ...(t.technology
      ? {
          technology: {
            heading: t.technology.heading,
            ...(t.technology.eyebrow ? { eyebrow: t.technology.eyebrow } : {}),
            ...(t.technology.subtitle ? { subtitle: t.technology.subtitle } : {}),
            items: t.technology.items.map((x) => ({ icon: iconKey(x.icon), t: x.t, d: x.d })),
          },
        }
      : {}),
    ...(t.whyUs
      ? { whyUs: { heading: t.whyUs.heading, items: t.whyUs.items.map((x) => ({ icon: iconKey(x.icon), t: x.t, d: x.d })) } }
      : {}),
    success: {
      factors: [...t.success.factors],
      ...(t.success.note ? { note: t.success.note } : {}),
      heading: "Real chances, honestly explained",
      description: `Every fertility journey is unique. ${t.shortName} success rates depend on several medical and lifestyle factors.`,
      callout: "At Bavishi Fertility Institute, we focus on personalised treatment plans rather than one-size-fits-all success claims.",
    },
    cost: {
      includes: [...t.cost.includes],
      heading: "Transparent, with no hidden costs",
      description: `Know exactly what your ${t.shortName} treatment cost includes before you begin.`,
    },
    risks: {
      heading: t.risks.heading,
      ...(t.risks.subtitle ? { subtitle: t.risks.subtitle } : {}),
      items: t.risks.items.map((r) => ({ t: r.t, d: r.d, help: r.help })),
    },
    ...(t.preparation
      ? { preparation: { heading: t.preparation.heading, ...(t.preparation.subtitle ? { subtitle: t.preparation.subtitle } : {}), items: [...t.preparation.items] } }
      : {}),
    faqs: t.faqs.map((f) => ({ q: f.q, a: f.a })),
    related: [...t.related],
    patientStories: {
      heading: { lead: t.shortName, em: "success stories" },
      subtitle: `Hear from couples who chose Bavishi Fertility Institute for their ${t.shortName} journey.`,
    },
    specialists: {
      heading: { lead: `Our ${t.shortName}`, em: "Specialists" },
      subtitle: `Meet the Bavishi Fertility Institute specialists who treat patients with ${t.shortName}.`,
    },
    faqsSection: { lead: `${t.shortName} —`, em: "your questions answered" },
    relatedSection: { lead: "Related fertility", em: "treatments & conditions" },
    blogSection: {
      heading: { lead: "Articles related to", em: t.shortName },
      subtitle: `Helpful reads on ${t.shortName} from the Bavishi Fertility Institute specialists.`,
    },
    labels: {
      whatIs: `What is ${t.shortName}`,
      benefits: "Advantages",
      types: `Types of ${t.shortName}`,
      whoNeedsIt: t.labels?.whoNeedsIt ?? "Indications",
      process: "Step by Step",
      timeline: "Treatment Timeline",
      whyUs: "Why Bavishi Fertility Institute",
      successCard: "Success & Safety",
      costCard: "Cost & Assurance",
      successFactors: "Factors affecting success",
      risks: "Risks & Considerations",
      preparation: "Preparing",
      patientStories: "Patient Stories",
      specialists: "Our Specialists",
      faq: "FAQ",
      exploreMore: "Explore More",
      blog: "From Our Blog",
    },
    cta: { heading: t.cta.heading, headingEm: t.cta.headingEm, ...(t.cta.subtitle ? { subtitle: t.cta.subtitle } : {}) },
  };
}

/** Resolve content for a slug straight from the code defaults (no CMS). Used by
 *  the client template as a back-compat fallback when no props are supplied. */
export function resolveTreatmentFromCode(slug: string): ResolvedTreatment | undefined {
  const def = treatmentBySlug(slug);
  return def ? toResolved(def) : undefined;
}

/* =====================================================================
 * CMS source shape (kept loose so it stays decoupled from the generated
 * payload-types, same convention as ServiceSource/FooterSource).
 * ===================================================================== */
// NOTE: fields below are typed LocalizedField (string | {en,hi,gu} | null) for the
// sections this pass localizes (hero/whatIs/benefits/whoNeedsIt/process/risks/faqs/cta)
// so a Sanity doc can carry per-locale translations there. Sections outside this
// pass's scope (types/timeline/video/technology/whyUs/success/cost/preparation/
// labels/meta) stay plain strings — untranslated, English-only, per scope.
type HeadingSource = { lead?: LocalizedField; em?: LocalizedField } | null | undefined;
type TextItem = { text?: LocalizedField };
type ValueItem = { value?: LocalizedField };
type IconCardSource = { icon?: string | null; t?: LocalizedField; d?: LocalizedField };
type StepSource = { icon?: string | null; n?: string | null; t?: LocalizedField; d?: LocalizedField };

export type TreatmentSource =
  | {
      slug?: string | null;
      href?: string | null;
      name?: string | null;
      shortName?: string | null;
      alternateName?: string | null;
      breadcrumbName?: string | null;
      lastReviewed?: string | null;
      reviewerSlug?: string | null;
      meta?: { title?: string | null; description?: string | null; ogTitle?: string | null; ogDescription?: string | null; ogImage?: string | null } | null;
      procedure?: {
        procedureType?: string | null; bodyLocation?: string | null;
        howPerformed?: string | null; followup?: string | null;
      } | null;
      hero?: {
        eyebrow?: LocalizedField; h1?: LocalizedField; h1Em?: LocalizedField;
        tagline?: LocalizedField; badges?: ValueItem[] | null;
        image?: string | null; imageAlt?: string | null; heroPhoto?: UploadValue;
      } | null;
      whatIs?: {
        heading?: HeadingSource; paragraphs?: TextItem[] | null;
        aside?: { title?: LocalizedField; body?: LocalizedField } | null;
      } | null;
      benefits?: { heading?: HeadingSource; subtitle?: LocalizedField; items?: ValueItem[] | null } | null;
      types?: { heading?: HeadingSource; subtitle?: LocalizedField; items?: IconCardSource[] | null } | null;
      whoNeedsIt?: { heading?: HeadingSource; subtitle?: LocalizedField; items?: ValueItem[] | null } | null;
      process?: { heading?: HeadingSource; subtitle?: LocalizedField; steps?: StepSource[] | null; note?: LocalizedField } | null;
      timeline?: {
        heading?: HeadingSource; subtitle?: LocalizedField;
        items?: { day?: LocalizedField; t?: LocalizedField; d?: LocalizedField }[] | null;
        chips?: ValueItem[] | null; chipsNote?: LocalizedField;
      } | null;
      video?: { id?: string | null; title?: LocalizedField; description?: LocalizedField; eyebrow?: LocalizedField; heading?: HeadingSource } | null;
      technology?: { heading?: HeadingSource; eyebrow?: LocalizedField; subtitle?: LocalizedField; items?: IconCardSource[] | null } | null;
      whyUs?: { heading?: HeadingSource; items?: IconCardSource[] | null } | null;
      success?: { factors?: ValueItem[] | null; note?: LocalizedField; heading?: LocalizedField; description?: LocalizedField; callout?: LocalizedField } | null;
      cost?: { includes?: ValueItem[] | null; heading?: LocalizedField; description?: LocalizedField } | null;
      patientStories?: { heading?: HeadingSource; subtitle?: LocalizedField } | null;
      specialists?: { heading?: HeadingSource; subtitle?: LocalizedField } | null;
      faqsSection?: HeadingSource;
      relatedSection?: HeadingSource;
      blogSection?: { heading?: HeadingSource; subtitle?: LocalizedField } | null;
      labels?: {
        whatIs?: string | null; benefits?: string | null; types?: string | null; whoNeedsIt?: string | null; process?: string | null;
        timeline?: string | null; whyUs?: string | null; successCard?: string | null; costCard?: string | null;
        successFactors?: string | null; risks?: string | null; preparation?: string | null; patientStories?: string | null;
        specialists?: string | null; faq?: string | null; exploreMore?: string | null; blog?: string | null;
      } | null;
      risks?: { heading?: HeadingSource; subtitle?: LocalizedField; items?: { t?: LocalizedField; d?: LocalizedField; help?: LocalizedField }[] | null } | null;
      preparation?: { heading?: HeadingSource; subtitle?: LocalizedField; items?: ValueItem[] | null } | null;
      faqs?: { q?: LocalizedField; a?: LocalizedField }[] | null;
      related?: { slug?: string | null }[] | null;
      cta?: { heading?: LocalizedField; headingEm?: LocalizedField; subtitle?: LocalizedField } | null;
      /** CMS override for patient video testimonials. When present, replaces the
       *  code-owned defaults in TREATMENT_TESTIMONIALS so the editor can update
       *  individual YouTube IDs without touching the source file. */
      testimonials?: {
        youTubeId?: string | null;
        name?: string | null;
        quote?: string | null;
        location?: string | null;
      }[] | null;
    }
  | null
  | undefined;

// Resolve each part of a heading INDEPENDENTLY (lead/em fall back separately).
// The inline editor commits one field per blur, so editing a heading's `lead`
// posts a draft whose `em` is whatever the materialised source seeded — the old
// all-or-nothing `h?.lead ? {…} : def` reset the OTHER part to the default on
// every single-field edit (the homepage "content vanishes on edit" bug). This
// stays byte-identical on the public/seed path: a seeded heading carries both
// parts, and an absent part resolves to the same default either way.
const heading = (h: HeadingSource, def: Heading, locale: Locale = "en"): Heading => ({
  lead: pickLocale(h?.lead, locale) ?? def.lead,
  em: pickLocale(h?.em, locale) ?? def.em,
});
const texts = (a: TextItem[] | null | undefined, locale: Locale = "en"): string[] =>
  (a ?? []).map((x) => pickLocale(x.text, locale) ?? "").filter(Boolean);
const values = (a: ValueItem[] | null | undefined, locale: Locale = "en"): string[] =>
  (a ?? []).map((x) => pickLocale(x.value, locale) ?? "").filter(Boolean);
const iconCards = (a: IconCardSource[] | null | undefined, locale: Locale = "en"): ResolvedIconCard[] =>
  (a ?? []).map((x) => ({ icon: (x.icon ?? "Sparkles") as IconName, t: pickLocale(x.t, locale) ?? "", d: pickLocale(x.d, locale) ?? "" }));
const procSteps = (a: StepSource[] | null | undefined, locale: Locale = "en"): ResolvedStep[] =>
  (a ?? []).map((s) => ({ icon: (s.icon ?? "Sparkles") as IconName, n: s.n ?? "", t: pickLocale(s.t, locale) ?? "", d: pickLocale(s.d, locale) ?? "" }));

/**
 * Map a `treatments` doc → ResolvedTreatment, falling back PER-SECTION to the
 * typed default for `slug` so an empty/partial CMS renders byte-identically.
 * Returns undefined for an unknown slug with no default (caller → notFound).
 */
export function resolveTreatment(slug: string, src: TreatmentSource, locale: Locale = "en"): ResolvedTreatment | undefined {
  const def = treatmentBySlug(slug);
  if (!src) return def ? toResolved(def) : undefined;
  if (!def) {
    return resolvePureCMSTreatment(src, locale);
  }
  const base = toResolved(def);

  return {
    ...base,
    // ---- identity / meta scalars ----
    name: src.name || base.name,
    shortName: src.shortName || base.shortName,
    breadcrumbName: src.breadcrumbName || base.breadcrumbName,
    href: src.href || base.href,
    lastReviewed: src.lastReviewed || base.lastReviewed,
    reviewerSlug: src.reviewerSlug || base.reviewerSlug,
    meta: {
      title: src.meta?.title || base.meta.title,
      description: src.meta?.description || base.meta.description,
      ogTitle: src.meta?.ogTitle || base.meta.ogTitle,
      ogDescription: src.meta?.ogDescription || base.meta.ogDescription,
      ogImage: src.meta?.ogImage || base.meta.ogImage,
    },
    procedure: {
      ...(src.procedure?.procedureType || base.procedure.procedureType ? { procedureType: src.procedure?.procedureType || base.procedure.procedureType } : {}),
      ...(src.procedure?.bodyLocation || base.procedure.bodyLocation ? { bodyLocation: src.procedure?.bodyLocation || base.procedure.bodyLocation } : {}),
      ...(src.procedure?.howPerformed || base.procedure.howPerformed ? { howPerformed: src.procedure?.howPerformed || base.procedure.howPerformed } : {}),
      ...(src.procedure?.followup || base.procedure.followup ? { followup: src.procedure?.followup || base.procedure.followup } : {}),
    },
    // Optional scalar — base carries it; src overrides when present.
    ...(src.alternateName || base.alternateName ? { alternateName: src.alternateName || base.alternateName } : {}),

    // ---- required sections ----
    hero: src.hero?.h1
      ? {
          eyebrow: pickLocale(src.hero.eyebrow, locale) ?? base.hero.eyebrow,
          h1: pickLocale(src.hero.h1, locale) ?? base.hero.h1,
          h1Em: pickLocale(src.hero.h1Em, locale) ?? base.hero.h1Em,
          tagline: pickLocale(src.hero.tagline, locale) ?? base.hero.tagline,
          badges: src.hero.badges?.length ? values(src.hero.badges, locale) : base.hero.badges,
          image: mediaUrl(src.hero.heroPhoto) ?? (src.hero.image || base.hero.image),
          imageAlt: src.hero.imageAlt ?? base.hero.imageAlt,
        }
      : base.hero,
    whatIs: src.whatIs?.paragraphs?.length
      ? {
          heading: heading(src.whatIs.heading, base.whatIs.heading, locale),
          paragraphs: texts(src.whatIs.paragraphs, locale),
          ...(src.whatIs.aside?.title
            ? { aside: { title: pickLocale(src.whatIs.aside.title, locale) ?? "", body: pickLocale(src.whatIs.aside.body, locale) ?? "" } }
            : base.whatIs.aside
              ? { aside: base.whatIs.aside }
              : {}),
        }
      : base.whatIs,
    benefits: src.benefits?.items?.length
      ? { heading: heading(src.benefits.heading, base.benefits.heading, locale), ...(src.benefits.subtitle ? { subtitle: pickLocale(src.benefits.subtitle, locale) ?? "" } : {}), items: values(src.benefits.items, locale) }
      : base.benefits,
    whoNeedsIt: src.whoNeedsIt?.items?.length
      ? { heading: heading(src.whoNeedsIt.heading, base.whoNeedsIt.heading, locale), ...(src.whoNeedsIt.subtitle ? { subtitle: pickLocale(src.whoNeedsIt.subtitle, locale) ?? "" } : {}), items: values(src.whoNeedsIt.items, locale) }
      : base.whoNeedsIt,
    process: src.process?.steps?.length
      ? {
          heading: heading(src.process.heading, base.process.heading, locale),
          ...(src.process.subtitle ? { subtitle: pickLocale(src.process.subtitle, locale) ?? "" } : {}),
          steps: procSteps(src.process.steps, locale),
          ...(src.process.note ? { note: pickLocale(src.process.note, locale) ?? "" } : {}),
        }
      : base.process,
    success: {
      factors: src.success?.factors?.length ? values(src.success.factors, locale) : base.success.factors,
      ...(src.success?.note || base.success.note ? { note: pickLocale(src.success?.note, locale) || base.success.note } : {}),
      heading: pickLocale(src.success?.heading, locale) || base.success.heading,
      description: pickLocale(src.success?.description, locale) || base.success.description,
      callout: pickLocale(src.success?.callout, locale) || base.success.callout,
    },
    cost: {
      includes: src.cost?.includes?.length ? values(src.cost.includes, locale) : base.cost.includes,
      heading: pickLocale(src.cost?.heading, locale) || base.cost.heading,
      description: pickLocale(src.cost?.description, locale) || base.cost.description,
    },
    risks: src.risks?.items?.length
      ? {
          heading: heading(src.risks.heading, base.risks.heading, locale),
          ...(src.risks.subtitle ? { subtitle: pickLocale(src.risks.subtitle, locale) ?? "" } : {}),
          items: src.risks.items.map((r) => ({ t: pickLocale(r.t, locale) ?? "", d: pickLocale(r.d, locale) ?? "", help: pickLocale(r.help, locale) ?? "" })),
        }
      : base.risks,
    faqs: src.faqs?.length ? src.faqs.map((f) => ({ q: pickLocale(f.q, locale) ?? "", a: pickLocale(f.a, locale) ?? "" })) : base.faqs,
    related: src.related?.length ? src.related.map((r) => r.slug ?? "").filter(Boolean) : base.related,
    cta: src.cta?.heading
      ? { heading: pickLocale(src.cta.heading, locale) ?? base.cta.heading, headingEm: pickLocale(src.cta.headingEm, locale) ?? base.cta.headingEm, ...(src.cta.subtitle ? { subtitle: pickLocale(src.cta.subtitle, locale) ?? "" } : {}) }
      : base.cta,
    patientStories: {
      heading: heading(src.patientStories?.heading, base.patientStories.heading, locale),
      subtitle: pickLocale(src.patientStories?.subtitle, locale) || base.patientStories.subtitle,
    },
    specialists: {
      heading: heading(src.specialists?.heading, base.specialists.heading, locale),
      subtitle: pickLocale(src.specialists?.subtitle, locale) || base.specialists.subtitle,
    },
    faqsSection: heading(src.faqsSection, base.faqsSection, locale),
    relatedSection: heading(src.relatedSection, base.relatedSection, locale),
    blogSection: {
      heading: heading(src.blogSection?.heading, base.blogSection.heading, locale),
      subtitle: pickLocale(src.blogSection?.subtitle, locale) || base.blogSection.subtitle,
    },
    labels: {
      whatIs: src.labels?.whatIs || base.labels.whatIs,
      benefits: src.labels?.benefits || base.labels.benefits,
      types: src.labels?.types || base.labels.types,
      whoNeedsIt: src.labels?.whoNeedsIt || base.labels.whoNeedsIt,
      process: src.labels?.process || base.labels.process,
      timeline: src.labels?.timeline || base.labels.timeline,
      whyUs: src.labels?.whyUs || base.labels.whyUs,
      successCard: src.labels?.successCard || base.labels.successCard,
      costCard: src.labels?.costCard || base.labels.costCard,
      successFactors: src.labels?.successFactors || base.labels.successFactors,
      risks: src.labels?.risks || base.labels.risks,
      preparation: src.labels?.preparation || base.labels.preparation,
      patientStories: src.labels?.patientStories || base.labels.patientStories,
      specialists: src.labels?.specialists || base.labels.specialists,
      faq: src.labels?.faq || base.labels.faq,
      exploreMore: src.labels?.exploreMore || base.labels.exploreMore,
      blog: src.labels?.blog || base.labels.blog,
    },

    // ---- optional sections (conditional spread; base carries the default
    //      when the doc omits them) ----
    ...(src.types?.items?.length
      ? {
          types: {
            heading: heading(src.types.heading, base.types?.heading ?? { lead: "" }, locale),
            ...(src.types.subtitle ? { subtitle: pickLocale(src.types.subtitle, locale) ?? "" } : {}),
            items: iconCards(src.types.items, locale),
          },
        }
      : {}),
    ...(src.timeline?.items?.length
      ? {
          timeline: {
            heading: heading(src.timeline.heading, base.timeline?.heading ?? { lead: "" }, locale),
            ...(src.timeline.subtitle ? { subtitle: pickLocale(src.timeline.subtitle, locale) ?? "" } : {}),
            items: src.timeline.items.map((i) => ({ day: pickLocale(i.day, locale) ?? "", t: pickLocale(i.t, locale) ?? "", d: pickLocale(i.d, locale) ?? "" })),
            ...(src.timeline.chips?.length ? { chips: values(src.timeline.chips, locale) } : {}),
            ...(src.timeline.chipsNote ? { chipsNote: pickLocale(src.timeline.chipsNote, locale) ?? "" } : {}),
          },
        }
      : {}),
    ...(src.video?.id
      ? {
          video: {
            id: src.video.id,
            title: pickLocale(src.video.title, locale) ?? "",
            description: pickLocale(src.video.description, locale) ?? "",
            eyebrow: pickLocale(src.video.eyebrow, locale) ?? "",
            heading: heading(src.video.heading, base.video?.heading ?? { lead: "" }, locale),
          },
        }
      : {}),
    ...(src.technology?.items?.length
      ? {
          technology: {
            heading: heading(src.technology.heading, base.technology?.heading ?? { lead: "" }, locale),
            ...(src.technology.eyebrow ? { eyebrow: pickLocale(src.technology.eyebrow, locale) ?? "" } : {}),
            ...(src.technology.subtitle ? { subtitle: pickLocale(src.technology.subtitle, locale) ?? "" } : {}),
            items: iconCards(src.technology.items, locale),
          },
        }
      : {}),
    ...(src.whyUs?.items?.length
      ? { whyUs: { heading: heading(src.whyUs.heading, base.whyUs?.heading ?? { lead: "" }, locale), items: iconCards(src.whyUs.items, locale) } }
      : {}),
    ...(src.preparation?.items?.length
      ? { preparation: { heading: heading(src.preparation.heading, base.preparation?.heading ?? { lead: "" }, locale), ...(src.preparation.subtitle ? { subtitle: pickLocale(src.preparation.subtitle, locale) ?? "" } : {}), items: values(src.preparation.items, locale) } }
      : {}),
  };
}

/**
 * Resolve a treatment that was created PURELY from the CMS (no code-registry
 * entry). Used by the dynamic `/treatments/[slug]` route. All defaults are
 * derived from the CMS doc's name/shortName so the page renders meaningfully
 * even when content sections are still empty.
 */
type Plain<T> = T extends { en?: string; hi?: string; gu?: string } ? string : T extends (infer U)[] ? Plain<U>[] : T extends object ? { [K in keyof T]: Plain<T[K]> } : T;
const isLocObj = (o: object) => Object.keys(o).length > 0 && Object.keys(o).every((k) => k === "en" || k === "hi" || k === "gu");
// Collapse every {en,hi,gu} leaf to the picked-locale string (pure-CMS path has no code defaults to merge).
function flat(x: unknown, locale: Locale): unknown {
  if (Array.isArray(x)) return x.map((v) => flat(v, locale));
  if (x && typeof x === "object") {
    if (isLocObj(x)) return pickLocale(x as LocalizedField, locale) ?? "";
    return Object.fromEntries(Object.entries(x).map(([k, v]) => [k, flat(v, locale)]));
  }
  return x;
}

export function resolvePureCMSTreatment(srcIn: NonNullable<TreatmentSource>, locale: Locale = "en"): ResolvedTreatment {
  const src = flat(srcIn, locale) as Plain<NonNullable<TreatmentSource>>;
  const name = src.name ?? "Treatment";
  const short = src.shortName || name;
  const slug = src.slug ?? "";
  const href = src.href || `/treatments/${slug}`;
  const empty: Heading = { lead: "", em: "" };
  return {
    slug,
    href,
    name,
    shortName: short,
    breadcrumbName: src.breadcrumbName || short,
    ...(src.alternateName ? { alternateName: src.alternateName } : {}),
    meta: {
      title: src.meta?.title || `${name} — Bavishi Fertility Institute`,
      description: src.meta?.description || `Learn about ${name} treatment at Bavishi Fertility Institute.`,
      ogTitle: src.meta?.ogTitle || "",
      ogDescription: src.meta?.ogDescription || "",
      ogImage: src.meta?.ogImage || "",
    },
    procedure: {
      ...(src.procedure?.procedureType ? { procedureType: src.procedure.procedureType } : {}),
      ...(src.procedure?.bodyLocation ? { bodyLocation: src.procedure.bodyLocation } : {}),
      ...(src.procedure?.howPerformed ? { howPerformed: src.procedure.howPerformed } : {}),
      ...(src.procedure?.followup ? { followup: src.procedure.followup } : {}),
    },
    lastReviewed: src.lastReviewed || "",
    reviewerSlug: src.reviewerSlug || "",
    hero: {
      eyebrow: src.hero?.eyebrow || "Bavishi Fertility Institute",
      h1: src.hero?.h1 || name,
      h1Em: src.hero?.h1Em || "",
      tagline: src.hero?.tagline || "",
      badges: src.hero?.badges?.length ? values(src.hero.badges) : [],
      image: mediaUrl(src.hero?.heroPhoto) ?? (src.hero?.image || ""),
      imageAlt: src.hero?.imageAlt || name,
    },
    whatIs: src.whatIs?.paragraphs?.length
      ? { heading: heading(src.whatIs.heading, empty), paragraphs: texts(src.whatIs.paragraphs), ...(src.whatIs.aside?.title ? { aside: { title: src.whatIs.aside.title, body: src.whatIs.aside.body ?? "" } } : {}) }
      : { heading: { lead: `What is`, em: short }, paragraphs: [] },
    benefits: src.benefits?.items?.length
      ? { heading: heading(src.benefits.heading, empty), ...(src.benefits.subtitle ? { subtitle: src.benefits.subtitle } : {}), items: values(src.benefits.items) }
      : { heading: { lead: "Benefits of", em: short }, items: [] },
    whoNeedsIt: src.whoNeedsIt?.items?.length
      ? { heading: heading(src.whoNeedsIt.heading, empty), ...(src.whoNeedsIt.subtitle ? { subtitle: src.whoNeedsIt.subtitle } : {}), items: values(src.whoNeedsIt.items) }
      : { heading: { lead: "Who needs", em: short }, items: [] },
    process: src.process?.steps?.length
      ? { heading: heading(src.process.heading, empty), ...(src.process.subtitle ? { subtitle: src.process.subtitle } : {}), steps: procSteps(src.process.steps), ...(src.process.note ? { note: src.process.note } : {}) }
      : { heading: { lead: "The", em: `${short} Process` }, steps: [] },
    success: {
      factors: src.success?.factors?.length ? values(src.success.factors) : [],
      heading: src.success?.heading || "Real chances, honestly explained",
      description: src.success?.description || `Every fertility journey is unique. ${short} success rates depend on several medical and lifestyle factors.`,
      callout: src.success?.callout || "At Bavishi Fertility Institute, we focus on personalised treatment plans rather than one-size-fits-all success claims.",
      ...(src.success?.note ? { note: src.success.note } : {}),
    },
    cost: {
      includes: src.cost?.includes?.length ? values(src.cost.includes) : [],
      heading: src.cost?.heading || "Transparent, with no hidden costs",
      description: src.cost?.description || `Know exactly what your ${short} treatment cost includes before you begin.`,
    },
    risks: src.risks?.items?.length
      ? { heading: heading(src.risks.heading, empty), ...(src.risks.subtitle ? { subtitle: src.risks.subtitle } : {}), items: src.risks.items.map((r) => ({ t: r.t ?? "", d: r.d ?? "", help: r.help ?? "" })) }
      : { heading: { lead: "Risks &", em: "Considerations" }, items: [] },
    ...(src.types?.items?.length ? { types: { heading: heading(src.types.heading, empty), ...(src.types.subtitle ? { subtitle: src.types.subtitle } : {}), items: iconCards(src.types.items) } } : {}),
    ...(src.timeline?.items?.length ? { timeline: { heading: heading(src.timeline.heading, empty), ...(src.timeline.subtitle ? { subtitle: src.timeline.subtitle } : {}), items: src.timeline.items.map((i) => ({ day: i.day ?? "", t: i.t ?? "", d: i.d ?? "" })), ...(src.timeline.chips?.length ? { chips: values(src.timeline.chips) } : {}), ...(src.timeline.chipsNote ? { chipsNote: src.timeline.chipsNote } : {}) } } : {}),
    ...(src.video?.id ? { video: { id: src.video.id, title: src.video.title ?? "", description: src.video.description ?? "", eyebrow: src.video.eyebrow ?? "", heading: heading(src.video.heading, empty) } } : {}),
    ...(src.technology?.items?.length ? { technology: { heading: heading(src.technology.heading, empty), ...(src.technology.eyebrow ? { eyebrow: src.technology.eyebrow } : {}), ...(src.technology.subtitle ? { subtitle: src.technology.subtitle } : {}), items: iconCards(src.technology.items) } } : {}),
    ...(src.whyUs?.items?.length ? { whyUs: { heading: heading(src.whyUs.heading, empty), items: iconCards(src.whyUs.items) } } : {}),
    ...(src.preparation?.items?.length ? { preparation: { heading: heading(src.preparation.heading, empty), ...(src.preparation.subtitle ? { subtitle: src.preparation.subtitle } : {}), items: values(src.preparation.items) } } : {}),
    faqs: src.faqs?.length ? src.faqs.map((f) => ({ q: f.q ?? "", a: f.a ?? "" })) : [],
    related: src.related?.length ? src.related.map((r) => r.slug ?? "").filter(Boolean) : [],
    cta: src.cta?.heading ? { heading: src.cta.heading, headingEm: src.cta.headingEm ?? "", ...(src.cta.subtitle ? { subtitle: src.cta.subtitle } : {}) } : { heading: "Start your", headingEm: "fertility journey" },
    patientStories: { heading: heading(src.patientStories?.heading, { lead: short, em: "success stories" }), subtitle: src.patientStories?.subtitle || `Hear from couples who chose Bavishi Fertility Institute for their ${short} journey.` },
    specialists: { heading: heading(src.specialists?.heading, { lead: `Our ${short}`, em: "Specialists" }), subtitle: src.specialists?.subtitle || `Meet the Bavishi Fertility Institute specialists who treat patients with ${short}.` },
    faqsSection: heading(src.faqsSection, { lead: `${short} —`, em: "your questions answered" }),
    relatedSection: heading(src.relatedSection, { lead: "Related fertility", em: "treatments & conditions" }),
    blogSection: { heading: heading(src.blogSection?.heading, { lead: "Articles related to", em: short }), subtitle: src.blogSection?.subtitle || `Helpful reads on ${short} from the Bavishi Fertility Institute specialists.` },
    labels: {
      whatIs: src.labels?.whatIs || `What is ${short}`,
      benefits: src.labels?.benefits || "Advantages",
      types: src.labels?.types || `Types of ${short}`,
      whoNeedsIt: src.labels?.whoNeedsIt || "Indications",
      process: src.labels?.process || "Step by Step",
      timeline: src.labels?.timeline || "Treatment Timeline",
      whyUs: src.labels?.whyUs || "Why Bavishi Fertility Institute",
      successCard: src.labels?.successCard || "Success & Safety",
      costCard: src.labels?.costCard || "Cost & Assurance",
      successFactors: src.labels?.successFactors || "Factors affecting success",
      risks: src.labels?.risks || "Risks & Considerations",
      preparation: src.labels?.preparation || "Preparing",
      patientStories: src.labels?.patientStories || "Patient Stories",
      specialists: src.labels?.specialists || "Our Specialists",
      faq: src.labels?.faq || "FAQ",
      exploreMore: src.labels?.exploreMore || "Explore More",
      blog: src.labels?.blog || "From Our Blog",
    },
  };
}

/* =====================================================================
 * materializeTreatmentSource — seed a FULLY-populated draft for the inline
 * editor (mirrors materializeHomepageSource).
 * ---------------------------------------------------------------------
 * The editor edits a SOURCE draft and commits ONE field per blur. If the draft
 * started mostly empty (the CMS doc only carries overrides; sections render from
 * the code defaults), editing one field would POST a sparse array — Payload's
 * required-field validation 400s on the empty rows, and a half-filled section
 * would drop its sibling rows in the live preview. Seeding the draft with every
 * section/row/field already present (in SOURCE shape, filled from the resolved
 * defaults) fixes both: editing one field leaves all the others intact and
 * complete, so the POST always carries valid rows and nothing vanishes.
 *
 * Editor-only. The PUBLIC site never calls this — it resolves the raw CMS doc
 * directly, so output stays byte-identical, and resolveTreatment(materialized)
 * === the same resolved data, so the live preview is unchanged.
 */
export function materializeTreatmentSource(slug: string, src: TreatmentSource): NonNullable<TreatmentSource> {
  const r = resolveTreatment(slug, src);
  const s = (src ?? {}) as NonNullable<TreatmentSource>;
  if (!r) return s; // unknown slug — nothing to seed
  // Helpers for the array fields whose SOURCE shape wraps each string.
  const v = (value: string) => ({ value });
  const tx = (text: string) => ({ text });
  return {
    ...s,
    slug: r.slug,
    href: r.href,
    name: r.name,
    shortName: r.shortName,
    ...(r.alternateName ? { alternateName: r.alternateName } : {}),
    breadcrumbName: r.breadcrumbName,
    lastReviewed: r.lastReviewed,
    reviewerSlug: r.reviewerSlug,
    meta: { title: r.meta.title, description: r.meta.description, ogImage: r.meta.ogImage },
    procedure: { ...r.procedure },
    // Translatable sections keep any RAW value already on the doc (string OR {en,hi,gu})
    // and only fill blanks from the resolved English defaults — otherwise re-opening
    // the editor would flatten saved hi/gu translations back to English.
    hero: {
      ...(s.hero ?? {}),
      eyebrow: s.hero?.eyebrow ?? r.hero.eyebrow,
      h1: s.hero?.h1 ?? r.hero.h1,
      h1Em: s.hero?.h1Em ?? r.hero.h1Em,
      tagline: s.hero?.tagline ?? r.hero.tagline,
      badges: s.hero?.badges?.length ? s.hero.badges : r.hero.badges.map(v),
      image: r.hero.image,
      imageAlt: r.hero.imageAlt,
    },
    whatIs: {
      ...(s.whatIs ?? {}),
      heading: { lead: s.whatIs?.heading?.lead ?? r.whatIs.heading.lead, em: s.whatIs?.heading?.em ?? r.whatIs.heading.em },
      paragraphs: s.whatIs?.paragraphs?.length ? s.whatIs.paragraphs : r.whatIs.paragraphs.map(tx),
      ...(s.whatIs?.aside?.title || r.whatIs.aside
        ? { aside: { title: s.whatIs?.aside?.title ?? r.whatIs.aside?.title ?? "", body: s.whatIs?.aside?.body ?? r.whatIs.aside?.body ?? "" } }
        : {}),
    },
    benefits: {
      ...(s.benefits ?? {}),
      heading: { lead: s.benefits?.heading?.lead ?? r.benefits.heading.lead, em: s.benefits?.heading?.em ?? r.benefits.heading.em },
      ...((s.benefits?.subtitle ?? r.benefits.subtitle) ? { subtitle: s.benefits?.subtitle ?? r.benefits.subtitle } : {}),
      items: s.benefits?.items?.length ? s.benefits.items : r.benefits.items.map(v),
    },
    whoNeedsIt: {
      ...(s.whoNeedsIt ?? {}),
      heading: { lead: s.whoNeedsIt?.heading?.lead ?? r.whoNeedsIt.heading.lead, em: s.whoNeedsIt?.heading?.em ?? r.whoNeedsIt.heading.em },
      ...((s.whoNeedsIt?.subtitle ?? r.whoNeedsIt.subtitle) ? { subtitle: s.whoNeedsIt?.subtitle ?? r.whoNeedsIt.subtitle } : {}),
      items: s.whoNeedsIt?.items?.length ? s.whoNeedsIt.items : r.whoNeedsIt.items.map(v),
    },
    process: {
      ...(s.process ?? {}),
      heading: { lead: s.process?.heading?.lead ?? r.process.heading.lead, em: s.process?.heading?.em ?? r.process.heading.em },
      ...((s.process?.subtitle ?? r.process.subtitle) ? { subtitle: s.process?.subtitle ?? r.process.subtitle } : {}),
      steps: s.process?.steps?.length ? s.process.steps : r.process.steps,
      ...((s.process?.note ?? r.process.note) ? { note: s.process?.note ?? r.process.note } : {}),
    },
    success: { ...(s.success ?? {}), factors: r.success.factors.map(v), ...(r.success.note ? { note: r.success.note } : {}), heading: r.success.heading, description: r.success.description, callout: r.success.callout },
    cost: { ...(s.cost ?? {}), includes: r.cost.includes.map(v), heading: r.cost.heading, description: r.cost.description },
    risks: {
      ...(s.risks ?? {}),
      heading: { lead: s.risks?.heading?.lead ?? r.risks.heading.lead, em: s.risks?.heading?.em ?? r.risks.heading.em },
      ...((s.risks?.subtitle ?? r.risks.subtitle) ? { subtitle: s.risks?.subtitle ?? r.risks.subtitle } : {}),
      items: s.risks?.items?.length ? s.risks.items : r.risks.items,
    },
    faqs: s.faqs?.length ? s.faqs : r.faqs,
    related: r.related.map((slug) => ({ slug })),
    cta: { ...(s.cta ?? {}), heading: s.cta?.heading ?? r.cta.heading, headingEm: s.cta?.headingEm ?? r.cta.headingEm, ...((s.cta?.subtitle ?? r.cta.subtitle) ? { subtitle: s.cta?.subtitle ?? r.cta.subtitle } : {}) },
    ...(r.types ? { types: { ...(s.types ?? {}), heading: r.types.heading, ...(r.types.subtitle ? { subtitle: r.types.subtitle } : {}), items: r.types.items } } : {}),
    ...(r.timeline
      ? {
          timeline: {
            ...(s.timeline ?? {}),
            heading: r.timeline.heading,
            ...(r.timeline.subtitle ? { subtitle: r.timeline.subtitle } : {}),
            items: r.timeline.items,
            ...(r.timeline.chips ? { chips: r.timeline.chips.map(v) } : {}),
            ...(r.timeline.chipsNote ? { chipsNote: r.timeline.chipsNote } : {}),
          },
        }
      : {}),
    ...(r.video ? { video: { ...(s.video ?? {}), ...r.video } } : {}),
    ...(r.technology
      ? { technology: { ...(s.technology ?? {}), heading: r.technology.heading, ...(r.technology.eyebrow ? { eyebrow: r.technology.eyebrow } : {}), ...(r.technology.subtitle ? { subtitle: r.technology.subtitle } : {}), items: r.technology.items } }
      : {}),
    ...(r.whyUs ? { whyUs: { ...(s.whyUs ?? {}), heading: r.whyUs.heading, items: r.whyUs.items } } : {}),
    ...(r.preparation ? { preparation: { ...(s.preparation ?? {}), heading: r.preparation.heading, ...(r.preparation.subtitle ? { subtitle: r.preparation.subtitle } : {}), items: r.preparation.items.map(v) } } : {}),
    patientStories: { ...(s.patientStories ?? {}), heading: r.patientStories.heading, subtitle: r.patientStories.subtitle },
    specialists: { ...(s.specialists ?? {}), heading: r.specialists.heading, subtitle: r.specialists.subtitle },
    faqsSection: { lead: r.faqsSection.lead, em: r.faqsSection.em },
    relatedSection: { lead: r.relatedSection.lead, em: r.relatedSection.em },
    blogSection: { ...(s.blogSection ?? {}), heading: r.blogSection.heading, subtitle: r.blogSection.subtitle },
    labels: { ...(s.labels ?? {}), ...r.labels },
    // Seed testimonials from CMS doc if already set, else from code defaults.
    // This gives the editor a fully-populated array to PATCH individual video IDs
    // without touching the code source file.
    testimonials: (s.testimonials?.length
      ? s.testimonials
      : testimonialsForTreatment(slug)) as NonNullable<TreatmentSource>["testimonials"],
  } as NonNullable<TreatmentSource>;
}
