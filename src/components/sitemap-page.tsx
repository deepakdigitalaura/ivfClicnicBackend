"use client";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { useFooter } from "@/components/footer-provider";

export function SitemapPage() {
  const footer = useFooter();
  const groups = footer?.groups ?? [];

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[color:var(--cream)]">
        <section className="relative overflow-hidden bg-gradient-to-b from-[color:var(--plum)] to-[color:var(--plum-dark,#3a1c4f)] py-20 text-center text-white md:py-28">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
          </div>
          <div className="relative mx-auto max-w-3xl px-6">
            <h1 className="font-display text-3xl font-semibold leading-tight md:text-5xl">
              Sitemap
            </h1>
            <p className="mt-4 text-base text-white/70 md:text-lg">
              Browse all pages on our website
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <SitemapGroup title="Main Pages" links={[
              { label: "Home", href: "/" },
              { label: "About Us", href: "/about-bfi" },
              { label: "Why Bavishi Fertility Institute", href: "/why-bfi" },
              { label: "Contact Us", href: "/contact" },
              { label: "Blog", href: "/blog" },
              { label: "Suraksha Kavach", href: "/suraksha-kavach" },
            ]} />

            {groups.map((group) => (
              <SitemapGroup
                key={group.h}
                title={group.h}
                links={group.l.filter((l) => l.href && !l.external).map((l) => ({
                  label: l.label,
                  href: l.href!,
                }))}
              />
            ))}

            <SitemapGroup title="Legal" links={[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms of Service", href: "/terms-of-service" },
              { label: "Refund Policy", href: "/refund-policy" },
              { label: "Cookie Policy", href: "/cookie-policy" },
            ]} />
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
      <MobileBottomBar />
      <ScrollToTop />
    </>
  );
}

function SitemapGroup({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  if (!links.length) return null;
  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-[color:var(--plum)] mb-3">
        {title}
      </h2>
      <ul className="space-y-1.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-[color:var(--text)] hover:text-[color:var(--rose)] transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
