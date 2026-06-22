# BAVISHI FERTILITY INSTITUTE
## Complete Website Revamp Specification
### Version 2.0 | May 2026 | Digital Aura × Claude Code
### Updated per client feedback — see CHANGELOG below

---

## CHANGELOG v2.0

| # | Change | Section |
|---|--------|---------|
| 1 | Hosting switched to **Cloudflare** — full stack updated | §3 |
| 2 | Full treatment category map added with all sub-page URLs | §5, §6 |
| 3 | Founded year corrected to **1984** | All |
| 4 | Pregnancies updated to **30,000+** | All |
| 5 | Blog author default set to **Dr. Parth Bavishi** | §15 |
| 6 | Blog interactivity spec expanded (infographics, visuals, layout) | §15 |
| 7 | Phone numbers flagged as client-action-required per center | §8 |
| 8 | Full-site CMS editability spec expanded (every element editable) | §3, §13 |
| 9 | Second audit PDF noted (unreadable — PDF tool not available) | §2 |

---

> **Implementation Note:** This document is the single source of truth for Claude Code to build the entire revamped website. Every decision here is intentional — do not deviate without flagging the change. The goal is **100 qualified leads per day**, ranking in the top 3 for all target keywords, and getting cited by Claude, ChatGPT, Gemini, and Perplexity as the authoritative fertility institution in India.

---

## TABLE OF CONTENTS

1. [Project Overview & Goals](#1-project-overview--goals)
2. [Independent SEO Audit Findings](#2-independent-seo-audit-findings)
3. [Recommended Tech Stack & Architecture](#3-recommended-tech-stack--architecture)
4. [Design System](#4-design-system)
5. [Information Architecture — New Sitemap](#5-information-architecture--new-sitemap)
6. [Page-by-Page Specifications](#6-page-by-page-specifications)
7. [Content Strategy — YMYL, AEO, GEO, EEAT](#7-content-strategy--ymyl-aeo-geo-eeat)
8. [Local SEO Strategy](#8-local-seo-strategy)
9. [International SEO & Multilingual](#9-international-seo--multilingual)
10. [Schema Markup Strategy](#10-schema-markup-strategy)
11. [Calculator Specifications](#11-calculator-specifications)
12. [SEO Agent Architecture — Claude API](#12-seo-agent-architecture--claude-api)
13. [Backend & CRM Specifications](#13-backend--crm-specifications)
14. [GA4 & GSC Setup](#14-ga4--gsc-setup)
15. [Blog Rewrite Strategy](#15-blog-rewrite-strategy)
16. [Animation & Interaction Design](#16-animation--interaction-design)
17. [GEO — Generative Engine Optimization](#17-geo--generative-engine-optimization)
18. [Migration Plan from WordPress](#18-migration-plan-from-wordpress)
19. [Performance Requirements](#19-performance-requirements)
20. [Implementation Timeline](#20-implementation-timeline)

---

## 1. PROJECT OVERVIEW & GOALS

### 1.1 Business Context

**Client:** Bavishi Fertility Institute (BFI)  
**Website:** ivfclinic.com  
**Founded:** 1984  
**Centers:** 15 centers across India (Ahmedabad ×3, Vadodara, Surat, Bhuj, Mumbai ×6, Bhavnagar, Anand, Varanasi)  
**Current Platform:** WordPress + Rank Math SEO  
**Target Platform:** Next.js 15 + Sanity CMS v3  

### 1.2 Primary Goals (Non-Negotiable)

| Goal | Target | Metric |
|------|--------|--------|
| Daily Leads | 100 qualified leads/day | Form submissions + WhatsApp clicks |
| Organic Traffic | 10× current traffic | GA4 Sessions |
| Local Ranking | Top 3 in all 8 cities | Google Maps Pack + Organic |
| National Ranking | Top 3 for "best IVF center India" | GSC Position |
| AI Citations | Cited by Claude, ChatGPT, Gemini, Perplexity | Manual monitoring |
| International Patients | 2× current (600+/year) | Contact form source tracking |
| Page Speed | LCP < 2.5s, CLS < 0.1, INP < 200ms | Core Web Vitals |
| Conversion Rate | 2-3% of organic sessions → lead | GA4 Goals |

### 1.3 Priority Centers for Lead Generation

1. **Ahmedabad** (All 3 centers) — Primary market, head office
2. **Mumbai** (All 6 centers) — Largest city, highest patient volume potential
3. All other cities at equal priority after Ahmedabad and Mumbai

### 1.4 Key Brand Differentiators to Amplify

1. **Suraksha Kavach** — Money-back guarantee until healthy live birth (98% success)
2. **Zero severe OHSS** in 10+ years (industry-leading safety record)
3. **First in India** — First frozen egg live birth, first international surrogacy
4. **Class 1000 IVF Labs** — 10× superior to international standard (Class 10,000)
5. **DIVYA SANTAN PARIVAR** — Patient support community (emotional differentiator)
6. **Since 1984** — 40 years of trust, pioneered IVF in India in 1998
7. **One-Stop Clinic** — Tests, surgery, treatment under one roof
8. **30,000+ successful pregnancies** (update: site shows both 20,000 and 25,000 — standardize to verified number)
9. **National Fertility Award** — 5 consecutive years (2021–2025)
10. **300+ international patients annually**

---

## 2. INDEPENDENT SEO AUDIT FINDINGS

> These findings are from a live audit conducted May 2026. Fix all Critical and High issues before launch.

### 2.1 Critical Issues (Must Fix Before Launch)

| # | Issue | Impact | Page(s) Affected |
|---|-------|--------|-----------------|
| 1 | `/about-us/` returns **404** | High — loses backlinks, confuses users | /about-us/ |
| 2 | `/locations/` returns **404** | High — key navigation page missing | /locations/ |
| 3 | `/free-calculators/` returns **404** | High — traffic-generating tool page missing | /free-calculators/ |
| 4 | **Calculators are fake** — no real output shown to user | Very High — destroys trust and GEO credibility | All 8 calculators |
| 5 | **Founding year inconsistency** — "1984" on one page, "1984" on another | Medium — confuses users, hurts EEAT | Multiple pages |
| 6 | **Success stat inconsistency** — "30,000+" vs "30,000+" pregnancies cited on different pages | High — destroys trust for YMYL | Multiple pages |
| 7 | **Shared phone number** across all centers — same +91 9712622288 listed for Ahmedabad Paldi, Sindhu Bhavan, and most centers | Very High — kills Local SEO, Google cannot distinguish locations | All location pages |
| 8 | **Mumbai has 6 centers but only one landing page** — Ghatkopar, Thane, Vile Parle, Borivali, Vashi, Dadar all need individual pages | Very High — Local SEO missed for 5 Mumbai centers | /mumbai/ |

### 2.2 High Priority Issues

| # | Issue | Impact |
|---|-------|--------|
| 9 | **Missing meta descriptions** on Contact, About, multiple treatment pages | CTR drop in SERPs |
| 10 | **FAQPage schema absent** despite extensive FAQ sections on every page | Missing rich snippet opportunity |
| 11 | **MedicalClinic / MedicalBusiness schema incomplete** — only basic organization schema present | Local SEO, Knowledge Panel |
| 12 | **BreadcrumbList schema missing** | SERP breadcrumb display |
| 13 | **Zero external citations** in all blog posts — YMYL red flag | Google Helpful Content downrank risk |
| 14 | **No author bio pages** for most doctors — individual profile pages incomplete | EEAT weakness |
| 15 | **No hreflang tags** despite international patients (UAE, UK, US, Southeast Asia) | International SEO invisible |
| 16 | **No individual sub-location pages** for Ahmedabad's 3 centers (Paldi, Sindhu Bhavan, Nikol) | Local SEO missed |
| 17 | **Blog has no author byline** on competitor comparison article (8,500 words) — published under generic BFI name | EEAT gap |
| 18 | **No multilingual content** despite serving Gujarati/Hindi/Marathi speakers in Gujarat and Mumbai | Traffic gap |

### 2.3 Medium Priority Issues

| # | Issue |
|---|-------|
| 19 | Navigation too nested — users need 3+ clicks to reach treatment pages |
| 20 | Suraksha Kavach (money-back guarantee) not prominent on homepage |
| 21 | No emotional content for failed IVF attempts / secondary infertility |
| 22 | No dedicated international patient page |
| 23 | No Core Web Vitals optimization evident (WordPress plugins slow loading) |
| 24 | Social proof videos not optimized for indexation (no transcript, no VideoObject schema) |
| 25 | WhatsApp CTA present but no automated follow-up sequence documented |

### 2.4 Content Audit: Blog Quality Assessment

**Sample article:** "IUI vs IVF — Which Fertility Treatment is Right for You?"  
- **Quality score: 8.2/10** — Strong content, expert authorship (Dr. Parth Bavishi, 12+ years experience)  
- **Key gap:** No external medical citations (PubMed, FOGSI, WHO) — required for YMYL  
- **Key gap:** No FAQPage schema despite 16 FAQ pairs  
- **Internal linking:** Excellent (40+ internal links)  
- **Competitor comparison article "13 Best IVF Clinics in Mumbai":** 8,500 words — strong strategy, lacks author byline  

---

## 3. RECOMMENDED TECH STACK & ARCHITECTURE

### 3.1 Stack Decision

**Hosting: Cloudflare** (client requirement). Full Cloudflare-native stack.

| Layer | Technology | Reason |
|-------|-----------|--------|
| **Frontend** | Next.js 15 (App Router) | SSR/SSG for SEO, React ecosystem |
| **CF Adapter** | `@cloudflare/next-on-pages` | Compiles Next.js for Cloudflare Workers runtime |
| **Hosting** | **Cloudflare Pages** | Global CDN, free SSL, 200+ PoPs, DDoS protection built-in |
| **Edge Functions** | **Cloudflare Workers** | API routes, lead capture, calculator logic at the edge |
| **Database** | **Cloudflare D1** (SQLite at edge) | Leads CRM, agent logs — native Cloudflare, zero latency, free tier |
| **Caching** | **Cloudflare KV** | Cache SEO agent outputs, meta tags, calculator templates |
| **Object Storage** | **Cloudflare R2** | Backup media, lead export PDFs (S3-compatible, no egress fees) |
| **CMS** | **Sanity.io v3** | Full-site editable — every content element, image, menu, schema |
| **Animations** | Framer Motion | Production-grade, SSR-safe, scroll-triggered |
| **Forms** | React Hook Form + Zod | Validation, edge-runtime compatible |
| **Schema** | Custom JSON-LD React components | Per-page, editable via Sanity schema templates |
| **i18n** | next-intl | App Router, hreflang, locale routing (en/hi/gu/mr) |
| **Email** | Resend | Transactional email, edge-compatible |
| **WhatsApp** | Wati API or Interakt | WhatsApp auto-response on every lead |
| **SEO Agents** | Claude API (claude-sonnet-4-6) | On-page SEO, content generation, schema, linking |
| **GSC/GA4** | Google APIs + Claude agent | Automated monitoring and actions |
| **Search** | Algolia (edge-compatible) | Site search across treatments, doctors, blogs |
| **Media CDN** | Sanity CDN + Cloudflare Images | Auto WebP/AVIF, responsive images |
| **Analytics** | GA4 + Cloudflare Analytics | GA4 for events/goals, CF for raw traffic |
| **Error Monitoring** | Sentry (edge-compatible) | Production error tracking |
| **CI/CD** | GitHub Actions → Cloudflare Pages | Auto-deploy on push to main |

### 3.1a Cloudflare Implementation Notes

**Critical rules for Next.js on Cloudflare:**
```javascript
// Every API route MUST declare edge runtime
export const runtime = 'edge';

// Use Web Crypto API instead of Node.js crypto
const id = crypto.randomUUID(); // ✓ Web API
// NOT: require('crypto').randomBytes() — ✗ Node.js only

// D1 database access in Workers
const db = env.DB; // Cloudflare D1 binding
const result = await db.prepare('SELECT * FROM leads').all();
```

**wrangler.toml configuration:**
```toml
name = "bfi-website"
compatibility_date = "2026-01-01"
pages_build_output_dir = ".vercel/output/static"

[[d1_databases]]
binding = "DB"
database_name = "bfi-leads"
database_id = "your-d1-database-id"

[[kv_namespaces]]
binding = "SEO_CACHE"
id = "your-kv-namespace-id"

[[r2_buckets]]
binding = "MEDIA"
bucket_name = "bfi-media"
```

**Cloudflare D1 Schema (SQLite — leads CRM):**
```sql
CREATE TABLE leads (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  created_at TEXT DEFAULT (datetime('now')),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  source TEXT, medium TEXT, campaign TEXT, page_url TEXT,
  calculator_used TEXT, center_preference TEXT,
  treatment_interest TEXT, doctor_preference TEXT, message TEXT,
  status TEXT DEFAULT 'new',
  assigned_to TEXT, follow_up_date TEXT, notes TEXT,
  locale TEXT DEFAULT 'en',
  is_international INTEGER DEFAULT 0, country TEXT
);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_center ON leads(center_preference);
CREATE INDEX idx_leads_created ON leads(created_at);
```

### 3.2 Architecture Diagram (Text)

```
User Browser
    │
    ▼
Cloudflare Global CDN (200+ PoPs)
    │
    ▼
Cloudflare Pages (Next.js static + Workers for dynamic)
Next.js 15 App (App Router + @cloudflare/next-on-pages)
    ├── /app/(site)/ — Public website
    ├── /app/(cms)/  — Sanity Studio (admin.ivfclinic.com)
    ├── /app/api/    — API routes (leads, calculators, agents)
    └── /app/(i18n)/ — en, hi, gu, mr locale routing
         │
         ├── Sanity.io (Content)
         │     ├── Pages, Blog Posts, Doctors, Services
         │     ├── Location pages, FAQs, Testimonials
         │     └── Calculator content, Schema templates
         │
         ├── Cloudflare D1 (Leads CRM Database)
         │     ├── leads table
         │     └── seo_agent_logs table
         │
         ├── Cloudflare KV (Cache Layer)
         │     ├── SEO_CACHE namespace
         │     └── CALCULATOR_CACHE namespace
         │
         ├── Cloudflare R2 (Media Backup)
         │
         └── SEO Agent Layer (Claude API)
               ├── On-Page SEO Agent
               ├── Content Refresh Agent
               ├── Schema Validator Agent
               ├── Internal Linking Agent
               ├── GSC Monitor Agent
               └── GA4 Insights Agent
```

### 3.3 Repository Structure

```
/
├── app/
│   ├── (site)/
│   │   ├── [locale]/           # i18n routing (en, hi, gu, mr)
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── about/
│   │   │   ├── treatments/
│   │   │   ├── locations/
│   │   │   │   ├── ahmedabad/
│   │   │   │   │   ├── page.tsx       # City hub
│   │   │   │   │   ├── paldi/         # Sub-location
│   │   │   │   │   ├── sindhu-bhavan/ # Sub-location
│   │   │   │   │   └── nikol/         # Sub-location
│   │   │   │   ├── mumbai/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── ghatkopar/
│   │   │   │   │   ├── thane/
│   │   │   │   │   ├── vile-parle/
│   │   │   │   │   ├── borivali/
│   │   │   │   │   ├── vashi/
│   │   │   │   │   └── dadar/
│   │   │   │   ├── vadodara/
│   │   │   │   ├── surat/
│   │   │   │   └── [city]/page.tsx    # Dynamic city pages
│   │   │   ├── doctors/
│   │   │   ├── calculators/
│   │   │   ├── blog/
│   │   │   ├── international-patients/
│   │   │   └── contact/
│   ├── (studio)/               # Sanity Studio
│   └── api/
│       ├── leads/route.ts
│       ├── calculators/route.ts
│       └── agents/route.ts
├── components/
├── lib/
│   ├── sanity.ts
│   ├── supabase.ts
│   └── agents/
├── sanity/
│   └── schemas/
└── messages/                   # i18n translations
    ├── en.json
    ├── hi.json
    ├── gu.json
    └── mr.json
```

---

## 4. DESIGN SYSTEM

### 4.1 Brand Colors

Extracted from logo — primary brand color is **Hot Pink / Magenta**.

```css
/* Primary Brand Colors */
--color-brand-pink:        #E91E8C;   /* Logo pink — primary CTA, headings, accents */
--color-brand-pink-dark:   #C41478;   /* Hover states, dark text on light bg */
--color-brand-pink-light:  #F06BB5;   /* Secondary accents */
--color-brand-pink-tint:   #FDF2F8;   /* Section backgrounds, card backgrounds */
--color-brand-pink-ultra:  #FEF9FC;   /* Page backgrounds, subtle tints */

/* Complementary — Trust & Calm */
--color-trust-navy:        #1A2B4A;   /* Doctor names, medical facts, header bg option */
--color-trust-teal:        #0D9488;   /* Success states, positive stats, badges */

/* Warmth & Hope */
--color-warm-gold:         #D4AF37;   /* Awards, premium badges, star ratings */
--color-warm-cream:        #FFF8F0;   /* Testimonial backgrounds */

/* Neutrals — Readability */
--color-text-primary:      #111827;   /* Body text — near black */
--color-text-secondary:    #374151;   /* Secondary text */
--color-text-muted:        #6B7280;   /* Captions, metadata */
--color-white:             #FFFFFF;
--color-gray-50:           #F9FAFB;
--color-gray-100:          #F3F4F6;
--color-gray-200:          #E5E7EB;
--color-border:            #E5E7EB;

/* Semantic */
--color-success:           #059669;
--color-warning:           #D97706;
--color-error:             #DC2626;
```

### 4.2 Typography

```css
/* Font Families */
--font-heading:  'Plus Jakarta Sans', sans-serif;   /* Headlines — modern, medical, authoritative */
--font-body:     'Inter', sans-serif;               /* Body text — highly readable at all sizes */
--font-accent:   'Cormorant Garamond', serif;       /* Pull quotes, emotional moments, testimonials */

/* Font Scale */
--text-xs:    0.75rem;    /* 12px — metadata, legal */
--text-sm:    0.875rem;   /* 14px — captions, badges */
--text-base:  1rem;       /* 16px — body text baseline */
--text-lg:    1.125rem;   /* 18px — lead text */
--text-xl:    1.25rem;    /* 20px — card headings */
--text-2xl:   1.5rem;     /* 24px — section subheadings */
--text-3xl:   1.875rem;   /* 30px — section headings */
--text-4xl:   2.25rem;    /* 36px — page titles */
--text-5xl:   3rem;       /* 48px — hero headings */
--text-6xl:   3.75rem;    /* 60px — mega headlines */

/* Line Heights */
--leading-tight:  1.25;
--leading-snug:   1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose:  2;
```

### 4.3 Spacing System (8px base grid)

```
4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px, 128px
```

### 4.4 Component Design Principles

**Readability Rules:**
- Minimum font size: 16px for all body text
- Line length: 60-75 characters maximum for paragraph text
- Contrast ratio: minimum 4.5:1 for body text, 3:1 for large text (WCAG AA)
- Never put pink text on white at small sizes — use navy or near-black instead
- Pink (#E91E8C) used for: CTAs, headings at large size, icons, borders, accents

**CTA Hierarchy:**
- **Primary CTA:** Pink background (#E91E8C), white text, rounded-full, bold — "Book Consultation"
- **Secondary CTA:** White background, pink border, pink text — "Learn More"
- **Tertiary CTA:** Text link with pink underline + arrow icon
- **WhatsApp CTA:** Green (#25D366), white text, WhatsApp icon — "Chat on WhatsApp"

**Trust Badge Design:**
- Gold (#D4AF37) border, white background, bold stat in pink, descriptor in navy
- Example: [Gold border card] "30,000+" in pink, "Successful Pregnancies" in navy

### 4.5 Layout System

- **Max content width:** 1280px
- **Content column:** 780px max for readable articles
- **Grid:** 12-column CSS Grid for desktop, 4-column for tablet, 1-column for mobile
- **Breakpoints:**
  - Mobile: 0–767px
  - Tablet: 768–1023px
  - Desktop: 1024–1279px
  - Wide: 1280px+

### 4.6 Mobile-First Requirement

- All designs start from 375px width (iPhone SE)
- Touch targets: minimum 44×44px
- Sticky bottom bar on mobile: "Call Now" + "WhatsApp" + "Book Appointment"
- Phone number must be tappable (tel: link) everywhere it appears

---

## 5. INFORMATION ARCHITECTURE — NEW SITEMAP

### 5.1 Primary Navigation (Flat, Max 2 Levels)

```
Home
About BFI
  ├── Our Story & Legacy
  ├── Why Choose BFI (Suraksha Kavach featured here)
  ├── Success Benchmarks
  ├── Awards & Recognition
  ├── Infrastructure & Labs
  └── Our Team

Treatments
  ├── Advanced IVF Treatments
  │   ├── IVF Treatment
  │   ├── IVF Failure
  │   ├── IUI Treatment
  │   ├── ICSI Treatment
  │   ├── PICSI
  │   ├── IMSI
  │   ├── MACS
  │   ├── Spindle View ICSI
  │   ├── Blastocyst Transfer
  │   └── Laser Assisted Hatching
  │
  ├── Donor Services
  │   ├── Egg Donation
  │   ├── Sperm Donation
  │   └── Embryo Donation
  │
  ├── Male Infertility
  │   ├── Oligospermia (Low Sperm Count)
  │   ├── Asthenospermia (Low Sperm Motility)
  │   ├── Azoospermia (Zero Sperm Count)
  │   ├── Varicocele / Micro Surgery
  │   └── Erectile Dysfunction
  │
  ├── Female Infertility
  │   ├── PCOS
  │   ├── Poor Ovarian Reserve / Low AMH
  │   ├── Ovarian Rejuvenation
  │   ├── Fibroids
  │   ├── Endometriosis
  │   ├── PRP Therapy (Fertility)
  │   ├── Ectopic Pregnancy
  │   └── How Conception Occurs (educational)
  │
  ├── Fertility Preservation
  │   ├── Cryopreservation (overview — all types)
  │   ├── Egg Freezing
  │   ├── Embryo Freezing
  │   └── Sperm Freezing
  │
  ├── IVF Failure & Second Opinion
  │   ├── Understanding IVF Failure
  │   ├── ERA Test
  │   └── Pre-implantation Genetic Testing (PGT)
  │
  ├── Surrogacy
  │
  ├── Maternity Services
  │   ├── 3D/4D Sonography
  │   ├── Painless Delivery
  │   ├── Normal Delivery
  │   ├── Fetal Medicine
  │   ├── High Risk Pregnancy Care
  │   └── Twin Pregnancy Care
  │
  └── Gynaecology
      ├── General Gynaecology
      ├── Vaginal Surgery
      ├── Menopause Clinic
      ├── Female Breast Health
      ├── Urogynaecology
      ├── Oncology
      └── Cosmetic Gynaecology

Doctors
  └── [Individual doctor pages — all 17 doctors]

Locations
  ├── Ahmedabad (hub)
  │   ├── Paldi
  │   ├── Sindhu Bhavan Road
  │   └── Nikol
  ├── Mumbai (hub)
  │   ├── Ghatkopar
  │   ├── Thane
  │   ├── Vile Parle
  │   ├── Borivali
  │   ├── Vashi
  │   └── Dadar
  ├── Vadodara
  ├── Surat
  ├── Bhuj
  ├── Bhavnagar
  ├── Anand
  └── Varanasi

Calculators (All 8 — real results)

International Patients (NEW dedicated page)

Blog / Resources

Contact Us
```

### 5.2 Complete URL Structure

**New URLs (preserve existing URLs where possible for SEO equity):**

```
/                                    → Homepage
/about-bfi/                          → About (restore from 404)
/why-bfi/                            → Why Choose BFI
/awards/                             → Awards
/our-team/                           → Team Hub
/our-team/dr-himanshu-bavishi/       → Doctor profile (existing pattern)
/infrastructure/                     → Lab & Infrastructure
/history/                            → Timeline / History

# ── TREATMENTS (preserve existing URLs — SEO equity) ────────────────
/our-treatments/                                        → Treatment Hub (existing)

# Advanced IVF
/what-is-ivf/                                           → IVF (existing)
/ivf-failure/                                           → IVF Failure (existing)
/intra-uterine-insemination-iui/                        → IUI (existing)
/icsi-treatment-intracytoplasmic-sperm-injection/       → ICSI (existing)
/physiological-intracytoplasmic-sperm-injection-picsi/  → PICSI (existing)
/intracytoplasmic-morphologically-selected-sperm-injection-imsi/ → IMSI (existing)
/magnetic-activated-cell-sorting-macs/                  → MACS (existing)
/spindle-view-icsi/                                     → Spindle View ICSI (existing)
/blastocyst-culture-blastocyst-transfer/                → Blastocyst Transfer (existing)
/laser-assisted-hatching/                               → Laser Hatching (existing)

# Donor Services
/egg-donation/                                          → Egg Donation (existing)
/sperm-donation/                                        → Sperm Donation (existing)
/embryo-donation/                                       → Embryo Donation (existing)

# Male Infertility
/male-infertility/                                      → Male Infertility Hub (existing)
/oligospermia/                                          → Oligospermia (existing)
/asthenospermia/                                        → Asthenospermia (existing)
/azoospermia/                                           → Azoospermia (existing)
/varicocele/                                            → Varicocele (existing)
/erectile-dysfunction/                                  → Erectile Dysfunction (existing)

# Female Infertility
/female-infertility/                                    → Female Infertility Hub (existing)
/pcos/                                                  → PCOS (existing)
/ovarian-reserve/                                       → Poor Ovarian Reserve / Low AMH (existing)
/ovarian-rejuvenation/                                  → Ovarian Rejuvenation (existing)
/fibroids/                                              → Fibroids (existing)
/endometriosis/                                         → Endometriosis (existing)
/prp-platelet-rich-plasma-therapy-in-infertility/       → PRP Therapy (existing)
/ectopic-pregnancy/                                     → Ectopic Pregnancy (existing)
/how-conception-occur/                                  → How Conception Occurs (existing)

# Fertility Preservation
/fertility-preservation/                                → Fertility Preservation Hub (existing)
/cryopreservation-of-embryos/                           → Cryopreservation overview (existing)
/egg-freezing/                                          → Egg Freezing (NEW — currently merged with cryo page)
/embryo-freezing/                                       → Embryo Freezing (NEW — currently merged)
/sperm-freezing/                                        → Sperm Freezing (NEW — currently merged)

# IVF Failure / Second Opinion
/era-test/                                              → ERA Test (existing)
/pre-implantation-genetic-testing-pgt/                  → PGT (existing)

# Surrogacy
/surrogacy/                                             → Surrogacy (existing)

# Maternity
/maternity-services/                                    → Maternity Hub (existing)
/3d-4d-sonography-services-in-ahmedabad/                → 3D/4D Sonography (existing)
/painless-delivery-services-in-ahmedabad/               → Painless Delivery (existing)
/normal-delivery-services-in-ahmedabad/                 → Normal Delivery (existing)
/fetal-medicine-services-in-ahmedabad/                  → Fetal Medicine (existing)
/high-risk-pregnancy-care-in-ahmedabad/                 → High Risk Pregnancy (existing)
/twin-pregnancy-care-in-ahmedabad/                      → Twin Pregnancy (existing)

# Gynaecology (NEW — currently all on one page with anchors)
/gynaecology/                                           → Gynaecology Hub (existing)
/gynaecology/general/                                   → General Gynaecology (NEW — own page)
/gynaecology/vaginal-surgery/                           → Vaginal Surgery (NEW)
/gynaecology/menopause-clinic/                          → Menopause Clinic (NEW)
/gynaecology/breast-health/                             → Female Breast Health (NEW)
/gynaecology/urogynaecology/                            → Urogynaecology (NEW)
/gynaecology/oncology/                                  → Oncology (NEW)
/gynaecology/cosmetic-gynaecology/                      → Cosmetic Gynaecology (NEW)

/ahmedabad/                          → Ahmedabad hub (existing)
/ahmedabad/paldi/                    → NEW
/ahmedabad/sindhu-bhavan-road/       → NEW
/ahmedabad/nikol/                    → NEW
/mumbai/                             → Mumbai hub (existing)
/mumbai/ghatkopar/                   → NEW
/mumbai/thane/                       → NEW
/mumbai/vile-parle/                  → NEW
/mumbai/borivali/                    → NEW
/mumbai/vashi/                       → NEW
/mumbai/dadar/                       → NEW
/vadodara/                           → (existing)
/surat/                              → (existing)
/bhuj/                               → (existing)
/bhavnagar/                          → (existing)
/anand/                              → (existing)
/varanasi/                           → (existing)

/calculators/                        → Calculator Hub (restore 404)
/calculators/ivf-success-rate/       → Real calculator
/calculators/ivf-cost/               → Real calculator
/calculators/ovulation/              → Real calculator
/calculators/fertile-period/         → Real calculator
/calculators/amh-interpreter/        → Real calculator
/calculators/natural-pregnancy/      → Real calculator
/calculators/semen-analysis/         → Real calculator
/calculators/miscarriage-risk/       → Real calculator

/international-patients/             → NEW — critical for UAE/UK/US/SEA patients

/blog/                               → Blog hub
/blog/[slug]/                        → Blog posts

/contact-us/                         → Contact
/privacy-policy/
/terms-and-conditions/
/sitemap/                            → HTML sitemap
```

---

## 6. PAGE-BY-PAGE SPECIFICATIONS

### 6.1 Homepage

**Goal:** Emotional hook → establish authority → convert to consultation booking  
**Target keywords:** "best IVF center India," "IVF clinic Ahmedabad," "fertility hospital India"

**Section Structure (top to bottom):**

1. **Hero Section**
   - Full-viewport height, animated gradient background (soft pink to white)
   - Left: H1 headline — "India's Most Trusted Fertility Institute" (NOT "YOUR PARENTHOOD JOURNEY STARTS HERE" — too generic)
   - Subhead: "30,000+ babies born. 40 years of hope. The Suraksha Kavach guarantee — we don't stop until you hold your baby."
   - Two CTAs: [Book Consultation — Pink] [Watch Success Stories — Secondary]
   - Right: Animated illustration or video reel of happy families (NOT stock photos)
   - Below fold trigger: scroll indicator
   - **Floating Sticky Header:** Logo + Nav + Phone + "Book Now" pill — appears after hero scrolls

2. **Live Trust Ticker (animated)**
   - Horizontal scrolling ticker: "30,000+ Successful Pregnancies | National Fertility Award 5 Years Running | Ranked #1 IVF Chain West India | Zero Severe OHSS in 10+ Years | Class 1000 Labs — 10× Superior Standard | 300+ International Patients Annually"

3. **Stats Section (4 cards, animated counter)**
   - 30,000+ Successful Pregnancies
   - 15 Centers Across India
   - 40 Years of Excellence (since 1984)
   - 1,800+ Five-Star Google Reviews

4. **Suraksha Kavach Section (unique, prominent)**
   - Bold statement: "We don't stop until you're holding your baby."
   - Explain the money-back guarantee / package
   - CTA: Learn About Suraksha Kavach → /why-bfi/

5. **Services Grid (6 cards)**
   - IVF Treatment | IUI | Donor Services | Male Infertility | Female Infertility | Fertility Preservation
   - Each card: icon, name, one-line description, "Learn More" link
   - Hover: card lifts, pink border appears

6. **Patient Journey Steps (3-step)**
   - Step 1: Book Consultation → Step 2: Personalized Treatment Plan → Step 3: Your Baby in Your Arms
   - Simple, emotional, not clinical

7. **Doctors Section (Top 4 promoter doctors)**
   - Dr. Himanshu Bavishi, Dr. Falguni Bavishi, Dr. Parth Bavishi, Dr. Janki Bavishi
   - Photo, name, credentials, specialization, link to profile
   - "Meet All Doctors" CTA

8. **Why BFI — 4 Pillars (animated)**
   - Simple: Making IVF Easy | Safe: Zero Severe OHSS | Smart: Intelligent IVF | Successful: 98% Success Rate
   - Each with icon, heading, 2-sentence explanation

9. **Video Testimonials Section**
   - 3-4 embedded YouTube/video testimonials above the fold
   - VideoObject schema on each
   - Caption includes patient first name, city, treatment type

10. **Featured In Media (logo strip)**
    - Horizontal logo strip of news outlets that have featured BFI

11. **Awards & Recognition**
    - Gold badge cards: National Fertility Award 2021-2025, Economic Times IVF Chain of Year, Bharat Excellence Award, IMA Excellence Award

12. **Calculators Teaser**
    - "Know your fertility health in 2 minutes"
    - 4 calculator previews with "Try Now" links

13. **Locations Map Section**
    - Interactive India map showing 15 pin locations
    - Below: City cards (Ahmedabad, Mumbai, Vadodara, Surat, etc.)
    - Each city card: # of centers, phone, "Get Directions"

14. **Blog Preview (3 latest posts)**
    - Card format: thumbnail, category tag, title, author, date, read time

15. **FAQ Section (8 questions — FAQPage schema)**
    - Accordion format
    - Questions focused on decision-stage concerns

16. **Final CTA Banner**
    - "Your journey to parenthood starts with one call."
    - Pink background, white text
    - [Book Consultation] [Call +91 9712622288] [WhatsApp Us]

17. **Footer**
    - 4 columns: About BFI | Treatments | Locations | Resources
    - Contact info, social links, legal
    - FOGSI certification badge, awards icons

### 6.2 Location Hub Pages (City Level)

**Pattern for all 8 city pages:**

**URL Pattern:** `/[city]/` (e.g., `/ahmedabad/`, `/mumbai/`)

**H1:** "Best IVF Centre in [City] — Bavishi Fertility Institute"  
**Target keyword:** "best IVF center in [City]," "IVF clinic [City]"

**Sections:**
1. Hero with city-specific imagery, H1, CTA
2. Clinic stats specific to city (doctors at this city, years operational)
3. Sub-location cards (e.g., Mumbai shows 6 sub-locations as cards with addresses)
4. Local doctor profiles (only doctors at this city)
5. Treatments available at this city
6. IVF Process specific to this location
7. Local patient testimonials (city-filtered)
8. Google Maps embed for all sub-centers in this city
9. Local Schema — MedicalClinic per sub-location
10. City-specific FAQ (e.g., "How many BFI centers are in Mumbai?")

### 6.3 Sub-Location Pages (Center Level — NEW)

**URL Pattern:** `/[city]/[area]/` (e.g., `/mumbai/ghatkopar/`)

**H1:** "Bavishi Fertility Institute — [Area], [City]"

**Sections:**
1. Hero with exact address, phone number (UNIQUE per center), map embed
2. Center-specific doctor(s)
3. Facilities at this specific center
4. How to reach (directions from nearby landmarks)
5. Operating hours
6. Center-specific reviews
7. Nearby areas served (e.g., Ghatkopar center serves: Ghatkopar, Vikhroli, Chembur, Kurla)

**Schema:** MedicalClinic schema with UNIQUE phone per center, exact GPS coordinates

### 6.4 Doctor Profile Pages

**URL Pattern:** `/best-ivf-doctors/dr-[name]/`

**H1:** "Dr. [Full Name] — [Specialization], [City]"

**Required elements for EEAT:**
- Professional photo (high-quality, white coat)
- Full name, degrees (MBBS, MD, DGO, etc.)
- Specialization
- Years of experience
- Medical college(s) attended
- Training completed (India and abroad)
- Publications (if any)
- Awards received
- Number of IVF cycles performed (if available)
- Patient success stories (attributed quotes)
- Videos of doctor explaining procedures
- PersonSchema JSON-LD with all credentials
- "Book Appointment with Dr. [Name]" — prominent CTA

### 6.5 Treatment Pages

**Pattern for all treatment pages:**

**Content Requirements (min 2,500 words each):**
1. What is [treatment]? (educational)
2. Who needs it? (patient qualification)
3. The process step-by-step (numbered list)
4. Success rates at BFI (with age-group breakdown)
5. Cost at BFI (transparent pricing range)
6. Why BFI for this treatment?
7. Patient success story (attributed)
8. Doctor recommendation (which BFI doctor specializes)
9. External medical references (PubMed, FOGSI, ICMR)
10. FAQ section (minimum 8 questions — FAQPage schema)

**Schema:** MedicalProcedure, FAQPage, BreadcrumbList, Article

### 6.6 International Patients Page (NEW)

**URL:** `/international-patients/`  
**H1:** "IVF Treatment in India for International Patients — Bavishi Fertility Institute"

**Content:**
- Why India for IVF (cost comparison: UK £10,000-£15,000 vs India ₹1-2.5L)
- Why BFI specifically for international patients
- 300+ international patients stat
- Countries we serve (UAE, UK, USA, Canada, Southeast Asia, Africa)
- End-to-end support: consultation → travel → treatment → follow-up
- Visa assistance information
- Accommodation recommendations near centers
- Telemedicine option (pre-arrival consultations)
- International patient coordinator contact
- Currency: show prices in USD, GBP, AED alongside INR
- Testimonials from international patients
- FAQ: "Can I do consultations online?", "How long do I need to stay?", etc.
- hreflang: en-GB, en-US, en-AE, en-AU

### 6.7 Calculators Hub Page

**URL:** `/calculators/`  
**H1:** "Free Fertility Calculators — Know Your IVF Chances"

8 calculator cards with descriptions, expected output, and CTA to use each.

---

## 7. CONTENT STRATEGY — YMYL, AEO, GEO, EEAT

### 7.1 YMYL (Your Money Your Life) Requirements

Google treats fertility/medical content as YMYL — highest scrutiny. Every page must:

- [ ] Named, credentialed author (doctor name + degrees + experience)
- [ ] Medical review date (published + last reviewed date)
- [ ] External citations from: PubMed, FOGSI, ICMR, WHO, ESHRE
- [ ] Medical disclaimer on all health claim pages
- [ ] No absolute success rate claims without caveat (e.g., "Success rates vary by age, diagnosis, and individual factors")
- [ ] Author bio box on every blog post and treatment page
- [ ] Organization credibility section (FOGSI certification, awards)

### 7.2 EEAT (Experience, Expertise, Authoritativeness, Trustworthiness)

**Experience signals:**
- Patient testimonials with full name, city, treatment type
- Doctor bios with "12+ years performing IVF"
- "Since 1984" heritage prominently stated
- Specific numbers: "performed 5,000+ ICSI cycles"

**Expertise signals:**
- All medical content authored by named BFI doctors
- Credentials displayed (MBBS, MD, DGO, etc.)
- Publications and research attributed to BFI doctors
- "Trained at [institution]" for each doctor
- Dr. Parth Bavishi book: "Your Miracle in Making" — cite everywhere

**Authoritativeness signals:**
- FOGSI Certified Training Center — prominent badge
- National Fertility Award 2021-2025 — badge on every page footer
- Economic Times recognition
- External links FROM authoritative medical sites (build via PR)
- Media coverage section (Times of India, etc.)

**Trustworthiness signals:**
- Suraksha Kavach — money-back guarantee
- "Your eggs, your sperm guaranteed" — explicit ethics statement
- Double-witnessing protocol for genetic material
- Transparent pricing on all pages
- Real Google reviews embedded (Google Reviews widget)
- SSL, privacy policy, HIPAA-compliant (for international patients: mention data protection)
- WhatsApp as immediate trust-builder (real person available)

### 7.3 AEO (Answer Engine Optimization)

Optimize all content to be the direct answer when someone asks a voice assistant or AI:

**Techniques:**
- Every H2 should be phrased as a question or direct answer trigger
- First paragraph under each H2 should start with the direct answer (inverted pyramid)
- Use "What is...", "How does...", "When should..." heading formats
- FAQPage schema on every page with minimum 6 questions
- Keep FAQ answers under 50 words for voice search optimization
- Structured comparison tables (IUI vs IVF, fresh vs frozen, etc.)
- "In summary:" boxes at end of each major section

**AEO FAQ examples for homepage:**
- "What is the success rate of IVF at Bavishi Fertility Institute?"
- "How much does IVF cost at BFI?"
- "Which is the best IVF clinic in Ahmedabad?"
- "Does BFI offer a money-back guarantee for IVF?"
- "How many IVF babies has BFI delivered?"

### 7.4 GEO (Generative Engine Optimization) — for AI Citations

For Claude, ChatGPT, Gemini, Perplexity to cite BFI as authoritative:

**Content structure:**
- Use entity-rich, factual language: "Bavishi Fertility Institute, founded in 1984 in Ahmedabad, India, is a multi-center fertility clinic network with 15 locations across 8 Indian cities..."
- State all statistics with verifiable context
- Include "historical firsts": "BFI performed India's first frozen egg live birth and India's first international surrogacy"
- Create a comprehensive "About BFI" page that reads like a Wikipedia-quality entity summary
- Use defined lists for awards, achievements, locations
- Create a `/press-kit/` or `/about-bfi/facts/` page with all key facts in a scannable format
- Include Doctor bios with structured information AI can parse easily

**AI-citation-ready content blocks (use on all major pages):**
```
ABOUT: Bavishi Fertility Institute (BFI) is India's leading fertility clinic chain, 
operating since 1984 with 15 centers across 8 Indian cities. BFI has achieved 30,000+ 
successful IVF pregnancies, holds the National Fertility Award for five consecutive years 
(2021–2025), and is FOGSI-certified. BFI pioneered IVF in India (1998), performed India's 
first frozen egg live birth, and India's first international surrogacy.
```

---

## 8. LOCAL SEO STRATEGY

### 8.1 Google Business Profile (GBP) Requirements

Every sub-location needs its own Google Business Profile:

| Center | GBP Name | Phone | Category |
|--------|----------|-------|----------|
| Ahmedabad — Paldi | Bavishi Fertility Institute Paldi | [Unique phone] | Fertility clinic |
| Ahmedabad — Sindhu Bhavan | Bavishi Fertility Institute Sindhu Bhavan | [Unique phone] | Fertility clinic |
| Ahmedabad — Nikol | Bavishi Fertility Institute Nikol | 9227114040 | Fertility clinic |
| Mumbai — Ghatkopar | Bavishi Fertility Institute Ghatkopar | 9328190146 | Fertility clinic |
| Mumbai — Thane | Bavishi Fertility Institute Thane | 9167204018 | Fertility clinic |
| Mumbai — Vile Parle | Bavishi Fertility Institute Vile Parle | 9167204019 | Fertility clinic |
| Mumbai — Borivali | Bavishi Fertility Institute Borivali | 9167204019 | Fertility clinic |
| Mumbai — Vashi | Bavishi Fertility Institute Vashi | 9687004268 | Fertility clinic |
| Mumbai — Dadar | Bavishi Fertility Institute Dadar | 09328190146 | Fertility clinic |
| Vadodara | Bavishi Fertility Institute Vadodara | 7575099898 | Fertility clinic |
| Surat | Bavishi Fertility Institute Surat | 9879572247 | Fertility clinic |
| Bhuj | Bavishi Fertility Institute Bhuj | 9687188550 | Fertility clinic |
| Mumbai — All | ... | ... | ... |
| Bhavnagar | Bavishi Fertility Institute Bhavnagar | 7069314040 | Fertility clinic |
| Anand | Bavishi Fertility Institute Anand | 7069034565 | Fertility clinic |
| Varanasi | Bavishi Fertility Institute Varanasi | 9506081979 | Fertility clinic |

**GBP Checklist per location:**
- [ ] Unique phone number
- [ ] Exact address with pin code
- [ ] GPS coordinates verified
- [ ] Hours of operation (include 24/7 emergency if applicable)
- [ ] Services listed (IVF, IUI, ICSI, etc.)
- [ ] Photos: exterior, interior, lab, doctors, team (min 15 photos)
- [ ] Posts: weekly updates (events, tips, patient stories)
- [ ] Q&A: seed 10 common questions with answers
- [ ] Reviews: active response strategy (respond to all within 24h)

### 8.2 NAP Consistency

**Standard NAP format (use consistently across ALL digital properties):**

```
Name: Bavishi Fertility Institute
Phone: [Center-specific phone]
Address: [Full address], [City] - [PIN code], Gujarat/Maharashtra/UP, India
```

**Do NOT:** Mix different phone numbers for the same center. Use only the center-specific phone everywhere that center appears.

### 8.3 Local Content Strategy Per City

For every city, create:
1. **City hub page** (`/[city]/`) — targets "IVF center in [city]"
2. **Area-level pages** for each center — targets "IVF clinic in [area], [city]"
3. **City-specific blog content** (min 2 posts per city) — e.g., "IVF Cost in Ahmedabad 2026," "Best IVF Doctors in Mumbai"
4. **Local FAQ schema** — "Which areas does BFI Ghatkopar serve?"

### 8.4 Local Schema Per Sub-Location

Each sub-location page needs:
```json
{
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "name": "Bavishi Fertility Institute — Ghatkopar",
  "url": "https://ivfclinic.com/mumbai/ghatkopar/",
  "telephone": "+919328190146",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "2nd Floor, Vallabh Vihar CHS, Mahatma Gandhi Rd",
    "addressLocality": "Ghatkopar East",
    "addressRegion": "Mumbai, Maharashtra",
    "postalCode": "[ZIP]",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "[GPS lat]",
    "longitude": "[GPS lng]"
  },
  "openingHoursSpecification": [...],
  "medicalSpecialty": ["Fertility", "Obstetrics", "Gynecology"],
  "hasMap": "https://maps.google.com/?q=...",
  "parentOrganization": {
    "@type": "MedicalOrganization",
    "name": "Bavishi Fertility Institute"
  }
}
```

---

## 9. INTERNATIONAL SEO & MULTILINGUAL

### 9.1 Language Strategy

| Language | Target Audience | Pages to Translate |
|----------|----------------|-------------------|
| English (en-IN) | Primary — all India + International | All pages |
| English (en-GB) | UK patients | International page + key treatment pages |
| English (en-US) | US/Canada patients | International page + key treatment pages |
| English (en-AE) | UAE/Gulf NRI patients | International page + key treatment pages |
| Gujarati (gu) | Ahmedabad, Vadodara, Surat, Bhuj, Bhavnagar, Anand patients | Location pages + top treatment pages |
| Hindi (hi) | Varanasi patients + North India | Location pages + top treatment pages |
| Marathi (mr) | Mumbai patients | Mumbai location pages + top treatment pages |

### 9.2 hreflang Implementation

```html
<!-- On all pages -->
<link rel="alternate" hreflang="en-in" href="https://ivfclinic.com/treatments/" />
<link rel="alternate" hreflang="en-gb" href="https://ivfclinic.com/en-gb/treatments/" />
<link rel="alternate" hreflang="en-us" href="https://ivfclinic.com/en-us/treatments/" />
<link rel="alternate" hreflang="en-ae" href="https://ivfclinic.com/en-ae/treatments/" />
<link rel="alternate" hreflang="gu" href="https://ivfclinic.com/gu/treatments/" />
<link rel="alternate" hreflang="hi" href="https://ivfclinic.com/hi/treatments/" />
<link rel="alternate" hreflang="mr" href="https://ivfclinic.com/mr/treatments/" />
<link rel="alternate" hreflang="x-default" href="https://ivfclinic.com/treatments/" />
```

### 9.3 Geo-Targeted Content Variations

**International patient pricing page:** Show costs in multiple currencies:
- INR (primary)
- USD: note approx 75-80x INR conversion
- GBP: note approx 106-110x INR conversion
- AED: note approx 22-23x INR conversion

**Comparison content for international patients:**
- "IVF in India vs UK: Same quality, 5x lower cost"
- "IVF in India vs UAE: World-class embryology labs, fraction of the price"

---

## 10. SCHEMA MARKUP STRATEGY

### 10.1 Schema Types Per Page Type

| Page Type | Required Schema |
|-----------|----------------|
| Homepage | Organization, MedicalOrganization, SiteNavigationElement, FAQPage |
| City Hub Page | LocalBusiness, MedicalClinic, FAQPage, BreadcrumbList |
| Sub-Location Page | MedicalClinic (individual), LocalBusiness, BreadcrumbList |
| Doctor Profile | Person, MedicalOrganization, BreadcrumbList |
| Treatment Page | MedicalProcedure, FAQPage, Article, BreadcrumbList |
| Blog Post | Article, FAQPage (if FAQ section), BreadcrumbList, Person (author) |
| Calculator Page | WebApplication, FAQPage |
| International Patient Page | MedicalOrganization, FAQPage, BreadcrumbList |
| Contact Page | LocalBusiness (all locations), BreadcrumbList |
| About Page | AboutPage, Organization, FAQPage |

### 10.2 Organization Schema (Sitewide)

```json
{
  "@context": "https://schema.org",
  "@type": ["MedicalOrganization", "MedicalClinic"],
  "@id": "https://ivfclinic.com/#organization",
  "name": "Bavishi Fertility Institute",
  "alternateName": "BFI",
  "url": "https://ivfclinic.com",
  "logo": "https://ivfclinic.com/logo.png",
  "telephone": "+919712622288",
  "email": "drbavishi@ivfclinic.com",
  "foundingDate": "1984",
  "numberOfEmployees": "200+",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Paldi Cross Roads, Opp. Manjulal Municipal Garden",
    "addressLocality": "Ahmedabad",
    "addressRegion": "Gujarat",
    "postalCode": "380007",
    "addressCountry": "IN"
  },
  "medicalSpecialty": ["Fertility", "ReproductiveMedicine", "Obstetrics", "Gynecology"],
  "award": [
    "National Fertility Award 2021",
    "National Fertility Award 2022",
    "National Fertility Award 2023",
    "National Fertility Award 2024",
    "National Fertility Award 2025",
    "Economic Times IVF Chain of the Year — West",
    "Bharat Excellence Award for IVF and Infertility Care"
  ],
  "sameAs": [
    "https://www.instagram.com/bavishifertility/",
    "https://www.facebook.com/BavishiFertilityInstitute/",
    "https://www.youtube.com/@BavishiFertilityInstitute",
    "https://www.linkedin.com/company/bavishi-fertility-institute/"
  ]
}
```

---

## 11. CALCULATOR SPECIFICATIONS

### 11.1 Design Principle

**All 8 calculators must show REAL results immediately** — no gate before result. After result is shown, a soft lead-capture CTA appears: "Get a personalized consultation based on your results."

Calculator → Result → Lead Capture (optional, not mandatory)

### 11.2 Calculator 1: IVF Success Rate Calculator

**Inputs:**
- Age group: Under 30 / 30-34 / 35-37 / 38-40 / 41-42 / 43+
- Primary diagnosis: PCOS / Male Factor / Endometriosis / Diminished Ovarian Reserve / Unexplained / Uterine Factor / Recurrent Miscarriage / Multiple Factors
- Previous IVF attempts: First time / 1 previous / 2-3 previous / 3+
- Prior successful pregnancy: Yes / No
- Transfer type: Day 5 Blastocyst / Day 3 Cleavage / Unknown
- Egg source: Own eggs / Donor eggs

**Calculation Logic:**
```
Base rate by age:
- Under 30: 55%
- 30-34: 50%
- 35-37: 42%
- 38-40: 30%
- 41-42: 20%
- 43+: 10-15% (donor eggs recommended)

Modifiers (additive/multiplicative):
- Donor eggs: +15-20%
- Day 5 blastocyst: +8%
- Prior success: +5%
- PCOS: -0% to +5% (generally good responders)
- Diminished Ovarian Reserve: -10 to -15%
- Endometriosis: -5%
- Male factor only: +0%
- 3+ failed cycles: -5%

Final output: Range (e.g., "Your estimated success rate: 42-50%")
```

**Result Display:**
- Visual gauge/arc meter showing percentage
- 3-5 sentences explaining the key factors
- "What improves your chances" section (personalized tips based on inputs)
- BFI-specific stat: "At BFI, patients in your profile achieved [X]% success"
- Soft CTA: "Book a consultation to discuss your specific case with Dr. [Name]"

### 11.3 Calculator 2: IVF Cost Calculator

**Inputs:**
- City center (dropdown — all 15 centers)
- Treatment type: IVF / ICSI / IUI / FET / Donor Egg IVF / PGT-A
- Number of cycles expected: 1 / 2 / 3
- Include Suraksha Kavach package: Yes / No

**Output:**
- Estimated cost range in INR
- Equivalent in USD, GBP, AED (toggle)
- Breakdown: Medications / Lab fees / Doctor fees / Embryo storage
- EMI option illustration (6-month, 12-month breakdown)
- Cost comparison vs. other major cities
- Soft CTA after result

### 11.4 Calculator 3: Ovulation Calculator

**Inputs:**
- First day of last period (date picker)
- Average cycle length (days: 21-35)

**Output:**
- Ovulation date
- Fertile window (5 days)
- Next period expected date
- Visual calendar showing fertile days highlighted in pink

### 11.5 Calculator 4: Fertile Period Calculator

**Inputs:**
- First day of last period
- Cycle length
- Luteal phase length (default 14, adjustable)

**Output:**
- Optimal conception window
- "Try on these dates" calendar
- Download calendar option (ICS file)

### 11.6 Calculator 5: AMH Level Interpreter

**Inputs:**
- AMH value (numerical input, with unit: ng/mL or pmol/L toggle)
- Age

**Output:**
- Category: Very Low / Low / Normal Low / Normal / Normal High / High
- What this means for fertility (age-adjusted)
- Recommended next steps
- "Book AMH test at BFI" CTA if they don't know their value

### 11.7 Calculator 6: Natural Pregnancy Calculator

**Inputs:**
- Age (woman)
- Duration trying (months)
- Cycle regularity: Regular / Irregular / Unknown
- Known fertility issue: None / PCOS / Endometriosis / Male factor / Other

**Output:**
- Probability of natural conception in next 6 months
- Recommendation: Continue trying / See doctor in 3 months / See doctor now
- When to see a specialist (evidence-based thresholds)

### 11.8 Calculator 7: Semen Analysis Interpreter

**Inputs:**
- Count (million/mL)
- Motility (%)
- Morphology (%)
- Volume (mL)

**Output:**
- WHO 2021 reference comparison for each parameter
- Overall assessment: Normal / Mild / Moderate / Severe Male Factor
- Recommended treatment: IUI / IVF / ICSI / TESA
- "Book semen analysis at BFI" CTA

### 11.9 Calculator 8: Miscarriage Risk Calculator

**Inputs:**
- Age
- Number of previous miscarriages
- Previous live births
- Gestational age of losses
- Known cause (if any): Chromosomal / Anatomical / Immunological / Unknown

**Output:**
- Risk categorization
- Evidence-based information about causes
- Recommended investigations
- PGT-A / ERA test recommendation when appropriate
- Medical disclaimer (prominent)

---

## 12. SEO AGENT ARCHITECTURE — CLAUDE API

### 12.1 Overview

A system of 6 specialized AI agents powered by Claude API that run automatically to maintain and improve SEO performance. All agents log findings to Cloudflare D1 and send summaries to a designated email (Resend) or Slack webhook.

### 12.2 Agent 1: On-Page SEO Agent

**Trigger:** Weekly scheduled run + on new content published  
**Model:** claude-sonnet-4-6  
**Capabilities:**
- Reads all Sanity content via GROQ queries
- Checks meta title and description length, keyword presence
- Scores each page against target keywords
- Generates suggested improvements
- Can auto-apply improvements with human approval workflow (Sanity draft → human approves)

**Tool calls it makes:**
- `sanity_fetch(query)` — reads content
- `sanity_patch(id, changes)` — updates meta fields
- `gsc_get_queries(page_url)` — fetches GSC data for what's driving traffic

### 12.3 Agent 2: Content Refresh Agent

**Trigger:** Monthly, or when GSC shows ranking drop >5 positions  
**Model:** claude-opus-4-8 (higher capability for content)  
**Capabilities:**
- Identifies pages losing ranking from GSC data
- Reads current content
- Identifies what top-ranking competitor content has that BFI's doesn't
- Generates updated sections with new statistics, FAQs, and external citations
- Creates Sanity draft for human review

### 12.4 Agent 3: Schema Validator Agent

**Trigger:** Daily  
**Model:** claude-haiku-4-5 (fast, cheap)  
**Capabilities:**
- Fetches all live URLs from sitemap
- Validates structured data using Google's Rich Results Test API
- Flags any schema errors or warnings
- Logs issues to Cloudflare D1 for weekly review
- Auto-fixes common schema errors (missing fields, wrong types)

### 12.5 Agent 4: Internal Linking Agent

**Trigger:** Weekly  
**Model:** claude-sonnet-4-6  
**Capabilities:**
- Reads all blog posts and treatment pages
- Identifies orphan pages (no internal links pointing to them)
- Suggests internal link additions (from which page, which anchor text, to which URL)
- Creates Sanity patches for human approval

### 12.6 Agent 5: GSC Monitor Agent

**Trigger:** Daily  
**Model:** claude-haiku-4-5  
**Capabilities:**
- Pulls GSC data via Google Search Console API
- Identifies: ranking drops, CTR drops, new ranking keywords, cannibalization
- Sends daily digest email with top 5 opportunities
- Flags urgent issues (dropped out of top 10) for immediate attention
- Tracks performance of Ahmedabad and Mumbai pages specifically

### 12.7 Agent 6: GA4 Insights Agent

**Trigger:** Weekly  
**Model:** claude-sonnet-4-6  
**Capabilities:**
- Pulls GA4 data via Google Analytics Data API
- Identifies: top converting pages, high-exit pages, calculator completion rates, lead form conversion rates
- Generates conversion rate optimization (CRO) recommendations
- Tracks lead count vs. 100/day target
- Sends weekly performance report

### 12.8 Agent Implementation

```typescript
// /lib/agents/on-page-seo-agent.ts
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@sanity/client";
import { supabase } from "@/lib/supabase";

export async function runOnPageSEOAgent() {
  const client = new Anthropic();
  const sanity = createClient({ /* config */ });

  // Define tools the agent can use
  const tools = [
    {
      name: "fetch_sanity_content",
      description: "Fetch pages from Sanity CMS to analyze SEO",
      input_schema: {
        type: "object",
        properties: {
          type: { type: "string", description: "Sanity document type" },
          limit: { type: "number" }
        }
      }
    },
    {
      name: "update_meta_fields",
      description: "Update SEO meta title and description in Sanity",
      input_schema: {
        type: "object",
        properties: {
          documentId: { type: "string" },
          metaTitle: { type: "string" },
          metaDescription: { type: "string" }
        }
      }
    },
    {
      name: "fetch_gsc_data",
      description: "Get Google Search Console query data for a URL",
      input_schema: {
        type: "object",
        properties: { url: { type: "string" } }
      }
    }
  ];

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    tools,
    messages: [{
      role: "user",
      content: `You are an expert SEO agent for Bavishi Fertility Institute (ivfclinic.com). 
      Analyze the current on-page SEO of all treatment and location pages.
      Check: meta titles (50-60 chars), meta descriptions (150-160 chars), H1 keyword alignment, 
      missing schema, and thin content (under 1000 words).
      Generate specific improvements for the top 5 pages needing attention.
      Log all findings.`
    }]
  });

  // Handle tool calls and log to Cloudflare D1
  // (In production, env.DB is the D1 binding passed to the Worker)
  // await db.prepare("INSERT INTO seo_agent_logs (agent, run_date, findings) VALUES (?, ?, ?)")
  //   .bind("on-page-seo", new Date().toISOString(), JSON.stringify(response))
  //   .run();
}
```

### 12.9 Agent Automation Schedule

| Agent | Frequency | Estimated Monthly Cost |
|-------|-----------|----------------------|
| Schema Validator | Daily | ~$15-20 |
| GSC Monitor | Daily | ~$10-15 |
| On-Page SEO | Weekly | ~$20-30 |
| Internal Linking | Weekly | ~$15-25 |
| Content Refresh | Monthly | ~$30-50 |
| GA4 Insights | Weekly | ~$15-25 |
| **Total** | | **~$105-165/month** |

---

## 13. BACKEND & CRM SPECIFICATIONS

### 13.0 Full-Site CMS Editability (Sanity Studio)

**REQUIREMENT: Every single element of the website must be editable from the Sanity Studio admin panel — no hardcoded content anywhere in the codebase.**

Access: `admin.ivfclinic.com` (Sanity Studio embedded in Next.js app)

**Complete list of what must be editable from Sanity:**

**Global / Site-wide:**
- [ ] Site name, tagline
- [ ] Primary phone number (sitewide)
- [ ] WhatsApp number
- [ ] Email address
- [ ] Social media links (all 7 platforms)
- [ ] Logo (uploadable image)
- [ ] Brand colors (primary, accent, background) — stored in a "Settings" singleton document
- [ ] Cookie consent text
- [ ] Announcement bar (show/hide toggle, text, link)
- [ ] Footer columns and links
- [ ] Legal pages (Privacy Policy, Terms) — full rich text

**Navigation / Menu:**
- [ ] Primary navigation links (add/remove/reorder)
- [ ] Sub-menu items (add/remove/reorder)
- [ ] Header CTA button text and link
- [ ] Mobile menu layout

**Homepage Sections (each section is a separate document in Sanity):**
- [ ] Hero: headline, subheadline, CTA text + link, background image/video, overlay opacity
- [ ] Trust ticker: all ticker items (text strings, add/remove/reorder)
- [ ] Stats: each stat (number, label, icon)
- [ ] Suraksha Kavach section: headline, body, CTA, image
- [ ] Services grid: each card (icon, title, description, link)
- [ ] Patient journey steps: each step (number, title, description, image)
- [ ] Doctors section: which doctors to show, order
- [ ] Why BFI pillars: each pillar (icon, title, description)
- [ ] Video testimonials: which YouTube videos to embed (video ID + title)
- [ ] Media logos: each logo (image, alt text, optional link)
- [ ] Awards section: which awards to show (pull from Awards document)
- [ ] Calculator teaser: which calculators to feature
- [ ] Locations map: show/hide, featured cities
- [ ] Blog preview: how many posts, category filter
- [ ] FAQ section: which FAQs to show on homepage
- [ ] Final CTA: headline, subheadline, CTA text + link, background color

**Content Types (all fully editable):**
- [ ] Blog Posts: title, slug, author (doctor reference), publish date, review date, hero image, all body content (rich text with custom blocks: infographic block, pull quote block, stat box block, comparison table block, embedded calculator block, FAQ block), SEO meta title, SEO meta description, canonical URL, hreflang, FAQs, related posts, categories, tags
- [ ] Treatment Pages: title, slug, category, H1, meta, hero image, all content sections, FAQs, related treatments, schema type, author reference
- [ ] Doctor Profiles: name, designation, degrees, specialization, years of experience, training institutions, publications, awards, languages, consultation schedules, consultation fee, photo, video embed, centers served
- [ ] Location Pages: city name, area/sub-location name, full address, phone (UNIQUE per center), GPS coordinates, operating hours, Google Maps embed URL, Google Place ID, which doctors consult here, services available, photos, testimonials
- [ ] Testimonials: patient name, city, treatment type, quote text, video URL (optional), display on which pages
- [ ] Awards: award name, awarding body, year, description, badge image
- [ ] FAQs: question, answer, category (for filtering by page)
- [ ] Calculators: calculator name, description, input field labels, output text templates
- [ ] Events: event name, date, location, description, registration link
- [ ] Media Coverage: outlet name, headline, URL, date, logo
- [ ] SEO Settings per page: meta title, meta description, OG image, canonical URL, noindex toggle, schema template selection

**Admin-only Sections:**
- [ ] Redirect Manager: add/remove 301 redirects (from path → to path)
- [ ] SEO Agent Log Viewer: read-only view of agent findings
- [ ] Lead CRM: view/filter/update leads (read from Cloudflare D1 via API)
- [ ] Site Settings: all global settings in one place

**Sanity Schema Design Principles:**
- Every section uses a `_type` field for conditional rendering
- Use `portableText` for all long-form content (enables custom blocks)
- Images use `@sanity/image-url` for automatic WebP conversion and responsive sizing
- Use references (not inline objects) for doctors, awards, FAQs — enables reuse
- All text fields that appear in SEO have `validation: Rule => Rule.max(160)` constraints
- Order/reorder all list types with drag-and-drop (use `orderRankField`)

### 13.1 Lead CRM — Cloudflare D1 Schema

(See §3.1a for full D1 SQL schema — D1 is the database for all leads on Cloudflare.)

### 13.2 Lead API Route (Cloudflare Workers / Next.js Edge)

```typescript
// /app/api/leads/route.ts
export const runtime = 'edge'; // Required for Cloudflare Workers

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendLeadNotification } from "@/lib/notifications";
import { triggerWhatsAppMessage } from "@/lib/whatsapp";

const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().min(10),
  center_preference: z.string().optional(),
  treatment_interest: z.string().optional(),
  doctor_preference: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
  page_url: z.string().optional(),
  calculator_used: z.string().optional(),
  locale: z.string().default('en'),
  is_international: z.boolean().default(false),
  country: z.string().optional(),
  ga_client_id: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const validated = leadSchema.parse(body);
  
  // Access Cloudflare D1 via env binding
  // @ts-ignore — Cloudflare env bindings
  const db = (req as any).env?.DB;
  
  const id = crypto.randomUUID();
  await db.prepare(`
    INSERT INTO leads (id, name, email, phone, center_preference, treatment_interest,
      doctor_preference, message, source, page_url, calculator_used, locale, is_international, country)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, validated.name, validated.email, validated.phone,
    validated.center_preference, validated.treatment_interest,
    validated.doctor_preference, validated.message,
    validated.source, validated.page_url, validated.calculator_used,
    validated.locale, validated.is_international ? 1 : 0, validated.country
  ).run();
  
  // Trigger WhatsApp auto-message
  await triggerWhatsAppMessage(validated.phone, {
    name: validated.name,
    center: validated.center_preference,
    treatment: validated.treatment_interest
  });
  
  // Send internal notification email to center coordinator
  await sendLeadNotification({ id, ...validated });
  
  // Push event to GA4 Measurement Protocol
  if (validated.ga_client_id) {
    await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA4_ID}&api_secret=${process.env.GA4_SECRET}`, {
      method: "POST",
      body: JSON.stringify({
        client_id: validated.ga_client_id,
        events: [{ name: "generate_lead", params: { source: validated.source, center: validated.center_preference } }]
      })
    });
  }
  
  return NextResponse.json({ success: true, id });
}
```

### 13.3 WhatsApp Auto-Response Template

**Message sent within 60 seconds of lead submission:**

```
Hello [Name]! 👋

Thank you for reaching out to Bavishi Fertility Institute.

Your consultation request has been received for our [City] center.

Our team will call you within 2 hours (Mon-Sat, 9am-7pm).

For immediate assistance:
📞 Call: [Center phone]
💬 WhatsApp: wa.me/919712622288

Your journey to parenthood begins here. 🌸

— Team BFI
```

### 13.4 Lead Routing Logic

```
IF center_preference == "Ahmedabad" → notify ahmedabad-team@ivfclinic.com
IF center_preference == "Mumbai" → notify mumbai-team@ivfclinic.com
IF is_international == true → notify international@ivfclinic.com
ALL leads → notify admin@ivfclinic.com
```

### 13.5 Admin Dashboard Requirements

Simple CRM admin at `/admin/`:
- Lead list view with filters (status, city, date, treatment)
- Lead detail view with all fields
- Status update (new → contacted → consultation booked → patient → lost)
- Notes field (editable)
- Export to CSV
- Daily/weekly lead count vs. 100/day target (visual chart)
- Source breakdown pie chart

---

## 14. GA4 & GSC SETUP

### 14.1 GA4 Events to Track

```javascript
// Form submission
gtag('event', 'generate_lead', {
  event_category: 'conversion',
  form_type: 'consultation_booking',
  center: 'ahmedabad_paldi',
  treatment: 'ivf',
  source_page: '/ahmedabad/'
});

// Calculator used
gtag('event', 'calculator_completed', {
  calculator_name: 'ivf_success_rate',
  result_percentage: 45,
  age_group: '35-37'
});

// WhatsApp click
gtag('event', 'whatsapp_click', {
  page_url: window.location.href
});

// Phone number click
gtag('event', 'phone_click', {
  phone_number: '+919712622288',
  center: 'ahmedabad'
});

// Doctor profile view
gtag('event', 'doctor_view', {
  doctor_name: 'Dr. Parth Bavishi'
});

// Video testimonial play
gtag('event', 'video_start', {
  video_title: 'Patient Success Story',
  video_url: 'youtube_url'
});
```

### 14.2 GA4 Conversions (Goals)

Mark as conversions:
1. `generate_lead` — Primary conversion
2. `phone_click` — Secondary conversion
3. `whatsapp_click` — Secondary conversion
4. `appointment_booked` — Primary conversion

### 14.3 GA4 Custom Dimensions

```
city_center: string      — which center page user converted from
treatment_interest: string — IVF, IUI, ICSI, etc.
patient_type: string     — new, returning, international
locale: string           — en, hi, gu, mr
calculator_entry: boolean — did user use calculator before converting
```

---

## 15. BLOG REWRITE STRATEGY

### 15.0 Default Author for All Blog Posts

**All blog posts default to: Dr. Parth Bavishi**

- **Author name:** Dr. Parth Bavishi, MD (Obs & Gyn)
- **Author title:** Co-Director, Bavishi Fertility Institute | IVF Specialist
- **Author URL:** `/best-ivf-doctors/dr-parth-bavishi/`
- **Author photo:** High-quality portrait (same as profile page)
- **Author credentials shown:** "MD, OB-GYN | 13 years | 10,000+ procedures | Rose of Paracelsus Award (European Medical Association) | Author of 'Your Miracle in Making'"

When a different doctor has deeper expertise on a specific topic (e.g., Dr. Suman Singh for a Mumbai-specific IUI post), that doctor can be assigned as author in Sanity. Otherwise Dr. Parth is the default.

**Author Bio Box (appears at top AND bottom of every blog post):**
```
┌──────────────────────────────────────────────────────────────┐
│  [Photo]  Dr. Parth Bavishi, MD (Obs & Gyn)                  │
│           Co-Director, Bavishi Fertility Institute            │
│           13 years | 10,000+ procedures | Ahmedabad          │
│                                                              │
│  International trained (Diamond Institute NJ, HART Japan).   │
│  Author of "Your Miracle in Making." Specializes in poor     │
│  ovarian reserve and repeated IVF failure cases.             │
│                                                              │
│  [Book Consultation with Dr. Parth →]                        │
└──────────────────────────────────────────────────────────────┘
```

---

### 15.1 Patient Journey Funnel for Blog Content

All blog content must map to a stage in the fertility patient journey:

**Stage 1 — Awareness (TOFU):** "Am I infertile? Should I worry?"
- Titles: "10 Signs You Should See a Fertility Specialist," "What is a Normal Sperm Count?," "PCOS and Pregnancy: What You Need to Know"
- Goal: Get them to BFI website, build awareness of the problem
- CTA: "Try our free fertility assessment" → calculator

**Stage 2 — Consideration (MOFU):** "What treatment do I need?"
- Titles: "IUI vs IVF: Which Treatment is Right for You?," "When Should You Move from IUI to IVF?," "What to Expect in Your First IVF Cycle"
- Goal: Position BFI as the expert guide
- CTA: "Book a consultation with our doctors"

**Stage 3 — Decision (BOFU):** "Which clinic should I choose?"
- Titles: "13 Best IVF Clinics in Mumbai," "Why BFI Patients Have a 98% Success Rate," "What is the Suraksha Kavach Guarantee?"
- Goal: Convert to consultation booking
- CTA: "Book at BFI today — limited slots available"

**Stage 4 — Retention/Community:** For existing patients and DIVYA SANTAN PARIVAR
- Titles: "After IVF: What to Expect in Pregnancy," "IVF Twin Pregnancy: Special Care at BFI"
- Goal: Referrals, community building

### 15.2 Blog Interactivity & Visual Content Standards

**CRITICAL: Blogs must NOT be walls of text.** Every 250-350 words of text must be broken by a visual element. Think magazine-quality layout, not Wikipedia.

**Required Visual Elements per Blog Post:**

**1. Hero Image (top of post)**
- Relevant, warm photography — NOT generic stock (no fake smiling couples holding hands)
- Size: 1200×630px, alt text optimized with keyword
- Caption with relevant info
- If the blog is about PCOS: show a relevant medical diagram OR a real-looking consultation photo

**2. Infographics (1-2 per post minimum)**

Each major process or comparison must become an infographic:

| Blog topic | Infographic idea |
|-----------|-----------------|
| IUI vs IVF | Side-by-side comparison chart with icons |
| IVF Process | Step-by-step visual timeline (6 steps) |
| PCOS and fertility | Symptoms diagram → treatment pathway |
| AMH levels | Visual scale from Very Low to High with color coding |
| Sperm analysis | WHO reference values as visual gauge/meter |
| Embryo development | Day 1→Day 5 blastocyst development timeline |

**Infographic specs:**
- Width: 800px, auto-height
- Brand colors: Pink (#E91E8C) primary, Navy (#1A2B4A) text
- Tool: Create in Canva/Figma and save as SVG or high-res PNG
- Alt text: descriptive (not "infographic")
- Caption: with citation source

**3. Pull Quotes (1 per post)**
```
┌──────────────────────────────────────┐
│                                      │
│  "After 18 years of trying, we      │
│   finally have our baby girl.        │
│   BFI never stopped believing        │
│   in us."                           │
│                                      │
│              — Ramesh Nayak, Surat  │
└──────────────────────────────────────┘
```
Style: Large font (24px), pink left-border, italic, Cormorant Garamond font

**4. Data/Stat Call-Out Boxes**
Highlight every important statistic in a styled box:
```
┌─────────────────────────────────────┐
│  📊  Did You Know?                  │
│                                     │
│  IVF success rates drop from 42%   │
│  at age 35-37 to just 20% at 41-42 │
│  — but BFI's protocols can improve │
│  these odds significantly.          │
│  Source: ESHRE, 2024               │
└─────────────────────────────────────┘
```

**5. Interactive Table of Contents (sticky sidebar or top)**
- Jump links to all H2 sections
- Shows reading progress (scroll indicator)
- Estimated read time (e.g., "8 min read")

**6. Comparison Tables**
For any "A vs B" content, use a properly styled HTML table:

| Feature | IUI | IVF |
|---------|-----|-----|
| Invasiveness | Low | Moderate |
| Cost at BFI | ₹10K-15K | ₹90K-1.75L |
| Success rate (per cycle) | 15-20% | 40-55% |
| Best for | Mild male factor | Multiple/complex issues |

**7. Step-by-Step Numbered Sections**
Processes should use visual numbered steps (not just bullet points):
- Large pink circle with number
- Bold step title
- 2-3 sentence description
- Small illustration or icon

**8. Embedded Calculator (relevant)**
At the bottom of relevant posts, embed the most relevant calculator:
- IVF success rate article → embed IVF Success Rate Calculator
- IUI article → embed IUI success rate or fertile period calculator
- AMH article → embed AMH Level Interpreter

**9. Video Embed (where available)**
- If BFI has a YouTube video on this topic, embed it
- Add transcript (collapsed by default, expandable)
- VideoObject schema for each embed

**10. Social Share Buttons (sticky, left side on desktop)**
- WhatsApp (primary for India audience)
- Facebook
- Twitter/X
- LinkedIn
- Copy link

**Content Layout Template (visual structure per blog post):**

```
[Author byline row: photo + name + date + read time]
[Hero image — full width]
[H1 title]
[Lead paragraph — 2-3 sentences, answers the main question directly]
[Table of contents — jump links]

[H2 Section 1]
[3-4 paragraphs]
[INFOGRAPHIC or COMPARISON TABLE]

[H2 Section 2]
[2-3 paragraphs]
[PULL QUOTE from patient testimonial]
[2-3 paragraphs]

[H2 Section 3]
[STAT CALL-OUT BOX]
[2-3 paragraphs]
[STEP-BY-STEP visual]

[H2 Section N — "How BFI approaches this"]
[BFI-specific content — link to treatment page]

[KEY TAKEAWAYS box — 5 bullet points]

[EMBEDDED CALCULATOR — relevant one]

[FAQ SECTION — accordion, 8+ questions, FAQPage schema]

[RELATED ARTICLES — 3 cards]

[CTA BANNER — city-targeted booking]

[AUTHOR BIO BOX — bottom]
```

### 15.3 Blog Rewrite Requirements

Every existing blog post must be rewritten with:

**YMYL Compliance:**
- [ ] Default author: Dr. Parth Bavishi (or relevant specialist)
- [ ] Author bio box at top AND bottom
- [ ] Publication date + last medical review date
- [ ] Minimum 2 external citations (PubMed, FOGSI, ESHRE, WHO)
- [ ] Medical disclaimer

**SEO Structure:**
- [ ] Target keyword in H1, first 100 words, at least 2 H2s, meta title, meta description
- [ ] Minimum 2,000 words (treatment/guide posts: 3,000+)
- [ ] FAQPage schema with minimum 8 questions
- [ ] Internal links: minimum 5 to relevant treatment/location pages
- [ ] External links: 2-3 to authoritative medical sources
- [ ] Article schema with author, datePublished, dateModified

**Content Structure:**
```
[Author byline: Dr. Name | Reviewed: Date]
[Introduction — answer the main question in first 2 sentences]
[Table of Contents — links to H2 sections]
[Main content sections]
[Key Takeaways — bullet box]
[FAQ Section — minimum 8 Q&As with FAQPage schema]
[Related Calculators — if applicable]
[Author Bio Box]
[Related Posts — 3 cards]
[Consultation CTA Banner — city-targeted if possible]
```

### 15.3 Priority Blog Posts to Create (New)

High-traffic, high-intent topics not yet covered:

**Local SEO Blogs:**
- "IVF Cost in Ahmedabad 2026 — Complete Guide" (Ahmedabad BOFU)
- "Best IVF Doctor in Ahmedabad — BFI Expert Team" (Ahmedabad BOFU)
- "IVF Cost in Mumbai 2026" (Mumbai BOFU)
- "IVF Center Near Ghatkopar, Mumbai" (Ghatkopar hyperlocal)
- "IVF Treatment in Varanasi" (Varanasi awareness)
- "Fertility Clinic in Vadodara" (Vadodara awareness)

**International Patient Blogs:**
- "IVF in India for NRI Patients — Complete Guide 2026"
- "IVF Cost in India vs UK — Is India Worth the Travel?"
- "Fertility Tourism in Ahmedabad — What NRI Patients Need to Know"

**High-Intent Treatment Blogs:**
- "What is the Suraksha Kavach Package — BFI Money Back Guarantee Explained"
- "Class 1000 IVF Lab — Why It Matters for Your Success"
- "Azoospermia Treatment in India — TESA/PESA at BFI"
- "Egg Freezing Cost in India 2026"
- "PRP Ovarian Rejuvenation — Does It Work?"

**AEO / Featured Snippet Targeting:**
- "What is a Good IVF Success Rate?" (featured snippet target)
- "How Many Times Should You Try IVF Before Giving Up?" (high search volume)
- "What Age is Too Late for IVF?" (high search volume)

---

## 16. ANIMATION & INTERACTION DESIGN

### 16.1 Animation Principles

- **Performance first:** All animations must not block LCP or cause CLS
- **Purposeful:** Every animation communicates something (loading, transition, emotion)
- **Subtle for trust:** Medical site — animations should reassure, not distract
- **Framer Motion** for all React animations
- **Intersection Observer** for scroll-triggered animations
- **Reduced motion:** Respect `prefers-reduced-motion` media query (disable all non-essential animations)

### 16.2 Animation Inventory

**Hero Section:**
- Background: Soft animated gradient (CSS, no JS — pink → white → soft pink, 8s loop)
- Headline: Word-by-word fade-up on load (stagger 0.1s per word, Framer Motion)
- CTA buttons: Subtle pulse ring on the primary CTA (CSS animation, 3s loop)
- Hero image: Float animation (translateY ±10px, 4s ease-in-out loop)

**Stats Counter Section:**
- Numbers count up when scrolled into view (0 → final value, 1.5s, easeOut)
- Only trigger once per page load

**Service Cards:**
- On scroll into view: cards fade up with 0.1s stagger between each card
- On hover: card lifts (translateY -4px), shadow deepens, pink accent border appears

**Trust Ticker:**
- Horizontal infinite scroll (CSS marquee animation, pause on hover)

**Doctor Cards:**
- Hover: pink overlay slides up 20%, shows "Book Appointment" button
- Smooth transition: 0.3s ease

**Calculators:**
- Input changes: instant visual feedback (sliders update live)
- Result reveal: slide-down expand animation (0.4s)
- Result number: count-up animation

**Page Transitions:**
- Fade in on route change (Framer Motion AnimatePresence, 0.3s)

**Floating CTAs:**
- Mobile: bottom sticky bar slides up on first scroll
- Desktop: floating WhatsApp button with subtle bounce on load (once)

**Scroll Progress:**
- Thin pink progress bar at top of page on blog posts (CSS)

**Form Success:**
- Confetti animation on successful form submission (canvas-confetti library, 3s)
- Success message: slide-down reveal

### 16.3 Loading States

- Skeleton screens (not spinners) for all async content
- Skeleton color: pink tint (#FDF2F8) with shimmer animation
- LCP elements (hero image, headline) must be server-rendered (no loading state)

---

## 17. GEO — GENERATIVE ENGINE OPTIMIZATION

### 17.1 Getting Cited by Claude, ChatGPT, Gemini, Perplexity

AI systems cite content that is:
1. **Factual and specific** — Named statistics, dates, verified claims
2. **Well-structured** — Clear entity definitions, lists, tables
3. **Authoritative** — Expert authors, institutional credibility
4. **Comprehensive** — Covers the topic fully from multiple angles
5. **Fresh** — Regularly updated content

### 17.2 GEO Content Requirements

**For every major page, include an "About BFI" entity block:**
```
Bavishi Fertility Institute (BFI) is India's largest fertility clinic chain with 15 centers 
across Ahmedabad, Mumbai, Vadodara, Surat, Bhuj, Bhavnagar, Anand, and Varanasi. Founded in 
1984, BFI has performed over 25,000 successful IVF pregnancies, holds the National Fertility 
Award for five consecutive years (2021–2025), and is FOGSI-certified as a fertility training 
center. BFI's Class 1000 embryology laboratories exceed the international Class 10,000 standard. 
The institute has treated 300+ international patients annually and pioneered India's first frozen 
egg live birth and first international surrogacy.
```

**Create a `/about-bfi/facts/` page** with:
- Structured fact list (Year founded, founders, locations, statistics, awards)
- All historical firsts
- Accreditations
- Doctor credentials
- This page targets AI systems parsing "who is BFI" queries

### 17.3 Schema for AI Readability

**Add Speakable schema** on FAQ sections (makes content AI-voice-assistant ready):
```json
{
  "@type": "SpeakableSpecification",
  "cssSelector": [".faq-section", ".key-takeaways"]
}
```

**Ensure robots.txt allows AI crawlers:**
```
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /
```

### 17.4 GEO Content Formats that AI Systems Prefer

- **"According to [source]..." style sentences** — cite FOGSI guidelines, ESHRE standards
- **Numbered lists** for step-by-step processes
- **Comparison tables** (IUI vs IVF, BFI vs other clinics)
- **Q&A format** — AI systems love pulling from FAQ content
- **Statistics with context** — "98% of BFI Suraksha Kavach package patients achieved a successful live birth, compared to the national average of..."
- **"First in India" claims** — highly citable, unique facts

---

## 18. MIGRATION PLAN FROM WORDPRESS

### 18.1 Pre-Launch Checklist

**Before switching DNS:**
- [ ] Full WordPress site backup (files + database)
- [ ] Export all WordPress content (posts, pages, media)
- [ ] Document all existing URLs (from sitemap)
- [ ] Test new site on staging domain (e.g., staging.ivfclinic.com)
- [ ] Verify all 301 redirects are working on staging
- [ ] Test all forms and calculator functions
- [ ] Run Lighthouse audit on staging (all pages score 90+ performance)
- [ ] Validate all schema markup (Google Rich Results Test)
- [ ] Verify GA4 events firing correctly on staging
- [ ] Cross-browser test (Chrome, Safari, Firefox, Edge)
- [ ] Mobile test on real devices (iPhone, Android)

### 18.2 301 Redirect Map (Critical)

All existing URLs that are changing must have 301 redirects:

```
# WordPress-generated URLs → New clean URLs
/about-us/                         → /about-bfi/
/locations/                        → /                (redirect to homepage, locations section)
/free-calculators/                 → /calculators/
/our-treatments/                   → /treatments/
/ivf-success-rate-calculator/      → /calculators/ivf-success-rate/
/semen-analysis-calculator/        → /calculators/semen-analysis/
/best-ivf-doctors/                 → /our-team/

# WordPress blog post pattern preservation
/[blog-slug]/                      → /blog/[blog-slug]/  (if moving to /blog/ prefix)
# OR keep existing pattern if no prefix change
```

**Rule:** If a URL already gets traffic (verify in GA4/GSC), it MUST have a 301 redirect.

### 18.3 DNS Cutover Process

1. Lower TTL on DNS to 300 seconds (5 min) — do this 48h before cutover
2. Deploy new Next.js site on Vercel with temporary domain
3. Run full QA on Cloudflare Pages preview domain
4. Update DNS A record / CNAME to point to Cloudflare Pages
5. Wait for propagation (5-30 minutes with low TTL)
6. Monitor GSC for crawl errors in first 48 hours
7. Keep WordPress live on a backup subdomain for 30 days (fallback)

### 18.4 Post-Launch Monitoring

**Week 1:** Daily GSC check for 404 errors, ranking drops  
**Week 2-4:** Weekly ranking comparison vs. pre-launch baseline  
**Month 2:** Full traffic comparison (same month prior year + MoM)  

---

## 19. PERFORMANCE REQUIREMENTS

### 19.1 Core Web Vitals Targets

| Metric | Target | Note |
|--------|--------|------|
| LCP (Largest Contentful Paint) | < 2.0s | Hero image must be preloaded |
| CLS (Cumulative Layout Shift) | < 0.05 | Reserve space for all images |
| INP (Interaction to Next Paint) | < 150ms | Minimize JS on critical path |
| FCP (First Contentful Paint) | < 1.5s | Inline critical CSS |
| TTFB (Time to First Byte) | < 200ms | Edge deployment on Vercel |

### 19.2 Technical Performance Requirements

- **Images:** Next.js `<Image>` component with AVIF/WebP, lazy loading except LCP image
- **Fonts:** Self-hosted with `font-display: swap`, preload critical fonts
- **JS:** Code split by route, no blocking scripts in `<head>`
- **CSS:** Tailwind CSS purged, critical CSS inlined
- **Third-party scripts:** GA4, WhatsApp widget — load async after page interactive
- **Server:** Cloudflare Pages + Workers (CDN caching for static pages, edge functions for API)
- **ISR:** Incremental Static Regeneration for blog posts (revalidate: 3600)
- **Static:** All location pages and treatment pages as static HTML at build time

### 19.3 Lighthouse Targets

| Category | Target |
|----------|--------|
| Performance | 90+ |
| Accessibility | 95+ |
| Best Practices | 95+ |
| SEO | 100 |

---

## 20. IMPLEMENTATION TIMELINE & BUILD APPROACH

### 20.0 Build Approach: Frontend First, Homepage First

**Phase 0 — Homepage First (Approval Gate)**

> **The homepage is built FIRST and approved before any other page is built.**  
> This establishes the look, feel, design system, and component library that every other page will use.  
> Nothing else starts until the homepage is approved by the client.

**Build sequence within the homepage approval phase:**
1. Design system setup (colors, fonts, spacing, components)
2. Homepage — all sections built pixel-perfect
3. Deploy to Cloudflare Pages preview URL
4. Client reviews → feedback → revisions
5. **Homepage approved** → proceed to Phase 1

**Frontend vs Backend — Recommended Order:**

| Phase | What | Rationale |
|-------|------|-----------|
| Phase 0 | Homepage design + approval | Establish look & feel before any other work |
| Phase 1 | All frontend pages (with Sanity CMS content) | Pages need to be seen and tested before backend wiring |
| Phase 2 | Backend in parallel with Phase 1 (Week 3+) | D1 database, lead API, WhatsApp, email — build alongside pages |
| Phase 3 | SEO agents (after content is stable) | Agents need actual content to analyze |
| Phase 4 | QA, migration, launch | |

**Why frontend first for phases 0 and 1:**
- Client needs to approve look and feel before investing in backend work
- Sanity CMS content can be entered in parallel by the content team while frontend is built
- Backend (lead API, D1) is independent and can be built in parallel from Week 3 by a second developer if available

**Why backend in parallel (not strictly after):**
- Lead API is needed for Week 3 testing (form submissions must work)
- Cloudflare D1 setup is 1-2 hours — don't wait for frontend completion
- WhatsApp and email notifications can be tested independently

---

### Week 1 — Phase 0: Homepage Only

- [ ] Initialize Next.js 15 with `@cloudflare/next-on-pages`, Tailwind, Framer Motion
- [ ] Set up Sanity CMS (core schemas: siteSettings, homepage, navigation)
- [ ] Configure Cloudflare Pages + GitHub CI/CD → auto-deploy on push
- [ ] Set up Cloudflare D1 database (run migrations)
- [ ] **Build homepage — all 17 sections** (connected to Sanity)
- [ ] Deploy to preview URL: `bfi-preview.pages.dev`
- [ ] **CLIENT REVIEW OF HOMEPAGE — collect feedback**
- [ ] Apply homepage revisions until approved

**Deliverable at end of Week 1:** Approved homepage on preview URL

---

### Week 2-3: Phase 1 — Core Pages (Frontend)

- [ ] About BFI, Why BFI, Awards, Infrastructure, History
- [ ] Our Team — doctor listing page
- [ ] All 17 doctor profile pages
- [ ] Contact page (all 15 centers)
- [ ] Ahmedabad hub + 3 sub-location pages
- [ ] Mumbai hub + 6 sub-location pages
- [ ] All other city pages (6 cities)
- [ ] International patients page
- [ ] **(Parallel) Lead API + D1 + WhatsApp integration**
- [ ] **(Parallel) All Sanity schemas complete**

### Week 3-4: Phase 1 — Treatment Pages

- [ ] All 10 Advanced IVF pages
- [ ] All 3 Donor Services pages
- [ ] All 5 Male Infertility pages
- [ ] All 8 Female Infertility pages
- [ ] Fertility Preservation hub + 3 sub-pages (Egg/Embryo/Sperm Freezing)
- [ ] IVF Failure, ERA Test, PGT pages
- [ ] Surrogacy page
- [ ] All 6 Maternity pages
- [ ] Gynaecology hub + 7 individual gynaecology pages
- [ ] All 8 calculators with real computation logic

### Week 4-5: Blog, SEO & Schema

- [ ] Blog listing page and blog post template
- [ ] Migrate all existing blog posts with YMYL rewrites
- [ ] Implement all schema types (MedicalClinic, FAQPage, Article, Person, etc.)
- [ ] Implement hreflang tags
- [ ] Build HTML sitemap + XML sitemap

### Week 5-6: Backend, Agents & QA

- [ ] Lead CRM admin dashboard
- [ ] WhatsApp API integration
- [ ] GA4 event tracking (all events listed in Section 14)
- [ ] SEO Agent system (all 6 agents)
- [ ] Full QA pass (all pages, all devices, all browsers)
- [ ] 301 redirect implementation
- [ ] Lighthouse audit — all pages 90+
- [ ] Schema validation — all pages pass Rich Results Test

### Week 6: Launch

- [ ] Lower DNS TTL
- [ ] Final staging review
- [ ] DNS cutover
- [ ] Post-launch monitoring
- [ ] Submit new sitemap to GSC

---

## APPENDIX A: CONTENT STANDARDIZATION

**Always use these exact facts (standardize across all pages):**

- Founded: **1984** ✓ (confirmed by client)
- IVF pioneered at BFI: **1998**
- Successful pregnancies: **30,000+** ✓ (confirmed by client — final figure)
- Centers: **15 centers across India** (contact page shows 15)
- Cities: **8 cities**
- Google reviews: **1,800+ five-star reviews**
- International patients: **300+ annually**
- Staff: **200+**
- Promoter doctors combined experience: **100+ years**
- Success rate: **98% (Suraksha Kavach package patients)** — always include this qualifier
- OHSS: **Zero severe OHSS cases in 10+ years**
- Labs: **Class 1000** (not Class 10,000 — Class 1000 is the superior one)
- Awards: **National Fertility Award 2021, 2022, 2023, 2024, 2025** (5 consecutive years)
- Accreditation: **FOGSI Certified Fertility Training Center**

---

## APPENDIX B: BRAND VOICE GUIDELINES

**Tone:** Warm, expert, hopeful — never clinical, cold, or fear-based  
**Voice:** The trusted doctor friend who explains everything clearly  

**Do:** "Your dream of becoming a parent is possible. Here's how we help."  
**Don't:** "Infertility is a complex medical condition affecting many couples."  

**Do:** "We've helped 30,000+ families hold their babies."  
**Don't:** "Our clinic has a high success rate."  

**Do:** "At BFI, we're with you every step of your journey."  
**Don't:** "We provide comprehensive fertility treatment services."  

**Headlines should be:** Specific, benefit-led, emotional where appropriate  
- Bad: "IVF Treatment Services"  
- Good: "IVF Treatment — India's Highest Success Rate, Guaranteed"  

**CTAs should be:** Action-oriented, low-friction, specific  
- Bad: "Submit" / "Contact Us"  
- Good: "Book Your Consultation" / "Talk to a Fertility Expert Today"  

---

## APPENDIX C: COMPETITOR AWARENESS

Key competitors to monitor and benchmark against:
1. Nova IVF Fertility
2. Cloudnine Fertility
3. Bloom IVF
4. Oasis Fertility
5. Indira IVF

BFI's unique positioning vs all: **Suraksha Kavach** (money-back guarantee) — **no competitor offers this at scale**. This must be the primary differentiator in all content and CTAs.

---

*Document prepared by Digital Aura | May 2026 | For Claude Code Implementation*  
*Next review: Post-launch (estimated July 2026)*  
*Logo colors confirmed from provided brand file: Primary Pink #E91E8C*

---

## APPENDIX D: VERIFIED DOCTOR PROFILES (Real Data — Use Exactly)

> All doctor profile pages must use this verified data. Photos must be sourced from client — professional shots, white coat, neutral background. Do NOT use stock photos.

### Dr. Himanshu Bavishi — Founder & Senior IVF Specialist

- **Designation:** Founder, Bavishi Fertility Institute | Senior IVF Specialist
- **Specialization:** IVF, Obstetrics & Gynaecology
- **Experience:** 35+ years
- **Co-founded BFI:** 1998
- **Role:** Founder President, INSTAR (Indian Society of Third Party Assisted Reproduction)
- **Awards:** Excellence in Medicine Award — Indian Medical Association; Shreshti Award in Infertility & IVF from Gujarat Chief Minister
- **Known for:** Complex and difficult infertility cases; described as "a doctor with a golden hand"
- **Treats:** International patients
- **Consultation Locations:** Paldi (Mon–Sat, 12–5 PM) | Nikol (Mon–Fri, by appointment)
- **Fee:** ₹1,500
- **Phone:** +91 9712622288
- **PersonSchema fields:** name, honorificSuffix, jobTitle, worksFor, knowsAbout, award, hasCredential
- **Profile URL:** `/best-ivf-doctors/dr-himanshu-bavishi/`
- **Photo requirements:** High-quality portrait, white coat, warm lighting, confident but approachable expression

---

### Dr. Falguni Bavishi — Co-Founder & Senior IVF Specialist

- **Designation:** Co-Founder, Bavishi Fertility Institute | Senior IVF & Embryology Specialist
- **Specialization:** IVF, Obstetrics & Gynaecology, Embryology
- **Experience:** 34+ years
- **Co-founded BFI:** 1998
- **Awards:** Shreshti Award in Infertility & IVF from Gujarat Chief Minister; Invited faculty at national and regional conferences
- **Known for:** Clinical AND embryology dual expertise; deep emotional patient connection; high success rates especially complex cases; treats international patients
- **Consultation Locations:** Paldi (Mon–Sat, 2–5 PM) | Sindhu Bhavan Road (Mon–Sat, 10 AM–2 PM)
- **Fee:** ₹1,500
- **Phone:** +91 9712622288
- **Profile URL:** `/best-ivf-doctors/dr-falguni-bavishi/`

---

### Dr. Parth Bavishi — Co-Director & IVF Specialist

- **Designation:** Co-Director, Bavishi Fertility Institute (7 centers across 6 cities)
- **Specialization:** IVF, Obstetrics & Gynaecology; Special interest: Poor Ovarian Reserve (low AMH), Repeated IVF Failure
- **Experience:** 13 years
- **Training:** BFI | Diamond Institute, New Jersey, USA | HART Institute, Japan
- **Procedures performed:** 10,000+ infertility procedures
- **Publications:** Author — *"Your Miracle in Making: A Couple's Guide to Pregnancy"*
- **Awards:**
  - Rose of Paracelsus Award — European Medical Association
  - Most Prominent IVF Specialist Award — Chief Minister of Gujarat
  - Bharat Excellence Award for IVF
  - Organizing Committee Member, IFS Conference Ahmedabad
  - Invited faculty, national and regional conferences
- **Consultation Locations:** Paldi (Mon–Sat, 10 AM–4 PM) | Sindhu Bhavan Road (Mon–Sat, 4 PM–7 PM)
- **Fee:** ₹1,500
- **Phone:** +91 9712622288
- **Profile URL:** `/best-ivf-doctors/dr-parth-bavishi/`
- **Special highlight:** Published author, international-trained, youngest yet most awarded of the founding family

---

### Dr. Janki Bavishi — Co-Director & IVF Specialist

- **Designation:** Co-Director, Bavishi Fertility Institute (7 centers across 6 cities)
- **Specialization:** IVF, Obstetrics & Gynaecology
- **Experience:** 12+ years
- **Training:** BFI | Diamond Institute, New Jersey, USA | HART Institute, Japan
- **Procedures performed:** 10,000+ infertility procedures
- **Publications:** Co-author — *"Your Miracle in Making: A Couple's Guide to Pregnancy"*
- **Awards:**
  - Gujarat Gaurav Icon Award — Midday Group
  - Nari Tu Narayani Award for Leading Gynecologist — Bulletin India Group
  - Invited faculty, national and regional conferences
- **Consultation Location:** Paldi, Ahmedabad (Mon–Sat, 10 AM–4 PM)
- **Fee:** ₹1,500
- **Phone:** +91 9712622288
- **Profile URL:** `/best-ivf-doctors/dr-janki-bavishi/`

---

### Dr. Suman Singh — Mumbai Lead Specialist

- **Designation:** IVF & Fertility Specialist, Gynecologist — Mumbai Centers
- **Qualifications:** MBBS, DGO
- **Specialization:** IVF, Fertility, Gynecology
- **Experience:** 20+ years
- **Practice Locations:**
  - Thane: Bapat Urology Centre, NR Greater Bank, A.K. Vaidya Marg, Panch Pakhadi, Thane West 400602 | Phone: 9167204018 | Mon–Sat 10 AM–1 PM
  - Ghatkopar: 2nd Floor, Vallabh Vihar CHS, Mahatma Gandhi Rd, Ghatkopar East 400077 | Phone: 022 2508 8888 | Mon–Sat 2 PM–5 PM
- **Fee:** ₹1,500
- **Known for:** Personalized, customized treatment plans; thousands of couples helped via IVF and natural conception
- **Profile URL:** `/best-ivf-doctors/dr-suman-singh/`

---

### Doctor Profile Image Requirements (ALL doctors)

1. **Photo format:** 800×1000px minimum, 4:5 ratio (portrait)
2. **Background:** Clean white or soft gradient — do NOT use busy backgrounds
3. **Attire:** White coat over formal clothes
4. **Expression:** Warm, confident, approachable — NOT stiff clinical pose
5. **Lighting:** Professional studio lighting, no harsh shadows on face
6. **File format:** WebP (converted from high-res JPG/PNG source)
7. **Alt text pattern:** `Dr. [Name] — [Specialization] at Bavishi Fertility Institute, [City]`
8. **Where used:** Doctor profile page (large), Team page (medium card), Location page (small card), Blog author box (circular crop 64px), Homepage doctors section (280px card)

---

## APPENDIX E: REAL PATIENT TESTIMONIALS (Verified — Use These)

> These are 101 verified testimonials from real patients. Use them across the site — location-specific ones go on location pages. Do NOT fabricate testimonials.

### IMPORTANT: GMB Reviews vs. Site Testimonials

**The 101 testimonials listed below are from BFI's own website** (manually curated, not Google-verified).  
**Actual GMB reviews** (star-rated, Google-verified) cannot be auto-scraped due to Google's API restrictions.

**Recommended approach for the site:**

**Tier 1 — Live GMB Reviews Widget (Highest Trust)**  
Use **Elfsight Google Reviews** or **EmbedSocial** widget that authenticates with each GMB profile via OAuth and displays live, verified 4★ and 5★ Google reviews with names and ratings. This auto-updates as new reviews arrive and shows the "Google Reviews" badge (maximum credibility for YMYL).
- Cost: ~$0-19/month per widget plan
- Implementation: Script embed on each location page showing that center's reviews
- Each center needs its own Google Place ID for filtering

**To get Place IDs per center** (Client Action Required):  
Go to [maps.google.com](https://maps.google.com) → search each BFI center → copy the Place ID from the URL (`place/[PLACE_ID]`). Provide these 15 Place IDs before development.

**Tier 2 — Curated Site Testimonials (Supplement)**  
Use the manually collected testimonials below as supplementary content — especially for the high-emotion stories (18 years, 14 years, etc.) that may not be on GMB.

**Tier 3 — YouTube Video Testimonials (Highest Emotional Impact)**  
Embed actual patient video testimonials from YouTube channel.

### Display Strategy

- **Homepage:** Show 6 video testimonials (Hindi/Gujarati ones for emotional impact) + live Google Reviews widget (shows 1,800+ review count badge) + 4 high-impact text testimonials
- **Ahmedabad page:** Live GMB reviews for Ahmedabad center(s) + curated text testimonials below
- **Mumbai page:** Live GMB reviews for Mumbai centers + curated text testimonials
- **Each sub-location page:** Live GMB reviews for that SPECIFIC center (filtered by Place ID)
- Each text testimonial card: Patient name, city, treatment, 1-2 sentence quote, BFI logo

### Testimonials by City

**Ahmedabad Testimonials (24 patients):**
Ruchira Shah (Canada-based, came to BFI), Payal Ranipa (conceived after failing elsewhere), Priya Mehta, Raman Thakor, Chirag G Bhabhor, Rajni Singh, Hari Adhyaru, Nabila Zazwala, Meera Singh, Kapila Patel (4 years, first transfer success), Kamal Soni, Abhi Patel, Anuj Sadh, Trilochana Bhatt, Mansi Patel (precious daughter after failure elsewhere), Balbir Singh (first cycle positive), Saiyed Naaz (8 years, finally parents), Muskan Patani (twins!), Nirva Patel, Niravkumar Patel, Dharmveer Gohil, Shahenaz Mansuri, Israt Shaikh, Nidhi Parmar, Jayesh Bharwad, Patel Pinkal, Laxmi Kachwala ("angel doctor")

**Featured Ahmedabad quote (high-impact):**
> "After 4 years of trying and failing at another hospital, BFI gave us hope again. Our first transfer at BFI was positive. Best fertility hospital in Ahmedabad." — *Kapila Patel, Ahmedabad*

> "I came from Canada expecting a clinical experience. BFI felt like home — like family. The team made our journey comfortable and positive." — *Ruchira Shah, Ahmedabad (International Patient)*

**Mumbai Testimonials (24 patients):**
Namrata Thanekar (IUI success), Savita Tripathi (first attempt success), Tanisha Kumari, Divyesh Panchal, Rahul Singh, Waleim Mansure (9 years, finally success), Priya Naveenjadhav (twins!), Rakesh Sangare, Sumit Mhabadi, Priyanka Pujari (baby girl after losing hope), Sanju Chaudhary, Kavita Singh, Piyu Ravat, Vanita Jadhav, Sudhakar Komati (14 years, healthy baby boy), Md Aktar, Anurag Shirodkar, Ruchi Shah, Deepak Vanjare, Neeta Dhongade (first attempt, 5 years), Ravi Subramanian (twins!), Mayuri Bendre, Vinod Singh, Megha Bandbe, Pradnya Pagare (twins!)

**Featured Mumbai quote (high-impact):**
> "After 14 years of trying, we finally have a healthy baby boy. The doctors at BFI Mumbai never gave up on us." — *Sudhakar Komati, Mumbai*

> "I had lost all hope of becoming a mother. BFI Mumbai gave me back that hope — and then my beautiful baby girl." — *Priyanka Pujari, Mumbai*

**Surat Testimonials (16 patients):**
Palak Sugandhi, Jignesh Gandhi, Prajapati Ajay, Bharti Munjani, Dharmesh Patel, Hemil Intwala (first attempt success), Nirmal Choudhary (good news first attempt, 2 years), Chhayal Modi, Helina Patel, Ramesh Nayak (**18 years trying, success 2023** — flagship story), Bhrugesha Tandel, Dolly Jain, Falguni Parekh, Aarti Prakash, Sonu Parmar (first time, baby heartbeat), Ronak Patel, Puja Tendolkar, Gauri Pednekar, Kamlesh Gamit

**Featured Surat quote:**
> "We tried for 18 years. Eighteen long years. Finally, in 2023, BFI Surat gave us the happiness we had been waiting for." — *Ramesh Nayak, Surat*

**Vadodara Testimonials (19 patients):**
Gaurang Rana (single cycle), Reeti Gandhi, Bhavika Parekh (twins — Avira & Avyaan!), Monika Thakkar, Dasharath Rathod, Sheetal Gupta (first cycle positive), Krunal Patel, Sweetu, Bhavi Dave (4 years failed elsewhere), Akshay Gadgil, Khyati Rajani, Nikhil Patel, B.A Pargi (10 years), Payal Patel (**14 years, baby girl**), Nayna Sonera, Tejas Patel (twins!), Chauhan Jayshree, Jigar Patel, Praful Thakkar (**success at ages 50/54 and AGAIN at 57/61** — extraordinary story), Shailesh Bariya, Avani Bhatt, Archana Tomer (lost all hope, first cycle success), Princy Patel, Chauhan Ajay (6+ years), Vijay Bhoi (**age 47, 22 years marriage, baby girl** — flagship story), Bhavna Varsani

**Featured Vadodara quote:**
> "22 years of marriage. Age 47. We had given up. BFI Vadodara made the impossible happen — we have a healthy baby girl." — *Vijay Bhoi, Vadodara*

> "I am 57 years old. My wife is 61. We had our second successful IVF at BFI. Our first was when I was 50. This team has no limits." — *Praful Thakkar, Vadodara*

**Bhuj Testimonials:**
Bhavna Varsani, Rabari Khengar Hamir, Jitesh Dabasiya (available 24×7 — highlight)

**Gujarat (general) Testimonials:**
Mistry Zalak (8th anniversary, 1st attempt positive — note: overweight patient succeeded — inclusion milestone)

### Video Testimonials from YouTube (Embed These)

These are actual YouTube testimonial videos from BFI's channel. Embed using YouTube's nocookie domain:

- **आशा, दृढ़ता और मातृत्व की यात्रा | प्रिया मोहद की गवाही** (Hindi — high emotional impact for North India + Varanasi)
- **पितृत्व की यात्रा | विवेकानन्द और बंदना का प्रशंसापत्र** (Hindi — couple's journey)
- **Mayank Patel IVF testimonial** (Gujarati — Ahmedabad/Gujarat audience)
- **Kamal Vandra IVF testimonial** (Gujarati)
- **ખુશીઓ ની ગોઉ ભરાઇ** (multiple Gujarati testimonials)

**Implementation:** Embed via YouTube nocookie (`youtube-nocookie.com`) for privacy-first loading. Add `loading="lazy"` on iframe. Add VideoObject schema for each embedded video.

**Schema for each video:**
```json
{
  "@type": "VideoObject",
  "name": "[Video title]",
  "description": "[Patient name]'s IVF success story at Bavishi Fertility Institute",
  "thumbnailUrl": "https://img.youtube.com/vi/[VIDEO_ID]/maxresdefault.jpg",
  "uploadDate": "[date]",
  "publisher": {
    "@type": "Organization",
    "name": "Bavishi Fertility Institute"
  }
}
```

---

## APPENDIX F: SOCIAL MEDIA PROFILES (Verified)

### Official Social Media Links

| Platform | URL | Handle |
|----------|-----|--------|
| Instagram | `https://www.instagram.com/bavishi_ivf` | @bavishi_ivf |
| YouTube | `https://www.youtube.com/channel/UCiqcuW9RTk1rwcNEW6kt9Bg` | Bavishi Fertility Institute IVF Hospital |
| Facebook | `https://www.facebook.com/Bavishifertilityinstitute/` | @Bavishifertilityinstitute |
| Twitter / X | `https://twitter.com/Bavishi_IVF` | @Bavishi_IVF |
| LinkedIn | `https://www.linkedin.com/company/bavishi-fertility-institute` | Bavishi Fertility Institute |
| Pinterest | `https://in.pinterest.com/BavishiIVF/_created/` | BavishiIVF |
| WhatsApp | `https://api.whatsapp.com/send?phone=919712622288` | +91 9712622288 |

### Social Media Integration in Site

1. **Footer:** All 7 platform icons with correct links — use brand-colored icons (pink) on hover
2. **YouTube section on homepage:** Embed latest 3-4 video testimonials using YouTube API or manual embed
3. **Instagram feed widget:** Embed live Instagram feed (latest 6-9 posts grid) using a social widget (e.g., Elfsight or Behold widget, or official Instagram embed) — place on homepage below testimonials
4. **WhatsApp floating button:** Bottom-right corner on all pages (mobile + desktop)
5. **Blog posts:** Add social share buttons (WhatsApp, Facebook, Twitter, LinkedIn) at end of each post

### YouTube Channel Strategy

The YouTube channel (`UCiqcuW9RTk1rwcNEW6kt9Bg`) contains:
- Patient testimonial videos (multiple languages: Hindi, Gujarati, English)
- IVF procedure explainer videos
- Doctor interview/education videos
- Event and awareness videos

**Integration on website:**
- Homepage: Video testimonial carousel (3 featured videos autoplay muted)
- Individual treatment pages: Relevant explainer videos embedded
- Doctor profile pages: Doctor's interview/talk video if available
- Blog posts: Related videos embedded where relevant
- Testimonials page: All testimonial videos in a filterable grid (filter by language, city, treatment)

### YouTube Video Technical Requirements

```jsx
// Use this component for all YouTube embeds
function YouTubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  return (
    <div className="aspect-video rounded-2xl overflow-hidden">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="w-full h-full"
      />
    </div>
  );
}
```

---

## APPENDIX G: ICON & IMAGE GUIDELINES

### Icons — Service Cards

Use **custom medical-fertility icons** (NOT generic stock icons). Recommended: Commission from a medical icon set or use Lucide + custom SVG additions.

**Treatment-specific icons (what each should visually show):**

| Treatment | Icon Concept |
|-----------|-------------|
| IVF | Microscope with embryo/cell inside |
| IUI | Syringe with heart |
| ICSI | Single sperm cell with star highlight |
| Donor Services | Two hands holding a heart |
| Male Infertility | Male symbol with sperm |
| Female Infertility | Female reproductive system simplified |
| Fertility Preservation | Snowflake + embryo |
| Maternity Services | Mother and baby silhouette (matches logo motif) |
| Surrogacy | Three hands together (family unit) |
| Blastocyst Transfer | Cell dividing into multiple cells |
| PGT / Genetic Testing | DNA helix + checkmark |
| ERA Test | Calendar + uterus |

**Icon style:** Line icons, 2px stroke, rounded corners, pink (#E91E8C) primary color. Size: 48×48px on cards.

**Icon library recommendation:** Use a combination of:
- Lucide React (for UI icons: navigation, forms, badges)
- Custom SVG set for medical treatment icons (commission or use Flaticon Medical Set with commercial license)

### Images — Photography Requirements

**Hero Image:**
- Show: Happy couple holding newborn baby, or pregnant woman with partner, warm natural light
- Style: Real patients (not stock if possible), warm color grading, soft bokeh background
- Do NOT use: Sterile clinical photos, isolation shots, overly staged stock photography
- Size: 1920×1080px minimum, WebP format

**Doctor Photos:**
- See Appendix D for detailed requirements
- Must have: Individual photos for all 17 doctors
- Store in: Sanity media library, served via Sanity CDN

**Location Photos:**
- Each center needs: Exterior photo, reception area, consultation room, lab (if accessible), team photo
- Minimum 5 photos per center
- Resolution: 1200×800px minimum

**Lab / Technology Photos:**
- Class 1000 lab equipment prominently shown
- Embryoscope, microscopes, clean room environment
- These are major trust signals — make them prominent on the Why BFI page

**Patient Journey Photos:**
- Consultation scene (doctor + couple)
- Lab procedure scene (without graphic medical content)
- Pregnancy ultrasound moment
- Baby holding scene (with patient consent/model release)
- These form the emotional backbone of the site

**Image Alt Text Pattern:**
```
Doctor: "Dr. [Name], [Specialization] at Bavishi Fertility Institute [City]"
Lab: "Class 1000 IVF laboratory at Bavishi Fertility Institute [City] — 10x superior standard"
Treatment: "[Treatment name] at BFI — [City] fertility clinic"
Location: "Bavishi Fertility Institute [Area], [City] — IVF clinic interior"
Team: "BFI fertility team at [Center name], [City]"
```

### Awards Display

Each award should show:
- Award image/certificate scan (if available) OR gold badge icon
- Award name (bold, navy text)
- Awarding body (pink text)
- Year

**Awards to display prominently:**
1. National Fertility Award 2021, 2022, 2023, 2024, 2025 (5 badges in a row — "5 consecutive years" label)
2. Times Healthcare Leaders Awards 2025
3. IVF Chain of the Year — West (5th time) — Economic Times
4. Bharat Excellence Award for IVF — Dr. Parth Bavishi
5. Excellence in Medicine Award — Indian Medical Association
6. Shreshti Award — Gujarat Chief Minister (Dr. Himanshu & Dr. Falguni)
7. Rose of Paracelsus Award — European Medical Association (Dr. Parth)
8. Most Prominent IVF Specialist — Chief Minister of Gujarat (Dr. Parth)
9. Gujarat Gaurav Icon Award — Dr. Janki Bavishi
10. Nari Tu Narayani Award — Dr. Janki Bavishi
11. Patient Centric Hospital Award
12. FOGSI Certified Fertility Training Center badge

---

## APPENDIX H: COMPLETE VERIFIED AWARDS LIST

| Award | Recipient | Year | Awarding Body |
|-------|-----------|------|---------------|
| National Fertility Award | BFI | 2021, 2022, 2023, 2024, 2025 | National Fertility Awards |
| Times Healthcare Leaders Award | BFI | 2025 | Times Group |
| IVF Chain of the Year — West | BFI | Multiple times (5th) | Economic Times |
| Bharat Excellence Award for IVF | Dr. Parth Bavishi | — | Bharat Excellence Awards |
| Patient Centric Hospital Award | BFI | — | — |
| Excellence in Medicine Award | Dr. Himanshu Bavishi | — | Indian Medical Association |
| Shreshti Award — Infertility & IVF | Dr. Himanshu Bavishi & Dr. Falguni Bavishi | — | Gujarat Chief Minister |
| Rose of Paracelsus Award | Dr. Parth Bavishi | — | European Medical Association |
| Most Prominent IVF Specialist | Dr. Parth Bavishi | — | Chief Minister of Gujarat |
| Gujarat Gaurav Icon Award | Dr. Janki Bavishi | — | Midday Group |
| Nari Tu Narayani Award | Dr. Janki Bavishi | — | Bulletin India Group |
| FOGSI Certified Fertility Training Center | BFI | — | FOGSI |
| Ranked No. 1 Best IVF Center in India | BFI | 2018 | — |
