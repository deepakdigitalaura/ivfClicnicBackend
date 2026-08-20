import { Map, Link2, RefreshCw } from "lucide-react";
import { readSitemap } from "@/sanity/lib/admin";
import { getSitemapEntries, sitemapEntriesToXml } from "@/lib/sitemap-data";
import { SITE } from "@/lib/seo";
import { SitemapForm } from "./form";

export const dynamic = "force-dynamic";

export default async function SitemapPage() {
  const [data, entries] = await Promise.all([readSitemap(), getSitemapEntries()]);
  const liveUrl = `${SITE.url}/sitemap.xml`;
  const xmlPreview = sitemapEntriesToXml(entries);

  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Sitemap</h1>
        <p className="admin-sub">All your pages are auto-listed. Here you can exclude or add extra URLs.</p>
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <span className="admin-stat-icon" style={{ background: "var(--rose-soft)", color: "var(--plum)" }}><Map /></span>
          <div>
            <div className="admin-stat-num">{entries.length}</div>
            <div className="admin-stat-label">URLs in sitemap</div>
          </div>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-icon" style={{ background: "var(--rose-soft)", color: "var(--plum)" }}><Link2 /></span>
          <div>
            <div className="admin-stat-num" style={{ fontSize: 15 }}>
              <a href={liveUrl} target="_blank" rel="noreferrer">sitemap.xml ↗</a>
            </div>
            <div className="admin-stat-label">Live sitemap URL</div>
          </div>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-icon" style={{ background: "var(--rose-soft)", color: "var(--plum)" }}><RefreshCw /></span>
          <div>
            <div className="admin-stat-num" style={{ fontSize: 15 }}>Live — auto-updates</div>
            <div className="admin-stat-label">Regenerates automatically, no action needed</div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">Live preview</h2>
        <p className="admin-card-desc">This is the sitemap currently served to search engines, generated from your treatments, doctors, services, locations, pages and the exceptions below.</p>
        <div className="admin-code-box">
          <div className="admin-code-box-head">
            <span>sitemap.xml — {entries.length} URLs</span>
            <a href={liveUrl} target="_blank" rel="noreferrer">View live ↗</a>
          </div>
          <pre className="admin-code-pre">{xmlPreview}</pre>
        </div>
      </div>

      <SitemapForm initial={data} />
    </>
  );
}
