# Doctor Feedback Tracker — "new website changes" Google Doc

Source: https://docs.google.com/document/d/1jaM-Y_HidQBsg1hP6pKd6bd1pwHiUVF7LvEN-w5ZmOQ (4 tabs)
Pulled verbatim via `/export?format=txt` on 2026-07-31.

**STATUS: ALL 4 TABS COMPLETE.** Every page in this doc has been implemented, previewed, verified, and merged to production. Last page (Suraksha Kavach + Easy EMI) merged 2026-07-31 (`3cc456d`).

---

## Tab 1 — "Home Page" (covers Homepage + /treatments/ivf)
Matches `public/bugs/new website changes.docx`. Complete — done in an earlier session.

## Tab 2 — "Treatment Pages-1"
Matches `public/bugs/new website treatment pages changes.docx`. Complete except two deliberately-hidden pages (Embryo Donation — ART Act compliance; Varicocele — full rewrite deferred with user's OK, spec captured in [[treatment-pages-bugdocs-progress]] memory).

## Tab 3 — "Treatment Pages-2"
Matches `public/bugs/new website 2 treatment pages changes.docx`. Complete — done in an earlier session.

## Tab 4 — "About BFI Page" — ✅ COMPLETE (all 6 pages, done 2026-07-31)

### About BFI (`/about-bfi`) — merged `9d7c980`
Hero heading, founding/history paragraphs (incl. book title fix "Viknadog"→"Vighnadod"), Values card, "time-lapse imaging"→"Latest gen ICSI" (2 spots), treatment tag renames, "Firsts" section rebuilt to the doctor's exact 6 (added First IMA Award / IVF Babies Meet / TV Series & Books from ivfclinic.com/unique-achievement/).

### Why BFI (`/why-bfi`) — merged `4b85d87`
Stat 25k→30k (2 spots), reordered 4 cards in the "12 reasons" grid per doctor's handwritten sequence (7,6,4,5,8,9). Timeline section: doctor decided to **keep** it.

### Simple / Safe / Smart Treatment + Success Benchmarks
Turned out the doc's "Simple/Safe/Smart/Successful" feedback maps to **separate dedicated pages**, not sections of Why BFI:
- **Simple Treatment** (`1850668`): step renamed "Simple Treatment", "in minimum dosage"→"for optimum response" (2 spots), pull-quote replaced.
- **Safe Treatment** (`8b736e7`): hero subhead rewritten, "Pandemic Safety"→"Clinical Safety", eSET→"Personalised Embryo Transfer", checklist updated (kept Bacterial Contamination monitoring per user, removed Full PPE item). Root-caused and fixed a real bug: `Counter` component (shared, sitewide) could get stuck at 0 if already in-viewport on mount — added `getBoundingClientRect` fallback (`e73da60`).
- **Smart Treatment + Success Benchmarks** (`0bfcefc`, `82b566c`): "Parsimonious"→"Calibrated" everywhere (grepped clean, 6 total instances across both pages + meta descriptions), pICSI/IMSI "when indicated", time-lapse removed, Adaptive Excellence, closing CTA replaced, fixed a real image-crop bug (unique-ivf-packages.png forced into wrong aspect ratio, clipping its heading).

### History (`/history`) — merged `e250ff0`, `ed404bf`
Renders `ABOUT_DEFAULTS.milestones` from `src/lib/about.ts` (not the page component's own dead/unused local array — this tripped up the first pass, corrected after user provided a live screenshot). 25k→30k, 2002→2004 fix, PGD split into its own standalone 2002 entry, 2005 HQ line, Endoscopy renamed, 2008→2010 Mumbai&Delhi date correction (+ reordered so 2009 renders before 2010), 2009/2011/2013/2014/2017/2018/2020 wording fixes, 2025 Bhavnagar addition, 2026 Anand & Varanasi addition.

### Our Team → Our Doctors — merged `f040a56`
Renamed the nav item only (destination `/doctors` page already doctor-only). Audited sitewide: footer already said "All Doctors"; Infrastructure page's separate "Our Team" eyebrow covers embryologists/counsellors/nurses too, left as-is (different context); easy-emi's "Talk to Our Team" is a generic support CTA, left as-is.

### Infrastructure (`/infrastructure`) — merged `8554852`
Single stat fix, 25k→30k pregnancies.

### Suraksha Kavach + Easy EMI — merged `3cc456d`
Biggest batch. 25k→30k (multiple spots), hid the "We don't stop until you're holding your baby" promise banner, removed "Priority Care & Attention" and "Transferable Package" cards, removed the "Can I transfer my package" FAQ. Per user's explicit call, also stripped remaining transfer/promise language from every other spot found (Financial Peace of Mind card, intro paragraph, remaining FAQ answers, meta/OG descriptions, JSON-LD FAQ schema — kept all in sync). On Easy EMI: removed the whole SKP promo section, replaced "Multi-Cycle Package" with a "Suraksha Kavach Package" card (Three-Cycle now carries "Best Value"), merged UPI+Net Banking into one payment card and added a dedicated "0% Interest EMI" card per user's explicit call, removed Amex/digital wallets, eyebrow "Value-Based"→"Calibrated Packages".

---

## Resolved clarifications (for reference)
1. "Vighnadod" — confirmed correct spelling by user (doc's plain-text export had mangled it to "Viknadog"/"Vighnadod" inconsistently)
2. Why BFI card reorder sequence — user provided handwritten numbers: 7,6,4,5,8,9
3. Suraksha Kavach "hide this" = the whole "holding your baby" promise banner section; the FAQ to remove = "Can I transfer my package to someone else?"
4. Our Team → renamed to "Our Doctors" (nav label only)
