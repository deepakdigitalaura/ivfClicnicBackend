/* =====================================================================
 * Services resolver — maps the `services` collection doc to the plain,
 * client-serialisable model the maternity <ServicePage> renders, and that
 * serviceGraph() turns into JSON-LD (Phase 4.1).
 * ---------------------------------------------------------------------
 * The CMS `services` collection is the source of truth; this module shapes a
 * doc into `ResolvedService`, falling back PER-SECTION to the typed defaults in
 * src/lib/womens-health.ts (SERVICE_CONTENT) so an empty/unavailable CMS renders
 * byte-identically (same convention as src/lib/footer.ts → FOOTER_DEFAULTS).
 *
 * ICONS: the resolved model carries icon NAMES (strings), never Lucide
 * components — so it crosses the server→client boundary as props. The template
 * maps names → components via ICON_MAP (src/lib/icon-map.ts). The code defaults
 * still hold real components, so toResolved() serialises them via iconKey().
 *
 * Pure module (no payload / server-only imports) — safe to bundle into the
 * client <ServicePage> (used as the in-browser fallback when no props arrive).
 * ===================================================================== */
import { iconKey, type IconName } from "@/lib/icon-map";
import { mediaUrl, type UploadValue } from "@/fields/image";
import {
  SERVICE_CONTENT,
  relatedServices,
  serviceHref,
  type ServiceContent,
  type ServiceHeading,
} from "@/lib/womens-health";

/* ---------- Resolved (serialisable) model — mirrors ServiceContent ---------- */
export type ResolvedStep = { icon: IconName; t: string; d: string };
export type ResolvedRelated = { key: string; name: string; desc: string; icon: IconName; href: string };

export type ResolvedService = {
  key: string;
  slug: string;
  schemaType: "MedicalProcedure" | "MedicalTest" | "MedicalTherapy";
  shortName: string;
  meta: { title: string; description: string };
  breadcrumbName: string;
  reviewerSlug: string;
  lastReviewed: string;
  hero: { eyebrow: string; h1: string; h1Em: string; tagline: string; badges: string[]; image: string; imageAlt: string };
  overview: { heading: ServiceHeading; paragraphs: string[]; aside?: { title: string; body: string } };
  benefits: { heading: ServiceHeading; subtitle?: string; items: string[] };
  whoFor: { heading: ServiceHeading; subtitle?: string; items: string[] };
  process: { heading: ServiceHeading; subtitle?: string; steps: ResolvedStep[]; note?: string };
  whyUs: { heading: ServiceHeading; items: ResolvedStep[] };
  infoNote?: { heading: ServiceHeading; paragraphs: string[] };
  faqs: { q: string; a: string }[];
  related: ResolvedRelated[];
  /** Per-page overrides for the template section labels (eyebrows). Empty/
   *  missing → the component's built-in default renders (byte-identical). */
  sectionLabels?: ServiceSectionLabels;
};

export type ServiceSectionLabels = {
  benefitsEyebrow?: string;
  whoForEyebrow?: string;
  processEyebrow?: string;
  whyUsEyebrow?: string;
  infoNoteEyebrow?: string;
  faqEyebrow?: string;
  relatedEyebrow?: string;
  visitEyebrow?: string;
};

/** Resolve a service's related-service KEYS → serialisable cards (registry +
 *  published-gated href). The registry stays code-owned in 4.1, so this is
 *  identical for both the CMS and fallback paths. */
function resolveRelated(keys: string[]): ResolvedRelated[] {
  return relatedServices(keys).map((r) => ({
    key: r.key,
    name: r.name,
    desc: r.desc,
    icon: iconKey(r.icon),
    href: serviceHref(r),
  }));
}

/** Serialise a typed code default (icon components → names) into the resolved
 *  model. This is the byte-identical fallback path. */
export function toResolved(def: ServiceContent): ResolvedService {
  return {
    key: def.key,
    slug: def.slug,
    schemaType: def.schemaType,
    shortName: def.shortName,
    meta: { title: def.meta.title, description: def.meta.description },
    breadcrumbName: def.breadcrumbName,
    reviewerSlug: def.reviewerSlug,
    lastReviewed: def.lastReviewed,
    hero: { ...def.hero, badges: [...def.hero.badges] },
    overview: {
      heading: def.overview.heading,
      paragraphs: [...def.overview.paragraphs],
      ...(def.overview.aside ? { aside: def.overview.aside } : {}),
    },
    benefits: { heading: def.benefits.heading, ...(def.benefits.subtitle ? { subtitle: def.benefits.subtitle } : {}), items: [...def.benefits.items] },
    whoFor: { heading: def.whoFor.heading, ...(def.whoFor.subtitle ? { subtitle: def.whoFor.subtitle } : {}), items: [...def.whoFor.items] },
    process: {
      heading: def.process.heading,
      ...(def.process.subtitle ? { subtitle: def.process.subtitle } : {}),
      steps: def.process.steps.map((s) => ({ icon: iconKey(s.icon), t: s.t, d: s.d })),
      ...(def.process.note ? { note: def.process.note } : {}),
    },
    whyUs: { heading: def.whyUs.heading, items: def.whyUs.items.map((w) => ({ icon: iconKey(w.icon), t: w.t, d: w.d })) },
    ...(def.infoNote ? { infoNote: { heading: def.infoNote.heading, paragraphs: [...def.infoNote.paragraphs] } } : {}),
    faqs: def.faqs.map((f) => ({ q: f.q, a: f.a })),
    related: resolveRelated(def.related),
  };
}

/** Resolve content for a slug straight from the code defaults (no CMS). Used by
 *  the client template as a back-compat fallback when no props are supplied. */
export function resolveServiceFromCode(slug: string): ResolvedService | undefined {
  const def = SERVICE_CONTENT[slug];
  return def ? toResolved(def) : undefined;
}

/* =====================================================================
 * CMS source shape (kept loose so it stays decoupled from the generated
 * payload-types, same convention as FooterSource/HeaderSource).
 * ===================================================================== */
type HeadingSource = { lead?: string | null; em?: string | null } | null | undefined;
type TextItem = { text?: string | null };
type StepSource = { icon?: string | null; t?: string | null; d?: string | null };
export type ServiceSource =
  | {
      slug?: string | null;
      schemaType?: string | null;
      shortName?: string | null;
      breadcrumbName?: string | null;
      reviewerSlug?: string | null;
      lastReviewed?: string | null;
      seo?: { metaTitle?: string | null; metaDescription?: string | null } | null;
      hero?: {
        eyebrow?: string | null; h1?: string | null; h1Em?: string | null;
        tagline?: string | null; badges?: { badge?: string | null }[] | null;
        image?: string | null; imageAlt?: string | null; heroPhoto?: UploadValue;
      } | null;
      overview?: {
        heading?: HeadingSource; paragraphs?: TextItem[] | null;
        aside?: { title?: string | null; body?: string | null } | null;
      } | null;
      benefits?: { heading?: HeadingSource; subtitle?: string | null; items?: { item?: string | null }[] | null } | null;
      whoFor?: { heading?: HeadingSource; subtitle?: string | null; items?: { item?: string | null }[] | null } | null;
      process?: { heading?: HeadingSource; subtitle?: string | null; steps?: StepSource[] | null; note?: string | null } | null;
      whyUs?: { heading?: HeadingSource; items?: StepSource[] | null } | null;
      infoNote?: { heading?: HeadingSource; paragraphs?: TextItem[] | null } | null;
      faqs?: { q?: string | null; a?: string | null }[] | null;
      related?: { key?: string | null }[] | null;
      sectionLabels?: { [K in keyof ServiceSectionLabels]?: string | null } | null;
    }
  | null
  | undefined;

const heading = (h: HeadingSource, def: ServiceHeading): ServiceHeading =>
  h?.lead ? { lead: h.lead, ...(h.em ? { em: h.em } : {}) } : def;
const texts = (a: TextItem[] | null | undefined): string[] =>
  (a ?? []).map((x) => x.text ?? "").filter(Boolean);
const items = (a: { item?: string | null }[] | null | undefined): string[] =>
  (a ?? []).map((x) => x.item ?? "").filter(Boolean);
const steps = (a: StepSource[] | null | undefined): ResolvedStep[] =>
  (a ?? []).map((s) => ({ icon: (s.icon ?? "Sparkles") as IconName, t: s.t ?? "", d: s.d ?? "" }));

/**
 * Map a `services` doc → ResolvedService, falling back PER-SECTION to the typed
 * default for `slug` so an empty/partial CMS renders byte-identically. Returns
 * undefined for an unknown slug with no default (caller → notFound).
 */
export function resolveService(slug: string, src: ServiceSource): ResolvedService | undefined {
  const def = SERVICE_CONTENT[slug];
  if (!src) return def ? toResolved(def) : undefined;
  if (!def) return undefined; // unknown slug — no template/registry behind it
  const base = toResolved(def);

  return {
    ...base,
    schemaType: (src.schemaType as ResolvedService["schemaType"]) || base.schemaType,
    shortName: src.shortName || base.shortName,
    breadcrumbName: src.breadcrumbName || base.breadcrumbName,
    reviewerSlug: src.reviewerSlug || base.reviewerSlug,
    lastReviewed: src.lastReviewed || base.lastReviewed,
    meta: {
      title: src.seo?.metaTitle || base.meta.title,
      description: src.seo?.metaDescription || base.meta.description,
    },
    hero: src.hero?.h1
      ? {
          eyebrow: src.hero.eyebrow ?? base.hero.eyebrow,
          h1: src.hero.h1,
          h1Em: src.hero.h1Em ?? base.hero.h1Em,
          tagline: src.hero.tagline ?? base.hero.tagline,
          badges: src.hero.badges?.length ? src.hero.badges.map((b) => b.badge ?? "").filter(Boolean) : base.hero.badges,
          image: mediaUrl(src.hero.heroPhoto) ?? (src.hero.image || base.hero.image),
          imageAlt: src.hero.imageAlt ?? base.hero.imageAlt,
        }
      : base.hero,
    overview: src.overview?.paragraphs?.length
      ? {
          heading: heading(src.overview.heading, base.overview.heading),
          paragraphs: texts(src.overview.paragraphs),
          ...(src.overview.aside?.title
            ? { aside: { title: src.overview.aside.title, body: src.overview.aside.body ?? "" } }
            : base.overview.aside
              ? { aside: base.overview.aside }
              : {}),
        }
      : base.overview,
    benefits: src.benefits?.items?.length
      ? { heading: heading(src.benefits.heading, base.benefits.heading), ...(src.benefits.subtitle ? { subtitle: src.benefits.subtitle } : {}), items: items(src.benefits.items) }
      : base.benefits,
    whoFor: src.whoFor?.items?.length
      ? { heading: heading(src.whoFor.heading, base.whoFor.heading), ...(src.whoFor.subtitle ? { subtitle: src.whoFor.subtitle } : {}), items: items(src.whoFor.items) }
      : base.whoFor,
    process: src.process?.steps?.length
      ? {
          heading: heading(src.process.heading, base.process.heading),
          ...(src.process.subtitle ? { subtitle: src.process.subtitle } : {}),
          steps: steps(src.process.steps),
          ...(src.process.note ? { note: src.process.note } : {}),
        }
      : base.process,
    whyUs: src.whyUs?.items?.length
      ? { heading: heading(src.whyUs.heading, base.whyUs.heading), items: steps(src.whyUs.items) }
      : base.whyUs,
    // Optional section — conditional spread (never an explicit `undefined` key)
    // so this matches toResolved()'s shape exactly. `...base` already carries the
    // default's infoNote when present and the doc omits it.
    ...(src.infoNote?.paragraphs?.length
      ? { infoNote: { heading: heading(src.infoNote.heading, base.infoNote?.heading ?? { lead: "" }), paragraphs: texts(src.infoNote.paragraphs) } }
      : {}),
    faqs: src.faqs?.length ? src.faqs.map((f) => ({ q: f.q ?? "", a: f.a ?? "" })) : base.faqs,
    related: src.related?.length ? resolveRelated(src.related.map((r) => r.key ?? "").filter(Boolean)) : base.related,
    sectionLabels: {
      benefitsEyebrow: src.sectionLabels?.benefitsEyebrow ?? "",
      whoForEyebrow: src.sectionLabels?.whoForEyebrow ?? "",
      processEyebrow: src.sectionLabels?.processEyebrow ?? "",
      whyUsEyebrow: src.sectionLabels?.whyUsEyebrow ?? "",
      infoNoteEyebrow: src.sectionLabels?.infoNoteEyebrow ?? "",
      faqEyebrow: src.sectionLabels?.faqEyebrow ?? "",
      relatedEyebrow: src.sectionLabels?.relatedEyebrow ?? "",
      visitEyebrow: src.sectionLabels?.visitEyebrow ?? "",
    },
  };
}

/**
 * Produce a fully-populated ServiceSource by merging `src` with the resolved
 * (default-overlaid) content for `slug`. Used by the inline editor to seed the
 * draft so every section/row/field is present before any edit — prevents sparse
 * PATCH bodies that fail Payload required-field validation (same convention as
 * materializeTreatmentSource / materializeDoctorSource).
 */
export function materializeServiceSource(slug: string, src: ServiceSource): NonNullable<ServiceSource> {
  const r = resolveService(slug, src);
  const s = (src ?? {}) as NonNullable<ServiceSource>;
  if (!r) return s; // unknown slug — nothing to seed
  const badge = (b: string) => ({ badge: b });
  const text = (t: string) => ({ text: t });
  const item = (i: string) => ({ item: i });
  const head = (h: ServiceHeading) => ({ lead: h.lead, ...(h.em ? { em: h.em } : {}) });
  return {
    ...s,
    slug: r.slug,
    schemaType: r.schemaType,
    shortName: r.shortName,
    breadcrumbName: r.breadcrumbName,
    reviewerSlug: r.reviewerSlug,
    lastReviewed: r.lastReviewed,
    seo: { metaTitle: r.meta.title, metaDescription: r.meta.description },
    hero: {
      ...(s.hero ?? {}),
      eyebrow: r.hero.eyebrow,
      h1: r.hero.h1,
      h1Em: r.hero.h1Em,
      tagline: r.hero.tagline,
      badges: r.hero.badges.map(badge),
      image: r.hero.image,
      imageAlt: r.hero.imageAlt,
    },
    overview: {
      ...(s.overview ?? {}),
      heading: head(r.overview.heading),
      paragraphs: r.overview.paragraphs.map(text),
      ...(r.overview.aside ? { aside: { title: r.overview.aside.title, body: r.overview.aside.body } } : {}),
    },
    benefits: {
      ...(s.benefits ?? {}),
      heading: head(r.benefits.heading),
      ...(r.benefits.subtitle ? { subtitle: r.benefits.subtitle } : {}),
      items: r.benefits.items.map(item),
    },
    whoFor: {
      ...(s.whoFor ?? {}),
      heading: head(r.whoFor.heading),
      ...(r.whoFor.subtitle ? { subtitle: r.whoFor.subtitle } : {}),
      items: r.whoFor.items.map(item),
    },
    process: {
      ...(s.process ?? {}),
      heading: head(r.process.heading),
      ...(r.process.subtitle ? { subtitle: r.process.subtitle } : {}),
      steps: r.process.steps.map((st) => ({ icon: st.icon, t: st.t, d: st.d })),
      ...(r.process.note ? { note: r.process.note } : {}),
    },
    whyUs: {
      ...(s.whyUs ?? {}),
      heading: head(r.whyUs.heading),
      items: r.whyUs.items.map((w) => ({ icon: w.icon, t: w.t, d: w.d })),
    },
    ...(r.infoNote
      ? { infoNote: { ...(s.infoNote ?? {}), heading: head(r.infoNote.heading), paragraphs: r.infoNote.paragraphs.map(text) } }
      : {}),
    faqs: r.faqs.map((f) => ({ q: f.q, a: f.a })),
    related: r.related.map((rel) => ({ key: rel.key })),
    sectionLabels: {
      benefitsEyebrow: s.sectionLabels?.benefitsEyebrow ?? "",
      whoForEyebrow: s.sectionLabels?.whoForEyebrow ?? "",
      processEyebrow: s.sectionLabels?.processEyebrow ?? "",
      whyUsEyebrow: s.sectionLabels?.whyUsEyebrow ?? "",
      infoNoteEyebrow: s.sectionLabels?.infoNoteEyebrow ?? "",
      faqEyebrow: s.sectionLabels?.faqEyebrow ?? "",
      relatedEyebrow: s.sectionLabels?.relatedEyebrow ?? "",
      visitEyebrow: s.sectionLabels?.visitEyebrow ?? "",
    },
  };
}
