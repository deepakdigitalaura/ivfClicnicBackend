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

/* ---------- Resolved (serialisable) model — mirrors Treatment 1:1, with the
 * Lucide component fields replaced by icon NAMES. ---------- */
export type ResolvedIconCard = { icon: IconName; t: string; d: string };
export type ResolvedStep = { icon: IconName; n: string; t: string; d: string };

export type ResolvedTreatment = {
  slug: string;
  href: string;
  name: string;
  shortName: string;
  alternateName?: string;
  breadcrumbName: string;
  meta: { title: string; description: string; ogImage: string };
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
    meta: { title: t.meta.title, description: t.meta.description, ogImage: t.meta.ogImage },
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
            items: t.types.items.map((x) => ({ icon: iconKey(x.icon), t: x.t, d: x.d })),
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
      whoNeedsIt: "Indications",
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
type HeadingSource = { lead?: string | null; em?: string | null } | null | undefined;
type TextItem = { text?: string | null };
type ValueItem = { value?: string | null };
type IconCardSource = { icon?: string | null; t?: string | null; d?: string | null };
type StepSource = { icon?: string | null; n?: string | null; t?: string | null; d?: string | null };

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
      meta?: { title?: string | null; description?: string | null; ogImage?: string | null } | null;
      procedure?: {
        procedureType?: string | null; bodyLocation?: string | null;
        howPerformed?: string | null; followup?: string | null;
      } | null;
      hero?: {
        eyebrow?: string | null; h1?: string | null; h1Em?: string | null;
        tagline?: string | null; badges?: { value?: string | null }[] | null;
        image?: string | null; imageAlt?: string | null; heroPhoto?: UploadValue;
      } | null;
      whatIs?: {
        heading?: HeadingSource; paragraphs?: TextItem[] | null;
        aside?: { title?: string | null; body?: string | null } | null;
      } | null;
      benefits?: { heading?: HeadingSource; subtitle?: string | null; items?: ValueItem[] | null } | null;
      types?: { heading?: HeadingSource; subtitle?: string | null; items?: IconCardSource[] | null } | null;
      whoNeedsIt?: { heading?: HeadingSource; subtitle?: string | null; items?: ValueItem[] | null } | null;
      process?: { heading?: HeadingSource; subtitle?: string | null; steps?: StepSource[] | null; note?: string | null } | null;
      timeline?: {
        heading?: HeadingSource; subtitle?: string | null;
        items?: { day?: string | null; t?: string | null; d?: string | null }[] | null;
        chips?: ValueItem[] | null; chipsNote?: string | null;
      } | null;
      video?: { id?: string | null; title?: string | null; description?: string | null; eyebrow?: string | null; heading?: HeadingSource } | null;
      technology?: { heading?: HeadingSource; eyebrow?: string | null; subtitle?: string | null; items?: IconCardSource[] | null } | null;
      whyUs?: { heading?: HeadingSource; items?: IconCardSource[] | null } | null;
      success?: { factors?: ValueItem[] | null; note?: string | null; heading?: string | null; description?: string | null; callout?: string | null } | null;
      cost?: { includes?: ValueItem[] | null; heading?: string | null; description?: string | null } | null;
      patientStories?: { heading?: HeadingSource; subtitle?: string | null } | null;
      specialists?: { heading?: HeadingSource; subtitle?: string | null } | null;
      faqsSection?: HeadingSource;
      relatedSection?: HeadingSource;
      blogSection?: { heading?: HeadingSource; subtitle?: string | null } | null;
      labels?: {
        whatIs?: string | null; benefits?: string | null; types?: string | null; whoNeedsIt?: string | null; process?: string | null;
        timeline?: string | null; whyUs?: string | null; successCard?: string | null; costCard?: string | null;
        successFactors?: string | null; risks?: string | null; preparation?: string | null; patientStories?: string | null;
        specialists?: string | null; faq?: string | null; exploreMore?: string | null; blog?: string | null;
      } | null;
      risks?: { heading?: HeadingSource; subtitle?: string | null; items?: { t?: string | null; d?: string | null; help?: string | null }[] | null } | null;
      preparation?: { heading?: HeadingSource; subtitle?: string | null; items?: ValueItem[] | null } | null;
      faqs?: { q?: string | null; a?: string | null }[] | null;
      related?: { slug?: string | null }[] | null;
      cta?: { heading?: string | null; headingEm?: string | null; subtitle?: string | null } | null;
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
const heading = (h: HeadingSource, def: Heading): Heading => ({
  lead: h?.lead ?? def.lead,
  em: h?.em ?? def.em,
});
const texts = (a: TextItem[] | null | undefined): string[] =>
  (a ?? []).map((x) => x.text ?? "").filter(Boolean);
const values = (a: ValueItem[] | null | undefined): string[] =>
  (a ?? []).map((x) => x.value ?? "").filter(Boolean);
const iconCards = (a: IconCardSource[] | null | undefined): ResolvedIconCard[] =>
  (a ?? []).map((x) => ({ icon: (x.icon ?? "Sparkles") as IconName, t: x.t ?? "", d: x.d ?? "" }));
const procSteps = (a: StepSource[] | null | undefined): ResolvedStep[] =>
  (a ?? []).map((s) => ({ icon: (s.icon ?? "Sparkles") as IconName, n: s.n ?? "", t: s.t ?? "", d: s.d ?? "" }));

/**
 * Map a `treatments` doc → ResolvedTreatment, falling back PER-SECTION to the
 * typed default for `slug` so an empty/partial CMS renders byte-identically.
 * Returns undefined for an unknown slug with no default (caller → notFound).
 */
export function resolveTreatment(slug: string, src: TreatmentSource): ResolvedTreatment | undefined {
  const def = treatmentBySlug(slug);
  if (!src) return def ? toResolved(def) : undefined;
  if (!def) {
    return resolvePureCMSTreatment(src);
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
          eyebrow: src.hero.eyebrow ?? base.hero.eyebrow,
          h1: src.hero.h1,
          h1Em: src.hero.h1Em ?? base.hero.h1Em,
          tagline: src.hero.tagline ?? base.hero.tagline,
          badges: src.hero.badges?.length ? values(src.hero.badges) : base.hero.badges,
          image: mediaUrl(src.hero.heroPhoto) ?? (src.hero.image || base.hero.image),
          imageAlt: src.hero.imageAlt ?? base.hero.imageAlt,
        }
      : base.hero,
    whatIs: src.whatIs?.paragraphs?.length
      ? {
          heading: heading(src.whatIs.heading, base.whatIs.heading),
          paragraphs: texts(src.whatIs.paragraphs),
          ...(src.whatIs.aside?.title
            ? { aside: { title: src.whatIs.aside.title, body: src.whatIs.aside.body ?? "" } }
            : base.whatIs.aside
              ? { aside: base.whatIs.aside }
              : {}),
        }
      : base.whatIs,
    benefits: src.benefits?.items?.length
      ? { heading: heading(src.benefits.heading, base.benefits.heading), ...(src.benefits.subtitle ? { subtitle: src.benefits.subtitle } : {}), items: values(src.benefits.items) }
      : base.benefits,
    whoNeedsIt: src.whoNeedsIt?.items?.length
      ? { heading: heading(src.whoNeedsIt.heading, base.whoNeedsIt.heading), ...(src.whoNeedsIt.subtitle ? { subtitle: src.whoNeedsIt.subtitle } : {}), items: values(src.whoNeedsIt.items) }
      : base.whoNeedsIt,
    process: src.process?.steps?.length
      ? {
          heading: heading(src.process.heading, base.process.heading),
          ...(src.process.subtitle ? { subtitle: src.process.subtitle } : {}),
          steps: procSteps(src.process.steps),
          ...(src.process.note ? { note: src.process.note } : {}),
        }
      : base.process,
    success: {
      factors: src.success?.factors?.length ? values(src.success.factors) : base.success.factors,
      ...(src.success?.note || base.success.note ? { note: src.success?.note || base.success.note } : {}),
      heading: src.success?.heading || base.success.heading,
      description: src.success?.description || base.success.description,
      callout: src.success?.callout || base.success.callout,
    },
    cost: {
      includes: src.cost?.includes?.length ? values(src.cost.includes) : base.cost.includes,
      heading: src.cost?.heading || base.cost.heading,
      description: src.cost?.description || base.cost.description,
    },
    risks: src.risks?.items?.length
      ? {
          heading: heading(src.risks.heading, base.risks.heading),
          ...(src.risks.subtitle ? { subtitle: src.risks.subtitle } : {}),
          items: src.risks.items.map((r) => ({ t: r.t ?? "", d: r.d ?? "", help: r.help ?? "" })),
        }
      : base.risks,
    faqs: src.faqs?.length ? src.faqs.map((f) => ({ q: f.q ?? "", a: f.a ?? "" })) : base.faqs,
    related: src.related?.length ? src.related.map((r) => r.slug ?? "").filter(Boolean) : base.related,
    cta: src.cta?.heading
      ? { heading: src.cta.heading, headingEm: src.cta.headingEm ?? base.cta.headingEm, ...(src.cta.subtitle ? { subtitle: src.cta.subtitle } : {}) }
      : base.cta,
    patientStories: {
      heading: heading(src.patientStories?.heading, base.patientStories.heading),
      subtitle: src.patientStories?.subtitle || base.patientStories.subtitle,
    },
    specialists: {
      heading: heading(src.specialists?.heading, base.specialists.heading),
      subtitle: src.specialists?.subtitle || base.specialists.subtitle,
    },
    faqsSection: heading(src.faqsSection, base.faqsSection),
    relatedSection: heading(src.relatedSection, base.relatedSection),
    blogSection: {
      heading: heading(src.blogSection?.heading, base.blogSection.heading),
      subtitle: src.blogSection?.subtitle || base.blogSection.subtitle,
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
            heading: heading(src.types.heading, base.types?.heading ?? { lead: "" }),
            ...(src.types.subtitle ? { subtitle: src.types.subtitle } : {}),
            items: iconCards(src.types.items),
          },
        }
      : {}),
    ...(src.timeline?.items?.length
      ? {
          timeline: {
            heading: heading(src.timeline.heading, base.timeline?.heading ?? { lead: "" }),
            ...(src.timeline.subtitle ? { subtitle: src.timeline.subtitle } : {}),
            items: src.timeline.items.map((i) => ({ day: i.day ?? "", t: i.t ?? "", d: i.d ?? "" })),
            ...(src.timeline.chips?.length ? { chips: values(src.timeline.chips) } : {}),
            ...(src.timeline.chipsNote ? { chipsNote: src.timeline.chipsNote } : {}),
          },
        }
      : {}),
    ...(src.video?.id
      ? {
          video: {
            id: src.video.id,
            title: src.video.title ?? "",
            description: src.video.description ?? "",
            eyebrow: src.video.eyebrow ?? "",
            heading: heading(src.video.heading, base.video?.heading ?? { lead: "" }),
          },
        }
      : {}),
    ...(src.technology?.items?.length
      ? {
          technology: {
            heading: heading(src.technology.heading, base.technology?.heading ?? { lead: "" }),
            ...(src.technology.eyebrow ? { eyebrow: src.technology.eyebrow } : {}),
            ...(src.technology.subtitle ? { subtitle: src.technology.subtitle } : {}),
            items: iconCards(src.technology.items),
          },
        }
      : {}),
    ...(src.whyUs?.items?.length
      ? { whyUs: { heading: heading(src.whyUs.heading, base.whyUs?.heading ?? { lead: "" }), items: iconCards(src.whyUs.items) } }
      : {}),
    ...(src.preparation?.items?.length
      ? { preparation: { heading: heading(src.preparation.heading, base.preparation?.heading ?? { lead: "" }), ...(src.preparation.subtitle ? { subtitle: src.preparation.subtitle } : {}), items: values(src.preparation.items) } }
      : {}),
  };
}

/**
 * Resolve a treatment that was created PURELY from the CMS (no code-registry
 * entry). Used by the dynamic `/treatments/[slug]` route. All defaults are
 * derived from the CMS doc's name/shortName so the page renders meaningfully
 * even when content sections are still empty.
 */
export function resolvePureCMSTreatment(src: NonNullable<TreatmentSource>): ResolvedTreatment {
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
    hero: {
      ...(s.hero ?? {}),
      eyebrow: r.hero.eyebrow,
      h1: r.hero.h1,
      h1Em: r.hero.h1Em,
      tagline: r.hero.tagline,
      badges: r.hero.badges.map(v),
      image: r.hero.image,
      imageAlt: r.hero.imageAlt,
    },
    whatIs: {
      ...(s.whatIs ?? {}),
      heading: r.whatIs.heading,
      paragraphs: r.whatIs.paragraphs.map(tx),
      ...(r.whatIs.aside ? { aside: { title: r.whatIs.aside.title, body: r.whatIs.aside.body } } : {}),
    },
    benefits: { ...(s.benefits ?? {}), heading: r.benefits.heading, ...(r.benefits.subtitle ? { subtitle: r.benefits.subtitle } : {}), items: r.benefits.items.map(v) },
    whoNeedsIt: { ...(s.whoNeedsIt ?? {}), heading: r.whoNeedsIt.heading, ...(r.whoNeedsIt.subtitle ? { subtitle: r.whoNeedsIt.subtitle } : {}), items: r.whoNeedsIt.items.map(v) },
    process: {
      ...(s.process ?? {}),
      heading: r.process.heading,
      ...(r.process.subtitle ? { subtitle: r.process.subtitle } : {}),
      steps: r.process.steps,
      ...(r.process.note ? { note: r.process.note } : {}),
    },
    success: { ...(s.success ?? {}), factors: r.success.factors.map(v), ...(r.success.note ? { note: r.success.note } : {}), heading: r.success.heading, description: r.success.description, callout: r.success.callout },
    cost: { ...(s.cost ?? {}), includes: r.cost.includes.map(v), heading: r.cost.heading, description: r.cost.description },
    risks: { ...(s.risks ?? {}), heading: r.risks.heading, ...(r.risks.subtitle ? { subtitle: r.risks.subtitle } : {}), items: r.risks.items },
    faqs: r.faqs,
    related: r.related.map((slug) => ({ slug })),
    cta: { ...(s.cta ?? {}), heading: r.cta.heading, headingEm: r.cta.headingEm, ...(r.cta.subtitle ? { subtitle: r.cta.subtitle } : {}) },
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
