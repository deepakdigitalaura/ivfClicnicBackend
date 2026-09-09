# BFI Sanity/Hardcoded Fallback — Phase 1 Audit Report

Re-verified 2026-07-20 by reading the actual resolver code, schemas, and route files (not relying on prior notes). Covers every content area from the prior backend audit (commit `0828b2c`). **No code was changed to produce this report.**

## Headline finding

The classic **all-or-nothing bug** (any Sanity data for a type → hardcoded items for that type vanish) does **not** exist in the per-entity content resolvers anymore. `src/lib/doctors.ts`, `treatment-content.ts`, `services.ts`, `location-content.ts`, `about.ts`, `homepage.ts` all use a consistent, well-built **per-field / per-section merge** convention (`src.field ?? default.field`, `src.items?.length ? … : default.items`), and the three collection types with real hardcoded registries (Doctors, Treatments, Services, Locations) already union **code registry ∪ Sanity-only extras** for their list/static-params functions. This is good, deliberate engineering — it is *not* what the prompt described.

However, I found a **live instance of the same failure mode** in a place the prior audit didn't look closely: **the header and footer navigation menus.** This is a real, confirmed bug of the exact shape described (one Sanity item present → other hardcoded items silently drop out of the menu), currently affecting Treatments, Maternity Services, and Locations nav — not Doctors (Doctors nav is already safe, which is presumably why the original incident there got fixed and nothing else was checked).

---

## Per-area findings

### 1. Doctors — ✅ SAFE (already fixed, this is the incident that got repaired)
- **Pattern:** (b) per-item merge. `getDoctors()` in `payload.ts:340-357` maps every code `DOCTORS` entry through `resolveDoctor(slug, sanityDoc)` (per-field overlay), then appends any Sanity-only doctors not in code. `getNavDoctors()` (`payload.ts:552-584`) does the identical code-first + per-item-overlay + Sanity-only-append pattern, with `defaultDoctorNavRole()`/`defaultDoctorNavOrder()` as code-level defaults so a doctor missing `navRole`/`navOrder` in Sanity still sorts correctly.
- **Matching key:** `slug` (already consistent in both code `DOCTORS` and the `doctor` Sanity schema).
- **Current live risk:** none. Even with only 2/15 doctors seeded in Sanity today, all 15 render correctly everywhere (page, cards, nav).
- **Blast radius:** none.

### 2. Treatments — page content ✅ SAFE / list assembly ⚠️ minor gap
- **Pattern:** (b) per-*section* merge (finer-grained than per-item) in `resolveTreatment()` (`treatment-content.ts:316-492`). Every section (`hero`, `whatIs`, `benefits`, `process`, `risks`, `faqs`, …) falls back independently to the code `TREATMENTS` default.
- **List assembly:** `getTreatments()` (`payload.ts:395-401`) maps only over the code `TREATMENTS` array — it does **not** append Sanity-only treatments (unlike Doctors/Services). `/treatments/[slug]/page.tsx` `generateStaticParams()` calls `getTreatments()` directly, so a treatment created purely in Sanity (no code counterpart) won't be statically pre-rendered — it would still render on-demand via `resolvePureCMSTreatment()` since `dynamicParams` isn't disabled, just not pre-built. **This is a coverage gap for brand-new items, not a data-loss bug** — no existing hardcoded treatment can ever disappear this way.
- **Matching key:** `slug`.
- **Current live risk:** low — all 34 treatments already exist in both code and Sanity (Wave 4.4, `2cca94a`), so the gap is currently dormant.
- **Blast radius:** none for existing content; a brand-new Sanity-only treatment just doesn't get SSG'd immediately.

### 3. Header/Footer — "IVF Treatments" & "Maternity Services" nav — 🔴 BUG CONFIRMED
- **Pattern:** (a) all-or-nothing, scoped **per navCategory**. `getNavTreatments()` (`payload.ts:529-543`) sources **only** from `getSanityTreatments()` — there is no code-registry fallback in this function at all (unlike `getNavDoctors`). `buildTreatmentMega()` (`header.ts:429-448`) and `buildTreatmentGroups()` (`footer.ts:47-63`) then group whatever Sanity returns by `navCategory` and, in `resolveHeader()`/`resolveFooter()`, **wholesale replace** the corresponding hardcoded menu column/footer group the moment that category has ≥1 Sanity item (`header.ts:510`, `footer.ts:293-307`).
  - Concretely: the hardcoded "IVF Treatments" footer group has 11 items (IVF, IVF Failure, IUI, ICSI, PICSI, IMSI, MACS, Spindle View ICSI, Blastocyst Transfer, Laser Hatching, PGT-A/M). The instant **any one** Sanity treatment doc has `navCategory: "advanced-ivf"` set, that entire group is replaced by *only* the Sanity treatments currently carrying that category — any of the other 10 that don't yet have `navCategory` populated in Sanity silently disappear from the footer/header menu (their pages still work fine; they just become unlinked from primary nav).
  - Same mechanism for "Maternity Services" via `buildMaternityMega()`.
- **Matching key:** `slug` (treatment already has this everywhere) — the fix is to give `getNavTreatments()` the same code∪Sanity merge `getNavDoctors()` already has, with a code-level default `navCategory`/`navOrder` per treatment (today only Sanity carries `navCategory` — there's no code equivalent of `defaultDoctorNavRole()`).
- **Current live risk — VERIFIED via read-only query against the production Sanity dataset (2026-07-20, `scripts/check-nav-fallback-risk.mts`):** `count(*[_type=="treatment"])` = **0**. Contrary to what the prior memory notes implied ("Wave 4.4 COMPLETE," "byte-identical" baselines), no treatment documents actually exist in Sanity yet — the page-content resolver code is wired and proven safe, but the collection itself is still empty. **The bug was confirmed DORMANT, not actively dropping anything, at the time of this fix.** It remained a live landmine: the instant an admin created even one treatment doc via Studio (no admin-panel form exists for this type yet) with `navCategory` set, every other treatment without that field populated would have silently vanished from nav. **FIXED** — see "Phase 3 — implemented" below.
- **Blast radius (pre-fix):** any treatment/maternity-service whose Sanity doc lacks `navCategory` (or doesn't exist in Sanity yet) vanishes from the header mega-menu and footer group, even though its page renders fine and is reachable by direct link/search.

### 4. Maternity / Women's Services — page content ✅ SAFE (best pattern) / nav ⚠️ shares bug #3
- **Pattern:** (b) per-section merge in `resolveService()` (`services.ts:176-320`), same convention as Treatments.
- **List assembly:** `builtServiceParams() ∪ getPublishedServiceSlugs()` (`src/app/(frontend)/services/[slug]/page.tsx:13-23`) — this is the **best-implemented** version of the union pattern in the codebase: code params first, then Sanity-only extras appended, deduped by slug. No gap at all here.
- **Nav:** shares the exact same bug as #3 above (`buildMaternityMega` sources from the same unprotected `getNavTreatments()`/`navCategory: "maternity-services"`).
- **Matching key:** `slug` / `key`.
- **Current live risk:** page content — none. Nav — same as #3.
- **Blast radius:** page content — none. Nav — same as #3.
- **Known separate gap (not this bug):** the service *card registry* (icon/name/which services show as cards on `/services` index and location pages) is 100% hardcoded in `womens-health.ts` — a Sanity-only new service gets a working detail page but no card anywhere pointing to it. Documented already in the prior audit; out of scope for the fallback-merge fix (it's a "no admin UI for the registry" gap, not a disappearing-content bug).

### 5. Locations (Cities/Centres) — page content ✅ SAFE / static params ✅ SAFE / nav 🔴 BUG CONFIRMED
- **Pattern:** (b) per-section merge in `resolveCity()`/`resolveCentre()` (`location-content.ts:277-396`).
- **Static params:** `/locations/[city]/page.tsx` and `/locations/[city]/[center]/page.tsx` both do `builtCityParams()/builtCentreParams() ∪ getPublishedCitySlugs()/getPublishedCentreParams()` — same safe union pattern as Services. No gap.
- **Nav:** `getNavLocations()` (`payload.ts:587-597`) sources **only** from `getSanityCities()`/`getSanityCentres()` — no code fallback. `buildLocationsMega()` (`header.ts:384-404`) and `buildLocationsFooterGroup()` (`footer.ts:66-76`) then **wholesale replace** the entire hardcoded "Locations" header column set / footer group the instant any one published city exists in Sanity. A city that's in code (`locations.ts` `CITIES`) but not yet published in Sanity (or has `built: false`) disappears from both nav menus entirely, even though its page still statically renders via the safe union above.
- **Matching key:** `slug` (city), `(citySlug, slug)` (centre).
- **Current live risk — VERIFIED:** `count(*[_type=="city"])` = **0**, `count(*[_type=="centre"])` = **0**. Same situation as Treatments — despite Wave 4.5 notes implying migration, zero city/centre documents exist in production Sanity today. **Confirmed DORMANT at the time of this fix. FIXED** — see below.
- **Blast radius (pre-fix):** any city/centre not published (or not yet created) in Sanity drops out of the header/footer Locations menus while its page keeps working via direct link.

### 6. About page — ✅ SAFE
- **Pattern:** (b) per-section merge, singleton document (`resolveAbout()`, `about.ts:263-341`). Same convention throughout (hero, story, atAGlance, milestones, trust, patientFirst, network, finalCta each fall back independently).
- **Matching key:** n/a (singleton).
- **Current live risk / blast radius:** none.
- Unrelated, already-known content gap (not this bug): the live About page is still missing several sections the old site had (Mission/Vision/Values, Infrastructure, Technology, Achievements, Social Activities, Training, News) — a content-completeness issue, not a fallback bug. See `[[feedback-content-verification]]`.

### 7. Testimonials (text), Video Testimonials, Education Videos, Blogs+CME — ✅ N/A (no fallback in use)
All four are **100% Sanity-native** with no competing hardcoded dataset:
- Testimonials (`testimonials.ts`): staff-curated entries, explicitly "supplement the live Google reviews," never had a code list.
- Video Testimonials / Education Videos (`payload.ts:231-254`): straight map over `getSanityTestimonials()`/`getSanityEducationVideos()`, no code array.
- Blogs (`payload.ts:171-227`): 100% Sanity (279 posts per prior migration work), no code fallback file exists.
- **Verdict:** the all-or-nothing bug is structurally impossible here — there's nothing hardcoded to lose. Safe to leave alone.

### 8. Homepage (singleton) — ✅ SAFE (already fixed)
- **Pattern:** (b) per-section + **index-based per-row merge** via the `mergeList()` helper (`homepage.ts:673-687`), added specifically to fix the earlier "editor content vanishes" bug (see `[[editor-vanish-and-link-bugs]]`). Each row (stat, accolade, award, event poster, FAQ, etc.) resolves from the CMS override when present, else the default at that index — editing one row can't blank out its siblings.
- **Current live risk / blast radius:** none.

### 9. Site Settings / SEO identity — ✅ SAFE
- **Pattern:** per-field merge onto the `SITE` code constant (`payload.ts:510-526`, `seo.ts:131-133`) — `identity?.awards?.length ? identity.awards : SITE.awards`, etc.
- **Current live risk / blast radius:** none.

### 10. Scripts config / Redirects / Sitemap overrides / Robots.txt / Schema.org custom schemas — ✅ N/A (admin-owned config, not fallback content)
These are all singleton admin-config values (raw text, rule lists, override lists) where Sanity is the sole intended source once configured — there is no separate hardcoded dataset for them to silently override. `robots.txt` route falls back to `DEFAULT_ROBOTS_TXT` only when the Sanity field is empty (`src/app/robots.txt/route.ts:6`), which is correct singleton behavior, not the collection bug. Not applicable to this task.

### 11. Sitemap generation (`sitemap-data.ts`) — ✅ SAFE (additive union, not a disappearing-content bug)
Builds the path set by adding every hardcoded registry entry (`TREATMENTS_REGISTRY`, `SERVICE_CONTENT`, `DOCTORS`, `CITIES`, `CENTRES`) into a `Set`, then adds Sanity `additionalUrls` and subtracts `excludePaths` (`sitemap-data.ts:9-34`). Nothing hardcoded can ever be silently dropped by this logic. Known pre-existing gap (documented in prior audit): a genuinely Sanity-only new entity (no code counterpart) won't appear unless separately added via `additionalUrls`. Not the bug in scope here.

### 12. Camps page — ✅ N/A (unrelated pre-existing bug, not the fallback pattern)
`homepage.ts`'s `events` section already merges safely via `mergeList()`. The actual defect (confirmed still present — the `homepage` Sanity schema has no `events`/`posters` field at all) means Sanity can *never* supply this data, so it always renders the hardcoded default poster set. This is a missing-admin-UI bug, not an all-or-nothing fallback bug, and carries zero risk of losing hardcoded content. Out of scope for this task per the prior audit.

### 13. Generic Pages (`[slug]` route) / Google Reviews — ✅ N/A (out of scope)
- Generic Pages: `getPageBySlug`/`getPublishedPageSlugs` always return `null`/`[]` (`payload.ts:79-81`) — this is a dropped feature (every such page currently 404s), not a fallback-merge bug; there's no hardcoded content being hidden.
- Google Reviews: lives entirely outside the Sanity resolver architecture (`reviews-cache.json` + `sync-reviews.mjs`, and a separate hand-transcribed `doctor-reviews.ts`). Not part of this task.

---

## Summary table

| Area | Page-content pattern | List/nav pattern | Bug present? |
|---|---|---|---|
| Doctors | (b) per-field | (b) code∪Sanity merge | No |
| Treatments | (b) per-section | code-only list (minor SSG gap, not loss) | No (content); minor gap only |
| **Header/Footer: IVF Treatments & Maternity Services nav** | — | **(a) per-category all-or-nothing** | **YES** |
| Maternity Services | (b) per-section | (b) code∪Sanity union (best pattern) | No |
| Locations (cities/centres) content + static params | (b) per-section | (b) code∪Sanity union | No |
| **Header/Footer: Locations nav** | — | **(a) all-or-nothing** | **YES** |
| About | (b) per-section | n/a (singleton) | No |
| Testimonials / Video Testimonials / Education Videos / Blogs | n/a — no code fallback exists | n/a | No (not applicable) |
| Homepage | (b) per-section + index-merge | n/a (singleton) | No |
| Site Settings / SEO / Scripts / Redirects / Sitemap config / Robots | per-field / admin-owned | n/a | No |
| Sitemap generation | additive union | n/a | No |
| Camps / Generic Pages / Google Reviews | separate pre-existing bugs, not fallback pattern | — | Out of scope |

**Only one real content area needs Phase 2–3 work: the Header/Footer navigation menus for Treatments, Maternity Services, and Locations.** Everything else is either already safe or has no fallback in play.

---

## Phase 3 — implemented (branch `fix/nav-fallback-all-or-nothing`, `main` untouched)

**Verification query (read-only, run first per your instruction):** `scripts/check-nav-fallback-risk.mts` queries the production Sanity dataset read-only — confirmed 0 treatment/city/centre docs exist today, so the bug was dormant, not actively dropping anything, at the time of this fix.

**Design decision — where the fix lives:** Rather than rewriting `getNavTreatments()`/`getNavLocations()` in `payload.ts` (which would require inventing a new code-level `navCategory` default per treatment, and risked the header/footer hardcoded defaults silently drifting apart, since footer's defaults carry two items — PGT-A/PGT-M, Surrogacy — that header's never did), the fix was scoped **entirely to the four builder functions that actually did the wholesale replacement**, each merging against **its own file's own hardcoded defaults**:

- `src/lib/header.ts` — `buildTreatmentMega()` and `buildLocationsMega()` rewritten to overlay Sanity items onto `HEADER_DEFAULTS` (matched by `href` for treatments, city slug for locations) instead of replacing the whole column set. Both now always return the full column set (never `undefined`).
- `src/lib/footer.ts` — `buildTreatmentGroups()` and `buildLocationsFooterGroup()` rewritten the same way, merging onto **`FOOTER_DEFAULTS`** (footer's own baseline, not header's — the two hardcoded lists aren't identical, so each file merges against itself to stay byte-identical when Sanity is empty).
- `buildMaternityMega()` (header.ts) was **intentionally left untouched**: it can only ever be populated by a `treatment`-typed Sanity doc tagged `navCategory: "maternity-services"`, but the 6 real maternity services live in the separate `service` collection (no `navCategory` field exists on that schema) — this path has no reachable hardcoded data to lose either way, pre-existing and out of scope.
- `getNavTreatments()`/`getNavLocations()` in `payload.ts` were **not changed** — they still return exactly what Sanity has, which is what the new merge functions need as their overlay input.

**Merge semantics (per function):** default item present, no Sanity match → kept verbatim. Sanity item matches a default item's href/slug → overrides label/category/order. Sanity item has no default match (new navCategory/city with no code counterpart) → appended. An invalid/unrecognised `navCategory` value from Sanity falls back to the item's default category rather than causing it to vanish into an unrendered bucket.

**Verification performed (not just typecheck):**
1. `npx tsc --noEmit` — no new type errors introduced by either file.
2. A throwaway script imported `resolveHeader`/`resolveFooter` directly and asserted, deep-equal, against `HEADER_DEFAULTS`/`FOOTER_DEFAULTS`:
   - **Zero Sanity data (today's actual live state):** `header.nav` and `footer.groups` are **byte-identical** to the hardcoded defaults — confirmed via exact JSON deep-equality, not just eyeballing.
   - **One partial Sanity treatment** (`ivf`, `navCategory: "advanced-ivf"`, no other treatments in Sanity): the "Advanced IVF Treatment" column still has all 10 items (IVF's label reflects the Sanity edit; the other 9, including untouched sibling "IVF Failure," are still present); the footer's "IVF Treatments" group still has all 11 items including the footer-only "PGT-A/PGT-M" default.
   - **One partial Sanity city** (`ahmedabad`, 2 of its 3 real centres): the header "Locations" menu still has all 8 city columns; Ahmedabad's column reflects the 2 live centres; the untouched sibling "Mumbai" column is still present with its full defaults; footer's "Locations" group (6 items) is unaffected.
   - **A brand-new Sanity-only treatment/city** (no code counterpart at all) is correctly appended rather than replacing anything.
3. Manual review of every merge function against the exact bug mechanism described in Phase 1 — confirmed none of the four still contain a "replace whole set once any item exists" branch.

**Not done (deliberately, per your "no migration needed" scoping and rule 3):** no Sanity documents were created or modified; no other resolver/rendering logic was touched; `getNavTreatments()`/`getNavLocations()` signatures and behavior are unchanged.

**Status:** committed to `fix/nav-fallback-all-or-nothing`, pushed for a Vercel preview deploy. **`main` has not been touched.** Awaiting your review of the preview before any merge.
