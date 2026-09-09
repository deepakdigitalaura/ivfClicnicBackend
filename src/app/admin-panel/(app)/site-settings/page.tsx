import { readSiteSettings } from "@/sanity/lib/admin";
import { SITE } from "@/lib/seo";
import { SiteSettingsForm } from "./form";

export const dynamic = "force-dynamic";

export default async function SiteSettingsPage() {
  const doc = await readSiteSettings();
  // Defaults from the SITE constant so empty fields show the current live values.
  const defaults = {
    brandName: SITE.name,
    alternateName: SITE.alternateName,
    legalName: SITE.legalName,
    logoUrl: SITE.logo,
    foundingDate: SITE.foundingDate,
    telephone: SITE.telephone,
    telephoneDisplay: SITE.telephoneDisplay,
    email: SITE.email,
    whatsapp: SITE.whatsapp,
    address: { ...SITE.address },
    socialLinks: [...SITE.sameAs],
  };
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Site Settings</h1>
        <p className="admin-sub">Shared content — used across the header, footer, contact page &amp; search schema on every page.</p>
      </div>
      <SiteSettingsForm initial={doc} defaults={defaults} />
    </>
  );
}
