"use client";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Calendar, Phone, MessageCircle, CheckCircle2,
  ShieldCheck, BarChart3, Lock, Sprout, Baby, Home as HomeIcon, Stethoscope,
  Zap, Building2, RotateCcw, Microscope, HeartPulse,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem, Magnetic } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer, Locations } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";

/* ────────────────────────────────────────────────────────────────────────
 * Hunault et al. (2004), Erasmus University Medical Centre, Rotterdam —
 * logistic model predicting the probability of natural conception leading
 * to a live birth within 12 months. Ported 1:1 from the original WordPress
 * shortcode plugin (bfi-hunault-calculator.php) — coefficients, clamps and
 * validation bounds are unchanged, including the original's mismatch
 * between the input hint (18–50) and the validated range (18–55).
 * ──────────────────────────────────────────────────────────────────────── */
function hunaultProbability(age: number, durationYears: number, secondaryInfertility: 0 | 1, motilityPct: number, gpReferred: 0 | 1) {
  const z =
    -2.837 +
    -0.06 * age +
    -0.06 * durationYears +
    0.726 * secondaryInfertility +
    0.069 * motilityPct +
    0.553 * gpReferred;
  const raw = 1 / (1 + Math.exp(-z));
  return Math.min(95, Math.max(3, Math.round(raw * 100)));
}

type StepN = 1 | 2 | 3;

const STEP_LABELS: Record<StepN, string> = { 1: "Your Age", 2: "Your History", 3: "Sperm & Referral" };

export function NaturalPregnancyCalculatorPage() {
  const widgetRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<StepN>(1);
  const [showResult, setShowResult] = useState(false);
  const [age, setAge] = useState("");
  const [duration, setDuration] = useState("");
  const [history, setHistory] = useState<"0" | "1">("0");
  const [motility, setMotility] = useState(40);
  const [referral, setReferral] = useState<"1" | "0">("1");
  const [error, setError] = useState("");
  const [prob, setProb] = useState(0);

  const scrollToWidget = () => widgetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const goNext = (from: StepN) => {
    if (from === 1) {
      const a = parseFloat(age);
      const d = parseFloat(duration);
      if (isNaN(a) || a < 18 || a > 55) { setError("Please enter a valid age between 18 and 55."); return; }
      if (isNaN(d) || d < 0) { setError("Please enter how long you have been trying to conceive."); return; }
    }
    setError("");
    setStep((from + 1) as StepN);
    scrollToWidget();
  };
  const goBack = (from: StepN) => { setStep((from - 1) as StepN); scrollToWidget(); };

  const calculate = () => {
    const a = parseFloat(age);
    const d = parseFloat(duration);
    const result = hunaultProbability(a, d, history === "1" ? 1 : 0, motility, referral === "1" ? 1 : 0);
    setProb(result);
    setShowResult(true);
    scrollToWidget();
  };

  const reset = () => {
    setShowResult(false);
    setStep(1);
    setAge("");
    setDuration("");
    setHistory("0");
    setMotility(40);
    setReferral("1");
    setError("");
    scrollToWidget();
  };

  const recommendation = prob >= 40 ? "Expectant" : prob >= 20 ? "IUI" : "IVF";
  const gaugeLeft = Math.min(93, Math.max(7, prob));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
          <span>/</span>
          <a href="/#tools" className="hover:text-[color:var(--rose)]">Calculators</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)]">Natural Pregnancy Calculator</span>
        </nav>
      </div>

      {/* Hero / Intro */}
      <section className="gradient-warm noise relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-20 h-[34rem] w-[34rem] rounded-full bg-[color:var(--rose)]/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-[color:var(--plum)]/15 blur-3xl" />
        </div>
        <div className="container-px relative mx-auto max-w-3xl py-14 text-center md:py-20">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--rose)]/30 bg-white/70 px-4 py-1.5 text-xs font-semibold text-[color:var(--rose)] backdrop-blur">
              <Microscope className="h-3.5 w-3.5" /> Clinically Validated · Natural Pregnancy Calculator
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-6 text-4xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-5xl text-balance">
              What Are My Chances of Conceiving <em className="font-display italic text-[color:var(--rose)]">Naturally?</em>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              This Natural Pregnancy Calculator predicts your probability of natural pregnancy within the next 12 months —
              used by fertility specialists worldwide to guide treatment decisions.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-7 flex flex-wrap justify-center gap-2.5">
              {[
                { icon: ShieldCheck, t: "Bavishi Fertility Institute" },
                { icon: BarChart3, t: "Based on 3,000+ patient study" },
                { icon: Lock, t: "No data stored" },
              ].map((b) => (
                <span key={b.t} className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-4 py-2 text-xs font-semibold text-[color:var(--plum)] shadow-soft">
                  <b.icon className="h-3.5 w-3.5 text-[color:var(--rose)]" /> {b.t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="container-px mx-auto max-w-[1000px] py-8 md:py-12">
        <Reveal>
          <div className="rounded-3xl border border-border/70 bg-[color:var(--rose-soft)]/25 p-7 md:p-10">
            <h2 className="text-xl font-semibold text-[color:var(--plum)] md:text-2xl">How Does This Natural Pregnancy Calculator Work?</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              Developed at Erasmus University Medical Centre, Rotterdam (2004), this calculator uses five clinical factors
              to calculate the likelihood of spontaneous pregnancy leading to a live birth — without fertility treatment.
              At Bavishi Fertility Institute, specialists use this score to decide between expectant management, IUI, or
              direct IVF.
            </p>
            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { icon: Baby, n: "≥ 40%", t: "Try naturally first" },
                { icon: Zap, n: "20 – 39%", t: "Consider IUI" },
                { icon: Building2, n: "< 20%", t: "IVF recommended" },
              ].map((b) => (
                <div key={b.t} className="rounded-2xl border border-border/70 bg-card p-5 text-center shadow-soft">
                  <b.icon className="mx-auto h-6 w-6 text-[color:var(--rose)]" />
                  <div className="mt-2 font-display text-xl font-bold text-[color:var(--rose)]">{b.n}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{b.t}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Calculator widget */}
      <section ref={widgetRef} className="container-px mx-auto max-w-[760px] py-4 md:py-8">
        {!showResult ? (
          <Reveal>
            <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-lift md:p-10">
              {/* Step indicator */}
              <div className="mb-9 hidden items-center sm:flex">
                {([1, 2, 3] as StepN[]).map((n, i) => (
                  <div key={n} className="flex flex-1 items-center">
                    <div className="flex flex-1 flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-bold transition-colors ${
                          n < step ? "bg-emerald-500 text-white" : n === step ? "bg-[color:var(--rose)] text-white shadow-soft" : "bg-[color:var(--rose-soft)] text-muted-foreground/60"
                        }`}
                      >
                        {n < step ? <CheckCircle2 className="h-5 w-5" /> : n}
                      </div>
                      <div className={`mt-2 text-[11px] font-semibold ${n < step ? "text-emerald-600" : n === step ? "text-[color:var(--rose)]" : "text-muted-foreground/60"}`}>
                        {STEP_LABELS[n]}
                      </div>
                    </div>
                    {i < 2 && <div className={`mb-5 h-0.5 flex-1 transition-colors ${n < step ? "bg-emerald-500" : "bg-border"}`} />}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  {step === 1 && (
                    <div>
                      <h3 className="font-display text-xl font-semibold text-[color:var(--plum)]">Step 1 — Your Age &amp; Duration</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground">These are the two strongest predictors in this natural pregnancy calculator.</p>

                      <div className="mt-8 space-y-6">
                        <div>
                          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">
                            Female Age <span className="font-medium text-muted-foreground/70">(enter age in years)</span>
                          </label>
                          <input
                            type="number" min={18} max={50} placeholder="e.g. 32" value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="h-14 w-full rounded-2xl border-2 border-border bg-white px-5 text-[15px] font-semibold text-[color:var(--plum)] outline-none transition-colors focus:border-[color:var(--rose)] focus:ring-4 focus:ring-[color:var(--rose)]/10"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">
                            How long have you been trying to conceive? <span className="font-medium text-muted-foreground/70">(in years — e.g. 1.5 for 18 months)</span>
                          </label>
                          <input
                            type="number" min={0} max={20} step={0.5} placeholder="e.g. 2" value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="h-14 w-full rounded-2xl border-2 border-border bg-white px-5 text-[15px] font-semibold text-[color:var(--plum)] outline-none transition-colors focus:border-[color:var(--rose)] focus:ring-4 focus:ring-[color:var(--rose)]/10"
                          />
                        </div>
                      </div>

                      {error && <p role="alert" className="mt-5 rounded-xl bg-[color:var(--rose)]/10 px-4 py-3 text-sm text-[color:var(--rose)]">{error}</p>}

                      <div className="mt-9 flex justify-end border-t border-border/60 pt-7">
                        <button type="button" onClick={() => goNext(1)} className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-110">
                          Continue <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <h3 className="font-display text-xl font-semibold text-[color:var(--plum)]">Step 2 — Pregnancy History</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground">Has there been any previous pregnancy — even a miscarriage or chemical pregnancy?</p>

                      <div className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                        {[
                          { v: "0" as const, icon: Sprout, t: "Primary Infertility", d: "No previous pregnancy of any kind" },
                          { v: "1" as const, icon: Baby, t: "Secondary Infertility", d: "At least one previous pregnancy (any outcome)" },
                        ].map((opt) => (
                          <button
                            key={opt.v} type="button" onClick={() => setHistory(opt.v)}
                            className={`flex flex-col items-start gap-1 rounded-2xl border-2 p-5 text-left transition-all ${
                              history === opt.v ? "border-[color:var(--rose)] bg-[color:var(--rose-soft)]/30 shadow-soft" : "border-border bg-white hover:border-[color:var(--rose)]/40"
                            }`}
                          >
                            <opt.icon className="mb-1 h-6 w-6 text-[color:var(--rose)]" />
                            <span className="font-display text-sm font-semibold text-[color:var(--plum)]">{opt.t}</span>
                            <span className="text-xs text-muted-foreground">{opt.d}</span>
                          </button>
                        ))}
                      </div>

                      <div className="mt-9 flex items-center justify-between border-t border-border/60 pt-7">
                        <button type="button" onClick={() => goBack(2)} className="inline-flex items-center gap-2 rounded-full border-2 border-border px-6 py-3 text-sm font-semibold text-muted-foreground transition hover:border-[color:var(--plum)]/30 hover:text-[color:var(--plum)]">
                          <ArrowLeft className="h-4 w-4" /> Back
                        </button>
                        <button type="button" onClick={() => goNext(2)} className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-110">
                          Continue <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div>
                      <h3 className="font-display text-xl font-semibold text-[color:var(--plum)]">Step 3 — Sperm &amp; Referral</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground">Last two inputs — then your result is ready.</p>

                      <div className="mt-8">
                        <div className="mb-3 flex items-center justify-between">
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">Sperm Motility</label>
                            <span className="text-xs text-muted-foreground/80">% of sperm that are moving — from semen analysis report</span>
                          </div>
                          <div className="font-display text-3xl font-bold text-[color:var(--rose)]">
                            {motility}<span className="text-base font-semibold text-muted-foreground/60"> %</span>
                          </div>
                        </div>
                        <input
                          type="range" min={0} max={100} value={motility}
                          onChange={(e) => setMotility(Number(e.target.value))}
                          className="h-2 w-full cursor-pointer appearance-none rounded-full outline-none accent-[color:var(--rose)]"
                          style={{ background: `linear-gradient(to right, var(--rose) ${motility}%, var(--border) ${motility}%)` }}
                        />
                        <div className="mt-2 flex justify-between text-[11px] font-semibold text-muted-foreground/60">
                          <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                        </div>
                      </div>

                      <div className="mt-9">
                        <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">Who referred you to a fertility clinic?</label>
                        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                          {[
                            { v: "1" as const, icon: HomeIcon, t: "GP / Family Doctor", d: "Referred by your general physician" },
                            { v: "0" as const, icon: Stethoscope, t: "Direct to Specialist", d: "Self-referred or specialist directly" },
                          ].map((opt) => (
                            <button
                              key={opt.v} type="button" onClick={() => setReferral(opt.v)}
                              className={`flex flex-col items-start gap-1 rounded-2xl border-2 p-5 text-left transition-all ${
                                referral === opt.v ? "border-[color:var(--rose)] bg-[color:var(--rose-soft)]/30 shadow-soft" : "border-border bg-white hover:border-[color:var(--rose)]/40"
                              }`}
                            >
                              <opt.icon className="mb-1 h-6 w-6 text-[color:var(--rose)]" />
                              <span className="font-display text-sm font-semibold text-[color:var(--plum)]">{opt.t}</span>
                              <span className="text-xs text-muted-foreground">{opt.d}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mt-9 flex items-center justify-between border-t border-border/60 pt-7">
                        <button type="button" onClick={() => goBack(3)} className="inline-flex items-center gap-2 rounded-full border-2 border-border px-6 py-3 text-sm font-semibold text-muted-foreground transition hover:border-[color:var(--plum)]/30 hover:text-[color:var(--plum)]">
                          <ArrowLeft className="h-4 w-4" /> Back
                        </button>
                        <button type="button" onClick={calculate} className="btn-luxury inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-110">
                          <Microscope className="h-4 w-4" /> Calculate My Score
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <button type="button" onClick={reset} className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-border px-5 py-2.5 text-xs font-semibold text-muted-foreground transition hover:border-[color:var(--rose)] hover:text-[color:var(--rose)]">
              <RotateCcw className="h-3.5 w-3.5" /> Recalculate
            </button>

            {/* Result hero */}
            <div className="rounded-[2rem] border border-[color:var(--rose)]/20 bg-gradient-to-b from-[color:var(--rose-soft)]/40 via-white to-white p-8 text-center shadow-lift md:p-12">
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground/70">Your 12-Month Natural Pregnancy Probability</div>
              <div className="mt-4 font-display text-6xl font-black text-[color:var(--rose)] md:text-7xl">{prob}%</div>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Estimated probability of <strong className="text-[color:var(--plum)]">natural pregnancy leading to a live birth</strong> within
                the next 12 months, based on your profile.
              </p>

              {/* Gauge */}
              <div className="mx-auto mt-8 max-w-md">
                <div className="relative h-4 rounded-full" style={{ background: "linear-gradient(to right, #ef4444, #f59e0b 35%, #22c55e 65%, #16a34a)" }}>
                  <motion.div
                    initial={{ left: "50%" }}
                    animate={{ left: `${gaugeLeft}%` }}
                    transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
                    className="absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[color:var(--plum)] bg-white shadow-md"
                  />
                </div>
                <div className="mt-2.5 flex justify-between text-[11px] font-bold text-muted-foreground/60">
                  <span>Very Low</span><span>Low</span><span>Moderate</span><span>Good</span><span>High</span>
                </div>
              </div>

              {/* Data row */}
              <div className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                {[
                  { n: `${prob}%`, l: "Your Pregnancy Score" },
                  { n: `${100 - prob}%`, l: "Chance of Not Conceiving Naturally" },
                  { n: recommendation, l: "Typical Recommendation" },
                ].map((d) => (
                  <div key={d.l} className="rounded-2xl border border-border/70 bg-card p-5 text-center shadow-soft">
                    <div className="font-display text-xl font-bold text-[color:var(--plum)]">{d.n}</div>
                    <div className="mt-1 text-[11px] font-semibold text-muted-foreground/70">{d.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interpretation */}
            <InterpretationBlock prob={prob} />

            {/* Score guide */}
            <div className="mt-7 rounded-3xl border border-border/70 bg-card p-7 shadow-soft md:p-9">
              <h3 className="font-display text-lg font-semibold text-[color:var(--plum)]">Understanding Your Natural Pregnancy Score</h3>
              <Stagger className="mt-5 divide-y divide-border/60">
                {[
                  { pill: "≥ 40%", cls: "bg-emerald-100 text-emerald-700", t: "Expectant Management — Try Naturally", d: "A good chance of natural conception. Most guidelines recommend a further 6–12 months of well-timed intercourse before starting treatment." },
                  { pill: "20 – 39%", cls: "bg-amber-100 text-amber-700", t: "Consider IUI Treatment", d: "Moderate-to-reduced prognosis for natural pregnancy. IUI (Intrauterine Insemination) is typically the recommended first step — less invasive and more affordable than IVF." },
                  { pill: "< 20%", cls: "bg-blue-100 text-blue-700", t: "Move Directly to IVF", d: "A low score means natural conception is unlikely within 12 months. Waiting further reduces chances — most guidelines recommend IVF directly at this level." },
                ].map((row) => (
                  <StaggerItem key={row.t}>
                    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:gap-5">
                      <span className={`inline-flex shrink-0 items-center justify-center rounded-full px-4 py-1.5 font-display text-xs font-bold ${row.cls}`}>{row.pill}</span>
                      <div>
                        <h5 className="font-display text-sm font-semibold text-[color:var(--plum)]">{row.t}</h5>
                        <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{row.d}</p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            {/* CTA */}
            <div className="relative mt-7 overflow-hidden rounded-3xl gradient-dark noise px-7 py-12 text-center text-white md:px-12 md:py-14">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/55">Next Step</p>
              <h3 className="mx-auto mt-3 max-w-md font-display text-2xl font-bold leading-snug">Speak with a Specialist at Bavishi Fertility Institute</h3>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/65">
                Our fertility specialists use your natural pregnancy probability score alongside complete investigations —
                AMH, semen analysis, uterine scan — to create a personalised treatment plan. First consultation is free.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Magnetic as="a" href="/contact" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-3.5 text-sm font-semibold text-white shadow-glow">
                  <Calendar className="h-4 w-4" /> Book Free Consultation
                </Magnetic>
                <Magnetic as="a" href="https://wa.me/919712622288" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white">
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </Magnetic>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* Always-visible disclaimer */}
      <section className="container-px mx-auto max-w-5xl py-4 md:py-8">
        <div className="rounded-r-2xl border border-border/70 border-l-4 border-l-[color:var(--rose)] bg-muted/60 p-7 md:p-8">
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            This Natural Pregnancy Calculator is a clinically validated tool used by fertility specialists worldwide — but
            it works with population-level statistics, not your individual biology. Your score is a starting point, not a
            final answer.
          </p>
          <p className="mt-3.5 text-[13px] leading-relaxed text-muted-foreground">
            A score of 15% does not mean you cannot have a baby naturally. A score of 70% does not guarantee you will. Many
            factors that affect your fertility — the condition of your fallopian tubes, the quality of your eggs, the shape
            of your uterus, your hormone levels — are invisible to this calculator.
          </p>
          <p className="mt-3.5 text-[13px] font-semibold leading-relaxed text-[color:var(--plum)]">
            Please do not make any treatment decisions based on this result alone.
          </p>
          <p className="mt-3.5 text-[13px] leading-relaxed text-muted-foreground">
            If your score concerns you, or if you have been trying to conceive for more than 6 months (over 35) or 12
            months (under 35) without success, we strongly encourage you to book a consultation with a specialist at
            Bavishi Fertility Institute. A complete fertility assessment — including blood tests, ultrasound, and semen
            analysis — gives you a far more accurate and personalised picture than any online calculator can.
          </p>
          <p className="mt-3.5 text-xs leading-relaxed text-muted-foreground/70">
            This tool is provided for educational purposes only. It does not constitute medical advice and is not a
            substitute for professional clinical assessment. Bavishi Fertility Institute accepts no liability for
            decisions made based solely on this calculator&apos;s output.
          </p>
        </div>
      </section>

      {/* Our network — locations (reused) */}
      <Locations />

      <Footer />
      <FloatingCTA />
      <ScrollToTop />
      <MobileBottomBar />
    </div>
  );
}

function InterpretationBlock({ prob }: { prob: number }) {
  if (prob >= 50) {
    return (
      <div className="mt-7 rounded-3xl border border-emerald-200 bg-emerald-50 p-7 md:p-9">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-[color:var(--plum)]">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Good Prognosis — Natural Conception is Realistic
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Your score of <strong className="text-[color:var(--plum)]">{prob}%</strong> is encouraging. Based on clinical
          data, there is a meaningful chance of natural pregnancy within 12 months. Most guidelines suggest continuing to
          try naturally for the recommended period before starting treatment.
        </p>
        <ul className="mt-4 space-y-2.5 text-sm text-[color:var(--plum)]/90">
          {[
            "Continue well-timed intercourse using an ovulation predictor kit each cycle",
            "Both partners should have a complete fertility investigation if not already done",
            "If no pregnancy after 6–12 months, return to your specialist at Bavishi Fertility Institute for reassessment",
            "Age is a key factor — if you are over 35, do not wait the full 12 months before seeking guidance",
          ].map((li) => (
            <li key={li} className="flex gap-2.5 border-b border-emerald-100 pb-2.5 last:border-0">
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {li}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (prob >= 20) {
    return (
      <div className="mt-7 rounded-3xl border border-amber-200 bg-amber-50 p-7 md:p-9">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-[color:var(--plum)]">
          <Zap className="h-5 w-5 text-amber-600" /> Moderate Prognosis — IUI Is Often the First Step
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Your score of <strong className="text-[color:var(--plum)]">{prob}%</strong> indicates a reduced but not
          negligible chance of natural conception. Intrauterine Insemination (IUI) is typically recommended at this score
          level — it improves pregnancy rates significantly with minimal intervention.
        </p>
        <ul className="mt-4 space-y-2.5 text-sm text-[color:var(--plum)]/90">
          {[
            "IUI at Bavishi Fertility Institute can double or triple your chances per cycle",
            "Typically 3 IUI cycles are attempted before considering IVF",
            "IUI is significantly less invasive and more cost-effective than IVF",
            "Your specialist will personalise the recommendation after full investigations",
          ].map((li) => (
            <li key={li} className="flex gap-2.5 border-b border-amber-100 pb-2.5 last:border-0">
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /> {li}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return (
    <div className="mt-7 rounded-3xl border border-blue-200 bg-blue-50 p-7 md:p-9">
      <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-[color:var(--plum)]">
        <HeartPulse className="h-5 w-5 text-blue-600" /> Low Prognosis — IVF is Strongly Recommended
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Your score of <strong className="text-[color:var(--plum)]">{prob}%</strong> suggests that natural conception
        within 12 months is unlikely. This does <strong className="text-[color:var(--plum)]">not</strong> mean you cannot
        have a baby — it means that waiting is unlikely to help, and proceeding to IVF gives you the best chance.
      </p>
      <ul className="mt-4 space-y-2.5 text-sm text-[color:var(--plum)]/90">
        {[
          "IVF directly is recommended — further waiting reduces chances, especially with age",
          "A low score does not predict IVF failure — many patients in this range succeed with IVF",
          "Bavishi Fertility Institute specialises in patients with challenging profiles",
          "Book a consultation to get a complete individualised assessment and treatment plan",
        ].map((li) => (
          <li key={li} className="flex gap-2.5 border-b border-blue-100 pb-2.5 last:border-0">
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" /> {li}
          </li>
        ))}
      </ul>
    </div>
  );
}
