# Visual enrichment plan — IVF for Women with Thyroid Disorders: What Patients Should Know

URL: `/blogs/ivf-for-women-with-thyroid-disorders-what-patients-should-know`
Category: IVF · Author: Dr. Parth Bavishi · Reviewer: Dr. Himanshu Bavishi

## Rendering notes (applies to all insertion points below)
- `photo` → `externalImage` block. Images will be downloaded and re-uploaded to Sanity CDN (not hot-linked from pexels.com — the renderer blocks that domain). No people in photo choices below.
- `stat-callout` → `statStrip` block (animated counters, existing).
- `comparison-table` → `comparisonTable` block (existing).
- `infographic` / `process-flow` → `infographic` block + hand-authored SVG (requires the pre-approved `AnimatedInfographic` un-stub fix done before first blog Phase 2 runs).
- **Important coordination note:** The live blog already contains a "Management Timeline Table" (TSH targets / medication / monitoring by IVF phase) rendered as a native Lexical table. The new comparison-table proposed below (insertion #3) covers a *different* dimension (condition type vs. management approach, not IVF phase) — it is complementary, not a duplicate. During Phase 2 review, confirm both are visible and non-redundant before committing.

## Insertion points

### 1. Photo — after "Understanding Thyroid Disorders and Fertility" (intro section)
- **Type:** photo
- **Search query:** "thyroid function blood test vials laboratory"
- **Why this paragraph:** The intro states "Regular blood tests... monitor thyroid levels" — glass blood-collection vials in a diagnostic lab directly illustrates the TSH monitoring that is central to the entire article's premise. Avoids depicting a patient or exam room; stays equipment-only.

### 2. Stat-callout — after "IVF and Thyroid Disorders: What to Expect?"
- **Type:** stat-callout
- **Exact data (from blog's own Key Statistics section + management table):**
  - TSH target: Under 2.5 mIU/L — before starting IVF (from management timeline table in the article)
  - 55–65% — IVF success rate for women under 35 (from Key Statistics)
  - 2–3 weeks — duration of one IVF cycle (from Key Statistics)
  - Stable TSH — key to "Good" outcome during stimulation (from the table's final row)
- **Why here:** Drops concrete, reassuring numbers immediately after the "what to expect" prose — shows that thyroid patients CAN have IVF success when controlled, before the reader hits the "Challenges" section.

### 3. Comparison-table — inside "Challenges and Solutions" section
- **Type:** comparison-table
- **Exact data (from blog text, three named conditions — nothing invented):**

  | Condition | Effect on IVF | Key Management |
  |---|---|---|
  | Hypothyroidism | May need higher thyroid hormone doses during IVF | Adjust thyroxine dose; monitor TSH regularly |
  | Hyperthyroidism | Requires careful oversight to prevent complications | Close supervision throughout stimulation |
  | Thyroid antibodies | Presence may reduce IVF success rates | Test before IVF; factor into treatment plan |

- **Why here:** The three challenges are listed in prose as separate paragraphs. A table makes the Condition → Effect → Management mapping scannable in a single glance, which is exactly the question a thyroid-disorder patient has when reading this section.

### 4. Photo — inside "Bavishi Fertility Institute: Expert Care for Thyroid Patients"
- **Type:** photo
- **Search query (preferred option A — use existing real doctor asset):** The site already has real doctor/team photos in the CMS Doctors collection. Pull Dr. Parth Bavishi's profile photo (already in Sanity) and use that as an authentic clinic team visual here rather than any stock photo. No new asset needed — reference the existing avatar URL.
- **Fallback search query (if existing photo isn't the right format/aspect ratio for inline content):** "fertility clinic consultation room modern"
- **Why here:** The section introduces "our team" — a real clinic photo serves EEAT better than stock, and the site already has genuine photography on record.

## Blog-listing thumbnail proposal
**Depicts:** A close-up of a thyroid-function blood test report form with sample vials — clinical, diagnostic, no people depicted.
**Why it represents the blog:** Thyroid disorders are diagnosed and managed through blood testing; showing the test form + vials is a specific, accurate visual of the blog's core topic (managing thyroid levels through IVF), not a generic pregnancy stock image. It differentiates this card from the pregnancy/fertility blog cards on the listing page.
