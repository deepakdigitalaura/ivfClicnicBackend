"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, MessageCircle, Heart, Clock, Lock, Sparkles, RotateCcw, TrendingUp, CheckCircle2, Users } from "lucide-react";
import { Reveal } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer, Locations } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { CalculatorCrossLinks } from "@/components/calculator-cross-links";

/* ── lookup tables (ported from live ivfclinic.com inline JS) ── */
const AGE_BASE: Record<string, number> = { u30: 68, "30": 62, "35": 52, "38": 38, "41": 24, "43": 12 };
const DIAG_MOD: Record<string, number> = {
  unexplained: 0, pcos: 5, tubal: -5, male: 0, severe_male: 0, endo: -8, dim: -15, uterine: -10,
};
const PREV_MOD: Record<string, number> = { "0": 0, "1": -3, "2": -7, "3": -12 };

const BAND_LABEL: Record<string, string> = {
  high: "Favourable Prognosis",
  moderate: "Moderate Prognosis",
  low: "Challenging — Specialist Review Needed",
};
const BAND_TEXT: Record<string, string> = {
  high: "Your profile indicates a favourable chance of IVF success. With the right protocol and specialist team, your outlook is genuinely encouraging.",
  moderate: "Your profile shows moderate chances per cycle. Optimising your protocol and addressing modifiable factors can improve your outcome meaningfully.",
  low: "Your profile indicates a more challenging prognosis per cycle. However, many patients in this range achieve success with specialist care, optimised protocols, and the right approach.",
};
const BAND_COLOR: Record<string, string> = { high: "#5cb85c", moderate: "#f0ad4e", low: "#e74c3c" };

const DIAG_LABELS: Record<string, string> = {
  unexplained: "Unexplained infertility",
  pcos: "PCOS / Ovulatory disorder",
  tubal: "Tubal factor",
  male: "Male factor",
  severe_male: "Severe male factor (azoospermia)",
  endo: "Endometriosis",
  dim: "Diminished ovarian reserve",
  uterine: "Uterine factor",
};

type Result = {
  score: number;
  band: "high" | "moderate" | "low";
  cumulative: number;
  factors: { label: string; val: string; color: string }[];
};

function calc(
  age: string, diag: string, prev: string, prevPreg: string, embryo: string, eggs: string,
): Result {
  const base = eggs === "donor" ? 65 : (AGE_BASE[age] ?? 0);
  const diagMod = eggs === "donor" && diag === "dim" ? 0 : (DIAG_MOD[diag] ?? 0);
  let score = base + diagMod + (PREV_MOD[prev] ?? 0) + (prevPreg === "yes" ? 5 : 0);
  if (embryo === "blastocyst") score *= 1.1;
  if (diag === "severe_male") score *= 0.8;
  score = Math.max(5, Math.min(88, Math.round(score)));
  const band: "high" | "moderate" | "low" = score >= 50 ? "high" : score >= 28 ? "moderate" : "low";
  const cumulative = Math.round((1 - Math.pow(1 - score / 100, 3)) * 100);

  const baseScore = eggs === "donor" ? 65 : (AGE_BASE[age] ?? 0);
  const diagColor = diagMod >= 0 ? "#5cb85c" : "#e74c3c";
  const embryoMod = embryo === "blastocyst" ? "+10% boost" : embryo === "cleavage" ? "Day 3" : "Unknown";
  const prevColor = (PREV_MOD[prev] ?? 0) >= 0 ? "#5cb85c" : "#e74c3c";

  return {
    score, band, cumulative,
    factors: [
      { label: "Age base rate", val: eggs === "donor" ? "65% (donor)" : `${baseScore}%`, color: baseScore >= 50 || eggs === "donor" ? "#5cb85c" : baseScore >= 35 ? "#f0ad4e" : "#e74c3c" },
      { label: `Diagnosis: ${DIAG_LABELS[diag] ?? diag}`, val: (diagMod >= 0 ? "+" : "") + diagMod + "%", color: diagColor },
      { label: `Embryo: ${embryo === "blastocyst" ? "Day 5 Blastocyst" : embryo === "cleavage" ? "Day 3 Cleavage" : "Not Known"}`, val: embryo === "blastocyst" ? "+10% boost" : embryoMod, color: "#9ca3af" },
      { label: `Previous attempts: ${prev}`, val: (PREV_MOD[prev] ?? 0) + "%", color: prevColor },
      { label: "Prior successful pregnancy", val: prevPreg === "yes" ? "+5%" : "0%", color: prevPreg === "yes" ? "#5cb85c" : "#9ca3af" },
      { label: "Egg source", val: eggs === "donor" ? "Donor (65% base)" : "Own eggs", color: eggs === "donor" ? "#5cb85c" : "#9ca3af" },
    ],
  };
}

export function IvfSuccessRateCalculatorPage() {
  const [age, setAge] = useState("");
  const [diag, setDiag] = useState("");
  const [prev, setPrev] = useState("0");
  const [prevPreg, setPrevPreg] = useState("no");
  const [embryo, setEmbryo] = useState("blastocyst");
  const [eggs, setEggs] = useState("own");
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const selectClass =
    "h-14 w-full rounded-2xl border-2 border-border bg-white px-5 text-[15px] font-semibold text-[color:var(--plum)] outline-none transition-colors focus:border-[color:var(--rose)] focus:ring-4 focus:ring-[color:var(--rose)]/10 appearance-none";

  const radioBtn = (name: string, id: string, value: string, label: string, current: string, setter: (v: string) => void) => (
    <label
      key={id}
      className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
        current === value
          ? "border-[color:var(--rose)] bg-[color:var(--rose-soft)]/30 text-[color:var(--plum)]"
          : "border-border bg-white text-[color:var(--plum)]/70 hover:border-[color:var(--rose)]/40"
      }`}
    >
      <input type="radio" name={name} value={value} checked={current === value} onChange={() => setter(value)} className="sr-only" />
      <span className={`h-4 w-4 shrink-0 rounded-full border-2 ${current === value ? "border-[color:var(--rose)] bg-[color:var(--rose)]" : "border-border"}`} />
      {label}
    </label>
  );

  const handleCalc = () => {
    if (!age || !diag) { setError("Please answer all required questions."); return; }
    setError("");
    setResult(calc(age, diag, prev, prevPreg, embryo, eggs));
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
          <span className="font-medium text-[color:var(--plum)]">IVF Success Rate Calculator</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="gradient-warm noise relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-20 h-[34rem] w-[34rem] rounded-full bg-[color:var(--rose)]/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-[color:var(--plum)]/15 blur-3xl" />
        </div>
        <div className="container-px relative mx-auto max-w-3xl py-14 text-center md:py-20">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--rose)]/30 bg-white/70 px-4 py-1.5 text-xs font-semibold text-[color:var(--rose)] backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Evidence-Based · Clinically Informed
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-6 text-4xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-5xl text-balance">
              IVF Success Rate <em className="font-display italic text-[color:var(--rose)]">Calculator</em>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              Estimate your personalised IVF success probability based on your age, diagnosis, treatment history, and embryo details.
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
          {/* Hero stats */}
          <Reveal delay={0.22}>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {[
                { stat: "60–70%", label: "Bavishi Fertility Rate" },
                { stat: "Age", label: "Most important factor" },
                { stat: "Day 5", label: "Best embryo transfer" },
                { stat: "3 Cycles", label: "Cumulative success" },
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

      {/* How This Calculator Works */}
      <section className="container-px mx-auto max-w-5xl py-10 md:py-14">
        <Reveal>
          <h2 className="text-center text-2xl font-semibold text-[color:var(--plum)] md:text-3xl">How This Calculator Works</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
            Your success probability is calculated using the factors that matter most — step by step.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "1", title: "Enter Your Age", desc: "Age is the strongest single predictor of IVF success. We start with your age-group's published live-birth rate." },
              { n: "2", title: "Share Your Diagnosis", desc: "Your primary fertility diagnosis is the second key factor — it adds or reduces from your age baseline." },
              { n: "3", title: "Add Clinical Factors", desc: "Treatment history, embryo type, and egg source are factored in to personalise your estimate." },
              { n: "4", title: "See Your Probability", desc: "Get your personalised success rate instantly, with a breakdown of every factor that shaped it." },
            ].map((step) => (
              <div key={step.n} className="relative rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
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

      {/* Why Know Your Success Rate */}
      <section className="container-px mx-auto max-w-5xl py-4 md:py-8">
        <Reveal>
          <div className="rounded-3xl border border-border/70 bg-[color:var(--rose-soft)]/20 p-7 md:p-10">
            <h2 className="text-center text-2xl font-semibold text-[color:var(--plum)] md:text-3xl">Why Know Your Success Rate?</h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm text-muted-foreground">Understanding your odds helps you plan, stay motivated, and make the right decisions.</p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
              {[
                { emoji: "🎯", title: "Set Realistic Expectations", desc: "Knowing your actual probability helps you prepare emotionally and practically for each cycle." },
                { emoji: "💡", title: "Understand What Helps", desc: "Discover which factors are in your favour and which are modifiable before your next cycle." },
                { emoji: "💰", title: "Plan Your Budget", desc: "Your success rate estimate helps you decide how many cycles to budget for and when to review options." },
                { emoji: "🧠", title: "Make Informed Decisions", desc: "Evidence-based estimates help you and your doctor choose the right protocol and timing." },
                { emoji: "💪", title: "Stay Motivated", desc: "Understanding your real chances — not just a generic number — keeps you focused and hopeful." },
                { emoji: "⏰", title: "Time Your Treatment", desc: "Seeing the age impact first-hand motivates acting at the right moment rather than delaying." },
              ].map((c) => (
                <div key={c.title} className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
                  <div className="text-2xl">{c.emoji}</div>
                  <h3 className="mt-3 text-sm font-semibold text-[color:var(--plum)]">{c.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Widget */}
      <section className="container-px mx-auto max-w-[760px] py-10 md:py-14">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <Reveal>
                <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-lift md:p-10">
                  <h2 className="text-xl font-semibold text-[color:var(--plum)]">About You</h2>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">Your Age Group <span className="text-[color:var(--rose)]">*</span></label>
                      <div className="relative">
                        <select value={age} onChange={(e) => setAge(e.target.value)} className={selectClass}>
                          <option value="">— Select age group —</option>
                          <option value="u30">Under 30</option>
                          <option value="30">30 – 34</option>
                          <option value="35">35 – 37</option>
                          <option value="38">38 – 40</option>
                          <option value="41">41 – 42</option>
                          <option value="43">43 or older</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">Primary Diagnosis <span className="text-[color:var(--rose)]">*</span></label>
                      <select value={diag} onChange={(e) => setDiag(e.target.value)} className={selectClass}>
                        <option value="">— Select diagnosis —</option>
                        <option value="unexplained">Unexplained infertility</option>
                        <option value="pcos">PCOS / Ovulatory disorder</option>
                        <option value="tubal">Tubal factor</option>
                        <option value="male">Male factor</option>
                        <option value="severe_male">Severe male factor (azoospermia)</option>
                        <option value="endo">Endometriosis</option>
                        <option value="dim">Diminished ovarian reserve</option>
                        <option value="uterine">Uterine factor</option>
                      </select>
                    </div>
                  </div>

                  <hr className="my-7 border-border/60" />
                  <h2 className="text-xl font-semibold text-[color:var(--plum)]">Treatment History</h2>

                  <div className="mt-5 space-y-5">
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">Previous IVF Attempts</label>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[["0","First time"],["1","1 before"],["2","2 before"],["3","3+ before"]].map(([v,l]) => radioBtn("prev","prev-"+v,v,l,prev,setPrev))}
                      </div>
                    </div>
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">Previous Successful Pregnancy?</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[["yes","✅ Yes"],["no","❌ No"]].map(([v,l]) => radioBtn("prevPreg","pp-"+v,v,l,prevPreg,setPrevPreg))}
                      </div>
                    </div>
                  </div>

                  <hr className="my-7 border-border/60" />
                  <h2 className="text-xl font-semibold text-[color:var(--plum)]">Embryo Details</h2>

                  <div className="mt-5 space-y-5">
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">Embryo Transfer Type</label>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {[["blastocyst","Day 5 Blastocyst"],["cleavage","Day 3 Cleavage"],["frozen","Not Known"]].map(([v,l]) => radioBtn("embryo","emb-"+v,v,l,embryo,setEmbryo))}
                      </div>
                    </div>
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">Egg Source</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[["own","Own eggs"],["donor","Donor eggs"]].map(([v,l]) => radioBtn("eggs","eggs-"+v,v,l,eggs,setEggs))}
                      </div>
                    </div>
                  </div>

                  {error && (
                    <p role="alert" className="mt-5 rounded-xl bg-[color:var(--rose)]/10 px-4 py-3 text-sm text-[color:var(--rose)]">{error}</p>
                  )}

                  <div className="mt-8 rounded-xl bg-amber-50 border-l-4 border-amber-400 px-4 py-3 text-xs font-semibold text-amber-900">
                    ⚠️ If your AMH is below 0.5, endometrial thickness below 7mm, or you have severe adenomyosis, please consult a specialist directly.
                  </div>

                  <div className="mt-8 flex justify-end border-t border-border/60 pt-7">
                    <button type="button" onClick={handleCalc} className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-110">
                      Calculate My Success Rate <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Reveal>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <button type="button" onClick={() => setResult(null)} className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-border px-5 py-2.5 text-xs font-semibold text-muted-foreground transition hover:border-[color:var(--rose)] hover:text-[color:var(--rose)]">
                <RotateCcw className="h-3.5 w-3.5" /> Recalculate
              </button>

              <div className={`rounded-[2rem] p-8 text-center text-white md:p-12 ${result.band === "high" ? "bg-emerald-600" : result.band === "moderate" ? "bg-amber-500" : "bg-red-500"}`}>
                <div className="text-xs font-bold uppercase tracking-[0.15em] text-white/80">Estimated Success Rate Per Cycle</div>
                <div className="mt-4 text-7xl font-black">{result.score}%</div>
                <div className="mt-3 text-lg font-semibold">{BAND_LABEL[result.band]}</div>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/80">{BAND_TEXT[result.band]}</p>
                <div className="mt-5 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold">
                  📈 Cumulative chance over 3 cycles: approximately {result.cumulative}%
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>Success probability</span><span>{result.score}%</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-[color:var(--ivory)]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: BAND_COLOR[result.band] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${result.score}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                  <span>0%</span><span>28% moderate</span><span>50% favourable</span><span>88%</span>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
                <h3 className="font-semibold text-[color:var(--plum)]">How Your Score Was Calculated</h3>
                <div className="mt-4 space-y-3">
                  {result.factors.map((f) => (
                    <div key={f.label} className="flex items-center gap-3">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: f.color }} />
                      <span className="flex-1 text-sm text-[color:var(--plum)]/80">{f.label}</span>
                      <strong className="text-sm" style={{ color: f.color }}>{f.val}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: "📋", title: "Consult a Specialist", text: "Book a consultation to validate your profile and design a personalised protocol." },
                  { icon: "🔬", title: "Full Fertility Workup", text: "A thorough investigation helps identify factors not captured by this calculator." },
                  { icon: "💊", title: "Optimise Your Health", text: "Folic acid, vitamin D, and lifestyle changes can meaningfully improve outcomes." },
                  { icon: "📈", title: "Explore All Options", text: "Ask about multi-cycle packages, donor egg programmes, and advanced techniques like PGT-A." },
                ].map((c) => (
                  <div key={c.title} className="rounded-2xl border border-border/70 bg-[color:var(--ivory)] p-5 shadow-soft">
                    <div className="text-2xl">{c.icon}</div>
                    <h4 className="mt-3 font-semibold text-[color:var(--plum)]">{c.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                * This tool is for educational purposes only and does not constitute medical advice. Success rates vary based on many clinical factors not captured here. Bavishi Fertility Institute accepts no liability for decisions made based solely on this calculator&apos;s output.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Patient Testimonial */}
      <section className="container-px mx-auto max-w-3xl py-6 md:py-10">
        <Reveal>
          <div className="rounded-3xl bg-gradient-to-br from-[color:var(--plum)] to-[color:var(--plum)]/80 px-8 py-10 text-center text-white md:px-14">
            <div className="text-4xl text-white/30">&ldquo;</div>
            <p className="mx-auto mt-2 max-w-xl text-base leading-relaxed italic text-white/90 md:text-lg">
              Knowing my actual success rate — not just a general number — helped me and my husband decide to go for a second cycle. That cycle gave us our child.
            </p>
            <div className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-white/50">
              — Patient at Bavishi Fertility Institute
            </div>
          </div>
        </Reveal>
      </section>

      {/* Who Should Use */}
      <section className="container-px mx-auto max-w-5xl py-6 md:py-10">
        <Reveal>
          <h2 className="text-center text-xl font-semibold text-[color:var(--plum)] md:text-2xl">Who Should Use This Calculator?</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[
              { emoji: "🌱", title: "First-time IVF patients", desc: "Get a personalised baseline before your first cycle to set realistic expectations." },
              { emoji: "🔄", title: "After previous IVF failure", desc: "Understand how your history and any new clinical factors affect your next cycle's odds." },
              { emoji: "📅", title: "Women over 35", desc: "See exactly how age impacts your probability and why acting sooner matters." },
              { emoji: "🥚", title: "Considering donor eggs", desc: "Compare your own-egg probability against the donor egg baseline for informed decision-making." },
              { emoji: "❓", title: "Unexplained infertility", desc: "Understand your profile when no clear cause has been identified yet." },
              { emoji: "💗", title: "PCOS or Endometriosis", desc: "See how your diagnosis specifically shifts your success rate and what can be optimised." },
            ].map((p) => (
              <div key={p.title} className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
                <span className="text-2xl">{p.emoji}</span>
                <div>
                  <h3 className="text-sm font-semibold text-[color:var(--plum)]">{p.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Explainer */}
      <section className="container-px mx-auto max-w-5xl py-8 md:py-12">
        <Reveal delay={0.05}>
          <div className="rounded-3xl border border-border/70 bg-[color:var(--rose-soft)]/25 p-7 md:p-10">
            <h2 className="text-xl font-semibold text-[color:var(--plum)] md:text-2xl">How This Calculator Works</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                { icon: TrendingUp, title: "Age-Based Baseline", desc: "Starts with your age group's published live-birth rate, adjusted for egg source." },
                { icon: Heart, title: "Clinical Modifiers", desc: "Diagnosis, embryo quality, transfer type, and treatment history all shift the baseline." },
                { icon: Sparkles, title: "Cumulative Estimate", desc: "Shows your 3-cycle cumulative probability using standard compounding statistics." },
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

      {/* CTA */}
      <section className="container-px mx-auto max-w-5xl py-8 md:py-12">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] gradient-dark noise px-7 py-12 text-white md:px-12 md:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_42%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Know Your Real Chances</p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight text-white">Get a specialist review of your IVF success estimate.</h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
                  Our fertility specialists review your full profile, including factors this calculator cannot assess, to give you a truly personalised plan.
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

      {/* About This Calculator */}
      <section className="container-px mx-auto max-w-5xl py-6 md:py-10">
        <Reveal>
          <div className="rounded-3xl border border-border/70 bg-card p-7 md:p-10">
            <h2 className="text-xl font-semibold text-[color:var(--plum)] md:text-2xl">About This Calculator</h2>
            <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
              <p>
                The IVF Success Rate Calculator is a clinically informed tool built on real-world IVF data and age-adjusted live-birth rates used by fertility specialists worldwide. Your personalised probability is calculated by adjusting your age-group baseline for five key clinical factors: your primary fertility diagnosis, embryo transfer type, number of previous IVF attempts, prior successful pregnancy history, and whether you are using your own eggs or donor eggs.
              </p>
              <p>
                A team of 500+ IVF success stories at Bavishi Fertility Institute demonstrates that our specialised approach consistently achieves success rates in the 60–70% range per cycle — significantly above the national average. Your individual result may vary based on factors not captured in this calculator, including AMH level, antral follicle count, uterine receptivity, sperm DNA fragmentation, and the specific IVF protocol used.
              </p>
              <p>
                This calculator is provided for planning and educational purposes only. It does not constitute medical advice and cannot replace a full fertility assessment by a specialist. Please do not make treatment decisions based solely on this result — book a consultation to receive a complete, personalised evaluation.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <CalculatorCrossLinks current="/ivf-success-rate-calculator" />
      <Locations />
      <Footer />
      <FloatingCTA />
      <ScrollToTop />
      <MobileBottomBar />
    </div>
  );
}
