# Wave 4.7A — Admin UX Simplification: Execution Plan

**Status:** Execution plan only. No code in this document. Implements the approved [WAVE-4.7-PLAN.md](./WAVE-4.7-PLAN.md) audit.
**Branch context:** `feat/payload-cms-poc`, Payload `^3.85.0` (`@payloadcms/next`, `db-postgres`, `richtext-lexical`).
**Scope of 4.7A:** Phase 1 (IA + labels + helper text + footgun hide/lock), Phase 2 (presentational tabs), Phase 3 (branding). **The `clinic` role tier from audit §7 is deferred to 4.7B** (it touches the `Users.roles` enum and needs its own migration review).

---

## 0. The Load-Bearing Invariant

Everything in 4.7A is **presentation/config metadata on existing field definitions.** Nothing changes a field's `name`, a collection/global `slug`, the stored data shape, or the rendered front end.

| Lever used | Payload property | Touches DB? | Touches `payload-types.ts`? | Touches render? |
|---|---|---|---|---|
| Sidebar grouping | `admin.group` (string) | No | No | No |
| Collection/global display name | `labels` / `admin.useAsTitle` | No | No | No |
| Field label | `label` | No | No | No |
| Helper text | `admin.description` | No | No | No |
| Hide a field (UI) | `admin.hidden` | No | No | No |
| Lock a field (UI) | `admin.readOnly` | No | No | No |
| **Enforce** a lock (server) | field `access.update` | No | No | No |
| Section tabs | **unnamed** `type: "tabs"` | **No** (see §2.0) | No | No |
| Collapsible section | `type: "collapsible"` | No | No | No |
| Branding | `admin.components` / `meta` / `css` | No | No | No |

**The proof gate (used throughout §3):** after each phase, `payload generate:types` must produce a **byte-identical `src/payload-types.ts`**, and the 47-route `seo:diff` baseline must stay green. If either moves, a presentational change accidentally became a structural one — stop and fix.

---

## 1. Implementation Architecture

### 1.1 Field names are the contract; labels are free
Every resolver (`src/lib/services.ts`, `treatment-content.ts`, `location-content.ts`, `about.ts`, `homepage.ts`, `doctors.ts`, `header.ts`, `footer.ts`, `contact.ts`) and every seed fixture (`scripts/seed/*.json`) reads/writes fields **by `name`**. `label`, `admin.description`, `admin.group`, `admin.hidden`, `admin.readOnly` are never read by application code. → Renaming/hiding is invisible to resolvers, seeds, REST, and the front end **by construction.**

### 1.2 Why footgun-locking won't break seeds
Seed scripts (`seed-globals.mjs`, `seed-locations.mjs`, treatments/services/doctors seeds) authenticate via REST as `admin@bfi.local` and POST/PATCH with a JWT. Field-level `access.update` **is** enforced on that path — but the seed user is an **admin**, so any `isAdminField`-gated field still writes. `admin.readOnly`/`admin.hidden` are UI-only and never affect REST. → **Locking Class-A footguns with the existing `isAdminField` helper is seed-safe.** No seed script changes required.

### 1.3 Tabs strategy (the one real trap)
Payload `tabs` come in two forms:
- **Named tab** → nests data under the tab name (`hero` becomes `tabName.hero`). **Forbidden in 4.7A** — it changes every field path, breaks resolvers, and forces a migration.
- **Unnamed tab** (`{ label: "Hero", fields: [...] }`, no `name`) → fields stay at the **same level**; pure presentation. **This is what we use.**

`collapsible` and `row` are likewise presentational. The existing configs already use `row` heavily, proving the pattern is safe here.

### 1.4 Branding architecture
Stock admin today (`src/app/(payload)/layout.tsx` is the unmodified scaffold; `payload.config.ts` `admin` block only sets `user` + `importMap`). Branding is additive:
- Custom React components in a new `src/components/payload/` dir, wired through `payload.config.ts` `admin.components`.
- A custom SCSS file wired through `admin.css`, overriding Payload's CSS variables.
- `payload generate:importmap` regenerates `src/app/(payload)/admin/importMap.js` so the components resolve. **This is the only generated-file change in the whole wave**, and it is admin-only (no front-end/DB effect).

---

## 2. File-Level Change List

### Phase 1 — IA, Labels, Helper Text, Footgun Removal

> All edits are to existing field-definition objects. No new files. No `payload.config.ts` change (sidebar order is driven entirely by per-collection/global `admin.group`).

| # | File | Changes | Complexity |
|---|---|---|---|
| 1.1 | `src/collections/Pages.ts` | `admin.group: "Website Pages"`; collection `labels` → "Contact Page"; `slug` → label "Page URL ID", read-only-after-create + description; `hero.lead`/`em` → "Heading text"/"Highlighted word(s)" | S |
| 1.2 | `src/collections/Blogs.ts` | `admin.group: "Blog"`; `labels` → "Article"/"Articles"; `slug` → "Page URL ID" read-only-after-create; `treatmentSlugs` → "Related treatment IDs" + website-team note; `readMins`/`publishedAt` descriptions reworded for editors | S |
| 1.3 | `src/collections/Authors.ts` | `admin.group: "Blog"`; `labels` → "Author / Reviewer"; `slug` read-only-after-create; `sameAs` → "Official profile links" | S |
| 1.4 | `src/collections/Categories.ts` | `admin.group: "Blog"`; `slug` read-only-after-create + label | XS |
| 1.5 | `src/collections/Services.ts` | `admin.group: "Treatments & Services"`; `slug`/`href` read-only + labels; `published` → "Show this service's link on location pages"; `schemaType`+`fallback`+`reviewerSlug`+`lastReviewed` → `access.update: isAdminField` + `admin.condition` hide for editors; rename `desc`/`t`/`d`/`whoFor` etc.; friendly icon `select` labels | **M** |
| 1.6 | `src/collections/Doctors.ts` | `admin.group: "Doctors"`; `slug`/`image` read-only + labels; `medicalSpecialty`/`locations`/`treatments` → admin-only/read-only; rename `shortBio`/`experienceLabel` etc.; soften `verified` admin wording | **M** |
| 1.7 | `src/collections/Treatments.ts` | `admin.group: "Treatments & Services"`; `slug`/`href` read-only; `procedure.*`+`schemaType`-equivalents+`reviewerSlug`+`lastReviewed` → admin-only; rename `h1`/`h1Em`/`whoNeedsIt`/`whatIs`/`whyUs`/`t`/`d`/`n`; `meta` group → "Search engine & social preview"; friendly icon labels | **L** (largest field count) |
| 1.8 | `src/collections/Cities.ts` | `admin.group: "Locations"`; `slug` read-only; **Class-A lock**: `built`, `womensHealth` → `admin.hidden`/`isAdminField` + "code-owned" warning; rename `intro`(Paragraph)/`faqs` labels; describe `helpline`/`helplineLabel` split | **M** |
| 1.9 | `src/collections/Centres.ts` | `admin.group: "Locations"`; `slug`/`citySlug` read-only; **Class-A lock** (`built`, `isHeadOffice`, `geo`, `opening`, `reviewsKey`, `doctors`/`treatments`/`womensHealth` slug-lists) → `admin.hidden`/`isAdminField` + warnings; keep editorial arrays (`nearby`/`landmarks`/`howToReach`/`facilities`/`intro`/`faqs`/`gallery`) editable with renamed labels | **L** (highest footgun density) |
| 1.10 | `src/collections/Media.ts` | `admin.group: "Media Library"`; `alt` → description "Describe the image for accessibility & SEO" | XS |
| 1.11 | `src/collections/Users.ts` | `admin.group: "User Management"`; (already admin-gated — no access change) | XS |
| 1.12 | `src/globals/Homepage.ts` | `admin.group: "Website Pages"`; rename single-letter fields (`v`/`s`/`l`/`n`/`q`/`r`/`t`/`d`/`h`); `headlineItalic`→"Highlighted word in headline"; friendly icon labels (already `{label,value}` ✅ verify) | **M** |
| 1.13 | `src/globals/About.ts` | `admin.group: "Website Pages"`; global `label` → "About BFI"; rename `y`/`t`/`d`/`c`/`n`; friendly trust-pillar icon labels | S |
| 1.14 | `src/globals/BlogHub.ts` | `admin.group: "Website Pages"`; `label` → "Blog Landing Page" | XS |
| 1.15 | `src/globals/Header.ts` | `admin.group: "Website Settings"`; `label` → "Header & Navigation"; `megaCols` → admin-only; `styleVariant` → `admin.hidden` (inert); top-of-field help on `navItems` | S |
| 1.16 | `src/globals/Footer.ts` | `admin.group: "Website Settings"`; rename `channel` option "None — use the URL below" → "Custom URL"; reword `channel` description | XS |
| 1.17 | `src/globals/ContactInfo.ts` | `admin.group: "Website Settings"`; `label` → "Contact Details"; (icon labels already friendly ✅) | XS |
| 1.18 | `src/globals/SiteSettings.ts` | `admin.group: "Website Settings"`; `label` → "Brand & Identity"; `knowsAbout`/`socialLinks` → "Official profile links" (already admin-gated ✅) | XS |
| 1.19 | `src/fields/seo.ts` | Shared SEO group: label fields "Search title"/"Search description"/"Social title"/etc. + length-guidance descriptions. **One edit improves every page.** | S |

**Optional (recommended) — sidebar ordering:** Payload renders groups alphabetically. To force the §1.2 audit order, prefix group strings with a stable scheme (e.g. a leading numeral or fixed emoji). Decide once and apply identically across 1.1–1.18. *(Pure string choice; no functional effect.)*

### Phase 2 — Presentational Tabs (UNNAMED ONLY)

> No field `name` changes. Wrap existing top-level fields in unnamed `tabs`. Front end + resolvers + seeds untouched.

| # | File | Changes | Complexity |
|---|---|---|---|
| 2.1 | `src/globals/Homepage.ts` | Wrap the 11 existing groups into unnamed tabs in visitor order: Hero / Stats / Why Bavishi / Why Choose / Suraksha / Awards / Events / Videos / FAQs / Final CTA / Search Engine Settings (`seo`). Add a `ui`/description help block per tab. | **M** |
| 2.2 | `src/globals/About.ts` | Unnamed tabs: Hero / At a Glance / Milestones / Trust Pillars / Patient Stats / Our Network / Final CTA / SEO | S |
| 2.3 | `src/collections/Cities.ts` | Unnamed tabs: Basics / Contact / Hero / Editorial / *Advanced (website team)* (the Class-A locked fields collected behind one clearly-labelled tab) | S |
| 2.4 | `src/collections/Centres.ts` | Unnamed tabs: Basics / Address & Contact / Hero & Map / Local SEO / Editorial / *Advanced (website team)* (Class-A: geo/opening/slug-lists/built/reviewsKey) | **M** |
| 2.5 | `src/collections/Doctors.ts` | Unnamed tabs: Identity / Reach / Bio / Credentials & E-E-A-T / Flags (admin) | S |

> **Treatments/Services tab-ification** is the same pattern but deferred to a 4.7A follow-up commit if time-boxed — they are the largest configs and Phase 1 already delivers their biggest wins. Listed here for completeness; mark optional in the commit plan.

### Phase 3 — Bavishi Branding

| # | File | Changes | Complexity |
|---|---|---|---|
| 3.1 | `src/components/payload/Logo.tsx` *(new)* | Full-size brand logo for login + nav (server component; reuse `/assets/logo.png` or an SVG). | S |
| 3.2 | `src/components/payload/Icon.tsx` *(new)* | Small square nav icon / favicon-style mark. | XS |
| 3.3 | `src/components/payload/BeforeDashboard.tsx` *(new)* | "Welcome to the Bavishi Website Manager" panel: greeting + quick links (Edit Homepage, Add Article, Update a Doctor) + "Need help? Contact the website team". | **M** |
| 3.4 | `src/components/payload/BeforeLogin.tsx` *(new, optional)* | Short reassuring copy on the login screen. | XS |
| 3.5 | `src/styles/payload-admin.scss` *(new)* | Override Payload CSS variables → brand palette + typography (warm/medical, not default blue). | **M** (visual iteration) |
| 3.6 | `src/payload.config.ts` | Add `admin.components.graphics.{Logo,Icon}`, `admin.components.beforeDashboard`, (`beforeLogin`), `admin.meta.{titleSuffix:"— Bavishi Website Manager", icons, ogImage}`, `admin.css: path to 3.5`. | S |
| 3.7 | `src/app/(payload)/admin/importMap.js` *(generated)* | Regenerated by `payload generate:importmap` so the new components resolve. **Do not hand-edit.** | XS (command) |

**Total new files:** 4–5 (all under `src/components/payload/` + one SCSS). **Total generated-file changes:** 1 (`importMap.js`).

---

## 3. Validation Checklist

Run after **each phase** (gates are cumulative):

**A. Structural proof (zero-schema guarantee)**
- [ ] `payload generate:types` → `git diff src/payload-types.ts` is **empty**. *(If not, a named-tab or stray `name` change slipped in — revert it.)*
- [ ] `git diff` shows changes **only** in `admin`/`label`/`labels`/`access` keys (Phase 1–2) or new `src/components/payload/*` + `payload.config.ts` admin block + `importMap.js` (Phase 3). No field `name`, no collection/global `slug`, no `fields[].type` data-bearing change.
- [ ] No new/changed file under `migrations/` or DB schema. No `payload migrate` needed.

**B. Render / SEO proof (zero front-end impact)**
- [ ] `npm run build` succeeds (typecheck passes).
- [ ] `seo:diff` against the 47-route baseline is **green** (no metadata/JSON-LD/markup delta).
- [ ] Spot-check 3 live routes (homepage, one treatment, one centre) render byte-identical.

**C. Resolver / data proof (zero resolver impact)**
- [ ] Re-run the existing seed roundtrip checks (`roundtrip-about.mts`, `roundtrip-locations.mts`) → still pass (field names unchanged).
- [ ] Re-run seeds (`seed-globals.mjs`, `seed-locations.mjs`, treatments/services/doctors) as admin → all 200/OK (footgun `access` gates pass for admin).

**D. Admin UX proof (the actual goal)**
- [ ] Log in as an **editor** test user: sidebar shows the new English groups in order; Class-A footguns are hidden/read-only; every editable field has a plain-English label + description.
- [ ] Log in as **admin**: Class-A fields visible (read-only or editable per spec); Users + Brand & Identity present.
- [ ] Phase 2: each tabbed surface opens in visitor order; no data lost on save (edit → save → reload shows persisted values).
- [ ] Phase 3: login screen + nav show Bavishi logo; browser tab reads "… — Bavishi Website Manager"; dashboard shows the welcome panel; theme matches brand.

---

## 4. Rollback Strategy

- **Granularity:** every change is config in a single collection/global file → rollback is `git revert` of the specific commit (see §5). No data to migrate back, because no data changed.
- **Phase 1 & 2:** since DB/schema/data are untouched, reverting the file restores the prior admin UI instantly on redeploy. **No data cleanup, no down-migration, zero risk to stored content.**
- **Phase 3:** revert `payload.config.ts` admin block + delete `src/components/payload/*` + re-run `payload generate:importmap` to regenerate a clean `importMap.js`. The `(payload)/layout.tsx` scaffold was never modified, so the panel falls back to stock cleanly.
- **Partial rollback:** because commits are split per concern (§5), a single problematic change (e.g. one over-aggressive field hide) can be reverted without touching the rest.
- **Safety net:** tag the pre-wave commit (`git tag pre-4.7a`) so the entire wave can be diffed/reverted as a unit if needed.

---

## 5. Recommended Commit Breakdown

Small, reviewable, each independently revertible. Each commit ends green on the §3 gates.

| Commit | Contents | Files |
|---|---|---|
| **C1** `feat(admin): sidebar IA + collection/global display names` | All `admin.group` + `labels`/`label` renames only (no field-level changes) | 1.1–1.18 (group/label lines) |
| **C2** `feat(admin): plain-English field labels + helper text` | Field `label` + `admin.description` across all collections/globals + shared `seo.ts` | 1.1–1.19 |
| **C3** `feat(admin): hide/lock Class-A + schema footguns` | `admin.hidden`/`admin.readOnly`/`access.update: isAdminField` on inert/technical fields | 1.5–1.9, 1.15 |
| **C4** `feat(admin): presentational tabs for Homepage + About` | Unnamed tabs | 2.1, 2.2 |
| **C5** `feat(admin): presentational tabs for Locations + Doctors` | Unnamed tabs | 2.3–2.5 |
| **C6** *(optional)* `feat(admin): tabs for Treatments + Services` | Unnamed tabs | Treatments.ts, Services.ts |
| **C7** `feat(admin): Bavishi branding — logo, icon, meta, theme` | Components + SCSS + config + importMap regen | 3.1–3.7 |
| **C8** `feat(admin): welcome dashboard + login screen` | `BeforeDashboard`/`BeforeLogin` | 3.3, 3.4, config |

> Splitting C1–C3 keeps each diff scannable (labels vs. behaviour vs. access). C7/C8 are separable so branding can ship even if dashboard copy needs iteration.

---

## 6. Go / No-Go Review

### Confirmations requested by the brief
| Guarantee | Status | Basis |
|---|---|---|
| **Zero SEO impact** | ✅ Confirmed | No field `name`/shape change → resolvers emit identical metadata/JSON-LD. `seo:diff` 47-route baseline is the enforcing gate (§3B). |
| **Zero resolver impact** | ✅ Confirmed | Resolvers read by field `name`; only `label`/`admin`/`access` change. Roundtrip checks (§3C) enforce it. |
| **Zero route impact** | ✅ Confirmed | No collection/global `slug` change, no `generateStaticParams` input change, no new routes. Route topology stays code-owned (ADR-0001). |
| **Zero migration** | ✅ Confirmed | DB columns are keyed on field `name`; unchanged. Unnamed tabs don't nest data. `payload-types.ts` diff-empty gate (§3A) proves it. |
| **Seed-safe** | ✅ Confirmed | Seeds run as admin over REST; `isAdminField` gates pass; UI-only flags don't affect REST (§1.2). |

### Migration / execution risks (and mitigations)
| Risk | Severity | Mitigation |
|---|---|---|
| Accidentally using a **named** tab → data nesting + migration | **High if it happens** | Hard rule §1.3 + the diff-empty `payload-types.ts` gate catches it immediately |
| `admin.readOnly` mistaken for security (it's UI-only) | Medium | Use field `access.update` for anything that must be *enforced*, not just hidden (§3 spec) |
| `slug` locked always-read-only → can't create new docs | Medium | Lock **after create** (condition on operation/`id`), not blanket |
| Over-hiding a field an editor actually needs | Low | Per-field commit (C3) is independently revertible; editor walkthrough in §3D |
| `importMap.js` drift if hand-edited | Low | Only ever regenerate via `payload generate:importmap` |
| Branding SCSS overrides break admin layout | Low | Override CSS variables only (not structural selectors); Phase 3 is last + isolated |

### Recommendation: **GO**

- Phase 1 and Phase 2 are **byte-safe, migration-free, and fully revertible** — the highest-value, lowest-risk work; ship first.
- Phase 3 is additive and isolated to the admin surface; ship after, with room to iterate on theme/dashboard copy.
- The **`clinic` role tier is correctly out of 4.7A** (enum/migration surface) → schedule as **4.7B** after this lands.
- Proceed commit-by-commit (C1→C8), running the §3 checklist as the gate between each.

---

*Prepared as the Wave 4.7A execution plan. Gated on: (a) confirmation of the sidebar ordering scheme (§2 optional note), and (b) go-ahead to begin at commit C1.*
