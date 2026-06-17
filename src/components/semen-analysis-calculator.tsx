"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, MessageCircle, Heart, Clock, Lock, Sparkles, RotateCcw, Microscope } from "lucide-react";
import { Reveal } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer, Locations } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";

/* ── WHO 2021 reference values ── */
const WHO_REF = {
  volume:  { min: 1.4, label: "Volume",        unit: "mL",    who: "≥ 1.4 mL",    flag: "Hypospermia" },
  conc:    { min: 16,  label: "Concentration", unit: "M/mL",  who: "≥ 16 M/mL",   flag: "Oligozoospermia" },
  tmot:    { min: 42,  label: "Total Motility", unit: "%",    who: "≥ 42%",        flag: "Asthenozoospermia" },
  pr:      { min: 30,  label: "Progressive",   unit: "%",     who: "≥ 30%",        flag: "" },
  morph:   { min: 4,   label: "Morphology",    unit: "%",     who: "≥ 4%",         flag: "Teratozoospermia" },
  wbc:     { max: 1,   label: "WBC",           unit: "M/mL",  who: "< 1 M/mL",     flag: "Leukocytospermia" },
};

type ParamKey = "volume" | "conc" | "wbc" | "tmot" | "pr" | "morph";
type Band = "normal" | "mild" | "mod" | "severe";

const BAND_META: Record<Band, { label: string; color: string; bgClass: string }> = {
  normal: { label: "✅ Normal — All Parameters in Range", color: "#5cb85c", bgClass: "bg-emerald-600" },
  mild:   { label: "⚠ Mild Abnormality",                  color: "#f0ad4e", bgClass: "bg-amber-500" },
  mod:    { label: "⚠ Moderate Abnormalities",            color: "#ff9800", bgClass: "bg-orange-500" },
  severe: { label: "❌ Severe Abnormalities",              color: "#e74c3c", bgClass: "bg-red-600" },
};

const NEXT_STEPS: Record<Band, { icon: string; title: string; text: string }[]> = {
  normal: [
    { icon: "✅", title: "Results Look Healthy", text: "All parameters are within WHO reference ranges. A fertility specialist can confirm your full reproductive health." },
    { icon: "📋", title: "Annual Check-Up", text: "Consider annual semen analysis if actively trying to conceive, to catch any changes early." },
    { icon: "🥗", title: "Support Sperm Health", text: "Maintain healthy diet, avoid heat exposure to testes, manage stress, and avoid smoking or excessive alcohol." },
    { icon: "💬", title: "Plan Your Next Steps", text: "Consult a fertility specialist to integrate semen health into your complete couple fertility assessment." },
  ],
  mild: [
    { icon: "🩺", title: "Mild Issue — Treatable", text: "Mild sperm abnormalities are often reversible. See a urologist or andrologist for evaluation." },
    { icon: "🥗", title: "Lifestyle Optimisation", text: "Diet, antioxidants (zinc, CoQ10, vitamin C), exercise, and avoiding heat can improve sperm parameters in 3 months." },
    { icon: "🔬", title: "Repeat in 3 Months", text: "Sperm takes ~90 days to mature. Lifestyle changes can be assessed by repeating the analysis after 3 months." },
    { icon: "💬", title: "Fertility Consultation", text: "A specialist can guide treatment and advise whether IUI or other assisted conception is appropriate." },
  ],
  mod: [
    { icon: "⚕️", title: "Specialist Referral", text: "Multiple abnormalities warrant a full andrological evaluation to identify and treat the underlying cause." },
    { icon: "🔬", title: "Advanced Testing", text: "Sperm DNA fragmentation, DNA integrity, and hormonal tests (FSH, LH, testosterone) can reveal the root cause." },
    { icon: "💊", title: "Medical Treatment", text: "Depending on findings: hormonal therapy, antioxidants, varicocele repair, or assisted techniques may be recommended." },
    { icon: "🧬", title: "IVF/ICSI Planning", text: "With your profile, ICSI (injecting a single sperm into the egg) can achieve high fertilisation rates in IVF." },
  ],
  severe: [
    { icon: "🚨", title: "Urgent Andrological Review", text: "Severe abnormalities require prompt specialist evaluation. Several causes are treatable with the right diagnosis." },
    { icon: "🧬", title: "Genetic Testing", text: "Karyotyping and Y-chromosome microdeletion testing can identify hereditary causes affecting sperm production." },
    { icon: "🏥", title: "Surgical Sperm Retrieval", text: "Even with zero sperm in ejaculate, sperm may be retrieved surgically (PESA/TESA/Micro-TESE) for use in ICSI." },
    { icon: "💬", title: "Fertility Team Consultation", text: "A combined fertility specialist and andrologist assessment will explore all available options for you to father a child." },
  ],
};

type FieldState = Record<ParamKey, string>;

type ResultParam = { name: string; val: number; unit: string; who: string; ok: boolean | null };
type Result = {
  band: Band;
  params: ResultParam[];
  conditions: string[];
  totalCount: number | null;
  tmsc: number | null;
};

function runCalc(fields: FieldState): Result {
  const v = (k: ParamKey) => { const n = parseFloat(fields[k]); return isNaN(n) ? null : n; };
  const volume = v("volume");
  const conc   = v("conc");
  const wbc    = v("wbc");
  const tmot   = v("tmot");
  const pr     = v("pr");
  const morph  = v("morph");

  const totalCount = conc !== null && volume !== null ? parseFloat((conc * volume).toFixed(1)) : null;
  const tmsc = conc !== null && volume !== null && pr !== null ? conc * volume * pr / 100 : null;

  const conditions: string[] = [];
  if (volume !== null && volume < 1.4) conditions.push("Hypospermia");
  if (totalCount !== null && totalCount < 39) conditions.push("Oligozoospermia");
  if (tmot !== null && tmot < 42) conditions.push("Asthenozoospermia");
  if (morph !== null && morph < 4) conditions.push("Teratozoospermia");
  if (wbc !== null && wbc >= 1) conditions.push("Leukocytospermia");

  const hasOAT = ["Oligozoospermia","Asthenozoospermia","Teratozoospermia"].every((c) => conditions.includes(c));
  if (hasOAT) conditions.unshift("OAT Syndrome");

  const band: Band = conditions.length === 0 ? "normal" : conditions.length === 1 ? "mild" : conditions.length <= 3 ? "mod" : "severe";

  const params: ResultParam[] = [
    ...(volume !== null ? [{ name: "Volume", val: volume, unit: "mL", who: "≥ 1.4", ok: volume >= 1.4 }] : []),
    ...(conc !== null ? [{ name: "Concentration", val: conc, unit: "M/mL", who: "≥ 16", ok: conc >= 16 }] : []),
    ...(totalCount !== null ? [{ name: "Total Count", val: totalCount, unit: "M", who: "≥ 39", ok: totalCount >= 39 }] : []),
    ...(tmot !== null ? [{ name: "Total Motility", val: tmot, unit: "%", who: "≥ 42%", ok: tmot >= 42 }] : []),
    ...(pr !== null ? [{ name: "Progressive Motility", val: pr, unit: "%", who: "≥ 30%", ok: pr >= 30 }] : []),
    ...(morph !== null ? [{ name: "Morphology", val: morph, unit: "%", who: "≥ 4%", ok: morph >= 4 }] : []),
    ...(wbc !== null ? [{ name: "WBC", val: wbc, unit: "M/mL", who: "< 1", ok: wbc < 1 }] : []),
    ...(tmsc !== null ? [{ name: "TMSC", val: parseFloat(tmsc.toFixed(1)), unit: "M", who: "≥ 9 (IUI)", ok: tmsc >= 9 }] : []),
  ];

  return { band, params, conditions, totalCount, tmsc };
}

export function SemenAnalysisCalculatorPage() {
  const emptyFields = (): FieldState => ({ volume: "", conc: "", wbc: "", tmot: "", pr: "", morph: "" });
  const [fields, setFields] = useState<FieldState>(emptyFields());
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const set = (k: ParamKey) => (e: React.ChangeEvent<HTMLInputElement>) => setFields((f) => ({ ...f, [k]: e.target.value }));

  const inputClass =
    "h-14 w-full rounded-2xl border-2 border-border bg-white px-4 text-[15px] font-semibold text-[color:var(--plum)] outline-none transition-colors focus:border-[color:var(--rose)] focus:ring-4 focus:ring-[color:var(--rose)]/10";

  const handleCalc = () => {
    const hasAny = Object.values(fields).some((v) => v !== "");
    if (!hasAny) { setError("Please enter at least one parameter value."); return; }
    setError("");
    setResult(runCalc(fields));
  };

  const FIELD_DEFS: { key: ParamKey; label: string; unit: string; placeholder: string; who: string }[] = [
    { key: "volume", label: "Volume",              unit: "mL",    placeholder: "e.g. 3.5",  who: "≥ 1.4 mL" },
    { key: "conc",   label: "Sperm Concentration", unit: "M/mL",  placeholder: "e.g. 20",   who: "≥ 16 M/mL" },
    { key: "wbc",    label: "WBC / Leucocytes",    unit: "M/mL",  placeholder: "e.g. 0.5",  who: "< 1 M/mL" },
    { key: "tmot",   label: "Total Motility",      unit: "%",     placeholder: "e.g. 45",   who: "≥ 42%" },
    { key: "pr",     label: "Progressive Motility",unit: "%",     placeholder: "e.g. 35",   who: "≥ 30%" },
    { key: "morph",  label: "Morphology (Kruger)", unit: "%",     placeholder: "e.g. 5",    who: "≥ 4%" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
          <span>/</span>
          <a href="/#tools" className="hover:text-[color:var(--rose)]">Calculators</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)]">Sperm Analysis Calculator</span>
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
              <Sparkles className="h-3.5 w-3.5" /> Male Fertility · WHO 2021 Reference Values
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-6 text-4xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-5xl text-balance">
              Sperm Analysis <em className="font-display italic text-[color:var(--rose)]">Calculator</em>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              Enter your semen analysis report values and get an instant interpretation against WHO 2021 reference ranges, with derived metrics and personalised next steps.
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
                  <h2 className="text-xl font-semibold text-[color:var(--plum)]">Enter Your Semen Analysis Values</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Enter the values from your report. You may leave any field blank if not available.</p>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    {FIELD_DEFS.map(({ key, label, unit, placeholder, who }) => (
                      <div key={key}>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">{label}</label>
                        <div className="relative">
                          <input
                            type="number"
                            min={0}
                            step={0.1}
                            placeholder={placeholder}
                            value={fields[key]}
                            onChange={set(key)}
                            className={inputClass + " pr-16"}
                          />
                          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">{unit}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">WHO ref: {who}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-xl bg-[color:var(--ivory)] px-4 py-3 text-xs text-muted-foreground">
                    💡 <strong>Total Count</strong> and <strong>TMSC</strong> are calculated automatically from Volume × Concentration.
                  </div>

                  {error && (
                    <p role="alert" className="mt-5 rounded-xl bg-[color:var(--rose)]/10 px-4 py-3 text-sm text-[color:var(--rose)]">{error}</p>
                  )}

                  <div className="mt-8 flex justify-end border-t border-border/60 pt-7">
                    <button type="button" onClick={handleCalc} className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-110">
                      Analyse My Results <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Reveal>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <button type="button" onClick={() => setResult(null)} className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-border px-5 py-2.5 text-xs font-semibold text-muted-foreground transition hover:border-[color:var(--rose)] hover:text-[color:var(--rose)]">
                <RotateCcw className="h-3.5 w-3.5" /> Re-analyse
              </button>

              {/* Overall banner */}
              <div className={`rounded-[2rem] p-7 text-center text-white ${BAND_META[result.band].bgClass}`}>
                <div className="text-lg font-bold">{BAND_META[result.band].label}</div>
                {result.conditions.length > 0 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {result.conditions.map((c) => (
                      <span key={c} className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">{c}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Parameter grid */}
              <div className="mt-6 rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
                <h3 className="font-semibold text-[color:var(--plum)]">Parameter Analysis (WHO 2021)</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {result.params.map((p) => (
                    <div
                      key={p.name}
                      className={`rounded-xl border-2 p-4 ${p.ok === true ? "border-emerald-200 bg-emerald-50" : p.ok === false ? "border-red-200 bg-red-50" : "border-border bg-[color:var(--ivory)]"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{p.name}</span>
                        {p.ok !== null && (
                          <span className={`text-xs font-semibold ${p.ok ? "text-emerald-700" : "text-red-700"}`}>
                            {p.ok ? "✓ Normal" : "✗ Below ref"}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-2xl font-black text-[color:var(--plum)]">{p.val} <span className="text-sm font-normal text-muted-foreground">{p.unit}</span></div>
                      <div className="mt-0.5 text-xs text-muted-foreground">Reference: {p.who}</div>
                    </div>
                  ))}
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
                * This calculator uses WHO 2021 reference values. Interpretation should be combined with clinical examination and full reproductive history. Consult an andrologist or fertility specialist.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className="container-px mx-auto max-w-5xl py-8 md:py-12">
        <Reveal delay={0.05}>
          <div className="rounded-3xl border border-border/70 bg-[color:var(--rose-soft)]/25 p-7 md:p-10">
            <h2 className="text-xl font-semibold text-[color:var(--plum)] md:text-2xl">What this calculator analyses</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                { icon: Microscope, title: "WHO 2021 Standards", desc: "Compares each parameter against the latest WHO reference values for fertile men." },
                { icon: Sparkles, title: "Derived Metrics", desc: "Automatically calculates Total Count and TMSC (Total Motile Sperm Count) from your values." },
                { icon: Heart, title: "Clinical Conditions", desc: "Identifies standard andrological conditions (Oligozoospermia, Asthenozoospermia etc.) from your results." },
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
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Get expert support</p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight text-white">Speak to our male fertility specialists about your results.</h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
                  Our andrologists and fertility team can review your full semen analysis, investigate the cause, and recommend the most effective treatment pathway.
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
