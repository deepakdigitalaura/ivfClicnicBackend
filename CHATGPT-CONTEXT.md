# Project Context — Bavishi Fertility Institute Website

> Paste this whole file into ChatGPT as background before asking development questions.
> It describes the business, the tech stack, the architecture, and the conventions
> so answers stay consistent with how the codebase is actually built.

---

## 1. What this project is

A marketing + SEO website for **Bavishi Fertility Institute (BFI)** — a chain of IVF /
fertility clinics in India (Gujarat + Mumbai + Varanasi). The site's job is to rank well in
local + medical search, build trust (E-E-A-T / YMYL), and drive consultation bookings.

It is a content-heavy, mostly-static marketing site (not a web app with logins). Pages are
generated from typed TypeScript data modules, not a CMS (yet).

### Business facts (use these exactly; they're standardized across the site)
- Brand name is **always written in full: "Bavishi Fertility Institute"**. Never "BFI" or a
  standalone "Bavishi" in user-facing copy (family surnames / the @handle are the only
  exceptions). "BFI" is fine only in internal code/docs like this file.
- Founded **1984** (this is the number used throughout the site). Note: the official site
  says 1998 — there's a known discrepancy to verify before launch, but code currently uses 1984.
- **30,000+** successful pregnancies; four decades of experience; award-winning.
- Each centre has its **own phone number** (do not assume one global number). Ahmedabad
  helpline: +91 97126 22288.

---

## 2. Tech stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript 5.8**
- **Tailwind CSS v4** (`@tailwindcss/postcss`) — single global stylesheet at `src/styles.css`
- **shadcn/ui** components (Radix primitives) in `src/components/ui/`
- **framer-motion** (animations; wrapped via `src/components/motion.tsx` — `Reveal`, `Magnetic`)
- **lucide-react** (icons)
- **react-hook-form + zod** (forms), **embla-carousel**, **sonner** (toasts), **recharts**
- Dev: `npm run dev` (Turbopack). Build: `npm run build`. Runs on **portable Node 22, port 3001**.
- `prebuild`/`sync-reviews` script pulls reviews before build (`scripts/sync-reviews.mjs`).

Deploy model: **static export** — `npm run build`, then upload the `out/` folder. There is also
a Netlify client-preview URL that lags until redeployed.

---

## 3. Routing (Next.js App Router — `src/app/`)

- `/` → `page.tsx` → `home-page.tsx`
- `/locations/[city]` → city hub page → `city-page.tsx`
- `/locations/[city]/[center]` → individual centre page → `center-page.tsx`
- `/doctors`, `/doctors/[slug]` → `doctor-page.tsx`
- `/services/[slug]` → `service-page.tsx`
- Many **treatment/condition pages** are their own top-level routes (e.g. `/what-is-ivf`,
  `/icsi-treatment-intracytoplasmic-sperm-injection`, `/pcos`, `/azoospermia`, `/surrogacy`,
  `/egg-donation`, `/era-test`, etc.) → most render via `treatment-page.tsx` / `ivf-page.tsx`.
- `/about-bfi`, `/contact`.

Pattern: a **route file is thin** — it imports data from `src/lib/*` and a **page component**
from `src/components/*-page.tsx` that does the actual rendering.

---

## 4. Data layer (`src/lib/`) — the heart of the project

All content is typed data, kept **serialisable** (plain strings/objects) so it crosses the
Next.js server→client boundary cleanly.

- **`locations.ts`** — `City` and `Centre` types + the `CITIES` / `CENTRES` arrays. Cities have
  `slug, name, region, helpline, heroImage, intro[], faqs[], womensHealth?[]`. Centres have
  `slug, citySlug, fullName, address, phone, hours, geo, mapQuery, image, nearby[], facilities[],
  doctors[] (slugs), treatments[] (slugs), faqs[], gallery[], womensHealth?[]`. Helper URL
  builders (`cityUrl`, `centreUrl`, `centreMapUrl`).
  - *Recent addition:* optional **`hero360Url`** on both `City` and `Centre` — a Google Maps
    "Embed a map" `src` (`maps/embed?pb=...`). When set, the hero renders an interactive **360°
    Street View iframe** instead of the static hero image, inside the exact same rounded
    `aspect-[4/5]` container, with a "360° View · Drag to explore" badge overlay
    (`pointer-events-none`). Currently set on Ahmedabad (city + Paldi/Nikol/Sindhu Bhavan Road
    centres), Bhuj (city), Mumbai (city + Ghatkopar centre).
- **`doctors.ts`** — doctor profiles (training, publications, etc.); `cityDoctor` factory;
  centre-based contact cards. Sourced/verified from ivfclinic.com.
- **`treatments.ts`** — treatment/condition page content registry.
- **`womens-health.ts`** — `WOMENS_HEALTH_SERVICES` (maternity / women's-health services like
  3D-4D sonography, painless delivery, fetal medicine, twin pregnancy care). Cities/centres
  reference these by **string key** (kept as strings, not icon objects, for serialisability).
- **`reviews.ts`** — two-layer review system: real **Google Places** reviews with a **dummy
  fallback** when none are cached.
- **`video-testimonials.ts`**, **`blogs.ts`** — registries for related videos / blog posts.
- **`internal-links.ts`** — internal-linking registry: future pages are listed with a
  `published` flag (flip to true when live); used by the **`Linkify`** component to
  auto-cross-link mentions. Also drives related-blogs / video-testimonial linking.
- **`seo.ts`** — SEO/metadata + schema helpers (JSON-LD). Used with `json-ld.tsx`.
- **`utils.ts`** — `cn()` (clsx + tailwind-merge) and misc helpers.

---

## 5. Page components (`src/components/`)

- `*-page.tsx` files render a whole page type (`home-page`, `city-page`, `center-page`,
  `doctor-page`, `service-page`, `treatment-page`, `ivf-page`, `about-page`, `contact-page`).
- `location-sections.tsx` — shared sections reused across city/centre pages (centres list,
  maps, galleries, contact info, available services).
- `motion.tsx` — `Reveal` (scroll-in animation wrapper) and `Magnetic` (magnetic hover button).
- `linkify.tsx` — auto internal-linking of keywords.
- `json-ld.tsx` — injects structured data (schema.org) into pages.
- `medical-reviewer.tsx` — "medically reviewed by Dr. X" E-E-A-T block.
- `conversion.tsx` — booking/CTA / lead-capture pieces.
- `site-header.tsx` — global nav.
- `ui/` — shadcn/ui primitives (button, accordion, dialog, etc.).

---

## 6. Design system (must match existing UI exactly)

- Brand pink/rose ≈ **#E91E8C**, defined as CSS variables in `src/styles.css` (OKLCH):
  `--rose`, `--plum` (deep purple, used for headings/dark text), `--ivory`, `--gold`.
  Used in classes like `text-[color:var(--rose)]`, `bg-[color:var(--plum)]`.
- Headings use a **serif display font** with italic emphasis on key words
  (`font-display italic text-[color:var(--rose)]`).
- **Section background rhythm:** sections alternate backgrounds so adjacent ones don't merge —
  ivory/white count as the same "light" tone, **blush** is the visible alternate. There's a
  render-order `band()` helper for pages with optional sections.
- Cards/hero images use `rounded-[2rem] shadow-lift ring-1 ring-black/5`, hero image container
  is `aspect-[4/5]`.

**Hard rule for this project: keep the current UI pixel-for-pixel.** Changes should preserve the
existing look unless explicitly asked to redesign. (The site was migrated to Next.js with the
explicit goal of preserving the prior UI exactly.)

---

## 7. SEO / E-E-A-T / Local-SEO framework (very important — it's the point of the site)

Every new page is expected to follow a mandatory checklist:
- Proper **metadata** (title/description/canonical) via `seo.ts`.
- **JSON-LD schema** (MedicalClinic / Physician / FAQPage / BreadcrumbList, etc.) via `json-ld.tsx`.
- **E-E-A-T**: medically-reviewed-by attribution, real doctor credentials, citations.
- **YMYL** tone: accurate, careful, non-misleading medical content.
- **Local SEO**: per-centre NAP (name/address/phone), `nearby[]` areas served, Google Maps embeds.
- **Internal linking** via the registry + `Linkify`.
- Reviews (Google Places + fallback), video testimonials, related blogs where relevant.

The architecture is deliberately **scalable**: add a city/centre/doctor/treatment by adding a
typed entry to the relevant `src/lib/*` module — the page renders from shared components.

---

## 8. Conventions / gotchas for contributors

- **Add content as data, not hardcoded JSX** — extend the `src/lib/*` registries; let the shared
  `*-page.tsx` components render it.
- Keep data **serialisable** (no functions / React nodes / icon components inside the data arrays;
  reference things by string key and resolve in the component).
- Reuse existing components and Tailwind tokens; don't introduce new colors/fonts.
- Cross-origin iframes (e.g. Google Maps) — you **cannot** style/remove their internal UI from
  outside; only overlay your own elements on top (use `pointer-events-none` so you don't block
  interaction).
- Windows dev environment, PowerShell shell.

---

## 9. Current state / roadmap

- **Phase A (done):** migrated to Next.js, preserving the old UI exactly.
- **Phase B (next):** Sanity CMS, Cloudflare hosting, i18n (multi-language).
- Location build progress: Ahmedabad (city + Paldi/Nikol/Sindhu Bhavan Road centres) done;
  more cities/centres being added (Mumbai + sub-centres, Bhuj, Vadodara, Surat, Bhavnagar,
  Anand, Varanasi).
- Full written spec lives at `docs/BFI-Website-Revamp-Specification.md`.

---

## 10. How to ask ChatGPT for help on this project

When asking a question, mention:
1. **Which page/route** (e.g. `/locations/mumbai/ghatkopar`) and which **component** (`center-page.tsx`).
2. Whether new content should be **data-driven** (almost always yes — which `src/lib/*` file?).
3. That the **existing UI must be preserved** and **brand/SEO rules** (sections 1, 6, 7) apply.
4. That output should be **Next.js 15 App Router + React 19 + TypeScript + Tailwind v4**, using
   existing components (`Reveal`, `Magnetic`, shadcn `ui/*`) and CSS variables (`--rose`, `--plum`).
