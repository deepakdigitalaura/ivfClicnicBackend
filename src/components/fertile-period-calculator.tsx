"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, MessageCircle, Heart, Clock, Lock, Sparkles, RotateCcw, Flower2 } from "lucide-react";
import { Reveal } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer, Locations } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function fmt(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}
function fmtShort(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

type Result = {
  ovulationDate: Date;
  fertileStart: Date;
  fertileEnd: Date;
  nextPeriod: Date;
  dayOfCycle: number;
  cyclePercent: number;
};

function calc(lmpStr: string, cycleLength: number): Result {
  const lmp = new Date(lmpStr);
  const offset = cycleLength >= 26 ? cycleLength - 14 : cycleLength - 13;
  const ovulationDate = addDays(lmp, offset - 1);
  const fertileStart = addDays(ovulationDate, -4);
  const fertileEnd = addDays(ovulationDate, 1);
  const nextPeriod = addDays(lmp, cycleLength);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfCycle = Math.max(0, Math.floor((today.getTime() - lmp.getTime()) / 86400000));
  const cyclePercent = Math.max(2, Math.min(98, Math.round((dayOfCycle / cycleLength) * 100)));
  return { ovulationDate, fertileStart, fertileEnd, nextPeriod, dayOfCycle, cyclePercent };
}

export function FertilePeriodCalculatorPage() {
  const [lmp, setLmp] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [duration, setDuration] = useState(5);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const inputClass =
    "h-14 w-full rounded-2xl border-2 border-border bg-white px-5 text-[15px] font-semibold text-[color:var(--plum)] outline-none transition-colors focus:border-[color:var(--rose)] focus:ring-4 focus:ring-[color:var(--rose)]/10";

  const handleCalc = () => {
    if (!lmp) { setError("Please enter the first day of your last period."); return; }
    setError("");
    setResult(calc(lmp, cycleLength));
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
          <span className="font-medium text-[color:var(--plum)]">Fertile Period Calculator</span>
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
              <Sparkles className="h-3.5 w-3.5" /> Cycle Tracking · Conception Planning
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-6 text-4xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-5xl text-balance">
              Fertile Period <em className="font-display italic text-[color:var(--rose)]">Calculator</em>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              Find your fertile window, peak ovulation day, and next period date — instantly, from your last period and cycle length.
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

      {/* Widget */}
      <section className="container-px mx-auto max-w-[760px] py-10 md:py-14">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <Reveal>
                <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-lift md:p-10">
                  <h2 className="text-xl font-semibold text-[color:var(--plum)]">Your Period Details</h2>

                  <div className="mt-6">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">
                      First day of your last period <span className="text-[color:var(--rose)]">*</span>
                    </label>
                    <input
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      value={lmp}
                      onChange={(e) => setLmp(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div className="mt-6">
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">
                      Period duration: <span className="text-[color:var(--rose)]">{duration} days</span>
                    </label>
                    <input
                      type="range" min={2} max={10} value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full accent-[color:var(--rose)]"
                    />
                    <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                      <span>2 days</span><span>10 days</span>
                    </div>
                  </div>

                  <hr className="my-7 border-border/60" />
                  <h2 className="text-xl font-semibold text-[color:var(--plum)]">Your Cycle</h2>

                  <div className="mt-6">
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">
                      Average cycle length: <span className="text-[color:var(--rose)]">{cycleLength} days</span>
                    </label>
                    <input
                      type="range" min={21} max={40} value={cycleLength}
                      onChange={(e) => setCycleLength(Number(e.target.value))}
                      className="w-full accent-[color:var(--rose)]"
                    />
                    <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                      <span>21 days</span><span>40 days</span>
                    </div>
                  </div>

                  {error && (
                    <p role="alert" className="mt-5 rounded-xl bg-[color:var(--rose)]/10 px-4 py-3 text-sm text-[color:var(--rose)]">{error}</p>
                  )}

                  <div className="mt-8 flex justify-end border-t border-border/60 pt-7">
                    <button type="button" onClick={handleCalc} className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-110">
                      Calculate My Fertile Window <ArrowRight className="h-4 w-4" />
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

              {/* Key dates */}
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { icon: "🌸", label: "Fertile Window", value: `${fmtShort(result.fertileStart)} – ${fmtShort(result.fertileEnd)}`, sub: "Best days to try", color: "bg-rose-50 border-rose-200" },
                  { icon: "⭐", label: "Peak Ovulation", value: fmt(result.ovulationDate), sub: "Highest fertility day", color: "bg-amber-50 border-amber-200" },
                  { icon: "📅", label: "Next Period", value: fmt(result.nextPeriod), sub: "Expected start date", color: "bg-blue-50 border-blue-200" },
                ].map((c) => (
                  <div key={c.label} className={`rounded-2xl border p-5 text-center shadow-soft ${c.color}`}>
                    <div className="text-2xl">{c.icon}</div>
                    <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.label}</div>
                    <div className="mt-2 text-base font-bold text-[color:var(--plum)]">{c.value}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{c.sub}</div>
                  </div>
                ))}
              </div>

              {/* Fertility bar */}
              <div className="mt-6 rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
                <div className="text-sm font-semibold text-[color:var(--plum)]">Fertility Level Throughout Your Cycle</div>
                <div className="mt-4 h-4 overflow-hidden rounded-full bg-[color:var(--ivory)]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-blue-300 via-[color:var(--rose)] to-blue-300"
                    initial={{ width: 0 }}
                    animate={{ width: `${result.cyclePercent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>Period</span><span>Low</span><span>Rising</span><span>🌸 Peak fertile</span><span>Low</span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  You are approximately on day <strong>{result.dayOfCycle}</strong> of your cycle.
                </p>
              </div>

              {/* Tips */}
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { icon: "💑", title: "Time Intercourse Right", text: "Have intercourse every 1–2 days during your fertile window, especially the 2 days before ovulation." },
                  { icon: "💧", title: "Watch Cervical Mucus", text: "Egg-white consistency mucus — clear & stretchable — appears just before ovulation." },
                  { icon: "💊", title: "Take Folic Acid", text: "Start 400mcg folic acid daily while trying to conceive to reduce neural tube defect risk." },
                ].map((t) => (
                  <div key={t.title} className="rounded-2xl border border-border/70 bg-[color:var(--ivory)] p-5 shadow-soft">
                    <div className="text-2xl">{t.icon}</div>
                    <h4 className="mt-3 font-semibold text-[color:var(--plum)]">{t.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                * Results are estimates based on a regular cycle. Cycles vary — consult your doctor for personal advice.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Explainer */}
      <section className="container-px mx-auto max-w-5xl py-8 md:py-12">
        <Reveal delay={0.05}>
          <div className="rounded-3xl border border-border/70 bg-[color:var(--rose-soft)]/25 p-7 md:p-10">
            <h2 className="text-xl font-semibold text-[color:var(--plum)] md:text-2xl">What this calculator helps you do</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                { icon: Flower2, title: "Find Your Fertile Window", desc: "Discover the exact days each cycle when conception is most likely." },
                { icon: Calendar, title: "Track Peak Ovulation", desc: "Know your single highest-fertility day to time intercourse correctly." },
                { icon: Sparkles, title: "Plan with Confidence", desc: "Use your fertile window and next period date to plan cycles ahead." },
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
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Need expert guidance?</p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight text-white">Get specialist support for cycle tracking and conception.</h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
                  Book a consultation with our fertility team to validate your cycle tracking and receive a personalised conception plan.
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
