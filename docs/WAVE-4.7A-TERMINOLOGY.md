# Wave 4.7A — Admin Terminology Standard

**Status:** Adopted for Wave 4.7A (commits C1–C3). The single source of truth for plain-English wording in the Payload admin. Every collection/global label, field `label`, and `admin.description` must conform to this table so editors meet the same words for the same concept everywhere.

**Audience:** fertility doctors, clinic managers, marketing, front-desk. No jargon: never *slug*, *global*, *schema*, *Class-A*, *Lexical*, *Open Graph*, *eyebrow*, *em*, *href*.

---

## 1. Concept → Plain-English word

| Code concept / field | Editor-facing term | Notes |
|---|---|---|
| `slug` (URL identifier) | **Page URL** | Read-only on seed-managed collections; on author-created collections (Blog) → editable, labelled "Page URL". |
| `slug` **when an `href` also exists** | **Page ID** | Disambiguates from the full URL. Both read-only. |
| `href` / canonical path | **Page URL** | Read-only ("Managed by the website team"). |
| `citySlug` | **Parent city ID** | Read-only. |
| SEO group | **Search Engine & Social Preview** | The whole `seo` group's heading. |
| `metaTitle` | **Google Page Title** | + length hint "~55–60 characters". |
| `metaDescription` | **Google Search Description** | + length hint "~150–160 characters". |
| `ogTitle` | **Social Share Title** | "Used when shared on Facebook/WhatsApp/LinkedIn." |
| `ogDescription` | **Social Share Description** | |
| `ogImage` | **Social Share Image** | |
| `meta` (Treatments) | **Search Engine & Social Preview** | Same wording as the shared SEO group. |
| `hero` group | **Top Section** | The banner at the top of the page. |
| `eyebrow` | **Small Label Above Heading** | |
| `lead` (heading) | **Heading Text** | |
| `em` / `h1Em` / `headlineItalic` / `headingEm` | **Highlighted Word(s)** | "The word(s) shown in the cursive accent style." |
| `h1` / `headline` | **Page Heading** | |
| `tagline` / `subtitle` / `paragraph` | **Sub-heading / Intro Paragraph** | Use the most natural of the two per context. |
| `cta` / `ctas` | **Button** / **Buttons** | |
| `cta.label` / button `text` | **Button Text** | |
| `cta.url` / `href` (button) | **Button Link** | |
| `faqs` | **FAQs** | Keep; children → "Question" / "Answer". |
| `q` / `a` | **Question** / **Answer** | |
| `t` / `d` (cards/steps) | **Title** / **Description** | Applied to every single-letter card/step field. |
| `n` (step number) | **Step Number** | |
| `intro` | **Introduction** | |
| `desc` | **Short Description** | |
| `badges` | **Badges** | |
| `shortName` | **Short Name** | "Plain label used inside the text." |
| `breadcrumbName` | **Breadcrumb Name** | |
| `reviewerSlug` | **Medical Reviewer (doctor ID)** | Read-only — website team. |
| `lastReviewed` | **Last Medically Reviewed (date)** | |
| `schemaType` / `procedureType` / `procedure.*` | **Search Engine Category (website team)** | Read-only/hidden. |
| `medicalSpecialty` | **Search Engine Specialty Tags (website team)** | Read-only. |
| `verified` (Doctors) | **Verified Credentials (admin only)** | Existing admin-only access kept. |
| `built` | **Live on Site (managed by website team)** | Read-only. |
| `isHeadOffice` | **Head Office (website team)** | Read-only. |
| `geo` | **Map Coordinates (website team)** | Read-only. |
| `opening` | **Opening Hours Data (website team)** | Read-only; the human `hours` text stays editable. |
| `reviewsKey` | **Reviews Feed Key (website team)** | Read-only. |
| `doctors[]` / `treatments[]` / `womensHealth[]` (slug lists) | **Linked Doctors / Treatments / Services (website team)** | Read-only. |
| `channel` "None — use the URL below" | **Custom URL** | Footer/Contact select option. |
| `styleVariant` (single inert option) | — | Hidden. |
| `megaCols` | **Force column count (website team)** | Read-only. |

## 2. Standard description phrasings (reuse verbatim)

- **Read-only context field:** *"Shown for reference. Ask the website team to change this."*
- **Website-team-managed:** *"Managed by the website team."*
- **URL/slug:** *"The web address for this page. Set when the page is created — changing it breaks links and Google rankings."*
- **Empty-falls-back-to-default:** *"Leave empty to keep the built-in default."*
- **Google title length:** *"Aim for ~55–60 characters so Google doesn't cut it off."*
- **Google description length:** *"Aim for ~150–160 characters."*

## 3. Sidebar groups (plain English, no prefixes, no emojis — approved)

`Website Pages` · `Treatments & Services` · `Doctors` · `Locations` · `Blog` · `Website Settings` · `Media Library` · `User Management`

> Payload renders groups alphabetically; the approved decision is **plain labels with no ordering prefixes**, so the on-screen order will be alphabetical by these names. Accepted as-is for 4.7A.

## 4. Collection / global display names

| Config | Old | New display name |
|---|---|---|
| `pages` | Pages | **Contact Page** |
| `blogs` | Blogs | **Articles** |
| `authors` | Authors | **Authors & Reviewers** |
| `categories` | Categories | Categories *(unchanged)* |
| `media` | Media | **Media** *(group: Media Library)* |
| `users` | Users | Users *(group: User Management)* |
| `blog-hub` | Blog Hub | **Blog Landing Page** |
| `about-page` | About | **About BFI** |
| `homepage` | Homepage | Homepage *(group: Website Pages)* |
| `header` | Header | **Header & Navigation** |
| `footer` | Footer | Footer |
| `contact-info` | Contact Info | **Contact Details** |
| `site-settings` | Site Settings | **Brand & Identity** |
