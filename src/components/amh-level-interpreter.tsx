"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, MessageCircle, Heart, Clock, Lock, Sparkles, RotateCcw, Activity, Phone, Hospital, ClipboardList, Dna, Leaf, Stethoscope, BarChart3, Snowflake, MapPin, Microscope, Pill, Search, Syringe, Flower2, Briefcase } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer, Locations } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { CalculatorCrossLinks } from "@/components/calculator-cross-links";
import type { CalculatorCmsData } from "@/lib/calculators";
import { Editable } from "@/components/editor/Editable";

/* ── AMH interpretation data (ported from live ivfclinic.com) ── */
type AmhBand = "vl" | "l" | "n" | "h" | "vh";

const AMH_BANDS: Record<AmhBand, {
  name: string; cls: string;
  meaning: string[];
  steps: { icon: LucideIcon; text: string }[];
  bgClass: string;
  color: string;
}> = {
  vl: {
    name: "Very Low AMH", cls: "res-vl", bgClass: "bg-red-600", color: "#c0392b",
    meaning: [
      "Your ovarian reserve appears to be significantly below average for most age groups.",
      "Fewer eggs are likely available for stimulation during IVF treatment.",
      "This does not mean IVF is impossible — it means your protocol needs to be carefully tailored.",
      "Time can be a factor at this level. An early consultation is strongly recommended.",
      "Some women with very low AMH have conceived with individualised treatment and donor egg options.",
    ],
    steps: [
      { icon: Phone, text: "Book an urgent fertility consultation" },
      { icon: Microscope, text: "Request an AFC (antral follicle count) scan" },
      { icon: Pill, text: "Discuss tailored IVF stimulation protocols" },
      { icon: Sparkles, text: "Explore egg donation options if advised" },
    ],
  },
  l: {
    name: "Low AMH", cls: "res-l", bgClass: "bg-orange-500", color: "#e67e22",
    meaning: [
      "Your egg reserve is below average, suggesting a reduced number of eggs remaining.",
      "IVF is still very possible — many women with low AMH have successful pregnancies.",
      "Your doctor may recommend a higher stimulation dose to avoid poor response.",
      "Acting sooner rather than later may improve outcomes.",
      "Lifestyle factors like diet, supplements (CoQ10, DHEA) may be discussed by your specialist.",
    ],
    steps: [
      { icon: Hospital, text: "Schedule a fertility consultation soon" },
      { icon: ClipboardList, text: "Get a baseline hormone panel (FSH, LH, E2)" },
      { icon: Microscope, text: "Antral follicle count scan for full picture" },
      { icon: MessageCircle, text: "Discuss IVF timeline with your specialist" },
    ],
  },
  n: {
    name: "Normal AMH", cls: "res-n", bgClass: "bg-emerald-600", color: "#1e7e34",
    meaning: [
      "Your ovarian reserve is within the expected range — this is a positive finding.",
      "A normal AMH suggests a good number of eggs are likely available for IVF stimulation.",
      "You may respond well to standard IVF stimulation protocols.",
      "Remember: AMH measures egg quantity, not egg quality — age and other factors also matter.",
      "Continue monitoring yearly if not yet trying to conceive, as levels naturally decline with time.",
    ],
    steps: [
      { icon: Stethoscope, text: "Discuss your full fertility plan with a specialist" },
      { icon: Calendar, text: "Monitor AMH annually if not yet actively trying" },
      { icon: Dna, text: "Consider genetic screening for egg quality assessment" },
      { icon: Leaf, text: "Maintain a fertility-supportive lifestyle" },
    ],
  },
  h: {
    name: "High AMH", cls: "res-h", bgClass: "bg-blue-600", color: "#0056b3",
    meaning: [
      "Your egg reserve is above average — this often indicates a large pool of available eggs.",
      "High AMH is commonly associated with Polycystic Ovary Syndrome (PCOS).",
      "IVF stimulation requires careful dosing to avoid Ovarian Hyperstimulation Syndrome (OHSS).",
      "A specialist will likely recommend a gentler stimulation protocol and close monitoring.",
      "High AMH does not mean fertility is guaranteed — ovulation and other factors still need evaluation.",
    ],
    steps: [
      { icon: Stethoscope, text: "Screen for PCOS with ultrasound and hormones" },
      { icon: ClipboardList, text: "Discuss gentle IVF protocols to minimise OHSS risk" },
      { icon: Microscope, text: "Monitor follicle development closely during stimulation" },
      { icon: MessageCircle, text: "Ask your doctor about long-term management if PCOS is confirmed" },
    ],
  },
  vh: {
    name: "Very High AMH", cls: "res-vh", bgClass: "bg-purple-700", color: "#8e44ad",
    meaning: [
      "Your AMH is significantly elevated — this is a strong indicator of PCOS or a similar condition.",
      "Very high AMH dramatically increases the risk of OHSS during IVF stimulation.",
      "A specialist will recommend a very carefully managed, low-dose protocol.",
      "Freeze-all embryo strategies may be advised to avoid stimulation complications.",
      "Regular monitoring and a full hormonal workup are essential before starting any treatment.",
    ],
    steps: [
      { icon: Hospital, text: "Consult a specialist before any treatment begins" },
      { icon: BarChart3, text: "Full hormonal + metabolic panel recommended" },
      { icon: Snowflake, text: "Ask about freeze-all IVF cycles for safety" },
      { icon: Pill, text: "Discuss pre-treatment medication to reduce OHSS risk" },
    ],
  },
};

/* Age-specific reference ranges (ng/mL) */
const AGE_RANGES: Record<string, { min: number; max: number; label: string }> = {
  "20to24": { min: 1.66, max: 9.49,  label: "20–24 years" },
  "25to29": { min: 1.18, max: 9.16,  label: "25–29 years" },
  "30to34": { min: 0.67, max: 7.55,  label: "30–34 years" },
  "35to39": { min: 0.77, max: 5.24,  label: "35–39 years" },
  "40to44": { min: 0.097, max: 2.96, label: "40–44 years" },
  "45to50": { min: 0.046, max: 2.06, label: "45–50 years" },
};

function classifyBand(ngml: number): AmhBand {
  if (ngml < 0.5) return "vl";
  if (ngml < 1.5) return "l";
  if (ngml <= 3.5) return "n";
  if (ngml <= 6.7) return "h";
  return "vh";
}

function ageComparison(ngml: number, ageGroup: string): { text: string; color: string } {
  const ref = AGE_RANGES[ageGroup];
  if (!ref) return { text: "", color: "#9ca3af" };
  const borderlineLoThreshold = ref.min * 1.1;
  const borderlineHiThreshold = ref.max * 0.9;
  if (ngml < ref.min)
    return { text: `⬇ Below normal for age ${ref.label} (Normal: ${ref.min} – ${ref.max} ng/mL)`, color: "#c0392b" };
  if (ngml <= borderlineLoThreshold)
    return { text: `⚠ Borderline low for age ${ref.label} (Normal: ${ref.min} – ${ref.max} ng/mL)`, color: "#e67e22" };
  if (ngml > ref.max)
    return { text: `⬆ Above normal for age ${ref.label} (Normal: ${ref.min} – ${ref.max} ng/mL)`, color: "#8e44ad" };
  if (ngml >= borderlineHiThreshold)
    return { text: `⚠ Borderline high for age ${ref.label} (Normal: ${ref.min} – ${ref.max} ng/mL)`, color: "#0056b3" };
  return { text: `✓ Within normal range for age ${ref.label} (Normal: ${ref.min} – ${ref.max} ng/mL)`, color: "#1e7e34" };
}

type Result = {
  band: AmhBand;
  ngml: number; pmol: number;
  ageComp: { text: string; color: string };
};

export function AmhLevelInterpreterPage({ cms }: { cms?: CalculatorCmsData }) {
  const cmsTitle      = cms?.title     ?? "AMH Level Interpreter";
  const cmsSubtitle   = cms?.subtitle  ?? "Understand what your Anti-Mullerian Hormone (AMH) result means for your ovarian reserve, IVF response, and fertility outlook — with age-specific context.";
  const cmsDisclaimer = cms?.disclaimer ?? "AMH is one indicator of ovarian reserve and should be interpreted alongside other tests by a qualified fertility specialist. A low AMH does not mean you cannot conceive.";
  const titleWords    = cmsTitle.split(" ");
  const titleMain     = titleWords.slice(0, -1).join(" ");
  const titleEm       = titleWords.at(-1) ?? "";
  const [unit, setUnit] = useState<"ngml" | "pmol">("ngml");
  const [value, setValue] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const selectClass =
    "h-14 w-full rounded-2xl border-2 border-border bg-white px-5 text-[15px] font-semibold text-[color:var(--plum)] outline-none transition-colors focus:border-[color:var(--rose)] focus:ring-4 focus:ring-[color:var(--rose)]/10 appearance-none";
  const inputClass =
    "h-14 w-full rounded-2xl border-2 border-border bg-white px-5 text-[15px] font-semibold text-[color:var(--plum)] outline-none transition-colors focus:border-[color:var(--rose)] focus:ring-4 focus:ring-[color:var(--rose)]/10";

  const handleCalc = () => {
    const raw = parseFloat(value);
    if (isNaN(raw) || raw <= 0) { setError("Please enter a valid AMH value greater than 0."); return; }
    if (!ageGroup) { setError("Please select your age group."); return; }
    setError("");
    const ngml = unit === "pmol" ? raw / 7.14 : raw;
    const pmol = unit === "ngml" ? raw * 7.14 : raw;
    setResult({ band: classifyBand(ngml), ngml, pmol, ageComp: ageComparison(ngml, ageGroup) });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
          <span>/</span>
          <a href="/#tools" className="hover:text-[color:var(--rose)]">Calculators</a>
          <span>/</span>
          <Editable path="title" as="span" className="font-medium text-[color:var(--plum)]" rich={false}>{cmsTitle}</Editable>
        </nav>
      </div>

      <section className="gradient-warm noise relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-20 h-[34rem] w-[34rem] rounded-full bg-[color:var(--rose)]/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-[color:var(--plum)]/15 blur-3xl" />
        </div>
        <div className="container-px relative mx-auto max-w-3xl py-14 text-center md:py-20">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--rose)]/30 bg-white/70 px-4 py-1.5 text-xs font-semibold text-[color:var(--rose)] backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Ovarian Reserve · Fertility Hormone
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-6 text-4xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-5xl text-balance">
              {titleMain} <em className="font-display italic text-[color:var(--rose)]">{titleEm}</em>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <Editable path="subtitle" as="p" className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty" rich={false}>
              {cmsSubtitle}
            </Editable>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-7 flex flex-wrap justify-center gap-2.5">
              {[{ icon: Heart, t: "Free Tool" }, { icon: Clock, t: "Instant Results" }, { icon: Lock, t: "No Data Stored" }].map((b) => (
                <span key={b.t} className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-4 py-2 text-xs font-semibold text-[color:var(--plum)] shadow-soft">
                  <b.icon className="h-3.5 w-3.5 text-[color:var(--rose)]" /> {b.t}
                </span>
              ))}
            </div>
          </Reveal>
          {/* Hero stats */}
          <Reveal delay={0.22}>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {[
                { stat: "5", label: "Age-specific reference ranges" },
                { stat: "2", label: "Units supported (ng/mL & pmol/L)" },
                { stat: "Age", label: "Always age-adjusted interpretation" },
              ].map((s) => (
                <div key={s.stat} className="rounded-2xl border border-[color:var(--rose)]/20 bg-white/80 px-5 py-3 text-center shadow-soft backdrop-blur">
                  <div className="font-display text-xl font-bold text-[color:var(--rose)]">{s.stat}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* How This Interpreter Works */}
      <section className="container-px mx-auto max-w-5xl py-10 md:py-14">
        <Reveal>
          <h2 className="text-center text-2xl font-semibold text-[color:var(--plum)] md:text-3xl">How This Interpreter Works</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
            Your AMH result in context — not just a number, but what it means for your fertility.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "1", title: "Enter Your AMH Value", desc: "Input your lab result in ng/mL or pmol/L — switch between units with one click and enter the value exactly as reported." },
              { n: "2", title: "Select Your Age Group", desc: "AMH levels decline with age. Your age group is essential for an accurate, age-specific interpretation of your result." },
              { n: "3", title: "Get Your Classification", desc: "See whether your AMH falls in the Very Low, Low, Normal, High, or Very High range — with an age-adjusted comparison." },
              { n: "4", title: "Understand Next Steps", desc: "Get specific, actionable guidance based on your result level — what it means, what to ask, and what to do next." },
            ].map((step) => (
              <div key={step.n} className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--rose)] font-display text-lg font-bold text-white">
                  {step.n}
                </div>
                <h3 className="mt-4 text-base font-semibold text-[color:var(--plum)]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* AMH Reference Ranges Table */}
      <section className="container-px mx-auto max-w-5xl py-4 md:py-8">
        <Reveal>
          <div className="rounded-3xl border border-border/70 bg-[color:var(--rose-soft)]/20 p-7 md:p-10">
            <h2 className="text-center text-2xl font-semibold text-[color:var(--plum)] md:text-3xl">AMH Reference Ranges by Age</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground">
              AMH levels decline naturally with age. Use this table to place your result in context.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-[color:var(--rose)]/30">
                    <th className="rounded-tl-xl bg-[color:var(--plum)] px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">Age Group</th>
                    <th className="bg-[color:var(--plum)] px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">Normal (ng/mL)</th>
                    <th className="bg-[color:var(--plum)] px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">Normal (pmol/L)</th>
                    <th className="rounded-tr-xl bg-[color:var(--plum)] px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">Clinical Note</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { age: "20–24 years", ngml: "1.66 – 9.49", pmol: "11.8 – 67.8", note: "Peak reproductive years — highest expected AMH" },
                    { age: "25–29 years", ngml: "1.18 – 9.16", pmol: "8.4 – 65.4", note: "Excellent reserve; plan fertility if considering delay" },
                    { age: "30–34 years", ngml: "0.67 – 7.55", pmol: "4.8 – 53.9", note: "Moderate decline; IVF outcomes remain good" },
                    { age: "35–39 years", ngml: "0.77 – 5.24", pmol: "5.5 – 37.4", note: "Significant decline; act sooner if planning IVF" },
                    { age: "40–44 years", ngml: "0.10 – 2.96", pmol: "0.7 – 21.1", note: "Reduced reserve; tailored protocol essential" },
                    { age: "45–50 years", ngml: "0.05 – 2.06", pmol: "0.3 – 14.7", note: "Very low reserve; donor egg may be discussed" },
                  ].map((row, i) => (
                    <tr key={row.age} className={i % 2 === 0 ? "bg-card" : "bg-[color:var(--ivory)]"}>
                      <td className="px-5 py-3 font-semibold text-[color:var(--plum)]">{row.age}</td>
                      <td className="px-5 py-3 font-mono text-[color:var(--plum)]/80">{row.ngml}</td>
                      <td className="px-5 py-3 font-mono text-[color:var(--plum)]/80">{row.pmol}</td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                { band: "Very Low", ngml: "< 0.5 ng/mL", color: "bg-red-600", note: "Significantly reduced reserve — urgent review" },
                { band: "Low", ngml: "0.5 – 1.5 ng/mL", color: "bg-orange-500", note: "Below average — tailored protocol needed" },
                { band: "Normal", ngml: "1.5 – 3.5 ng/mL", color: "bg-emerald-600", note: "Good reserve for most women" },
              ].map((b) => (
                <div key={b.band} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
                  <div className={`h-3 w-3 shrink-0 rounded-full ${b.color}`} />
                  <div>
                    <div className="text-xs font-bold text-[color:var(--plum)]">{b.band} · {b.ngml}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{b.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="container-px mx-auto max-w-[760px] py-10 md:py-14">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <Reveal>
                <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-lift md:p-10">
                  {/* Unit toggle */}
                  <div className="mb-6 flex gap-2">
                    {[["ngml","ng/mL"],["pmol","pmol/L"]].map(([u,l]) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setUnit(u as "ngml" | "pmol")}
                        className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${unit === u ? "bg-[color:var(--rose)] text-white" : "border border-border bg-white text-[color:var(--plum)] hover:border-[color:var(--rose)]/40"}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">
                        Your AMH Value ({unit === "ngml" ? "ng/mL" : "pmol/L"}) <span className="text-[color:var(--rose)]">*</span>
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={unit === "ngml" ? 0.01 : 0.1}
                        placeholder={unit === "ngml" ? "e.g. 1.8" : "e.g. 12.9"}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className={inputClass}
                      />
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        Normal range: {unit === "ngml" ? "1.5 – 3.5 ng/mL" : "7.1 – 25.0 pmol/L"}
                      </p>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">Your age group <span className="text-[color:var(--rose)]">*</span></label>
                      <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} className={selectClass}>
                        <option value="">— Select age group —</option>
                        <option value="20to24">20–24 years</option>
                        <option value="25to29">25–29 years</option>
                        <option value="30to34">30–34 years</option>
                        <option value="35to39">35–39 years</option>
                        <option value="40to44">40–44 years</option>
                        <option value="45to50">45–50 years</option>
                      </select>
                    </div>
                  </div>

                  {error && (
                    <p role="alert" className="mt-5 rounded-xl bg-[color:var(--rose)]/10 px-4 py-3 text-sm text-[color:var(--rose)]">{error}</p>
                  )}

                  <div className="mt-8 flex justify-end border-t border-border/60 pt-7">
                    <button type="button" onClick={handleCalc} className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-110">
                      Interpret My AMH Level <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Reveal>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <button type="button" onClick={() => setResult(null)} className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-border px-5 py-2.5 text-xs font-semibold text-muted-foreground transition hover:border-[color:var(--rose)] hover:text-[color:var(--rose)]">
                <RotateCcw className="h-3.5 w-3.5" /> Re-interpret
              </button>

              {/* Level banner */}
              <div className={`rounded-[2rem] p-8 text-center text-white md:p-10 ${AMH_BANDS[result.band].bgClass}`}>
                <div className="text-xs font-bold uppercase tracking-[0.15em] text-white/70">Your Result</div>
                <div className="mt-3 text-3xl font-black">{AMH_BANDS[result.band].name}</div>
                <div className="mt-2 text-lg font-semibold text-white/90">
                  {result.ngml.toFixed(2)} ng/mL &nbsp;|&nbsp; {result.pmol.toFixed(1)} pmol/L
                </div>
              </div>

              {/* Absolute + age context */}
              <div className="mt-5 space-y-3">
                <div className="rounded-xl bg-amber-50 border-l-4 border-amber-400 px-4 py-3 text-sm font-medium text-amber-900 flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0" /><strong>Absolute level:</strong> {AMH_BANDS[result.band].name} — {result.ngml.toFixed(2)} ng/mL
                </div>
                <div className="rounded-xl border-l-4 px-4 py-3 text-sm font-medium" style={{ borderColor: result.ageComp.color, color: result.ageComp.color, background: "#f9f9f9" }}>
                  <strong>Age-wise comparison:</strong> {result.ageComp.text}
                </div>
              </div>

              {/* Meaning */}
              <div className="mt-6 rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
                <h3 className="font-semibold text-[color:var(--plum)]">What This Result Means For You</h3>
                <ul className="mt-4 space-y-2">
                  {AMH_BANDS[result.band].meaning.map((m) => (
                    <li key={m} className="flex gap-2 text-sm leading-relaxed text-[color:var(--plum)]/80">
                      <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full" style={{ background: AMH_BANDS[result.band].color }} />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next steps */}
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {AMH_BANDS[result.band].steps.map((s) => (
                  <div key={s.text} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-[color:var(--ivory)] p-4 shadow-soft">
                    <s.icon className="h-6 w-6 shrink-0 text-[color:var(--rose)]" />
                    <p className="text-sm font-medium text-[color:var(--plum)]">{s.text}</p>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                * AMH levels vary between laboratories. Always interpret results with your treating clinician alongside AFC scan and full hormonal panel.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Patient Testimonials */}
      <section className="container-px mx-auto max-w-5xl py-6 md:py-10">
        <Reveal>
          <h2 className="text-center text-xl font-semibold text-[color:var(--plum)] md:text-2xl">What Our Patients Say About Knowing Their AMH</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {[
              { quote: "My AMH came back as 0.3 ng/mL and I panicked. The interpreter helped me understand what 'very low' means at 38 — and that IVF was still possible. We started immediately and have our son now.", bg: "bg-red-600" },
              { quote: "I had no idea my AMH of 2.1 ng/mL was perfectly normal for my age. I was worried for nothing. The age-comparison feature calmed me down before my specialist appointment.", bg: "bg-emerald-600" },
              { quote: "High AMH of 8.7 helped explain why I had PCOS. Knowing before my consultation meant I could ask the right questions about OHSS risk and the gentler protocol they ended up using.", bg: "bg-blue-600" },
              { quote: "After two failed IUIs and an AMH of 0.9 ng/mL, this tool helped us understand why we needed to move to IVF quickly. That information changed our direction at the right time.", bg: "bg-orange-500" },
            ].map((t, i) => (
              <div key={i} className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
                <div className={`inline-block h-2 w-8 rounded-full ${t.bg}`} />
                <p className="mt-3 text-sm italic leading-relaxed text-[color:var(--plum)]/80">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">— Patient at Bavishi Fertility Institute</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Doctor Quote */}
      <section className="container-px mx-auto max-w-3xl py-4 md:py-8">
        <Reveal>
          <div className="rounded-3xl bg-gradient-to-br from-[color:var(--plum)] to-[color:var(--plum)]/80 px-8 py-10 text-center text-white md:px-14">
            <div className="text-4xl text-white/30">&ldquo;</div>
            <p className="mx-auto mt-2 max-w-xl text-base leading-relaxed italic text-white/90 md:text-lg">
              AMH is one of the most powerful tools we have to personalise fertility care. A single number — interpreted in the right context — can completely change the treatment approach and lead to far better outcomes.
            </p>
            <div className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-white/50">
              — Dr. Himanshu Bavishi, Bavishi Fertility Institute
            </div>
          </div>
        </Reveal>
      </section>

      {/* Who Should Use */}
      <section className="container-px mx-auto max-w-5xl py-6 md:py-10">
        <Reveal>
          <h2 className="text-center text-xl font-semibold text-[color:var(--plum)] md:text-2xl">Who Should Use This Interpreter?</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {([
              { icon: ClipboardList, title: "Just received your AMH result", desc: "Understand what your lab number means before or after your specialist appointment." },
              { icon: Search, title: "Comparing results over time", desc: "Track how your AMH has changed year-on-year and understand whether decline is expected or concerning." },
              { icon: Syringe, title: "Planning IVF treatment", desc: "AMH predicts IVF egg yield. Know where you stand before committing to a stimulation protocol." },
              { icon: Flower2, title: "Investigating fertility before trying", desc: "Get a baseline understanding of your ovarian reserve before you start trying to conceive." },
              { icon: Stethoscope, title: "Managing PCOS", desc: "High AMH often signals PCOS. Understand the link and what it means for your treatment options." },
              { icon: Briefcase, title: "Considering egg freezing", desc: "AMH is a key factor in egg freezing decisions — understand your reserve before time becomes a factor." },
            ] as { icon: LucideIcon; title: string; desc: string }[]).map((p) => (
              <div key={p.title} className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
                <p.icon className="h-6 w-6 shrink-0 text-[color:var(--rose)]" />
                <div>
                  <h3 className="text-sm font-semibold text-[color:var(--plum)]">{p.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="container-px mx-auto max-w-5xl py-8 md:py-12">
        <Reveal delay={0.05}>
          <div className="rounded-3xl border border-border/70 bg-[color:var(--rose-soft)]/25 p-7 md:p-10">
            <h2 className="text-xl font-semibold text-[color:var(--plum)] md:text-2xl">What is AMH?</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                { icon: Activity, title: "Ovarian Reserve Marker", desc: "AMH is produced by small follicles in the ovary and reflects your remaining egg supply." },
                { icon: Sparkles, title: "IVF Response Predictor", desc: "AMH helps predict how many eggs may be retrieved during IVF stimulation." },
                { icon: Heart, title: "Age-Specific Interpretation", desc: "Normal AMH varies significantly with age — always compare against your age group's range." },
              ].map((i) => (
                <div key={i.title} className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
                  <i.icon className="h-6 w-6 text-[color:var(--rose)]" />
                  <h3 className="mt-4 text-base font-semibold text-[color:var(--plum)]">{i.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="container-px mx-auto max-w-5xl py-8 md:py-12">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] gradient-dark noise px-7 py-12 text-white md:px-12 md:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_42%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Want a full picture?</p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight text-white">Get an AMH interpretation alongside a full fertility workup.</h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
                  Our specialists review your AMH alongside AFC scan, FSH, LH, and full hormonal profile to give you an accurate, personalised fertility assessment.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a href="/contact" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-3.5 text-sm font-semibold text-white shadow-glow">
                  <Calendar className="h-4 w-4" /> Book Consultation
                </a>
                <a href="https://wa.me/919712622288" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white">
                  <MessageCircle className="h-4 w-4" /> WhatsApp Support
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* About This Tool */}
      <section className="container-px mx-auto max-w-5xl py-6 md:py-10">
        <Reveal>
          <div className="rounded-3xl border border-border/70 bg-card p-7 md:p-10">
            <h2 className="text-xl font-semibold text-[color:var(--plum)] md:text-2xl">About This Tool</h2>
            <Editable path="disclaimer" as="p" className="mt-5 text-[15px] leading-relaxed text-muted-foreground whitespace-pre-line" rich={false}>{cmsDisclaimer}</Editable>
            {cms?.faqs && cms.faqs.length > 0 && (
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-semibold text-[color:var(--plum)]">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  {cms.faqs.map((f, i) => (
                    <details key={i} className="group rounded-2xl border border-border/60 bg-white/70 px-5 py-4 open:pb-4">
                      <summary className="cursor-pointer list-none font-semibold text-[color:var(--plum)] text-[15px]">{f.question}</summary>
                      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{f.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </section>

      <CalculatorCrossLinks current="/calculators/amh-level" />
      <Locations />
      <Footer />
      <FloatingCTA />
      <ScrollToTop />
      <MobileBottomBar />
    </div>
  );
}
