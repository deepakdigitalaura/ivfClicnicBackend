/* =====================================================================
 * Footer resolver — maps the `footer` global to the props <Footer> renders
 * (Phase 3.5B, Item 3).
 * ---------------------------------------------------------------------
 * The CMS `footer` global is the source of truth; this module shapes it into
 * the plain, client-serialisable `FooterData` consumed by the footer, falling
 * back PER-SECTION to FOOTER_DEFAULTS so the rendered HTML is byte-identical
 * when the CMS is empty (same convention as src/lib/contact.ts → SITE).
 *
 * Contact links are never duplicated: a link's `channel` resolves its href
 * from Site Settings via the Item 1 resolver (resolveCardChannel). Pure module
 * (no payload / server-only imports) — safe to bundle into the client footer.
 * ===================================================================== */
import { destinationHref } from "@/lib/internal-links";
import {
  resolveCardChannel,
  type ContactChannel,
  type ContactValues,
} from "@/lib/contact";
import type { NavTreatmentItem, NavDoctorItem, NavLocationItem } from "@/lib/header";
import { sortNavLocations } from "@/lib/header";

/** Footer heading for each navCategory value. */
const FOOTER_CATEGORY_LABELS: Record<string, string> = {
  "advanced-ivf": "IVF Treatments",
  "donor-services": "Donor Services",
  "male-infertility": "Male Infertility",
  "female-infertility": "Female Infertility",
  "fertility-preservation": "Fertility Preservation",
  "maternity-services": "Maternity Services",
};

/** Canonical treatment group order in the footer. */
const FOOTER_CATEGORY_ORDER = [
  "advanced-ivf",
  "donor-services",
  "male-infertility",
  "female-infertility",
  "fertility-preservation",
  "maternity-services",
];

/** Footer headings that correspond to treatment categories (replaced dynamically). */
const TREATMENT_HEADINGS = new Set(Object.values(FOOTER_CATEGORY_LABELS));

/**
 * Build treatment FooterGroups by overlaying CMS-published treatments onto
 * the hardcoded default items (matched by href) — mirrors
 * src/lib/header.ts buildTreatmentMega(). A treatment with no Sanity doc yet
 * keeps its exact default placement; brand-new Sanity-only treatments are
 * appended to their category group. This always returns the full group set
 * — byte-identical to FOOTER_DEFAULTS when Sanity has no treatments yet, and
 * a single treatment's data can never make the rest of a group disappear.
 * FIX for the all-or-nothing bug — do not regress to "if any treatment has
 * navCategory, use ONLY Sanity treatments" (see
 * BFI-Sanity-Fallback-Audit-Phase1-Report.md).
 */
function buildTreatmentGroups(navTreatments: NavTreatmentItem[]): FooterGroup[] {
  const live = new Map(navTreatments.map((t) => [t.href, t]));
  const byCat = new Map<string, { href: string; label: string; order: number }[]>();

  for (const [href, def] of DEFAULT_TREATMENT_ITEMS_BY_HREF) {
    const liveItem = live.get(href);
    const category = liveItem?.navCategory && FOOTER_CATEGORY_LABELS[liveItem.navCategory] ? liveItem.navCategory : def.category;
    const arr = byCat.get(category) ?? [];
    arr.push({ href, label: liveItem?.name || def.label, order: liveItem?.navOrder ?? def.order });
    byCat.set(category, arr);
  }
  for (const t of navTreatments) {
    if (DEFAULT_TREATMENT_ITEMS_BY_HREF.has(t.href) || !FOOTER_CATEGORY_LABELS[t.navCategory]) continue;
    const arr = byCat.get(t.navCategory) ?? [];
    arr.push({ href: t.href, label: t.name, order: t.navOrder });
    byCat.set(t.navCategory, arr);
  }

  return FOOTER_CATEGORY_ORDER
    .filter((cat) => byCat.has(cat))
    .map((cat) => ({
      h: FOOTER_CATEGORY_LABELS[cat],
      l: byCat.get(cat)!
        .sort((a, b) => a.order - b.order)
        .map((x) => ({ label: x.label, href: x.href })),
    }));
}

/**
 * Build the footer "Locations" group by overlaying Sanity-published cities
 * onto FOOTER_DEFAULTS' own "Locations" links (matched by city slug) —
 * mirrors src/lib/header.ts buildLocationsMega(). A city with no Sanity doc
 * yet keeps its default link; brand-new Sanity-only cities are appended.
 * Always returns the full group — byte-identical to FOOTER_DEFAULTS when
 * Sanity has no cities yet, and a single city can never make the rest
 * disappear. FIX for the all-or-nothing bug (see
 * BFI-Sanity-Fallback-Audit-Phase1-Report.md).
 */
function buildLocationsFooterGroup(navLocations: NavLocationItem[]): FooterGroup {
  const defaultGroup = FOOTER_DEFAULTS.groups.find((g) => g.h === "Locations")!;
  const live = new Map(navLocations.map((c) => [c.citySlug, c]));
  const knownSlugs = new Set<string>();

  const known = defaultGroup.l.map((link) => {
    const citySlug = link.href?.split("/")[2];
    if (citySlug) knownSlugs.add(citySlug);
    const liveCity = citySlug ? live.get(citySlug) : undefined;
    return liveCity ? { label: liveCity.cityName, href: `/locations/${liveCity.citySlug}` } : link;
  });
  const appended = sortNavLocations(navLocations.filter((c) => !knownSlugs.has(c.citySlug)))
    .map((c) => ({ label: c.cityName, href: `/locations/${c.citySlug}` }));

  return { h: "Locations", l: [...known, ...appended] };
}

/** Build the footer "Doctors" group — only senior-specialist doctors are listed
 * (they are the featured promoter doctors). All other specialists are reachable
 * via the "All Doctors" link. */
function buildDoctorFooterGroup(navDoctors: NavDoctorItem[]): FooterGroup | undefined {
  if (!navDoctors.length) return undefined;
  const senior = navDoctors
    .filter((d) => d.navRole === "senior-specialist")
    .sort((a, b) => a.navOrder - b.navOrder);
  if (!senior.length) return undefined;
  return {
    h: "Doctors",
    l: [
      ...senior.map((d) => ({ label: d.name, href: d.href })),
      { label: "All Doctors", href: "/doctors" },
      { label: "Book Consultation", href: "/contact#book" },
    ],
  };
}

export type FooterLink = { label: string; href?: string; external?: boolean };
export type FooterGroup = { h: string; l: FooterLink[] };
export type FooterSocial = { platform: string; url: string };
export type FooterBranding = { logoUrl?: string; description?: string };

/** Client-ready, fully-resolved footer content. */
export type FooterData = {
  branding?: FooterBranding;
  groups: FooterGroup[];
  social: FooterSocial[];
  /** Owner line rendered after "© <year> ". */
  copyrightText: string;
  legal: FooterLink[];
};

/** Default copyright owner line (year is prepended at render time). */
export const DEFAULT_COPYRIGHT = "Bavishi Fertility Centre. All rights reserved.";

/**
 * Typed fallback — the exact footer content as it shipped before the CMS, so
 * an empty `footer` global renders byte-identically. The seeded global mirrors
 * this (with contact links expressed as channels instead of hardcoded numbers).
 */
export const FOOTER_DEFAULTS: FooterData = {
  groups: [
    { h: "IVF Treatments", l: [
      { label: "IVF", href: "/what-is-ivf" },
      { label: "IVF Failure", href: "/ivf-failure" },
      { label: "Preimplantation Genetic Testing (PGT)", href: "/pgt" },
      { label: "IUI", href: "/intra-uterine-insemination-iui" },
      { label: "ICSI", href: "/icsi-treatment-intracytoplasmic-sperm-injection" },
      { label: "PICSI", href: "/physiological-intracytoplasmic-sperm-injection-picsi" },
      { label: "IMSI", href: "/intracytoplasmic-morphologically-selected-sperm-injection-imsi" },
      { label: "MACS", href: "/magnetic-activated-cell-sorting-macs" },
      { label: "Spindle View ICSI", href: "/spindle-view-icsi" },
      { label: "Blastocyst Transfer", href: "/blastocyst-culture-blastocyst-transfer" },
      { label: "Laser Hatching", href: "/laser-assisted-hatching" },
    ]},
    { h: "Male Infertility", l: [
      { label: "Low Sperm Count (Oligospermia)", href: "/oligospermia" },
      { label: "Low Sperm Motility (Asthenospermia)", href: "/asthenospermia" },
      { label: "Zero Sperm Count (Azoospermia)", href: "/azoospermia" },
      { label: "PESA / TESA / TESE / Micro TESE", href: "/surgical-sperm-retrieval" },
      { label: "Erectile Dysfunction", href: "/erectile-dysfunction" },
    ]},
    { h: "Female Infertility", l: [
      { label: "Conceive Naturally", href: "/conceive-naturally" },
      { label: "PRP Infertility", href: "/prp-infertility" },
      { label: "PMOS-PCOS", href: "/pcos" },
      { label: "Poor Ovarian Reserve / Low Egg Count / Low AMH", href: "/ovarian-reserve" },
      { label: "Ovarian Rejuvenation", href: "/ovarian-rejuvenation" },
      { label: "Fibroid", href: "/fibroids" },
      { label: "Endometriosis", href: "/endometriosis" },
    ]},
    { h: "Donor Services", l: [
      { label: "Egg Donation", href: "/egg-donation" },
      { label: "Sperm Donation", href: "/sperm-donation" },
    ]},
    { h: "Fertility Preservation", l: [
      { label: "Cryopreservation", href: "/cryopreservation" },
      { label: "Egg Freezing", href: "/egg-freezing" },
    ]},
    { h: "Maternity Services", l: [
      { label: "3D/4D Sonography", href: "/services/3d-4d-sonography" },
      { label: "Painless Delivery", href: "/services/painless-delivery" },
      { label: "Normal Delivery", href: "/services/normal-delivery" },
      { label: "Fetal Medicine", href: "/services/fetal-medicine" },
      { label: "High Risk Pregnancy Care", href: "/services/high-risk-pregnancy-care" },
      { label: "Twin Pregnancy Care", href: "/services/twin-pregnancy-care" },
    ]},
    { h: "Doctors", l: [
      { label: "Dr. Himanshu Bavishi", href: "/doctors/himanshu-bavishi" },
      { label: "Dr. Falguni Bavishi", href: "/doctors/falguni-bavishi" },
      { label: "Dr. Parth Bavishi", href: "/doctors/parth-bavishi" },
      { label: "Dr. Janki Bavishi", href: "/doctors/janki-bavishi" },
      { label: "All Doctors", href: "/doctors" },
      { label: "Book Consultation", href: "/contact#book" },
    ]},
    { h: "Locations", l: [
      { label: "Ahmedabad", href: "/locations/ahmedabad" },
      { label: "Mumbai", href: "/locations/mumbai" },
      { label: "Surat", href: "/locations/surat" },
      { label: "Vadodara", href: "/locations/vadodara" },
      { label: "Bhuj", href: "/locations/bhuj" },
      { label: "Varanasi", href: "/locations/varanasi" },
    ]},
    { h: "Calculators", l: [
      { label: "IVF Success Rate", href: "/calculators/ivf-success-rate" },
      { label: "IVF Cost Estimate", href: "/calculators/ivf-cost" },
      { label: "AMH Interpreter", href: "/calculators/amh-level" },
      { label: "Ovulation Calculator", href: "/calculators/ovulation" },
      { label: "Fertile Period", href: "/calculators/fertile-period" },
      { label: "Semen Analysis", href: "/calculators/semen-analysis" },
      { label: "Natural Pregnancy", href: "/calculators/natural-pregnancy" },
      { label: "Miscarriage Risk", href: "/calculators/miscarriage-risk" },
    ]},
    { h: "Resources", l: [
      { label: "Blog", href: destinationHref("blog") },
      { label: "Testimonial Videos", href: "/testimonial-videos" },
      { label: "Educational Videos", href: "/education-videos" },
      { label: "CME", href: "/cme" },
      { label: "Media & Press", href: "/press" },
      { label: "Awards & Achievements", href: "/awards" },
    ]},
    { h: "About", l: [
      { label: "Our Story", href: "/about-bfi" },
      { label: "Suraksha Kavach", href: destinationHref("suraksha-kavach") },
      { label: "Why Bavishi Fertility Institute", href: "/why-bfi" },
    ]},
    { h: "Contact", l: [
      { label: "Book Appointment", href: "/contact#book" },
      { label: "Call +91 97126 22288", href: "tel:+919712622288", external: true },
    ]},
  ],
  social: [],
  copyrightText: DEFAULT_COPYRIGHT,
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "Sitemap", href: "/sitemap" },
  ],
};

/** Default {category, order, label} per treatment href, derived once from
 *  FOOTER_DEFAULTS' own treatment-category groups — the merge target
 *  buildTreatmentGroups() above overlays Sanity-published treatments onto.
 *  (Built from the footer's OWN defaults, not header's — the two hardcoded
 *  lists aren't identical, e.g. footer alone carries PGT-A/PGT-M and
 *  Surrogacy, so each file must merge against its own baseline to stay
 *  byte-identical when Sanity is empty. Declared here, after FOOTER_DEFAULTS,
 *  so the IIFE below can read it.) */
const DEFAULT_TREATMENT_ITEMS_BY_HREF: ReadonlyMap<string, { category: string; order: number; label: string }> = (() => {
  const byLabel = new Map(Object.entries(FOOTER_CATEGORY_LABELS).map(([cat, label]) => [label, cat]));
  const map = new Map<string, { category: string; order: number; label: string }>();
  for (const grp of FOOTER_DEFAULTS.groups) {
    const category = byLabel.get(grp.h);
    if (!category) continue;
    grp.l.forEach((link, i) => {
      if (link.href) map.set(link.href, { category, order: i, label: link.label });
    });
  }
  return map;
})();

/** The subset of the `footer` global this resolver reads (kept loose so it
 *  stays decoupled from the generated payload-types until they exist). */
type FooterLinkSource = {
  label?: string | null;
  url?: string | null;
  external?: boolean | null;
  channel?: string | null;
  hidden?: boolean | null;
};
export type FooterSource =
  | {
      branding?: { logoUrl?: string | null; description?: string | null } | null;
      navGroups?: { title?: string | null; hidden?: boolean | null; links?: FooterLinkSource[] | null }[] | null;
      social?: { platform?: string | null; url?: string | null }[] | null;
      copyrightText?: string | null;
      legalLinks?: FooterLinkSource[] | null;
    }
  | null
  | undefined;

/** Resolve a stored link → rendered link. A `channel` resolves the href from
 *  Site Settings (no duplicated numbers); otherwise the stored url is used. */
function resolveLink(link: FooterLinkSource, contact: ContactValues): FooterLink {
  const channel = (link.channel ?? "none") as ContactChannel;
  const resolved = resolveCardChannel(channel, contact);
  const href = resolved.href ?? link.url ?? undefined;
  return {
    label: link.label ?? "",
    ...(href ? { href } : {}),
    ...(link.external ? { external: true } : {}),
  };
}

/**
 * Map the `footer` global → FooterData, resolving contact channels against the
 * canonical `contact` values and falling back per-section to FOOTER_DEFAULTS.
 *
 * When `navTreatments` is provided, treatment-category groups are replaced
 * dynamically. When `navDoctors` is provided, the "Doctors" footer group is
 * replaced with the CMS list — so adding a doctor in admin reflects automatically.
 */
export function resolveFooter(
  g: FooterSource,
  contact: ContactValues,
  navTreatments: NavTreatmentItem[] = [],
  navDoctors: NavDoctorItem[] = [],
  navLocations: NavLocationItem[] = [],
): FooterData {
  const branding =
    g?.branding && (g.branding.logoUrl || g.branding.description)
      ? {
          logoUrl: g.branding.logoUrl ?? undefined,
          description: g.branding.description ?? undefined,
        }
      : undefined;

  // Base groups from CMS global or defaults (treatment groups included).
  const rawGroups: FooterGroup[] = g?.navGroups?.length
    ? g.navGroups
        .filter((grp) => !grp.hidden)
        .map((grp) => ({
          h: grp.title ?? "",
          l: (grp.links ?? []).filter((link) => !link.hidden).map((link) => resolveLink(link, contact)),
        }))
    : FOOTER_DEFAULTS.groups;

  // If CMS has treatments with navCategory set, replace the treatment-category
  // groups with dynamic ones. Non-treatment groups (Doctors, Locations, etc.)
  // stay in their original position. Falls back to the hardcoded groups when
  // no treatments have a category yet (safe during the initial migration).
  let groups: FooterGroup[];
  if (navTreatments.length > 0) {
    const dynamicTreatmentGroups = buildTreatmentGroups(navTreatments);
    const dynamicByHeading = new Map(dynamicTreatmentGroups.map((g) => [g.h, g]));
    const presentHeadings = new Set(dynamicTreatmentGroups.map((g) => g.h));

    // Replace existing treatment groups with dynamic ones; keep non-treatment groups.
    const replaced = rawGroups.map((grp) =>
      TREATMENT_HEADINGS.has(grp.h) && presentHeadings.has(grp.h)
        ? dynamicByHeading.get(grp.h)!
        : grp,
    );
    // Prepend any new treatment categories that weren't in the original groups.
    const existingHeadings = new Set(rawGroups.map((g) => g.h));
    const newGroups = dynamicTreatmentGroups.filter((g) => !existingHeadings.has(g.h));
    groups = [...newGroups, ...replaced];
  } else {
    groups = rawGroups;
  }

  // Replace the "Doctors" group with a dynamic one built from CMS nav doctors.
  const dynamicDoctorGroup = buildDoctorFooterGroup(navDoctors);
  if (dynamicDoctorGroup) {
    groups = groups.map((grp) => grp.h === "Doctors" ? dynamicDoctorGroup : grp);
  }

  // Replace the "Locations" group with a dynamic one built from CMS cities/centres.
  const dynamicLocationsGroup = buildLocationsFooterGroup(navLocations);
  if (dynamicLocationsGroup) {
    groups = groups.map((grp) => grp.h === "Locations" ? dynamicLocationsGroup : grp);
  }

  const social = g?.social?.length
    ? g.social
        .filter((s) => s.platform && s.url)
        .map((s) => ({ platform: s.platform as string, url: s.url as string }))
    : FOOTER_DEFAULTS.social;

  const legal = g?.legalLinks?.length
    ? g.legalLinks.filter((link) => !link.hidden).map((link) => resolveLink(link, contact))
    : FOOTER_DEFAULTS.legal;

  return {
    ...(branding ? { branding } : {}),
    groups,
    social,
    copyrightText: g?.copyrightText || FOOTER_DEFAULTS.copyrightText,
    legal,
  };
}
