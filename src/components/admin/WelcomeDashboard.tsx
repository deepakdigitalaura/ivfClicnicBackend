'use client';

/* =====================================================================
 * Welcome Dashboard — a friendly, plain-English landing panel rendered at
 * the top of the Payload admin Dashboard (admin.components.beforeDashboard).
 * Gives non-technical clinic staff an at-a-glance overview (counts) plus big
 * "do this" Quick Action buttons and a short Getting Started guide, so they
 * never have to hunt through the sidebar groups. Payload's own grouped cards
 * still render below this, so nothing is lost.
 *
 * Counts are read client-side from the REST API (same-origin admin session),
 * so this stays a pure UI component with no server coupling.
 * ===================================================================== */

import { useEffect, useState } from 'react';

// `query` narrows the count (e.g. only NEW leads); `key` keeps the state entry
// unique when two cards share a collection slug.
type Stat = { label: string; slug: string; href: string; query?: string; key?: string };

// Collections we surface as headline counts. `href` is where the card links.
const STAT_CARDS: Stat[] = [
  // New (un-actioned) leads first — the number staff most need to see daily.
  { label: 'New Leads', slug: 'inquiries', key: 'new-leads', query: 'where[status][equals]=new', href: '/admin/collections/inquiries' },
  { label: 'Doctors', slug: 'doctors', href: '/admin/collections/doctors' },
  { label: 'Treatments', slug: 'treatments', href: '/admin/collections/treatments' },
  { label: 'Services', slug: 'services', href: '/admin/collections/services' },
  { label: 'Centres', slug: 'centres', href: '/admin/collections/centres' },
  { label: 'Blog Posts', slug: 'blogs', href: '/admin/collections/blogs' },
  { label: 'Testimonials', slug: 'testimonials', href: '/admin/collections/testimonials' },
  { label: 'Images', slug: 'media', href: '/admin/collections/media' },
];

const QUICK_ACTIONS: { label: string; href: string; primary?: boolean }[] = [
  { label: 'View Inquiries', href: '/admin/collections/inquiries', primary: true },
  { label: 'Edit Homepage', href: '/admin/globals/homepage', primary: true },
  { label: '+ Add Doctor', href: '/admin/collections/doctors/create' },
  { label: '+ Add Treatment', href: '/admin/collections/treatments/create' },
  { label: 'Manage Locations', href: '/admin/collections/centres' },
  { label: '+ Add Testimonial', href: '/admin/collections/testimonials/create' },
  { label: 'Edit Menus', href: '/admin/globals/header' },
  { label: 'Redirects', href: '/admin/collections/redirects' },
  { label: '+ New Blog Post', href: '/admin/collections/blogs/create' },
  { label: 'Site Settings', href: '/admin/globals/site-settings' },
];

const GETTING_STARTED: { what: string; where: string }[] = [
  { what: 'See & follow up website enquiries', where: 'Inquiries → New Leads' },
  { what: 'Edit the homepage (text, sections, order)', where: 'Website Pages → Homepage' },
  { what: 'Change a treatment page', where: 'Treatments & Services → Treatments' },
  { what: 'Add or edit a doctor', where: 'Doctors → Create New' },
  { what: 'Add a patient testimonial (shows with Google reviews)', where: 'Testimonials → Create New' },
  { what: 'Reorder / show / hide menu links', where: 'Website Settings → Header & Navigation / Footer' },
  { what: 'Update a clinic / city page', where: 'Locations → Cities or Centres' },
  { what: 'Upload photos to use anywhere', where: 'Media Library' },
  { what: 'Change phone, email, social links', where: 'Website Settings → Site Settings' },
  { what: 'Redirect an old/renamed page (avoid dead links)', where: 'SEO Tools → Redirects' },
  { what: 'Control search-engine crawling (robots.txt)', where: 'SEO Tools → Search Engines & Robots' },
];

// Pages & Builder — each opens the full-screen inline editor (/edit/<page>),
// where staff edit content directly on the live page. `ready:false` = the page's
// editor isn't wired yet (shown disabled so the list reflects the real roadmap).
const PAGE_EDITORS: { label: string; href: string; ready: boolean }[] = [
  { label: 'Home', href: '/edit/home', ready: true },
  { label: 'About BFI', href: '/edit/about', ready: false },
  { label: 'Doctors', href: '/edit/doctors', ready: false },
  { label: 'Treatments', href: '/edit/treatments', ready: false },
  { label: 'Services', href: '/edit/services', ready: false },
  { label: 'Locations', href: '/edit/locations', ready: false },
  { label: 'Contact', href: '/edit/contact', ready: false },
];

function useCounts() {
  const [counts, setCounts] = useState<Record<string, number | null>>({});
  useEffect(() => {
    let alive = true;
    Promise.all(
      STAT_CARDS.map(async ({ slug, query, key }) => {
        const id = key ?? slug;
        try {
          const res = await fetch(`/api/${slug}?limit=0&depth=0${query ? `&${query}` : ''}`, { credentials: 'include' });
          const json = await res.json();
          return [id, typeof json?.totalDocs === 'number' ? json.totalDocs : null] as const;
        } catch {
          return [id, null] as const;
        }
      }),
    ).then((entries) => {
      if (alive) setCounts(Object.fromEntries(entries));
    });
    return () => {
      alive = false;
    };
  }, []);
  return counts;
}

export function WelcomeDashboard() {
  const counts = useCounts();

  return (
    <div style={S.wrap}>
      <div style={S.header}>
        <h1 style={S.title}>Welcome 👋</h1>
        <p style={S.subtitle}>
          Here&apos;s your website overview. Use the buttons below — every part of the site can be
          edited here, and changes go live on save.
        </p>
      </div>

      {/* Pages & Builder — open a page and edit it directly in the preview */}
      <div style={S.panel}>
        <h2 style={S.panelTitle}>Pages &amp; Builder</h2>
        <p style={S.panelHint}>Open a page to edit its content directly on the live preview — click any text, type, and Save.</p>
        <div style={S.pageGrid}>
          {PAGE_EDITORS.map((p) =>
            p.ready ? (
              <a key={p.label} href={p.href} target="_blank" rel="noreferrer" style={S.pageCard}>
                <span style={S.pageName}>{p.label}</span>
                <span style={S.pageOpen}>Open editor ↗</span>
              </a>
            ) : (
              <div key={p.label} style={{ ...S.pageCard, ...S.pageCardSoon }}>
                <span style={S.pageName}>{p.label}</span>
                <span style={S.pageSoon}>Soon</span>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div style={S.statGrid}>
        {STAT_CARDS.map((c) => {
          const id = c.key ?? c.slug;
          const value = counts[id];
          return (
            <a key={id} href={c.href} style={S.statCard}>
              <span style={S.statValue}>{value === undefined ? '…' : value ?? '—'}</span>
              <span style={S.statLabel}>{c.label}</span>
            </a>
          );
        })}
      </div>

      {/* Quick actions */}
      <div style={S.panel}>
        <h2 style={S.panelTitle}>Quick Actions</h2>
        <div style={S.actionRow}>
          {QUICK_ACTIONS.map((a) => (
            <a
              key={a.href}
              href={a.href}
              style={{ ...S.actionBtn, ...(a.primary ? S.actionBtnPrimary : {}) }}
            >
              {a.label}
            </a>
          ))}
          <a href="/" target="_blank" rel="noreferrer" style={{ ...S.actionBtn, ...S.actionBtnGhost }}>
            View Live Site ↗
          </a>
        </div>
      </div>

      {/* Getting started */}
      <div style={S.panel}>
        <h2 style={S.panelTitle}>Getting Started — where to find things</h2>
        <ul style={S.list}>
          {GETTING_STARTED.map((g) => (
            <li key={g.what} style={S.listItem}>
              <span style={S.listWhat}>{g.what}</span>
              <span style={S.listArrow}>→</span>
              <span style={S.listWhere}>{g.where}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* Styles use Payload's theme CSS variables so the panel looks native in both
 * light and dark mode, with one brand accent (clinic rose). */
const ACCENT = '#e0457b';
const S: Record<string, React.CSSProperties> = {
  wrap: { marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  header: { display: 'flex', flexDirection: 'column', gap: '.35rem' },
  title: { margin: 0, fontSize: '1.9rem', fontWeight: 700, color: 'var(--theme-elevation-1000)' },
  subtitle: { margin: 0, maxWidth: '46rem', color: 'var(--theme-elevation-600)', lineHeight: 1.5 },

  statGrid: {
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '.25rem',
    padding: '1.1rem 1.25rem',
    borderRadius: '10px',
    border: '1px solid var(--theme-elevation-150)',
    background: 'var(--theme-elevation-50)',
    textDecoration: 'none',
    transition: 'border-color .15s ease',
  },
  statValue: { fontSize: '1.8rem', fontWeight: 700, color: 'var(--theme-elevation-1000)', lineHeight: 1 },
  statLabel: { fontSize: '.85rem', color: 'var(--theme-elevation-600)' },

  panel: {
    padding: '1.25rem 1.4rem',
    borderRadius: '12px',
    border: '1px solid var(--theme-elevation-150)',
    background: 'var(--theme-elevation-50)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  panelTitle: { margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--theme-elevation-900)' },
  panelHint: { margin: '-.4rem 0 0', fontSize: '.88rem', color: 'var(--theme-elevation-600)' },

  pageGrid: { display: 'grid', gap: '.75rem', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' },
  pageCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '.3rem',
    padding: '.9rem 1rem',
    borderRadius: '10px',
    border: '1px solid var(--theme-elevation-150)',
    background: 'var(--theme-elevation-0)',
    textDecoration: 'none',
    transition: 'border-color .15s ease, transform .15s ease',
  },
  pageCardSoon: { opacity: 0.55 },
  pageName: { fontSize: '1rem', fontWeight: 700, color: 'var(--theme-elevation-1000)' },
  pageOpen: { fontSize: '.8rem', fontWeight: 600, color: ACCENT },
  pageSoon: { fontSize: '.75rem', fontWeight: 600, color: 'var(--theme-elevation-500)' },

  actionRow: { display: 'flex', flexWrap: 'wrap', gap: '.6rem' },
  actionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '.6rem 1rem',
    borderRadius: '8px',
    fontSize: '.9rem',
    fontWeight: 600,
    textDecoration: 'none',
    border: '1px solid var(--theme-elevation-200)',
    background: 'var(--theme-elevation-100)',
    color: 'var(--theme-elevation-800)',
  },
  actionBtnPrimary: { background: ACCENT, borderColor: ACCENT, color: '#fff' },
  actionBtnGhost: { background: 'transparent' },

  list: { margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.55rem' },
  listItem: { display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '.5rem', fontSize: '.92rem' },
  listWhat: { color: 'var(--theme-elevation-800)' },
  listArrow: { color: 'var(--theme-elevation-400)' },
  listWhere: { color: ACCENT, fontWeight: 600 },
};

export default WelcomeDashboard;
