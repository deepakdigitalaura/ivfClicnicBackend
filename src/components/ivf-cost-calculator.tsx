"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, MessageCircle, Heart, Clock, Lock, Sparkles, RotateCcw, IndianRupee } from "lucide-react";
import { Reveal } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer, Locations } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";

/* ── cost data (ported from live ivfclinic.com inline JS) ── */
const BASE_COSTS: Record<string, { base: [number, number]; label: string }> = {
  standard: { base: [120000, 160000], label: "Standard IVF (Base)" },
  icsi:     { base: [140000, 190000], label: "IVF + ICSI (Base)" },
  fet:      { base: [45000,  90000],  label: "Frozen Embryo Transfer (Base)" },
  donor:    { base: [200000, 280000], label: "Donor Egg IVF (Base)" },
};

const ADD_ONS: Record<string, { range: [number, number]; label: string }> = {
  pgt:         { range: [60000, 120000], label: "PGT-A Genetic Testing" },
  freeze:      { range: [10000, 30000],  label: "Embryo Freezing & Storage" },
  sperm:       { range: [3000,  10000],  label: "Sperm Freezing" },
  era:         { range: [45000, 75000],  label: "ERA / Endometrial Testing" },
  laser:       { range: [10000, 18000],  label: "Laser Assisted Hatching" },
  counselling: { range: [5000,  10000],  label: "Counselling Support" },
};

function fmt(n: number) {
  return "₹" + Math.round(n / 1000) + "K";
}

type BreakdownRow = { label: string; lo: number; hi: number };
type Result = {
  perCycleLo: number; perCycleHi: number;
  totalLo: number; totalHi: number;
  cycles: number;
  rows: BreakdownRow[];
};

function calc(type: string, cycles: number, addOns: string[]): Result {
  const base = BASE_COSTS[type];
  let lo = base.base[0], hi = base.base[1];
  const rows: BreakdownRow[] = [{ label: base.label, lo: base.base[0], hi: base.base[1] }];
  for (const key of addOns) {
    const a = ADD_ONS[key];
    lo += a.range[0]; hi += a.range[1];
    rows.push({ label: a.label, lo: a.range[0], hi: a.range[1] });
  }
  rows.push({ label: "Total per cycle", lo, hi });
  return { perCycleLo: lo, perCycleHi: hi, totalLo: lo * cycles, totalHi: hi * cycles, cycles, rows };
}

export function IvfCostCalculatorPage() {
  const [type, setType] = useState("icsi");
  const [cycles, setCycles] = useState(1);
  const [addOns, setAddOns] = useState<string[]>([]);
  const [result, setResult] = useState<Result | null>(null);

  const toggleAddOn = (key: string) => {
    setAddOns((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
  };

  const selectClass =
    "h-14 w-full rounded-2xl border-2 border-border bg-white px-5 text-[15px] font-semibold text-[color:var(--plum)] outline-none transition-colors focus:border-[color:var(--rose)] focus:ring-4 focus:ring-[color:var(--rose)]/10 appearance-none";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
          <span>/</span>
          <a href="/#tools" className="hover:text-[color:var(--rose)]">Calculators</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)]">IVF Cost Calculator</span>
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
              <Sparkles className="h-3.5 w-3.5" /> Treatment Planning · Cost Estimation
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-6 text-4xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-5xl text-balance">
              IVF Cost <em className="font-display italic text-[color:var(--rose)]">Calculator</em>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              Estimate your IVF treatment investment — including cycle type, number of cycles, and selected add-ons — to plan your fertility journey with confidence.
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
                  <h2 className="text-xl font-semibold text-[color:var(--plum)]">Treatment Type</h2>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">Type of IVF cycle</label>
                      <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
                        <option value="standard">Standard IVF</option>
                        <option value="icsi">IVF with ICSI</option>
                        <option value="fet">Frozen Embryo Transfer (FET)</option>
                        <option value="donor">Donor Egg IVF</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">Number of cycles</label>
                      <select value={cycles} onChange={(e) => setCycles(Number(e.target.value))} className={selectClass}>
                        <option value={1}>1 cycle</option>
                        <option value={2}>2 cycles</option>
                        <option value={3}>3 cycles</option>
                        <option value={4}>4+ cycles (budget planning)</option>
                      </select>
                    </div>
                  </div>

                  <hr className="my-7 border-border/60" />
                  <h2 className="text-xl font-semibold text-[color:var(--plum)]">Add-Ons <span className="text-sm font-normal text-muted-foreground">(select all that apply)</span></h2>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {Object.entries(ADD_ONS).map(([key, info]) => (
                      <label
                        key={key}
                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
                          addOns.includes(key)
                            ? "border-[color:var(--rose)] bg-[color:var(--rose-soft)]/30 text-[color:var(--plum)]"
                            : "border-border bg-white text-[color:var(--plum)]/70 hover:border-[color:var(--rose)]/40"
                        }`}
                      >
                        <input type="checkbox" checked={addOns.includes(key)} onChange={() => toggleAddOn(key)} className="sr-only" />
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 text-xs font-black text-white ${addOns.includes(key) ? "border-[color:var(--rose)] bg-[color:var(--rose)]" : "border-border"}`}>
                          {addOns.includes(key) && "✓"}
                        </span>
                        <div>
                          <div>{info.label}</div>
                          <div className="text-xs font-normal text-muted-foreground">{fmt(info.range[0])} – {fmt(info.range[1])}</div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="mt-8 flex justify-end border-t border-border/60 pt-7">
                    <button type="button" onClick={() => setResult(calc(type, cycles, addOns))} className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-110">
                      Calculate My IVF Cost <ArrowRight className="h-4 w-4" />
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

              {/* Total banner */}
              <div className="rounded-[2rem] bg-gradient-to-br from-[color:var(--plum)] to-[color:var(--plum)]/80 p-8 text-center text-white md:p-10">
                <div className="text-xs font-bold uppercase tracking-[0.15em] text-white/70">Estimated Total Investment</div>
                <div className="mt-4 text-5xl font-black">{fmt(result.totalLo)} – {fmt(result.totalHi)}</div>
                <div className="mt-3 text-sm text-white/75">
                  For {result.cycles} cycle{result.cycles > 1 ? "s" : ""} including selected add-ons
                </div>
              </div>

              {/* Breakdown */}
              <div className="mt-6 rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
                <h3 className="font-semibold text-[color:var(--plum)]">💊 Cost Breakdown (per cycle)</h3>
                <div className="mt-4 space-y-2">
                  {result.rows.map((row, i) => (
                    <div
                      key={row.label}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm ${
                        i === result.rows.length - 1
                          ? "bg-[color:var(--rose-soft)]/30 font-bold text-[color:var(--plum)]"
                          : "bg-[color:var(--ivory)] text-[color:var(--plum)]/80"
                      }`}
                    >
                      <span>{row.label}</span>
                      <span>{fmt(row.lo)} – {fmt(row.hi)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next steps */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: "📞", title: "Get an Exact Quote", text: "Book a consultation at BFI for a precise, personalised cost plan based on your specific diagnosis." },
                  { icon: "🏦", title: "Explore EMI Options", text: "Ask about BFI's flexible payment plans and medical finance options to spread your treatment costs." },
                  { icon: "📋", title: "Review What's Included", text: "Always ask for a full itemised quote — medications, scans, blood tests, and lab fees can add significantly." },
                  { icon: "💡", title: "Consider a Package Deal", text: "Multi-cycle packages often offer better value. Ask BFI about bundled pricing for 2–3 cycle commitments." },
                ].map((c) => (
                  <div key={c.title} className="rounded-2xl border border-border/70 bg-[color:var(--ivory)] p-5 shadow-soft">
                    <div className="text-2xl">{c.icon}</div>
                    <h4 className="mt-3 font-semibold text-[color:var(--plum)]">{c.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                * Cost estimates are indicative ranges for planning purposes only. Actual costs depend on your individual protocol, medications, and clinic. Request a full itemised quote at your consultation.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className="container-px mx-auto max-w-5xl py-8 md:py-12">
        <Reveal delay={0.05}>
          <div className="rounded-3xl border border-border/70 bg-[color:var(--rose-soft)]/25 p-7 md:p-10">
            <h2 className="text-xl font-semibold text-[color:var(--plum)] md:text-2xl">What this calculator helps you do</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                { icon: IndianRupee, title: "Budget Your Treatment", desc: "Get indicative cost ranges for different IVF cycle types and add-on procedures." },
                { icon: Sparkles, title: "Compare Options", desc: "See how cycle type and add-ons affect your total investment before booking." },
                { icon: Heart, title: "Plan Financially", desc: "Use the estimates to explore EMI, insurance, and multi-cycle package options." },
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
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Ready for a personalised quote?</p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight text-white">Get an exact cost plan for your IVF treatment at BFI.</h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
                  Our team will provide a full itemised quote, discuss flexible payment options, and help you plan the most cost-effective path to your goal.
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
