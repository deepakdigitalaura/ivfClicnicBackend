/* =====================================================================
 * Seed hi/gu nav labels onto the `header` and `footer` singletons in
 * i18n-preview, using the label dictionary in src/lib/i18n-seed-content.ts
 * (navLabelSeed). Built straight from HEADER_DEFAULTS/FOOTER_DEFAULTS (the
 * i18n-preview header/footer docs don't exist yet — resolveHeader/Footer
 * fall back to these when Sanity has no doc). A label not in the dict
 * (doctor names, city/centre names, phone numbers, kept acronyms) is left
 * as plain English text — pickLocale() falls back to it for every locale.
 *
 * Run:
 *   npx tsx --env-file=.env.local --env-file=<scratch>/sanity-token.env scripts/seed-i18n-nav-footer.mts [--dry-run]
 * ===================================================================== */
import { createClient } from "next-sanity";
import { HEADER_DEFAULTS, type HeaderMegaItem, type HeaderMegaCol, type HeaderNavItem } from "../src/lib/header";
import { FOOTER_DEFAULTS, type FooterLink, type FooterGroup } from "../src/lib/footer";
import { navLabelSeed } from "../src/lib/i18n-seed-content";

const DRY = process.argv.includes("--dry-run");

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN!,
});

if (sanity.config().dataset !== "i18n-preview") {
  throw new Error(`Refusing to seed nav/footer into dataset "${sanity.config().dataset}" — this script must only ever write to i18n-preview.`);
}

/** {en} if no dict entry, {en,hi,gu} if there is one. Plain strings
 *  (hrefs, icons, proper names not in the dict) are returned unchanged. */
function L(label: string): { en: string; hi?: string; gu?: string } {
  const t = navLabelSeed[label];
  return t ? { en: label, hi: t.hi, gu: t.gu } : { en: label };
}

function megaItem(it: HeaderMegaItem) {
  return {
    label: L(it.label),
    url: it.href,
    ...(it.desc ? { desc: L(it.desc) } : {}),
    ...(it.children ? { children: it.children.map((c) => ({ label: L(c.label), url: c.href })) } : {}),
  };
}
function megaCol(col: HeaderMegaCol) {
  return {
    heading: L(col.heading),
    ...(col.headingHref ? { headingHref: col.headingHref } : {}),
    items: col.items.map(megaItem),
  };
}
function navItem(n: HeaderNavItem) {
  return {
    label: L(n.label),
    ...(n.href ? { url: n.href } : {}),
    ...(n.openInNewTab ? { openInNewTab: true } : {}),
    ...(n.doctors ? { doctors: true } : {}),
    ...(typeof n.megaCols === "number" ? { megaCols: n.megaCols } : {}),
    ...(n.mega ? { columns: n.mega.map(megaCol) } : {}),
  };
}

function footerLink(l: FooterLink) {
  return { label: L(l.label), url: l.href, ...(l.external ? { external: true } : {}) };
}
function footerGroup(g: FooterGroup) {
  return { title: L(g.h), links: g.l.map(footerLink) };
}

async function seed() {
  const headerDoc = {
    _id: "header",
    _type: "header",
    branding: { logoUrl: HEADER_DEFAULTS.branding.logoUrl, logoAlt: L(HEADER_DEFAULTS.branding.logoAlt) },
    navItems: HEADER_DEFAULTS.nav.map(navItem),
    cta: { label: L(HEADER_DEFAULTS.cta.label), url: HEADER_DEFAULTS.cta.href, styleVariant: HEADER_DEFAULTS.cta.styleVariant },
  };
  const footerDoc = {
    _id: "footer",
    _type: "footer",
    navGroups: FOOTER_DEFAULTS.groups.map(footerGroup),
    social: FOOTER_DEFAULTS.social,
    copyrightText: L(FOOTER_DEFAULTS.copyrightText),
    legalLinks: FOOTER_DEFAULTS.legal.map(footerLink),
  };

  for (const doc of [headerDoc, footerDoc]) {
    console.log(`\n=== ${doc._id} ===`);
    if (DRY) {
      console.log(JSON.stringify(doc, null, 2).slice(0, 2000) + "\n... (truncated, --dry-run)");
      continue;
    }
    await sanity.createOrReplace(doc);
    console.log(`saved ${doc._id}`);
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
