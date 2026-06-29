import Link from "next/link";
import {
  CornerUpRight, FileText, Code2, BarChart3, Bot, Map,
  Plus, ExternalLink, Database,
} from "lucide-react";
import { getDashboardStats, hasSanity } from "@/sanity/lib/admin";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const stats = await getDashboardStats();
  const connected = hasSanity();

  const cards = [
    { num: stats.pageSeo, label: "Page SEO Entries", icon: FileText, bg: "var(--rose-soft)", fg: "var(--rose)" },
    { num: stats.redirects, label: "Redirects", icon: CornerUpRight, bg: "#ede9fe", fg: "var(--plum)" },
    { num: stats.headScripts + stats.bodyScripts, label: "Scripts Injected", icon: Code2, bg: "#fef3c7", fg: "#b45309" },
    { num: stats.customSchemas, label: "Custom Schemas", icon: BarChart3, bg: "#dcfce7", fg: "#166534" },
  ];

  const quick = [
    { href: "/admin-panel/page-seo", label: "Edit Page SEO", icon: FileText },
    { href: "/admin-panel/scripts", label: "Add a Script", icon: Plus },
    { href: "/admin-panel/redirects", label: "Add Redirect", icon: CornerUpRight },
    { href: "/admin-panel/robots", label: "Robots.txt", icon: Bot },
    { href: "/admin-panel/sitemap", label: "Sitemap", icon: Map },
    { href: "/admin-panel/schema", label: "Structured Data", icon: BarChart3 },
  ];

  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Dashboard</h1>
        <p className="admin-sub">Welcome back! Manage your site&apos;s SEO &amp; technical settings.</p>
      </div>

      {!connected && (
        <div className="admin-card" style={{ borderColor: "#fecaca", background: "#fef2f2", marginBottom: 24 }}>
          <p className="admin-card-title" style={{ color: "#b91c1c" }}>⚠ Sanity not connected</p>
          <p className="admin-card-desc" style={{ margin: 0 }}>
            Set <b>NEXT_PUBLIC_SANITY_PROJECT_ID</b> and <b>SANITY_API_TOKEN</b> in Vercel, then redeploy.
            The panel works but can&apos;t save until then.
          </p>
        </div>
      )}

      <div className="admin-stats">
        {cards.map(({ num, label, icon: Icon, bg, fg }) => (
          <div className="admin-stat" key={label}>
            <span className="admin-stat-icon" style={{ background: bg, color: fg }}><Icon /></span>
            <div>
              <div className="admin-stat-num">{num}</div>
              <div className="admin-stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">Quick Actions</h2>
        <p className="admin-card-desc">Jump straight to the most-used SEO tools.</p>
        <div className="admin-quick">
          {quick.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}><Icon /> {label}</Link>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">More</h2>
        <p className="admin-card-desc">Power tools and your live site.</p>
        <div className="admin-quick">
          <Link href="/studio" target="_blank"><Database /> Open Sanity Studio</Link>
          <Link href="/" target="_blank"><ExternalLink /> View Live Site</Link>
        </div>
      </div>
    </>
  );
}
