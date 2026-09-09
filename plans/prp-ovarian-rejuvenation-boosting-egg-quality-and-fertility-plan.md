# Visual enrichment plan — PRP Ovarian Rejuvenation: Boosting Egg Quality and Fertility

URL: `/blogs/prp-ovarian-rejuvenation-boosting-egg-quality-and-fertility`
Category: Female Infertility · Author: Dr. Parth Bavishi · Reviewer: Dr. Himanshu Bavishi

## Rendering notes (applies to all insertion points below)
- `photo` → `externalImage` Lexical block (already exists, already renders). Source image will be **downloaded and re-uploaded to Sanity's asset CDN** (not hot-linked from pexels.com — the renderer currently hard-blocks any URL containing `pexels.com`). Needs a free Pexels/Unsplash API key or manual curation in Phase 2 — flagged separately.
- `process-flow` and `infographic` → `infographic` Lexical block, rendered as **hand-authored inline SVG** matching the plum (`--plum`)/rose (`--rose`)/gold (`--gold`) palette. Currently this block renders nothing (`AnimatedInfographic` is a stub `return null`) — re-enabling it is a pre-approved 1-file change (`src/components/article-blocks.tsx`) that happens once, before the first blog goes live, and affects no other content because the block currently renders nothing anywhere on the site.
- `stat-callout` → `statStrip` block (existing, working, animated counters).
- `comparison-table` → `comparisonTable` block (existing, working).
- No people in any photo — all photo picks below are equipment/process shots to sidestep the AI-fake-patient risk entirely.

## Insertion points

### 1. Photo — after "What is PRP ovarian rejuvenation?"
- **Type:** photo
- **Search query:** "centrifuge separating blood plasma"
- **Why this paragraph:** The section's defining sentence is "PRP therapy involves injecting platelet-rich plasma (PRP) into the ovaries... The plasma is derived from the patient's own blood." A centrifuge mid-spin with visibly separated blood layers (red cells / buffy coat / golden plasma) is the literal, specific visual of what PRP *is*, not a generic "fertility" stock shot.

### 2. Process-flow — after "How does PRP ovarian rejuvenation work?"
- **Type:** process-flow (via infographic block, 3-step horizontal SVG)
- **Exact data (from blog text, verbatim 3 steps):**
  1. "Blood is drawn and processed to extract PRP"
  2. "PRP is injected into the ovaries under ultrasound guidance"
  3. "Growth factors stimulate ovarian regeneration, improving egg quality and quantity"
- **Why here:** This is already a literal numbered 3-step process in the source text — turning it into a step diagram is a direct visual translation, zero invented content.

### 3. Stat-callout — after "Benefits of PRP ovarian rejuvenation" / before "What to expect"
- **Type:** stat-callout
- **Exact data (from the blog's own "Statistics Mentioned" section):**
  - 70–90% — conception success rate in PCOS treatment
  - 90% — egg survival rate with vitrification
  - 25,000+ — successful IVF pregnancies at the institute
  - 14 — fertility centers across India
- **Why here:** Breaks up the run of bullet lists (Who needs it / Benefits) with credibility numbers right before the procedure-detail and success-story sections.

### 4. Photo — near "What to expect during the procedure?"
- **Type:** photo
- **Search query:** "ultrasound guided injection procedure"
- **Why this paragraph:** Directly illustrates "PRP is injected into the ovaries under ultrasound guidance... under local anesthesia or sedation" — ties to the specific guidance method named in the text, not a generic operating-room photo.

### 5. Comparison-table — replacing the flat "Success stories" bullet list
- **Type:** comparison-table
- **Exact data (from the blog's existing 3 success-story bullets — reformatted, nothing invented):**

  | Patient Profile | Condition | Outcome |
  |---|---|---|
  | 38-year-old | Diminished ovarian reserve | Achieved pregnancy after PRP therapy + IVF |
  | 42-year-old | Poor egg quality | Successful pregnancy using own eggs after PRP treatment |
  | 35-year-old | PCOS | Achieved pregnancy after PRP therapy + ICSI |

- **Why here:** The three bullets already contain age/condition/outcome — a table makes the pattern ("PRP + standard protocol → pregnancy across different diagnoses") scannable instead of three separate sentences.

## Blog-listing thumbnail proposal
**Depicts:** A close-up of a blood-collection tube showing the separated golden plasma layer (same visual as insertion #1, cropped for card aspect ratio), warm-lit against a neutral background.
**Why it represents the blog:** PRP *is* the topic — showing the literal substance (golden plasma) is more specific and trustworthy than a generic "woman holding belly" or "doctor with clipboard" thumbnail, and avoids implying a depicted patient/outcome that isn't real.
