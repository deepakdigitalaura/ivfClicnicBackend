"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, MessageCircle, Heart, Clock, Lock, Sparkles, RotateCcw, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer, Locations } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";

type Band = "low" | "moderate" | "high" | "very-high";

const BAND_META: Record<Band, { emoji: string; label: string; text: string; prognosis: string; color: string; bg: string }> = {
  low: {
    emoji: "💚", label: "Lower Risk Profile",
    text: "Your risk factors are fewer than average. With appropriate medical support and investigation, your outlook for a successful pregnancy is encouraging.",
    prognosis: "🌟 With proper care: approximately 65–75% chance of successful next pregnancy",
    color: "#5cb85c", bg: "bg-emerald-600",
  },
  moderate: {
    emoji: "🟡", label: "Moderate Risk Profile",
    text: "You have several identifiable risk factors. A full RPL investigation is strongly recommended — many of these factors are treatable.",
    prognosis: "📊 With specialist treatment: approximately 50–65% chance of successful next pregnancy",
    color: "#f0ad4e", bg: "bg-amber-500",
  },
  high: {
    emoji: "🔴", label: "Higher Risk Profile",
    text: "Your risk factors are significant and warrant specialist evaluation. Over 50% of cases at this level have treatable underlying causes — do not lose hope.",
    prognosis: "⚕️ With comprehensive treatment: approximately 40–55% chance of successful next pregnancy",
    color: "#ff9800", bg: "bg-orange-500",
  },
  "very-high": {
    emoji: "❗", label: "High Risk — Specialist Review Needed",
    text: "Your profile indicates multiple significant risk factors. We strongly recommend an urgent specialist consultation. Many couples with this profile achieve success with the right treatment.",
    prognosis: "💜 With expert multi-disciplinary care: meaningful chance of success — do not give up",
    color: "#e74c3c", bg: "bg-red-600",
  },
};

const NEXT_STEPS: Record<Band, { icon: string; title: string; text: string }[]> = {
  low: [
    { icon: "📋", title: "Full RPL Investigation", text: "Request a comprehensive panel including blood clotting tests, hormonal profile, and uterine scan even at lower risk." },
    { icon: "💊", title: "Progesterone Support", text: "Talk to your doctor about luteal phase support and early pregnancy progesterone therapy for your next pregnancy." },
    { icon: "🧬", title: "Consider PGT-A", text: "Pre-implantation genetic testing (if doing IVF) can screen embryos for chromosomal abnormalities." },
    { icon: "🥗", title: "Optimise Health", text: "Focus on folic acid (5mg), vitamin D, healthy weight, and stress management to improve your chances." },
  ],
  moderate: [
    { icon: "🔬", title: "Specialist Referral Now", text: "See a recurrent pregnancy loss specialist for a structured investigation including chromosomal, immunological and anatomical workup." },
    { icon: "🩸", title: "Thrombophilia Screen", text: "Get tested for antiphospholipid antibodies, anticardiolipin antibodies and lupus anticoagulant — highly treatable." },
    { icon: "🏥", title: "Uterine Assessment", text: "A hysteroscopy or 3D scan can identify and correct uterine abnormalities preventing successful implantation." },
    { icon: "🤝", title: "Supportive Care Programme", text: "Ask about our dedicated RPL clinic offering emotional support, close early monitoring, and a personalised management plan." },
  ],
  high: [
    { icon: "⚡", title: "Urgent Specialist Review", text: "Book an RPL specialist appointment promptly. A structured diagnostic protocol can identify treatable causes in over 50% of cases." },
    { icon: "🧬", title: "Genetic Testing", text: "Both partners should undergo karyotyping to check for chromosomal translocations — a key cause of higher-order pregnancy losses." },
    { icon: "🩺", title: "Immune Workup", text: "Comprehensive immune testing including NK cells, cytokine profiles, and HLA typing may reveal immunological causes." },
    { icon: "💉", title: "Treatment Options", text: "Depending on findings: anticoagulants, immunotherapy, progesterone, surgery, or IVF with PGT-A may significantly improve outcomes." },
  ],
  "very-high": [
    { icon: "🚨", title: "Immediate Specialist Care", text: "Please book an urgent consultation with an RPL specialist. Your risk profile warrants a thorough, fast-tracked investigation." },
    { icon: "🔬", title: "Comprehensive Genetic Testing", text: "Full karyotyping for both partners plus preconception genetic counselling to understand hereditary factors and IVF/PGT-A options." },
    { icon: "🏥", title: "Multi-Disciplinary Approach", text: "Your care should involve reproductive immunologists, haematologists, and fertility specialists working together on your case." },
    { icon: "💜", title: "Emotional Support", text: "Multiple losses take a significant emotional toll. Access our counselling services and patient support groups alongside medical treatment." },
  ],
};

type Result = { score: number; band: Band };

function calc(
  losses: string, age: string, livebirth: string,
  aps: string, uterine: string, thyroid: string, partnerAge: string,
): Result {
  let score = 0;
  if (losses === "2") score += 25;
  else if (losses === "3") score += 45;
  else if (losses === "4") score += 60;
  if (age === "30-34") score += 5;
  else if (age === "35-39") score += 15;
  else if (age === "40plus") score += 25;
  if (livebirth === "yes") score -= 15;
  if (aps === "yes") score += 20;
  if (uterine === "yes") score += 15;
  if (thyroid === "yes") score += 10;
  if (partnerAge === "40plus") score += 5;
  score = Math.max(0, Math.min(100, score));
  const band: Band = score <= 30 ? "low" : score <= 55 ? "moderate" : score <= 75 ? "high" : "very-high";
  return { score, band };
}

export function MiscarriageRiskCalculatorPage() {
  const [losses, setLosses] = useState("");
  const [age, setAge] = useState("");
  const [livebirth, setLivebirth] = useState("");
  const [aps, setAps] = useState("no");
  const [uterine, setUterine] = useState("no");
  const [thyroid, setThyroid] = useState("no");
  const [partnerAge, setPartnerAge] = useState("under40");
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const selectClass =
    "h-14 w-full rounded-2xl border-2 border-border bg-white px-5 text-[15px] font-semibold text-[color:var(--plum)] outline-none transition-colors focus:border-[color:var(--rose)] focus:ring-4 focus:ring-[color:var(--rose)]/10 appearance-none";

  const radioBtn = (name: string, value: string, label: string, current: string, setter: (v: string) => void) => (
    <label
      key={name + value}
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
    if (!losses || !age || !livebirth) { setError("Please answer all required questions (marked *)."); return; }
    setError("");
    setResult(calc(losses, age, livebirth, aps, uterine, thyroid, partnerAge));
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
          <span className="font-medium text-[color:var(--plum)]">Miscarriage Risk Calculator</span>
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
              <Sparkles className="h-3.5 w-3.5" /> Recurrent Pregnancy Loss · Risk Assessment
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-6 text-4xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-5xl text-balance">
              Risk of Repeat Miscarriage <em className="font-display italic text-[color:var(--rose)]">Calculator</em>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              Understand your risk profile for recurrent pregnancy loss and discover what investigations and treatments can help you achieve a successful pregnancy.
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
                  <h2 className="text-xl font-semibold text-[color:var(--plum)]">Pregnancy History</h2>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">Number of miscarriages <span className="text-[color:var(--rose)]">*</span></label>
                      <select value={losses} onChange={(e) => setLosses(e.target.value)} className={selectClass}>
                        <option value="">— Select number —</option>
                        <option value="2">2 miscarriages</option>
                        <option value="3">3 miscarriages</option>
                        <option value="4">4 or more miscarriages</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">Your age group <span className="text-[color:var(--rose)]">*</span></label>
                      <select value={age} onChange={(e) => setAge(e.target.value)} className={selectClass}>
                        <option value="">— Select age group —</option>
                        <option value="under30">Under 30</option>
                        <option value="30-34">30 – 34</option>
                        <option value="35-39">35 – 39</option>
                        <option value="40plus">40 or older</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">Previous successful pregnancy (live birth)? <span className="text-[color:var(--rose)]">*</span></label>
                    <div className="grid grid-cols-2 gap-3">
                      {[["yes","✅ Yes"],["no","❌ No"]].map(([v,l]) => radioBtn("livebirth",v,l,livebirth,setLivebirth))}
                    </div>
                  </div>

                  <hr className="my-7 border-border/60" />
                  <h2 className="text-xl font-semibold text-[color:var(--plum)]">Age Factors</h2>
                  <div className="mt-5">
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">Partner's age</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[["under40","Under 40"],["40plus","40 or older"],["na","Not applicable"]].map(([v,l]) => radioBtn("partnerAge",v,l,partnerAge,setPartnerAge))}
                    </div>
                  </div>

                  <hr className="my-7 border-border/60" />
                  <h2 className="text-xl font-semibold text-[color:var(--plum)]">Known Medical Conditions</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Leave as "No / Not tested" if you haven't been investigated yet.</p>

                  <div className="mt-5 space-y-5">
                    {[
                      { name: "aps", label: "Antiphospholipid syndrome or positive antiphospholipid antibodies?", current: aps, setter: setAps },
                      { name: "uterine", label: "Known uterine abnormality (septum, fibroids, polyps, adhesions)?", current: uterine, setter: setUterine },
                      { name: "thyroid", label: "Thyroid disorder (hypothyroidism, hyperthyroidism, thyroid antibodies)?", current: thyroid, setter: setThyroid },
                    ].map((q) => (
                      <div key={q.name}>
                        <label className="mb-3 block text-sm font-semibold text-[color:var(--plum)]">{q.label}</label>
                        <div className="grid grid-cols-2 gap-3">
                          {[["yes","Yes, diagnosed"],["no","No / Not tested"]].map(([v,l]) => radioBtn(q.name,v,l,q.current,q.setter))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {error && (
                    <p role="alert" className="mt-5 rounded-xl bg-[color:var(--rose)]/10 px-4 py-3 text-sm text-[color:var(--rose)]">{error}</p>
                  )}

                  <div className="mt-8 flex justify-end border-t border-border/60 pt-7">
                    <button type="button" onClick={handleCalc} className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-110">
                      Assess My Risk Profile <ArrowRight className="h-4 w-4" />
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

              {/* Score banner */}
              <div className={`rounded-[2rem] p-8 text-center text-white md:p-10 ${BAND_META[result.band].bg}`}>
                <div className="text-4xl">{BAND_META[result.band].emoji}</div>
                <div className="mt-3 text-2xl font-bold">{BAND_META[result.band].label}</div>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/85">{BAND_META[result.band].text}</p>
                <div className="mt-5 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold">{BAND_META[result.band].prognosis}</div>
              </div>

              {/* Risk bar */}
              <div className="mt-6 rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>Risk score</span><span>{result.score} / 100</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-[color:var(--ivory)]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: BAND_META[result.band].color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${result.score}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                  <span>0 – Low</span><span>30 – Moderate</span><span>55 – High</span><span>75 – Very High</span>
                </div>
              </div>

              {/* Next steps */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {NEXT_STEPS[result.band].map((c) => (
                  <div key={c.title} className="rounded-2xl border border-border/70 bg-[color:var(--ivory)] p-5 shadow-soft">
                    <div className="text-2xl">{c.icon}</div>
                    <h4 className="mt-3 font-semibold text-[color:var(--plum)]">{c.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                * This tool provides a risk profile based on published RPL research. It is not a diagnosis. Please consult a specialist for a full investigation.
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
                { icon: ShieldCheck, title: "Profile Your Risk", desc: "Understand your individual risk level based on history, age, and medical factors." },
                { icon: Sparkles, title: "Identify Causes", desc: "Learn which of your factors are treatable and which specialist investigations to pursue." },
                { icon: Heart, title: "Find Hope & a Path", desc: "Most RPL risk factors are treatable. Get a clear next-step action plan." },
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
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">You deserve answers.</p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight text-white">Speak to our recurrent pregnancy loss specialists.</h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
                  Our dedicated RPL team provides a thorough investigation, compassionate care, and a structured treatment plan to help you achieve a successful pregnancy.
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
