/* =====================================================================
 * Header resolver — maps the `header` global to the props <SiteHeader>
 * renders (Phase 3.5B, Item 4).
 * ---------------------------------------------------------------------
 * The CMS `header` global is the source of truth; this module shapes it into
 * the plain, client-serialisable `HeaderData` consumed by <SiteHeader>,
 * falling back PER-SECTION to HEADER_DEFAULTS so the rendered HTML is
 * byte-identical when the CMS is empty (same convention as src/lib/footer.ts).
 *
 * The "Doctors" mega panel stays data-driven from src/lib/doctors.ts (NOT the
 * CMS) — a nav item only carries `doctors: true`, and <SiteHeader> renders the
 * compact doctor-first panel from doctorMenuData(). This keeps the doctor menu
 * in sync with the DOCTORS entity list and leaves Doctors-CMS out of scope.
 *
 * Pure module (no payload / server-only imports) — safe to bundle into the
 * client <SiteHeader>.
 * ===================================================================== */
import { destinationHref } from "@/lib/internal-links";

/** A single link inside a mega-menu column (optionally with a nested list). */
export type HeaderMegaItem = {
  label: string;
  href: string;
  desc?: string;
  children?: { label: string; href: string }[];
};
/** One column of a mega menu (heading may link to a hub via headingHref). */
export type HeaderMegaCol = { heading: string; headingHref?: string; items: HeaderMegaItem[] };
/** A top-level navigation entry: a plain link, a mega menu, or the data-driven
 *  Doctors panel (doctors: true). */
export type HeaderNavItem = {
  label: string;
  href?: string;
  openInNewTab?: boolean;
  mega?: HeaderMegaCol[];
  /** Force the mega grid to N columns (defaults to the column count). */
  megaCols?: number;
  /** Render the data-driven Doctors mega panel (see src/lib/doctors.ts). */
  doctors?: boolean;
};
/** Header branding — drives the logo shown in the bar + mobile drawer. */
export type HeaderBranding = { logoUrl: string; logoAlt: string };
/** Primary call-to-action button (Book Appointment). */
export type HeaderCta = { label: string; href: string; styleVariant?: string };

/** Client-ready, fully-resolved header content. */
export type HeaderData = {
  branding: HeaderBranding;
  nav: HeaderNavItem[];
  cta: HeaderCta;
};

/**
 * Typed fallback — the exact header content as it shipped before the CMS, so an
 * empty `header` global renders byte-identically. The seeded global mirrors this.
 */
export const HEADER_DEFAULTS: HeaderData = {
  branding: { logoUrl: "/assets/logo.png", logoAlt: "Bavishi Fertility Institute" },
  nav: [
    {
      label: "About",
      mega: [
        { heading: "", items: [
          { label: "About Bavishi Fertility Institute", href: "/about-bfi" },
          { label: "Why Bavishi Fertility Institute", href: "/#about" },
          { label: "Simple Treatment", href: "/#about" },
          { label: "Safe Treatment", href: "/#about" },
          { label: "Smart Treatment", href: "/#about" },
          { label: "Success Benchmarks", href: "/#about" },
        ]},
        { heading: "", items: [
          { label: "History", href: "/#about" },
          { label: "Our Team", href: "/#doctors" },
          { label: "Infrastructure", href: "/#about" },
          { label: "Suraksha Kavach Package", href: destinationHref("suraksha-kavach") },
          { label: "Easy / Interest Free EMI", href: "/#about" },
        ]},
      ],
    },
    {
      label: "Doctors",
      doctors: true,
    },
    {
      label: "IVF Treatments",
      mega: [
        { heading: "Advanced IVF Treatment", items: [
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
        ]},
        { heading: "Donor Services", items: [
          { label: "Egg Donation", href: "/egg-donation" },
          { label: "Sperm Donation", href: "/sperm-donation" },
          { label: "Embryo Donation", href: "/embryo-donation" },
        ]},
        { heading: "Male Infertility", items: [
          { label: "Low Sperm Count (Oligospermia)", href: "/oligospermia" },
          { label: "Low Sperm Motility (Asthenospermia)", href: "/asthenospermia" },
          { label: "Zero Sperm Count (Azoospermia)", href: "/azoospermia" },
          { label: "PESA / TESA / TESE / Micro TESE", href: "/surgical-sperm-retrieval" },
          { label: "Varicocele / Micro Surgery", href: "/varicocele" },
          { label: "Erectile Dysfunction", href: "/erectile-dysfunction" },
        ]},
        { heading: "Female Infertility", items: [
          { label: "Conceive Naturally", href: "/conceive-naturally" },
          { label: "PRP Infertility", href: "/prp-infertility" },
          { label: "PCOS", href: "/pcos" },
          { label: "Poor Ovarian Reserve / Low Egg Count / Low AMH", href: "/ovarian-reserve" },
          { label: "Ovarian Rejuvenation", href: "/ovarian-rejuvenation" },
          { label: "Fibroid", href: "/fibroids" },
          { label: "Endometriosis", href: "/endometriosis" },
        ]},
        { heading: "Fertility Preservation", items: [
          { label: "Cryopreservation", href: "/cryopreservation" },
        ]},
      ],
    },
    {
      label: "Maternity Services",
      mega: [
        { heading: "", items: [
          { label: "3D/4D Sonography", href: "/services/3d-4d-sonography" },
          { label: "Painless Delivery", href: "/services/painless-delivery" },
          { label: "Normal Delivery", href: "/services/normal-delivery" },
        ]},
        { heading: "", items: [
          { label: "Fetal Medicine", href: "/services/fetal-medicine" },
          { label: "High Risk Pregnancy Care", href: "/services/high-risk-pregnancy-care" },
          { label: "Twin Pregnancy Care", href: "/services/twin-pregnancy-care" },
        ]},
      ],
    },
    {
      label: "Locations",
      megaCols: 4,
      mega: [
        { heading: "Ahmedabad", headingHref: "/locations/ahmedabad", items: [
          { label: "Paldi", href: "/locations/ahmedabad/paldi" },
          { label: "Sindhu Bhavan Road", href: "/locations/ahmedabad/sindhu-bhavan-road" },
          { label: "Nikol", href: "/locations/ahmedabad/nikol" },
        ]},
        { heading: "Mumbai", headingHref: "/locations/mumbai", items: [
          { label: "Ghatkopar", href: "/locations/mumbai/ghatkopar" },
          { label: "Thane", href: "/locations/mumbai/thane" },
          { label: "Vile Parle", href: "/locations/mumbai/vile-parle" },
          { label: "Borivali", href: "/locations/mumbai/borivali" },
          { label: "Vashi", href: "/locations/mumbai/vashi" },
        ]},
        { heading: "Vadodara", items: [{ label: "Vadodara Centre", href: "/locations/vadodara" }] },
        { heading: "Surat", items: [{ label: "Surat Centre", href: "/locations/surat" }] },
        { heading: "Bhuj", items: [{ label: "Bhuj Centre", href: "/locations/bhuj" }] },
        { heading: "Bhavnagar", items: [{ label: "Bhavnagar Centre", href: "/locations/bhavnagar" }] },
        { heading: "Anand", items: [{ label: "Anand Centre", href: "/locations/anand" }] },
        { heading: "Varanasi", items: [{ label: "Varanasi Centre", href: "/locations/varanasi" }] },
      ],
    },
    {
      label: "Calculators",
      mega: [
        { heading: "Fertility & IVF", items: [
          { label: "IVF Success Rate Calculator", href: "/#tools" },
          { label: "IVF Cost Calculator", href: "/#tools" },
          { label: "AMH Level Interpreter", href: "/#tools" },
          { label: "Sperm Analysis Calculator", href: "/#tools" },
        ]},
        { heading: "Conception & Pregnancy", items: [
          { label: "Ovulation Calculator", href: "/#tools" },
          { label: "Fertile Period Calculator", href: "/#tools" },
          { label: "Natural Pregnancy Calculator", href: "/#tools" },
          { label: "Miscarriage Risk Calculator", href: "/#tools" },
        ]},
      ],
    },
    {
      label: "Resources",
      mega: [
        { heading: "Learn", items: [
          { label: "Blog", href: destinationHref("blog") },
          { label: "Success Stories", href: "/#stories" },
          { label: "Videos", href: "/#videos" },
          { label: "Events & Webinars", href: "/#events" },
        ]},
        { heading: "Tools", items: [
          { label: "Fertility Calculators", href: "/#tools" },
          { label: "Check IVF Eligibility", href: "/#book" },
        ]},
      ],
    },
    { label: "Contact", href: "/contact" },
  ],
  cta: { label: "Book Appointment", href: "/#book", styleVariant: "primary" },
};

/* The subset of the `header` global this resolver reads (kept loose so it stays
 * decoupled from the generated payload-types). */
type MegaItemSource = {
  label?: string | null;
  url?: string | null;
  desc?: string | null;
  children?: { label?: string | null; url?: string | null }[] | null;
};
type MegaColSource = {
  heading?: string | null;
  headingHref?: string | null;
  items?: MegaItemSource[] | null;
};
type NavItemSource = {
  label?: string | null;
  url?: string | null;
  openInNewTab?: boolean | null;
  doctors?: boolean | null;
  megaCols?: number | null;
  columns?: MegaColSource[] | null;
};
export type HeaderSource =
  | {
      branding?: { logoUrl?: string | null; logoAlt?: string | null } | null;
      navItems?: NavItemSource[] | null;
      cta?: { label?: string | null; url?: string | null; styleVariant?: string | null } | null;
    }
  | null
  | undefined;

/** Map a stored mega item → rendered item, dropping empty optional fields so
 *  the resolved object matches the hand-written defaults shape. */
function resolveMegaItem(it: MegaItemSource): HeaderMegaItem {
  const children = (it.children ?? [])
    .filter((c) => c.label)
    .map((c) => ({ label: c.label as string, href: c.url ?? "" }));
  return {
    label: it.label ?? "",
    href: it.url ?? "",
    ...(it.desc ? { desc: it.desc } : {}),
    ...(children.length ? { children } : {}),
  };
}

/** Map a stored nav item → rendered nav item. */
function resolveNavItem(n: NavItemSource): HeaderNavItem {
  if (n.doctors) {
    // Doctors panel is data-driven (src/lib/doctors.ts); only the flag travels.
    return { label: n.label ?? "Doctors", doctors: true };
  }
  const mega = (n.columns ?? []).map((col) => ({
    heading: col.heading ?? "",
    ...(col.headingHref ? { headingHref: col.headingHref } : {}),
    items: (col.items ?? []).map(resolveMegaItem),
  }));
  return {
    label: n.label ?? "",
    ...(n.url ? { href: n.url } : {}),
    ...(n.openInNewTab ? { openInNewTab: true } : {}),
    ...(typeof n.megaCols === "number" ? { megaCols: n.megaCols } : {}),
    ...(mega.length ? { mega } : {}),
  };
}

/**
 * Map the `header` global → HeaderData, falling back per-section to
 * HEADER_DEFAULTS so an empty CMS renders byte-identically.
 */
export function resolveHeader(g: HeaderSource): HeaderData {
  const branding: HeaderBranding = {
    logoUrl: g?.branding?.logoUrl || HEADER_DEFAULTS.branding.logoUrl,
    logoAlt: g?.branding?.logoAlt || HEADER_DEFAULTS.branding.logoAlt,
  };

  const nav = g?.navItems?.length ? g.navItems.map(resolveNavItem) : HEADER_DEFAULTS.nav;

  const cta: HeaderCta = {
    label: g?.cta?.label || HEADER_DEFAULTS.cta.label,
    href: g?.cta?.url || HEADER_DEFAULTS.cta.href,
    styleVariant: g?.cta?.styleVariant || HEADER_DEFAULTS.cta.styleVariant,
  };

  return { branding, nav, cta };
}
