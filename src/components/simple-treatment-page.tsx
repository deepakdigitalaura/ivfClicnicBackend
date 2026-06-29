"use client";
import {
  ArrowRight, Calendar, MessageCircle, CheckCircle2,
  Sparkles, Stethoscope, Syringe, Egg, HeartHandshake,
  ClipboardCheck, Activity, Quote,
} from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, Stagger, StaggerItem, Magnetic, Float } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/home-page";
import { SectionHead, Eyebrow } from "@/components/ivf-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";

/* ---------- Data ---------- */

const STEPS = [
  {
    step: "01",
    icon: ClipboardCheck,
    title: "Pre-treatment Evaluation",
    description:
      "Highly individualized, personalized, minimalistic. You are involved in the decision process — we explain every option, every outcome, so you make informed choices about your own body.",
    highlights: [
      "Personalized assessment",
      "Minimalistic approach",
      "You decide, we guide",
    ],
  },
  {
    step: "02",
    icon: Syringe,
    title: "Treatment",
    description:
      "Focuses on maximizing your comfort by reducing injections and hospital visits to the bare minimum. Only essential injections in minimum dosage. Oral and vaginal drugs preferred. Self-injection encouraged. Sonography at your hometown.",
    highlights: [
      "Minimum injections & dosage",
      "Oral/vaginal drugs preferred",
      "Sonography at hometown",
    ],
  },
  {
    step: "03",
    icon: Egg,
    title: "Ovum Pickup",
    description:
      "Very light and short anaesthesia — you are comfortable throughout. Discharged in just 2 hours. We use the most comfortable OT position and minimize nil-by-mouth time so you can eat sooner.",
    highlights: [
      "Light, short anaesthesia",
      "Discharged in 2 hours",
      "Minimum fasting time",
    ],
  },
  {
    step: "04",
    icon: Sparkles,
    title: "Embryo Transfer",
    description:
      "Our signature 'Zero Error' technique makes this simple, painless, and easy. After the procedure, you enjoy a brief relaxation session — and can leave and start work after just a few hours.",
    highlights: [
      "Signature 'Zero Error' technique",
      "Simple, painless, easy",
      "Back to work in hours",
    ],
  },
  {
    step: "05",
    icon: HeartHandshake,
    title: "Post Embryo Transfer",
    description:
      "NO REST required. We actively encourage you to maintain your routine lifestyle and work. Only minimum required medicines are prescribed. A simple blood pregnancy test can be done at home.",
    highlights: [
      "No bed rest needed",
      "Routine lifestyle encouraged",
      "Pregnancy test at home",
    ],
  },
];

const PHILOSOPHY = [
  {
    icon: Activity,
    title: "Minimum Injections",
    description: "Only essential injections in minimum dosage — your comfort is our priority.",
  },
  {
    icon: Stethoscope,
    title: "Fewer Hospital Visits",
    description: "Sonography at your hometown. Reduced travel, reduced stress.",
  },
  {
    icon: CheckCircle2,
    title: "Zero Error Technique",
    description: "Our signature embryo transfer technique — simple, painless, precise.",
  },
  {
    icon: HeartHandshake,
    title: "Maximum Comfort",
    description: "No unnecessary rest. Return to your routine. Live your life normally.",
  },
];

/* ---------- Page ---------- */

export function SimpleTreatmentPage() {
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
          <span className="font-medium text-[color:var(--plum)]">Simple Treatment</span>
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

        <div className="container-px relative mx-auto max-w-[1400px] py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--plum)]/15 bg-white/60 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--plum)]">
                <Sparkles className="h-3.5 w-3.5 text-[color:var(--rose)]" /> Simple by Design
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-6 text-4xl font-medium leading-[1.05] text-[color:var(--plum)] md:text-5xl lg:text-[3.5rem] text-balance">
                Most Complex things can be made{" "}
                <em className="font-display italic text-[color:var(--rose)]">
                  Simple with Science &amp; Care.
                </em>
              </h1>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[color:var(--plum)]/70 text-pretty">
                At Bavishi Fertility Institute, with 100+ years combined IVF experience,
                we have made the most complex IVF treatment <strong className="text-[color:var(--plum)]">SIMPLE</strong>.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Magnetic
                  as="a"
                  href="/contact#book"
                  className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-4 text-sm font-semibold text-white shadow-glow"
                >
                  <Calendar className="h-4 w-4" /> Book Consultation{" "}
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
        </div>
      </section>

      {/* ==================== INTRO / PHILOSOPHY CARDS ==================== */}
      <section className="py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Our Philosophy"
            title={
              <>
                IVF doesn&#39;t have to be{" "}
                <em className="font-display italic text-[color:var(--rose)]">
                  complicated.
                </em>
              </>
            }
            subtitle="We strip away the unnecessary — fewer injections, fewer visits, less stress. What remains is a treatment designed around your comfort and confidence."
          />
          <Stagger className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PHILOSOPHY.map((p, i) => (
              <StaggerItem key={i}>
                <div className="group h-full rounded-2xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-[color:var(--rose-soft)]/50 text-[color:var(--rose)] transition-colors group-hover:bg-[color:var(--rose)] group-hover:text-white">
                    <p.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[color:var(--plum)]">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ==================== 5-STEP TIMELINE ==================== */}
      <section className="bg-[color:var(--ivory)] py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="The 5-Step Simple IVF Journey"
            title={
              <>
                Every step designed for{" "}
                <em className="font-display italic text-[color:var(--rose)]">
                  your comfort.
                </em>
              </>
            }
            subtitle="From evaluation to pregnancy test — we have simplified every stage so you can focus on what truly matters."
          />
          <div className="mx-auto mt-14 max-w-4xl">
            <Stagger className="relative space-y-0">
              {/* Vertical connecting line */}
              <div className="absolute left-[1.65rem] top-4 bottom-4 w-px bg-gradient-to-b from-[color:var(--rose)] via-[color:var(--rose)]/40 to-transparent lg:left-[1.85rem]" />

              {STEPS.map((s, i) => (
                <StaggerItem key={i}>
                  <div className="relative flex gap-6 pb-12 last:pb-0 lg:gap-8">
                    {/* Numbered circle */}
                    <div className="relative z-10 grid h-[3.3rem] w-[3.3rem] shrink-0 place-items-center rounded-full bg-[color:var(--rose)] text-sm font-bold text-white shadow-soft ring-4 ring-[color:var(--ivory)] lg:h-[3.7rem] lg:w-[3.7rem]">
                      {s.step}
                    </div>
                    {/* Content card */}
                    <div className="flex-1 rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift lg:p-7">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[color:var(--rose-soft)]/50 text-[color:var(--rose)]">
                          <s.icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-semibold text-[color:var(--plum)]">
                          {s.title}
                        </h3>
                      </div>
                      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                        {s.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {s.highlights.map((h, j) => (
                          <span
                            key={j}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--rose-soft)]/30 px-3 py-1 text-xs font-medium text-[color:var(--plum)]"
                          >
                            <CheckCircle2 className="h-3 w-3 text-[color:var(--rose)]" />
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ==================== QUOTE / PHILOSOPHY BANNER ==================== */}
      <section className="py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[color:var(--plum)] px-8 py-16 text-center text-white noise md:px-16 md:py-20">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 left-1/3 h-72 w-72 rounded-full bg-[color:var(--rose)]/20 blur-3xl" />
              <div className="absolute -bottom-20 right-1/4 h-72 w-72 rounded-full bg-[color:var(--gold)]/15 blur-3xl" />
            </div>
            <div className="relative">
              <Reveal>
                <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-white/10">
                  <Quote className="h-8 w-8 text-[color:var(--rose-soft)]" />
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <blockquote className="mx-auto max-w-3xl text-2xl font-medium leading-snug md:text-3xl lg:text-[2.25rem] text-balance italic">
                  <span className="font-display text-[color:var(--rose-soft)]">&ldquo;</span>
                  Our goals are aligned with your objectives. We make your IVF simple by using our
                  expertise, experience, and advanced medicinal techniques.
                  <span className="font-display text-[color:var(--rose-soft)]">&rdquo;</span>
                </blockquote>
              </Reveal>
              <Reveal delay={0.18}>
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
                  With over 100 years of combined IVF experience, our specialists have refined every
                  protocol to deliver maximum results with minimum complexity. Simple is not a
                  compromise — it is the result of deep expertise.
                </p>
              </Reveal>
              <Reveal delay={0.25}>
                <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
                  {[
                    { icon: Sparkles, text: "100+ Years Combined Experience" },
                    { icon: Activity, text: "Minimum Injections" },
                    { icon: Stethoscope, text: "Fewer Hospital Visits" },
                    { icon: HeartHandshake, text: "Maximum Comfort" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-white/80">
                      <item.icon className="h-4 w-4 text-[color:var(--rose-soft)]" /> {item.text}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WHAT MAKES IT SIMPLE (alternating) ==================== */}
      <section className="bg-[color:var(--rose-soft)]/40 py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Simple to Understand, Plan & Undergo"
            title={
              <>
                Three pillars of{" "}
                <em className="font-display italic text-[color:var(--rose)]">
                  Simple IVF.
                </em>
              </>
            }
          />
          <Stagger className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3">
            {[
              {
                title: "Simple to Understand",
                description:
                  "We explain every step in plain language. No jargon, no confusion. You know exactly what is happening, why it is happening, and what comes next.",
                icon: ClipboardCheck,
              },
              {
                title: "Simple to Plan",
                description:
                  "Fewer hospital visits, hometown sonography, self-injection guidance. We fit the treatment around your life — not the other way around.",
                icon: Calendar,
              },
              {
                title: "Simple to Undergo",
                description:
                  "Minimum injections, light anaesthesia, no bed rest. Our Zero Error technique makes embryo transfer painless. You can return to work the same day.",
                icon: Sparkles,
              },
            ].map((pillar, i) => (
              <StaggerItem key={i}>
                <div className="group h-full rounded-2xl border border-border/70 bg-card p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[color:var(--rose-soft)]/50 text-[color:var(--rose)] transition-colors group-hover:bg-[color:var(--rose)] group-hover:text-white">
                    <pillar.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-[color:var(--plum)]">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="container-px mx-auto max-w-[1400px] py-16 md:py-20">
        <div className="relative overflow-hidden rounded-[2.5rem] gradient-dark px-8 py-16 text-center text-white noise md:px-16 md:py-20">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-3xl font-medium leading-[1.1] md:text-4xl lg:text-5xl text-balance">
              Ready to experience{" "}
              <em className="font-display italic text-[color:var(--rose-soft)]">
                IVF made simple?
              </em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
              Book a consultation at Bavishi Fertility Institute. Let us show you how
              science, care, and 100+ years of experience make your journey simple.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Magnetic
                as="a"
                href="/contact#book"
                className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-4 text-sm font-semibold text-white shadow-glow"
              >
                <Calendar className="h-4 w-4" /> Book Consultation{" "}
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
