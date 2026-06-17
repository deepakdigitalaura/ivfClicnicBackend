"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, MessageCircle, Heart, Clock, Lock, Sparkles, RotateCcw, Activity } from "lucide-react";
import { Reveal } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer, Locations } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";

/* ── AMH interpretation data (ported from live ivfclinic.com) ── */
type AmhBand = "vl" | "l" | "n" | "h" | "vh";

const AMH_BANDS: Record<AmhBand, {
  name: string; cls: string;
  meaning: string[];
  steps: { icon: string; text: string }[];
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
      { icon: "📞", text: "Book an urgent fertility consultation" },
      { icon: "🔬", text: "Request an AFC (antral follicle count) scan" },
      { icon: "💊", text: "Discuss tailored IVF stimulation protocols" },
      { icon: "🥚", text: "Explore egg donation options if advised" },
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
      { icon: "🏥", text: "Schedule a fertility consultation soon" },
      { icon: "📋", text: "Get a baseline hormone panel (FSH, LH, E2)" },
      { icon: "🔬", text: "Antral follicle count scan for full picture" },
      { icon: "💬", text: "Discuss IVF timeline with your specialist" },
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
      { icon: "👩‍⚕️", text: "Discuss your full fertility plan with a specialist" },
      { icon: "📅", text: "Monitor AMH annually if not yet actively trying" },
      { icon: "🧬", text: "Consider genetic screening for egg quality assessment" },
      { icon: "🥗", text: "Maintain a fertility-supportive lifestyle" },
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
      { icon: "⚕️", text: "Screen for PCOS with ultrasound and hormones" },
      { icon: "📋", text: "Discuss gentle IVF protocols to minimise OHSS risk" },
      { icon: "🔬", text: "Monitor follicle development closely during stimulation" },
      { icon: "💬", text: "Ask your doctor about long-term management if PCOS is confirmed" },
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
      { icon: "🏥", text: "Consult a specialist before any treatment begins" },
      { icon: "📊", text: "Full hormonal + metabolic panel recommended" },
      { icon: "❄️", text: "Ask about freeze-all IVF cycles for safety" },
      { icon: "💊", text: "Discuss pre-treatment medication to reduce OHSS risk" },
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

export function AmhLevelInterpreterPage() {
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
          <span className="font-medium text-[color:var(--plum)]">AMH Level Interpreter</span>
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
              AMH Level <em className="font-display italic text-[color:var(--rose)]">Interpreter</em>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              Understand what your Anti-Müllerian Hormone (AMH) result means for your ovarian reserve, IVF response, and fertility outlook — with age-specific context.
            </p>
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
        </div>
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
                <div className="rounded-xl bg-amber-50 border-l-4 border-amber-400 px-4 py-3 text-sm font-medium text-amber-900">
                  📌 <strong>Absolute level:</strong> {AMH_BANDS[result.band].name} — {result.ngml.toFixed(2)} ng/mL
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
                    <span className="text-2xl">{s.icon}</span>
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

      <Locations />
      <Footer />
      <FloatingCTA />
      <ScrollToTop />
      <MobileBottomBar />
    </div>
  );
}
