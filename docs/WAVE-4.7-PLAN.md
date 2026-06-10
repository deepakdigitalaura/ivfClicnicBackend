# Wave 4.7 — Payload Admin UX Audit & Client-Friendly CMS Plan

**Status:** Audit & design only. No code, schema, or data is changed by this document.
**Branch context:** `feat/payload-cms-poc`, after Wave 4.4 (Treatments) + Wave 4.5 (Locations + About-BFI) collections landed.
**Payload version:** `^3.85.0` (`@payloadcms/next`, `db-postgres`, `richtext-lexical`).
**Audience reframing:** the CMS was built developer-first (every field mirrors a code type 1:1). The actual editors are **fertility doctors, clinic managers, marketing staff, and front-desk admins** — none of whom should ever see the words *slug*, *global*, *Class A*, or *schema.org*.

---

## 0. TL;DR

1. **The information architecture leaks the implementation.** The sidebar has **9 groups** with inconsistent logic: `Pages` and `Media` float ungrouped, `Blog` mixes collections *and* a global, and `Homepage`/`About` are one-item groups sitting next to a generic `Globals` bucket. A non-technical editor cannot form a mental model of "where do I edit X."
2. **~40% of editable fields are technical or inert.** Every collection exposes `slug`, `href`, `reviewerSlug`, `lastReviewed`, raw image *path* strings, and (Locations) a whole class of **stored-but-ignored "Class A" fields** (`built`, `isHeadOffice`, `geo`, `opening`, `citySlug`, `doctors[]`/`treatments[]` slug lists). The resolver ignores these at render — an editor can change them and **nothing happens on the site.** That is the single biggest footgun.
3. **Labels are derived from code names, not English.** Payload auto-titles `whoFor` → "Who For", `whyUs` → "Why Us", `h1Em` → "H1 Em", `shortBio` → "Short Bio", `sameAs` → "Same As". Helper text, where present, is written for developers ("registry key", "schema.org medicalSpecialty", "Option A slug-string link").
4. **Roles are too coarse for the real org.** Only `admin` / `editor` exist. The brief asks for clinic-staff vs. marketing vs. website-team separation; that needs a third role *and* field-level `admin.condition`/`access` gates, which the current architecture supports but does not yet use.
5. **No branding.** The panel is stock Payload — stock logo, stock "Payload" title, no welcome dashboard. A doctor logging in sees "Payload CMS", not "Bavishi Website Manager".
6. **Recommended path:** a **3-phase rollout** — *(Quick Wins: labels + descriptions + hide/lock footguns)* → *(IA + Homepage tab redesign + branding)* → *(role tier + guidance system)*. Quick Wins are pure config (no schema/migration, no `seo:diff` risk) and deliver ~70% of the perceived improvement.

---

## 1. Admin Navigation Audit

### 1.1 What exists today (extracted from the actual configs)

| Sidebar group | Items | Source | Problem |
|---|---|---|---|
| *(ungrouped)* | **Pages** | `collections/Pages.ts` (no `admin.group`) | Floats at top; "Pages" = only the Contact page today — misleading |
| *(ungrouped)* | **Media** | `collections/Media.ts` (no group) | Floats; should be a clearly-named "Media Library" |
| **Blog** | Blogs, Authors, Categories (collections) + **Blog Hub** (global) | `Blogs/Authors/Categories.ts`, `globals/BlogHub.ts` | Mixes collections and a page-settings global in one bucket |
| **Content** | Services, Doctors, Treatments | `Services/Doctors/Treatments.ts` | "Content" is a meaningless catch-all; *everything* is content |
| **Locations** | Cities, Centres | `Cities/Centres.ts` | OK name, but "Centres" vs "Cities" hierarchy isn't obvious |
| **Homepage** | Homepage | `globals/Homepage.ts` | One-item group |
| **About** | About | `globals/About.ts` | One-item group; titled "About" not "About BFI" |
| **Globals** | Site Settings, Contact Info, Footer, Header | `globals/SiteSettings/ContactInfo/Footer/Header.ts` | "Globals" is a Payload-internal term, not a concept editors have |
| **Admin** | Users | `collections/Users.ts` | Fine, but should read "User Management" |

**Diagnosis:** the grouping follows Payload's collection-vs-global distinction and the order the waves shipped — not the way a clinic thinks about its website. There is no top-level separation between "pages visitors read" and "site-wide settings."

### 1.2 Recommended sidebar (information architecture)

Payload sidebar groups are just the `admin.group` string on each collection/global, rendered alphabetically by group then by item. To force a deliberate order, prefix group labels with an invisible ordering scheme (Payload renders the string verbatim; a leading numeral or non-breaking space controls order). Proposed grouping:

```
📄 Website Pages
   ├── Homepage                (global  → homepage)
   ├── About BFI               (global  → about-page)
   ├── Contact Page            (collection → pages, useAsTitle hides the multiplicity)
   └── Blog Landing Page       (global  → blog-hub)

🩺 Treatments & Services
   ├── Treatments              (collection → treatments)
   └── Services                (collection → services)

👨‍⚕️ Doctors
   └── Doctors                 (collection → doctors)

📍 Locations
   ├── Cities                  (collection → cities)
   └── Centres                 (collection → centres)

✍️ Blog
   ├── Articles                (collection → blogs)
   ├── Categories              (collection → categories)
   └── Authors & Reviewers     (collection → authors)

⚙️ Website Settings
   ├── Header & Navigation     (global  → header)
   ├── Footer                  (global  → footer)
   ├── Contact Details         (global  → contact-info)
   └── Brand & Identity        (global  → site-settings)

🖼️ Media Library
   └── Media                   (collection → media)

🔐 User Management            (admin-only — hidden from editors)
   └── Users
```

**Key moves:**
- "Globals" / "Content" / ungrouped → **plain-English destination groups**.
- Homepage, About, Blog Hub (all page-settings globals) join the **pages** they configure, not a technical bucket.
- "Blog Hub" → "Blog Landing Page"; "About" → "About BFI"; "Site Settings" → "Brand & Identity".
- The grouping is consistent: **a group is "a thing on the website," never "a Payload type."**
- Emoji/icon prefixes are optional but cheap and dramatically improve scannability for non-technical users (Payload renders them in the nav label).

> Implementation note: this is **pure config** — change `admin.group` strings + add ordering prefixes. No schema, no migration, no `seo:diff` impact.

---

## 2. Field-Level UX Audit

For every collection/global below: **current auto-label** → **proposed label**, plus action (rename / describe / hide / read-only / admin-only). Only fields needing change are listed; unlisted fields are already clear.

### 2.1 Homepage (`globals/Homepage.ts`)
The best-documented surface already — most fields have good descriptions. Remaining gaps:

| Field | Auto-label | Proposed label | Action |
|---|---|---|---|
| `hero.headlineItalic` | "Headline Italic" | "Highlighted word in headline" | rename + describe: *"The one word in the headline shown in the cursive accent style."* |
| `whyChoose.blocks[].icon` | "Icon" | "Pillar icon image" | describe: *"Paste the icon image path, e.g. /assets/Simple-1.png. Ask the website team if unsure."* |
| `videos.*[].id` | "Id" | "YouTube video ID" | already described; rename label |
| `*.heading.em` / `*.lead` | "Em" / "Lead" | "Highlighted word(s)" / "Heading text" | rename — "Em"/"Lead" are HTML/jargon |
| `finalCta.stats[].v/s/l` | "V"/"S"/"L" | "Number"/"Suffix (e.g. +)"/"Label" | rename — single-letter field names are unreadable |
| `videos.stories[].n/q/r` | "N"/"Q"/"R" | "Patient name"/"Quote"/"Star rating" | rename |

### 2.2 About BFI (`globals/About.ts`)
| Field | Auto-label | Proposed label | Action |
|---|---|---|---|
| `milestones[].y/t/d` | "Y"/"T"/"D" | "Year"/"Title"/"Description" | rename |
| `network.cities[].c/n` | "C"/"N" | "City name"/"Count label (e.g. '3 centres')" | rename; description already notes these are *curated marketing counts*, keep that |
| `trustPillars[].icon` | "Icon" | "Card icon" | convert to friendly `select` with human labels (see §6) |

### 2.3 Treatments (`collections/Treatments.ts`) — the heaviest collection
| Field | Auto-label | Proposed label | Action |
|---|---|---|---|
| `slug` | "Slug" | "Page ID (do not change)" | **read-only after create** + describe |
| `href` | "Href" | "Page URL" | **read-only** — "Managed by the website team" |
| `reviewerSlug` | "Reviewer Slug" | "Medical reviewer" | describe in plain English; mark website-team-managed |
| `lastReviewed` | "Last Reviewed" | "Last medically reviewed (date)" | describe: *"Date this page was last checked by a doctor, e.g. 2026-06-01."* |
| `meta.*` | "Meta" group | "Search engine & social preview" | rename group + describe |
| `procedure.*` | "Procedure" group | hide from editors | **admin/website-team only** — pure schema.org plumbing (`procedureType`, `bodyLocation`) no editor understands |
| `hero.h1`/`h1Em` | "H1"/"H1 Em" | "Page heading"/"Highlighted word in heading" | rename |
| `whoNeedsIt`/`whatIs`/`whyUs` | "Who Needs It"/"What Is"/"Why Us" | "Who needs this treatment"/"What is this treatment"/"Why choose us" | rename (Payload title-cases but keeps the cramped phrasing) |
| `*.items[].t/d` | "T"/"D" | "Title"/"Description" | rename globally |
| `related[].slug` | "Slug" | "Related treatment ID" | describe; ideally upgrade to a picker (deferred — see §8) |

### 2.4 Services (`collections/Services.ts`)
Mostly mirrors Treatments. Additional flags:

| Field | Auto-label | Proposed label | Action |
|---|---|---|---|
| `published` | "Published" | "Show this service's link on location pages" | describe — distinct from the draft/publish `_status`; the dual concept is confusing |
| `fallback` | "Fallback" | "Temporary link until published" | **website-team only** |
| `schemaType` | "Schema Type" | hide | **admin-only** — `MedicalProcedure`/`MedicalTest`/`MedicalTherapy` is SEO plumbing |
| `breadcrumbName` | "Breadcrumb Name" | "Short name for breadcrumb trail" | describe |
| `desc` | "Desc" | "One-line card description" | rename |
| `reviewerSlug`/`lastReviewed` | — | as Treatments | website-team / describe |

### 2.5 Doctors (`collections/Doctors.ts`)
| Field | Auto-label | Proposed label | Action |
|---|---|---|---|
| `slug` | "Slug" | "Profile URL ID (do not change)" | **read-only after create** |
| `image` | "Image" | "Portrait photo path" | describe: *"Path to the doctor's photo. Ask the website team to upload new photos."* (upload relation deferred) |
| `verified` | "Verified" | "Verified credentials (admin only)" | **already admin-only** ✅ — keep, but soften wording for the admin who sees it |
| `medicalSpecialty[]` | "Specialty" (array of `value`) | "Specialty (search-engine tags)" | **website-team only** — schema.org enum values, not prose |
| `knowsAbout[]`/`memberOf[]`/`sameAs[]` | "Topic"/"Membership"/"Profile URL" | keep labels, add plain descriptions | describe — these are good E-E-A-T but jargon-named |
| `cities[]`/`locations[]`/`treatments[]` | "City"/"Location"/"Treatment" | "Cities (display)"/"Linked location IDs"/"Linked treatment IDs" | `locations`/`treatments` are slug lists → **website-team only or read-only** (resolver-fed, footgun) |
| `experienceLabel`/`experienceYears` | — | "Experience (shown on site)"/"Years of experience (number)" | describe the split |
| `visitsAllCentres` | "Visits All Centres" | "Visiting specialist (rotates across all centres)" | already described ✅ |

### 2.6 Cities & Centres (`collections/Cities.ts`, `Centres.ts`) — **highest footgun density**
These collections **store** a large set of fields that `resolveCity()`/`resolveCentre()` deliberately **ignore at render** (the "Class A" set per WAVE-4.5-PLAN §1.2). An editor changing them sees no site change — pure confusion.

| Field | Class | Action |
|---|---|---|
| `slug`, `citySlug` | A (structural) | **read-only** + "Managed by website team" |
| `built` | A (route gating, ignored by resolver) | **hide from editors** (admin-only, with a warning that route gating is code-owned) |
| `isHeadOffice` | A (ignored) | **hide / admin-only** |
| `geo` (lat/lng) | A (ignored) | **hide / website-team only** |
| `opening` (machine hours) | A (ignored) | **hide / website-team only** — the human-readable `hours` text field stays editable |
| `doctors[]`, `treatments[]`, `womensHealth[]` (slug lists) | A (ignored) | **read-only** + "Linked from code; ask website team to change" |
| `reviewsKey` | A (ignored) | **hide / admin-only** |
| `nearby[]`, `landmarks[]`, `howToReach[]`, `facilities[]`, `intro`, `faqs[]`, `gallery[]` | B (editorial) | **keep editable** — rename "Direction"/"Area"/"Landmark" labels, add descriptions |
| `helpline`/`helplineLabel`/`whatsapp` (city), `phone`/`phoneLabel`/`hours` (centre) | B | keep; describe the digits-vs-display split |
| `heroImage`/`image`/`hero360Url` | B but raw paths | describe; flag as website-team-assisted until upload relations land |

> **Critical UX rule (the brief's stated goal):** *"Editors should never be able to edit something that does not affect the website."* The entire Class-A set violates this today. §3 makes it actionable.

### 2.7 Globals: Header, Footer, ContactInfo, SiteSettings
- **Header** (`globals/Header.ts`): the `navItems` → `columns` → `items` → `children` 4-level nesting is **the most intimidating editing surface in the panel.** Descriptions exist but assume the editor understands "mega columns" and "Doctors panel". Recommend: collapse depth visually + a top-of-field help block (§4/§6). `megaCols` ("force grid to N columns") → website-team only. `styleVariant` (single option "Primary") → **hide** (it's inert today).
- **Footer** (`globals/Footer.ts`): the `channel` select (None/Phone/Email/WhatsApp "from Site Settings") is a genuinely clever single-source pattern but needs a plainer description: *"Pick a contact type to auto-fill the link from Brand & Identity, or choose 'Custom URL' and type your own."* Rename option "None — use the URL below" → "Custom URL".
- **ContactInfo** (`globals/ContactInfo.ts`): same `channel` pattern — already well-described. Icon select already uses friendly labels ("WhatsApp / Chat") ✅ — **this is the model the other icon fields should copy.**
- **SiteSettings** (`globals/SiteSettings.ts`): rename group "Brand & Identity"; `logoUrl`, `foundingDate` describe fine. `knowsAbout[]`/`socialLinks[]` are `sameAs`/schema → keep but label "Official profile links (Facebook, Instagram, …)". This global is **already admin-only** (`update: isAdmin`) ✅, which is correct — it drives Organization JSON-LD.

### 2.8 Blog cluster (Blogs, Authors, Categories, BlogHub)
- `slug` everywhere → "Page URL ID", read-only after create.
- `treatmentSlugs[]` (Blogs) → "Related treatment IDs" + describe; website-team-assisted (it's a slug-matching contract until Phase 5).
- `reviewedBy` vs `author` → already well-described; rename collection "Authors" → "Authors & Reviewers".
- `readMins` → "Estimated read time (minutes)".
- `publishedAt` description mentions "schema datePublished" → reword for editors: *"The date shown on the article. Leave blank to use today."*

---

## 3. Footgun-Removal Plan

Concrete mechanism per footgun. Payload primitives used: `admin.readOnly`, `admin.hidden`, field-level `access: { update }`, `admin.condition`, and `admin.description` warnings.

| Footgun | Where | Recommended treatment | Mechanism |
|---|---|---|---|
| **Class-A inert fields** (`built`, `isHeadOffice`, `geo`, `opening`, `reviewsKey`, slug-lists) | Cities, Centres | **Hide from editors; admin-only & read-only with a "code-owned" note** | `access.update: isAdminField` + `admin.readOnly: true` + warning description |
| **`slug` / `citySlug` / `href`** | all collections | **Read-only after first save** (editing a slug silently breaks the route/registry contract) | `admin.readOnly` via a custom condition, or lock post-create |
| **`schemaType`, `procedure.*`, `medicalSpecialty[]`, `procedureType`** | Services, Treatments, Doctors | **Hide from editors** (schema.org plumbing) | `admin.condition: () => isWebsiteTeam` or `access.update: isAdminField` |
| **`reviewerSlug` text** | Services, Treatments | Read-only or website-team only until it becomes a real relationship | `access.update: isAdminField` |
| **`verified`** | Doctors | **Already admin-only + validated** ✅ | keep |
| **`fallback`, `megaCols`, `styleVariant`** | Services, Header | Hide (inert/advanced) | `admin.hidden` or admin-only |
| **Raw image *path* strings** (`image`, `heroImage`, `ogImage` text variants) | Treatments, Services, Cities, Centres, Homepage | Add a warning description until upload relations land; do not let editors type arbitrary paths unguided | `admin.description` + (later) migrate to `upload` relation |

**Principle:** prefer **hide** for truly inert/technical fields (less clutter), **read-only** for fields editors should *see for context* but not change (slugs, linked IDs), and **admin-only** for anything that affects schema/routing/trust.

> All of the above are **config-only** changes — no DB migration, no `payload-types` diff beyond access metadata, and (critically) **zero rendered-output change**, so the `seo:diff` baseline stays green.

---

## 4. Homepage Editing Experience

**Today:** the Homepage global is one long scroll of 11 top-level groups in roughly visitor order (`hero`, `stats`, `whyBavishi`, `whyChoose`, `suraksha`, `awards`, `events`, `videos`, `faq`, `finalCta`, `seo`). It already mirrors the page order ✅ — the problem is it's a **flat, undifferentiated wall** with no visual chunking and no preview.

**Recommended experience** — wrap the groups in a Payload **Tabs** field (`type: "tabs"`), one tab per visitor-facing section, in scroll order:

```
Homepage
 ┌────────────────────────────────────────────────────────────┐
 │ [Hero] [Stats] [Why Bavishi] [Why Choose] [Suraksha]        │
 │ [Awards] [Events] [Videos] [FAQs] [Final CTA] [SEO]         │
 └────────────────────────────────────────────────────────────┘
```

Enhancements:
- **Tab labels in visitor language:** "Top Banner", "Stats Strip", "Why Bavishi cards", "Awards", "Upcoming Events", "Patient Stories & Videos", "FAQs", "Closing Call-to-Action", "Search Engine Settings".
- **Section description blocks** (`ui` field or group description) at the top of each tab: *"This is the first thing visitors see at the top of the homepage."*
- **Collapsible sub-groups** within busy tabs (Videos has 3 arrays) so the editor isn't overwhelmed.
- **Preview link:** Payload `admin.preview` (the Pages collection already wires this to a secret-guarded `/preview` endpoint) — extend to the Homepage global so an editor gets a "View homepage" button. The infra exists; the homepage route needs to opt into `draftMode()` (currently SSG).
- Move `seo` into a clearly-labelled final "Search Engine Settings" tab so it's present but visually de-prioritised.

> Tabs is a presentational wrapper — **field names/data shape are unchanged**, so no migration and no `seo:diff` impact. Apply the same Tabs treatment to **About BFI**, **Treatments**, and **Services** (their long group lists have the same wall-of-fields problem).

---

## 5. Visual Branding Audit

The panel is **stock Payload** today (verified: `src/app/(payload)/` is the unmodified scaffold; no `admin.components`, `admin.meta`, or custom CSS in `payload.config.ts`). Payload 3.x supports full white-labelling via `admin.components` + `admin.meta` + a CSS override file. Proposed "Bavishi Website Manager" identity:

| Surface | Payload hook | Recommendation |
|---|---|---|
| Browser title / favicon | `admin.meta.titleSuffix`, `admin.meta.icons` | "— Bavishi Website Manager"; clinic favicon |
| Login & nav logo | `admin.components.graphics.Logo` / `.Icon` | Bavishi logo (reuse `/assets/logo.png`) |
| Colour & typography | custom CSS file via `admin.css` | Map Payload's CSS variables to the site's brand palette + font; warm/medical tone, not default Payload blue |
| Welcome dashboard | `admin.components.beforeDashboard` | A custom panel: "Welcome to the Bavishi Website Manager" + quick links (Edit Homepage, Add Blog Article, Update a Doctor) + a one-line "Need help? Contact the website team" |
| Login screen | `admin.components.beforeLogin` / `afterLogin` | Short reassuring copy + brand imagery |
| Empty states | per-collection `admin.description` | Friendly "No articles yet — click *Create New* to write your first post." |
| Custom field/nav icons | nav label emoji (§1.2) or component icons | Section emojis as a zero-cost first step |

**Goal achieved when:** login → branded screen → "Welcome to the Bavishi Website Manager" dashboard → branded nav. A doctor never sees the word "Payload."

> Branding is additive config + a few small React components. No data/schema impact. Medium effort (the dashboard + CSS theming is the bulk).

---

## 6. Editorial Guidance System

A layered guidance strategy so a doctor can edit without training:

1. **Plain-English field descriptions everywhere** (§2). Rule: every editable field answers *"what is this and where does it show?"* in one sentence, no jargon. This is the highest-leverage single change.
2. **Friendly `select` options instead of raw enums.** Pattern already proven in `ContactInfo` (`{ label: "WhatsApp / Chat", value: "MessageCircle" }`). Apply to **every icon field** (`ICON_NAMES` selects in Homepage/About/Services/Treatments currently show raw Lucide names like `ShieldCheck` — wrap them with human labels).
3. **Section help blocks** via `ui` fields / `admin.description` on groups — short orienting text at the top of each section/tab (§4).
4. **Inline examples in descriptions** — already done well in places ("e.g. '30,000+'"); standardise everywhere.
5. **Character/length guidance** for SEO + headline fields: *"Aim for 50–60 characters so it isn't cut off in Google."* (description text; optional `maxLength` for hard limits).
6. **Image guidance:** until uploads land, descriptions should state expected dimensions/format (*"Landscape image, ~1200×630px, JPG or WebP"*) and direct editors to the website team.
7. **Validation messages in plain English.** The `validateVerified` rule on Doctors already returns a human sentence ✅ — use that as the template for any new validation.
8. **Preview links** (§4) so editors verify visually before publishing.

Deliverable artifact: a short **"CMS Field Glossary"** doc + a one-page **"How to edit the website" guide** for clinic staff (out of repo scope, but the descriptions written in §2 are its raw material).

---

## 7. Content Ownership Audit & Role Recommendations

### 7.1 Current state
Only two roles exist (`src/access/roles.ts`): `admin` (full) and `editor` (all content + most globals). `Users` and `SiteSettings`/`ContactInfo`/`Footer`/`Header` writes vary (some `isAdmin`, some `isEditor`); the trust-bearing `Doctors.verified` field is correctly `isAdminField`.

### 7.2 Proposed three-tier model
| Tier | Who | Can edit |
|---|---|---|
| **Clinic Staff** (new) | Doctors, clinic managers, front-desk | Blog articles, doctor *bio/profile* copy, FAQs, centre editorial body (intro/landmarks/facilities/hours-text), contact display values |
| **Marketing Team** (≈ today's `editor`) | Marketing | Everything Clinic Staff can, plus Homepage/About/Treatments/Services editorial, SEO fields, Header/Footer nav, Media |
| **Website Team / Admin** (today's `admin`) | Developers | Everything, plus all Class-A/schema/structural fields, slugs, `verified`, Users, Brand & Identity |

### 7.3 Field-classification summary (what each tier may touch)
- **Clinic-staff-safe:** prose, FAQ Q/A, bios, hours text, contact values, blog body.
- **Marketing:** all of the above + page hero copy, headings, CTAs, awards/events/videos, SEO meta, nav structure.
- **Website-team only:** every field flagged "hide/read-only/admin-only" in §2–§3 — slugs, hrefs, `schemaType`, `procedure.*`, `medicalSpecialty`, `geo`, `opening`, `built`, `isHeadOffice`, slug-list relationships, `reviewerSlug`, `verified`, `reviewsKey`, Brand & Identity, Users.

### 7.4 Feasibility
The current architecture **fully supports this** — `roles.ts` is a pure helper module already wired into every collection's `access`. Adding a `clinic` role = (a) add it to the `Users.roles` select, (b) add an `isClinicStaff`/`isMarketing` helper, (c) apply field-level `access`/`admin.condition` per §7.3. No schema migration beyond the new enum value. **Recommend doing this in Phase 3** (after labels/footguns land), since it's the highest-effort, lowest-immediate-visibility change.

---

## 8. Roadmap

### Phase 1 — Quick Wins (1–2 days, pure config, zero render/`seo:diff` risk)
1. Rewrite all `admin.group` strings → the §1.2 IA; add ordering + emoji prefixes.
2. Rename every jargon/single-letter field label (§2) via `label`.
3. Add plain-English `admin.description` to every editable field that lacks one (§2, §6).
4. Hide or lock the inert Class-A + schema fields (§3) via `admin.hidden` / `admin.readOnly` / `access`.
5. Wrap raw icon `select`s in friendly `{label,value}` options (§6.2).

> Acceptance: panel reads in English, no footgun is editable by an editor, `seo:diff` baseline unchanged, no migration.

### Phase 2 — Structure & Branding (3–5 days)
6. Tab-ify Homepage, About, Treatments, Services (§4).
7. Wire `admin.preview` for Homepage/About/Treatments/Services (needs `draftMode()` opt-in on those routes).
8. Brand the panel: logo, title suffix, favicon, CSS theme, login screen (§5).
9. Build the welcome dashboard (`beforeDashboard`) with quick-action links (§5).

### Phase 3 — Roles & Guidance System (3–5 days)
10. Add the `clinic` role + `isClinicStaff`/`isMarketing` helpers; apply field-level gates per §7.
11. Section help blocks + character/length guidance (§6).
12. Author the "How to edit the website" staff guide + field glossary from the §2 descriptions.

### Deferred / not in 4.7 (tracked, out of scope)
- Replacing raw image *path* strings with real `upload` relations to Media (touches resolvers + parity — its own wave).
- Converting slug-string relationships (`related[]`, `treatmentSlugs[]`, doctor↔location↔treatment lists) to Payload `relationship` pickers — **blocked by ADR-0001 (Option A)** until the entity graph migrates.
- Lexical RichText migration for bios/prose arrays.

---

## 9. Risk & Guarantees

- **Phase 1 is byte-safe.** Labels, descriptions, groups, and `admin.*` visibility flags do **not** alter stored data or rendered output. The 47-route `seo:diff` baseline is the control and must stay green across the phase.
- **`admin.readOnly`/`hidden` are UI-only** — they do not enforce security. Anything that must be *prevented* (not just hidden) needs field-level `access` (server-enforced), which §3/§7 specify for the sensitive fields.
- **Slug locking** must be "read-only *after* create" (not always-read-only) or editors can't create new docs — implement via a condition on `id`/operation, not a blanket flag.
- **Preview links** require the target routes to honour `draftMode()`; today only the Pages infra is wired. Until then, editors preview via Payload's version view (as Blogs already does).

---

*Prepared as the Wave 4.7 audit deliverable. Implementation is gated on approval of the §8 roadmap and the §1.2 / §7.2 naming choices.*
