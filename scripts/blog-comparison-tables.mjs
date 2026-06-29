/**
 * blog-comparison-tables.mjs — UNIQUE comparison table per blog, keyed by slug.
 *
 * Goal: NO two blogs share the same table. Each is authored to the specific
 * topic of that post. Compact authoring format:
 *
 *   "slug": {
 *     rowHeader: "Left column header",
 *     columns: ["Col A", "Col B", ...],     // 1-4 columns
 *     rows: [
 *       ["Row label", "cell A", "cell B"],  // cells must match columns length
 *       ...
 *     ],
 *   }
 *
 * patch-blog-tables.mjs expands this into the Payload comparisonTable shape and
 * replaces ONLY the comparisonTable block on the matching live blog.
 */

export const TABLES = {
  // ───────────────────────── PCOS / FEMALE ─────────────────────────
  "top-fertility-treatments-for-women-with-pcos": {
    rowHeader: "Treatment",
    columns: ["How It Helps", "Success / Notes"],
    rows: [
      ["Letrozole", "First-line ovulation induction", "~80% ovulate, 25-30% conceive/cycle"],
      ["Clomiphene", "Older oral ovulation drug", "Ovulation ~70%, more side effects"],
      ["Metformin", "Improves insulin resistance", "Helps insulin-resistant PCOS"],
      ["Ovarian drilling", "Laparoscopy for drug-resistant cases", "Restores ovulation in ~50%"],
      ["IVF", "When other options fail", "55-65% per cycle under 35"],
    ],
  },
  "how-to-improve-ovulation-naturally-when-you-have-pcos": {
    rowHeader: "Natural Strategy",
    columns: ["What To Do", "Effect on Ovulation"],
    rows: [
      ["Weight loss", "Lose 5-10% body weight", "Can restore regular cycles"],
      ["Low-GI diet", "Cut refined carbs & sugar", "Lowers insulin, aids ovulation"],
      ["Myo-inositol", "Supplement daily", "Improves egg quality & cycles"],
      ["Exercise", "30-40 min, 5×/week", "Boosts insulin sensitivity"],
      ["Sleep & stress", "7-9 hrs, lower cortisol", "Balances reproductive hormones"],
    ],
  },
  "pcos-diet-tips-to-support-natural-conception": {
    rowHeader: "Food Group",
    columns: ["Eat More", "Limit / Avoid"],
    rows: [
      ["Carbs", "Whole grains, oats, millets", "White rice, maida, sugar"],
      ["Proteins", "Eggs, fish, lentils, paneer", "Processed & red meat"],
      ["Fats", "Nuts, seeds, olive oil", "Fried & trans fats"],
      ["Dairy", "Low-fat curd, buttermilk", "Full-fat & sweetened dairy"],
      ["Drinks", "Water, green tea", "Soda, packaged juice"],
    ],
  },
  "what-is-the-difference-between-pcod-pcos": {
    rowHeader: "Feature",
    columns: ["PCOD", "PCOS"],
    rows: [
      ["Nature", "Hormonal imbalance, milder", "Metabolic + endocrine disorder"],
      ["Ovaries", "Releases many immature eggs", "Cysts; eggs often not released"],
      ["Severity", "Common, manageable", "More serious, needs treatment"],
      ["Fertility", "Usually conceives with minor help", "Higher infertility risk"],
      ["Long-term risk", "Low", "Diabetes, BP, heart disease"],
    ],
  },
  "lifestyle-changes-that-boost-fertility-in-pcos-women": {
    rowHeader: "Lifestyle Area",
    columns: ["Fertility-Boosting", "Fertility-Harming"],
    rows: [
      ["Weight", "BMI 20-25, steady loss", "Obesity worsens PCOS"],
      ["Diet", "High-fibre, low-GI", "Sugary, refined carbs"],
      ["Activity", "Regular moderate exercise", "Sedentary routine"],
      ["Habits", "No smoking or alcohol", "Smoking, alcohol"],
      ["Mind", "Yoga, good sleep", "Chronic stress, poor sleep"],
    ],
  },
  "from-diagnosis-to-conception-managing-pcos-for-a-healthy-pregnancy": {
    rowHeader: "Stage",
    columns: ["Focus", "Action at BFI"],
    rows: [
      ["Diagnosis", "Confirm PCOS", "Ultrasound, AMH, hormone panel"],
      ["Pre-conception", "Optimise metabolism", "Weight, diet, metformin if needed"],
      ["Ovulation", "Trigger egg release", "Letrozole + follicular scans"],
      ["Conception", "Time intercourse / IUI", "Tracked ovulation"],
      ["Early pregnancy", "Lower miscarriage risk", "Progesterone support, monitoring"],
    ],
  },
  "unlocking-hope-getting-pregnant-with-pcos-and-irregular-periods": {
    rowHeader: "Cycle Issue",
    columns: ["Why It Happens", "How We Manage It"],
    rows: [
      ["Irregular periods", "No regular ovulation", "Ovulation induction drugs"],
      ["Missed ovulation", "High androgens / insulin", "Metformin + letrozole"],
      ["Lining problems", "Hormonal imbalance", "Hormonal correction + scan"],
      ["Unpredictable timing", "Hard to time conception", "Follicular tracking"],
      ["Low odds", "Combined factors", "IUI / IVF if needed"],
    ],
  },
  "what-is-the-relationship-between-pcos-and-amh-level": {
    rowHeader: "Parameter",
    columns: ["PCOS Ovaries", "Normal Ovaries"],
    rows: [
      ["AMH level", "Often high (>4-6 ng/mL)", "1-3.5 ng/mL typical"],
      ["Antral follicles", "Many (>20 per ovary)", "5-12 per ovary"],
      ["Egg quantity", "High reserve", "Age-appropriate"],
      ["Ovulation", "Often irregular / absent", "Regular monthly"],
      ["IVF response", "Risk of OHSS over-response", "Predictable response"],
    ],
  },
  "the-link-between-pcos-and-infertility": {
    rowHeader: "PCOS Effect",
    columns: ["What Happens", "Fertility Impact"],
    rows: [
      ["Anovulation", "No egg released", "Main cause of infertility"],
      ["High androgens", "Excess male hormones", "Disrupts the cycle"],
      ["Insulin resistance", "High insulin levels", "Worsens hormone imbalance"],
      ["Egg quality", "Can be affected", "Lower conception per cycle"],
      ["Endometrium", "Irregular shedding", "Implantation challenges"],
    ],
  },
  "tips-for-getting-pregnant-faster-with-pcos-a-step-by-step-guide": {
    rowHeader: "Step",
    columns: ["Action", "Why It Helps"],
    rows: [
      ["1. Track cycles", "Use ovulation kits / app", "Find your fertile window"],
      ["2. Lose weight", "5-10% reduction", "Restores ovulation"],
      ["3. Fix diet", "Low-GI, high protein", "Controls insulin"],
      ["4. Supplements", "Inositol, folic acid, Vit D", "Improves egg quality"],
      ["5. See a specialist", "If no luck in 6-12 months", "Letrozole / IUI / IVF"],
    ],
  },
  "12-tips-for-getting-pregnant-faster-with-pcos-a-step-by-step-guide": {
    rowHeader: "Step",
    columns: ["Action", "Why It Helps"],
    rows: [
      ["1. Track cycles", "Use ovulation kits / app", "Find your fertile window"],
      ["2. Lose weight", "5-10% reduction", "Restores ovulation"],
      ["3. Fix diet", "Low-GI, high protein", "Controls insulin"],
      ["4. Supplements", "Inositol, folic acid, Vit D", "Improves egg quality"],
      ["5. See a specialist", "If no luck in 6-12 months", "Letrozole / IUI / IVF"],
    ],
  },
  "ivf-pregnancy-with-pcos-and-endometriosis": {
    rowHeader: "Condition",
    columns: ["PCOS", "Endometriosis"],
    rows: [
      ["Main problem", "Anovulation, high AMH", "Inflammation, low reserve"],
      ["IVF risk", "OHSS (over-response)", "Fewer eggs retrieved"],
      ["Protocol", "Antagonist + freeze-all", "Long down-reg / surgery first"],
      ["Egg yield", "High count", "Lower count, quality focus"],
      ["Outcome", "Good with OHSS control", "Good with tailored protocol"],
    ],
  },

  // ───────────────────────── LETROZOLE ─────────────────────────
  "how-does-letrozole-help-with-ovulation-and-pregnancy": {
    rowHeader: "Aspect",
    columns: ["Letrozole", "Clomiphene (Clomid)"],
    rows: [
      ["Drug class", "Aromatase inhibitor", "Estrogen receptor blocker"],
      ["Ovulation rate", "~80%", "~70%"],
      ["Multiple pregnancy", "Lower (~3-5%)", "Higher (~8-10%)"],
      ["Uterine lining", "No thinning", "Can thin the lining"],
      ["Best for", "PCOS, first-line today", "Older alternative"],
    ],
  },
  "how-letrozole-works-a-comprehensive-guide-to-boosting-ovulation-for-fertility": {
    rowHeader: "Cycle Day",
    columns: ["What Happens", "What To Do"],
    rows: [
      ["Day 2-3", "Baseline scan", "Start letrozole 2.5-5 mg × 5 days"],
      ["Day 3-7", "FSH rises, follicles grow", "Take tablets as advised"],
      ["Day 10-12", "Follicle matures", "Tracking scan"],
      ["Day 12-14", "Ready to ovulate", "hCG trigger / timed intercourse"],
      ["Day 14+", "Ovulation occurs", "Natural attempt or IUI"],
    ],
  },
  "how-long-does-it-take-for-letrozole-to-get-out-of-your-system": {
    rowHeader: "Aspect",
    columns: ["Value", "Meaning"],
    rows: [
      ["Half-life", "~45 hours", "Time to halve in blood"],
      ["Full clearance", "~4-5 days", "Out of system after the course"],
      ["Dosing window", "Days 2-6 of cycle", "Taken for only 5 days"],
      ["Ovulation", "~5-7 days after last pill", "Drug gone before ovulation"],
      ["Next steps", "Repeat next cycle if needed", "Adjust dose if no response"],
    ],
  },

  // ───────────────────────── IUI ─────────────────────────
  "iui-vs-ivf-a-breakdown-of-the-procedures-and-what-to-expect": {
    rowHeader: "Feature",
    columns: ["IUI", "IVF"],
    rows: [
      ["Process", "Washed sperm into uterus", "Eggs fertilised in the lab"],
      ["Success / cycle", "10-20%", "55-65% (under 35)"],
      ["Cost / cycle", "₹8,000-15,000", "₹1.5-2.5 lakh"],
      ["Invasiveness", "Minimal, no anaesthesia", "Egg retrieval under sedation"],
      ["Best for", "Mild issues, young couples", "Tubal block, severe male factor"],
    ],
  },
  "natural-iui-vs-medicated-iui-which-is-more-effective": {
    rowHeader: "Aspect",
    columns: ["Natural IUI", "Medicated IUI"],
    rows: [
      ["Stimulation", "No fertility drugs", "Letrozole / gonadotropins"],
      ["Eggs released", "Usually 1", "1-3"],
      ["Success / cycle", "8-12%", "15-20%"],
      ["Multiple risk", "Very low", "Slightly higher"],
      ["Best for", "Regular ovulators", "Irregular / unexplained"],
    ],
  },
  "is-iui-painful-everything-you-need-to-know": {
    rowHeader: "Step",
    columns: ["Sensation", "What To Expect"],
    rows: [
      ["Speculum", "Mild pressure", "Like a Pap smear"],
      ["Catheter", "Brief cramp", "Lasts a few seconds"],
      ["Sperm deposit", "Slight fullness", "Painless"],
      ["After", "Mild cramping", "Settles within hours"],
      ["Recovery", "None needed", "Resume normal activity"],
    ],
  },
  "iui-success-rate-what-to-expect-after-iui-treatment": {
    rowHeader: "Factor",
    columns: ["Better Odds", "Lower Odds"],
    rows: [
      ["Age", "Under 35", "Over 38"],
      ["Sperm count", "Normal / mildly low", "Severe male factor"],
      ["Cause", "Unexplained, cervical", "Tubal damage"],
      ["Cycles done", "Within first 3-4", "Beyond 4-6"],
      ["Stimulation", "Monitored medicated cycle", "Unmonitored natural"],
    ],
  },
  "how-does-age-impact-the-success-rate-of-iui-procedures": {
    rowHeader: "Age Group",
    columns: ["IUI Success / Cycle", "Recommendation"],
    rows: [
      ["Under 30", "15-20%", "Good first option"],
      ["30-34", "12-18%", "Try 3-4 cycles"],
      ["35-37", "10-14%", "Limit cycles, consider IVF"],
      ["38-40", "6-10%", "IVF often advised"],
      ["Over 40", "Under 5%", "IVF / donor egg"],
    ],
  },
  "reasons-for-iui-failure-symptoms-and-causes": {
    rowHeader: "Reason",
    columns: ["Cause", "Next Step"],
    rows: [
      ["Egg quality", "Age / low reserve", "IVF or stimulation"],
      ["Sperm factor", "Low count / motility", "ICSI"],
      ["Timing", "Missed ovulation", "Better monitoring"],
      ["Tubal issue", "Blockage", "IVF"],
      ["Implantation", "Lining / uterine factor", "Hysteroscopy, IVF"],
    ],
  },
  "the-essential-dos-and-donts-after-iui-treatment-a-complete-guide": {
    rowHeader: "Topic",
    columns: ["Do", "Don't"],
    rows: [
      ["Activity", "Resume light routine", "Heavy lifting / workouts"],
      ["Rest", "Sleep normally", "Strict bed rest (not needed)"],
      ["Diet", "Balanced, folate-rich", "Smoking, alcohol, raw foods"],
      ["Medication", "Take progesterone as advised", "Skip doses"],
      ["Testing", "Wait 14 days for blood test", "Early home tests"],
    ],
  },
  "how-to-prepare-for-your-first-iui-cycle-tips-and-advice": {
    rowHeader: "Stage",
    columns: ["Step", "Purpose"],
    rows: [
      ["Pre-cycle", "Tests + scans", "Confirm tubes & sperm"],
      ["Day 2-3", "Start stimulation", "Grow follicles"],
      ["Mid-cycle", "Tracking scans", "Time ovulation"],
      ["Trigger", "hCG injection", "Release the egg"],
      ["IUI day", "Sperm wash + insertion", "Place sperm in uterus"],
    ],
  },
  "step-by-step-process-of-an-iui-procedure-what-to-expect": {
    rowHeader: "Step",
    columns: ["What Happens", "Timing"],
    rows: [
      ["1. Monitoring", "Scan follicle growth", "Day 8-12"],
      ["2. Trigger", "hCG injection", "Follicle ~18 mm"],
      ["3. Sperm wash", "Prepare best sperm", "Procedure day"],
      ["4. Insemination", "Catheter into uterus", "~36 hrs post-trigger"],
      ["5. Wait", "Two-week wait", "14 days to test"],
    ],
  },
  "iui-process-explained-what-to-expect-at-every-step": {
    rowHeader: "Phase",
    columns: ["Focus", "Patient Experience"],
    rows: [
      ["Consultation", "Assess fertility", "Tests & counselling"],
      ["Stimulation", "Stimulate ovaries", "Oral pills / injections"],
      ["Monitoring", "Track follicles", "2-3 scan visits"],
      ["Insemination", "Place sperm", "5-min painless procedure"],
      ["Result", "Pregnancy test", "Blood test after 2 weeks"],
    ],
  },
  "iui-side-effects-on-the-body-and-emotions-a-complete-guide": {
    rowHeader: "Type",
    columns: ["Common", "When To Call Doctor"],
    rows: [
      ["Physical", "Mild cramps, spotting", "Heavy bleeding"],
      ["Hormonal", "Bloating, tenderness", "Severe pain / swelling (OHSS)"],
      ["Emotional", "Anxiety, mood swings", "Persistent depression"],
      ["Infection", "Rare", "Fever, foul discharge"],
      ["Duration", "Resolves in days", "Symptoms worsening"],
    ],
  },
  "life-after-iui-precautions-lifestyle-tips-and-what-to-expect": {
    rowHeader: "Area",
    columns: ["Recommended", "Avoid"],
    rows: [
      ["Work", "Normal desk work", "Extreme physical strain"],
      ["Exercise", "Walking, light yoga", "Intense cardio / lifting"],
      ["Diet", "Hydration, nutrients", "Alcohol, smoking"],
      ["Intimacy", "As advised by doctor", "If bleeding or pain"],
      ["Mindset", "Stay relaxed", "Over-testing too early"],
    ],
  },
  "how-to-improve-your-chances-of-iui-success-naturally": {
    rowHeader: "Factor",
    columns: ["Do This", "Benefit"],
    rows: [
      ["Weight", "Reach a healthy BMI", "Better ovulation"],
      ["Diet", "Antioxidant-rich foods", "Improves egg & sperm"],
      ["Supplements", "Folic acid, CoQ10", "Egg / sperm quality"],
      ["Habits", "Quit smoking & alcohol", "Higher success"],
      ["Timing", "Follow monitoring", "Accurate insemination"],
    ],
  },
  "when-to-take-a-pregnancy-test-after-iui-timing-and-accuracy-explained": {
    rowHeader: "Day After IUI",
    columns: ["Test Status", "Reliability"],
    rows: [
      ["Day 7-9", "Too early", "Unreliable"],
      ["Day 10-11", "Possible implantation", "Often false negative"],
      ["Day 14", "Beta hCG blood test", "Most accurate"],
      ["Day 16+", "Home urine test", "Reliable if positive"],
      ["If positive", "Repeat beta in 48h", "Confirm rising hCG"],
    ],
  },

  // ───────────────────────── LOW AMH ─────────────────────────
  "how-to-improve-your-chances-of-conceiving-naturally-with-low-amh-levels": {
    rowHeader: "Strategy",
    columns: ["Action", "Why It Matters"],
    rows: [
      ["Don't delay", "Try sooner", "AMH falls with age"],
      ["Egg quality", "CoQ10, DHEA if advised", "Supports remaining eggs"],
      ["Lifestyle", "No smoking, healthy weight", "Protects ovarian function"],
      ["Timing", "Track ovulation precisely", "Maximise each cycle"],
      ["Specialist", "Early evaluation", "Plan IUI / IVF in time"],
    ],
  },
  "can-ivf-work-with-low-amh": {
    rowHeader: "Aspect",
    columns: ["Low AMH & IVF", "Detail"],
    rows: [
      ["Egg quantity", "Fewer eggs retrieved", "Quality matters more than count"],
      ["Protocol", "Higher stimulation doses", "Or mini / natural IVF"],
      ["Success", "Possible, age-dependent", "Good if eggs are healthy"],
      ["Cycles", "May need more than one", "Accumulate embryos"],
      ["Backup", "Donor eggs if very low", "Discussed openly"],
    ],
  },
  "finding-fertility-options-with-low-amh-a-detailed-guide": {
    rowHeader: "Option",
    columns: ["When Suitable", "What To Expect"],
    rows: [
      ["Natural try", "Mildly low AMH, young", "Time-limited attempt"],
      ["IUI", "Open tubes, normal sperm", "If still ovulating well"],
      ["IVF", "Moderately low AMH", "Tailored stimulation"],
      ["Mini-IVF", "Very low AMH", "Gentler, fewer drugs"],
      ["Donor eggs", "Severely low + age", "High success"],
    ],
  },
  "how-can-i-increase-my-amh-levels": {
    rowHeader: "Approach",
    columns: ["Reality", "Notes"],
    rows: [
      ["Supplements", "Vit D, CoQ10, DHEA", "May support, won't raise AMH much"],
      ["Lifestyle", "Healthy weight, no smoking", "Protects current reserve"],
      ["Diet", "Antioxidant-rich", "Helps the egg environment"],
      ["Medical", "No proven way to raise AMH", "Focus on egg quality"],
      ["Key point", "Act early", "AMH naturally declines"],
    ],
  },
  "natural-conception-with-low-amh-levels": {
    rowHeader: "Factor",
    columns: ["Helps Conception", "Reduces Chances"],
    rows: [
      ["Age", "Younger age", "Over 38"],
      ["Cycle", "Regular ovulation", "Irregular cycles"],
      ["Lifestyle", "Healthy weight, no smoking", "Smoking, obesity"],
      ["Timing", "Tracked fertile window", "Random timing"],
      ["Delay", "Trying now", "Waiting years"],
    ],
  },
  "reasons-behind-low-amh-levels-and-ways-to-increase-it": {
    rowHeader: "Cause of Low AMH",
    columns: ["Why It Happens", "Manageable?"],
    rows: [
      ["Age", "Natural egg decline", "No — but plan early"],
      ["Genetics", "Family early menopause", "Screen & plan"],
      ["Ovarian surgery", "Cyst / endometriosis op", "Preserve tissue"],
      ["Chemo / radiation", "Damages ovaries", "Preserve fertility first"],
      ["Lifestyle", "Smoking, toxins", "Yes — quit smoking"],
    ],
  },
  "reasons-behind-low-amh-levels-ways-to-increase": {
    rowHeader: "Cause of Low AMH",
    columns: ["Why It Happens", "Manageable?"],
    rows: [
      ["Age", "Natural egg decline", "No — but plan early"],
      ["Genetics", "Family early menopause", "Screen & plan"],
      ["Ovarian surgery", "Cyst / endometriosis op", "Preserve tissue"],
      ["Chemo / radiation", "Damages ovaries", "Preserve fertility first"],
      ["Lifestyle", "Smoking, toxins", "Yes — quit smoking"],
    ],
  },
  "innovative-treatments-for-low-amh": {
    rowHeader: "Treatment",
    columns: ["How It Works", "Status"],
    rows: [
      ["PRP ovarian rejuvenation", "Platelet injection into ovary", "Emerging"],
      ["Mini / natural IVF", "Gentle stimulation", "Established"],
      ["DHEA / CoQ10", "Support egg quality", "Adjunct"],
      ["Embryo banking", "Collect over several cycles", "Established"],
      ["Donor eggs", "High-success backup", "Established"],
    ],
  },
  "how-low-amh-affects-menstrual-cycle-regularity": {
    rowHeader: "AMH Status",
    columns: ["Cycle Pattern", "What It Means"],
    rows: [
      ["Normal AMH", "Regular 28-32 days", "Healthy reserve"],
      ["Mildly low", "Slightly shorter cycles", "Early reserve decline"],
      ["Low", "Shorter, irregular", "Fewer follicles"],
      ["Very low", "Skipped periods", "Approaching menopause"],
      ["Action", "Test FSH + AMH", "Plan fertility early"],
    ],
  },

  // ───────────────────────── NEWS / EVENTS / AWARDS ─────────────────────────
  "bavishi-fertility-institute-expands-to-bhavnagar-with-state-of-the-art-ai-enabled-ivf-and-womens-hospital": {
    rowHeader: "Highlight",
    columns: ["Details"],
    rows: [
      ["New centre", "Bhavnagar, Gujarat"],
      ["Specialty", "AI-enabled IVF & women's hospital"],
      ["Lab", "State-of-the-art embryology unit"],
      ["Network", "8th city in the BFI family"],
      ["Impact", "Advanced fertility care in Saurashtra"],
    ],
  },
  "bavishi-fertility-institute-honoured-at-times-healthcare-leaders-awards-2025": {
    rowHeader: "Highlight",
    columns: ["Details"],
    rows: [
      ["Award", "Times Healthcare Leaders Award 2025"],
      ["Category", "Excellence in fertility care"],
      ["Recipient", "Bavishi Fertility Institute"],
      ["Recognised for", "Leadership in reproductive medicine"],
      ["Legacy", "IVF pioneers since 1986"],
    ],
  },
  "bavishi-fertility-institute-wins-ivf-chain-of-the-year-west-for-5th-time": {
    rowHeader: "Highlight",
    columns: ["Details"],
    rows: [
      ["Award", "IVF Chain of the Year – West"],
      ["Milestone", "Won for the 5th time"],
      ["Region", "Western India"],
      ["Significance", "Sustained clinical excellence"],
      ["Network", "14 centres across 8 cities"],
    ],
  },
  "bavishi-fertility-institute-wins-patient-centric-hospital-award": {
    rowHeader: "Highlight",
    columns: ["Details"],
    rows: [
      ["Award", "Patient-Centric Hospital Award"],
      ["Focus", "Compassionate, personalised care"],
      ["Recipient", "Bavishi Fertility Institute"],
      ["Why", "Patient-first treatment approach"],
      ["Reach", "Across all BFI centres"],
    ],
  },
  "dr-parth-bavishi-honoured-with-the-prestigious-achiever-award-at-fertivision-2025": {
    rowHeader: "Highlight",
    columns: ["Details"],
    rows: [
      ["Honoree", "Dr Parth Bavishi"],
      ["Award", "Achiever Award"],
      ["Event", "FertiVision 2025"],
      ["Field", "Assisted reproduction"],
      ["Recognised for", "Contribution to IVF"],
    ],
  },
  "dr-parth-bavishi-wins-bharat-excellence-award-for-ivf": {
    rowHeader: "Highlight",
    columns: ["Details"],
    rows: [
      ["Honoree", "Dr Parth Bavishi"],
      ["Award", "Bharat Excellence Award"],
      ["Domain", "IVF & fertility"],
      ["Significance", "National recognition"],
      ["Institute", "Bavishi Fertility Institute"],
    ],
  },

  // ───────────────────────── EMBRYO / TRANSFER / IMPLANTATION ─────────────────────────
  "choosing-between-a-day-5-vs-day-3-embryo-transfer": {
    rowHeader: "Factor",
    columns: ["Day 3 Transfer", "Day 5 (Blastocyst)"],
    rows: [
      ["Embryo stage", "6-8 cells (cleavage)", "100+ cells (blastocyst)"],
      ["Implantation rate", "20-25% per embryo", "40-50% per embryo"],
      ["Selection", "Less natural selection", "Only strongest survive"],
      ["Best for", "Few embryos / older patients", "Several good embryos"],
      ["PGT testing", "Limited", "Ideal for biopsy"],
    ],
  },
  "frozen-vs-fresh-embryo-transfer-which-is-better": {
    rowHeader: "Aspect",
    columns: ["Fresh Transfer", "Frozen (FET)"],
    rows: [
      ["Timing", "Same cycle as retrieval", "Later, separate cycle"],
      ["Uterine lining", "Affected by stimulation", "Natural, receptive lining"],
      ["OHSS risk", "Higher", "Avoided (freeze-all)"],
      ["Success", "Good", "Equal or better in many cases"],
      ["Best for", "Normal responders", "PCOS, high responders, PGT"],
    ],
  },
  "understanding-frozen-embryo-transfer-fet-in-ivf": {
    rowHeader: "Stage",
    columns: ["What Happens", "Purpose"],
    rows: [
      ["Lining prep", "Estrogen tablets / patches", "Build receptive endometrium"],
      ["Monitoring", "Scan lining thickness", "Aim for 7-12 mm"],
      ["Progesterone", "Start before transfer", "Mimic natural cycle"],
      ["Thaw & transfer", "Warm embryo, place in uterus", "98% survive thaw"],
      ["Two-week wait", "Continue support", "Beta hCG test"],
    ],
  },
  "embryo-transfer-procedure-for-in-vitro-fertilization-ivf": {
    rowHeader: "Step",
    columns: ["What Happens", "Patient Experience"],
    rows: [
      ["Preparation", "Full bladder, lining check", "No anaesthesia"],
      ["Catheter loading", "Embryo drawn into catheter", "Done by embryologist"],
      ["Transfer", "Guided by ultrasound", "Quick, painless"],
      ["Placement", "Embryo released in uterus", "Mild pressure only"],
      ["After", "Short rest", "Resume light activity"],
    ],
  },
  "post-embryo-transfer-timeline-what-happens-after-3-5-7-and-9-days": {
    rowHeader: "Day Post-Transfer",
    columns: ["What's Happening", "Notes"],
    rows: [
      ["Day 1-2", "Embryo floats in uterus", "No symptoms expected"],
      ["Day 3-4", "Hatching begins", "Embryo prepares to attach"],
      ["Day 5-6", "Implantation starts", "Light spotting possible"],
      ["Day 7-8", "Implantation completes", "hCG begins to rise"],
      ["Day 9+", "hCG rises", "Wait for blood test"],
    ],
  },
  "what-happens-after-embryo-transfer-day-by-day": {
    rowHeader: "Phase",
    columns: ["Biological Event", "What You May Feel"],
    rows: [
      ["Days 1-2", "Embryo development continues", "Nothing noticeable"],
      ["Days 3-4", "Blastocyst hatches", "Mild cramps possible"],
      ["Days 5-6", "Attachment to lining", "Light spotting"],
      ["Days 7-9", "Implantation deepens", "Fatigue, tenderness"],
      ["Days 10-14", "hCG detectable", "Test day"],
    ],
  },
  "essential-precautions-to-take-after-embryo-transfer-for-ivf-success": {
    rowHeader: "Area",
    columns: ["Do", "Avoid"],
    rows: [
      ["Activity", "Gentle walking", "Heavy lifting, intense exercise"],
      ["Diet", "Balanced, hydrating foods", "Alcohol, smoking, raw seafood"],
      ["Medication", "Progesterone as prescribed", "Skipping doses"],
      ["Heat", "Normal bathing", "Saunas, hot tubs"],
      ["Mind", "Stay calm, rest well", "Stress, early testing"],
    ],
  },
  "nourishing-your-body-after-embryo-transfer-a-comprehensive-guide": {
    rowHeader: "Nutrient",
    columns: ["Eat", "Why It Helps"],
    rows: [
      ["Folate", "Leafy greens, citrus", "Supports early pregnancy"],
      ["Protein", "Eggs, lentils, fish", "Builds healthy tissue"],
      ["Healthy fats", "Nuts, avocado, olive oil", "Hormone balance"],
      ["Iron", "Beans, spinach", "Supports blood supply"],
      ["Hydration", "Water, coconut water", "Aids implantation environment"],
    ],
  },
  "embracing-positivity-activities-to-nurture-your-journey-to-motherhood-after-embryo-transfer": {
    rowHeader: "Activity",
    columns: ["Helpful", "Benefit"],
    rows: [
      ["Gentle movement", "Short walks", "Improves circulation & mood"],
      ["Mindfulness", "Meditation, breathing", "Lowers stress hormones"],
      ["Hobbies", "Reading, music, art", "Positive distraction"],
      ["Connection", "Talk to loved ones", "Emotional support"],
      ["Rest", "Quality sleep", "Aids recovery"],
    ],
  },
  "understanding-negative-signs-after-embryo-transfer-when-to-worry": {
    rowHeader: "Sign",
    columns: ["Usually Normal", "When To Worry"],
    rows: [
      ["Cramping", "Mild, brief", "Severe, persistent pain"],
      ["Spotting", "Light, brief", "Heavy bleeding"],
      ["No symptoms", "Common, still hopeful", "—"],
      ["Bloating", "Mild", "Rapid swelling (OHSS)"],
      ["Mood", "Anxiety", "Severe distress"],
    ],
  },
  "the-miracle-of-implantation-recognizing-the-signs": {
    rowHeader: "Sign",
    columns: ["What It Feels Like", "When"],
    rows: [
      ["Implantation spotting", "Light pink/brown", "Days 6-10 post-ovulation"],
      ["Mild cramping", "Brief twinges", "Around implantation"],
      ["Breast tenderness", "Soreness", "Early hormonal change"],
      ["Fatigue", "Unusual tiredness", "Rising progesterone"],
      ["Confirmation", "Positive hCG test", "10-14 days"],
    ],
  },
  "why-do-some-embryos-not-implant-even-if-they-look-healthy": {
    rowHeader: "Reason",
    columns: ["Cause", "Possible Solution"],
    rows: [
      ["Genetic abnormality", "Chromosome errors", "PGT-A testing"],
      ["Endometrial timing", "Lining not receptive", "ERA test"],
      ["Thin lining", "Poor blood flow", "Hormonal / PRP support"],
      ["Immune factors", "Implantation rejection", "Specialist evaluation"],
      ["Uterine issues", "Polyps, fibroids", "Hysteroscopy"],
    ],
  },
  "why-dont-embryos-stick-key-reasons-you-need-to-know": {
    rowHeader: "Factor",
    columns: ["Problem", "What Helps"],
    rows: [
      ["Embryo quality", "Chromosomal issues", "Blastocyst culture + PGT"],
      ["Lining receptivity", "Wrong window", "ERA-guided transfer"],
      ["Uterine cavity", "Fibroid / polyp / adhesion", "Hysteroscopic correction"],
      ["Hormone support", "Low progesterone", "Luteal support"],
      ["Lifestyle", "Smoking, obesity", "Optimise before transfer"],
    ],
  },
  "boosting-implantation-success-the-power-of-embryo-glue": {
    rowHeader: "Aspect",
    columns: ["Standard Transfer", "With Embryo Glue"],
    rows: [
      ["Medium", "Regular culture media", "Hyaluronan-rich glue"],
      ["Embryo adhesion", "Normal", "Enhanced attachment"],
      ["Best for", "All transfers", "Recurrent failure"],
      ["Implantation", "Standard rate", "Improved in some studies"],
      ["Added risk", "None", "None"],
    ],
  },
  "embryo-glue-a-game-changer-in-ivf-success-rates": {
    rowHeader: "Point",
    columns: ["Detail"],
    rows: [
      ["What it is", "Hyaluronan-rich transfer medium"],
      ["How it works", "Helps embryo stick to lining"],
      ["Best candidates", "Repeated implantation failure"],
      ["Evidence", "May raise implantation & pregnancy"],
      ["Safety", "Well-tolerated, no extra risk"],
    ],
  },
  "the-role-of-endometrial-receptivity-in-ivf-success": {
    rowHeader: "Factor",
    columns: ["Receptive Lining", "Non-Receptive Lining"],
    rows: [
      ["Thickness", "7-12 mm", "Too thin / too thick"],
      ["Timing", "In sync with embryo", "Out of window"],
      ["Blood flow", "Good", "Poor"],
      ["Implantation", "Successful", "Likely to fail"],
      ["Test", "ERA can confirm window", "ERA identifies the issue"],
    ],
  },
  "who-should-consider-a-blastocyst-transfer-in-ivf": {
    rowHeader: "Patient Profile",
    columns: ["Blastocyst Suitable?", "Reason"],
    rows: [
      ["Several good embryos", "Yes", "Allows best selection"],
      ["Planning PGT", "Yes", "Day-5 biopsy preferred"],
      ["Young, good responder", "Yes", "Higher implantation"],
      ["Very few embryos", "Caution", "Risk none reach day 5"],
      ["Repeated day-3 failure", "Yes", "Better selection"],
    ],
  },
  "blastocyst-transfer-in-special-situations-pcos-poor-responders-recurrent-ivf-failure-endometriosis-uterine-factors": {
    rowHeader: "Situation",
    columns: ["Approach", "Why"],
    rows: [
      ["PCOS", "Freeze-all blastocysts", "Avoid OHSS"],
      ["Poor responders", "Cautious culture", "May limit to day 3"],
      ["Recurrent failure", "Blastocyst + PGT", "Better embryo selection"],
      ["Endometriosis", "FET after suppression", "Receptive lining"],
      ["Uterine factors", "Correct first", "Optimise implantation"],
    ],
  },
  "the-journey-to-blastocyst-stage-and-implantation-understanding-your-chances-and-how-bavishi-fertility-institutes-can-help": {
    rowHeader: "Day",
    columns: ["Embryo Stage", "Milestone"],
    rows: [
      ["Day 1", "Fertilisation confirmed", "2 pronuclei seen"],
      ["Day 2-3", "Cleavage (4-8 cells)", "Early division"],
      ["Day 4", "Morula", "Cells compact"],
      ["Day 5-6", "Blastocyst", "Ready for transfer / freeze"],
      ["Day 6-10", "Implantation", "Attaches to lining"],
    ],
  },
  "how-many-embryos-should-be-transferred-risks-of-multiple-pregnancy-explained": {
    rowHeader: "Embryos Transferred",
    columns: ["Pregnancy Chance", "Multiple Risk"],
    rows: [
      ["Single (eSET)", "Excellent with blastocyst", "Very low"],
      ["Two", "Slightly higher", "Twins ~20-30%"],
      ["Three+", "Not higher overall", "High-risk multiples"],
      ["Recommended", "Single in most cases", "Safest for mother & baby"],
      ["Decided by", "Age, embryo quality", "Individualised"],
    ],
  },
  "cracking-opens-the-possibilities-how-laser-assisted-hatching-is-changing-the-game-for-ivf-patients": {
    rowHeader: "Aspect",
    columns: ["Without Hatching", "Laser-Assisted Hatching"],
    rows: [
      ["Shell (zona)", "Embryo hatches alone", "Tiny laser opening made"],
      ["Best for", "Younger patients", "Older eggs, frozen embryos"],
      ["Implantation", "Standard", "May improve in select cases"],
      ["Precision", "—", "Controlled laser"],
      ["Safety", "Standard", "Safe, routine"],
    ],
  },
  "risks-and-benefits-of-laser-assisted-hatching-in-ivf": {
    rowHeader: "Consideration",
    columns: ["Benefit", "Risk / Limit"],
    rows: [
      ["Implantation", "Helps thick-shell embryos", "No benefit for all"],
      ["Frozen embryos", "Eases hatching", "Minimal"],
      ["Older patients", "May improve odds", "Not guaranteed"],
      ["Procedure", "Quick, precise laser", "Rare embryo damage"],
      ["Candidate", "Recurrent failure", "Doctor decides"],
    ],
  },
  "step-by-step-process-of-embryo-freezing-in-an-ivf-cycle": {
    rowHeader: "Step",
    columns: ["Process", "Detail"],
    rows: [
      ["Selection", "Choose viable embryos", "Day 5 blastocysts preferred"],
      ["Cryoprotectant", "Protect cells", "Prevents ice crystals"],
      ["Vitrification", "Flash-freeze", "Ultra-rapid cooling"],
      ["Storage", "Liquid nitrogen at -196°C", "Safe for years"],
      ["Thawing", "Warm when needed", "~98% survival"],
    ],
  },

  // ───────────────────────── ENDOMETRIUM / LINING ─────────────────────────
  "understanding-endometrial-thickness-a-key-factor-in-female-fertility": {
    rowHeader: "Lining Thickness",
    columns: ["Status", "Fertility Impact"],
    rows: [
      ["Under 6 mm", "Too thin", "Poor implantation"],
      ["7-8 mm", "Adequate", "Acceptable for transfer"],
      ["8-12 mm", "Ideal", "Best implantation"],
      ["Over 14 mm", "Too thick", "May need evaluation"],
      ["Check", "Ultrasound", "Before transfer / ovulation"],
    ],
  },
  "understanding-thin-endometrium-causes-impact-and-treatment-options": {
    rowHeader: "Aspect",
    columns: ["Cause", "Treatment"],
    rows: [
      ["Low estrogen", "Hormonal", "Estrogen support"],
      ["Poor blood flow", "Vascular", "Vasodilators, Vit E, L-arginine"],
      ["Scarring (Asherman)", "Past surgery/infection", "Hysteroscopy"],
      ["Past D&C", "Damaged lining", "PRP, regenerative therapy"],
      ["Goal", "Reach 7+ mm", "Optimise before transfer"],
    ],
  },
  "endometrial-lining-remedies-for-abnormal-thickness": {
    rowHeader: "Problem",
    columns: ["Too Thin", "Too Thick"],
    rows: [
      ["Likely cause", "Low estrogen, scarring", "Hormonal imbalance, polyps"],
      ["Symptom", "Light/absent periods", "Heavy bleeding"],
      ["First step", "Estrogen, blood flow aids", "Hormonal workup"],
      ["Procedure", "Hysteroscopy if scarred", "Remove polyp / biopsy"],
      ["Goal", "Build to 7-12 mm", "Restore normal lining"],
    ],
  },
  "endometrial-scratching-before-ivf-evidence-benefits-and-risks": {
    rowHeader: "Aspect",
    columns: ["Benefit", "Risk / Limit"],
    rows: [
      ["Concept", "Minor scratch boosts receptivity", "Evidence is mixed"],
      ["Best for", "Repeated implantation failure", "Not for everyone"],
      ["Timing", "Cycle before transfer", "Must be well-timed"],
      ["Discomfort", "Mild cramping", "Brief spotting"],
      ["Verdict", "Selective use", "Doctor's judgement"],
    ],
  },
  "era-test-explained-does-it-really-improve-egg-quality": {
    rowHeader: "Point",
    columns: ["Detail"],
    rows: [
      ["What ERA tests", "Endometrial receptivity timing"],
      ["What it does NOT do", "Does not change egg quality"],
      ["How", "Biopsy analyses gene expression"],
      ["Result", "Finds your ideal transfer window"],
      ["Best for", "Repeated failed transfers"],
    ],
  },

  // ───────────────────────── ENDOMETRIOSIS ─────────────────────────
  "endometriosis-and-ivf-what-to-expect-and-how-to-prepare": {
    rowHeader: "Stage",
    columns: ["Consideration", "Approach"],
    rows: [
      ["Diagnosis", "Severity affects plan", "Laparoscopy / imaging"],
      ["Pre-IVF", "Suppress active disease", "GnRH agonist if advised"],
      ["Stimulation", "May yield fewer eggs", "Tailored protocol"],
      ["Transfer", "Receptivity can be reduced", "FET after suppression"],
      ["Outcome", "Good with planning", "Individualised care"],
    ],
  },
  "endometriosis-and-gut-health-the-hidden-connection": {
    rowHeader: "Factor",
    columns: ["Gut-Supportive", "Gut-Aggravating"],
    rows: [
      ["Fibre", "Whole grains, vegetables", "Refined carbs"],
      ["Anti-inflammatory", "Omega-3, turmeric", "Processed/fried food"],
      ["Probiotics", "Curd, fermented foods", "Excess sugar"],
      ["Gluten/dairy", "Reduce if sensitive", "Triggers in some"],
      ["Goal", "Lower inflammation", "Ease symptoms"],
    ],
  },
  "endometriosis-and-menopause-what-to-expect-and-how-to-manage-symptoms": {
    rowHeader: "Phase",
    columns: ["What Happens", "Management"],
    rows: [
      ["Perimenopause", "Symptoms may flare", "Symptom relief, monitoring"],
      ["Menopause", "Often improves", "Estrogen drop eases lesions"],
      ["On HRT", "Can reactivate", "Careful HRT choice"],
      ["Pain", "May persist", "Pain management"],
      ["Follow-up", "Rare malignancy risk", "Regular checks"],
    ],
  },
  "can-endometriosis-come-back-after-surgery-recurrence-rates-prevention-tips": {
    rowHeader: "Aspect",
    columns: ["Detail", "Notes"],
    rows: [
      ["Recurrence rate", "20-50% within 5 years", "Depends on severity"],
      ["After surgery", "Symptoms may return", "Not a permanent cure"],
      ["Prevention", "Hormonal suppression", "Reduces recurrence"],
      ["Pregnancy", "Sooner is better", "Conceive before recurrence"],
      ["Monitoring", "Regular follow-up", "Catch early"],
    ],
  },
  "silent-endometriosis-can-you-have-it-without-symptoms": {
    rowHeader: "Type",
    columns: ["Symptomatic", "Silent"],
    rows: [
      ["Pain", "Severe periods, pelvic pain", "Little or none"],
      ["Detection", "Symptoms prompt testing", "Found during infertility workup"],
      ["Fertility", "May be affected", "Can still reduce fertility"],
      ["Diagnosis", "Imaging, laparoscopy", "Often incidental"],
      ["Action", "Treat symptoms + fertility", "Evaluate if trying to conceive"],
    ],
  },

  // ───────────────────────── FIBROIDS ─────────────────────────
  "fibroids-and-ivf-should-you-remove-them-before-treatment": {
    rowHeader: "Fibroid Type",
    columns: ["Effect on IVF", "Remove Before IVF?"],
    rows: [
      ["Submucosal", "Distorts cavity", "Yes — usually remove"],
      ["Intramural (large)", "May lower success", "Case-by-case"],
      ["Intramural (small)", "Little effect", "Often leave"],
      ["Subserosal", "Outside cavity", "Usually leave"],
      ["Decision", "Size & location matter", "Individualised"],
    ],
  },
  "fibroids-and-diet-foods-that-may-help-manage-symptoms-naturally": {
    rowHeader: "Food Type",
    columns: ["May Help", "Better To Limit"],
    rows: [
      ["Vegetables", "Leafy greens, broccoli", "—"],
      ["Fruit", "Citrus, berries", "—"],
      ["Grains", "Whole grains", "Refined carbs"],
      ["Protein", "Fish, legumes", "Red & processed meat"],
      ["Other", "Green tea, fibre", "Alcohol, added sugar"],
    ],
  },
  "fibroids-in-young-women-and-teenagers-early-symptoms-and-myths": {
    rowHeader: "Statement",
    columns: ["Myth", "Fact"],
    rows: [
      ["Age", "Only older women get them", "Can occur in teens"],
      ["Cancer", "Fibroids are cancerous", "Almost always benign"],
      ["Symptoms", "Always painful", "Many are silent"],
      ["Fertility", "Always cause infertility", "Depends on size/location"],
      ["Treatment", "Always need surgery", "Many just monitored"],
    ],
  },
  "how-to-get-pregnant-without-removing-fibroid-or-without-surgery": {
    rowHeader: "Approach",
    columns: ["When It Works", "Notes"],
    rows: [
      ["Watchful waiting", "Small, no cavity distortion", "Monitor growth"],
      ["Medication", "Control symptoms", "Not a cure"],
      ["Timed conception", "Normal cavity", "Track ovulation"],
      ["IUI / IVF", "Other factors present", "Fibroid not blocking"],
      ["Surgery needed", "Cavity distorted", "If conception fails"],
    ],
  },
  "uterine-fibroids-symptoms-causes-and-treatment": {
    rowHeader: "Aspect",
    columns: ["Detail", "Notes"],
    rows: [
      ["Symptoms", "Heavy periods, pelvic pressure", "Many are silent"],
      ["Causes", "Hormones, genetics", "Estrogen-driven growth"],
      ["Diagnosis", "Ultrasound, MRI", "Confirms size/location"],
      ["Treatment", "Medication or surgery", "Based on symptoms"],
      ["Fertility", "Depends on location", "Submucosal most impactful"],
    ],
  },

  // ───────────────────────── MALE / SPERM ─────────────────────────
  "male-infertility-signs-causes-prevention-diagnosis-treatment": {
    rowHeader: "Stage",
    columns: ["Detail", "Notes"],
    rows: [
      ["Signs", "Difficulty conceiving", "Often no obvious symptom"],
      ["Causes", "Low count, motility, varicocele", "Lifestyle, hormonal"],
      ["Diagnosis", "Semen analysis, hormones", "DFI test if needed"],
      ["Treatment", "Lifestyle, surgery, ICSI", "Based on cause"],
      ["Prevention", "Healthy habits", "Avoid heat, smoking"],
    ],
  },
  "male-infertility-signs-causes-treatment": {
    rowHeader: "Stage",
    columns: ["Detail", "Notes"],
    rows: [
      ["Signs", "Trouble conceiving", "Usually symptomless"],
      ["Causes", "Sperm defects, varicocele", "Hormonal, lifestyle"],
      ["Diagnosis", "Semen analysis", "Repeat to confirm"],
      ["Treatment", "Medication, surgery, ICSI", "Cause-specific"],
      ["Outlook", "Often treatable", "ICSI helps severe cases"],
    ],
  },
  "male-infertility-treatment-options-in-ahmedabad-what-you-should-know": {
    rowHeader: "Option",
    columns: ["For", "What It Does"],
    rows: [
      ["Lifestyle changes", "Mild cases", "Improve sperm naturally"],
      ["Medication", "Hormonal issues", "Restore balance"],
      ["Varicocele surgery", "Varicocele", "Improves parameters"],
      ["IUI", "Mild male factor", "Concentrated sperm"],
      ["ICSI", "Severe male factor", "1 sperm per egg"],
    ],
  },
  "how-to-improve-male-infertility": {
    rowHeader: "Factor",
    columns: ["Do", "Avoid"],
    rows: [
      ["Diet", "Antioxidant-rich foods", "Processed food"],
      ["Habits", "Quit smoking & alcohol", "Smoking, excess alcohol"],
      ["Heat", "Keep testes cool", "Saunas, laptops on lap"],
      ["Exercise", "Moderate activity", "Sedentary lifestyle"],
      ["Supplements", "Zinc, CoQ10, folate", "Anabolic steroids"],
    ],
  },
  "the-unseen-struggle-understanding-male-infertility": {
    rowHeader: "Aspect",
    columns: ["Reality", "Notes"],
    rows: [
      ["Prevalence", "~40% of infertility", "Equal to female factor"],
      ["Awareness", "Often overlooked", "Both partners need testing"],
      ["Emotional impact", "Stigma, stress", "Counselling helps"],
      ["Detection", "Simple semen test", "First-line investigation"],
      ["Treatable", "Often yes", "ICSI for severe cases"],
    ],
  },
  "how-male-infertility-affects-ivf-treatment": {
    rowHeader: "Sperm Issue",
    columns: ["Impact on IVF", "Solution"],
    rows: [
      ["Low count", "Fewer sperm to fertilise", "ICSI"],
      ["Poor motility", "Sperm can't reach egg", "ICSI"],
      ["Abnormal shape", "Lower fertilisation", "ICSI / IMSI"],
      ["High DNA damage", "Poor embryos, miscarriage", "Antioxidants, MACS"],
      ["Azoospermia", "No sperm in semen", "Surgical retrieval (TESA)"],
    ],
  },
  "essential-tests-for-male-infertility-what-to-expect": {
    rowHeader: "Test",
    columns: ["What It Checks", "Notes"],
    rows: [
      ["Semen analysis", "Count, motility, shape", "First & key test"],
      ["Hormone panel", "Testosterone, FSH, LH", "Hormonal causes"],
      ["DFI test", "Sperm DNA damage", "If recurrent failure"],
      ["Scrotal ultrasound", "Varicocele, blockages", "Structural issues"],
      ["Genetic test", "Y-chromosome, karyotype", "Severe cases"],
    ],
  },
  "boosting-male-fertility-tips-to-improve-sperm-quality": {
    rowHeader: "Habit",
    columns: ["Helps Sperm", "Harms Sperm"],
    rows: [
      ["Diet", "Fruits, nuts, zinc", "Junk, trans fats"],
      ["Weight", "Healthy BMI", "Obesity"],
      ["Heat", "Loose underwear", "Hot baths, tight wear"],
      ["Substances", "None", "Tobacco, alcohol, drugs"],
      ["Stress", "Managed", "Chronic stress"],
    ],
  },
  "10-foods-that-will-increase-sperm-count-and-5-foods-to-avoid": {
    rowHeader: "Category",
    columns: ["Eat For Sperm Count", "Avoid"],
    rows: [
      ["Nuts & seeds", "Walnuts, pumpkin seeds", "—"],
      ["Greens", "Spinach, broccoli", "—"],
      ["Protein", "Eggs, fish, lean meat", "Processed meat"],
      ["Fruits", "Bananas, berries, citrus", "—"],
      ["Avoid list", "—", "Soy excess, trans fats, alcohol"],
    ],
  },
  "decoding-your-semen-analysis-report-a-simple-guide": {
    rowHeader: "Parameter",
    columns: ["Normal Range", "Below Normal"],
    rows: [
      ["Volume", "≥1.5 mL", "<1.5 mL (hypospermia)"],
      ["Count", "≥15 million/mL", "<15 million (oligospermia)"],
      ["Motility", "≥40% moving", "<40% (asthenospermia)"],
      ["Morphology", "≥4% normal", "<4% (teratospermia)"],
      ["Vitality", "≥58% alive", "Low (necrospermia)"],
    ],
  },
  "understanding-sperm-dna-fragmentation-causes-treatment-and-ivf-options": {
    rowHeader: "Aspect",
    columns: ["Detail", "Notes"],
    rows: [
      ["What it is", "Breaks in sperm DNA", "Normal count can still have it"],
      ["Causes", "Heat, smoking, infection, age", "Oxidative stress"],
      ["DFI normal", "<15-30%", ">30% is high"],
      ["Impact", "Poor embryos, miscarriage", "Even with ICSI"],
      ["Treatment", "Antioxidants, MACS, lifestyle", "Lower fragmentation"],
    ],
  },
  "the-dfi-test-a-crucial-diagnostic-tool-for-male-infertility": {
    rowHeader: "Point",
    columns: ["Detail"],
    rows: [
      ["What DFI measures", "% sperm with DNA damage"],
      ["Normal", "Below 15-30%"],
      ["Why it matters", "Affects embryo & miscarriage"],
      ["When to test", "Recurrent IVF/IUI failure"],
      ["Improvement", "Antioxidants & lifestyle"],
    ],
  },
  "when-to-consider-sperm-dna-fragmentation-testing-in-low-sperm-count-cases": {
    rowHeader: "Situation",
    columns: ["Test DFI?", "Reason"],
    rows: [
      ["Recurrent miscarriage", "Yes", "DNA damage linked"],
      ["Failed IVF/ICSI", "Yes", "Explains poor embryos"],
      ["Unexplained infertility", "Yes", "Normal count may hide damage"],
      ["Older father / smoker", "Yes", "Higher fragmentation"],
      ["Normal fertile history", "Usually no", "Low yield"],
    ],
  },
  "azoospermia-can-you-have-a-baby-with-zero-sperm-count": {
    rowHeader: "Type",
    columns: ["Obstructive", "Non-Obstructive"],
    rows: [
      ["Cause", "Blockage in tubes", "Production problem"],
      ["Sperm made?", "Yes", "Little or none"],
      ["Retrieval", "PESA / TESA", "Micro-TESE"],
      ["Success", "Good", "Variable"],
      ["Fatherhood", "Often possible via ICSI", "Possible if sperm found"],
    ],
  },
  "understanding-male-fertility-azoospermia-vs-oligospermia": {
    rowHeader: "Feature",
    columns: ["Azoospermia", "Oligospermia"],
    rows: [
      ["Definition", "No sperm in semen", "Low sperm count"],
      ["Severity", "More severe", "Mild to severe"],
      ["Count", "Zero", "<15 million/mL"],
      ["Treatment", "Surgical retrieval + ICSI", "Lifestyle, IUI, ICSI"],
      ["Outlook", "Possible with retrieval", "Often treatable"],
    ],
  },
  "teratozoospermia-uncovering-the-causes-symptoms-and-solutions": {
    rowHeader: "Aspect",
    columns: ["Detail", "Notes"],
    rows: [
      ["What it is", "Abnormal sperm shape", "Low % normal forms"],
      ["Normal", "≥4% normal morphology", "<4% is teratozoospermia"],
      ["Causes", "Genetics, heat, toxins", "Oxidative stress"],
      ["Impact", "Lower fertilisation", "Affects natural conception"],
      ["Solution", "ICSI / IMSI, lifestyle", "Select best sperm"],
    ],
  },
  "asthenospermia-understanding-the-condition-and-exploring-assisted-reproductive-technologies-art-options": {
    rowHeader: "Aspect",
    columns: ["Detail", "ART Option"],
    rows: [
      ["What it is", "Poor sperm motility", "—"],
      ["Normal", "≥40% progressive", "Below = asthenospermia"],
      ["Mild", "Slightly low motility", "IUI possible"],
      ["Moderate-severe", "Few moving sperm", "ICSI"],
      ["Improve", "Antioxidants, lifestyle", "Plus ART if needed"],
    ],
  },
  "necrozoospermia-symptoms-causes-and-treatment-options": {
    rowHeader: "Aspect",
    columns: ["Detail", "Notes"],
    rows: [
      ["What it is", "High % dead sperm", "Low vitality"],
      ["Causes", "Infection, heat, toxins", "Long abstinence"],
      ["Diagnosis", "Vitality staining test", "Confirms dead vs alive"],
      ["Treatment", "Treat infection, lifestyle", "Antioxidants"],
      ["ART", "ICSI with viable sperm", "Special selection"],
    ],
  },
  "understanding-hypospermia-signs-symptoms-and-treatment-options": {
    rowHeader: "Aspect",
    columns: ["Detail", "Notes"],
    rows: [
      ["What it is", "Low semen volume", "<1.5 mL"],
      ["Signs", "Reduced ejaculate", "Often noticed by patient"],
      ["Causes", "Blockage, retrograde, hormones", "Frequent ejaculation"],
      ["Diagnosis", "Semen analysis, post-ejaculate urine", "Find cause"],
      ["Treatment", "Treat cause, ART if needed", "ICSI for severe"],
    ],
  },
  "understanding-sperm-cramps-symptoms-causes-diagnosis-treatment": {
    rowHeader: "Aspect",
    columns: ["Detail", "Notes"],
    rows: [
      ["What it is", "Pain around ejaculation", "Pelvic/testicular"],
      ["Causes", "Infection, prostatitis, varicocele", "Sometimes stress"],
      ["Diagnosis", "Exam, ultrasound, urine test", "Rule out infection"],
      ["Treatment", "Antibiotics, anti-inflammatories", "Treat root cause"],
      ["When to see doctor", "Persistent or severe pain", "Avoid self-treating"],
    ],
  },
  "how-do-male-fertility-supplements-impact-ivf-results": {
    rowHeader: "Supplement",
    columns: ["Benefit", "Notes"],
    rows: [
      ["CoQ10", "Sperm energy & motility", "3 months to act"],
      ["Zinc", "Count & testosterone", "Common deficiency"],
      ["Folate", "DNA integrity", "Pairs with zinc"],
      ["Antioxidants", "Lower DNA damage", "Vit C, E, selenium"],
      ["L-carnitine", "Motility", "Supports maturation"],
    ],
  },
  "how-lifestyle-choices-of-both-partners-impact-icsi-success-rates": {
    rowHeader: "Factor",
    columns: ["Improves ICSI", "Lowers ICSI Success"],
    rows: [
      ["Weight", "Healthy BMI both", "Obesity"],
      ["Smoking", "None", "Either partner smoking"],
      ["Alcohol", "Avoid", "Regular intake"],
      ["Diet", "Antioxidant-rich", "Processed food"],
      ["Age", "Younger", "Advanced age both"],
    ],
  },
  "imsi-technique-for-ivf-advanced-sperm-selection-for-better-success": {
    rowHeader: "Aspect",
    columns: ["ICSI", "IMSI"],
    rows: [
      ["Magnification", "200-400×", "6000×+"],
      ["Selection", "Good sperm", "Finest morphology detail"],
      ["Best for", "Standard male factor", "High DNA damage, repeated failure"],
      ["Time", "Standard", "Longer selection"],
      ["Benefit", "Reliable", "May improve outcomes"],
    ],
  },
  "when-is-macs-most-useful-indications-ideal-candidates-limitations": {
    rowHeader: "Aspect",
    columns: ["Detail", "Notes"],
    rows: [
      ["What MACS does", "Removes damaged sperm", "Magnetic sorting"],
      ["Ideal candidate", "High DNA fragmentation", "Recurrent failure"],
      ["Benefit", "Healthier sperm selected", "Better embryos"],
      ["Limitation", "Not for all cases", "Needs enough sperm"],
      ["Combined with", "ICSI / IMSI", "Improves selection"],
    ],
  },
  "is-icsi-better-for-men-with-low-sperm-count": {
    rowHeader: "Scenario",
    columns: ["Conventional IVF", "ICSI"],
    rows: [
      ["Sperm needed", "Thousands per egg", "1 per egg"],
      ["Low count", "May fail to fertilise", "Works well"],
      ["Poor motility", "Sperm may not reach egg", "Injected directly"],
      ["Fertilisation", "Uncertain", "85-90%"],
      ["Best for", "Normal sperm", "Low count / motility"],
    ],
  },

  // ───────────────────────── VARICOCELE ─────────────────────────
  "breaking-free-from-varicocele-pain-3-innovative-ways-to-find-relief": {
    rowHeader: "Option",
    columns: ["How It Helps", "Notes"],
    rows: [
      ["Lifestyle", "Support, cooling", "Mild cases"],
      ["Medication", "Pain relief", "Symptom control"],
      ["Embolisation", "Blocks faulty vein", "Minimally invasive"],
      ["Microsurgery", "Ties off veins", "Best for fertility"],
      ["Goal", "Relieve pain, restore fertility", "Choose by severity"],
    ],
  },
  "can-varicocele-be-treated-without-surgery-exploring-your-options": {
    rowHeader: "Approach",
    columns: ["Non-Surgical", "When Surgery Needed"],
    rows: [
      ["Lifestyle", "Support wear, cooling", "—"],
      ["Pain relief", "Anti-inflammatories", "—"],
      ["Embolisation", "Catheter blocks vein", "Minimally invasive"],
      ["Monitoring", "Mild, no symptoms", "—"],
      ["Surgery", "—", "Pain or infertility persists"],
    ],
  },
  "understanding-varicocele-how-serious-is-the-diagnosis": {
    rowHeader: "Grade",
    columns: ["Description", "Action"],
    rows: [
      ["Subclinical", "Detected only on scan", "Usually monitor"],
      ["Grade 1", "Felt only on straining", "Monitor / treat if symptoms"],
      ["Grade 2", "Felt easily", "Treat if fertility affected"],
      ["Grade 3", "Visible", "Often treated"],
      ["Impact", "May lower sperm quality", "Reversible with treatment"],
    ],
  },

  // ───────────────────────── IVF CORE / PROCESS ─────────────────────────
  "a-guide-to-the-different-types-of-ivf-treatments": {
    rowHeader: "IVF Type",
    columns: ["Stimulation", "Best For"],
    rows: [
      ["Conventional IVF", "Full hormonal stimulation", "Most patients"],
      ["Mini IVF", "Low-dose oral drugs", "Low reserve, OHSS-prone"],
      ["Natural IVF", "No/minimal drugs", "Cannot take hormones"],
      ["ICSI", "Single sperm injected", "Male factor"],
      ["Frozen (FET)", "Stimulate, freeze, transfer later", "PCOS, PGT cycles"],
    ],
  },
  "is-ivf-possible-without-injections-understanding-easy-ivf-and-injection-free-ivf": {
    rowHeader: "Aspect",
    columns: ["Conventional IVF", "Injection-Free / Easy IVF"],
    rows: [
      ["Medication", "Daily injections", "Mostly oral / minimal shots"],
      ["Eggs retrieved", "10-15", "Fewer (1-5)"],
      ["Comfort", "More demanding", "Gentler experience"],
      ["Cost", "Higher", "Lower per cycle"],
      ["Best for", "Standard cases", "Needle-averse, low reserve"],
    ],
  },
  "ivf-stimulation-protocols-a-comprehensive-guide": {
    rowHeader: "Protocol",
    columns: ["How It Works", "Best For"],
    rows: [
      ["Antagonist", "Short, flexible", "PCOS, OHSS risk"],
      ["Long agonist", "Down-regulation first", "Good responders"],
      ["Short/flare", "Quick stimulation", "Older / low reserve"],
      ["Mini stimulation", "Low-dose drugs", "Poor responders"],
      ["Choice", "Tailored to you", "Based on AMH & age"],
    ],
  },
  "dos-and-donts-during-ivf-stimulation-a-comprehensive-guide": {
    rowHeader: "Area",
    columns: ["Do", "Don't"],
    rows: [
      ["Medication", "Inject on time, same hour", "Skip or delay doses"],
      ["Activity", "Light movement", "Intense exercise (twisting)"],
      ["Diet", "Protein, hydration", "Alcohol, smoking"],
      ["Monitoring", "Attend all scans", "Miss appointments"],
      ["Body signals", "Report bloating/pain", "Ignore OHSS signs"],
    ],
  },
  "what-to-expect-during-each-stage-of-ivf": {
    rowHeader: "Stage",
    columns: ["What Happens", "Duration"],
    rows: [
      ["Stimulation", "Grow multiple eggs", "8-12 days"],
      ["Trigger", "Mature the eggs", "1 injection"],
      ["Retrieval", "Collect eggs", "~20 min procedure"],
      ["Fertilisation", "Eggs meet sperm", "Lab, 3-5 days"],
      ["Transfer", "Embryo into uterus", "Quick, painless"],
    ],
  },
  "preparing-for-your-first-ivf-cycle-tips-and-advice": {
    rowHeader: "Step",
    columns: ["Action", "Why"],
    rows: [
      ["Tests", "Hormones, scans, semen", "Plan the protocol"],
      ["Lifestyle", "Healthy diet, no smoking", "Improve egg/sperm"],
      ["Supplements", "Folic acid, CoQ10", "Support quality"],
      ["Mindset", "Learn the process", "Reduce anxiety"],
      ["Logistics", "Plan time & finances", "Smooth cycle"],
    ],
  },
  "is-ivf-painful": {
    rowHeader: "Stage",
    columns: ["Discomfort Level", "What To Expect"],
    rows: [
      ["Injections", "Mild", "Small needle, brief sting"],
      ["Monitoring scans", "Minimal", "Routine ultrasound"],
      ["Egg retrieval", "Done under sedation", "No pain during"],
      ["After retrieval", "Mild cramps/bloating", "Settles in days"],
      ["Embryo transfer", "Painless", "Like a Pap smear"],
    ],
  },
  "how-many-times-can-a-person-undergo-ivf-procedure": {
    rowHeader: "Aspect",
    columns: ["Guidance", "Notes"],
    rows: [
      ["Number of cycles", "No fixed limit", "Based on health & response"],
      ["Cumulative success", "Rises over 3-4 cycles", "Most succeed by then"],
      ["Body safety", "Generally safe", "With rest between cycles"],
      ["When to reassess", "After repeated failure", "Change protocol / tests"],
      ["Alternatives", "Donor / surrogacy", "If many cycles fail"],
    ],
  },
  "questions-to-ask-ivf-specialist-at-1st-visit": {
    rowHeader: "Topic",
    columns: ["Question To Ask", "Why It Matters"],
    rows: [
      ["Diagnosis", "What's causing our infertility?", "Guides treatment"],
      ["Success", "My realistic success rate?", "Sets expectations"],
      ["Protocol", "Which IVF plan suits me?", "Personalised care"],
      ["Cost", "Total cost & what's included?", "Plan budget"],
      ["Risks", "Chance of OHSS / multiples?", "Safety"],
    ],
  },
  "questions-to-discuss-with-doctor-during-multiple-ivf-cycles": {
    rowHeader: "Topic",
    columns: ["Question To Ask", "Purpose"],
    rows: [
      ["Why it failed", "What went wrong last cycle?", "Adjust plan"],
      ["New tests", "Should we test more?", "Find hidden factors"],
      ["Protocol change", "Different stimulation?", "Improve response"],
      ["Embryo testing", "Would PGT help?", "Select healthy embryo"],
      ["Next steps", "How many more cycles?", "Realistic planning"],
    ],
  },
  "boosting-your-ivf-success-a-comprehensive-guide-for-couples": {
    rowHeader: "Factor",
    columns: ["Both Partners Should", "Avoid"],
    rows: [
      ["Diet", "Antioxidant-rich foods", "Junk, trans fats"],
      ["Weight", "Healthy BMI", "Obesity / underweight"],
      ["Habits", "Quit smoking & alcohol", "Tobacco, alcohol"],
      ["Supplements", "Folate, CoQ10", "Unproven boosters"],
      ["Stress", "Relaxation, support", "Chronic stress"],
    ],
  },
  "demystifying-ivf-facts-and-myths": {
    rowHeader: "Belief",
    columns: ["Myth", "Fact"],
    rows: [
      ["Babies", "IVF babies are unhealthy", "As healthy as natural"],
      ["Success", "IVF works first time always", "May need 2-3 cycles"],
      ["Bed rest", "Need weeks of bed rest", "Normal activity is fine"],
      ["Twins", "IVF always gives twins", "Single transfer avoids it"],
      ["Age", "IVF works at any age", "Success declines with age"],
    ],
  },
  "the-match-system-revolutionizing-ivf-with-unparalleled-accuracy-and-safety": {
    rowHeader: "Aspect",
    columns: ["Traditional Lab", "MATCH System"],
    rows: [
      ["Sample tracking", "Manual labelling", "Electronic witnessing"],
      ["Mix-up risk", "Human error possible", "Near-zero"],
      ["Verification", "Visual checks", "Automated barcode match"],
      ["Safety", "Standard", "Maximum traceability"],
      ["Confidence", "Good", "Highest assurance"],
    ],
  },
  "personalized-ivf-the-future-of-fertility-treatment": {
    rowHeader: "Aspect",
    columns: ["One-Size IVF", "Personalised IVF"],
    rows: [
      ["Protocol", "Standard for all", "Tailored to your biology"],
      ["Dosing", "Fixed", "Adjusted to AMH & response"],
      ["Transfer timing", "Routine", "ERA-guided window"],
      ["Embryo selection", "Morphology", "PGT + time-lapse"],
      ["Outcome", "Good", "Optimised for you"],
    ],
  },
  "personalized-medicine-how-ivf-treatment-is-customized": {
    rowHeader: "Factor",
    columns: ["Assessed", "How It Customises Care"],
    rows: [
      ["Ovarian reserve", "AMH, AFC", "Sets stimulation dose"],
      ["Age", "Egg quality", "Protocol & PGT decision"],
      ["Sperm", "Semen analysis", "IVF vs ICSI"],
      ["Uterus", "Lining, cavity", "Transfer timing"],
      ["History", "Past cycles", "Refine the plan"],
    ],
  },
  "in-vitro-egg-aspiration-how-the-ivf-egg-retrieval-process-works": {
    rowHeader: "Step",
    columns: ["What Happens", "Detail"],
    rows: [
      ["Trigger shot", "Mature the eggs", "~36 hrs before"],
      ["Sedation", "Light anaesthesia", "You sleep, no pain"],
      ["Aspiration", "Needle guided by ultrasound", "Eggs drawn from follicles"],
      ["Lab handover", "Eggs identified", "Embryologist counts"],
      ["Recovery", "Rest 1-2 hrs", "Home same day"],
    ],
  },
  "how-human-fertilization-works-step-by-step-explanation": {
    rowHeader: "Step",
    columns: ["What Happens", "Where"],
    rows: [
      ["Ovulation", "Egg released", "Ovary"],
      ["Sperm journey", "Sperm travel up", "Cervix to tube"],
      ["Fertilisation", "Sperm enters egg", "Fallopian tube"],
      ["Cell division", "Embryo forms", "Tube to uterus"],
      ["Implantation", "Embryo attaches", "Uterine lining"],
    ],
  },
  "bed-rest-myth-during-ivf": {
    rowHeader: "Belief",
    columns: ["Myth", "Evidence"],
    rows: [
      ["Bed rest", "Improves implantation", "No proven benefit"],
      ["Movement", "Dislodges embryo", "Uterus holds it safely"],
      ["Activity", "Must lie still for days", "Light activity is fine"],
      ["Blood flow", "Rest helps", "Movement aids circulation"],
      ["Advice", "Weeks off work", "Resume normal routine"],
    ],
  },
  "are-ivf-babies-healthy-as-naturally-conceived": {
    rowHeader: "Aspect",
    columns: ["IVF Babies", "Naturally Conceived"],
    rows: [
      ["Overall health", "Comparable", "Comparable"],
      ["Birth defects", "Slightly higher (mainly age)", "Baseline"],
      ["Development", "Normal milestones", "Normal milestones"],
      ["PGT option", "Can screen embryos", "Not applicable"],
      ["Long-term", "Healthy outcomes", "Healthy outcomes"],
    ],
  },
  "myth-twins-and-ivf": {
    rowHeader: "Belief",
    columns: ["Myth", "Fact"],
    rows: [
      ["Twins", "IVF always gives twins", "Only if 2+ embryos transferred"],
      ["Single transfer", "Lowers success a lot", "Blastocyst eSET is excellent"],
      ["Safety", "Twins are safer", "Singletons are safer"],
      ["Control", "Cannot avoid twins", "Single transfer avoids it"],
      ["Trend", "More twins is better", "Trend is toward single"],
    ],
  },
  "do-and-dont-for-fertility": {
    rowHeader: "Area",
    columns: ["Do", "Don't"],
    rows: [
      ["Diet", "Whole foods, folate", "Junk, excess sugar"],
      ["Weight", "Maintain healthy BMI", "Crash diets"],
      ["Habits", "Quit smoking/alcohol", "Tobacco, heavy drinking"],
      ["Timing", "Track fertile window", "Delay seeking help"],
      ["Stress", "Manage with rest/yoga", "Ignore mental health"],
    ],
  },
  "ivf-and-career-balancing-work-and-fertility-treatments": {
    rowHeader: "Challenge",
    columns: ["Tip", "Benefit"],
    rows: [
      ["Appointments", "Schedule early-morning scans", "Less work disruption"],
      ["Workload", "Plan lighter weeks at retrieval", "Reduce stress"],
      ["Privacy", "Share only if comfortable", "Your choice"],
      ["Energy", "Rest, eat well", "Cope with hormones"],
      ["Flexibility", "Use leave smartly", "Balance both"],
    ],
  },
  "ivf-for-single-women-in-india-navigating-new-art-law": {
    rowHeader: "Aspect",
    columns: ["Detail", "Notes"],
    rows: [
      ["Eligibility", "Single women allowed", "Under ART Act 2021"],
      ["Donor sperm", "Permitted", "From registered bank"],
      ["Age limit", "21-50 years", "As per law"],
      ["Surrogacy", "Restricted for singles", "Different rules"],
      ["Process", "Counselling + consent", "Legally documented"],
    ],
  },
  "parenting-after-ivf-unique-challenges-and-rewards": {
    rowHeader: "Aspect",
    columns: ["Challenge", "Reward"],
    rows: [
      ["Emotions", "Anxiety after long journey", "Deep gratitude"],
      ["Bonding", "Pressure to be 'perfect'", "Strong connection"],
      ["Disclosure", "Whether to tell child", "Honest family story"],
      ["Support", "Fewer who understand", "IVF parent community"],
      ["Outlook", "Same as any parent", "A long-awaited joy"],
    ],
  },
  "from-ivf-to-motherhood-the-journey-of-hope-and-happiness": {
    rowHeader: "Phase",
    columns: ["Experience", "Support at BFI"],
    rows: [
      ["Diagnosis", "Uncertainty", "Clear answers"],
      ["Treatment", "Hope & nerves", "Guided each step"],
      ["Pregnancy", "Joy & caution", "Close monitoring"],
      ["Delivery", "Anticipation", "Specialist care"],
      ["Motherhood", "Fulfilment", "Continued support"],
    ],
  },
  "building-families-with-hope-the-power-of-assisted-reproductive-technology": {
    rowHeader: "ART Option",
    columns: ["Helps With", "Approach"],
    rows: [
      ["IUI", "Mild infertility", "Sperm into uterus"],
      ["IVF", "Tubal / unexplained", "Lab fertilisation"],
      ["ICSI", "Male factor", "Single-sperm injection"],
      ["Donor programs", "No eggs/sperm", "Donor gametes"],
      ["Preservation", "Future fertility", "Egg/embryo freezing"],
    ],
  },
  "what-is-epigenetics-does-it-affect-ivf-pregnancies-only": {
    rowHeader: "Question",
    columns: ["Reality", "Notes"],
    rows: [
      ["What it is", "Gene expression switches", "Not DNA changes"],
      ["IVF only?", "No", "Affects all pregnancies"],
      ["Influences", "Diet, stress, environment", "Both natural & IVF"],
      ["IVF safety", "Reassuring data", "Largely comparable"],
      ["Takeaway", "Healthy lifestyle helps", "For every pregnancy"],
    ],
  },

  // ───────────────────────── ICSI ─────────────────────────
  "icsi-vs-ivf-do-you-actually-need-icsi-or-is-it-being-upsold-to-you": {
    rowHeader: "Scenario",
    columns: ["Conventional IVF Enough", "ICSI Genuinely Needed"],
    rows: [
      ["Sperm normal", "Yes", "—"],
      ["Low count/motility", "—", "Yes"],
      ["Prior fertilisation failure", "—", "Yes"],
      ["Frozen/surgical sperm", "—", "Yes"],
      ["Unexplained, normal sperm", "Often yes", "Not always required"],
    ],
  },
  "icsi-vs-ivf-success-rates-benefits-and-risks-compared": {
    rowHeader: "Aspect",
    columns: ["Conventional IVF", "ICSI"],
    rows: [
      ["Fertilisation", "Sperm penetrate egg", "Sperm injected directly"],
      ["Fertilisation rate", "60-70%", "85-90%"],
      ["Best for", "Normal sperm", "Male factor"],
      ["Cost", "Standard", "+₹15-25K"],
      ["Pregnancy rate", "Similar once fertilised", "Similar once fertilised"],
    ],
  },
  "step-by-step-guide-to-the-icsi-procedure": {
    rowHeader: "Step",
    columns: ["What Happens", "Detail"],
    rows: [
      ["Egg retrieval", "Collect mature eggs", "Under sedation"],
      ["Sperm prep", "Select best sperm", "Washed sample"],
      ["Injection", "1 sperm into each egg", "Under microscope"],
      ["Culture", "Embryos develop", "3-5 days"],
      ["Transfer", "Best embryo to uterus", "Or freeze"],
    ],
  },
  "icsi-dos-and-donts": {
    rowHeader: "Area",
    columns: ["Do", "Don't"],
    rows: [
      ["Before", "Improve sperm health 3 months", "Smoke or drink"],
      ["Medication", "Follow stimulation plan", "Miss injections"],
      ["Lifestyle", "Eat well, stay active", "Overheat (sauna)"],
      ["After transfer", "Take progesterone", "Strenuous activity"],
      ["Mindset", "Stay positive", "Test too early"],
    ],
  },

  // ───────────────────────── IUI ─────────────────────────
  "iui-vs-ivf-which-fertility-treatment-is-right-for-you": {
    rowHeader: "Factor",
    columns: ["Choose IUI", "Choose IVF"],
    rows: [
      ["Severity", "Mild infertility", "Severe / complex"],
      ["Tubes", "At least one open", "Blocked / damaged"],
      ["Sperm", "Mild issues", "Severe male factor"],
      ["Age", "Younger", "Older / low reserve"],
      ["After failure", "First-line", "After 3-4 failed IUI"],
    ],
  },

  // ───────────────────────── PGT / GENETIC ─────────────────────────
  "advantages-and-disadvantages-of-pgt": {
    rowHeader: "Aspect",
    columns: ["Advantage", "Disadvantage"],
    rows: [
      ["Selection", "Picks healthy embryos", "Needs biopsy"],
      ["Miscarriage", "Lowers risk", "Added cost"],
      ["Success", "Higher per transfer", "Fewer usable embryos"],
      ["Genetic disease", "Avoids inherited conditions", "Not 100% conclusive"],
      ["Best for", "Older, recurrent loss", "Not for everyone"],
    ],
  },
  "how-pre-implantation-genetic-testing-boosts-ivf-success": {
    rowHeader: "Aspect",
    columns: ["Without PGT", "With PGT"],
    rows: [
      ["Embryo selection", "By appearance", "By chromosome health"],
      ["Implantation", "Standard", "Higher per transfer"],
      ["Miscarriage", "Higher", "Reduced"],
      ["Transfers needed", "May be more", "Often fewer"],
      ["Best for", "Younger, first cycle", "Older, recurrent loss"],
    ],
  },
  "pgt-and-its-role-in-preventing-recurrent-miscarriages": {
    rowHeader: "Aspect",
    columns: ["Detail", "Benefit"],
    rows: [
      ["Cause screened", "Chromosomal errors", "Top miscarriage cause"],
      ["Method", "Biopsy + genetic test", "Selects normal embryos"],
      ["Transfer", "Only euploid embryo", "Lower loss risk"],
      ["Best for", "2+ miscarriages", "Recurrent loss"],
      ["Limit", "Not all causes", "Combine with workup"],
    ],
  },
  "pgt-for-couples-with-recurrent-ivf-failure-or-miscarriages-does-it-help": {
    rowHeader: "Situation",
    columns: ["Does PGT Help?", "Why"],
    rows: [
      ["Recurrent miscarriage", "Often yes", "Avoids abnormal embryos"],
      ["Repeated IVF failure", "Often yes", "Better embryo selection"],
      ["Advanced maternal age", "Yes", "More aneuploidy"],
      ["Few embryos", "Caution", "May leave none to transfer"],
      ["Young, first cycle", "Limited", "Lower yield"],
    ],
  },
  "pgt-vs-tgt-vs-prt-which-embryo-testing-method-is-right-for-you": {
    rowHeader: "Test",
    columns: ["What It Screens", "Best For"],
    rows: [
      ["PGT-A", "Chromosome number", "Age, recurrent loss"],
      ["PGT-M", "Single-gene disease", "Known genetic condition"],
      ["PGT-SR", "Structural rearrangements", "Carrier of translocation"],
      ["Method", "Day-5 biopsy", "Blastocyst stage"],
      ["Choice", "Based on history", "Doctor advises"],
    ],
  },
  "preparing-for-pgt-what-to-expect-before-during-and-after-the-procedure": {
    rowHeader: "Phase",
    columns: ["What Happens", "Your Role"],
    rows: [
      ["Before", "Counselling, IVF stimulation", "Tests & consent"],
      ["Retrieval", "Eggs collected, fertilised", "Standard IVF"],
      ["Biopsy", "Few cells from blastocyst", "Embryos frozen"],
      ["Testing", "Lab analyses genetics", "Wait for results"],
      ["After", "Transfer normal embryo", "FET cycle"],
    ],
  },
  "genetic-testing-before-and-during-pregnancy-a-comprehensive-guide": {
    rowHeader: "Test",
    columns: ["When", "What It Checks"],
    rows: [
      ["Carrier screening", "Before pregnancy", "Inherited conditions"],
      ["PGT", "During IVF", "Embryo chromosomes"],
      ["NIPT", "10+ weeks", "Down syndrome risk"],
      ["NT scan", "11-14 weeks", "Chromosomal markers"],
      ["Amniocentesis", "15-20 weeks", "Confirmatory diagnosis"],
    ],
  },

  // ───────────────────────── EGG FREEZING / EGG QUALITY ─────────────────────────
  "egg-freezing-preserving-your-fertility-for-the-future": {
    rowHeader: "Aspect",
    columns: ["Detail", "Notes"],
    rows: [
      ["Best age", "Under 35", "Best egg quality"],
      ["Eggs needed", "15-20", "For good odds"],
      ["Method", "Vitrification", "~90% survive thaw"],
      ["Storage", "Years safely", "Liquid nitrogen"],
      ["Future use", "Thaw, fertilise, transfer", "When ready"],
    ],
  },
  "egg-freezing-vs-embryo-freezing-making-the-right-choice-for-your-fertility-journey": {
    rowHeader: "Factor",
    columns: ["Egg Freezing", "Embryo Freezing"],
    rows: [
      ["Needs sperm", "No", "Yes"],
      ["Flexibility", "Independent choice", "Tied to partner/donor"],
      ["Survival", "~90% thaw", "~98% thaw"],
      ["Best for", "Single women", "Couples"],
      ["Legal", "Simpler", "Joint consent needed"],
    ],
  },
  "egg-freezing-your-fertility-time-capsule": {
    rowHeader: "Stage",
    columns: ["What Happens", "Detail"],
    rows: [
      ["Stimulation", "Grow multiple eggs", "10-12 days"],
      ["Retrieval", "Collect eggs", "Under sedation"],
      ["Vitrification", "Flash-freeze eggs", "Same day"],
      ["Storage", "Preserved at -196°C", "Safe for years"],
      ["Use later", "Thaw + fertilise", "When you choose"],
    ],
  },
  "egg-quality-vs-egg-quantity-what-really-matters": {
    rowHeader: "Aspect",
    columns: ["Egg Quantity", "Egg Quality"],
    rows: [
      ["Measured by", "AMH, AFC", "Mainly age"],
      ["Meaning", "How many eggs left", "Chromosomal health"],
      ["Declines with", "Age (number falls)", "Age (quality falls)"],
      ["IVF impact", "Eggs available", "Embryo viability"],
      ["Which matters", "Both", "Quality drives success"],
    ],
  },
  "10-foods-to-improve-female-egg-quality": {
    rowHeader: "Food",
    columns: ["Benefit", "Key Nutrient"],
    rows: [
      ["Leafy greens", "Cell health", "Folate, iron"],
      ["Berries", "Antioxidant protection", "Vitamin C"],
      ["Nuts & seeds", "Hormone balance", "Omega-3, Vit E"],
      ["Eggs & fish", "Egg development", "Protein, omega-3"],
      ["Avocado", "Healthy fats", "Monounsaturated fat"],
    ],
  },
  "is-egg-freezing-a-good-option-if-i-want-to-delay-pregnancy": {
    rowHeader: "Consideration",
    columns: ["Good Candidate", "Less Ideal"],
    rows: [
      ["Age", "Under 35", "Over 38"],
      ["Reason", "Career / not ready", "Already low reserve late"],
      ["Reserve", "Good AMH", "Very low AMH"],
      ["Health", "Pre-cancer treatment", "—"],
      ["Outlook", "Higher future success", "Lower if delayed too long"],
    ],
  },
  "when-is-the-right-time-to-freeze-your-eggs": {
    rowHeader: "Age Range",
    columns: ["Egg Quality", "Recommendation"],
    rows: [
      ["Under 30", "Excellent", "Ideal, fewer eggs needed"],
      ["30-34", "Very good", "Great time to freeze"],
      ["35-37", "Declining", "Freeze soon"],
      ["38-40", "Lower", "Possible, more eggs needed"],
      ["Over 40", "Reduced", "Discuss realistic odds"],
    ],
  },
  "the-power-of-egg-freezing-empowering-choices-for-the-modern-generation": {
    rowHeader: "Benefit",
    columns: ["What It Offers", "Who Gains"],
    rows: [
      ["Time", "Delay motherhood", "Career-focused women"],
      ["Quality lock", "Preserve younger eggs", "Anyone aging"],
      ["Medical", "Before cancer therapy", "Patients pre-treatment"],
      ["Confidence", "Reduce future pressure", "Single women"],
      ["Control", "Plan on your terms", "The modern generation"],
    ],
  },
  "top-10-reasons-to-consider-egg-freezing": {
    rowHeader: "Reason",
    columns: ["Why It Helps"],
    rows: [
      ["Not ready yet", "Delay without losing quality"],
      ["Career goals", "Focus now, family later"],
      ["No partner", "Preserve options"],
      ["Medical treatment", "Protect before chemo"],
      ["Declining AMH", "Bank eggs early"],
    ],
  },
  "the-relationship-between-egg-freezing-and-future-ivf-success-rates": {
    rowHeader: "Freezing Age",
    columns: ["Thaw Survival", "Future IVF Odds"],
    rows: [
      ["Under 30", "~90%", "Best"],
      ["30-34", "~90%", "Very good"],
      ["35-37", "~85%", "Good"],
      ["38-40", "~80%", "Moderate"],
      ["Eggs frozen", "More = better", "15-20 ideal"],
    ],
  },
  "stories-from-indian-celebrities-of-egg-freezing": {
    rowHeader: "Takeaway",
    columns: ["What It Shows"],
    rows: [
      ["Awareness", "Egg freezing is mainstream"],
      ["Empowerment", "Women planning on their terms"],
      ["Timing", "Many froze in their early 30s"],
      ["Normalisation", "Reduces stigma"],
      ["Lesson", "Earlier is better"],
    ],
  },

  // ───────────────────────── DONOR / RETRIEVAL / EGG NUMBER ─────────────────────────
  "a-quick-guide-on-the-ivf-journey-with-egg-donors": {
    rowHeader: "Step",
    columns: ["What Happens", "Detail"],
    rows: [
      ["Donor selection", "Matched donor", "Screened & anonymous"],
      ["Synchronisation", "Cycles aligned", "Hormonal prep"],
      ["Retrieval", "Donor's eggs collected", "Donor undergoes stimulation"],
      ["Fertilisation", "With partner sperm", "ICSI/IVF"],
      ["Transfer", "Embryo to recipient", "Recipient carries baby"],
    ],
  },
  "pros-and-cons-of-using-donor-eggs": {
    rowHeader: "Aspect",
    columns: ["Pro", "Con"],
    rows: [
      ["Success", "High pregnancy rates", "—"],
      ["Age barrier", "Overcomes low reserve", "—"],
      ["Genetics", "Healthy young eggs", "No genetic link to mother"],
      ["Emotional", "Path to parenthood", "Acceptance journey"],
      ["Cost", "—", "Higher than own-egg IVF"],
    ],
  },
  "when-should-you-consider-donor-eggs-or-sperm": {
    rowHeader: "Situation",
    columns: ["Donor Eggs", "Donor Sperm"],
    rows: [
      ["Indication", "Very low reserve / POF", "Severe male factor / azoospermia"],
      ["Age", "Advanced maternal age", "—"],
      ["Failed cycles", "Repeated poor eggs", "Repeated poor sperm"],
      ["Genetic risk", "Maternal condition", "Paternal condition"],
      ["Single parent", "Single man", "Single woman"],
    ],
  },
  "what-is-the-max-number-of-eggs-that-you-can-retrieve-in-an-ivf-cycle": {
    rowHeader: "Egg Yield",
    columns: ["Typical Range", "Notes"],
    rows: [
      ["Average", "8-15 eggs", "Most patients"],
      ["High responders", "20+ eggs", "PCOS — OHSS risk"],
      ["Low responders", "1-5 eggs", "Low reserve / age"],
      ["Ideal", "10-15", "Best balance"],
      ["More always better?", "No", "Quality over quantity"],
    ],
  },
  "how-does-the-number-of-eggs-affect-ivf-success-rate": {
    rowHeader: "Eggs Retrieved",
    columns: ["Effect on Success", "Notes"],
    rows: [
      ["1-3", "Lower odds", "Fewer embryos"],
      ["10-15", "Best success", "Optimal range"],
      ["20+", "Plateaus", "OHSS risk rises"],
      ["Quality", "Matters most", "Healthy beats many"],
      ["Cumulative", "More embryos = more transfers", "Better over cycles"],
    ],
  },
  "how-does-follicle-count-affect-ivf-success-rates": {
    rowHeader: "Antral Follicle Count",
    columns: ["Reserve Level", "IVF Outlook"],
    rows: [
      ["Under 5", "Low", "Fewer eggs, mini-IVF"],
      ["6-10", "Moderate", "Reasonable response"],
      ["11-20", "Good", "Strong response"],
      ["Over 20", "High (PCOS)", "OHSS risk"],
      ["Use", "Predicts egg yield", "Guides dosing"],
    ],
  },

  // ───────────────────────── OVARIAN RESERVE / CYSTS / REJUVENATION ─────────────────────────
  "ovarian-cysts-symptoms-causes-treatment-diagnosis": {
    rowHeader: "Aspect",
    columns: ["Detail", "Notes"],
    rows: [
      ["Symptoms", "Pelvic pain, bloating", "Often silent"],
      ["Types", "Functional, dermoid, endometrioma", "Most are benign"],
      ["Diagnosis", "Ultrasound", "Blood markers if needed"],
      ["Treatment", "Watch, medication, surgery", "Based on size/type"],
      ["Fertility", "Usually fine", "Endometrioma may affect"],
    ],
  },
  "can-you-get-pregnant-with-ovarian-cysts": {
    rowHeader: "Cyst Type",
    columns: ["Affects Fertility?", "Approach"],
    rows: [
      ["Functional", "Usually no", "Resolves on its own"],
      ["Endometrioma", "Can reduce reserve", "May need treatment"],
      ["Dermoid", "Usually no", "Remove if large"],
      ["PCOS-related", "Yes — anovulation", "Ovulation induction"],
      ["Large cysts", "May block", "Surgery if needed"],
    ],
  },
  "ovarian-follicles-the-tiny-heroes-of-fertility": {
    rowHeader: "Aspect",
    columns: ["Detail", "Why It Matters"],
    rows: [
      ["What they are", "Sacs holding eggs", "One egg matures monthly"],
      ["Antral count", "Seen on scan", "Reflects reserve"],
      ["Growth", "Stimulated by FSH", "Matures the egg"],
      ["Dominant follicle", "Releases egg", "Ovulation"],
      ["In IVF", "Many grown at once", "More eggs collected"],
    ],
  },
  "ovarian-rejuvenation-for-restoring-fertility-a-new-ray-of-hope": {
    rowHeader: "Aspect",
    columns: ["Detail", "Notes"],
    rows: [
      ["What it is", "Reactivate dormant follicles", "PRP / growth factors"],
      ["Candidates", "Low reserve, early menopause", "Selected cases"],
      ["Method", "PRP injected into ovary", "Day procedure"],
      ["Evidence", "Promising but emerging", "Not guaranteed"],
      ["Goal", "Improve egg yield", "Buy fertility time"],
    ],
  },
  "ovarian-rejuvenation-ivf-what-to-know-when-combining-treatments": {
    rowHeader: "Aspect",
    columns: ["Rejuvenation Alone", "Combined with IVF"],
    rows: [
      ["Goal", "Activate follicles", "Then collect eggs"],
      ["Timing", "Before stimulation", "IVF weeks later"],
      ["Best for", "Poor responders", "Low reserve seeking IVF"],
      ["Outcome", "Variable", "May improve egg count"],
      ["Expectation", "Realistic", "Not a guarantee"],
    ],
  },
  "understanding-ovarian-reserve-and-rejuvenation-a-guide": {
    rowHeader: "Concept",
    columns: ["Meaning", "How Assessed"],
    rows: [
      ["Ovarian reserve", "Eggs remaining", "AMH + AFC"],
      ["Low reserve", "Fewer eggs", "Low AMH"],
      ["Decline", "Natural with age", "Faster after 35"],
      ["Rejuvenation", "Attempt to boost", "PRP, supplements"],
      ["Action", "Test early", "Plan accordingly"],
    ],
  },
  "prp-ovarian-rejuvenation-boosting-egg-quality-and-fertility": {
    rowHeader: "Aspect",
    columns: ["Detail", "Notes"],
    rows: [
      ["What PRP is", "Platelet-rich plasma", "From your own blood"],
      ["How it works", "Growth factors stimulate ovary", "May wake follicles"],
      ["Procedure", "Injected into ovaries", "Short, day-care"],
      ["Best for", "Low reserve, poor responders", "Selected cases"],
      ["Evidence", "Emerging", "Results vary"],
    ],
  },
  "prp-vs-traditional-fertility-treatments-whats-the-difference": {
    rowHeader: "Aspect",
    columns: ["PRP Rejuvenation", "Traditional IVF Drugs"],
    rows: [
      ["Approach", "Regenerative", "Hormonal stimulation"],
      ["Source", "Own platelets", "Medications"],
      ["Target", "Reactivate ovary", "Stimulate existing follicles"],
      ["Best for", "Very low reserve", "Most patients"],
      ["Status", "Emerging", "Established"],
    ],
  },
  "how-to-interpret-amh-afc-and-other-ovarian-reserve-rests-what-the-numbers-really-mean": {
    rowHeader: "Test",
    columns: ["What It Measures", "Reassuring Value"],
    rows: [
      ["AMH", "Egg quantity", "1-3.5 ng/mL"],
      ["AFC", "Antral follicles", "10-20 total"],
      ["FSH (day 3)", "Ovary effort", "Under 10 mIU/mL"],
      ["Estradiol", "Cycle baseline", "Low on day 3"],
      ["Together", "Reserve picture", "Guide IVF plan"],
    ],
  },
  "can-natural-cycle-ivf-reduce-the-risk-of-ovarian-hyperstimulation": {
    rowHeader: "Aspect",
    columns: ["Conventional IVF", "Natural Cycle IVF"],
    rows: [
      ["Drugs", "High-dose stimulation", "None / minimal"],
      ["OHSS risk", "Present", "Almost eliminated"],
      ["Eggs", "Many", "Usually 1"],
      ["Best for", "Normal responders", "OHSS-prone, PCOS"],
      ["Trade-off", "More eggs", "Lower OHSS, fewer eggs"],
    ],
  },
  "is-natural-cycle-ivf-better-for-women-with-poor-ovarian-reserve": {
    rowHeader: "Aspect",
    columns: ["Conventional IVF", "Natural Cycle IVF"],
    rows: [
      ["Drug response", "Poor in low reserve", "Not drug-dependent"],
      ["Eggs", "Few despite high dose", "The 1 natural egg"],
      ["Cost", "Higher per cycle", "Lower per cycle"],
      ["Approach", "Push the ovary", "Work with natural egg"],
      ["Best for", "Good responders", "Poor responders"],
    ],
  },
  "ovarian-hyperstimulation-syndrome": {
    rowHeader: "Aspect",
    columns: ["Detail", "Action"],
    rows: [
      ["What it is", "Over-response to drugs", "Swollen, leaky ovaries"],
      ["Risk group", "PCOS, high AMH, young", "Monitor closely"],
      ["Mild signs", "Bloating, mild pain", "Rest, fluids"],
      ["Severe signs", "Rapid weight gain, breathlessness", "Seek care urgently"],
      ["Prevention", "Antagonist + freeze-all", "Lower trigger dose"],
    ],
  },

  // ───────────────────────── THYROID ─────────────────────────
  "how-do-thyroid-disorders-affect-fertility-in-women": {
    rowHeader: "Thyroid State",
    columns: ["Effect on Fertility", "Management"],
    rows: [
      ["Hypothyroid", "Irregular cycles, anovulation", "Thyroxine"],
      ["Hyperthyroid", "Cycle changes, miscarriage", "Anti-thyroid meds"],
      ["High TSH", "Lowers conception", "Optimise before TTC"],
      ["Ideal TSH", "Under 2.5 for conception", "Monitor"],
      ["Antibodies", "Raise miscarriage risk", "Close follow-up"],
    ],
  },
  "ivf-for-women-with-thyroid-disorders-what-patients-should-know": {
    rowHeader: "Aspect",
    columns: ["Before IVF", "During IVF"],
    rows: [
      ["TSH target", "Under 2.5 mIU/L", "Recheck regularly"],
      ["Medication", "Adjust thyroxine", "Dose may rise"],
      ["Stimulation", "Can raise thyroid demand", "Monitor levels"],
      ["Miscarriage", "Optimise first", "Continue support"],
      ["Outcome", "Good when controlled", "Stable TSH key"],
    ],
  },
  "the-thyroid-connection-understanding-its-role-in-female-fertility-health": {
    rowHeader: "Function",
    columns: ["Healthy Thyroid", "Imbalanced Thyroid"],
    rows: [
      ["Cycles", "Regular", "Irregular"],
      ["Ovulation", "Normal", "Disrupted"],
      ["Pregnancy", "Supports", "Higher miscarriage risk"],
      ["Metabolism", "Balanced", "Weight & energy changes"],
      ["Check", "TSH yearly", "Treat to optimise"],
    ],
  },
  "thyroid-disorders-in-early-pregnancy": {
    rowHeader: "Aspect",
    columns: ["Hypothyroid", "Hyperthyroid"],
    rows: [
      ["Risk", "Miscarriage, poor growth", "Preterm, preeclampsia"],
      ["Symptoms", "Fatigue, cold, weight gain", "Palpitations, weight loss"],
      ["TSH target", "Under 2.5 mIU/L", "Controlled levels"],
      ["Treatment", "Thyroxine", "Pregnancy-safe meds"],
      ["Monitoring", "Each trimester", "Each trimester"],
    ],
  },

  // ───────────────────────── MEDIA / INTERVIEWS ─────────────────────────
  "r-j-lajja-of-my-fm-taking-interview-of-dr-parth-bavishi": {
    rowHeader: "Topic Covered by Dr. Parth Bavishi",
    columns: ["Key Message for Listeners", "Why It Matters"],
    rows: [
      ["Who needs IVF?", "IVF is for couples who've tried naturally and not conceived — not a first resort", "Many couples delay unnecessarily; earlier evaluation helps"],
      ["IVF success rates", "Realistic: 40-55% per cycle under 35, declining with age", "Helps listeners set honest expectations before starting"],
      ["Modern IVF innovations", "ICSI, PGT, ERA, laser hatching have transformed outcomes", "Advanced techniques make IVF safer and more precise"],
      ["Emotional support in IVF", "Mental health is as important as the medical protocol", "Couples underestimate emotional toll — counselling is essential"],
      ["Choosing the right clinic", "Success rates, lab quality, transparency, and specialist experience matter most", "Helps listeners evaluate clinics critically before committing"],
    ],
  },

  // ───────────────────────── CANCER / ONCOFERTILITY ─────────────────────────
  "oncofertility-preserving-fertility-before-cancer-treatment": {
    rowHeader: "Preservation Option",
    columns: ["How It Works", "Best Suited For"],
    rows: [
      ["Egg (oocyte) freezing", "Ovarian stimulation + egg retrieval + vitrification before chemo", "Single women; any woman who can delay treatment 10-14 days"],
      ["Embryo freezing", "Eggs fertilized with partner or donor sperm; embryos vitrified", "Women with a partner; most established method with highest success"],
      ["Ovarian tissue cryopreservation", "Strip of ovarian tissue removed and frozen; reimplanted post-treatment", "Young girls, women needing immediate chemo — no delay needed"],
      ["Sperm freezing (men)", "Semen sample collected and cryopreserved before therapy", "All men starting chemo, radiation, or pelvic surgery"],
      ["Medical ovarian suppression", "GnRH agonists put ovaries in temporary 'sleep' during chemo", "Women unable to do egg retrieval; reduces chemo damage to ovaries"],
    ],
  },
  "preserving-hope-ivf-and-fertility-preservation-for-cancer-patients": {
    rowHeader: "Cancer Treatment Effect",
    columns: ["Impact on Women", "Impact on Men"],
    rows: [
      ["Chemotherapy", "Damages ovaries — premature menopause, reduced egg quality, ovarian failure", "Damages sperm-producing cells — low count, abnormal sperm, azoospermia"],
      ["Pelvic radiation", "Direct ovarian damage; may affect uterine lining", "Damages testicles; may impair sperm production permanently"],
      ["Surgical removal", "Removal of ovary or uterus ends natural fertility", "Removal of testicle reduces sperm production"],
      ["Hormonal therapy", "Estrogen suppression affects ovarian function", "Testosterone suppression reduces sperm count"],
      ["Best time to preserve", "BEFORE starting any cancer treatment — time-sensitive", "BEFORE starting any cancer treatment — freeze sperm urgently"],
    ],
  },

  // ───────────────────────── IVF FAILURE / IVF PREGNANCY / DELIVERY ─────────────────────────
  "ivf-failure-doesnt-mean-the-end-what-can-you-do-next": {
    rowHeader: "Reason IVF Failed",
    columns: ["What It Means", "Next Step After Failure"],
    rows: [
      ["Poor egg quality", "Eggs had chromosomal errors or didn't mature properly", "PGT-A in next cycle; consider donor eggs if AMH very low"],
      ["Embryo didn't implant", "Chromosomal abnormalities or uterine environment issue", "ERA test to find correct transfer window + PGT screening"],
      ["Uterine issues", "Thin lining, polyps, fibroids, or hidden infection", "Hysteroscopy + endometrial biopsy before next cycle"],
      ["Sperm DNA fragmentation", "High DNA damage — poor fertilisation or embryo arrest", "DFI test + antioxidant therapy; ICSI with IMSI selection"],
      ["Immune / clotting disorder", "Body attacked embryo or blood clots blocked implantation", "Immunological panel + thrombophilia screen; specialist review"],
    ],
  },
  "ivf-pregnancy-week-by-week-symptoms-and-safety": {
    rowHeader: "Pregnancy Week",
    columns: ["Key Symptoms", "Safety Measures"],
    rows: [
      ["Week 1-4 (Post-transfer)", "Implantation spotting, mild cramping; often no symptoms", "No alcohol, smoking, NSAIDs; continue progesterone support"],
      ["Week 5-8 (Early symptoms)", "Fatigue, nausea (morning sickness), breast tenderness, mood swings", "Prenatal vitamins; alert doctor if severe abdominal pain (OHSS)"],
      ["Week 9-12 (End of first trimester)", "Symptoms ease; energy improves; round ligament pain may begin", "Genetic screening (NIPT); nuchal translucency ultrasound"],
      ["Week 13-16 (Second trimester)", "Skin changes, baby movements begin to be felt", "Structural anomaly scan; growth monitoring; gestational diabetes screen"],
      ["Week 28+ (Third trimester)", "Shortness of breath, back pain, Braxton Hicks contractions", "NST if high-risk; close monitoring; finalise delivery plan"],
    ],
  },
  "lifestyle-changes-to-boost-ivf-success-and-increase-your-chances-of-a-healthy-pregnancy": {
    rowHeader: "Lifestyle Area",
    columns: ["Why It Helps IVF Success", "Practical Tip"],
    rows: [
      ["Nutrient-rich diet", "Antioxidants reduce oxidative stress that damages eggs and sperm", "Focus on berries, leafy greens, nuts, whole grains; cut processed food"],
      ["Healthy weight (BMI 18.5-24.9)", "Optimal weight supports hormonal regulation and ovulation", "Even 5-10% weight loss improves IVF outcomes in overweight women"],
      ["Moderate exercise (walking/yoga)", "Improves blood flow to uterus and ovaries; reduces cortisol", "30 min daily walking or fertility yoga; avoid HIIT during stimulation"],
      ["Stress management", "Chronic cortisol disrupts reproductive hormones", "Mindfulness, guided meditation, or therapy during the 2-week wait"],
      ["No smoking or alcohol", "Smoking reduces egg quality; alcohol affects implantation hormones", "Quit at least 3 months before starting IVF; both partners"],
    ],
  },
  "lifestyle-diet-rest-tips-for-high-risk-pregnancy": {
    rowHeader: "High-Risk Reason",
    columns: ["Dietary Priority", "Lifestyle Focus"],
    rows: [
      ["IVF-conceived pregnancy", "Iron + folic acid from day 1; avoid raw foods", "No intense exercise; gentle walking + prenatal yoga with guidance"],
      ["Age above 35", "Calcium, omega-3, Vit D for bone and brain development", "Regular BP + glucose monitoring; no caffeine excess"],
      ["Gestational diabetes", "Low-GI diet; 5-6 small frequent meals to stabilise blood sugar", "Post-meal walking; track glucose as directed"],
      ["Multiple pregnancy (twins+)", "Higher calorie and protein needs; 2.5-3L water daily", "More rest; avoid heavy lifting; more frequent check-ups"],
      ["History of miscarriage / preterm birth", "Folic acid + magnesium; avoid raw meat and unpasteurised dairy", "Limit stress; attend all monitoring scans without exception"],
    ],
  },
  "normal-delivery-tips-to-increase-your-chances-of-a-natural-birth": {
    rowHeader: "Preparation Stage",
    columns: ["Recommended Action", "Why It Helps Natural Delivery"],
    rows: [
      ["Before labour (body prep)", "Pelvic floor exercises (Kegels), perineal massage, optimal fetal positioning", "Strengthens delivery muscles; reduces tearing risk"],
      ["During pregnancy (fitness)", "Walking, swimming, prenatal yoga; avoid over-exhaustion", "Builds stamina and reduces labour pain sensitivity"],
      ["Nutrition and hydration", "Balanced diet with protein, iron, whole grains; 2-3L water daily", "Maintains energy; prevents fatigue during active labour"],
      ["Labour support plan", "Choose a supportive provider; write a birth plan; consider a doula", "Evidence-based birth support improves natural delivery rates"],
      ["Mindset and relaxation", "Breathing techniques, positive visualisation, meditation", "Calm nervous system reduces perceived pain; prevents panic"],
    ],
  },

  // ───────────────────────── IVF SUCCESS RATES / SURROGACY / MENTAL HEALTH / SLEEP ─────────────────────────
  "success-rate-of-ivf-treatments-in-ahmedabad-what-to-expect-in-2025": {
    rowHeader: "Age Group",
    columns: ["Expected IVF Success Rate (2025)", "Key Factor to Improve Your Chances"],
    rows: [
      ["Under 35", "40–60% per fresh cycle; 40–60% for FET", "PGT-A to select chromosomally normal embryos"],
      ["35–40", "30–50% per cycle; 30–50% for FET", "Personalised stimulation protocol; PGT-A recommended"],
      ["Over 40", "15–30% per cycle with own eggs", "Donor eggs raise success to 50–70% regardless of age"],
      ["All ages — FET advantage", "FET now matches or exceeds fresh transfer", "Vitrification preserves embryo quality; freeze-all strategy"],
      ["All ages — AI embryo selection", "AI grading improves selection accuracy", "Choose clinic with time-lapse imaging + AI grading tools"],
    ],
  },
  "surrogacy-vs-ivf-key-differences-benefits-and-choosing-the-right-path-to-parenthood": {
    rowHeader: "Factor",
    columns: ["IVF (Intended Mother Carries)", "Surrogacy (Surrogate Carries)"],
    rows: [
      ["Who carries the baby?", "Intended mother carries the pregnancy", "A surrogate carries the pregnancy to term"],
      ["Best for", "Blocked tubes, low sperm, ovulation disorders, endometriosis", "Uterus removed, repeated miscarriage, unable to carry"],
      ["Genetic link", "Both parents can be biological", "Gestational: both parents biological; surrogate has no link"],
      ["Process complexity", "Simpler — medical treatment for one person", "More complex — medical + legal + emotional coordination"],
      ["Success rates", "35–60% per cycle depending on age and protocol", "50–65% per transfer using gestational surrogacy + IVF"],
    ],
  },
  "team-excellence-and-innovation-at-bavishi-fertility-institute": {
    rowHeader: "BFI Patient Care Priority",
    columns: ["What It Means for Patients", "How the Team Ensures It"],
    rows: [
      ["Quality of care", "Every procedure follows evidence-based, internationally aligned protocols", "100+ professionals trained and aligned at regular team meetings"],
      ["Safety", "Minimise risk at every stage — stimulation, retrieval, transfer", "Strict lab standards, checklists, and quality control processes"],
      ["Comfort", "Patients feel physically and emotionally at ease throughout treatment", "Modern facilities, compassionate nursing, minimal wait times"],
      ["Privacy", "Patient information and journey kept strictly confidential", "Secure records, private consultation rooms, discreet communication"],
      ["Personalised care", "No two treatment plans are identical", "Individual medical history, test results, and goals guide every decision"],
    ],
  },
  "the-connection-between-quality-sleep-and-ivf-success-a-hormonal-perspective": {
    rowHeader: "Hormone Affected by Poor Sleep",
    columns: ["What It Disrupts", "IVF Impact"],
    rows: [
      ["Melatonin", "Antioxidant in ovarian follicles — sleep deprivation lowers it", "Reduced egg quality; lower oocyte success rate in IVF"],
      ["Cortisol (stress hormone)", "Elevated cortisol blocks GnRH production and ovulation signals", "Irregular stimulation response; poor uterine receptivity"],
      ["Estrogen & Progesterone", "Poor sleep disrupts production of both key reproductive hormones", "Thin endometrial lining; failed implantation"],
      ["FSH & LH", "HPO axis disrupted — ovulatory hormones become irregular", "Anovulation or poor response to IVF stimulation medications"],
      ["Circadian rhythm overall", "Body clock dysregulation affects all reproductive systems", "Unpredictable cycle length; harder to time egg retrieval"],
    ],
  },
  "the-emotional-rollercoaster-of-ivf-why-mental-health-support-is-essential": {
    rowHeader: "IVF Emotional Challenge",
    columns: ["Effect on Treatment if Unmanaged", "BFI Support Approach"],
    rows: [
      ["Anxiety about outcomes (40% of IVF women)", "Elevated cortisol may reduce implantation success", "One-on-one counselling to develop personalised coping strategies"],
      ["Hormonal mood swings from medications", "Increases irritability, relationship strain", "Group therapy sessions — shared experience reduces isolation"],
      ["Two-week wait distress", "Obsessive symptom-checking, sleep disruption", "Mindfulness and meditation techniques taught during treatment"],
      ["Male partner emotional burden", "Helplessness → withdrawal → communication breakdown", "Couples counselling and partner inclusion in support sessions"],
      ["Repeated failure or loss", "Depression, withdrawal from treatment", "24/7 emotional support access + escalation to psychiatric care"],
    ],
  },

  // ───────────────────────── IVF COSTS / AGE / YOGA / CME ─────────────────────────
  "indian-celebrities-who-improved-fertility-through-yoga": {
    rowHeader: "Celebrity",
    columns: ["How Yoga Helped Their Fertility Journey", "Key Yoga Benefit"],
    rows: [
      ["Shilpa Shetty", "Regular yoga practice credited for staying fit and improving fertility; welcomed son Viaan", "Stress reduction + hormonal balance"],
      ["Kareena Kapoor Khan", "Yoga throughout pregnancies maintained healthy weight and reduced stress; sons Taimur and Jeh", "Physical health + smooth delivery preparation"],
      ["Lara Dutta", "Yoga balanced hormones and reduced stress; welcomed daughter Saira", "Hormone regulation through mind-body connection"],
      ["Soha Ali Khan", "Yoga kept her calm, focused, and physically healthy during pregnancy; daughter Inaaya", "Mental calm + physical readiness for motherhood"],
      ["Bipasha Basu", "Long-time yoga advocate; credits practice for overall reproductive wellness", "Fitness + fertility as a holistic approach"],
    ],
  },
  "insights-on-fertility-dr-bavishi-team-at-palanpur-society": {
    rowHeader: "BFI's 4S Treatment Principle",
    columns: ["What It Means in Practice", "How It Benefits Patients"],
    rows: [
      ["Simple", "Streamlined protocols — no unnecessary tests or steps", "Less confusion, faster start to treatment"],
      ["Safe", "Evidence-based procedures, minimal risk of OHSS, careful stimulation", "Patient safety is the primary decision driver"],
      ["Smart", "Advanced techniques: PGT, ERA, ICSI, time-lapse monitoring", "Better embryo selection, higher implantation rates"],
      ["Successful", "Personalised plans using real-case data and updated ART science", "More families created per treatment attempt"],
      ["Patient-centric approach", "Treatment decisions made for the patient, not protocols", "Respect for individual circumstances, history, and goals"],
    ],
  },
  "ivf-after-35-navigating-fertility-challenges-with-confidence-and-hope": {
    rowHeader: "Challenge After Age 35",
    columns: ["What Happens Biologically", "How IVF Addresses It"],
    rows: [
      ["Declining egg quality", "Higher chromosomal errors in eggs → failed cycles, miscarriage", "PGT screens embryos — only chromosomally normal ones transferred"],
      ["Reducing egg reserve", "Fewer eggs available for retrieval", "Controlled ovarian stimulation maximises eggs retrieved per cycle"],
      ["Increased miscarriage risk", "Chromosomal abnormalities more common", "PGT-A identifies healthy embryos before transfer"],
      ["Concern about delaying further", "Fertility drops sharply after 37-38", "Egg freezing before 37 locks in younger-egg quality for later"],
      ["Higher pregnancy complication risk", "Gestational diabetes, pre-eclampsia more likely after 35", "Close monitoring; BFI provides high-risk pregnancy co-management"],
    ],
  },
  "ivf-after-age-40-realistic-success-rates-and-treatment-strategies": {
    rowHeader: "IVF Strategy After 40",
    columns: ["What It Does", "Success Benefit"],
    rows: [
      ["Donor egg IVF", "Uses eggs from a young donor (20s-early 30s) fertilized with partner's sperm", "Live birth rates 50-70% regardless of maternal age"],
      ["PGT-A (genetic screening)", "Screens embryos for chromosomal abnormalities before transfer", "Reduces miscarriage risk, improves implantation per embryo"],
      ["ICSI", "Single sperm injected directly into each egg", "Ensures fertilisation even with low sperm quality"],
      ["Blastocyst transfer (Day 5)", "Embryos cultured to blastocyst stage before transfer", "Only the most viable embryos are transferred — higher success"],
      ["Personalised protocol", "AMH/AFC-guided dosing; tailored cycle timing", "Maximises response despite reduced ovarian reserve"],
    ],
  },
  "ivf-cost-in-ahmedabad-whats-included-how-to-plan-your-budget": {
    rowHeader: "IVF Cost Component",
    columns: ["What's Included", "Budget Planning Tip"],
    rows: [
      ["Consultation & diagnostics", "Doctor fees, hormone blood tests, pelvic ultrasound, semen analysis", "Ask about bundled consultation packages"],
      ["Stimulation medications", "Gonadotropin injections + monitoring scans during stimulation", "Medication cost varies with response — ask for a dose estimate upfront"],
      ["Egg retrieval + lab", "OPU procedure, anaesthesia, embryologist fees, culture media", "Choose a clinic with an in-house OT to reduce costs"],
      ["Embryo transfer + luteal support", "ET procedure + progesterone medications after transfer", "Ask if blastocyst culture is included or charged extra"],
      ["Optional add-ons (PGT, ERA, hatching, embryo freeze)", "Genetic screening, receptivity testing, assisted hatching, storage", "Discuss which are medically indicated vs optional before signing"],
    ],
  },

  // ───────────────────────── FEMALE INFERTILITY / TESTING ─────────────────────────
  "how-to-recognize-signs-of-ovulation-for-better-fertility-planning": {
    rowHeader: "Sign of Ovulation",
    columns: ["What It Looks / Feels Like", "When to Expect It"],
    rows: [
      ["BBT shift", "Resting temperature rises 0.2°C after ovulation", "Day 14-16; confirmed only after the event"],
      ["Cervical mucus change", "Clear, slippery, egg-white texture — facilitates sperm movement", "1-3 days before ovulation; peak fertility window"],
      ["Ovulation pain (Mittelschmerz)", "Mild, sharp cramp on one side of lower abdomen", "Around ovulation day; lasts minutes to hours"],
      ["Increased libido", "Heightened desire to conceive — nature's prompt", "During the fertile window (3-5 days before ovulation)"],
      ["LH surge (OPK positive)", "Ovulation predictor kit turns strongly positive", "24-36 hours before egg release — best time to plan"],
    ],
  },
  "how-to-test-for-female-infertility": {
    rowHeader: "Female Infertility Test",
    columns: ["What It Measures", "Why It Matters"],
    rows: [
      ["FSH (Day 2-3 blood test)", "Pituitary signal to ovaries; reflects ovarian reserve", "High FSH = fewer remaining eggs — affects IVF planning"],
      ["LH", "Triggers ovulation; detects LH surge for timing", "Abnormal LH indicates ovulatory disorder or PCOS"],
      ["AMH (Anti-Müllerian Hormone)", "Ovarian reserve — quantity of remaining eggs", "Key for deciding IVF protocol and stimulation dose"],
      ["Pelvic ultrasound (AFC)", "Antral follicle count; visualises uterus and ovaries", "Detects PCOS, fibroids, cysts, thin endometrium"],
      ["Hysterosalpingography (HSG)", "Checks fallopian tube patency and uterine cavity shape", "Detects blockage — essential before IUI or IVF"],
    ],
  },
  "impact-of-age-repeated-ivf-cycles-on-pregnancy": {
    rowHeader: "Age Group",
    columns: ["Natural Fertility Challenge", "IVF Success Outlook"],
    rows: [
      ["Under 35", "Good egg reserve; minimal age-related decline", "Best IVF outcomes — 45-55% per cycle with own eggs"],
      ["35-37", "Egg quality beginning to decline", "Good IVF results — 35-45% per cycle; act sooner"],
      ["38-40", "Reduced reserve, higher chromosomal errors", "IVF still viable; PGT-A recommended; 25-35% per cycle"],
      ["41-42", "Significant decline in egg quantity and quality", "IVF possible; consider donor eggs if reserve very low"],
      ["43+", "Very low natural and IVF success with own eggs", "Donor egg IVF gives >50% success regardless of age"],
    ],
  },
  "importance-of-folic-acid-before-and-during-pregnancy": {
    rowHeader: "Timing",
    columns: ["What Folic Acid Does", "Proven Benefit"],
    rows: [
      ["3 months before conception", "Builds folate stores; optimises cell division from day 1", "Better egg quality; healthier DNA at fertilisation"],
      ["Conception to week 4", "Neural tube forms — brain and spinal cord development begins", "Prevents spina bifida and anencephaly (NTDs)"],
      ["First trimester (weeks 1-12)", "Rapid cell growth; folate needed for every new cell", "Reduces miscarriage risk and chromosomal errors"],
      ["Second and third trimester", "Red blood cell production; prevents maternal anaemia", "Lower risk of premature birth; healthy birth weight"],
      ["During IVF treatment", "Supports embryo quality and implantation", "Better fertilisation and embryo development outcomes"],
    ],
  },
  "inauguration-of-our-new-branch-in-nikol": {
    rowHeader: "Service at BFI Nikol",
    columns: ["What It Involves", "Who It Helps"],
    rows: [
      ["Advanced IVF treatment", "Full IVF cycle with personalised protocol, ICSI, blastocyst culture", "Couples with moderate to severe infertility"],
      ["Fertility diagnostics", "AMH, AFC scan, hormonal panel, semen analysis on-site", "Anyone starting their fertility evaluation"],
      ["Personalised treatment planning", "One-on-one consultation with specialist; custom care plan", "All patients — no one-size-fits-all approach"],
      ["IUI and ovulation induction", "Affordable first-line treatment with monitoring", "Younger couples, mild factor, unexplained infertility"],
      ["Emotional and counselling support", "Dedicated counsellors throughout the journey", "Patients feeling anxious, overwhelmed, or after loss"],
    ],
  },

  // ───────────────────────── AGE / LIFESTYLE / AHMEDABAD ─────────────────────────
  "how-age-affects-fertility-myths-vs-facts": {
    rowHeader: "Common Myth",
    columns: ["The Fact", "Why It Matters"],
    rows: [
      ["Women can conceive easily until menopause", "Fertility declines from late 20s; drops sharply after 35", "Don't delay evaluation — early action preserves options"],
      ["Men's fertility is unaffected by age", "Sperm motility and DNA integrity decline after 40", "Male factor matters at any age — get tested"],
      ["IVF overcomes all age-related decline", "IVF success rates fall significantly over 40", "IVF helps but doesn't reverse biological clock"],
      ["Egg freezing guarantees future pregnancy", "Success depends on age and egg quality at freezing", "Freeze before 35 for best results"],
      ["Lifestyle can fully reverse age-related decline", "Healthy habits help but cannot stop biological aging", "Optimise health but don't wait indefinitely"],
    ],
  },
  "how-does-the-climate-and-lifestyle-in-ahmedabad-affect-fertility": {
    rowHeader: "Ahmedabad Factor",
    columns: ["How It Affects Fertility", "What You Can Do"],
    rows: [
      ["Extreme summer heat (40°C+)", "Reduces sperm motility; disrupts ovulation hormones in women", "Stay hydrated, avoid prolonged heat exposure, loose clothing"],
      ["Urban air pollution (PM2.5/PM10)", "Lowers sperm count; increases miscarriage and implantation failure risk", "Use air purifiers, reduce outdoor exercise during peak pollution"],
      ["Sedentary desk jobs", "Obesity, insulin resistance, anovulation, low testosterone", "30 min moderate activity daily; avoid prolonged sitting"],
      ["Fast food and processed diet", "Hormonal imbalance, PCOS, vitamin D and zinc deficiency", "Mediterranean-style diet; limit sugar, trans fats"],
      ["Work stress and poor sleep", "Elevated cortisol disrupts ovulation and sperm production", "Sleep 7-8 hrs; mindfulness; limit late-night screen use"],
    ],
  },
  "how-long-do-you-have-to-wait-to-try-again-after-a-miscarriage": {
    rowHeader: "Situation",
    columns: ["Recommended Waiting Period", "Why"],
    rows: [
      ["Natural / complete miscarriage", "1-2 menstrual cycles (4-8 weeks)", "Uterus heals and hormones return to baseline"],
      ["After D&C procedure", "3-6 months", "Uterine lining needs full recovery post-surgery"],
      ["Recurrent miscarriages (3 or more)", "6-12 months with evaluation", "Underlying cause must be identified and treated first"],
      ["Emotional readiness", "Individual — no fixed timeline", "Grief is real; don't rush if not emotionally ready"],
      ["Underlying condition (e.g. PCOS)", "Until condition is managed", "Untreated PCOS or thyroid issues raise miscarriage risk again"],
    ],
  },

  // ───────────────────────── FERTILITY BASICS / OVULATION ─────────────────────────
  "fertility-ovulation-facts-to-help-you-get-pregnant": {
    rowHeader: "Ovulation Tracking Method",
    columns: ["How It Works", "Best For", "Accuracy"],
    rows: [
      ["Basal Body Temperature (BBT)", "Temperature rises 0.2°C after ovulation; track daily on waking", "Confirming ovulation occurred", "Confirms past ovulation, not prediction"],
      ["Ovulation Predictor Kits (OPK)", "Detects LH surge in urine 24-36 hrs before ovulation", "Timing intercourse in advance", "High — predicts 24-36 hrs before egg release"],
      ["Cervical mucus tracking", "Clear, stretchy 'egg-white' mucus = approaching ovulation", "Natural family planning", "Moderate — varies with hydration and health"],
      ["Fertility apps", "Algorithm predicts ovulation from cycle data entered by user", "Cycle awareness and scheduling", "Variable — best combined with OPK or BBT"],
      ["Ultrasound monitoring", "Follicle growth tracked by scan, precise ovulation timing", "Irregular cycles or fertility treatment", "Very high — done at clinic by specialist"],
    ],
  },
  "foods-to-avoid-during-pregnancy-and-why": {
    rowHeader: "Food to Avoid",
    columns: ["Why It's Risky", "Safe Alternative"],
    rows: [
      ["Raw / undercooked seafood (sushi, oysters)", "Listeria, Salmonella, Vibrio — risk of miscarriage, preterm labour", "Fully cooked grilled salmon, baked shrimp, fish curry"],
      ["Undercooked meat (rare steak, pink kebabs)", "Toxoplasma gondii — can cause stillbirth or fetal brain damage", "Well-cooked meat with clear juices"],
      ["Unpasteurized dairy (brie, feta, goat's milk)", "Listeria monocytogenes — miscarriage, preterm birth, newborn infection", "Pasteurized cheese (cheddar, mozzarella, paneer)"],
      ["Raw / soft-boiled eggs (mayo, runny yolk)", "Salmonella — severe vomiting, dehydration during pregnancy", "Hard-boiled or fully cooked eggs; pasteurized egg products"],
      ["High-mercury fish (shark, swordfish, mackerel)", "Mercury accumulates and harms baby's developing brain and nervous system", "Low-mercury options: salmon, sardines, trout, anchovies"],
    ],
  },
  "government-vs-private-ivf-centres-in-ahmedabad-which-one-is-better": {
    rowHeader: "Factor",
    columns: ["Private IVF Centre (Ahmedabad)", "Government IVF Centre"],
    rows: [
      ["Technology", "ERA, time-lapse, laser hatching, AI protocols — regularly upgraded", "Basic IVF protocols; budget limits advanced equipment"],
      ["Waiting time", "Quick appointments, dedicated coordinators, minimal delays", "Long waits due to high patient load and limited slots"],
      ["Cost", "Higher; but EMI options, transparent itemised billing", "Low-cost or subsidised; suits budget-constrained couples"],
      ["Personalised care", "One-on-one counselling, tailored protocol, emotional support", "General approach; less time per patient"],
      ["Success rates & expertise", "Higher — full-time fertility specialists with modern technology", "Standard rates; part-time or limited fertility specialist cover"],
    ],
  },

  "how-long-does-it-take-for-the-uterus-to-go-back-to-normal-after-birth": {
    rowHeader: "Time Postpartum",
    columns: ["Uterus Status", "What Helps Recovery"],
    rows: [
      ["0-24 hours", "Grapefruit-sized, ~2-3 pounds; shrinks to half within 24 hrs", "Uterine contractions (aided by breastfeeding)"],
      ["1-2 weeks", "Reduces to small orange size", "Continue breastfeeding; stay mobile"],
      ["2-6 weeks", "Returns to pre-pregnancy pear size", "Pelvic floor exercises; stay hydrated"],
      ["6-12 weeks", "Fully toned and strengthened; all changes resolved", "Postnatal check-up; gentle core exercises"],
      ["Factors affecting speed", "Vaginal delivery faster than C-section; breastfeeding speeds involution", "Follow your doctor's personalised postpartum plan"],
    ],
  },
  "how-long-should-you-see-a-gynecologist-after-delivery": {
    rowHeader: "Postpartum Visit",
    columns: ["Timing", "What Is Assessed"],
    rows: [
      ["First checkup", "7-10 days after delivery", "Overall recovery, wound healing, postpartum bleeding (lochia)"],
      ["Second visit", "6-10 weeks postpartum", "Uterine recovery, C-section scar, cervical exam, contraception"],
      ["Vaginal delivery check", "Ongoing if complications", "Perineal healing, episiotomy site, uterine contractions"],
      ["C-section check", "Ongoing incision monitoring", "Infection signs, scarring, internal healing, pain management"],
      ["Mental health screen", "Each visit", "Baby blues vs postpartum depression (PPD); referral if needed"],
    ],
  },
  "how-much-weight-can-a-baby-gain-in-a-week-in-the-womb": {
    rowHeader: "Week of Pregnancy",
    columns: ["Baby's Approximate Weight", "Weekly Gain Rate"],
    rows: [
      ["12 weeks", "14 grams (0.5 oz)", "0.5-1 gram/week (first trimester)"],
      ["20 weeks", "300 grams (10.6 oz)", "50-100 grams/week (second trimester)"],
      ["28 weeks", "1 kg (2.2 lbs)", "100-200 grams/week (third trimester)"],
      ["36 weeks", "2.5 kg (5.5 lbs)", "Rapid weight gain continues"],
      ["40 weeks (full term)", "3-4 kg (6.6-8.8 lbs)", "Weight gain slows near term"],
    ],
  },
  "how-nutrition-impacts-your-fertility-what-science-says": {
    rowHeader: "Nutrient",
    columns: ["Role in Fertility", "Best Food Sources"],
    rows: [
      ["Folate (women)", "DNA synthesis; improves ovulation, reduces chromosomal errors", "Leafy greens, citrus, beans, fortified cereals"],
      ["Iron (women)", "Supports ovulation; reduces ovulatory infertility risk", "Lentils, spinach, tofu, lean red meat"],
      ["Omega-3 fatty acids (both)", "Regulates hormones, improves egg quality and embryo implantation", "Salmon, sardines, flaxseeds, walnuts"],
      ["Zinc (men)", "Boosts testosterone and sperm count", "Pumpkin seeds, oysters, legumes, nuts"],
      ["CoQ10 (men)", "Improves sperm energy production and motility", "Organ meats, soybeans, whole grains; also as supplement"],
    ],
  },
  "how-to-protect-your-mental-health-during-ivf-and-fertility-treatments": {
    rowHeader: "Mental Health Challenge",
    columns: ["Why It Happens During IVF", "How to Manage It"],
    rows: [
      ["Anxiety about outcomes", "Uncertainty of each cycle — success is never guaranteed", "Set realistic expectations; limit outcome-focused research"],
      ["Emotional sensitivity from hormones", "Fertility medications intensify mood swings", "Acknowledge this is medication-driven; communicate with partner"],
      ["Social pressure", "Family questions, comparison with peers who conceived easily", "Set boundaries; choose who you share your journey with"],
      ["Financial stress", "IVF is costly; multiple cycles add up", "Plan budget in advance; explore EMI / financial support options"],
      ["Repeated failures or procedures", "Each failed cycle adds emotional fatigue", "Work with a fertility counsellor; join peer support groups"],
    ],
  },
  "high-risk-pregnancy-a-guide-to-lifestyle-diet-and-rest-tips": {
    rowHeader: "Area",
    columns: ["Recommended Action", "Why It Matters in High-Risk Pregnancy"],
    rows: [
      ["Activity", "Gentle exercise — prenatal yoga, swimming; avoid strenuous activity", "Manages stress, supports circulation, avoids complications"],
      ["Stress management", "Meditation, deep breathing, relaxation techniques", "High stress worsens gestational hypertension and diabetes"],
      ["Sleep", "7-8 hours per night; elevate feet if swollen", "Supports hormonal regulation and physical recovery"],
      ["Diet", "Whole grains, lean protein, fruits, vegetables; control blood sugar", "Gestational diabetes management requires strict nutrition"],
      ["Avoid harmful substances", "No smoking, no alcohol, limit caffeine", "Reduce risk of preterm birth, low birth weight, fetal harm"],
    ],
  },
  "high-risk-pregnancy-due-to-diabetes-bp-thyroid-disorders": {
    rowHeader: "Condition",
    columns: ["Risk to Mother", "Risk to Baby", "Key Management"],
    rows: [
      ["Gestational diabetes", "Future type 2 diabetes risk", "High birth weight, delivery complications", "Diet modification, glucose monitoring, insulin if needed"],
      ["Chronic hypertension", "Placental abruption, organ damage", "IUGR, reduced oxygen supply", "Regular BP monitoring, antihypertensives if needed"],
      ["Preeclampsia", "Kidney/liver/heart complications", "Preterm delivery, fetal distress", "Close surveillance, planned early delivery if severe"],
      ["Hypothyroidism", "Anaemia, preeclampsia risk", "Developmental delays, miscarriage risk", "Thyroid hormone replacement; TSH monitored every 4 weeks"],
      ["Hyperthyroidism", "Heart complications", "Low birth weight, preterm birth", "Antithyroid medication at lowest effective dose"],
    ],
  },

  "rebuilding-families-fertility-treatment-options-for-cancer-survivors": {
    rowHeader: "Post-Cancer Parenthood Option",
    columns: ["When It Applies", "What It Involves"],
    rows: [
      ["IVF with own eggs / sperm", "Fertility was preserved before treatment; reserve still adequate", "Standard IVF using previously frozen or remaining own gametes"],
      ["Donor eggs / donor sperm", "Own eggs or sperm damaged by chemo/radiation beyond use", "Third-party gametes fertilised; biological parent on one side"],
      ["Surrogacy", "Uterus removed or unable to carry pregnancy safely", "Another woman carries embryo created from couple's or donor gametes"],
      ["Adoption", "No viable eggs/sperm and surrogacy not suitable or desired", "Legal adoption; no biological link; full parenthood through process"],
      ["IVF + PGT (if genetic cancer)", "Cancer was caused by inherited gene mutation (e.g. BRCA)", "PGT screens embryos to prevent passing mutation to child"],
    ],
  },
  "recurrent-miscarriage-why-does-it-keep-happening-and-what-can-you-do": {
    rowHeader: "Cause of Recurrent Miscarriage",
    columns: ["What It Is", "Treatment / Next Step"],
    rows: [
      ["Chromosomal abnormality in embryo", "Random or inherited chromosome errors prevent normal development", "PGT-A screens embryos before transfer — most treatable cause"],
      ["Antiphospholipid syndrome", "Immune condition causing blood clots in placental vessels", "Low-dose aspirin + heparin during pregnancy — highly effective"],
      ["Uterine structural issues", "Septum, fibroids, polyps, or adhesions block implantation", "Hysteroscopic surgery corrects most structural causes"],
      ["Parental chromosomal abnormality", "Balanced translocation in one partner causes unbalanced embryos", "PGT-SR (structural rearrangement) screens for matching embryos"],
      ["Unexplained RPL (no cause found)", "~50% of cases — no identifiable single cause", "Supportive care, low-dose aspirin, progesterone; close monitoring"],
    ],
  },
  "role-of-exercise-in-ivf-success": {
    rowHeader: "Exercise Benefit",
    columns: ["How It Helps IVF", "Best Activity"],
    rows: [
      ["Better blood circulation", "Delivers oxygen and nutrients to ovaries and uterus", "Walking 30 min daily; light swimming"],
      ["Stress reduction", "Releases endorphins; lowers cortisol that disrupts hormones", "Yoga, Pilates, nature walks"],
      ["Healthy weight / BMI", "Optimal BMI (18.5-24.9) supports ovulation and implantation", "Combination of cardio + strength at moderate intensity"],
      ["Hormone regulation", "Exercise normalises menstrual cycle hormones and ovulation", "Consistent moderate activity 3-5 times per week"],
      ["Mood and emotional resilience", "Reduces anxiety and depression that IVF commonly triggers", "Any enjoyable activity — dancing, swimming, gardening"],
    ],
  },
  "secondary-infertility-why-getting-pregnant-again-can-be-hard": {
    rowHeader: "Cause of Secondary Infertility",
    columns: ["Why It Develops After First Child", "How to Diagnose"],
    rows: [
      ["Age-related egg decline", "Egg quality drops after 30 and sharply after 35 — even if first conception was easy", "AMH blood test + AFC scan"],
      ["Ovulation disorders (PCOS, thyroid)", "Hormonal conditions can develop or worsen after childbirth", "Hormonal panel (LH, FSH, TSH, prolactin)"],
      ["Uterine adhesions / C-section scar", "Previous C-section can create intrauterine adhesions blocking implantation", "SIS (saline infusion sonography) or hysteroscopy"],
      ["Male factor decline (age, lifestyle)", "Sperm count and motility reduce with age, stress, and weight gain", "Updated semen analysis + DNA fragmentation test"],
      ["Endometriosis post-delivery", "Endometriosis can develop or recur after childbirth", "Ultrasound + laparoscopy if suspected"],
    ],
  },
  "postpartum-mental-health-recognizing-baby-blues-and-postpartum-depression": {
    rowHeader: "Feature",
    columns: ["Baby Blues", "Postpartum Depression (PPD)"],
    rows: [
      ["When it starts", "Within 3-5 days after delivery", "Can start anytime in the first year; often 2-4 weeks post-birth"],
      ["How long it lasts", "Up to 2 weeks; resolves naturally", "Weeks to months; does not resolve without help"],
      ["Severity", "Mild mood swings, tearfulness, irritability", "Persistent sadness, loss of interest, difficulty bonding with baby"],
      ["Risk of self-harm", "Not present", "May include thoughts of self-harm or harming the baby"],
      ["Treatment needed?", "No — rest, support, and reassurance usually enough", "Yes — professional counselling and/or medication required"],
    ],
  },
  "pregnancy-complications": {
    rowHeader: "Complication",
    columns: ["Key Symptoms to Watch", "How It's Managed"],
    rows: [
      ["Gestational hypertension", "Swelling in hands/face, sudden weight gain, headaches", "Regular BP monitoring, low-salt diet, rest, medication if needed"],
      ["Gestational diabetes", "Increased thirst, frequent urination, fatigue, nausea", "Low-GI diet, regular exercise, blood sugar monitoring, insulin if needed"],
      ["Preeclampsia", "High BP + protein in urine + organ damage signs", "Close surveillance; early planned delivery if severe"],
      ["Preterm labour", "Contractions before 37 weeks, pelvic pressure, fluid leak", "Hospitalization, medications to delay labour, steroid injections for baby"],
      ["Anemia in pregnancy", "Fatigue, dizziness, pallor, shortness of breath", "Iron supplements, iron-rich diet, IV iron if severe"],
    ],
  },
  "pregnancy-signs-symptoms": {
    rowHeader: "Pregnancy Sign",
    columns: ["When It Usually Starts", "What It Feels Like"],
    rows: [
      ["Missed period", "Day 1 of missed cycle (4+ weeks from LMP)", "No bleeding; first and most obvious indicator"],
      ["Nausea / morning sickness", "Around 6 weeks (can be any time of day)", "Waves of nausea; sometimes vomiting; subsides after first trimester"],
      ["Fatigue", "As early as week 1-2", "Unusual tiredness; progesterone-driven sleepiness"],
      ["Breast changes", "First few weeks", "Swelling, tenderness, darker nipples, visible veins"],
      ["Frequent urination", "From around week 6", "More trips to bathroom; caused by increased kidney blood flow"],
    ],
  },
  // ───────────────────────── PREGNANCY / POSTPARTUM ─────────────────────────
  "common-risks-in-twin-pregnancy-and-how-do-doctors-manage-them": {
    rowHeader: "Risk in Twin Pregnancy",
    columns: ["Why It Happens", "How Doctors Manage It"],
    rows: [
      ["Preterm labour (>50% of twins)", "Uterine over-distension, increased contractions", "Cervical length monitoring, medication, rest, hospitalisation if needed"],
      ["Low birth weight", "Shared uterine space, placental sharing", "Frequent growth ultrasounds, nutritional counselling, early intervention"],
      ["Gestational hypertension / Preeclampsia", "Greater physiological demand on maternal body", "Regular BP monitoring, urine protein testing, planned delivery if severe"],
      ["Gestational diabetes", "Amplified hormonal changes in twin pregnancies", "Early glucose screening, diet modification, insulin when required"],
      ["Twin-to-Twin Transfusion (TTTS)", "Uneven blood flow between monochorionic twins", "Targeted ultrasound, Doppler monitoring, laser surgery in severe cases"],
    ],
  },
  "complete-pregnancy-diet-chart-by-trimester-what-to-eat-in-the-first-second-third-trimester": {
    rowHeader: "Trimester",
    columns: ["Key Nutrient Focus", "What to Eat (Indian Diet)", "What to Avoid"],
    rows: [
      ["First (Week 1–12)", "Folic acid, iron, Vit B6, choline, protein", "Dal, green leafy veg, banana, pomegranate, eggs, whole wheat", "Raw fish, undercooked meat, too much tea/coffee"],
      ["Second (Week 13–26)", "Calcium, iron, omega-3, vitamin D, protein", "Roti + sabzi, milk, curd, nuts, paneer, fish, seeds", "Excess jaggery, packaged foods, high-sodium snacks"],
      ["Third (Week 27–40)", "Iron, fibre, vitamin K, magnesium, energy", "Khichdi, soups, lentils, dry fruits, coconut water", "Heavy fried foods, bloating foods like raw onion, alcohol"],
    ],
  },
  "does-stress-affect-ivf-success": {
    rowHeader: "Stress Source During IVF",
    columns: ["How It May Affect the Cycle", "Management Strategy"],
    rows: [
      ["Two-week wait anxiety", "Elevated cortisol may disrupt implantation environment", "Mindfulness, journaling, gentle walking to keep busy"],
      ["Hormonal medication side effects", "Mood swings, irritability, emotional sensitivity", "Counselling, partner support, open communication with clinic"],
      ["Financial pressure", "Chronic stress → cortisol → may affect hormone balance", "Explore EMI options early, set realistic budget expectations"],
      ["Fear of IVF failure", "Negative mindset may heighten cortisol load", "Professional psychological counselling, support groups"],
      ["Overall stress load", "May correlate with lower success in some studies", "Light exercise, adequate sleep, meditation, balanced diet"],
    ],
  },
  "dr-falguni-bavishi-at-sogog-conference-on-iui-success": {
    rowHeader: "IUI Success Factor",
    columns: ["Standard Practice", "Approach Discussed at SOGOG Conference"],
    rows: [
      ["Patient selection", "Routine IUI for all unexplained cases", "Screen for tubal patency + sperm parameters before IUI"],
      ["Ovulation trigger timing", "Fixed-day insemination", "Ultrasound-monitored trigger + 36-hour timed insemination"],
      ["Sperm preparation", "Basic wash", "Density gradient centrifugation for best motile fraction"],
      ["Number of cycles", "Vary by clinic", "3-4 cycles before escalating to IVF"],
      ["Affordability advantage", "Lower cost vs IVF", "Ideal first-line for young couples, mild factor, open tubes"],
    ],
  },
  "dr-himanshu-bavishi-speaks-on-ivf-at-sogog-conference": {
    rowHeader: "IVF Advancement",
    columns: ["What It Involves", "Patient Benefit"],
    rows: [
      ["Personalised stimulation protocols", "AMH and AFC-guided dose selection per patient", "Fewer cancelled cycles, better egg yield"],
      ["Genetic testing (PGT-A)", "Screen embryos for chromosomal errors before transfer", "Higher implantation rate, lower miscarriage risk"],
      ["Time-lapse embryo monitoring", "Continuous non-invasive embryo imaging in incubator", "Best embryo identified without disrupting development"],
      ["Vitrification (fast freezing)", "Flash-freeze eggs and embryos at -196°C", "Preservation with >90% survival on thaw"],
      ["Surgical sperm retrieval", "PESA/TESA/Micro TESE for azoospermia", "Biological fatherhood possible even with zero sperm count"],
    ],
  },
  "empowering-women-in-medicine-knowledge-sharing-program-on-advanced-fertility-and-ivf-techniques-at-nikol": {
    rowHeader: "Advanced Technique",
    columns: ["What It Does", "Best Patients For"],
    rows: [
      ["PGT (Preimplantation Genetic Testing)", "Screens embryos for chromosomal/genetic abnormalities before transfer", "Recurrent miscarriage, advanced age, prior IVF failure"],
      ["ERA (Endometrial Receptivity Array)", "Identifies the precise window when uterus is most receptive", "Repeated implantation failure despite good embryos"],
      ["Advanced stimulation protocols", "Tailored gonadotropin doses based on AMH and follicle count", "Poor responders, PCOS, or previous over-stimulation"],
      ["Egg and embryo freezing", "Vitrification preserves fertility for future use", "Pre-cancer treatment, delaying pregnancy, extra embryos"],
      ["Male infertility innovations (TESA, PRP)", "Surgical sperm retrieval; PRP to improve testicular function", "Azoospermia, very low count, failed previous TESA"],
    ],
  },
  "cme-program-on-infertility-management-successfully-conducted-at-idar": {
    rowHeader: "Patient Situation",
    columns: ["Primary Care Can Handle", "When to Refer to Fertility Specialist"],
    rows: [
      ["Under 35, trying < 12 months", "Lifestyle counselling, cycle tracking, basic blood tests", "No — reassure and monitor"],
      ["Under 35, trying 12+ months", "Semen analysis, basic hormonal panel", "Yes — refer for fertility evaluation"],
      ["Age 35+, trying 6+ months", "Preliminary workup only", "Yes — refer immediately, time-sensitive"],
      ["Irregular cycles / PCOS suspected", "Ultrasound + hormonal screening", "Refer if no conception in 3-6 months"],
      ["Male factor / prior surgeries / low AMH", "Initial semen analysis", "Refer urgently — specialist intervention needed"],
    ],
  },

  // ───────────────────────── OBESITY / BONDING / POSTPARTUM / NUTRITION / LACTATION ─────────────────────────
  "the-hidden-threat-to-fertility-how-obesity-affects-your-chances": {
    rowHeader: "How Obesity Harms Fertility",
    columns: ["Impact in Women", "Impact in Men"],
    rows: [
      ["Hormonal imbalance", "Disrupts ovulation; irregular or absent periods; anovulation", "Lowers testosterone; reduces LH/FSH signals to testes"],
      ["Insulin resistance", "Linked to PCOS; impairs follicle development and ovulation", "Reduces sperm count and motility"],
      ["Chronic inflammation", "Damages ovarian tissue; reduces egg quality and implantation", "Oxidative stress damages sperm DNA"],
      ["Sleep disturbances", "Sleep apnoea disrupts melatonin and ovulation hormones", "Sleep apnoea linked to lower testosterone"],
      ["Miscarriage risk", "2–3× higher risk of pregnancy loss in obese women", "Poor sperm quality contributes to early loss"],
    ],
  },
  "the-miracle-of-bonding-connecting-with-your-baby-before-birth": {
    rowHeader: "Prenatal Bonding Method",
    columns: ["What It Does for Your Baby", "When to Start"],
    rows: [
      ["Talking to your baby", "Baby learns mother's voice in womb; responds after birth", "As early as week 16–18 when hearing develops"],
      ["Playing music", "Stimulates auditory development; baby responds with movement", "Second trimester onward"],
      ["Gentle belly touch", "Creates sense of physical presence and security", "Any time from first trimester"],
      ["Visualisation and imagining your baby", "Strengthens emotional connection; reduces pregnancy anxiety", "Throughout all trimesters"],
      ["Responding to baby's kicks", "Builds two-way communication; parents learn baby's patterns", "Third trimester when movements are clear"],
    ],
  },
  "the-postpartum-journey-how-long-does-it-take-to-heal-after-giving-birth": {
    rowHeader: "Recovery Area",
    columns: ["Typical Healing Timeline", "Signs of Normal Recovery"],
    rows: [
      ["Vaginal healing (after vaginal birth)", "6–8 weeks", "Reduced soreness, perineal stitches dissolve naturally"],
      ["Caesarean scar healing", "6–12 months for full internal healing", "Surface closes in 6 weeks; deeper layers take longer"],
      ["Hormonal balance", "3–6 months postpartum", "Mood stabilises; menstrual cycle begins to return"],
      ["Uterine involution (shrinking back)", "6–8 weeks", "Lochia (postpartum bleeding) gradually stops"],
      ["Emotional adjustment / baby blues", "2–4 weeks for baby blues; 6–12 weeks for PPD if present", "Tearfulness fading; energy returning; bonding improving"],
    ],
  },
  "the-role-of-nutrition-in-boosting-ivf-success": {
    rowHeader: "Key Nutrient for IVF",
    columns: ["What It Does for IVF Outcome", "Best Food Sources"],
    rows: [
      ["Folic Acid (B9)", "DNA synthesis, cell division, neural tube protection; 400–800 mcg daily from 3 months before IVF", "Leafy greens, lentils, beans, broccoli, fortified cereals"],
      ["Antioxidants (Vit C, E, CoQ10)", "Neutralise free radicals; protect egg and sperm DNA from oxidative damage", "Berries, nuts, seeds, whole grains, colourful vegetables"],
      ["Healthy fats (Omega-3)", "Support hormone production; reduce inflammation; improve endometrial receptivity", "Fatty fish (salmon, sardines), walnuts, flaxseed, chia"],
      ["Protein", "Builds reproductive tissue; supports follicle and embryo development", "Eggs, lean meat, legumes, dairy, tofu"],
      ["Iron & Zinc", "Iron supports uterine lining; zinc essential for sperm health and egg maturation", "Red meat, spinach, pumpkin seeds, shellfish, chickpeas"],
    ],
  },
  "the-ultimate-guide-to-diet-in-lactation-nourishing-your-body-and-baby": {
    rowHeader: "Nutrient",
    columns: ["Why It Matters During Breastfeeding", "Best Sources for Nursing Mothers"],
    rows: [
      ["Protein (aim ~71 g/day)", "Supports milk production and baby's growth; repairs postpartum tissue", "Lean meats, eggs, lentils, beans, nuts, dairy"],
      ["Calcium", "Maintains mother's bone density; passes into milk for baby's skeleton", "Dairy products, leafy greens, fortified plant milks, tofu"],
      ["Iron", "Replenishes blood lost at birth; prevents postpartum anaemia and fatigue", "Red meat, spinach, lentils, fortified cereals"],
      ["Healthy fats (Omega-3 / DHA)", "Critical for baby's brain and eye development via breast milk", "Fatty fish (salmon, sardines), flaxseed, walnuts, olive oil"],
      ["Complex carbohydrates + fibre", "Sustain energy for feeding round-the-clock; prevent constipation", "Oats, brown rice, quinoa, whole-grain bread, fruits, veg"],
    ],
  },

  // ───────────────────────── CLINIC CHOICE / IVF OPTIONS / IVF FAILURE TREATMENT / ECTOPIC ─────────────────────────
  "factors-to-consider-right-clinic-for-ivf-journey": {
    rowHeader: "Factor to Evaluate",
    columns: ["What a Good Clinic Offers", "Key Question to Ask the Clinic"],
    rows: [
      ["Reputation and success rates", "Proven track record; age-specific live birth rates disclosed honestly", "Can you share your live birth rate for my age group in the last 12 months?"],
      ["Medical team expertise", "Board-certified fertility specialists + experienced embryologists on-site full-time", "Who performs my egg retrieval and embryo transfer — consultant or trainee?"],
      ["Technology and lab facilities", "Time-lapse imaging, vitrification, PGT, spindle-view ICSI, blastocyst culture", "What IVF technologies are available in your own lab — not outsourced?"],
      ["Personalised treatment plans", "No cookie-cutter protocols; plan tailored to your diagnosis, age, and history", "Will my protocol be based on my AMH/AFC, or do you use a standard approach?"],
      ["Patient experience and transparency", "Clear pricing; open communication; emotional support throughout", "What is included in the quoted price — are all meds, scans, and FET covered?"],
    ],
  },
  "checking-if-ivf-is-the-last-option-to-conceive": {
    rowHeader: "Fertility Treatment Option",
    columns: ["Who It's For", "When to Escalate to IVF"],
    rows: [
      ["Lifestyle changes + timed intercourse", "Young couples (<35) with no diagnosed cause; trying under 12 months", "After 6–12 months of no success; earlier if over 35"],
      ["Ovulation induction (oral medication)", "Irregular cycles, PCOS, anovulation with normal tubes and sperm", "If no pregnancy after 3–4 cycles with monitoring"],
      ["IUI (Intrauterine Insemination)", "Mild male factor, unexplained infertility, cervical factor", "After 3 failed IUI cycles or if tubes are blocked"],
      ["Laparoscopy / surgery", "Blocked tubes, endometriosis, fibroids, uterine septum", "Post-surgery, try naturally 6 months; then consider IVF if needed"],
      ["IVF", "Blocked tubes, severe male factor, multiple failed IUI, age over 38, low AMH", "IVF is recommended sooner when time is a factor — not a 'last resort'"],
    ],
  },
  "ivf-failure-treatment-is-possible": {
    rowHeader: "Cause of IVF Failure",
    columns: ["What Went Wrong", "Treatment Option After Failure"],
    rows: [
      ["Advanced maternal age / poor egg quality", "Eggs carry chromosomal errors; don't fertilise or don't develop to blastocyst", "PGT-A to select chromosomally normal embryos; or donor egg IVF"],
      ["Poor sperm quality or DNA fragmentation", "Sperm unable to fertilise egg or damages embryo early", "ICSI with selected sperm; testicular sperm extraction (TESA/PESA)"],
      ["Implantation failure (normal embryo, no implantation)", "Endometrial receptivity mismatch or immune rejection", "ERA test for optimal transfer window; immune therapy; PRP uterine infusion"],
      ["Uterine structural issues", "Polyp, fibroid, or septum prevents embryo attachment", "Hysteroscopy to remove obstruction; then re-attempt FET"],
      ["Protocol not optimised", "Ovarian response too low or too high; timing off", "Adjusted stimulation dose; different protocol (antagonist vs long); natural cycle FET"],
    ],
  },
  "complications-of-delaying-your-ivf-journey": {
    rowHeader: "What Gets Harder the Longer You Wait",
    columns: ["At 35–38 (early delay)", "At 40+ (significant delay)"],
    rows: [
      ["Egg reserve (AMH/AFC)", "Declining — fewer eggs retrieved per stimulation cycle", "Significantly diminished — may need multiple cycles or donor eggs"],
      ["Egg quality (chromosomal health)", "More chromosomally abnormal eggs per cohort than in early 30s", "Majority of eggs abnormal; PGT-A essential to find viable embryo"],
      ["IVF success rate per cycle", "30–40% live birth rate per transfer", "Under 15–20% with own eggs; rises to 50–65% with donor eggs"],
      ["Miscarriage risk", "Rises from ~15% (under 35) to ~25% (age 38)", "Over 40% miscarriage risk with own eggs if no PGT-A screening"],
      ["Male sperm quality", "Gradual decline in motility and morphology from late 30s", "DNA fragmentation rises; affects embryo quality and early development"],
    ],
  },
  "ectopic-pregnancy": {
    rowHeader: "Stage of Ectopic Pregnancy",
    columns: ["Symptoms to Watch For", "Urgency of Medical Response"],
    rows: [
      ["Early stage (before rupture)", "Abdominal or pelvic pain (varying intensity), vaginal bleeding, lower back pain", "Seek medical review immediately — early diagnosis allows less invasive treatment"],
      ["Confirmed but unruptured", "Mild one-sided pain; vaginal spotting; shoulder tip pain (diaphragm irritation)", "Medication (methotrexate) or keyhole surgery can be used — urgent but manageable"],
      ["Tube rupture (emergency)", "Sudden intense pain; fainting; low blood pressure; shoulder pain from internal bleeding", "Life-threatening emergency — call emergency services immediately; surgery required"],
      ["Diagnosis tools used", "Blood hCG levels (rise slower than normal pregnancy); transvaginal ultrasound", "Serial hCG + ultrasound every 48h — key to catching ectopic before rupture"],
      ["After treatment — fertility outlook", "Risk of ectopic recurrence ~10–15%; one tube can remain functional", "IVF may be recommended to bypass the tubes; early consultation recommended"],
    ],
  },

  // ───────────────────────── EVENTS / MICROPLASTICS / MUMBAI CLINICS / IVF MISCARRIAGE ─────────────────────────
  "celebrated-republic-day-with-hope-and-happiness-at-bavishi-fertility-institute": {
    rowHeader: "BFI Centre",
    columns: ["Republic Day Activity", "Core Value Celebrated"],
    rows: [
      ["Ahmedabad (main campus)", "National flag hoisting; team speeches; festive team activities", "Unity and national pride; shared mission to help families"],
      ["Bhuj centre", "Team gathering; flag ceremony; discussion of regional patient stories", "Resilience — serving remote communities with advanced fertility care"],
      ["Mumbai centre", "Celebrations highlighting BFI's national reach and 40+ year legacy", "Progress — from India's first vitrified-egg birth to continual innovation"],
      ["All centres — shared theme", "Honoring families who trusted BFI on their parenthood journey", "Hope — every child born via BFI is a testament to the clinic's purpose"],
      ["Broader mission reminder", "Physicians reaffirmed commitment to ethical, patient-centred care", "Responsibility — supporting those who choose BFI with their dreams"],
    ],
  },
  "what-are-microplastics-how-do-they-affect-reproductive-health": {
    rowHeader: "Source of Microplastic Exposure",
    columns: ["How It Enters the Body", "Reproductive Health Risk"],
    rows: [
      ["Food & drinking water (seafood, bottled water)", "Ingestion of particles that accumulate in tissue", "Endocrine disruption — chemical leachates mimic estrogen, disrupting hormonal balance"],
      ["Synthetic clothing (polyester, nylon fibres)", "Inhaled fibres shed during washing and wearing", "Oxidative stress on follicular cells, potentially affecting egg quality"],
      ["Cosmetics & personal care (microbeads in scrubs)", "Skin absorption and ingestion during use", "Phthalates and BPA from plastics linked to lower sperm motility"],
      ["Plastic food packaging (bottles, wrap)", "Ingestion of BPA and phthalates leached into food", "Reduced ovarian reserve; linked to earlier menopause in some studies"],
      ["Indoor air dust", "Inhaled particles settle in the respiratory and digestive tract", "Accumulation in placenta — potential risk for fetal development"],
    ],
  },
  "ivf-babies-meet-in-vadodara-a-momentous-event-creating-awareness": {
    rowHeader: "Common Myth / Stigma About IVF",
    columns: ["Reality Revealed at the Event", "What Medical Science Shows"],
    rows: [
      ["IVF children are different or less healthy", "100+ IVF babies attended — healthy, joyful, and thriving", "IVF children have the same development, health, and milestones as naturally conceived children"],
      ["Infertility is a curse or personal failure", "Couples openly shared their journeys without shame", "Infertility has medical causes — hormonal, structural, genetic — treatable with modern medicine"],
      ["IVF is a last resort and rarely works", "Families who succeeded on first or second attempt shared their stories", "Success rates at experienced centres like BFI range from 40–60% for women under 35"],
      ["Only very wealthy couples can access IVF", "Attendees from varied socioeconomic backgrounds were present", "IVF is increasingly affordable; many centres offer EMI and financial guidance"],
      ["Talking about infertility is taboo", "Over 100 families met publicly to celebrate and raise awareness", "Open conversation reduces emotional burden and encourages earlier medical help"],
    ],
  },
  "13-best-ivf-clinics-in-mumbai": {
    rowHeader: "What to Look for in an IVF Clinic",
    columns: ["Why BFI Ranks #1 in Mumbai", "Red Flags to Avoid in Any Clinic"],
    rows: [
      ["Doctor experience and credentials", "Led by Dr. Himanshu, Dr. Falguni, Dr. Parth, and Dr. Janki Bavishi — 40+ years combined", "No specialist doctors named; embryologists unqualified or uncertified"],
      ["Technology and lab standards", "Pioneered: India's first birth from vitrified frozen eggs; first international surrogacy", "Outdated equipment; no time-lapse imaging or PGT capability"],
      ["Treatment range", "IVF, ICSI, PICSI, IMSI, ERA, genetics, egg/sperm/ovary freezing, LIT — all under one roof", "Limited to basic IVF only; no fertility preservation or advanced diagnostics"],
      ["Success rate transparency", "Ranked India #1 by Times of India; age-specific outcomes disclosed", "Only overall percentages given; no age-specific breakdown; vague 'high success' claims"],
      ["Patient-centred care", "Personalised treatment plans; affordable cost; exceptional patient experience", "Assembly-line approach; rushed consultations; opaque pricing"],
    ],
  },
  "miscarriages-during-ivf-signs-causes-prevention-hope": {
    rowHeader: "Warning Sign of IVF Miscarriage",
    columns: ["What It May Mean", "What to Do Immediately"],
    rows: [
      ["Vaginal bleeding (spotting to heavy)", "Light spotting may be implantation; heavy bleeding is concerning", "Contact fertility specialist immediately — do not wait for next appointment"],
      ["Lower abdominal cramping or pain", "May indicate uterine cramping or early pregnancy loss", "Rest; call your clinic — doctor may order urgent blood hCG and ultrasound"],
      ["Passage of tissue or clots vaginally", "Can signal incomplete miscarriage requiring medical management", "Go to clinic or emergency — tissue may need to be examined"],
      ["Sudden loss of pregnancy symptoms (nausea, tenderness)", "Drop in hCG may mean the pregnancy is no longer progressing", "Blood hCG test and ultrasound to confirm whether heartbeat persists"],
      ["Lower back pain", "Can accompany uterine cramps in early pregnancy loss", "Don't self-diagnose — notify doctor who will assess alongside other signs"],
    ],
  },

  // ───────────────────────── PREGNANCY NUTRITION / POSTPARTUM EXERCISE / ULTRASOUND / AHMEDABAD IVF ─────────────────────────
  "what-to-eat-during-pregnancy-a-week-by-week-nutrition-plan": {
    rowHeader: "Pregnancy Trimester",
    columns: ["Key Nutrients to Focus On", "Top Food Sources (Veg & Non-Veg)"],
    rows: [
      ["First trimester (weeks 1–12)", "Folic acid 400–800 mcg/day; protein; iron for fetal DNA and red blood cells", "Veg: leafy greens, lentils, tofu, oats. Non-veg: eggs, liver (small), chicken, cod"],
      ["Second trimester (weeks 13–26)", "Calcium (baby's bones forming); DHA for brain; more protein as baby grows rapidly", "Veg: dairy, fortified soy, broccoli. Non-veg: salmon, sardines, lean chicken, eggs"],
      ["Third trimester (weeks 27–40)", "Iron + Vitamin C (rapid blood volume growth); Vitamin K; magnesium for muscle function", "Veg: spinach + citrus combo, nuts, seeds, sweet potato. Non-veg: red meat, clams, chicken"],
      ["Throughout pregnancy", "Hydration (2–3 litres water/day); fibre to prevent constipation; avoid raw/undercooked foods", "Whole grains, fruits, vegetables; avoid raw fish, unpasteurised dairy, excess caffeine"],
      ["Supplements", "Prenatal multivitamin + folic acid from before conception through delivery", "Start 3 months before trying to conceive; add DHA/omega-3 from second trimester"],
    ],
  },
  "when-can-you-start-exercising-after-delivery": {
    rowHeader: "Delivery Type & Recovery Stage",
    columns: ["When You Can Start", "Recommended Safe Exercise"],
    rows: [
      ["Vaginal delivery — first few days", "Light activity from day 1–2", "Short walks indoors; pelvic floor (Kegel) exercises"],
      ["Vaginal delivery — 4–6 weeks", "Moderate exercise after medical clearance at 6-week check", "Walking, postnatal yoga, gentle stretching, low-impact aerobics"],
      ["C-section — first few days", "Very gentle movement only (no abdominal strain)", "Short walks around the ward to prevent clots"],
      ["C-section — 6–8 weeks", "Structured exercise only after doctor sign-off", "Walking, swimming after wound heals, pelvic floor rehab"],
      ["All mothers — core rebuilding", "Begin core exercises only after pelvic floor is stable", "Diaphragmatic breathing, heel slides, bird-dog — avoid crunches and sit-ups"],
    ],
  },
  "when-should-you-get-3d-4d-ultrasound-during-pregnancy": {
    rowHeader: "Gestational Stage",
    columns: ["3D / 4D Ultrasound Recommendation", "What Can Be Seen"],
    rows: [
      ["Before 24 weeks", "Generally not ideal for 3D/4D", "Facial features not yet developed enough for clear imaging"],
      ["24–26 weeks", "Possible but early — image quality may vary", "Basic facial outlines; less amniotic fluid space around face"],
      ["26–32 weeks (ideal window)", "Best time for 3D and 4D scans", "Clear facial features, limbs, movements; yawning, stretching, thumb-sucking in 4D"],
      ["After 32–34 weeks", "Baby may be too large and cramped for quality images", "Head engaged in pelvis limits face access"],
      ["Medical indication (any time)", "Ordered by doctor regardless of gestational age", "Suspected facial cleft, neural tube defects, limb anomalies, twin growth assessment"],
    ],
  },
  "why-are-couples-from-other-cities-choosing-ahmedabad-for-ivf-treatment": {
    rowHeader: "Key Advantage of Ahmedabad IVF",
    columns: ["What Ahmedabad Offers", "Why It Stands Out"],
    rows: [
      ["Advanced medical infrastructure", "ICSI, blastocyst culture, PGT, vitrification — all available to global standards", "Home to leading IVF chains including BFI and Nova IVF; hub of Indian reproductive medicine"],
      ["Expert fertility specialists", "Experienced embryologists, gynecologists, and reproductive medicine teams", "Many pioneers of Indian IVF trained or practice in Ahmedabad"],
      ["Affordability without compromise", "Significantly lower cost than Mumbai, Delhi, or Bangalore for equal quality", "Competitive pricing with transparent packages — no hidden costs"],
      ["Shorter waiting times", "Appointments typically faster than metro hospitals", "Less overloaded patient load means more personalised attention per couple"],
      ["Convenient access and accommodation", "Good flight and train connectivity; range of stay options near clinics", "Couples travel from Gujarat, Rajasthan, Maharashtra, and abroad"],
    ],
  },
  "do-i-need-an-ultrasound-in-every-pregnancy-visit-is-it-safe": {
    rowHeader: "Pregnancy Stage",
    columns: ["Standard Ultrasound", "What It Checks"],
    rows: [
      ["6–9 weeks (1st trimester)", "Viability scan — confirms heartbeat and due date", "Fetal heartbeat, gestational age, multiple pregnancy, ectopic pregnancy rule-out"],
      ["11–14 weeks", "Nuchal translucency (NT) scan", "Chromosomal abnormalities (Down syndrome), fluid behind baby's neck"],
      ["18–22 weeks", "Anomaly scan — most detailed scan", "Baby's organs, spine, brain, heart, limbs, placenta position, amniotic fluid"],
      ["28–32 weeks (if needed)", "Growth scan", "Fetal growth rate, position, placental function, amniotic fluid levels"],
      ["36–40 weeks (if needed)", "Final presentation scan", "Baby's position (head-down vs breech), fluid levels, delivery planning"],
    ],
  },

  // ───────────────────────── IVF FAILURE / SUCCESS RATES / UNEXPLAINED / NST ─────────────────────────
  "understanding-the-reasons-for-ivf-failure": {
    rowHeader: "Reason for IVF Failure",
    columns: ["What Goes Wrong", "What Can Be Done"],
    rows: [
      ["Poor egg quality", "Eggs carry chromosomal errors; don't fertilise or develop normally", "PGT-A to screen embryos; CoQ10 supplements; donor eggs if severe"],
      ["Embryo implantation failure", "Embryo doesn't attach to uterine lining despite being chromosomally normal", "ERA (endometrial receptivity array) to find optimal transfer window"],
      ["Uterine cavity issues", "Polyps, fibroids inside cavity, septum, or thin endometrium block implantation", "Hysteroscopy to remove abnormalities before next cycle"],
      ["Poor sperm DNA quality", "High DNA fragmentation damages the embryo early in development", "ICSI with selected sperm; testicular sperm extraction if needed"],
      ["Age-related decline", "Over 38 — egg quality drops sharply; fewer normal embryos per cycle", "Freeze-all strategy; multiple cycles; consider donor eggs"],
    ],
  },
  "understanding-the-success-rate-of-ivf-treatment": {
    rowHeader: "Patient Age Group",
    columns: ["Average IVF Success Rate (Live Birth)", "Key Factor Affecting This Group"],
    rows: [
      ["Under 35", "35–40% per fresh cycle; similar or higher for FET", "Best egg quality and reserve; highest chance per cycle"],
      ["35–37", "25–35% per cycle", "Egg quality beginning to decline; PGT-A screening beneficial"],
      ["38–40", "15–25% per cycle", "Lower AMH and more chromosomally abnormal eggs per cohort"],
      ["41–42", "10–15% per cycle with own eggs", "Freezing multiple cycles may be needed to accumulate embryos"],
      ["43+", "Under 10% with own eggs; 50–65% with donor eggs", "Donor egg IVF recommended for most effective path forward"],
    ],
  },
  "unexplained-infertility-when-tests-are-normal-but-you-still-cant-conceive": {
    rowHeader: "Possible Hidden Cause",
    columns: ["Why Standard Tests Miss It", "How It Can Be Investigated or Treated"],
    rows: [
      ["Subtle egg quality issues", "AMH and AFC look normal, but egg DNA integrity isn't routinely tested", "IVF with PGT-A reveals chromosomal errors standard tests can't"],
      ["Sperm-egg interaction failure", "Standard semen analysis shows normal parameters", "IVF + ICSI bypasses sperm-egg binding requirement"],
      ["Endometrial receptivity mismatch", "Lining looks normal on ultrasound but may not be receptive at transfer", "ERA test determines optimal implantation window"],
      ["Subclinical immune response", "Body may treat embryo as foreign — not detectable by routine blood tests", "Immunological workup; adjunct therapies like prednisolone, intralipid"],
      ["Chromosomal mosaicism in embryos", "Embryos form and look good but carry hidden genetic errors", "PGT-A of IVF embryos identifies and selects euploid embryos"],
    ],
  },
  "unlocking-the-puzzle-of-recurrent-ivf-failure-endometriosis-and-uterine-factors": {
    rowHeader: "Cause of Recurrent IVF Failure",
    columns: ["How It Disrupts Implantation", "Investigation or Treatment"],
    rows: [
      ["Endometriosis", "Inflammatory environment in pelvis alters egg quality, fallopian tube function, and uterine receptivity", "Laparoscopy + excision; pre-transfer suppression with GnRH agonist"],
      ["Submucous fibroids or polyps", "Protrude into cavity; mechanically block embryo from implanting", "Hysteroscopic resection before next IVF cycle"],
      ["Uterine septum", "Embryo implants on poorly vascularised fibrous septum tissue", "Hysteroscopic septum resection; wait 3 months before transfer"],
      ["Thin endometrium (<7 mm)", "Insufficient blood supply and thickness for embryo to embed", "Extended oestrogen prep; platelet-rich plasma (PRP) infusion; HRT protocol"],
      ["Adenomyosis", "Myometrium invasion causes junctional zone dysfunction, disrupting embryo attachment", "GnRH agonist downregulation for 3–6 months; consider surrogacy if severe"],
    ],
  },
  "what-is-the-non-stress-test-nst-in-pregnancy-and-why-is-it-important": {
    rowHeader: "When NST Is Recommended",
    columns: ["Why It Is Needed", "What Doctors Are Watching For"],
    rows: [
      ["High-risk pregnancy (GDM, hypertension, autoimmune)", "Medical conditions can reduce oxygen delivery to the baby", "Heart rate pattern — accelerations with movement show good oxygenation"],
      ["Post-term pregnancy (>40 weeks)", "Ageing placenta may deliver less oxygen and nutrients", "Reactivity of fetal heart to confirm placenta still functioning"],
      ["Decreased fetal movement", "Reduced movement can signal fetal distress or hypoxia", "Whether heart rate rises appropriately when baby moves"],
      ["Multiple pregnancy (twins/triplets)", "Each baby's wellbeing must be monitored individually", "Separate heart-rate traces to check both babies are reactive"],
      ["Previous pregnancy loss or complication", "Higher vigilance needed to catch early signs of recurrence", "Baseline heart rate and variability — normal range 110–160 bpm"],
    ],
  },

  // ───────────────────────── TTC AFTER 40 / TWINS / IVF SUCCESS REALITY ─────────────────────────
  "trying-to-conceive-after-40-what-you-need-to-know": {
    rowHeader: "Challenge When TTC After 40",
    columns: ["How It Affects Fertility", "Medical Option to Help"],
    rows: [
      ["Reduced egg reserve (low AMH)", "Fewer eggs available each cycle; natural conception rate ~5–10% per cycle at 40", "Ovarian stimulation for IVF to collect remaining eggs"],
      ["Poor egg quality (chromosomal errors)", "Higher risk of failed fertilisation, early miscarriage, genetic abnormalities", "PGT-A testing to select chromosomally normal embryos"],
      ["Irregular FSH / LH / Estrogen levels", "Unpredictable ovulation; harder to time conception", "Personalised stimulation protocol to override irregular cycles"],
      ["Age-related health conditions (fibroids, PCOS)", "Can reduce uterine receptivity or block tubes", "Hysteroscopy, surgery, or frozen embryo transfer after treatment"],
      ["Significant decline after 43+", "Own-egg IVF success rate drops sharply", "Donor egg IVF — success rates 50–70% regardless of age"],
    ],
  },
  "twin-and-multiple-pregnancies-after-ivf-risks-and-care": {
    rowHeader: "Risk Type",
    columns: ["For the Mother", "For the Babies"],
    rows: [
      ["High blood pressure / preeclampsia", "More common in twin pregnancies; requires close BP monitoring", "Placental insufficiency can affect baby growth"],
      ["Gestational diabetes", "Higher hormonal load increases insulin resistance", "Large babies or early delivery may be needed"],
      ["Preterm labour", "Uterus stretches faster; cervix may shorten earlier", "Babies born before 37 weeks need NICU care"],
      ["Caesarean section", "Often recommended for safety, especially if Twin 2 isn't head-down", "Reduces risk of birth trauma from difficult second delivery"],
      ["Twin-to-Twin Transfusion (TTTS)", "Rare but requires specialist intervention during pregnancy", "One twin over-nourished, one under — corrected with laser surgery"],
    ],
  },
  "twin-pregnancy-delivery-options-normal-delivery-vs-c-section": {
    rowHeader: "Delivery Factor",
    columns: ["Normal Delivery (Vaginal Birth)", "C-Section (Caesarean)"],
    rows: [
      ["Hospital stay", "Shorter — typically 2–3 days", "Longer — typically 4–5 days"],
      ["Recovery time", "Faster — 1–3 weeks", "Longer — 6–8 weeks for full recovery"],
      ["Risk of complications", "Possible cord issues, fetal distress, prolonged labour", "Infection, blood clots, impact on future pregnancies"],
      ["Baby position requirement", "Requires Twin 1 to be head-down (vertex)", "Can be performed regardless of baby position"],
      ["Best for", "Both twins in good position, no placenta previa, no preterm risk", "Premature twins, placenta previa, prior C-section, medical conditions"],
    ],
  },
  "twin-pregnancy-understanding-common-risks-and-how-doctors-manage-them": {
    rowHeader: "Twin Pregnancy Risk",
    columns: ["What Causes It", "How Doctors Manage It"],
    rows: [
      ["Preterm labour and birth", "Overdistended uterus triggers early contractions", "Cervical length checks; progesterone support; hospitalisation if needed"],
      ["Low birth weight", "Twins share uterine space and nutrients", "Regular growth ultrasounds; nutritional guidance for mother"],
      ["Twin-to-Twin Transfusion (TTTS)", "Shared placenta with unequal blood flow between identical twins", "Laser surgery to balance blood flow between twins"],
      ["Gestational diabetes", "Higher hormonal demand increases insulin resistance", "Blood sugar monitoring, dietary changes, insulin if necessary"],
      ["Hypertension / preeclampsia", "Larger placenta increases BP-raising hormones", "Frequent BP checks; medication; early delivery if severe"],
    ],
  },
  "understanding-reality-behind-ivf-success-rates": {
    rowHeader: "How IVF Success Is Measured",
    columns: ["What It Actually Means", "Why Clinics May Report It Differently"],
    rows: [
      ["Positive pregnancy test", "Earliest hormonal sign of pregnancy — hCG in blood or urine", "Easiest number to inflate — ~15% of these don't reach heartbeat stage"],
      ["Ongoing pregnancy (heartbeat at 2–3 months)", "Ultrasound confirms fetal heartbeat — more reliable marker", "Better than test-positive but ~2% still lost before live birth"],
      ["Live born healthy child", "Gold standard — only measure that counts for the family", "Lowest number — but the most honest metric to ask for"],
      ["Donor egg vs own egg", "Donor cycles succeed at 50–70%; own eggs vary hugely by age", "Mixing donor + own-egg stats inflates reported success figures"],
      ["Age of patient", "Success drops sharply after 35; dramatically after 40", "Always ask for age-specific live birth rates, not overall clinic figures"],
    ],
  },

  // ───────────────────────── LIFESTYLE / EXERCISE / DIET ─────────────────────────
  "best-types-of-exercise-to-support-your-ivf-journey": {
    rowHeader: "Exercise Type",
    columns: ["Benefits for IVF", "When to Do It", "What to Avoid"],
    rows: [
      ["Walking (daily, 30 min)", "Boosts uterine blood flow, eases medication bloating, reduces anxiety", "Throughout IVF including 2-week wait", "Strenuous terrain or overheating"],
      ["Fertility yoga", "Improves pelvic circulation, lowers cortisol, opens hip area", "3-4 times per week", "Hot yoga, deep twists, inversions post-transfer"],
      ["Swimming / water aerobics", "Gentle full-body movement, joint-friendly, reduces stress", "2-3 times per week during stimulation", "Public pools post egg retrieval (infection risk)"],
      ["Pilates (light)", "Core strength, posture, supports hormonal balance", "Pre-stimulation phase", "Heavy resistance or abdominal crunches during stimulation"],
      ["Avoid: high-intensity cardio", "Can suppress ovulation, lower progesterone", "—", "Running marathons, HIIT, heavy weightlifting during IVF"],
    ],
  },

  // ───────────────────────── CME / EVENT / NEWS BLOGS ─────────────────────────
  "advancing-ovarian-science-a-full-day-scientific-program-in-surat": {
    rowHeader: "Topic Covered at Surat Program",
    columns: ["What Was Discussed", "Why It Matters for Fertility"],
    rows: [
      ["Ovarian Physiology", "How the ovary matures and releases eggs", "Foundation of every IVF or IUI plan"],
      ["Ovarian Reserve", "AMH, AFC, FSH — measuring egg quantity", "Guides stimulation dose and protocol choice"],
      ["Poor Ovarian Response", "Managing low-responder patients", "Prevents cycle cancellation, improves outcomes"],
      ["Advanced Stimulation Protocols", "Tailoring gonadotropin regimens", "Maximises eggs without OHSS risk"],
      ["Clinical Collaboration", "Case discussions across 130 gynecologists", "Uniform best-practice adoption across Surat region"],
    ],
  },
  "bavishi-fertility-institute-conducts-a-successful-cme-program-at-bardoli": {
    rowHeader: "Infertility Topic",
    columns: ["Conventional Approach", "Modern ART Approach (as discussed at CME)"],
    rows: [
      ["Diagnosis", "Basic blood tests and semen analysis", "Full hormonal panel + genetic + imaging workup"],
      ["Ovulation induction", "Clomiphene alone", "Individualised gonadotropin protocols"],
      ["Sperm issues", "Wait and re-test", "ICSI / IMSI for immediate solution"],
      ["Unexplained infertility", "Watchful waiting", "Early IUI or IVF with PGT-A"],
      ["Patient support", "Medical only", "Combined medical + emotional counselling"],
    ],
  },
  "bavishi-fertility-institute-conducts-an-educational-programme-at-rajkot": {
    rowHeader: "Treatment Area",
    columns: ["Standard Practice", "Advanced Protocol Shared at Rajkot Program"],
    rows: [
      ["Ovulation tracking", "Day 2 scan only", "Serial scans + LH surge monitoring"],
      ["IVF stimulation", "Fixed dose", "AMH-guided personalised dosing"],
      ["Embryo transfer timing", "Routine day-3 transfer", "Blastocyst + ERA-guided window"],
      ["Male factor", "Refer out", "On-site ICSI / TESA / PESA"],
      ["Counselling", "Post-treatment only", "Pre-treatment + throughout the journey"],
    ],
  },
  "bavishi-fertility-institute-hosts-fogsi-recognized-training-program-in-ahmedabad": {
    rowHeader: "Training Course",
    columns: ["Duration", "Who It's For", "Key Skills Gained"],
    rows: [
      ["IUI & Stimulation Protocol", "2 days", "Gynecologists starting infertility practice", "IUI procedure, ovulation monitoring, stimulation drugs"],
      ["Basic Infertility Course", "7 days", "OBG doctors with basic ART interest", "Diagnostics, IUI, patient counselling, ART basics"],
      ["Advanced Infertility Course", "14 days", "Specialists upgrading to full IVF", "IVF lab, ICSI, embryo culture, FET, complex cases"],
    ],
  },
  "bavishi-fertility-institute-hosts-joint-educational-cme-with-east-ahmedabad-gynaecologist-association": {
    rowHeader: "ART Act Implication",
    columns: ["Before ART Act", "After ART Act (as discussed at CME)"],
    rows: [
      ["Clinic registration", "Unregulated in many areas", "Mandatory ART Authority registration"],
      ["Donor process", "Informal, variable standards", "Regulated donor banks, strict eligibility criteria"],
      ["Patient consent", "Basic verbal consent common", "Written informed consent mandatory at every stage"],
      ["Documentation", "Minimal record-keeping", "Full case records required for compliance"],
      ["Ethical standards", "Clinic-defined", "National guidelines binding on all ART centres"],
    ],
  },

  "blighted-ovum-symptoms-causes-and-more": {
    rowHeader: "Treatment Option",
    columns: ["How It Works", "Best For", "Timeline"],
    rows: [
      ["Expectant management", "Wait for the body to miscarry naturally without intervention", "Emotionally ready to wait, no infection risk", "Days to weeks — unpredictable"],
      ["Medication (Misoprostol)", "Tablet causes uterus to contract and expel tissue", "Prefer to avoid surgery, healthy candidate", "Usually within 24-72 hours of use"],
      ["D&C (Dilation & Curettage)", "Surgical removal of pregnancy tissue under anaesthesia", "Quick resolution needed, heavy bleeding, incomplete miscarriage", "Same day procedure, recovery in 1-2 days"],
      ["Follow-up care", "Ultrasound to confirm complete expulsion + hormonal check", "All options — must confirm resolution", "1-2 weeks post-treatment"],
      ["Future pregnancies", "Most women conceive successfully after one blighted ovum", "Recurrent cases may need chromosomal testing", "Usually safe to try after 1 normal period"],
    ],
  },
  "can-a-woman-get-pregnant-once-her-periods-stop": {
    rowHeader: "Aspect",
    columns: ["Natural Conception (Periods Stopped)", "IVF with Donor Eggs"],
    rows: [
      ["Egg availability", "No viable eggs — ovaries no longer active", "Donor provides healthy young eggs"],
      ["Uterus preparation", "Uterus shrunken, may not be receptive", "Hormone therapy restores uterine lining"],
      ["Pregnancy possible?", "No — natural conception not possible", "Yes — embryo transfer can succeed"],
      ["Genetic link", "—", "Baby shares DNA with partner; mother carries pregnancy"],
      ["Donor identity", "—", "Completely confidential — never disclosed"],
    ],
  },
  "celebrating-6-years-of-care-compassion-and-miracles-at-bavishi-fertility-institute-vadodara": {
    rowHeader: "Treatment Pillar",
    columns: ["BFI Vadodara's Approach", "What Patients Experience"],
    rows: [
      ["IVF & ICSI", "Advanced embryology lab with individualised protocols", "Higher fertilisation and implantation rates"],
      ["Egg freezing", "Vitrification preserves eggs for future use", "Flexibility to plan parenthood on your timeline"],
      ["Genetic screening", "PGT-A detects chromosomal issues before transfer", "Reduced miscarriage risk, higher success per cycle"],
      ["Patient-centric care", "Personalised counselling + transparent communication", "Less anxiety, well-informed decisions"],
      ["Team commitment", "Doctors, embryologists, nurses, counsellors working together", "Compassionate care from first consult to pregnancy"],
    ],
  },
  "celebrating-the-divine-joy-six-babies-born-on-janmashtami-at-bavishi-fertility-institute": {
    rowHeader: "Delivery Aspect",
    columns: ["Natural / Vaginal Delivery", "Planned C-Section (for special dates)"],
    rows: [
      ["Timing control", "Cannot be planned for a specific date", "Can be scheduled for an auspicious date when medically safe"],
      ["Medical safety", "Lower risk when uncomplicated", "Safe when medically indicated or planned by doctor"],
      ["Emotional significance", "Spontaneous, cannot predict date", "Couples can align birth with festivals like Janmashtami"],
      ["Recovery", "Faster, shorter hospital stay", "Slightly longer recovery, 3-4 days hospital"],
      ["IVF pregnancies", "Possible when low-risk and healthy", "Often preferred for close monitoring in IVF pregnancies"],
    ],
  },
  "bavishi-fertility-institute-hosts-knowledge-sharing-program-with-bharuch-ob-gy-society": {
    rowHeader: "Challenging Case Type",
    columns: ["Clinical Challenge", "Innovative Approach Shared at Bharuch Program"],
    rows: [
      ["Unexplained infertility", "Couples with normal tests failing naturally", "Early IVF with PGT-A to detect hidden embryo issues"],
      ["Repeated IUI failure", "3+ IUI cycles without success", "Escalate to IVF rather than repeat IUI indefinitely"],
      ["Poor ovarian response", "Low egg yield despite stimulation", "Mini-IVF or ovarian rejuvenation before next cycle"],
      ["Male factor", "Borderline sperm count and motility", "ICSI / IMSI for guaranteed fertilisation"],
      ["Implantation failure", "Good embryos not sticking", "ERA test to find receptive window + embryo glue"],
    ],
  },
  "bavishi-fertility-institute-most-trusted-fertility-chain-hospital-in-gujarat": {
    rowHeader: "What Sets BFI Apart",
    columns: ["BFI's Approach", "What Patients Experience"],
    rows: [
      ["Tailored protocols", "Treatment customised per AMH, age, history", "No one-size-fits-all plan"],
      ["Family of specialists", "Dr. Himanshu, Falguni, Parth, Janki Bavishi", "Continuity of care from one dedicated team"],
      ["Compassionate culture", "Patients treated with dignity and warmth", "Emotional support throughout the journey"],
      ["Evidence-based care", "Protocols aligned with international standards", "Best global practices applied locally"],
      ["Trusted recognition", "Most Trusted Fertility Chain — Gujarat (News18)", "State-wide patient confidence across 14 centres"],
    ],
  },
  "bavishi-fertility-institute-nikol-ahmedabad-celebrates-its-first-anniversary": {
    rowHeader: "First-Year Milestone",
    columns: ["What Was Achieved", "Commitment for Year Two"],
    rows: [
      ["Clinical outcomes", "Complex infertility cases managed successfully", "Expand advanced treatment protocols"],
      ["Lab quality", "High-quality embryology and lab practices", "Adopt latest culture and cryopreservation tech"],
      ["Patient experience", "Personalised plans + transparent counselling", "Strengthen emotional and follow-up support"],
      ["Team performance", "Medical, embryology, and nursing excellence", "Continuous training and specialisation"],
      ["Community trust", "Growing patient base in Nikol, Ahmedabad", "Reliable destination for IVF across East Ahmedabad"],
    ],
  },
  "bavishi-fertility-institute-recognized-as-the-leading-ivf-chain-of-gujarat-by-radio-city": {
    rowHeader: "BFI Strength",
    columns: ["What It Means in Practice", "Patient Benefit"],
    rows: [
      ["Top fertility experts", "Specialists in IVF, ICSI, egg donation, preservation", "Access to full ART range under one roof"],
      ["Cutting-edge technology", "Internationally aligned lab protocols", "Higher embryo quality, better implantation"],
      ["High success rates", "Proven across IVF, ICSI, donor cycles", "More families created per treatment cycle"],
      ["Personalised plans", "Unique protocol per couple's diagnosis", "No unnecessary procedures, targeted care"],
      ["Compassionate care", "Support from first consult to pregnancy", "Reduced anxiety, informed decision-making"],
    ],
  },
  "best-ivf-hospitals-in-ahmedabad": {
    rowHeader: "Selection Criteria",
    columns: ["What to Check", "BFI's Standing"],
    rows: [
      ["Experience", "Years in practice, cases handled", "40+ years, pioneer of advanced IVF in Ahmedabad"],
      ["Technology", "ICSI, IMSI, PGT, Spindle View, Laser Hatching", "National firsts including vitrified egg birth"],
      ["Accreditation", "NABH, awards, third-party validation", "NABH + Best IVF Chain West India (5 consecutive years)"],
      ["Specialist team", "Dedicated IVF doctors + embryologists", "Dr. Himanshu, Falguni, Parth, Janki Bavishi + team"],
      ["Service range", "IVF, male infertility, donor, preservation, surrogacy", "All services under one roof, no referrals out"],
    ],
  },

  // ───────────────────────── AHMEDABAD / LOCATION BLOGS ─────────────────────────
  "how-to-choose-the-best-ivf-clinic-in-ahmedabad": {
    rowHeader: "Factor",
    columns: ["What a Good Clinic Offers", "Red Flag Warning Signs"],
    rows: [
      ["Doctor Expertise", "Board-certified specialists, IVF-focused training, complex-case experience", "No credentials displayed, general OB-GYN only"],
      ["Success Rate Transparency", "Age-specific live birth rates, honest reporting", "Vague 'high success' claims with no breakdown"],
      ["Lab Technology", "HEPA-filtered IVF lab, ICSI, vitrification, PGT, laser hatching", "Outdated equipment, no advanced techniques"],
      ["Range of Services", "IUI, IVF, ICSI, PGT, donor program, male infertility under one roof", "Limited procedures, frequent referrals out"],
      ["Cost Transparency", "Written itemised estimate before signing anything", "Hidden charges, medications not mentioned upfront"],
      ["Patient Support", "Empathetic counselling, responsive staff, emotional care", "Dismissive of concerns, no emotional support"],
      ["Reviews", "Verifiable patient testimonials, 4.5★+ ratings", "Few reviews, unverified claims, no patient stories"],
    ],
  },
  "ivf-treatment-cost-in-ahmedabad-across-india": {
    rowHeader: "City / Option",
    columns: ["Typical Cost Range", "Key Advantage", "Key Limitation"],
    rows: [
      ["Ahmedabad (Private)", "₹1.2L–₹2.5L all-in", "Internationally accredited labs, no surprise bills", "Travel from smaller towns needed"],
      ["Mumbai", "₹1.8L–₹3.5L", "Top-tier facilities, many specialist options", "Significantly higher cost, city logistics"],
      ["Delhi", "₹1.5L–₹3L", "Large hospital chains, specialist access", "Variable quality, longer waiting times"],
      ["Government Hospital", "₹40K–₹80K", "Lowest headline cost", "6–18 month waiting lists, no PGT or donor egg"],
      ["Mini-IVF (Minimal Stimulation)", "₹80K–₹1.2L", "Lower medication cost, fewer injections", "Fewer eggs retrieved, suits fewer patients"],
    ],
  },
  "dr-nilesh-jains-expert-guidance-on-fertility-treatments-in-mumbai": {
    rowHeader: "Treatment Aspect",
    columns: ["Traditional Approach", "BFI Advanced Approach (Dr. Nilesh Jain)"],
    rows: [
      ["Ovulation Induction", "Standard Clomiphene protocols", "Personalised gonadotropin protocol per patient"],
      ["Sperm Handling", "Conventional IVF insemination", "ICSI / IMSI for borderline and severe male factor"],
      ["Embryo Selection", "Morphology grading alone", "Time-lapse imaging + PGT for chromosomal screening"],
      ["Patient Communication", "Clinic-driven schedule only", "Collaborative planning with patient at each stage"],
      ["Outcomes Tracking", "Pregnancy rate reported", "Live birth rate + cumulative success rate tracked"],
    ],
  },
  "10-signs-you-should-see-fertility-specialist-and-when-not-to-wait": {
    rowHeader: "Your Situation",
    columns: ["How Long to Try Naturally", "Urgency Level & Next Step"],
    rows: [
      ["Under 35, no known issues", "12 months of trying", "Medium — book assessment within 1–3 months"],
      ["Age 35–37", "6 months of trying", "High — book appointment immediately"],
      ["Age 38–39", "3 months of trying", "High — do not wait longer than 3 months"],
      ["Age 40+", "Do not wait — consult first", "Very High — see specialist before trying"],
      ["Irregular / absent periods", "Do not wait", "High — may indicate ovulation failure"],
      ["2 or more miscarriages", "Do not wait", "Very High — requires urgent investigation"],
      ["Male factor concerns", "Do not wait", "High — get semen analysis now"],
      ["Previous pelvic infection or cancer treatment", "Do not wait", "Very High — immediate pre-conception consult"],
    ],
  },
  "a-complete-guide-on-explaining-periods-to-men": {
    rowHeader: "Menstrual Phase",
    columns: ["Days in Cycle", "What's Happening", "How Partners Can Help"],
    rows: [
      ["Menstruation", "Day 1–5", "Uterine lining sheds; cramping, fatigue, mood changes", "Offer pain relief, warm compress, help with chores"],
      ["Follicular Phase", "Day 6–14", "Hormones stimulate follicle and egg growth; energy rises", "Normal activity; support healthy eating habits"],
      ["Ovulation", "Around Day 14", "Egg is released — peak fertility window", "Be aware; plan together if trying to conceive"],
      ["Luteal Phase", "Day 15–28", "Uterus prepares for pregnancy; PMS symptoms may appear", "Be patient and empathetic; listen without judgment"],
    ],
  },
};
