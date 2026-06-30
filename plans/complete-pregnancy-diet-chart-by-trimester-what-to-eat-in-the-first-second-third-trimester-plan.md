# Visual enrichment plan — Complete Pregnancy Diet Chart by Trimester

URL: `/blogs/complete-pregnancy-diet-chart-by-trimester-what-to-eat-in-the-first-second-third-trimester`
Category: Maternity · Author: Dr. Parth Bavishi · Reviewer: Dr. Himanshu Bavishi

## Rendering notes (applies to all insertion points below)
- `photo` → `externalImage` block. Images downloaded + re-uploaded to Sanity CDN. All photo choices are food/ingredient shots — zero people depicted.
- `stat-callout` → `statStrip` block (existing, animated).
- `comparison-table` → `comparisonTable` block (existing).
- `infographic` / `process-flow` → `infographic` block with hand-authored inline SVG (requires the pre-approved `AnimatedInfographic` un-stub fix applied before first Phase 2 execution).
- This blog is the most data-rich of the five; every proposed visual maps 1:1 to text that already exists in the article.

## Insertion points

### 1. Stat-callout — after "Why Pregnancy Nutrition Matters" (before First Trimester section)
- **Type:** stat-callout
- **Exact data (from blog's own Key Statistics section):**
  - 400 µg — daily folic acid recommendation
  - 40 weeks — full-term pregnancy duration
  - 25,000+ — successful IVF pregnancies (Bavishi Fertility Institute)
  - 12 weeks — first trimester screening point
- **Why here:** Opens the practical section of the article with an anchor — shows readers the critical number (400 µg) they need before the trimester-by-trimester content begins, creating a purpose-driven lead-in.

### 2. Photo — inside "First Trimester (Week 1–12)" after sample meal plan
- **Type:** photo
- **Search query:** "Indian poha breakfast bowl morning light"
- **Why this paragraph:** The sample Indian meal structure explicitly lists "Vegetable poha, oats porridge, or boiled eggs with whole wheat toast" for breakfast. Photographing the exact named dish (poha) rather than a generic "healthy breakfast" photo ties the visual directly to the claim being made — a reader unfamiliar with Indian foods gets a concrete reference point.

### 3. Comparison-table — after all three trimester sections (before "Foods to Avoid" section)
- **Type:** comparison-table
- **Exact data (from blog text — three trimester summaries, nothing invented):**

  | | First Trimester (Wk 1–12) | Second Trimester (Wk 13–27) | Third Trimester (Wk 28–Delivery) |
  |---|---|---|---|
  | Key nutrient focus | Folic acid, iron, B6, choline | Calcium, iron, omega-3, vitamin D | Iron, fibre, protein |
  | Hydration target | Normal intake | 2.5–3 litres/day | Limit salt to reduce swelling |
  | Expected weight gain | 1–2 kg | 4–5 kg | 5–6 kg |
  | Key avoid | Raw papaya, excess caffeine | Fried/junk food | Excess sugar (gestational diabetes risk) |

- **Why here:** The three trimester sections each contain the same four categories of information (nutrients / hydration / weight / avoids) written in prose. Collapsing this into one table lets readers compare across trimesters at a glance — the single most useful view for a pregnant reader planning a meal schedule.

### 4. Process-flow infographic — for "Weight Gain Guidelines by Trimester"
- **Type:** process-flow (via infographic block, 3-stage horizontal bar / step chart SVG)
- **Exact data (verbatim from blog):**
  - First trimester: 1–2 kg
  - Second trimester: 4–5 kg
  - Third trimester: 5–6 kg
  - Note from blog: "Varies based on pre-pregnancy BMI"
- **SVG design:** Three horizontal rectangles or arcs labeled T1 → T2 → T3 with weight numbers inside, in the plum/rose/gold gradient palette, with cumulative total (10–13 kg typical range) shown as a footer annotation. No external data — purely the numbers the article already states.
- **Why here:** Weight gain is already broken out into a three-bullet list. A stepped visual (each stage wider/larger than the last) communicates the accelerating nature of weight gain across trimesters far better than three sentences can.

### 5. Photo — inside "Foods to Avoid During Pregnancy" section
- **Type:** photo
- **Search query:** "raw papaya cut open tropical fruit"
- **Why this paragraph:** The avoids list explicitly names "raw papaya" as the first item. A real photograph of an unripe green papaya being cut (revealing the interior seeds) is a specific, educational image tied to a named claim — not a generic "avoid" / red-X stock graphic. It's also one of the most important (and often surprising) avoids for South-Asian readers who regularly eat green papaya.

## Blog-listing thumbnail proposal
**Depicts:** A flat-lay overhead shot of a traditional Indian thali plate with small portions of dal, leafy greens, curd, and roti — exactly the meal pattern described in the first, second, and third trimester sample plans.
**Why it represents the blog:** The thali visual immediately communicates "Indian pregnancy diet" to the target audience — more specific and recognizable than a generic salad-bowl or supplement-capsule photo. No person visible.
