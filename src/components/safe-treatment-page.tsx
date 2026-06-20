"use client";
import {
  ArrowRight, Calendar, MessageCircle, Shield, ShieldCheck,
  Microscope, HeartPulse, Wind, Baby, Lock, Syringe,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, Stagger, StaggerItem, Magnetic, Float, Counter } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/home-page";
import { SectionHead, Eyebrow } from "@/components/ivf-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";

/* ---------- Data ---------- */

const SAFETY_FEATURES = [
  {
    icon: ShieldCheck,
    title: "Genetic Safety",
    description:
      "Strict sample tracking using IVF-grade labels with a rigorous \"double-witness\" protocol — two professionals oversee every critical procedure including sperm freezing, sperm capacitation, oocyte recovery, insemination, micro-injection, embryo transfer, and cryopreservation.",
  },
  {
    icon: Syringe,
    title: "Infection Prevention",
    description:
      "Mandatory infection testing for every patient before treatment begins. Potentially infected samples are stored in separate, dedicated containers to eliminate any risk of cross-contamination.",
  },
  {
    icon: HeartPulse,
    title: "OHSS-Free Clinic",
    description:
      "Bavishi Fertility Institute is an OHSS-free clinic. Our signature prevention protocols have ensured zero severe OHSS cases in over a decade — a record we are deeply proud of.",
  },
  {
    icon: Wind,
    title: "Class 1000 IVF Labs",
    description:
      "Our labs maintain air quality ten times cleaner than European standards. HEPA-filtered laminar flow hoods, AI-integrated trigas incubators with smart alarm systems, and continuous temperature monitoring at 37°C.",
  },
  {
    icon: Baby,
    title: "Single Embryo Transfer (eSET)",
    description:
      "We follow the elective Single Embryo Transfer protocol to maximise healthy outcomes and prevent higher-order multiple pregnancies — prioritising the safety of both mother and child.",
  },
  {
    icon: Microscope,
    title: "Pandemic Safety",
    description:
      "Full PPE protocols, vaccinated staff, and comprehensive safety measures ensure your treatment environment remains safe and sterile — even during pandemic conditions.",
  },
  {
    icon: Lock,
    title: "Patient Confidentiality",
    description:
      "Your medical records, treatment details, and personal information are fully protected with strict confidentiality protocols. Your privacy is non-negotiable.",
  },
];

const STATS = [
  { value: 10, suffix: "+ Years", label: "OHSS Free", sub: "zero severe cases in over a decade" },
  { value: 1000, suffix: "", label: "Class 1000 Labs", sub: "ten times cleaner than EU standards" },
  { value: 2, suffix: "x", label: "Double-Witness", sub: "two professionals at every step" },
];

const PROTOCOLS = [
  "IVF-grade sample labelling and tracking",
  "Double-witness protocol for all critical procedures",
  "Mandatory pre-treatment infection screening",
  "Separate storage for potentially infected samples",
  "HEPA-filtered Class 1000 air quality in all labs",
  "AI-integrated trigas incubators with smart alarms",
  "Continuous 37°C temperature monitoring",
  "Regular equipment maintenance and calibration",
  "Bacterial contamination monitoring",
  "Elective single embryo transfer (eSET) protocol",
  "Full PPE and vaccinated staff protocols",
  "Strict patient data confidentiality measures",
];

/* ---------- Page ---------- */

export function SafeTreatmentPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav
          className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)]">Safe Treatment</span>
        </nav>
      </div>

      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden gradient-warm noise">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 left-1/4 h-[32rem] w-[32rem] rounded-full bg-[color:var(--rose)]/20 blur-3xl"
            animate={{ x: [0, 60, 0], y: [0, 30, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-20 right-0 h-[28rem] w-[28rem] rounded-full bg-[color:var(--plum)]/15 blur-3xl"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="container-px relative mx-auto max-w-[1400px] py-20 text-center lg:py-28">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--plum)]/15 bg-white/60 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--plum)]">
              <Shield className="h-3.5 w-3.5 text-[color:var(--rose)]" /> Safety First, Safety for All
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-medium leading-[1.05] text-[color:var(--plum)] md:text-5xl lg:text-[3.5rem] text-balance">
              Absolute safety for your{" "}
              <em className="font-display italic text-[color:var(--rose)]">
                fertility treatment.
              </em>
            </h1>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[color:var(--plum)]/70 text-pretty">
              At Bavishi Fertility Institute, safety isn&#39;t a feature — it&#39;s the foundation of everything we do.
              From OHSS-free protocols to Class 1000 labs, every detail is engineered to protect you and your future child.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="mx-auto mt-8 flex max-w-md items-center gap-4 rounded-2xl border border-[color:var(--plum)]/10 bg-white/60 px-6 py-5 backdrop-blur">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[color:var(--rose-soft)]/50">
                <Shield className="h-7 w-7 text-[color:var(--rose)]" />
              </div>
              <div className="text-left">
                <div className="text-xl font-semibold text-[color:var(--plum)]">Our Motto</div>
                <div className="text-sm text-[color:var(--plum)]/60">
                  &ldquo;Safety First, Safety for All&rdquo; — the principle behind every procedure
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.35}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Magnetic
                as="a"
                href="/#book"
                className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-4 text-sm font-semibold text-white shadow-glow"
              >
                <Calendar className="h-4 w-4" /> Book Free Consultation{" "}
                <ArrowRight className="h-4 w-4" />
              </Magnetic>
              <Magnetic
                as="a"
                href="https://wa.me/919712622288"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-luxury inline-flex items-center gap-2 rounded-full border border-[color:var(--plum)]/15 bg-white/70 px-7 py-4 text-sm font-semibold text-[color:var(--plum)]"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==================== SAFETY FEATURES GRID ==================== */}
      <section className="py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Our Safety Standards"
            title={
              <>
                Eight pillars of{" "}
                <em className="font-display italic text-[color:var(--rose)]">
                  uncompromising safety.
                </em>
              </>
            }
            subtitle="Every element of your treatment at Bavishi Fertility Institute is governed by world-class safety protocols — because your well-being comes before everything else."
          />
          <Stagger className="mx-auto mt-12 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SAFETY_FEATURES.map((f, i) => (
              <StaggerItem key={i}>
                <div className="group h-full rounded-2xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-[color:var(--rose-soft)]/50 text-[color:var(--rose)] transition-colors group-hover:bg-[color:var(--rose)] group-hover:text-white">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[color:var(--plum)]">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                    {f.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ==================== OHSS-FREE HIGHLIGHT ==================== */}
      <section className="bg-[color:var(--ivory)] py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <Reveal>
                <Eyebrow>OHSS-Free Clinic</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 text-3xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-4xl text-balance">
                  Zero severe OHSS cases in{" "}
                  <em className="font-display italic text-[color:var(--rose)]">
                    over a decade.
                  </em>
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-muted-foreground">
                  <p>
                    Ovarian Hyperstimulation Syndrome (OHSS) is one of the most serious risks in IVF treatment.
                    At Bavishi Fertility Institute, we have developed and refined signature prevention protocols
                    that have completely eliminated severe OHSS from our practice.
                  </p>
                  <p>
                    <strong className="text-[color:var(--plum)]">
                      Bavishi Fertility Institute is an OHSS-free clinic.
                    </strong>{" "}
                    This isn&#39;t just a claim — it&#39;s a track record backed by over a decade of safe treatments
                    and thousands of successful cycles.
                  </p>
                  <p>
                    Our stimulation protocols are carefully tailored to each patient, using the latest
                    trigger strategies and monitoring techniques to ensure your ovaries respond safely
                    and your health is never compromised.
                  </p>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.15}>
              <Float amplitude={6}>
                <div className="relative overflow-hidden rounded-[2rem] border border-border/40 bg-card p-8 shadow-lift">
                  <div className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-[color:var(--rose-soft)]/50">
                    <HeartPulse className="h-8 w-8 text-[color:var(--rose)]" />
                  </div>
                  <h3 className="text-2xl font-semibold text-[color:var(--plum)]">
                    Our OHSS Prevention Record
                  </h3>
                  <ul className="mt-5 space-y-3">
                    {[
                      "Customised stimulation protocols for every patient",
                      "Advanced trigger strategies to prevent hyperstimulation",
                      "Continuous hormonal and ultrasound monitoring",
                      "Zero severe OHSS cases in 10+ years",
                      "Thousands of safe, successful cycles completed",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-[15px] text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--rose)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Float>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ==================== STATS ==================== */}
      <section className="relative overflow-hidden bg-[color:var(--plum)] text-white noise py-16 lg:py-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-[color:var(--rose)]/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[color:var(--gold)]/15 blur-3xl" />
        </div>
        <div className="container-px relative mx-auto max-w-[1400px]">
          <Stagger className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <StaggerItem key={i}>
                <div className="text-center">
                  <div className="text-4xl font-semibold md:text-5xl">
                    <Counter to={s.value} />
                    {s.suffix}
                  </div>
                  <div className="mt-2 text-sm font-medium uppercase tracking-wider text-white/80">
                    {s.label}
                  </div>
                  <div className="mt-1 text-xs text-white/50">{s.sub}</div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ==================== PROTOCOLS CHECKLIST ==================== */}
      <section className="bg-[color:var(--rose-soft)]/40 py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Safety Protocols"
            title={
              <>
                Every procedure follows{" "}
                <em className="font-display italic text-[color:var(--rose)]">
                  a strict safety checklist.
                </em>
              </>
            }
            subtitle="These are not aspirational goals — they are non-negotiable protocols followed in every procedure, every day, at every Bavishi Fertility Institute centre."
          />
          <Stagger className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
            {PROTOCOLS.map((p, i) => (
              <StaggerItem key={i}>
                <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-card px-5 py-4 shadow-soft">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--rose)]" />
                  <span className="text-[15px] leading-relaxed text-[color:var(--plum)] font-medium">
                    {p}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ==================== DOUBLE-WITNESS SECTION ==================== */}
      <section className="py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <Reveal delay={0.1}>
              <Float amplitude={6}>
                <div className="relative overflow-hidden rounded-[2rem] border border-border/40 bg-card p-8 shadow-lift">
                  <div className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-[color:var(--rose-soft)]/50">
                    <ShieldCheck className="h-8 w-8 text-[color:var(--rose)]" />
                  </div>
                  <h3 className="text-2xl font-semibold text-[color:var(--plum)]">
                    Double-Witness Protocol
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                    Two professionals independently verify and oversee every critical step:
                  </p>
                  <ul className="mt-4 space-y-2">
                    {[
                      "Sperm freezing",
                      "Sperm capacitation",
                      "Oocyte recovery",
                      "Insemination",
                      "Micro-injection (ICSI)",
                      "Embryo transfer",
                      "Cryopreservation",
                    ].map((step, i) => (
                      <li key={i} className="flex items-center gap-3 text-[15px] text-muted-foreground">
                        <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--rose)]" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </Float>
            </Reveal>
            <div>
              <Reveal>
                <Eyebrow>Genetic Safety</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 text-3xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-4xl text-balance">
                  Two professionals, one{" "}
                  <em className="font-display italic text-[color:var(--rose)]">
                    unwavering standard.
                  </em>
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-muted-foreground">
                  <p>
                    In fertility treatment, there is zero room for error. That&#39;s why Bavishi Fertility Institute
                    follows the internationally recognised <strong className="text-[color:var(--plum)]">double-witness protocol</strong> —
                    where two qualified professionals independently verify every critical procedure.
                  </p>
                  <p>
                    From the moment your samples are collected to the final embryo transfer, every step is
                    tracked using IVF-grade labels and verified by two sets of eyes. This eliminates the
                    possibility of mix-ups and ensures absolute genetic safety.
                  </p>
                  <p>
                    This protocol is considered the gold standard in reproductive medicine worldwide,
                    and it&#39;s standard practice at every Bavishi Fertility Institute centre.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SAFETY PROMISE BANNER ==================== */}
      <section className="container-px mx-auto max-w-[1400px] py-4">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[color:var(--plum)] px-8 py-16 text-center text-white noise md:px-16 md:py-20">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 left-1/3 h-72 w-72 rounded-full bg-[color:var(--rose)]/20 blur-3xl" />
            <div className="absolute -bottom-20 right-1/4 h-72 w-72 rounded-full bg-[color:var(--gold)]/15 blur-3xl" />
          </div>
          <div className="relative">
            <Reveal>
              <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-white/10">
                <Shield className="h-8 w-8 text-[color:var(--rose-soft)]" />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mx-auto max-w-3xl text-3xl font-medium leading-[1.1] md:text-4xl lg:text-[2.75rem] text-balance">
                Your safety is not a feature —{" "}
                <em className="font-display italic text-[color:var(--rose-soft)]">
                  it&#39;s our foundation.
                </em>
              </h2>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
                Every protocol, every lab standard, every training session — everything at Bavishi Fertility
                Institute is built around one principle: your safety comes first. Always.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
                {[
                  { icon: HeartPulse, text: "OHSS-Free Clinic" },
                  { icon: Wind, text: "Class 1000 Labs" },
                  { icon: ShieldCheck, text: "Double-Witness Protocol" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/80">
                    <item.icon className="h-4 w-4 text-[color:var(--rose-soft)]" /> {item.text}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="container-px mx-auto max-w-[1400px] pb-16 pt-12 md:pb-20">
        <div className="relative overflow-hidden rounded-[2.5rem] gradient-dark px-8 py-16 text-center text-white noise md:px-16 md:py-20">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-3xl font-medium leading-[1.1] md:text-4xl lg:text-5xl text-balance">
              Experience fertility treatment{" "}
              <em className="font-display italic text-[color:var(--rose-soft)]">
                where safety comes first.
              </em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
              Book a free consultation to see our world-class safety standards in action.
              Walk through our Class 1000 labs, meet our team, and start your journey with complete confidence.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Magnetic
                as="a"
                href="/#book"
                className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-4 text-sm font-semibold text-white shadow-glow"
              >
                <Calendar className="h-4 w-4" /> Book Free Consultation{" "}
                <ArrowRight className="h-4 w-4" />
              </Magnetic>
              <Magnetic
                as="a"
                href="https://wa.me/919712622288"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold text-white"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
      <FloatingCTA />
      <ScrollToTop />
      <MobileBottomBar />
    </div>
  );
}
