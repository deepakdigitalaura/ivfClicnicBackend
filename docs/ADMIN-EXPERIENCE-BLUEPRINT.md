# Bavishi Website Manager — Admin Experience Blueprint

**Status:** North-star UX/UI blueprint. Design + implementation plan only; no code in this document.
**Product name (editor-facing):** **Bavishi Website Manager** — the word "Payload" never appears in the UI.
**Primary user:** a busy fertility doctor or clinic manager who spends ~5 minutes inside the panel, has never used a CMS, and must *never feel they are editing a database.*
**Stack reality:** Payload `^3.85.0` (`@payloadcms/next`, `db-postgres`, `richtext-lexical`), Next 15, Tailwind v4. Admin mounts at `/admin`.
**Relationship to existing plans:** this is the *vision*; the existing waves execute toward it. C1–C3 (IA, plain labels, footgun locking) are **done**. This blueprint defines C4–C8 + the 4.7B role tier as one coherent experience.

> **Design north star:** the panel should feel like a calm, premium extension of the public Bavishi website — warm ivory, plum, and rose; serif headlines; generous spacing — not a blue developer console. A doctor should open it, see *"Welcome to the Bavishi Website Manager,"* click *Edit Homepage*, change one line, hit *Save*, and leave — confident nothing broke.

---

## 0. The Honest Capability Matrix (read this first)

Everything below is designed against what Payload 3.x **actually** supports. Each feature is tagged so the roadmap is real, not aspirational.

| Lever | Payload mechanism | Effort |
|---|---|---|
| Sidebar **grouping** (business language) | `admin.group` strings on each collection/global | ⚙️ Config — **done (C1)** |
| Sidebar with a **Dashboard link, icons, custom order, sections** | `admin.components.Nav` — **custom React Nav** (replaces stock nav) | 🧩 Custom component |
| **Custom dashboard** (welcome, quick actions, activity, tips) | `admin.components.views.dashboard.Component` (full replace) or `admin.components.beforeDashboard` (additive panel) | 🧩 Custom component |
| **Logo / icon** on login + nav | `admin.components.graphics.Logo` / `.Icon` | 🧩 Small components |
| **Browser title / favicon** | `admin.meta` (`titleSuffix`, `icons`, `ogImage`) | ⚙️ Config |
| **Brand theme** (color, type, radius, spacing) | `admin.css` → one file overriding Payload CSS variables | 🎨 CSS |
| **Field labels / helper text / examples** | `label`, `admin.description` | ⚙️ Config — **done (C2)** |
| **Section grouping inside an edit screen** (tabs, cards, collapsibles) | unnamed `tabs`, `collapsible`, `row`, `ui` fields | ⚙️ Config — **C4/C5** |
| **"Advanced Settings" hidden from editors** | unnamed tab + `admin.condition: ({ user }) => isAdmin` | ⚙️ Config (needs role helper) |
| **Server-enforced field locks** | field `access.update` (e.g. `isAdminField`) | ⚙️ Config — **done (C3)** |
| **Role separation** (clinic vs marketing vs website-team) | new `clinic` role on `users.roles` + `admin.condition`/`access` gates | ⚙️ Config + 1 enum value — **4.7B** |
| **Rich per-section help blocks / banners** | `ui` field with a custom `admin.components.Field` | 🧩 Small component |
| **Plain-English validation** | `validate` fns returning a sentence (pattern exists on `Doctors.verified`) | ⚙️ Config |
| **Real image uploads replacing text paths** | migrate text `image` fields → `upload` relations to Media | 🚧 Data migration (own wave) |
| Redesigning the **Save bar / document controls** | not cleanly overridable without forking core views | ❌ Avoid |

**Rule of thumb:** ~70% of the *perceived* transformation is config + one CSS file (Phase 1–2). The "wow" 30% — branded Nav, dashboard, login — is ~4 small React components (Phase 3). Nothing here needs a schema migration except the optional image-upload upgrade, which is deliberately deferred.

---

## 1. Sidebar Redesign

### 1.1 The problem with the stock sidebar
Payload renders groups **alphabetically**, with no "Dashboard" entry, no icons, and no way to pin order — so even with perfect group names the nav reads `Blog · Doctors · Locations · Media Library · Treatments & Services · User Management · Website Pages · Website Settings`. The most important destination (the homepage) sits near the bottom. To deliver the structure below we ship a **custom `Nav` component** (Phase 3).

### 1.2 Target sidebar (custom Nav)

```
┌─────────────────────────────┐
│  ◆ Bavishi                  │   ← brand logo (plum on ivory)
│    Website Manager          │
├─────────────────────────────┤
│  ⌂  Dashboard               │   ← custom link → /admin (home)
│                             │
│  PAGES                      │   ← section label (muted, uppercase, Inter 11px)
│  ▭  Website Pages           │     Homepage · About BFI · Contact · Blog Landing
│  ✦  Treatments & Services   │
│  ◷  Doctors                 │
│  ⚲  Locations & Centres     │
│  ✎  Blog & Articles         │
│                             │
│  LIBRARY                    │
│  ▤  Photos & Media          │
│                             │
│  SETTINGS                   │
│  ⚙  Website Settings        │     Header · Footer · Contact Details · Brand
│  ⚐  Team Access      (admin)│   ← only rendered for admins
├─────────────────────────────┤
│  Dr. Parth Bavishi          │
│  Website Team ▾  · Sign out │   ← account footer
└─────────────────────────────┘
```

### 1.3 Exact mapping (config that feeds the Nav)

| Sidebar item | Underlying collections/globals | `admin.group` | Visibility |
|---|---|---|---|
| **Dashboard** | — (custom route `/admin`) | n/a | all |
| **Website Pages** | `homepage`, `about-page`, `pages` (Contact), `blog-hub` | `Website Pages` | all |
| **Treatments & Services** | `treatments`, `services` | `Treatments & Services` | all |
| **Doctors** | `doctors` | `Doctors` | all |
| **Locations & Centres** | `cities`, `centres` | `Locations` | all |
| **Blog & Articles** | `blogs`, `categories`, `authors` | `Blog` | all |
| **Photos & Media** | `media` | `Media Library` | all |
| **Website Settings** | `header`, `footer`, `contact-info`, `site-settings` | `Website Settings` | marketing + admin |
| **Team Access** | `users` | `User Management` | **admin only** |

> The `admin.group` strings already exist (C1). The custom Nav reads the same groups but renders them in **business order with icons and SECTION dividers**, adds the **Dashboard** entry, and hides **Team Access** for non-admins. Icons are Lucide (already a dependency) tinted plum, rose on active.

### 1.4 Nav interaction details
- **Active state:** rose left-border (3px) + rose-soft background pill, plum text. Calm, not loud.
- **Collapsible sections** (`PAGES / LIBRARY / SETTINGS`) remember state per user (localStorage).
- **Single-item groups don't show a disclosure** — they navigate directly (no "one-item folder" friction the stock nav has today).
- **Mobile:** the Nav collapses to a hamburger; tap targets ≥44px.

---

## 2. Dashboard Homepage

When a doctor logs in they land on a **custom dashboard view** (`admin.components.views.dashboard.Component`), not Payload's default grid of collection cards.

### 2.1 Wireframe

```
╔══════════════════════════════════════════════════════════════════════╗
║  gradient-warm band (ivory → faint rose, plum noise)                  ║
║                                                                        ║
║   Good morning, Dr. Bavishi 🌸                                         ║
║   Welcome to the Bavishi Website Manager                              ║   ← Fraunces 32px, plum
║   Everything you change here goes live on bavishi*.com.               ║   ← Inter 15px, muted
║                                                                        ║
╠══════════════════════════════════════════════════════════════════════╣
║  QUICK ACTIONS                                                         ║
║  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌───────┐║
║  │ ✎          │ │ ◷          │ │ ✦          │ │ ▤          │ │ ✍     │║
║  │ Edit       │ │ Manage     │ │ Update     │ │ Upload     │ │ Write │║
║  │ Homepage   │ │ Doctors    │ │ Treatments │ │ Images     │ │ Article│║
║  └────────────┘ └────────────┘ └────────────┘ └────────────┘ └───────┘║
║    (card: white, radius-xl, shadow-soft, hover-lift, rose icon chip)   ║
╠═══════════════════════════════════════════╦══════════════════════════╣
║  RECENT ACTIVITY                          ║  TIPS & HELP             ║
║  • You edited Homepage · 2 min ago        ║  💡 Keep headlines short  ║
║  • Priya updated Dr. Shah · yesterday     ║     — aim for ~55 chars   ║
║  • New article "IVF myths" · 2 days ago   ║     so Google shows it    ║
║  • Reception added a photo · 3 days ago   ║     in full.              ║
║                                           ║                          ║
║  [ See all changes → ]                    ║  📞 Need help? Contact    ║
║                                           ║     the website team.     ║
╚═══════════════════════════════════════════╩══════════════════════════╝
```

### 2.2 Components

| Block | Content | Data source | Build |
|---|---|---|---|
| **Welcome card** | Time-aware greeting (`Good morning/afternoon`) + name + one-line reassurance | `req.user` | server component |
| **Quick actions** (5) | Edit Homepage → `/admin/globals/homepage`; Manage Doctors → `/admin/collections/doctors`; Update Treatments → `/admin/collections/treatments`; Upload Images → `/admin/collections/media`; Write Article → `/admin/collections/blogs/create` | static links | trivial |
| **Recent activity** | Last 5–8 edits across content (who / what / when, human-relative) | Payload **versions** + `updatedAt` queried via local API; filter to content collections | server component |
| **Tips & help** | Rotating 1–2 plain-English tips + a "Contact the website team" line | static array | trivial |

> **Honesty note:** "Recent activity" is real but scoped — it reads `updatedAt` + version metadata (already on every drafts-enabled collection). It is *not* a full audit log; a true audit trail is a later enhancement.

### 2.3 Role-aware quick actions
- **Clinic staff** see: Write Article, Manage Doctors (bio only), Upload Images.
- **Marketing** see all five.
- **Admin** additionally see a small *"Website Team"* row: Team Access, Brand & Identity, Advanced settings.

---

## 3. Visual Design System (Bavishi brand → admin)

Source of truth is the live site's [styles.css](../src/styles.css). The admin theme **reuses the exact tokens** so the panel is visibly the same family.

### 3.1 Color (OKLCH source · hex ≈ reference)

| Token | OKLCH (source of truth) | ≈ Hex | Role in admin |
|---|---|---|---|
| **Rose** (primary) | `oklch(0.65 0.21 0)` | `#E14B6A` | Primary buttons, active nav, focus ring, links |
| **Plum** (secondary) | `oklch(0.27 0.09 305)` | `#2E184B` | Headings, nav text, logo, dark surfaces |
| **Rose-soft** (accent) | `oklch(0.93 0.05 0)` | `#F8DDE4` | Active-nav pill, hover, info chips |
| **Gold** (accent 2) | `oklch(0.78 0.10 80)` | `#E0B15A` | Badges, "verified", awards |
| **Ivory** (bg) | `oklch(0.985 0.005 60)` | `#FDFCF8` | Page background |
| **Card** | `oklch(1 0 0)` | `#FFFFFF` | Cards, inputs, panels |
| **Ink** (text) | `oklch(0.16 0.01 280)` | `#1A1820` | Body text |
| **Muted text** | `oklch(0.45 0.02 280)` | `#6B6775` | Helper text, captions |
| **Border** | `oklch(0.92 0.01 60)` | `#E9E6DF` | Hairlines, input borders |
| **Destructive** | `oklch(0.577 0.245 27)` | `#D33A2C` | Delete, validation errors |

### 3.2 Mapping onto Payload's CSS variables (the `admin.css` file)
Payload themes through a documented set of custom properties. The override file:
- Sets the **page background** to ivory and **panel/input** to white.
- Remaps the **neutral elevation ramp** to *warm* neutrals (toward ivory/plum), killing Payload's cool grey.
- Overrides the **primary button** (`.btn--style-primary`) and **active nav** to **rose**; **focus ring** to rose at 40% (matches `.shadow-glow`).
- Maps **success → plum/green**, **warning → gold**, **error → destructive**.
- Sets **typography**: headings `Fraunces` (the panel already can `@import` the same Google Fonts URL the site uses), body `Inter`.
- Sets **radius** to `0.875rem` and the layered **plum-tinted shadows** (`shadow-soft`, `shadow-lift`) on cards/popovers.

### 3.3 Type ramp (Inter + Fraunces)

| Use | Font | Size / weight | Tracking |
|---|---|---|---|
| Dashboard / page title | Fraunces | 28–32 / 600 | −0.022em |
| Section heading | Fraunces | 20 / 600 | −0.02em |
| Field label | Inter | 14 / 600 | 0 |
| Helper text | Inter | 12.5 / 400 | 0 |
| Section label (nav) | Inter | 11 / 600 uppercase | +0.06em |
| Body / input | Inter | 14 / 400 | 0 |

### 3.4 Spacing & shape
- **Spacing scale:** 4 · 8 · 12 · 16 · 24 · 32 · 48 (Tailwind-aligned). Forms breathe: 24px between field groups, 16px within a group.
- **Radius:** inputs/cards `14px` (`--radius`), chips/pills `999px`, buttons `12px`.
- **Cards:** white, 1px warm border, `shadow-soft`, `hover-lift` on interactive cards.
- **Elevation discipline:** at most two shadow levels on screen — content cards (`soft`) and the active modal/popover (`lift`).

### 3.5 Login screen
Ivory `gradient-warm` background, centered white card (`shadow-lift`, `radius-2xl`), Bavishi logo, Fraunces "Welcome back", Inter sub-line *"Sign in to manage the Bavishi website."* No Payload wordmark.

---

## 4. Content Editing Experience

**Principle (already adopted in C2):** every editable field answers, in one jargon-free sentence, *"what is this and where does it show?"* — often with an inline example. C2 delivered this across all collections/globals via `label` + `admin.description`. This section defines the *next* layer: section orientation and examples-as-design.

### 4.1 Section help banners
Each edit screen opens with a one-line orienting banner (a `ui` field rendered by a small `SectionIntro` component), e.g. on **Homepage → Top Section**:

```
┌────────────────────────────────────────────────────────────┐
│ ⓘ  This is the first thing visitors see at the top of the  │
│    homepage. Keep the heading short and warm.              │
└────────────────────────────────────────────────────────────┘
```

### 4.2 The label + helper + example pattern (standardized)

```
Treatment Title                                   ← label (Inter 14/600)
┌──────────────────────────────────────────────┐
│ IVF Treatment                                 │ ← input
└──────────────────────────────────────────────┘
The main heading visitors see on the page.        ← helper (muted 12.5)
Example: "IVF Treatment"                           ← example (muted italic)
```

This is pure `label` + `admin.description` (config). For fields where an example adds clarity, the example lives **in** the description (`… Example: "IVF Treatment".`) — the convention is already in the terminology standard.

### 4.3 Per-confusing-field human explanations (samples — all config)

| Field | Plain explanation shown |
|---|---|
| `headlineItalic` | "The one word in the headline shown in the fancy cursive style." |
| `metaTitle` | "The clickable blue title in Google. Aim for ~55–60 characters so it isn't cut off." |
| `channel` (Footer) | "Pick Phone/Email/WhatsApp to auto-fill the link from Brand & Identity, or choose Custom URL and type your own." |
| `reviewerSlug` | "The doctor who medically checked this page. Managed by the website team." |
| `experienceLabel` vs `experienceYears` | "What visitors read (e.g. '35+ yrs')" vs "the number used for sorting." |

### 4.4 Empty states
Per-collection friendly empty copy, e.g. Articles: *"No articles yet — click **Create New** to write your first post."* (collection `admin.description` + a small list-view empty component).

---

## 5. Website-Team Fields → "Advanced Settings"

The biggest "this is a database" leak is technical fields sitting next to editorial ones. C3 already **locked** them (server-enforced `access.update: isAdminField`, editable-on-create slugs). This section makes them **disappear for normal editors** and **visually quarantines** them for admins.

### 5.1 Mechanism
- Collect every technical/inert field — `slug`, `href`, `citySlug`, `schemaType`, `procedure.*`, `reviewerSlug`, `medicalSpecialty`, `geo`, `opening`, `built`, `isHeadOffice`, `reviewsKey`, linked-ID lists, `megaCols` — into a single trailing **unnamed tab** labelled **"Advanced (website team)."**
- Gate the whole tab with `admin.condition: ({ user }) => isAdmin(user)` so **editors never see it**; admins see it clearly separated.
- Keep the C3 `access.update` server locks underneath (defense in depth — hiding ≠ enforcing).

```
Treatment edit screen (admin view):
┌ Top Section ─ What Is ─ Benefits ─ … ─ FAQs ─ [ Advanced (website team) ] ┐
                                                  └── slug · href · procedure ·
                                                      reviewerSlug · schema …
Editor view: the "Advanced" tab is simply absent. They see only what they can change.
```

### 5.2 Why this is safe
Unnamed tabs are **presentational** — no field `name` changes, no data nesting, no migration (the load-bearing rule from the existing tabs plan). `admin.condition` is UI-only; the `access.update` gate is the real guard. Seeds (admin REST) are unaffected.

---

## 6. Media Experience

### 6.1 Today
`Media` is a real Payload upload collection (a working library), but several content image fields are still **text path strings** (`hero.image`, `heroImage`, doctor `image`) — an editor types `/assets/...`, which is the worst UX in the panel.

### 6.2 Target (two tiers)
- **Now (config):** every image field gets purpose + spec guidance in its description — *"Landscape photo, ~1200×630px, JPG or WebP. Ask the website team to add new images."* The Media library itself gets a friendlier `alt` description (done) and an empty state.
- **Later (migration wave):** convert text-path fields → real `upload` relations to Media, giving drag-drop, preview thumbnails, and reuse. This touches resolvers + byte-parity, so it is its **own wave** (flagged, not in scope here).

### 6.3 Purpose-labelled upload slots
Where uploads exist (or after migration), label by **role**, not file:

```
Homepage Banner Image     "Wide hero photo, ~1600×900px. Shows at the very top."
Doctor Profile Image      "Portrait, square ~600×600px. Shown on the doctor's card."
Blog Thumbnail            "Landscape ~1200×630px. The cover shown in article lists."
```

### 6.4 Upload UX guidance
- Accept JPG/PNG/WebP; show dimension hint inline; `sharp` already generates sizes.
- Required `alt` with the accessibility explanation (done) — framed as *"Describe the photo for visually-impaired visitors and Google."*

---

## 7. Form Experience

### 7.1 Structure: tabs over walls
Long globals/collections (Homepage, About, Treatments, Services, Centres) become **unnamed tabs in visitor order** + **collapsible** sub-sections for busy areas (e.g. Homepage → Videos' three arrays). Field count per visible screen drops dramatically; the editor navigates by *section of the page*, not by scrolling a database row.

```
Homepage:  [ Top Section ] [ Stats ] [ Why Bavishi ] [ Why Choose ] [ Suraksha ]
           [ Awards ] [ Events ] [ Videos ] [ FAQs ] [ Closing CTA ] [ Search Engine ]
```

### 7.2 Cards & rows
Related short fields share a `row` (e.g. phone digits + phone display + hours) — already used widely. Optional blocks (callout boxes, video) sit in clearly-labelled `collapsible` groups that default collapsed when empty.

### 7.3 Save flow
- Payload's built-in sticky save controls stay (don't fork core), but the **theme** makes them feel native: rose **Save**, plum **draft/publish** affordances, ivory bar.
- **Drafts are on** everywhere → "Save Draft" vs "Publish" is the safety net; the dashboard tip explains it once: *"Save Draft to keep working; Publish to put it live."*
- After save: a **rose toast** *"Homepage updated — your changes are live."* (Payload toast, themed).

### 7.4 Validation in plain English
Pattern already proven on `Doctors.verified` ("A verified doctor must have… credentials and at least one degree"). Standardize: every `validate` returns a **sentence a doctor understands**, names the field, and says how to fix it — never a code or regex.

### 7.5 Friendly selects
Icon pickers now show human labels ("Flask / Test Tube", "Shield / Protection") while storing the raw component value (just implemented). Apply the same `{label, value}` discipline to any remaining raw enum.

---

## 8. Payload Implementation Plan

### Phase 1 — Quick Wins ✅ (largely done: C1–C3, now hardened)
Pure config, zero migration, `seo:diff` stays green.
1. Business-language sidebar **groups** (`admin.group`). ✔
2. Plain-English **labels + helper text + examples** everywhere. ✔
3. **Footgun locking** — `access.update: isAdminField`, editable-on-create slugs (H1 fix), consistent server enforcement (M1 fix). ✔
4. **Friendly selects** (icon labels). ✔
5. Per-collection **empty-state** descriptions + image-purpose guidance.

> *Acceptance:* panel reads in English; no editor can touch a field that doesn't affect the site; no schema change.

### Phase 2 — High-Impact UX (config + 1 CSS file + tiny components)
6. **Tabs + collapsibles** for Homepage, About, Treatments, Services, Centres (unnamed only). *(C4/C5)*
7. **"Advanced (website team)" tab**, `admin.condition`-gated to admins. *(needs role helper — pairs with 4.7B)*
8. **Brand theme** — `admin.css` overriding Payload variables → rose/plum/ivory + Fraunces/Inter + 14px radius + plum shadows.
9. **Logo + Icon + meta** — `admin.components.graphics` + `admin.meta` ("— Bavishi Website Manager", clinic favicon).
10. **Section help banners** (`ui` field + small `SectionIntro` component).

> *Acceptance:* every long screen is sectioned; technical fields invisible to editors; the panel visibly looks like Bavishi.

### Phase 3 — Full Bavishi Admin Experience (custom components)
11. **Custom Nav** — Dashboard link, Lucide icons, business order, SECTION dividers, role-aware Team Access, account footer.
12. **Custom Dashboard view** — welcome card, 5 quick actions, recent activity (versions/`updatedAt`), tips & help.
13. **Branded login** — `beforeLogin` copy + gradient-warm card.
14. **Role tier (4.7B)** — add `clinic` role + `isClinicStaff`/`isMarketing` helpers; apply field/tab `admin.condition` so clinic staff see only bios/articles/FAQs/photos, marketing see editorial+SEO, website-team see Advanced.

### Phase 4 — Deferred (own waves, flagged)
- **Image uploads** replacing text-path fields (resolver + parity migration).
- **Preview links** (homepage/treatments opt into `draftMode()` so editors get a "View page" button).
- **Audit log** beyond recent-activity.
- Lexical RichText for bios/prose arrays.

---

## 9. Deliverable Summary

This document **is** the UX blueprint. Recap of the artifacts:

- **Sidebar structure** → §1 (custom Nav, exact item→collection mapping, role visibility).
- **Dashboard wireframe** → §2 (welcome, quick actions, recent activity, tips; data sources + build type).
- **Screen layouts** → §4 + §7 (label/helper/example pattern, section banners, tabs, save flow, validation).
- **Design system** → §3 (real OKLCH tokens → Payload variables, type ramp, spacing, shape, login).
- **Implementation roadmap** → §8 (Phase 1 done → Phase 3 custom components → Phase 4 deferred), each tagged by Payload mechanism.
- **Capability honesty** → §0 (what's config vs CSS vs component vs migration).

### The 5-minute-doctor test (the acceptance bar)
> Dr. Bavishi logs in → branded login → lands on *"Welcome to the Bavishi Website Manager"* → clicks **Edit Homepage** → opens on the **Top Section** tab → sees **Page Heading** with the example *"IVF Treatment"* → edits one line → clicks **Save** → rose toast *"Homepage updated — your changes are live."* → signs out.
> At no point did he see the word *slug*, *global*, *schema*, or *Payload*. He never scrolled past a field he couldn't use. He managed a website — not a database.

---

*Prepared as the Bavishi Website Manager experience blueprint. Phases 1 (done) → 4 (deferred) map to the existing 4.7A/4.7B wave structure; nothing here forks the plan. Gated on: (a) go-ahead to build C4/C5 tabs + the Advanced tab, (b) sign-off on the brand theme direction in §3.*
