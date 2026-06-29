"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Bot, Code2, CornerUpRight, Map, BarChart3,
  FileText, ExternalLink, LogOut, Database, Inbox, Stethoscope, Star, Home,
} from "lucide-react";
import { logoutAction } from "../../actions";

const NAV = [
  { href: "/admin-panel", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin-panel/inquiries", label: "Inquiries", icon: Inbox },
];

const CONTENT_NAV = [
  { href: "/admin-panel/homepage", label: "Homepage Editor", icon: Home },
  { href: "/admin-panel/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/admin-panel/testimonials", label: "Testimonials", icon: Star },
];

const SEO_NAV = [
  { href: "/admin-panel/robots", label: "Robots.txt", icon: Bot },
  { href: "/admin-panel/scripts", label: "Script Injection", icon: Code2 },
  { href: "/admin-panel/redirects", label: "Redirects", icon: CornerUpRight },
  { href: "/admin-panel/sitemap", label: "Sitemap", icon: Map },
  { href: "/admin-panel/schema", label: "Structured Data", icon: BarChart3 },
  { href: "/admin-panel/page-seo", label: "Page SEO", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <span className="admin-brand-mark">BF</span>
        <span>BFI Admin</span>
      </div>

      <nav className="admin-nav">
        {NAV.map(({ href, label, icon: Icon, exact }) => (
          <Link key={href} href={href} className={isActive(href, exact) ? "active" : ""}>
            <Icon /> {label}
          </Link>
        ))}

        <div className="admin-nav-section">Content</div>
        {CONTENT_NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={isActive(href) ? "active" : ""}>
            <Icon /> {label}
          </Link>
        ))}

        <div className="admin-nav-section">SEO &amp; Technical</div>
        {SEO_NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={isActive(href) ? "active" : ""}>
            <Icon /> {label}
          </Link>
        ))}

        <div className="admin-nav-section">Advanced</div>
        <Link href="/studio" target="_blank">
          <Database /> Sanity Studio
        </Link>
        <Link href="/" target="_blank" className="admin-live">
          <ExternalLink /> View Live Site
        </Link>
      </nav>

      <div className="admin-sidebar-foot">
        <form action={logoutAction}>
          <button type="submit" className="admin-nav" style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center", gap: 11, padding: "9px 11px", borderRadius: 10, fontSize: 14, fontWeight: 500, width: "100%", color: "var(--muted-foreground)" }}>
            <LogOut style={{ width: 18, height: 18 }} /> Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
