---
name: payload-migration-plan
description: Phased Payload CMS migration strategy, locked decisions, and POC scope for the BFI/ivfclinic site
metadata:
  type: project
---

Migrating content management from TypeScript registries (src/lib/*.ts) into Payload CMS + PostgreSQL, without redesigning the site or rebuilding templates. Phased: Phase 0 = local dev only; Phase 1 = Contact page POC; later phases = globals → blogs → doctors/locations/centres → treatments (last). Treatments migrate last because `Treatment` type embeds `LucideIcon` React component references (not serializable) — icons are code, not data. (`womens-health.ts` already stores icons as string keys; `treatments.ts` does not.)

**Critical architectural conflict:** the site is built for `output: "export"` static export (`images.unoptimized`, `generateStaticParams` everywhere, deploy = upload `out/`). Payload needs a live Node server + Postgres — it cannot run in a static export. Locally invisible (dev is a server); bites only at production build/deploy.

**Locked decisions (2026-06-06):**
- Production runtime = UNDECIDED; POC informs it. Do NOT remove `output: export` or change next.config.mjs deploy posture. POC conclusion is scoped "validated for local development only."
- Git first: project had NO git repo. Must `git init` + commit baseline before any Payload work (required for reversibility).
- Phase 1 `pages` collection = minimal typed fields only: hero (eyebrow/heading/subtitle) + faqs[] + seo group. Centre directory (15 centres) and contact cards stay HARDCODED in contact-page.tsx (belong to future centres collection + contactInfo global). No block builder. contact-page.tsx refactored to accept props, not rebuilt.

**Guardrail:** Payload's presence must not alter the existing static site's build — verify `next build` still succeeds after install. Protect the SEO/JSON-LD system ([[note in seo.ts]]): diff JSON-LD before/after each migrated page (YMYL site).

**Phase 1 POC COMPLETE & validated (2026-06-06).** Branch `feat/payload-cms-poc` (off `main`), 5 commits f3d45af→05e16a4. All 6 success criteria pass locally: admin loads, edit→publish→render, drafts hidden from public, media upload→OG image, JSON-LD byte-parity (em dashes intact), existing site builds unchanged (all routes still Static/SSG).

Key setup facts:
- Payload 3.85.0 (payload, @payloadcms/next, db-postgres, richtext-lexical, sharp). Next pinned to 15.4.11 (Payload excludes 15.5.x).
- Portable PostgreSQL 16.4 OUTSIDE repo at %USERPROFILE%\pgsql-portable, port 5433, db `bfi_payload`. Control: `powershell -File scripts\pg-local.ps1 start|stop|status`. Not a Windows service — must start manually each session (and before `next build`, since /contact prerenders from DB).
- Admin: /admin, user admin@bfi.local / BfiPayload!2026 (local only — change it). DATABASE_URI + PAYLOAD_SECRET in .env.local (gitignored).
- Existing site moved into src/app/(frontend) route group (URLs unchanged); Payload under src/app/(payload). Config src/payload.config.ts; collections src/collections/{Pages,Media,Users}.ts. Server reads via src/lib/payload.ts getPageBySlug (local API).
- Seeding: `npm run seed:contact` (node scripts/seed-contact.mjs, REST-based, reads scripts/seed/contact.json). NOTE: `payload run` is a silent no-op in this env; PowerShell mangles em dashes to CP1252 0x97 — use curl --data-binary or Node fetch for UTF-8 content.

**Phase 2 (Globals) — partial, validated (2026-06-06).** Implemented `site-settings` global (org identity + social + address + awards + knowsAbout) → drives Organization/WebSite JSON-LD via async root layout `(frontend)/layout.tsx`; and `contact-info` global (cards) → drives contact-page cards. Pattern: schema builders in seo.ts stay PURE (accept optional `SiteIdentity`, fallback to `SITE` const); server layer (`src/lib/payload.ts` getGlobalSafe/getSiteIdentity) fetches + maps; stable @ids/url stay code-owned. Icon-name→component map (`ICONS` in contact-page.tsx) proven — the pattern for future Treatments/Services. Globals seeded via `npm run seed:globals` (scripts/seed-globals.mjs + scripts/seed/*.json, REST/UTF-8 safe). Verified in prerendered static HTML: org node, telephone, 7 awards, 3 sameAs, em-dash/×/middot all byte-exact; all routes still Static; build passes. **Header/Footer/CTA globals deliberately DEFERRED** — they're client-component global chrome rendered on every page; migrating needs a server-shell/context refactor with site-wide blast radius (own focused pass). Collection architecture for Doctors/Locations/Treatments/Services designed in docs/payload-collection-architecture.md (the migration "contract" + per-collection field maps; shared infra to build first = RichText serializer, ICONS registry, revalidate hook, slug→id migration).

Open items for next phases: (1) production runtime still UNDECIDED — /contact is now a static prerender from DB, so prod needs rebuild/on-demand revalidation OR a Node host (static-export incompatibility unresolved). (2) Centre directory + contact cards still hardcoded (future Centres collection + contactInfo global). (3) One deliberate consolidation: FAQ JSON-LD now uses the visible FAQ text (previously route/component diverged) — a Rich Results correctness win.
