# Wave 4.5 — Pre-Implementation Design Review & Migration Plan

**Status:** Planning only. No code, schema, or data is changed by this document.
**Branch context:** `feat/payload-cms-poc`, after Wave 4.4 (Treatments CMS complete, `2cca94a`).
**Entity-graph decision:** Governed by [ADR-0001](./ADR-0001-entity-relationships.md) — Wave 4.5 proceeds on **Option A (slug-string relationships)**. No Payload `relationship` fields are introduced.
**Pattern of record:** Wave 4.1 (Services) → 4.2 (Homepage) → 4.3 (Doctors) → 4.4 (Treatments). This plan follows that playbook exactly.

---

## 0. TL;DR

1. **Locations is the wave.** It is the largest remaining code-only entity: 15 centres + 8 cities, full `MedicalClinic`/`LocalBusiness` schema, geo, opening hours, FAQs, 360° panoramas, galleries, and the city↔centre↔doctor↔treatment↔women's-health slug graph. This is a true Wave 4.3/4.4-scale migration.
2. **The "Women's Health Registry" is mostly already migrated — and the rest should stay code-owned.** The *rich* maternity page content (`SERVICE_CONTENT`) is already CMS-backed via the **Services** collection (Wave 4.1). What remains code-owned is the *light* `WOMENS_HEALTH_SERVICES` registry (key/name/desc/icon/href/published/fallback), which is consumed **synchronously, client-side** inside `<AvailableServicesSection>` — structurally identical to `TREATMENTS_REGISTRY`/`treatmentRef()`, which Wave 4.4 deliberately kept in code. **Recommendation: keep it code-owned.** Migrating it buys no rendered-output or SEO change and adds an async dependency to client location components.
3. **About-BFI is a small, self-contained migration.** The page is hardcoded JSX (`src/components/about-page.tsx`) with three local data arrays. It maps cleanly to a single Payload **global** (`about-page`) with a `resolveAbout()` fallback — the Homepage (4.2) playbook in miniature.
4. **Recommended scope split:** ship **Locations** as the spine of Wave 4.5; fold **About-BFI** in as a low-risk satellite; **defer / decline** the Women's-Health-registry migration with a one-paragraph rationale (it is the Locations analogue of the code-owned treatment registry).
5. **Byte-identical guarantee holds** via the established seam: code arrays remain the canonical source for all cross-app synchronous helpers and `generateStaticParams`; the CMS overlays **page content only**, per-section, with code defaults as fallback. The 47-route `seo:diff` baseline is the control.

---

## 1. Audit — `src/lib/locations.ts` (1,206 lines)

### 1.1 Data model

| Type | Count | Notes |
|---|---|---|
| `Centre` | 15 objects in `CENTRES[]` | Ahmedabad ×3, Mumbai ×5, + 6 single-centre cities (Vadodara, Surat, Bhuj, Bhavnagar, Anand, Varanasi) |
| `City` | 8 objects in `CITIES[]` | Ahmedabad, Mumbai, Vadodara, Surat, Bhuj, Bhavnagar, Anand, Varanasi |

**`Centre` fields** (`locations.ts:23-58`): `slug`, `citySlug`, `name`, `fullName`, `isHeadOffice?`, `area`, `address`, `pin`, `phone`, `phoneLabel`, `hours`, `opening{opens,closes,days?}`, `geo?{lat,lng}`, `mapQuery`, `image`, `hero360Url?`, `nearby[]`, `landmarks[]`, `howToReach[]`, `facilities[]`, `doctors[]` (slugs), `treatments[]` (slugs), `faqs[]`, `reviewsKey?`, `sameAs?[]`, `intro`, `gallery[]`, `womensHealth?[]` (keys), `built`.

**`City` fields** (`locations.ts:60-78`): `slug`, `name`, `region`, `country`, `helpline`, `helplineLabel`, `whatsapp`, `heroImage`, `hero360Url?`, `intro[]`, `faqs[]`, `womensHealth?[]`, `built`.

### 1.2 Field classification (drives what migrates vs. what stays code-owned)

**Class A — Structural / relational / gating (STAY CODE-AUTHORITATIVE):**
`slug`, `citySlug`, `built`, `isHeadOffice`, `geo`, `opening`, `doctors[]`, `treatments[]`, `womensHealth[]`, `reviewsKey`. These feed `generateStaticParams`, `cityHasOwnPage`, schema builders, and cross-app helpers. Changing them from code would change the route set or the schema graph — the two things `seo:diff` exists to protect.

**Class B — Editorial page content (MIGRATABLE):**
`name`, `fullName`, `area`, `address`, `pin`, `phone`, `phoneLabel`, `hours`, `mapQuery`, `image`, `hero360Url`, `nearby[]`, `landmarks[]`, `howToReach[]`, `facilities[]`, `faqs[]`, `intro`, `gallery[]`, `sameAs[]`, `helpline`/`helplineLabel`/`whatsapp`/`heroImage` (city). These are the body copy an editor would touch.

> Note the overlap: schema builders consume **both** classes (e.g. `address`, `geo`, `nearby` → `areaServed`, `treatments` → `availableService`, `faqs` → `faqSchema`). The migration must therefore resolve the centre/city **once** per route and feed the *same* resolved object to both the rendered template **and** the schema builder — exactly as Wave 4.4 fed one `ResolvedTreatment` to both `<TreatmentPage>` and `treatmentGraph()`.

### 1.3 Derived logic (STAYS CODE-OWNED — the "registry" analogue)

- **URL helpers:** `cityUrl`, `centreUrl`, `centreMapUrl`, `cityHref`, `centreHref` (`:81-84, :1006-1013`).
- **Collapse rule:** `cityHasOwnPage()` — a city earns a hub page only with >1 built centre; single-centre cities serve the centre at `/locations/[city]` (`:999-1013`). **This is load-bearing for routing and canonicals.**
- **Lookups:** `cityBySlug`, `centreBySlug`, `centresForCity` (`:984-987`).
- **Static params:** `builtCityParams`, `builtCentreParams` (`:1054-1059`) — **must stay code-owned** so the static route set is identical regardless of CMS/DB state (the Wave 4.1 published-gate precedent).
- **Entity graph:** `FOUNDER_SLUG`, `CITY_DOCTORS`, `doctorSlugsForCity`, `treatmentSlugsForCity` (`:1024-1049`).
- **Back-compat link refs (cross-app):** `LocationRef`, `locationRef`, `cityLocations`, `centresForLocationSlugs` (`:1063-1105`) — consumed by doctor pages, homepage, service pages.
- **Schema builders:** `centerClinicSchema`, `centerGraph`, `cityGraph` (`:1114-1205`) — import `doctorBySlug`/`physicianSchema`/`doctorUrl` (`doctors.ts`), `treatmentRef` (`treatments.ts`), `getReviews`/`reviewNodes` (`reviews.ts`), `ORG_ID`/`WEBSITE_ID`/`abs`/`breadcrumbSchema`/`faqSchema` (`seo.ts`).

### 1.4 Blast radius — importers of `@/lib/locations`

8 files (`Grep` confirmed):
- **Route pages (2):** `locations/[city]/page.tsx`, `locations/[city]/[center]/page.tsx` — the migration targets.
- **Location components (3):** `center-page.tsx`, `city-page.tsx`, `location-sections.tsx` — consume `Centre`/`City` objects + helpers. `city-page`/`center-page` are **client components** and call `womensHealthServices(...)` client-side.
- **Cross-app (3):** `doctor-page.tsx` (`locationRef`, `centresForLocationSlugs`), `home-page.tsx` (`cityLocations`), `service-page.tsx` (location refs). **These call locations helpers synchronously and must keep working unchanged** — they are not on the location routes and must not become async.

**Design consequence:** keep `CENTRES`/`CITIES` code arrays as the canonical synchronous source for §1.3 helpers and all cross-app importers. Seeded CMS data == code defaults, so those helpers stay byte-identical. Only the two **location route pages** gain an async CMS overlay for their rendered content + schema.

---

## 2. Women's Health Registry — assessment & recommendation

**Current state (`womens-health.ts`):**
- `SERVICE_CONTENT` (rich `/services/[slug]` pages) — **already CMS-backed** via the **Services** collection (Wave 4.1). The `services` collection schema (`Services.ts:69-90`) even stores the registry fields (`slug`/`name`/`desc`/`icon`/`href`/`published`/`fallback`/`schemaType`) per doc. `getService(slug)` → `resolveService()` → falls back to `SERVICE_CONTENT`.
- `WOMENS_HEALTH_SERVICES` (the light registry) + `womensHealthServices(keys)` — **code-owned, consumed synchronously client-side** in `<AvailableServicesSection>` (`city-page.tsx:163`, `center-page.tsx:145`).

**Why it should stay code-owned (recommended):**
1. It is the exact structural twin of `TREATMENTS_REGISTRY`/`treatmentRef()` — a curated, cross-cutting catalog consumed inside **client** components — which Wave 4.4 explicitly kept in code (constraint #1).
2. Migrating it changes **no rendered HTML and no JSON-LD** (the schema for these services is emitted from the Services collection already). Per ADR-0001 §5, that is all-cost-no-SEO-benefit.
3. It would force an **async list fetch** (`getServices()` — does not exist today) into client location components, or a server pre-resolve + prop drill, adding a failure mode to a path that is currently pure and synchronous.
4. The `published` gate is code-driven by design (mirrors Wave 4.1) so the crawlable-link set is deterministic.

**If a future wave does migrate it:** add a `getServices()` list fetcher (cached + tagged `services`), pre-resolve registry cards server-side in the two location route pages, and prop-drill into `<AvailableServicesSection>` — never fetch client-side. Gate behind `seo:diff` for the location routes. This is a **Wave 4.7+** candidate, not 4.5.

---

## 3. About-BFI — assessment & recommendation

**Current state:** `about-bfi/page.tsx` is thin (metadata + static `AboutPage` JSON-LD graph). All content lives in `src/components/about-page.tsx` (`"use client"`) as three local consts: `milestones[]` (y/t/d), `trustPillars[]` (icon/t/d), `cities[]` (c/n display strings), plus hero/section prose inline in JSX.

**Recommended model:** a single Payload **global** `about-page` (the Homepage 4.2 playbook), with a pure `resolveAbout()` and `ABOUT_DEFAULTS`. Sections: `hero`, `milestones[]`, `trustPillars[]` (icon name + t + d), `citySummary[]`, and any CTA copy. Icons stored as `ICON_NAMES` (curated select → `ICON_MAP`), consistent with Services/Treatments.

**⚠ Data-drift flag (must preserve byte-identically):** `about-page.tsx` marketing copy is **independent of** `CENTRES`/`CITIES` — it says **"15 centres"** and **"Mumbai · 6 centres"**, while `CENTRES[]` actually contains **14 centres total / 5 in Mumbai**. The About copy is curated marketing, not derived. The migration must seed these literal strings verbatim (do **not** "fix" to match `CENTRES` during migration, or `seo:diff` will flag the change and the diff stops being a pure no-op). Any correction is a separate, deliberate content edit after the gate is green.

---

## 4. Recommended Wave 4.5 scope

| Item | Decision | Rationale |
|---|---|---|
| **Locations (cities + centres)** | **In scope — the spine** | Largest code-only entity; unblocks the location half of the graph (ADR-0001 roadmap "Wave 4.6" item, pulled forward). |
| **About-BFI** | **In scope — satellite** | Small, isolated, no cross-app blast radius; reuses the Homepage-global playbook. |
| **Women's Health registry** | **Defer / decline** | Rich content already CMS-backed; light registry is the code-owned `treatmentRef` analogue. Document the deferral; revisit ≥4.7. |

---

## 5. Collection schema design (Locations)

**Two collections, not one.** `cities` and `centres` are distinct entities with a parent→child link. Per ADR-0001 the link stays a **slug string** (`centres.citySlug: text`), **not** a Payload `relationship`.

### 5.1 `cities` collection

```
slug (text, required, unique, index)      // Class A — also the route param
name, region, country (text)
helpline, helplineLabel, whatsapp (text)   // Class B editorial
heroImage (text), hero360Url (text)        // Class B
intro (array<{ text }>)                    // Class B — paragraphs
faqs (array<{ q, a:textarea }>)            // Class B
womensHealth (array<{ value }>)            // Class A — registry keys (string)
built (checkbox)                           // Class A — gating (see §5.3)
```

### 5.2 `centres` collection

```
slug (text, required, index)               // Class A — route param (unique WITHIN city)
citySlug (text, required, index)           // Class A — parent link (slug string, ADR Option A)
name, fullName, area (text)                // Class B
isHeadOffice (checkbox)                    // Class A
address (textarea), pin, phone, phoneLabel, hours (text)   // Class B
opening (group{ opens, closes, days:array<{value}> })       // Class A (schema hours)
geo (group{ lat:number, lng:number })      // Class A (GeoCoordinates)
mapQuery (text), image (text), hero360Url (text)            // Class B
nearby, landmarks, howToReach, facilities (array<{ value }>) // Class B
doctors (array<{ value }>)                 // Class A — doctor slugs
treatments (array<{ value }>)              // Class A — treatment slugs
womensHealth (array<{ value }>)            // Class A — registry keys
faqs (array<{ q, a:textarea }>)            // Class B
sameAs (array<{ value }>)                  // Class B
reviewsKey (text)                          // Class A
intro (textarea)                           // Class B
gallery (array<{ src, alt }>)              // Class B
built (checkbox)                           // Class A — gating (see §5.3)
```

**Collection config (mirror `Services.ts`):** `versions.drafts: true`; `access.read` published-only for anon, full for `req.user`; `create/update/delete: isEditor`; `hooks: revalidateCollection("cities" | "centres")`; `admin.group: "Content"`. Icons N/A here (locations carry no icon fields). `slug` uniqueness for centres is compound (city+slug) — enforce via a `beforeValidate` hook or accept index-only + roundtrip guard (the slug is only unique within a city, e.g. there is no global collision today).

### 5.3 The non-negotiable parity invariant

`built`, `citySlug`, `cityHasOwnPage()`, and `generateStaticParams` (`builtCityParams`/`builtCentreParams`) **stay code-owned**. The CMS may *store* `built`, but the **static route set and canonical URLs are computed from the code arrays**, identical to how Wave 4.1 kept the `published` gate and Wave 4.4 kept `generateStaticParams` in code. This guarantees the route inventory cannot drift with CMS/DB state.

---

## 6. Resolver architecture

New pure module `src/lib/location-content.ts` (mirrors `treatment-content.ts` / `services.ts` — **no `payload`/`server-only` imports**, client-safe):

```
export type ResolvedCity   = { ...City editorial + structural fields, serialisable }
export type ResolvedCentre = { ...Centre editorial + structural fields, serialisable }

export function cityToResolved(c: City): ResolvedCity
export function centreToResolved(c: Centre): ResolvedCentre   // byte-identical fallback shape

export type CitySource | CentreSource   // loose, decoupled from payload-types (like ServiceSource)

export function resolveCity(slug: string, src: CitySource): ResolvedCity | undefined
export function resolveCentre(citySlug: string, slug: string, src: CentreSource): ResolvedCentre | undefined
export function resolveCityFromCode(slug)/resolveCentreFromCode(citySlug, slug)   // client fallback
```

**Per-section fallback** semantics identical to `resolveTreatment`: scalar `src.x || base.x`; arrays `src.arr?.length ? map(src.arr) : base.arr`; optional groups conditional-spread. `{value}[]`/`{text}[]` rows unwrap to `string[]`.

**Server fetchers** in `src/lib/payload.ts` (mirror `getTreatment`/`getTreatments`), cached + tagged:
- `getCity(slug)` → `resolveCity` (tags `cities`, `cities:<slug>`); `try/catch → resolveCity(slug, null)`.
- `getCentre(citySlug, slug)` → `resolveCentre` (tags `centres`, `centres:<slug>`).
- (List fetchers `getCities()`/`getCentres()` only if a sub-section needs them; the route pages need single-doc resolution.)

**Schema builders move to consume the resolved shape.** Refactor `centerGraph`/`cityGraph`/`centerClinicSchema` to accept a `CentreGraphInput`/`CityGraphInput` (a `Pick` of the plain data fields they read), exactly like Wave 4.4 introduced `TreatmentGraphInput`. They keep importing `doctorBySlug`/`treatmentRef`/`reviews` (those stay code-owned). The route then feeds the **same** resolved object to the component and the graph → guaranteed render/schema agreement.

**Cross-app helpers stay code-backed.** `locationRef`, `cityLocations`, `centresForLocationSlugs`, `doctorSlugsForCity`, `cityHasOwnPage`, URL helpers continue reading `CENTRES`/`CITIES`. They are byte-identical because the seed is generated from those same arrays.

---

## 7. Seed strategy (mirror Wave 4.4)

- `scripts/seed/gen-locations.mts` — serialise code defaults via `cityToResolved`/`centreToResolved` → `cities.json` (8) + `centres.json` (15). Pure, deterministic.
- `scripts/seed/seed-locations.mjs` — upsert idempotently: cities keyed by `slug`; centres keyed by **(`citySlug`,`slug`)** compound (look up existing by both, then create/update). Drafts published on seed (`_status: "published"`).
- `scripts/seed/roundtrip-locations.mts` — for each doc: fetch from live Payload API → `resolveCity`/`resolveCentre` → **deep-equal** against `cityToResolved`/`centreToResolved` of the code default. Target **8/8 cities + 15/15 centres PASS**.

About-BFI seed (if scoped here): `gen-about.mts`/`seed-about.mjs` upserting the `about-page` global from `ABOUT_DEFAULTS`, plus roundtrip parity (1/1).

---

## 8. Rollout phases

Same A→E shape as Wave 4.4, with route migration in **city-keyed sub-waves** to bound blast radius.

| Phase | Deliverable | Route changes? |
|---|---|---|
| **A — Resolver** | `location-content.ts`: resolved types, `*ToResolved`, `resolve*`, `*Source`. Refactor `centerGraph`/`cityGraph` to `*GraphInput`. | None |
| **B — Collections** | `Cities.ts`, `Centres.ts`; register in `payload.config.ts`; `getCity`/`getCentre` fetchers; `generate:types`. | None |
| **C — Seed** | `gen-locations.mts` + `cities.json`/`centres.json` + `seed-locations.mjs`. Seed DB. | None |
| **D — Roundtrip** | `roundtrip-locations.mts`; 8/8 + 15/15 parity. | None |
| **E — Schema/types** | Confirm no new icons needed; regen `payload-types.ts`; verify cross-app helpers untouched. | None |
| **R1 — Pilot route** | Migrate **one single-centre city** end-to-end: **Surat** (already in `seo:diff` baseline, simplest path — collapses to centre, no hub). Route reads `getCentre`, feeds resolved obj to `CenterPage` + `centerGraph`; `notFound` guard; route stays `○ Static`. | `/locations/surat` |
| **R2 — Multi-centre pilot** | **Ahmedabad** (hub + 3 centres) — exercises `cityGraph` + `cityHasOwnPage` + nested `[center]` route. Baseline already has `/locations/ahmedabad`, `/locations/ahmedabad/paldi`. | Ahmedabad routes |
| **R3 — Remaining cities** | Mumbai (5 centres) + Vadodara, Bhuj, Bhavnagar, Anand, Varanasi. | All remaining location routes |
| **R4 — About-BFI** | `about-page` global + `resolveAbout` + `ABOUT_DEFAULTS`; `AboutPage` reads resolved props (server-resolve, prop-drill into the client component); seed + roundtrip; preserve "15"/"6 centres" verbatim. | `/about-bfi` content path (URL unchanged) |

Phases A–E carry **zero route changes** and are independently safe to commit (CMS overlay exists but nothing reads it yet → byte-identical). This is the Wave 4.4 "foundational commit" pattern.

---

## 9. Validation gates (every commit must pass)

1. `npm run generate:types` — clean.
2. `npx tsc --noEmit` — clean.
3. `npm run build` — exit 0, **static page count unchanged** (location routes stay `○ Static`).
4. **Roundtrip parity** — 8/8 cities + 15/15 centres (+1/1 about) deep-equal.
5. **`npm run seo:diff`** — the 47-route baseline + any newly-added location routes are **byte-identical**. This is the primary control.
6. Cross-app smoke: doctor profile contact cards (`centresForLocationSlugs`), homepage locations strip (`cityLocations`), service-page location refs render unchanged.

**SEO routes coverage:** baseline already includes `/locations/ahmedabad`, `/locations/ahmedabad/paldi`, `/locations/surat`. Add representative coverage before/with R3: one more multi-centre centre (e.g. `/locations/mumbai/ghatkopar`) and one more single-centre city (e.g. `/locations/bhuj`) so the diff exercises both code paths and the 360°/geo/`sameAs` variations.

---

## 10. SEO parity strategy

The location pages emit the richest schema on the site — `centerClinicSchema` produces `["MedicalClinic","LocalBusiness"]` with `geo`, `openingHoursSpecification`, `hasMap`, `areaServed` (from `nearby`), `availableService` (from `treatments` → `treatmentRef`), `sameAs`, and verified review nodes; plus `MedicalWebPage`, `breadcrumbSchema` (with the single-centre-collapse branch), `faqSchema`, and per-city `physicianSchema` for the whole doctor team.

**Parity is preserved by construction:**
- The route resolves the centre/city **once** and feeds the identical object to the template and the schema builder (no second source of truth).
- Class-A structural fields stay code-authoritative, so `areaServed`/`availableService`/hours/geo/breadcrumb-collapse cannot drift with CMS state.
- `treatmentRef`, `doctorBySlug`, `physicianSchema`, `getReviews`/`reviewNodes` remain code-owned → the doctor/treatment/review halves of the graph are untouched.
- Seed == code defaults → first render after migration is provably identical; `seo:diff` proves it per route.
- 360° `hero360Url`, `image`/`heroImage`, and `sameAs` are byte-sensitive — included in the resolved shape and covered by the expanded route set.

**The dangerous moment** (per ADR-0001 §5) is the populate/serialisation change itself, not steady state. `depth: 0` fetches (no relations to populate — Option A) keep this minimal; `seo:diff` is the gate that catches any regression.

---

## 11. Blast radius summary

| Surface | Effect of Wave 4.5 |
|---|---|
| `locations/[city]` + `[center]` route pages | **Rewritten** to async `getCity`/`getCentre` + `notFound` guard (Wave 4.4 page pattern). Stay `○ Static`. |
| `center-page.tsx`, `city-page.tsx` | Accept a resolved object (prop shape compatible with today's `Centre`/`City`); `womensHealthServices` call unchanged (registry stays code-owned). |
| `location-sections.tsx` | Unchanged (pure presentational). |
| `centerGraph`/`cityGraph`/`centerClinicSchema` | Signature widened to `*GraphInput` (`Pick`), backward-compatible with code objects. |
| `doctor-page.tsx`, `home-page.tsx`, `service-page.tsx` | **Unchanged** — keep calling synchronous code-owned helpers. |
| `payload.config.ts`, `payload-types.ts` | +2 collections (+1 global if About). |
| `revalidate.ts` / `cache-tags.ts` | +`cities`/`centres` (+`about-page`) tags. |
| Women's-health / Services | **Untouched.** |

---

## 12. Commit boundaries (proposed)

1. `feat(locations): Wave 4.5 A–E — Cities/Centres collections + resolver + seed + roundtrip` (no route changes; foundational, byte-identical).
2. `feat(locations): Wave 4.5 R1 — CMS-managed Surat (single-centre pilot)`.
3. `feat(locations): Wave 4.5 R2 — CMS-managed Ahmedabad (hub + centres pilot)`.
4. `feat(locations): Wave 4.5 R3 — CMS-managed remaining cities/centres`.
5. `feat(about): Wave 4.5 R4 — CMS-managed About-BFI global` (if About is scoped into 4.5).

Each commit: all six gates green; SEO snapshots committed for any newly-added routes; memory (`MEMORY.md` + a `phase-4-5-locations.md`) updated.

---

## 13. Sign-off — decisions locked (2026-06-09)

1. **Scope:** ✅ **Locations + About-BFI in 4.5; Women's-Health registry deferred** (revisit ≥4.7, per §2).
2. **Modeling:** ✅ **Two collections — `cities` + `centres`** with a slug-string `citySlug` parent link (§5).
3. **About-BFI:** ✅ migrate as a **global**, **preserving the "15 / 6 centres" marketing copy verbatim** — no reconciliation to `CENTRES` during migration (§3).

**Remaining implementation detail (decide at Phase B, not blocking):**
- **Compound centre-slug uniqueness** — enforce via a `beforeValidate` hook vs. index + roundtrip guard. No collisions exist today, so index + roundtrip guard is the lighter default; revisit if a future centre slug repeats across cities.

*Planning document only. No code, schema, or data changed.*
