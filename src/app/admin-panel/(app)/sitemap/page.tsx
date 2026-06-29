import { readSitemap } from "@/sanity/lib/admin";
import { SitemapForm } from "./form";

export const dynamic = "force-dynamic";

export default async function SitemapPage() {
  const data = await readSitemap();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Sitemap</h1>
        <p className="admin-sub">All your pages are auto-listed. Here you can exclude or add extra URLs.</p>
      </div>
      <SitemapForm initial={data} />
    </>
  );
}
