# Visual enrichment plan — High-Risk Pregnancy Due to Diabetes, BP & Thyroid Disorders

URL: `/blogs/high-risk-pregnancy-due-to-diabetes-bp-thyroid-disorders`
Category: Maternity · Author: Dr. Parth Bavishi · Reviewer: Dr. Himanshu Bavishi

## Rendering notes (applies to all insertion points below)
- `photo` → `externalImage` block. Images downloaded + re-uploaded to Sanity CDN. All photo choices are equipment/device shots — no patients depicted.
- `stat-callout` → `statStrip` block (existing, animated).
- `process-flow` → `infographic` block with hand-authored inline SVG (requires the pre-approved `AnimatedInfographic` un-stub fix applied before Phase 2 begins).
- **Skipped: comparison-table.** The live blog already contains a "Risk Comparison Table" (Condition / Risk to Mother / Risk to Baby / Key Management) rendered as a native Lexical table. Proposing a second comparison-table over the same data would be redundant — the slot is intentionally empty here. If that existing table is styled poorly, it can be replaced with a `comparisonTable` block in Phase 2, but that would be cosmetic refactoring of existing content — out of this brief's scope ("do not change blog copy/text content").

## Insertion points

### 1. Stat-callout — after "What is a High-Risk Pregnancy?" (intro section)
- **Type:** stat-callout
- **Exact data (from blog's own Key Statistics section — verbatim):**
  - 12–15 — monitoring visits through a high-risk pregnancy
  - 20 weeks — anatomy scan milestone
  - 12 weeks — first trimester screening point
  - 37–42 weeks — full-term pregnancy range
- **Why here:** The intro sets out what makes a pregnancy "high-risk" in general terms. Dropping these surveillance-cadence numbers immediately after contextualizes the monitoring intensity for a newly-diagnosed high-risk patient — "how closely will I be watched?" is the first question most readers have, and these numbers answer it before the condition-specific sections begin.

### 2. Process-flow infographic — inside "Management Approaches" section (4 phases)
- **Type:** process-flow (via infographic block, 4-step vertical-or-horizontal SVG)
- **Exact data (the blog already numbers these 4 phases — verbatim from text):**
  1. Preconception and Early Pregnancy Care — "optimizing blood sugar, BP, and thyroid levels before conception; safe medication adjustments; nutritional counseling"
  2. Regular Maternal Monitoring — "blood pressure checks; blood sugar monitoring; thyroid function tests; weight and urine protein assessment"
  3. Advanced Fetal Monitoring — "serial growth ultrasounds; Doppler studies for placental blood flow; biophysical profiles (BPP)"
  4. Delivery Planning — "timing based on maternal and fetal health; planned induction or cesarean when required; neonatal care readiness"
- **SVG design:** Four numbered circles (plum fill, white number, gold outline) connected by arrows, with a 1-line label beneath each circle, on an ivory background. No additional data required — purely the numbered steps as written in the article.
- **Why here:** Phase 4 process diagrams are the gold standard visual for a blog that is fundamentally about "what happens in what order during your care plan." The four phases are already clearly delineated in prose — the diagram translates them from reading to scanning.

### 3. Photo — inside "Symptoms Requiring Immediate Medical Attention" section
- **Type:** photo
- **Search query:** "automatic blood pressure cuff monitor wrist white background"
- **Why this paragraph:** The symptoms list opens with "sudden facial, hand, or foot swelling" and "persistent headaches" — all hallmarks of preeclampsia and hypertension. A BP cuff/monitor is the diagnostic device directly tied to hypertension (one of the three title conditions) and the symptom monitoring described in the section. Equipment only, no person.

### 4. Photo — inside "Advanced Fetal Monitoring" subsection
- **Type:** photo
- **Search query:** "Doppler ultrasound probe gel clinical"
- **Why this paragraph:** The fetal monitoring section explicitly lists "Doppler studies for placental blood flow assessment" as a key surveillance technique. An ultrasound Doppler probe with transducer gel on a sterile surface is a specific, accurate image of the named technique — far more informative to a high-risk patient than a generic "scan" or "hospital" stock photo.

### 5. Photo — inside "Prevention Tips — Lifestyle Modifications" section
- **Type:** photo
- **Search query:** "continuous glucose monitor digital display"
- **Why this paragraph:** The Medical Management tips list "strict control of blood sugar" for diabetes alongside BP and thyroid controls. A modern continuous glucose monitor (CGM) device or a glucometer reading is a very specific, instantly-recognizable equipment photo that represents the "diabetes during pregnancy" strand of this multi-condition article — giving that condition its own anchor visual, since BP already has the cuff image (#3) and thyroid has its blood-test visual in the sister blog.

## Blog-listing thumbnail proposal
**Depicts:** Three medical instruments arranged together — a BP cuff, a blood glucose test strip/meter, and a thyroid-function test result printout — on a neutral clinical surface.
**Why it represents the blog:** The blog explicitly covers three conditions (diabetes, BP, thyroid) and the thumbnail should signal all three at a glance. A composed flat-lay of the three corresponding diagnostic instruments achieves this in a single image — no people, directly on-topic, differentiates this card from other single-condition blog cards on the listing page.
