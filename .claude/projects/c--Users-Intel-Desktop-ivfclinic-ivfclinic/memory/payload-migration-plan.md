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

Status as of 2026-06-06: analysis complete, plan agreed, NO code written yet. Next action = Step 0 (git init + baseline commit), then Step 1 (Payload install).
