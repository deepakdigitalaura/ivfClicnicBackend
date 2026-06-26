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
};
