"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Bot, Code2, CornerUpRight, Map, BarChart3,
  FileText, ExternalLink, LogOut, Inbox, Stethoscope, Star, Home, Settings, Video, BookOpen, Info, Syringe, HeartPulse, MapPin, MessageSquareQuote, Images, HelpCircle, Newspaper, ShieldCheck, Building2, Sparkles, Award,
} from "lucide-react";
import { logoutAction } from "../../actions";

const NAV = [
  { href: "/admin-panel", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin-panel/inquiries", label: "Inquiries", icon: Inbox },
];

const CONTENT_NAV = [
  { href: "/admin-panel/homepage", label: "Homepage Editor", icon: Home },
  { href: "/admin-panel/about", label: "About Page", icon: Info },
  { href: "/admin-panel/history", label: "History", icon: BookOpen },
  { href: "/admin-panel/infrastructure", label: "Infrastructure", icon: Building2 },
  { href: "/admin-panel/why-bfi", label: "Why BFI", icon: Star },
  { href: "/admin-panel/simple-treatment", label: "Simple Treatment", icon: Sparkles },
  { href: "/admin-panel/safe-treatment", label: "Safe Treatment", icon: ShieldCheck },
  { href: "/admin-panel/smart-treatment", label: "Smart Treatment", icon: BarChart3 },
  { href: "/admin-panel/success-benchmarks", label: "Success Benchmarks", icon: Award },
  { href: "/admin-panel/suraksha-kavach", label: "Suraksha Kavach", icon: ShieldCheck },
  { href: "/admin-panel/treatments", label: "Treatments", icon: Syringe },
  { href: "/admin-panel/services", label: "Maternity Services", icon: HeartPulse },
  { href: "/admin-panel/locations", label: "Locations", icon: MapPin },
  { href: "/admin-panel/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/admin-panel/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin-panel/camps", label: "Camp Posters", icon: Images },
  { href: "/admin-panel/page-faqs", label: "Page FAQs", icon: HelpCircle },
  { href: "/admin-panel/reviews", label: "Google Reviews", icon: MessageSquareQuote },
  { href: "/admin-panel/education-videos", label: "Education Videos", icon: Video },
  { href: "/admin-panel/press", label: "Media & Press", icon: Newspaper },
  { href: "/admin-panel/blogs", label: "Blogs", icon: BookOpen },
];

const SEO_NAV = [
  { href: "/admin-panel/robots", label: "Robots.txt", icon: Bot },
  { href: "/admin-panel/scripts", label: "Add Script", icon: Code2 },
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

        <div className="admin-nav-section">Settings</div>
        <Link href="/admin-panel/site-settings" className={isActive("/admin-panel/site-settings") ? "active" : ""}>
          <Settings /> Site Settings
        </Link>

        <div className="admin-nav-section">Advanced</div>
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
