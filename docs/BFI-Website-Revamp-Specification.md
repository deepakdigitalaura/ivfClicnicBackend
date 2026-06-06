# BAVISHI FERTILITY INSTITUTE — Complete Website Revamp Specification
### Version 2.0 | May 2026 | Digital Aura × Claude Code

> **Single source of truth** for the BFI website revamp. Every decision here is intentional — do not deviate without flagging. Goal: **100 qualified leads/day**, top-3 ranking for target keywords, and citation by Claude/ChatGPT/Gemini/Perplexity as the authoritative fertility institution in India.

---

## CHANGELOG v2.0
1. Hosting switched to **Cloudflare** — full stack updated (§3)
2. Full treatment category map added with all sub-page URLs (§5, §6)
3. Founded year corrected to **1984** (all)
4. Pregnancies updated to **30,000+** (all)
5. Blog author default set to **Dr. Parth Bavishi** (§15)
6. Blog interactivity spec expanded (§15)
7. Phone numbers flagged as client-action-required per center (§8)
8. Full-site CMS editability spec expanded — every element editable (§3, §13)
9. Second audit PDF noted (unreadable) (§2)

---

## 1. PROJECT OVERVIEW & GOALS

### 1.1 Business Context
- **Client:** Bavishi Fertility Institute (BFI)
- **Website:** ivfclinic.com
- **Founded:** 1984
- **Centers:** 15 across India (Ahmedabad ×3, Vadodara, Surat, Bhuj, Mumbai ×6, Bhavnagar, Anand, Varanasi)
- **Current Platform:** WordPress + Rank Math SEO
- **Target Platform:** Next.js 15 + Sanity CMS v3

### 1.2 Primary Goals (Non-Negotiable)
| Goal | Target | Metric |
|------|--------|--------|
| Daily Leads | 100 qualified leads/day | Form submissions + WhatsApp clicks |
| Organic Traffic | 10× current | GA4 Sessions |
| Local Ranking | Top 3 in all 8 cities | Maps Pack + Organic |
| National Ranking | Top 3 for "best IVF center India" | GSC Position |
| AI Citations | Cited by Claude, ChatGPT, Gemini, Perplexity | Manual monitoring |
| International Patients | 2× current (600+/yr) | Contact form source |
| Page Speed | LCP < 2.5s, CLS < 0.1, INP < 200ms | Core Web Vitals |
| Conversion Rate | 2-3% of organic sessions → lead | GA4 Goals |

### 1.3 Priority Centers
1. **Ahmedabad** (all 3 centers) — primary market, head office
2. **Mumbai** (all 6 centers) — largest city, highest volume potential
3. All other cities at equal priority after Ahmedabad and Mumbai

### 1.4 Key Brand Differentiators
1. **Suraksha Kavach** — money-back guarantee until healthy live birth (98% success)
2. **Zero severe OHSS** in 10+ years
3. **First in India** — first frozen egg live birth, first international surrogacy
4. **Class 1000 IVF Labs** — 10× superior to international standard (Class 10,000)
5. **DIVYA SANTAN PARIVAR** — patient support community
6. **Since 1984** — 40 years of trust; pioneered IVF in India in 1998
7. **One-Stop Clinic** — tests, surgery, treatment under one roof
8. **30,000+ successful pregnancies** (standardize to this verified number)
9. **National Fertility Award** — 5 consecutive years (2021–2025)
10. **300+ international patients annually**

---

## 2. INDEPENDENT SEO AUDIT FINDINGS (May 2026)

### 2.1 Critical (fix before launch)
1. `/about-us/` returns 404
2. `/locations/` returns 404
3. `/free-calculators/` returns 404
4. **Calculators are fake** — no real output (destroys trust & GEO)
5. Founding year inconsistency across pages → standardize to **1984**
6. Success stat inconsistency → standardize to **30,000+** pregnancies
7. **Shared phone number** across all centers (+91 9712622288) — kills Local SEO
8. **Mumbai has 6 centers but only one landing page** — needs individual pages for Ghatkopar, Thane, Vile Parle, Borivali, Vashi, Dadar

### 2.2 High Priority
9. Missing meta descriptions (Contact, About, treatment pages)
10. FAQPage schema absent despite FAQ sections
11. MedicalClinic/MedicalBusiness schema incomplete
12. BreadcrumbList schema missing
13. Zero external citations in blog posts (YMYL red flag)
14. No author bio pages for most doctors
15. No hreflang tags despite international patients
16. No individual sub-location pages for Ahmedabad's 3 centers
17. Competitor comparison article (8,500 words) lacks author byline
18. No multilingual content (Gujarati/Hindi/Marathi)

### 2.3 Medium Priority
19. Navigation too nested (3+ clicks to treatment pages)
20. Suraksha Kavach not prominent on homepage
21. No emotional content for failed IVF / secondary infertility
22. No dedicated international patient page
23. No Core Web Vitals optimization
24. Social proof videos not optimized (no transcript/VideoObject schema)
25. WhatsApp CTA present but no automated follow-up sequence

---

## 3. TECH STACK & ARCHITECTURE

### 3.1 Stack (Cloudflare-native — client requirement)
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) |
| CF Adapter | `@cloudflare/next-on-pages` |
| Hosting | Cloudflare Pages |
| Edge Functions | Cloudflare Workers |
| Database | Cloudflare D1 (SQLite at edge) — leads CRM, agent logs |
| Caching | Cloudflare KV |
| Object Storage | Cloudflare R2 |
| CMS | Sanity.io v3 (full-site editable) |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Schema | Custom JSON-LD React components |
| i18n | next-intl (en/hi/gu/mr) |
| Email | Resend |
| WhatsApp | Wati API or Interakt |
| SEO Agents | Claude API (claude-sonnet-4-6) |
| Search | Algolia |
| Media CDN | Sanity CDN + Cloudflare Images |
| Analytics | GA4 + Cloudflare Analytics |
| Error Monitoring | Sentry |
| CI/CD | GitHub Actions → Cloudflare Pages |

### 3.1a Cloudflare Rules
- Every API route MUST declare `export const runtime = 'edge';`
- Use Web Crypto (`crypto.randomUUID()`), not Node.js crypto
- D1 access via `env.DB` binding
- `wrangler.toml` with D1 / KV / R2 bindings
- D1 `leads` table: id, created_at, name, email, phone, source/medium/campaign/page_url, calculator_used, center_preference, treatment_interest, doctor_preference, message, status, assigned_to, follow_up_date, notes, locale, is_international, country (+ indexes on status, center, created_at)

### 3.3 Repo Structure
`app/(site)/[locale]/` for pages (en/hi/gu/mr), `(studio)` for Sanity, `api/` for leads/calculators/agents. Locations nested: `locations/ahmedabad/{paldi,sindhu-bhavan,nikol}`, `locations/mumbai/{ghatkopar,thane,vile-parle,borivali,vashi,dadar}`.

---

## 4. DESIGN SYSTEM

### 4.1 Brand Colors (primary = Hot Pink/Magenta from logo)
- `--color-brand-pink: #E91E8C` (primary CTA, headings, accents)
- `--color-brand-pink-dark: #C41478`
- `--color-brand-pink-light: #F06BB5`
- `--color-brand-pink-tint: #FDF2F8`
- `--color-brand-pink-ultra: #FEF9FC`
- `--color-trust-navy: #1A2B4A`
- `--color-trust-teal: #0D9488`
- `--color-warm-gold: #D4AF37` (awards, premium)
- `--color-warm-cream: #FFF8F0`
- Text: primary `#111827`, secondary `#374151`, muted `#6B7280`
- Semantic: success `#059669`, warning `#D97706`, error `#DC2626`

### 4.2 Typography
- Heading: 'Plus Jakarta Sans'
- Body: 'Inter'
- Accent: 'Cormorant Garamond' (pull quotes, testimonials)
- Scale: xs .75 / sm .875 / base 1 / lg 1.125 / xl 1.25 / 2xl 1.5 / 3xl 1.875 / 4xl 2.25 / 5xl 3 / 6xl 3.75 (rem)

### 4.3 Spacing (8px base): 4,8,12,16,20,24,32,40,48,64,80,96,128 px

### 4.4 Component Principles
- Min body font 16px; line length 60-75ch; contrast ≥4.5:1 body, 3:1 large
- Never pink text on white at small sizes — use navy/near-black
- CTA hierarchy: Primary (pink bg, white text, rounded-full) / Secondary (white bg, pink border) / Tertiary (text link + arrow) / WhatsApp (#25D366)
- Trust badge: gold border, white bg, stat in pink, descriptor in navy

### 4.5 Layout
- Max content 1280px; readable column 780px; 12-col grid desktop
- Breakpoints: mobile 0-767, tablet 768-1023, desktop 1024-1279, wide 1280+

### 4.6 Mobile-First
- Start at 375px; touch targets ≥44×44px
- Sticky bottom bar (mobile): Call Now + WhatsApp + Book Appointment
- All phone numbers tappable (tel:)

---

## 5. INFORMATION ARCHITECTURE (Flat, Max 2 Levels)

Primary nav: Home · About BFI · Treatments · Doctors · Locations · Calculators · International Patients · Blog/Resources · Contact Us.

### Treatment categories
- **Advanced IVF:** IVF, IVF Failure, IUI, ICSI, PICSI, IMSI, MACS, Spindle View ICSI, Blastocyst Transfer, Laser Assisted Hatching
- **Donor Services:** Egg / Sperm / Embryo Donation
- **Male Infertility:** Oligospermia, Asthenospermia, Azoospermia, Varicocele/Micro Surgery, Erectile Dysfunction
- **Female Infertility:** PCOS, Poor Ovarian Reserve/Low AMH, Ovarian Rejuvenation, Fibroids, Endometriosis, PRP Therapy, Ectopic Pregnancy, How Conception Occurs
- **Fertility Preservation:** Cryopreservation overview, Egg/Embryo/Sperm Freezing
- **IVF Failure & Second Opinion:** Understanding IVF Failure, ERA Test, PGT
- **Surrogacy**
- **Maternity:** 3D/4D Sonography, Painless Delivery, Normal Delivery, Fetal Medicine, High Risk Pregnancy, Twin Pregnancy
- **Gynaecology:** General, Vaginal Surgery, Menopause Clinic, Breast Health, Urogynaecology, Oncology, Cosmetic Gynaecology

### Locations
Ahmedabad hub → Paldi, Sindhu Bhavan Road, Nikol · Mumbai hub → Ghatkopar, Thane, Vile Parle, Borivali, Vashi, Dadar · Vadodara · Surat · Bhuj · Bhavnagar · Anand · Varanasi

### URL Strategy
**Preserve existing URLs for SEO equity.** Restore 404s: `/about-bfi/`, `/calculators/`. Treatment URLs keep existing slugs (e.g. `/what-is-ivf/`, `/intra-uterine-insemination-iui/`, `/icsi-treatment-intracytoplasmic-sperm-injection/`). NEW: egg/embryo/sperm-freezing split pages, gynaecology sub-pages, city sub-location pages, `/international-patients/`. Doctor pattern: `/best-ivf-doctors/dr-[name]/`. Calculators: `/calculators/[name]/`. Blog: `/blog/[slug]/`.

---

## 6. PAGE SPECS (highlights)

### Homepage (17 sections, top→bottom)
1. Hero (full-viewport, animated pink→white gradient). H1 = "India's Most Trusted Fertility Institute". Subhead emphasizes 30,000+ babies, 40 years, Suraksha Kavach guarantee. Two CTAs (Book Free Consultation / Watch Success Stories). Floating sticky header.
2. Live trust ticker (animated marquee)
3. Stats (4 animated counters): 30,000+ pregnancies · 15 centers · 40 years (since 1984) · 1,800+ five-star reviews
4. Suraksha Kavach section (prominent)
5. Services grid (6 cards)
6. Patient journey (3 steps)
7. Doctors (top 4: Himanshu, Falguni, Parth, Janki Bavishi)
8. Why BFI — 4 pillars (Making IVF Easy / Safe / Smart / Successful 98%)
9. Video testimonials (VideoObject schema)
10. Featured-in media logos
11. Awards & recognition
12. Calculators teaser
13. Locations map (India, 15 pins)
14. Blog preview (3 latest)
15. FAQ (8 Q, FAQPage schema)
16. Final CTA banner
17. Footer (4 columns)

### Location hubs `/[city]/`: H1 "Best IVF Centre in [City] — BFI". Sub-location cards, local doctors, city testimonials, Maps embed, MedicalClinic schema, city FAQ.

### Sub-location `/[city]/[area]/`: UNIQUE phone per center, exact address + GPS, center doctors, directions, hours, nearby areas served. MedicalClinic schema with unique phone + GPS.

### Doctor profiles `/best-ivf-doctors/dr-[name]/`: photo, degrees, experience, training, publications, awards, cycles performed, success stories, video, PersonSchema, Book CTA.

### Treatment pages (min 2,500 words): what/who/process/success-rates-by-age/cost/why-BFI/story/doctor/citations/FAQ(8+). Schema: MedicalProcedure, FAQPage, BreadcrumbList, Article.

### International Patients `/international-patients/`: cost comparison (UK £10-15k vs India ₹1-2.5L), countries served, end-to-end support, visa/accommodation, telemedicine, multi-currency (USD/GBP/AED/INR), hreflang en-GB/US/AE/AU.

### Calculators hub `/calculators/`: 8 calculator cards.

---

## 7. CONTENT STRATEGY — YMYL / EEAT / AEO / GEO

- **YMYL:** named credentialed author + degrees, published + last-reviewed dates, external citations (PubMed, FOGSI, ICMR, WHO, ESHRE), medical disclaimer, no absolute success claims without caveat, author bio box, org credibility.
- **EEAT:** patient testimonials (name/city/treatment), doctor bios with specifics ("performed 5,000+ ICSI cycles"), "Since 1984" heritage, FOGSI badge, National Fertility Award 2021-2025 in footer, Dr. Parth's book "Your Miracle in Making", media coverage, Suraksha Kavach, transparent pricing, real Google reviews, WhatsApp.
- **AEO:** H2s phrased as questions, inverted-pyramid first paragraph, FAQPage schema (≥6 Q), answers <50 words for voice, comparison tables, "In summary" boxes.
- **GEO:** entity-rich factual language, verifiable stats, historical firsts, Wikipedia-quality About page, `/about-bfi/facts/` page, AI-citation-ready "ABOUT BFI" entity blocks on all major pages.

---

## 8. LOCAL SEO — Per-Center Phone Numbers (CRITICAL: unique per center)

| Center | Phone |
|--------|-------|
| Ahmedabad — Nikol | 9227114040 |
| Mumbai — Ghatkopar | 9328190146 |
| Mumbai — Thane | 9167204018 |
| Mumbai — Vile Parle | 9167204019 |
| Mumbai — Borivali | 9167204019 |
| Mumbai — Vashi | 9687004268 |
| Mumbai — Dadar | 09328190146 |
| Vadodara | 7575099898 |
| Surat | 9879572247 |
| Bhuj | 9687188550 |
| Bhavnagar | 7069314040 |
| Anand | 7069034565 |
| Varanasi | 9506081979 |

(Ahmedabad Paldi & Sindhu Bhavan phones = client-action-required; org default +91 9712622288.)

- Every sub-location needs its own Google Business Profile (unique phone, exact address+PIN, GPS, hours, services, ≥15 photos, weekly posts, seeded Q&A, 24h review responses).
- NAP consistency; never mix phones for the same center.
- Per-city: city hub page, area-level pages, 2+ city blog posts, local FAQ schema.
- Each sub-location: MedicalClinic schema with unique phone + GPS + parentOrganization.

---

## 9. INTERNATIONAL SEO & MULTILINGUAL
- Languages: en-IN (all), en-GB/US/AE (intl + key treatments), Gujarati (Gujarat cities), Hindi (Varanasi/North), Marathi (Mumbai).
- hreflang on all pages incl. x-default.
- Multi-currency pricing; comparison content "India vs UK/UAE".

---

## 10. SCHEMA MARKUP
Per page type: Homepage (Organization, MedicalOrganization, SiteNavigationElement, FAQPage); City hub (LocalBusiness, MedicalClinic, FAQPage, BreadcrumbList); Sub-location (MedicalClinic, LocalBusiness, BreadcrumbList); Doctor (Person, MedicalOrganization, BreadcrumbList); Treatment (MedicalProcedure, FAQPage, Article, BreadcrumbList); Blog (Article, FAQPage, BreadcrumbList, Person); Calculator (WebApplication, FAQPage); Contact (LocalBusiness all locations).
Sitewide Organization schema: foundingDate 1984, awards array (National Fertility 2021-25, ET IVF Chain of Year, Bharat Excellence), sameAs social links, telephone +919712622288, email drbavishi@ivfclinic.com.

---

## 11. CALCULATORS (8 — must show REAL results immediately, then soft lead CTA)
1. **IVF Success Rate** — age/diagnosis/attempts/prior-success/transfer-type/egg-source → % range gauge. Base by age: <30 55%, 30-34 50%, 35-37 42%, 38-40 30%, 41-42 20%, 43+ 10-15%. Modifiers: donor +15-20%, blastocyst +8%, prior success +5%, DOR -10 to -15%, endometriosis -5%, 3+ fails -5%.
2. **IVF Cost** — center/treatment/cycles/Suraksha → INR range + USD/GBP/AED + breakdown + EMI.
3. **Ovulation** — LMP + cycle length → ovulation date, fertile window, next period, pink calendar.
4. **Fertile Period** — LMP/cycle/luteal → conception window + ICS download.
5. **AMH Interpreter** — value (ng/mL or pmol/L) + age → category + meaning + next steps.
6. **Natural Pregnancy** — age/duration/regularity/issue → 6-month probability + recommendation.
7. **Semen Analysis** — count/motility/morphology/volume → WHO 2021 comparison + treatment rec.
8. **Miscarriage Risk** — age/prior losses/live births/gestational age/cause → risk + investigations + disclaimer.

---

## 12. SEO AGENT ARCHITECTURE (Claude API, log to D1 + Resend/Slack)
1. **On-Page SEO** (weekly, sonnet-4-6) — meta lengths, keyword scoring, Sanity draft fixes
2. **Content Refresh** (monthly, opus-4-8) — ranking-drop recovery via GSC
3. **Schema Validator** (daily, haiku-4-5) — Rich Results Test, auto-fix
4. **Internal Linking** (weekly, sonnet-4-6) — orphan detection, link suggestions
5. **GSC Monitor** (daily, haiku-4-5) — ranking/CTR drops, daily digest, Ahmedabad+Mumbai focus
6. **GA4 Insights** (weekly, sonnet-4-6) — CRO recs, lead-vs-100/day tracking
Est. total cost ~$105-165/month. Tools: sanity_fetch/patch, gsc_get_queries, GA4 Data API.

---

## 13. BACKEND & CRM

### 13.0 Full-Site CMS Editability (HARD REQUIREMENT)
**Every element editable in Sanity Studio (`admin.ivfclinic.com`) — no hardcoded content anywhere.** Covers: global settings (name, phones, WhatsApp, email, socials, logo, brand colors singleton, announcement bar, footer, legal), navigation, every homepage section (as separate documents), all content types (blog posts with custom portable-text blocks: infographic/pull-quote/stat-box/comparison-table/embedded-calculator/FAQ; treatments; doctor profiles; location pages with unique phone+GPS; testimonials; awards; FAQs; calculators; events; media coverage; per-page SEO). Admin-only: redirect manager, SEO agent log viewer, lead CRM viewer. Principles: references not inline, portableText for long-form, image-url for WebP, SEO fields max-160 validation, drag-drop ordering.

### 13.1-13.5 Leads
- D1 `leads` table (see §3.1a).
- Lead API `/app/api/leads/route.ts` (edge runtime): Zod validate → insert D1 → WhatsApp auto-message → email notify coordinator → GA4 Measurement Protocol `generate_lead`.
- WhatsApp auto-response within 60s (templated, center-specific).
- Routing: Ahmedabad→ahmedabad-team, Mumbai→mumbai-team, international→international, all→admin (@ivfclinic.com).
- Admin CRM at `/admin/`: list+filters, detail, status flow (new→contacted→consultation booked→patient→lost), notes, CSV export, lead-vs-100/day chart, source pie.

---

## 14. GA4 & GSC
Events: generate_lead, calculator_completed, whatsapp_click, phone_click, doctor_view, video_start, appointment_booked. Conversions: generate_lead + appointment_booked (primary), phone_click + whatsapp_click (secondary). Custom dims: city_center, treatment_interest, patient_type, locale, calculator_entry.

---

## 15. BLOG STRATEGY

### 15.0 Default author = **Dr. Parth Bavishi, MD (Obs & Gyn)** — Co-Director BFI, `/best-ivf-doctors/dr-parth-bavishi/`. Credentials: "MD OB-GYN | 13 years | 10,000+ procedures | Rose of Paracelsus Award | Author of 'Your Miracle in Making'". Author bio box at top AND bottom. Other doctors assignable per topic in Sanity.

### 15.1 Funnel stages: Awareness (TOFU) → Consideration (MOFU) → Decision (BOFU) → Retention/Community.

### 15.2 Interactivity — blogs must NOT be walls of text. Every 250-350 words broken by a visual. Required: hero image, 1-2 infographics (800px, brand colors), 1 pull quote (Cormorant, pink left-border), stat call-out boxes, sticky TOC + read time, comparison tables, numbered visual steps, embedded relevant calculator, video embeds (transcript + VideoObject), sticky social share (WhatsApp primary).

### 15.3 Rewrite reqs: default author + bio box top/bottom, pub + review dates, ≥2 external citations, disclaimer; keyword in H1/first-100-words/2+ H2s/meta; min 2,000 words (guides 3,000+); FAQPage ≥8 Q; ≥5 internal links, 2-3 external; Article schema. Priority new posts: local cost/doctor guides (Ahmedabad/Mumbai BOFU), NRI/international, Suraksha Kavach explainer, Class 1000 lab, azoospermia, egg freezing cost, PRP rejuvenation, AEO snippet targets.

---

## 16. ANIMATION (Framer Motion; respect prefers-reduced-motion; no LCP/CLS impact)
Hero gradient (CSS 8s), headline word stagger, CTA pulse ring, hero float. Stats count-up on view (once). Service cards fade-up stagger + hover lift. Trust ticker marquee. Doctor card hover overlay. Calculator live feedback + result slide-down + count-up. Page transitions fade (AnimatePresence). Mobile sticky bar slide-up. Blog scroll progress bar. Form success confetti. Skeleton screens (pink shimmer), not spinners. LCP elements server-rendered.

---

## 17. GEO — Generative Engine Optimization
AI cites content that is factual/specific, well-structured, authoritative, comprehensive, fresh. Include "About BFI" entity block on major pages. Create `/about-bfi/facts/`. Add Speakable schema on `.faq-section`/`.key-takeaways`. robots.txt allows GPTBot, Google-Extended, ClaudeBot, anthropic-ai. Prefer "According to [source]", numbered lists, comparison tables, Q&A, stats-with-context, "First in India" claims.

---

## 18. MIGRATION FROM WORDPRESS
Pre-launch: full backup, export content, document URLs, staging test, verify 301s, test forms/calculators, Lighthouse 90+, validate schema, verify GA4, cross-browser, real-device mobile.
301 map: /about-us/→/about-bfi/, /free-calculators/→/calculators/, /our-treatments/→/treatments/, calculator URLs→/calculators/[name]/, /best-ivf-doctors/→/our-team/. Rule: any URL with traffic MUST 301.
DNS cutover: lower TTL to 300s 48h prior → deploy → QA on CF preview → update DNS → propagate → monitor GSC 48h → keep WordPress on backup subdomain 30 days.
Post-launch: Week 1 daily GSC 404/ranking, Weeks 2-4 weekly ranking vs baseline, Month 2 full traffic comparison.

---

## 19. PERFORMANCE
Targets: LCP <2.0s, CLS <0.05, INP <150ms, FCP <1.5s, TTFB <200ms. Next `<Image>` AVIF/WebP, self-hosted fonts swap, route code-split, purged Tailwind + inline critical CSS, async third-party, ISR blog (revalidate 3600), static location+treatment pages. Lighthouse: Perf 90+, A11y 95+, Best Practices 95+, SEO 100.

---

## 20. BUILD APPROACH — Frontend First, Homepage First
**Phase 0 (approval gate): Homepage built FIRST and approved before any other page** — establishes design system + component library. Sequence: design system → homepage all sections pixel-perfect → deploy CF preview → client review/revisions → approved → Phase 1.
- Phase 1: all frontend pages (Sanity content) — Weeks 2-4
- Phase 2: backend in parallel from Week 3 (D1, lead API, WhatsApp, email)
- Phase 3: SEO agents (after content stable)
- Phase 4: QA, migration, launch (Week 6)

---

## APPENDIX A: CONTENT STANDARDIZATION (use these exact facts everywhere)
- Founded: **1984** · IVF pioneered at BFI: **1998**
- Successful pregnancies: **30,000+** (final figure)
- Centers: **15** · Cities: **8**
- Google reviews: **1,800+ five-star**
- International patients: **300+ annually** · Staff: **200+**
- Promoter doctors combined experience: **100+ years**
- Success rate: **98% (Suraksha Kavach package patients)** — always include qualifier
- OHSS: **Zero severe OHSS in 10+ years**
- Labs: **Class 1000** (superior to Class 10,000)
- Awards: **National Fertility Award 2021-2025** (5 consecutive)
- Accreditation: **FOGSI Certified Fertility Training Center**

## APPENDIX B: BRAND VOICE
Warm, expert, hopeful — never clinical/cold/fear-based. The trusted doctor friend. Do: "Your dream of becoming a parent is possible. Here's how we help." Don't: "Infertility is a complex medical condition." Headlines specific/benefit-led/emotional. CTAs action-oriented ("Book Your Free Consultation", not "Submit").

## APPENDIX C: COMPETITORS
Nova IVF, Cloudnine Fertility, Bloom IVF, Oasis Fertility, Indira IVF. BFI's unique edge vs all: **Suraksha Kavach** money-back guarantee (no competitor offers at scale) — primary differentiator in all content/CTAs.

## APPENDIX D: VERIFIED DOCTOR PROFILES (use exactly; client-supplied photos, white coat, no stock)

**Dr. Himanshu Bavishi** — Founder & Senior IVF Specialist. IVF, Obs & Gyn. 35+ yrs. Co-founded BFI 1998. Founder President INSTAR. Awards: Excellence in Medicine (IMA), Shreshti (Gujarat CM). Known for complex cases ("golden hand"). Paldi (Mon-Sat 12-5) / Nikol (Mon-Fri by appt). Fee ₹1,500. +91 9712622288. `/best-ivf-doctors/dr-himanshu-bavishi/`

**Dr. Falguni Bavishi** — Co-Founder & Senior IVF + Embryology Specialist. 34+ yrs. Co-founded 1998. Awards: Shreshti (Gujarat CM). Dual clinical+embryology. Paldi (Mon-Sat 2-5) / Sindhu Bhavan (Mon-Sat 10-2). Fee ₹1,500. `/best-ivf-doctors/dr-falguni-bavishi/`

**Dr. Parth Bavishi** — Co-Director (7 centers/6 cities). IVF, Obs & Gyn; special interest Poor Ovarian Reserve (low AMH), Repeated IVF Failure. 13 yrs. Trained: BFI, Diamond Institute NJ USA, HART Japan. 10,000+ procedures. Author "Your Miracle in Making". Awards: Rose of Paracelsus (European Medical Assoc), Most Prominent IVF Specialist (Gujarat CM), Bharat Excellence. Paldi (Mon-Sat 10-4) / Sindhu Bhavan (Mon-Sat 4-7). Fee ₹1,500. `/best-ivf-doctors/dr-parth-bavishi/` — **default blog author**.

**Dr. Janki Bavishi** — Co-Director (7 centers/6 cities). IVF, Obs & Gyn. 12+ yrs. Trained: BFI, Diamond NJ, HART Japan. 10,000+ procedures. Co-author "Your Miracle in Making". Awards: Gujarat Gaurav Icon (Midday), Nari Tu Narayani (Bulletin India). Paldi (Mon-Sat 10-4). Fee ₹1,500. `/best-ivf-doctors/dr-janki-bavishi/`

**Dr. Suman Singh** — Mumbai Lead Specialist. MBBS, DGO. IVF/Fertility/Gynecology. 20+ yrs. Thane (9167204018, Mon-Sat 10-1) / Ghatkopar (022 2508 8888, Mon-Sat 2-5). Fee ₹1,500. `/best-ivf-doctors/dr-suman-singh/`

Doctor photos: 800×1000px min, 4:5 portrait, clean bg, white coat, warm/approachable, WebP. Alt: "Dr. [Name] — [Specialization] at Bavishi Fertility Institute, [City]". (17 doctors total — remaining profiles to be supplied by client.)

## APPENDIX E: TESTIMONIALS (101 verified — use real, do NOT fabricate; location-specific on location pages)
- **Tier 1:** Live GMB reviews widget (Elfsight/EmbedSocial, per-center Place ID — client to provide 15 Place IDs).
- **Tier 2:** Curated site testimonials (high-emotion stories).
- **Tier 3:** YouTube video testimonials.
Flagship stories: Ramesh Nayak Surat (18 years → success 2023), Sudhakar Komati Mumbai (14 years), Vijay Bhoi Vadodara (age 47, 22-yr marriage, baby girl), Praful Thakkar Vadodara (success at 50 & again at 57), Ruchira Shah (Canada/international), multiple twins. Counts: Ahmedabad 24, Mumbai 24, Surat 16, Vadodara 19, plus Bhuj/Gujarat. Embed YouTube via youtube-nocookie, loading=lazy, VideoObject schema.

## APPENDIX F: SOCIAL PROFILES
- Instagram @bavishi_ivf — instagram.com/bavishi_ivf
- YouTube — youtube.com/channel/UCiqcuW9RTk1rwcNEW6kt9Bg
- Facebook — facebook.com/Bavishifertilityinstitute/
- Twitter/X @Bavishi_IVF — twitter.com/Bavishi_IVF
- LinkedIn — linkedin.com/company/bavishi-fertility-institute
- Pinterest — in.pinterest.com/BavishiIVF/
- WhatsApp +91 9712622288 — api.whatsapp.com/send?phone=919712622288
Footer = all 7 icons (pink hover). Homepage = YouTube testimonial carousel + Instagram feed widget. Floating WhatsApp button all pages. Blog social share buttons. YouTubeEmbed component uses youtube-nocookie, rel=0, modestbranding=1, loading=lazy.

## APPENDIX G: ICONS & IMAGES
Custom medical-fertility line icons (2px stroke, rounded, pink #E91E8C, 48×48). Lucide React for UI. Hero: real happy families, warm light, WebP 1920×1080+, no sterile/stock. Each center ≥5 photos. Lab (Class 1000) photos prominent on Why BFI. Alt-text patterns per type.

## APPENDIX H: VERIFIED AWARDS
National Fertility Award 2021-2025 · Times Healthcare Leaders 2025 · IVF Chain of the Year West (ET, 5th) · Bharat Excellence (Dr. Parth) · Patient Centric Hospital Award · Excellence in Medicine/IMA (Dr. Himanshu) · Shreshti/Gujarat CM (Dr. Himanshu & Falguni) · Rose of Paracelsus/EMA (Dr. Parth) · Most Prominent IVF Specialist/Gujarat CM (Dr. Parth) · Gujarat Gaurav Icon (Dr. Janki) · Nari Tu Narayani (Dr. Janki) · FOGSI Certified Fertility Training Center · Ranked No.1 Best IVF Center in India 2018.

---
*Source: Digital Aura spec v2.0, May 2026. Next review: post-launch ~July 2026.*
