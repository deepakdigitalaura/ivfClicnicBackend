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
import type { NavTreatmentItem, NavDoctorItem } from "@/lib/header";

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

/** Build treatment FooterGroups from CMS nav treatments, in canonical category order. */
function buildTreatmentGroups(navTreatments: NavTreatmentItem[]): FooterGroup[] {
  const byCat = new Map<string, NavTreatmentItem[]>();
  for (const t of navTreatments) {
    if (!FOOTER_CATEGORY_LABELS[t.navCategory]) continue;
    const arr = byCat.get(t.navCategory) ?? [];
    arr.push(t);
    byCat.set(t.navCategory, arr);
  }
  return FOOTER_CATEGORY_ORDER
    .filter((cat) => byCat.has(cat))
    .map((cat) => ({
      h: FOOTER_CATEGORY_LABELS[cat],
      l: byCat.get(cat)!
        .sort((a, b) => a.navOrder - b.navOrder)
        .map((t) => ({ label: t.name, href: t.href })),
    }));
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
      { label: "Book Consultation", href: "/#book" },
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
      { label: "IUI", href: "/intra-uterine-insemination-iui" },
      { label: "ICSI", href: "/icsi-treatment-intracytoplasmic-sperm-injection" },
      { label: "PICSI", href: "/physiological-intracytoplasmic-sperm-injection-picsi" },
      { label: "IMSI", href: "/intracytoplasmic-morphologically-selected-sperm-injection-imsi" },
      { label: "MACS", href: "/magnetic-activated-cell-sorting-macs" },
      { label: "Spindle View ICSI", href: "/spindle-view-icsi" },
      { label: "Blastocyst Transfer", href: "/blastocyst-culture-blastocyst-transfer" },
      { label: "Laser Hatching", href: "/laser-assisted-hatching" },
      { label: "PGT-A / PGT-M", href: "/pgt" },
    ]},
    { h: "Male Infertility", l: [
      { label: "Low Sperm Count (Oligospermia)", href: "/oligospermia" },
      { label: "Low Sperm Motility (Asthenospermia)", href: "/asthenospermia" },
      { label: "Zero Sperm Count (Azoospermia)", href: "/azoospermia" },
      { label: "PESA / TESA / TESE / Micro TESE", href: "/surgical-sperm-retrieval" },
      { label: "Varicocele / Micro Surgery", href: "/varicocele" },
      { label: "Erectile Dysfunction", href: "/erectile-dysfunction" },
    ]},
    { h: "Female Infertility", l: [
      { label: "Conceive Naturally", href: "/conceive-naturally" },
      { label: "PRP Infertility", href: "/prp-infertility" },
      { label: "PCOS", href: "/pcos" },
      { label: "Poor Ovarian Reserve / Low Egg Count / Low AMH", href: "/ovarian-reserve" },
      { label: "Ovarian Rejuvenation", href: "/ovarian-rejuvenation" },
      { label: "Fibroid", href: "/fibroids" },
      { label: "Endometriosis", href: "/endometriosis" },
    ]},
    { h: "Donor Services", l: [
      { label: "Egg Donation", href: "/egg-donation" },
      { label: "Sperm Donation", href: "/sperm-donation" },
      { label: "Embryo Donation", href: "/embryo-donation" },
      { label: "Surrogacy", href: "/surrogacy" },
    ]},
    { h: "Fertility Preservation", l: [
      { label: "Cryopreservation", href: "/cryopreservation" },
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
      { label: "Book Consultation", href: "/#book" },
    ]},
    { h: "Locations", l: [
      { label: "Ahmedabad", href: "/locations/ahmedabad" },
      { label: "Mumbai", href: "/locations/mumbai" },
      { label: "Surat", href: "/locations/surat" },
      { label: "Vadodara", href: "/locations/vadodara" },
      { label: "Bhuj", href: "/locations/bhuj" },
      { label: "Varanasi", href: "/locations/varanasi" },
      { label: "All 15 Centres", href: "/#locations" },
    ]},
    { h: "Calculators", l: [
      { label: "IVF Success Rate", href: "/#tools" },
      { label: "IVF Cost Estimate", href: "/#tools" },
      { label: "AMH Interpreter", href: "/#tools" },
      { label: "Ovulation Calculator", href: "/#tools" },
      { label: "Fertile Period", href: "/#tools" },
      { label: "Semen Analysis", href: "/#tools" },
      { label: "Natural Pregnancy", href: "/#tools" },
      { label: "Miscarriage Risk", href: "/#tools" },
    ]},
    { h: "Resources", l: [
      { label: "Blog", href: destinationHref("blog") },
      { label: "Success Stories", href: "/#stories" },
      { label: "Patient Videos", href: "/#videos" },
      { label: "Events & Webinars", href: "/#events" },
    ]},
    { h: "About", l: [
      { label: "Our Story", href: "/about-bfi" },
      { label: "Suraksha Kavach", href: destinationHref("suraksha-kavach") },
      { label: "Why Bavishi Fertility Institute", href: "/#about" },
    ]},
    { h: "Contact", l: [
      { label: "Book Appointment", href: "/#book" },
      { label: "Video Consultation", href: "/#book" },
      { label: "WhatsApp Chat", href: "https://wa.me/919712622288", external: true },
      { label: "Call +91 97126 22288", href: "tel:+919712622288", external: true },
      { label: "Find a Centre", href: "/#locations" },
      { label: "Patient Support", href: "/contact" },
    ]},
  ],
  social: [],
  copyrightText: DEFAULT_COPYRIGHT,
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Refund Policy", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Sitemap", href: "#" },
  ],
};

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
