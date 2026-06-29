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
