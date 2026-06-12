"use client";

/* Branded full-screen "Pages & Builder" launchpad (/studio/pages). Lists every
 * page; a ready page opens its inline editor (/edit/<x>), the rest show "Soon".
 * Reached from the admin sidebar's "Pages & Builder" link and the dashboard. */

import "./editor.css";

const PAGES: { label: string; desc: string; href: string; ready: boolean }[] = [
  { label: "Home", desc: "Hero, sections, stats, FAQs, closing CTA", href: "/edit/home", ready: true },
  { label: "About BFI", desc: "Story, legacy, trust pillars, network", href: "/edit/about", ready: false },
  { label: "Doctors", desc: "Doctor profiles & index", href: "/edit/doctors", ready: false },
  { label: "Treatments", desc: "Treatment pages", href: "/edit/treatments", ready: true },
  { label: "Services", desc: "Maternity service pages", href: "/edit/services", ready: false },
  { label: "Locations", desc: "City & centre pages", href: "/edit/locations", ready: false },
  { label: "Contact", desc: "Contact page", href: "/edit/contact", ready: false },
];

export function PagesLauncher() {
  return (
    <div className="bfi-launch">
      <header className="bfi-launch__head">
        <div>
          <h1 className="bfi-launch__title">Pages &amp; Builder</h1>
          <p className="bfi-launch__sub">Open a page to edit its content directly on the live preview — click any text, type, and Save.</p>
        </div>
        <a className="bfi-btn bfi-btn--ghost bfi-launch__back" href="/admin">← Back to Admin</a>
      </header>
      <div className="bfi-launch__grid">
        {PAGES.map((p) =>
          p.ready ? (
            <a key={p.label} href={p.href} className="bfi-launch__card">
              <span className="bfi-launch__name">{p.label}</span>
              <span className="bfi-launch__desc">{p.desc}</span>
              <span className="bfi-launch__open">Open editor →</span>
            </a>
          ) : (
            <div key={p.label} className="bfi-launch__card bfi-launch__card--soon">
              <span className="bfi-launch__name">{p.label}</span>
              <span className="bfi-launch__desc">{p.desc}</span>
              <span className="bfi-launch__soon">Soon</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default PagesLauncher;
