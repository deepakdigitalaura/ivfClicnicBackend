# BFI Admin Panel Forms — Phase 1 Pattern Audit

Read in full: the Doctors admin panel (`(app)/doctors/page.tsx` + `manager.tsx`), the write layer (`src/sanity/lib/admin.ts`), the server actions (`(app)/actions.ts`), the shared components (`save-kit.tsx`, `image-upload.tsx`, `sidebar.tsx`), the auth layer (`src/lib/admin-auth.ts`), plus the Homepage live-preview editor and Site Settings form for singleton comparison. **No code changed.**

---

## 1. Route structure

**One route per section, no separate `/edit/[slug]` page.** Everything — list view and edit view — lives in a single client component that toggles local state:

- `page.tsx` (server component): reads the Sanity admin doc(s) + the code defaults, passes both to the client component. `export const dynamic = "force-dynamic"` so the admin panel never serves stale cached data.
- `manager.tsx` / `editor.tsx` / `form.tsx` (client component, `"use client"`): holds `docs`/`doc` in local state; for collections, an `editing` state that's either `null` (→ render the list) or an object (→ render the edit form in place of the list, same page).

Three flavors exist depending on content shape, and I'd match each of the four new sections to the closest one rather than inventing a fourth:

| Shape | Example | Pattern |
|---|---|---|
| Singleton, simple fields | Site Settings (`site-settings/form.tsx`, 117 lines) | Plain tabbed form, no preview |
| Singleton, section-heavy | Homepage (`homepage/editor.tsx`, 306 lines) | Full-screen split view: form panels left, **live iframe preview** right (`/live-preview/homepage`), click-to-select from the preview jumps to its field |
| Collection | Doctors, Testimonials, Education Videos | List (+ built-in/override list for Doctors specifically) ⇄ single edit form, toggled in place |

## 2. Save/publish behavior

**Direct write, immediately live. There is no draft-then-approve workflow anywhere in the current 13 sections** — this contradicts the prompt's assumption that one exists; flagging this explicitly rather than silently building around a wrong premise.

- Every `save*Action` in `actions.ts` is a thin `"use server"` wrapper: call the matching `save*()` in `admin.ts` inside a `try/catch` (`guard()`), then `revalidatePath()`/`revalidateTag()` every public page/tag that renders the data.
- `admin.ts`'s save functions call `writeClient.createOrReplace()` (or `.patch().commit()`) straight against the **published** document — no `drafts.` prefix, no separate publish step.
- The only access control is a single shared email+password → HMAC-signed httpOnly cookie (`src/lib/admin-auth.ts`) gating the whole `(app)` route group in `layout.tsx`. There are no per-user roles, no reviewer/approver distinction, no pending-changes queue. (I checked for this specifically since an earlier project memory referenced an "RBAC" system — if that existed, it's been superseded by this simpler auth since the Payload removal; nothing in the current code implements it.)
- The one thing that resembles a "draft" is Blogs' own `status: "draft" | "published"` field — but that's page-level content status the resolver filters on, not an editorial two-step approval gate.
- User feedback on save: a toast — `"Saved ✓ — live within a minute"` (the wait is just ISR/ ISR-tag propagation, not an approval delay).

**This needs your decision before Phase 2:** build Treatments/Services/Locations/About the same way (save = instantly live, like all 13 existing sections), or is a real draft/approval step something you actually want added here? I won't invent one silently either way.

## 3. Validation

Minimal and client-side only: HTML `required` on a couple of critical inputs (Doctors: `slug`, `name`), plus a JS guard before calling the action (`if (!editing?.slug || !editing?.name) return;`). No schema-level (Zod/etc.) validation layer, no server-side rejection beyond what Sanity's own schema requires (e.g. `slug` has `validation: (R) => R.required()` in the Sanity schema itself, so a genuinely empty slug would fail at the Sanity API level and surface via the `guard()` catch → error toast). I'd replicate this exact minimal-validation posture for the four new sections rather than adding a new validation layer.

## 4. Image / media handling

Doctors' `<ImageUpload>` (`_components/image-upload.tsx`) is fully generic and directly reusable as-is:
- File input → `POST /api/admin/upload-image` (auth-gated, 5MB limit, image-type check) → the route uploads to **Sanity's asset store** (`previewClient.assets.upload`) and returns the resulting CDN URL.
- That URL is stored as a **plain string field** (e.g. `imageUrl`), not as a Sanity image-asset *reference*. This sidesteps `src/fields/image.ts`'s `mediaUrl()`/`UploadValue` machinery — worth knowing that file is leftover from the Payload era (still literally does `import type { Field } from "payload"`) and its doc comments describe Payload's asset-reference model, which is *not* what the admin panel actually uses for uploads. The resolvers still call `mediaUrl()` because it happens to also accept the `{ url }` shape the Sanity GROQ queries pre-shape `heroPhoto.asset->url` into — it works, but the code path is confusing to read cold. Treatments/Services/Locations all have this same `hero.image` (plain string) + `hero.heroPhoto` (Sanity asset upload, Studio-only) duality; the new forms should target `hero.image` via `<ImageUpload>` exactly like Doctors does, and simply leave `heroPhoto` alone (Studio-only, unaffected).

## 5. Doctors-specific things that won't translate directly

1. **About is a singleton, not a collection.** The whole list/edit-toggle pattern doesn't apply — it needs the Site-Settings-style (or Homepage-style) singleton pattern instead. See open question below on which of those two to follow.
2. **Locations is two-level** (City → its Centres) — flagged in the prompt itself as needing an explicit decision; see open question below, per your Rule 6 I'm asking rather than assuming.
3. **Doctors' fields are all flat strings or string-arrays** (`bio`, `cities`, `treatments`, etc.), each edited as a "one per line" `<textarea>`. Treatments/Services/About have many **variable-length arrays of multi-field objects** — `process.steps: {icon, t, d}[]`, `faqs: {q, a}[]`, `risks.items: {t, d, help}[]`, `milestones: {y, t, d}[]`, `trustPillars: {icon, t, d}[]`, etc. **No existing section has a reusable "add/remove row, each row has several fields" component yet** — the closest analogs are Homepage's FAQ items and Stats, but those are *fixed-length* (always exactly as many rows as the code defaults; no add/remove). I'd need to build one small new generic repeater component (row add/remove, using the same `admin-card`/`admin-field`/`admin-btn` visual language everywhere else uses) — this is filling in a missing building block, not inventing a new overall convention, but flagging it since it's genuinely new.
4. **Icon fields.** Treatments/Services icon-card items (`types`, `technology`, `whyUs`, `process.steps`) store an icon **name** (`IconName`, resolved via `src/lib/icon-map.ts`), not free text. Doctors has nothing like this. I'd use a `<select>` of the known icon names (simplest, safest) unless you'd prefer a visual icon picker.
5. **`sectionLabels`/`profileLabels` editorial overrides.** Doctors *has* a `profileLabels` field in its schema/resolver, but the current Doctors admin form **doesn't expose it at all** — an existing, apparently intentional omission (advanced/rarely-touched fields left Studio-only). Treatments/Services/Locations have the equivalent `sectionLabels`. I'd follow the same precedent and leave these out of v1 forms unless you want them included.
6. **Registry size** — Doctors has 15 code entries; Treatments has ~34, Services 6, Locations 8 cities × ~13 centres. The "list + built-in/override list" UI pattern still works at this scale, just longer lists.
7. **Merge granularity is per-*section*, not per-item**, for Treatments/Services/Locations (confirmed in the fallback audit) — e.g. editing `benefits` in the admin only needs to supply the *whole* `benefits` block (heading + all items) for it to override; an empty/untouched section still falls back to the code default as a whole block. This matches Doctors' behavior closely enough (per-*field*) that the same "leave blank = falls back to placeholder default" UX (already used throughout, e.g. `placeholder={defaults.hero.eyebrow}`) carries over directly.

---

## Recommended template mapping (pending your sign-off)

| Section | Shape | Closest existing template |
|---|---|---|
| **About** | Singleton | Site Settings' tabbed plain-form pattern (simpler, matches "simplest, good pattern-check" framing) — *not* Homepage's live-preview iframe, unless you'd prefer that richer version |
| **Treatments** | Collection (~34), per-section merge | Doctors' list + built-in/override pattern, plus the new repeater component for array-of-object sections |
| **Services** | Collection (6), per-section merge | Same as Treatments, smaller scale |
| **Locations** | Collection, two-level (8 cities × ~13 centres) | Doctors' list pattern at the City level; Centres representation is the open question below |

---

## Open questions — need your answer before Phase 2 starts on About

1. **Draft/approval workflow.** Confirmed none exists today (see §2) — proceed with the same instant-live save-and-toast pattern as all 13 existing sections, or do you want a real draft/approval gate added for these four (new work, not just replicating the pattern)?
2. **Locations structure** (per your Rule 6, asking rather than assuming): should Cities and Centres be **two separate admin sections** (a "Locations — Cities" list and a "Locations — Centres" list, centres reference their city by slug), or **one nested UI** (City list → click into a city → see/add/edit its Centres inline, matching how a Sanity Studio reference-array might visually nest them)? This is the last, most complex section (per your build order), so there's no rush to decide now — but flagging it up front.
3. **About's UI weight** — simple tabbed form (Site Settings-style, faster to build, consistent with "simplest, good pattern-check") or full live-preview split-screen (Homepage-style, richer but heavier — About has 12 sections, comparable to Homepage's own complexity)?
4. **Icon field UI** — plain `<select>` of icon names (simplest) or something more visual? Only affects Treatments/Services sections with icon-card items.
5. **sectionLabels/profileLabels** — leave out of v1 (matching Doctors' existing omission), or include?

Per the deliverable instructions, I'm stopping here — no code written. Waiting for your answers, then I'll start Phase 2 on **About** (per your suggested order) once confirmed.
