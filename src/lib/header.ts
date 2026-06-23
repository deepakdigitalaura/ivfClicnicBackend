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

/**
 * Lightweight treatment descriptor used to build the header mega menu and footer
 * treatment groups dynamically from Payload (no hardcoded nav lists needed).
 * Defined here (pure module) so both header + footer resolvers can import it
 * without pulling in server-only payload.ts.
 */
export type NavTreatmentItem = {
  slug: string;
  name: string;
  href: string;
  navCategory: string;
  navOrder: number;
};

/** Display label for each navCategory value in the header mega menu. */
const HEADER_CATEGORY_LABELS: Record<string, string> = {
  "advanced-ivf": "Advanced IVF Treatment",
  "donor-services": "Donor Services",
  "male-infertility": "Male Infertility",
  "female-infertility": "Female Infertility",
  "fertility-preservation": "Fertility Preservation",
};

/** Hub page URL for each navCategory column heading link. */
const HEADER_CATEGORY_HREFS: Record<string, string> = {
  "advanced-ivf": "/treatments/advanced-fertility-techniques",
  "donor-services": "/treatments/advanced-fertility-techniques",
  "male-infertility": "/treatments/male-infertility",
  "female-infertility": "/treatments/female-infertility",
  "fertility-preservation": "/treatments/advanced-fertility-techniques",
};
// Note: "maternity-services" is intentionally excluded from the IVF Treatments header column.

/** Canonical column order in the "IVF Treatments" mega menu. */
const HEADER_CATEGORY_ORDER = [
  "advanced-ivf",
  "donor-services",
  "male-infertility",
  "female-infertility",
  "fertility-preservation",
];

/**
 * Lightweight location descriptor for building the Locations mega menu and footer
 * group dynamically from Payload (no hardcoded lists needed).
 * Each entry is one city with its list of published centres.
 */
export type NavLocationItem = {
  citySlug: string;
  cityName: string;
  centres: { slug: string; name: string }[];
};

/** Cities in chronological opening order — drives nav + footer sort. */
const CITY_NAV_ORDER = ["ahmedabad", "vadodara", "surat", "bhuj", "mumbai", "bhavnagar", "anand", "varanasi"];

/** Centre slugs in opening order for multi-centre cities. */
const CENTRE_NAV_ORDER: Record<string, string[]> = {
  ahmedabad: ["paldi", "sindhu-bhavan-road", "nikol"],
  mumbai: ["ghatkopar", "thane", "vile-parle", "borivali", "vashi"],
};

/** Sort cities by opening order and centres within each city by the same order. */
export function sortNavLocations(items: NavLocationItem[]): NavLocationItem[] {
  return [...items]
    .sort((a, b) => {
      const ai = CITY_NAV_ORDER.indexOf(a.citySlug);
      const bi = CITY_NAV_ORDER.indexOf(b.citySlug);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    })
    .map((city) => {
      const order = CENTRE_NAV_ORDER[city.citySlug];
      if (!order || city.centres.length <= 1) return city;
      const sorted = [...city.centres].sort((a, b) => {
        const ai = order.indexOf(a.slug);
        const bi = order.indexOf(b.slug);
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      });
      return { ...city, centres: sorted };
    });
}

/**
 * Lightweight doctor descriptor for building the header mega panel and footer
 * Doctors group dynamically from Payload (no hardcoded lists needed).
 * Defined here (pure module) so header + footer resolvers can import it
 * without pulling in server-only payload.ts.
 */
export type NavDoctorItem = {
  slug: string;
  name: string;
  href: string;
  navRole: "senior-specialist" | "specialist";
  navOrder: number;
  city: string;
  experienceLabel?: string;
};

/** Shape consumed by <DoctorsMegaPanel> / <MobileDoctorsItem> in site-header.tsx. */
export type DoctorMenuData = {
  senior: Array<{ name: string; href: string; city: string; meta?: string }>;
  specialists: Array<{ name: string; href: string; city: string }>;
};

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
  /** Render the data-driven Doctors mega panel. When doctorMenu is present it
   *  overrides the hardcoded doctorMenuData() fallback in site-header.tsx. */
  doctors?: boolean;
  doctorMenu?: DoctorMenuData;
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
          { label: "Why Bavishi Fertility Institute", href: "/why-bfi" },
          { label: "Simple Treatment", href: "/simple-treatment" },
          { label: "Safe Treatment", href: "/safe-treatment" },
          { label: "Smart Treatment", href: "/smart-treatment" },
          { label: "Success Benchmarks", href: "/success-benchmarks" },
        ]},
        { heading: "", items: [
          { label: "History", href: "/history" },
          { label: "Our Team", href: "/doctors" },
          { label: "Infrastructure", href: "/infrastructure" },
          { label: "Suraksha Kavach Package", href: destinationHref("suraksha-kavach") },
          { label: "Easy / Interest Free EMI", href: "/easy-emi" },
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
        { heading: "Advanced IVF Treatment", headingHref: "/treatments/advanced-fertility-techniques", items: [
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
        { heading: "Donor Services", headingHref: "/treatments/advanced-fertility-techniques", items: [
          { label: "Egg Donation", href: "/egg-donation" },
          { label: "Sperm Donation", href: "/sperm-donation" },
          { label: "Embryo Donation", href: "/embryo-donation" },
        ]},
        { heading: "Male Infertility", headingHref: "/treatments/male-infertility", items: [
          { label: "Low Sperm Count (Oligospermia)", href: "/oligospermia" },
          { label: "Low Sperm Motility (Asthenospermia)", href: "/asthenospermia" },
          { label: "Zero Sperm Count (Azoospermia)", href: "/azoospermia" },
          { label: "PESA / TESA / TESE / Micro TESE", href: "/surgical-sperm-retrieval" },
          { label: "Varicocele / Micro Surgery", href: "/varicocele" },
          { label: "Erectile Dysfunction", href: "/erectile-dysfunction" },
        ]},
        { heading: "Female Infertility", headingHref: "/treatments/female-infertility", items: [
          { label: "Conceive Naturally", href: "/conceive-naturally" },
          { label: "PRP Infertility", href: "/prp-infertility" },
          { label: "PCOS", href: "/pcos" },
          { label: "Poor Ovarian Reserve / Low Egg Count / Low AMH", href: "/ovarian-reserve" },
          { label: "Ovarian Rejuvenation", href: "/ovarian-rejuvenation" },
          { label: "Fibroid", href: "/fibroids" },
          { label: "Endometriosis", href: "/endometriosis" },
        ]},
        { heading: "Fertility Preservation", headingHref: "/treatments/advanced-fertility-techniques", items: [
          { label: "Cryopreservation", href: "/cryopreservation" },
        ]},
      ],
    },
    {
      label: "Maternity Services",
      href: "/services/maternity-services",
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
          { label: "IVF Success Rate Calculator", href: "/ivf-success-rate-calculator", desc: "Estimate your personalised IVF success probability" },
          { label: "IVF Cost Calculator", href: "/ivf-cost-calculator", desc: "Plan your treatment budget across cycle types" },
          { label: "AMH Level Interpreter", href: "/amh-level-interpreter", desc: "Understand your ovarian reserve result" },
          { label: "Sperm Analysis Calculator", href: "/semen-analysis-calculator", desc: "Interpret your semen analysis against WHO 2021" },
        ]},
        { heading: "Conception & Pregnancy", items: [
          { label: "Ovulation Calculator", href: "/ovulation-calculator", desc: "Find your fertile window and ovulation date" },
          { label: "Fertile Period Calculator", href: "/fertile-period-calculator", desc: "Track your fertile days and next period" },
          { label: "Natural Pregnancy Calculator", href: "/natural-pregnancy-calculator", desc: "Estimate your natural conception probability" },
          { label: "Miscarriage Risk Calculator", href: "/risk-of-repeat-miscarriage-calculator", desc: "Assess your RPL risk profile" },
        ]},
      ],
    },
    {
      label: "Resources",
      mega: [
        { heading: "Learn", items: [
          { label: "Blogs", href: destinationHref("blog") },
          { label: "Testimonial Videos", href: "/testimonial-videos" },
          { label: "Education Videos", href: "/education-videos" },
          { label: "Camps", href: "/camps" },
          { label: "CME", href: "/cme" },
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
  hidden?: boolean | null;
  children?: { label?: string | null; url?: string | null }[] | null;
};
type MegaColSource = {
  heading?: string | null;
  headingHref?: string | null;
  hidden?: boolean | null;
  items?: MegaItemSource[] | null;
};
type NavItemSource = {
  label?: string | null;
  url?: string | null;
  openInNewTab?: boolean | null;
  doctors?: boolean | null;
  megaCols?: number | null;
  hidden?: boolean | null;
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

const toTitleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

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
  // Hidden columns / links are dropped (editor toggled them off, not deleted).
  const mega = (n.columns ?? [])
    .filter((col) => !col.hidden)
    .map((col) => ({
      heading: col.heading ?? "",
      ...(col.headingHref ? { headingHref: col.headingHref } : {}),
      items: (col.items ?? []).filter((it) => !it.hidden).map(resolveMegaItem),
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
 * Build the "Locations" mega menu from CMS-published cities and centres.
 * Multi-centre cities get a linked heading + one item per centre;
 * single-centre cities get a heading + one "City Centre" item pointing to the city page.
 * Returns undefined when no locations exist (caller falls back to defaults).
 */
function buildLocationsMega(navLocations: NavLocationItem[]): HeaderMegaCol[] | undefined {
  if (!navLocations.length) return undefined;
  const sorted = sortNavLocations(navLocations);
  return sorted.map((city) => {
    const cityHref = `/locations/${city.citySlug}`;
    if (city.centres.length > 1) {
      return {
        heading: city.cityName,
        headingHref: cityHref,
        items: city.centres.map((c) => ({
          label: c.name,
          href: `/locations/${city.citySlug}/${c.slug}`,
        })),
      };
    }
    return {
      heading: city.cityName,
      items: [{ label: `${city.cityName} Centre`, href: cityHref }],
    };
  });
}

/**
 * Build the "Maternity Services" mega menu from CMS-published services.
 * Items are split evenly across two columns.
 * Returns undefined when no maternity services exist (caller falls back to defaults).
 */
function buildMaternityMega(navTreatments: NavTreatmentItem[]): HeaderMegaCol[] | undefined {
  const items = navTreatments
    .filter((t) => t.navCategory === "maternity-services")
    .sort((a, b) => a.navOrder - b.navOrder)
    .map((t) => ({ label: toTitleCase(t.name), href: t.href }));
  if (!items.length) return undefined;
  const mid = Math.ceil(items.length / 2);
  return [
    { heading: "", items: items.slice(0, mid) },
    { heading: "", items: items.slice(mid) },
  ];
}

/**
 * Build the "IVF Treatments" mega menu columns from CMS-published treatments.
 * Groups by navCategory in the canonical column order. Returns undefined when
 * no treatments have a navCategory set (caller falls back to defaults).
 */
function buildTreatmentMega(navTreatments: NavTreatmentItem[]): HeaderMegaCol[] | undefined {
  if (!navTreatments.length) return undefined;
  const byCat = new Map<string, NavTreatmentItem[]>();
  for (const t of navTreatments) {
    if (!HEADER_CATEGORY_LABELS[t.navCategory]) continue;
    const arr = byCat.get(t.navCategory) ?? [];
    arr.push(t);
    byCat.set(t.navCategory, arr);
  }
  if (!byCat.size) return undefined;
  return HEADER_CATEGORY_ORDER
    .filter((cat) => byCat.has(cat))
    .map((cat) => ({
      heading: HEADER_CATEGORY_LABELS[cat],
      ...(HEADER_CATEGORY_HREFS[cat] ? { headingHref: HEADER_CATEGORY_HREFS[cat] } : {}),
      items: byCat.get(cat)!
        .sort((a, b) => a.navOrder - b.navOrder)
        .map((t) => ({ label: t.name, href: t.href })),
    }));
}

/**
 * Build DoctorMenuData from CMS-published doctors with navRole set.
 * Returns undefined when no doctors have a navRole set (caller falls back to
 * the hardcoded doctorMenuData() in site-header.tsx).
 */
function buildDoctorMenu(navDoctors: NavDoctorItem[]): DoctorMenuData | undefined {
  if (!navDoctors.length) return undefined;
  const senior = navDoctors
    .filter((d) => d.navRole === "senior-specialist")
    .sort((a, b) => a.navOrder - b.navOrder)
    .map((d) => ({ name: d.name, href: d.href, city: d.city, meta: d.experienceLabel || undefined }));
  const specialists = navDoctors
    .filter((d) => d.navRole === "specialist")
    .sort((a, b) => a.navOrder - b.navOrder)
    .map((d) => ({ name: d.name, href: d.href, city: d.city }));
  if (!senior.length && !specialists.length) return undefined;
  return { senior, specialists };
}

/**
 * Map the `header` global → HeaderData, falling back per-section to
 * HEADER_DEFAULTS so an empty CMS renders byte-identically.
 *
 * When `navTreatments` is provided, the "IVF Treatments" mega menu columns are
 * built dynamically. When `navDoctors` is provided, the Doctors panel data is
 * built dynamically — both so adding items in admin automatically reflects in
 * the header without any hardcoded list change.
 */
export function resolveHeader(
  g: HeaderSource,
  navTreatments: NavTreatmentItem[] = [],
  navDoctors: NavDoctorItem[] = [],
  navLocations: NavLocationItem[] = [],
): HeaderData {
  const branding: HeaderBranding = {
    logoUrl: g?.branding?.logoUrl || HEADER_DEFAULTS.branding.logoUrl,
    logoAlt: g?.branding?.logoAlt || HEADER_DEFAULTS.branding.logoAlt,
  };

  // Top-level items toggled "Hide from menu" are dropped before mapping.
  const nav = g?.navItems?.length
    ? g.navItems.filter((n) => !n.hidden).map(resolveNavItem)
    : HEADER_DEFAULTS.nav;

  const cta: HeaderCta = {
    label: g?.cta?.label || HEADER_DEFAULTS.cta.label,
    href: g?.cta?.url || HEADER_DEFAULTS.cta.href,
    styleVariant: g?.cta?.styleVariant || HEADER_DEFAULTS.cta.styleVariant,
  };

  // Treatments mega — replace "IVF Treatments" columns with DB-driven ones.
  const treatmentMega = buildTreatmentMega(navTreatments);
  // Maternity mega — replace "Maternity Services" columns with DB-driven ones.
  const maternityMega = buildMaternityMega(navTreatments);
  // Doctors mega — replace hardcoded panel data with DB-driven one.
  const doctorMenu = buildDoctorMenu(navDoctors);
  // Locations mega — replace hardcoded city/centre list with DB-driven one.
  const locationsMega = buildLocationsMega(navLocations);

  const finalNav = nav.map((item) => {
    if (item.label === "IVF Treatments" && treatmentMega) return { ...item, mega: treatmentMega };
    if (item.label === "Maternity Services" && maternityMega) return { ...item, href: item.href || "/services/maternity-services", mega: maternityMega };
    if (item.label === "Locations" && locationsMega) return { ...item, mega: locationsMega };
    if (item.doctors && doctorMenu) return { ...item, doctorMenu };
    if (item.label === "Resources" && item.mega) {
      return {
        ...item,
        mega: item.mega.map((col) => ({
          ...col,
          items: col.items.map((it) => it.label === "Blog" ? { ...it, label: "Blogs" } : it),
        })),
      };
    }
    return item;
  });

  return { branding, nav: finalNav, cta };
}
