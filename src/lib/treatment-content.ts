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
  success: { factors: string[]; note?: string };
  cost: { includes: string[] };
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
    success: { factors: [...t.success.factors], ...(t.success.note ? { note: t.success.note } : {}) },
    cost: { includes: [...t.cost.includes] },
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
        image?: string | null; imageAlt?: string | null;
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
      success?: { factors?: ValueItem[] | null; note?: string | null } | null;
      cost?: { includes?: ValueItem[] | null } | null;
      risks?: { heading?: HeadingSource; subtitle?: string | null; items?: { t?: string | null; d?: string | null; help?: string | null }[] | null } | null;
      preparation?: { heading?: HeadingSource; subtitle?: string | null; items?: ValueItem[] | null } | null;
      faqs?: { q?: string | null; a?: string | null }[] | null;
      related?: { slug?: string | null }[] | null;
      cta?: { heading?: string | null; headingEm?: string | null; subtitle?: string | null } | null;
    }
  | null
  | undefined;

const heading = (h: HeadingSource, def: Heading): Heading =>
  h?.lead ? { lead: h.lead, ...(h.em ? { em: h.em } : {}) } : def;
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
  if (!def) return undefined; // unknown slug — no template/registry behind it
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
          image: src.hero.image || base.hero.image,
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
    success: src.success?.factors?.length
      ? { factors: values(src.success.factors), ...(src.success.note ? { note: src.success.note } : {}) }
      : base.success,
    cost: src.cost?.includes?.length ? { includes: values(src.cost.includes) } : base.cost,
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
