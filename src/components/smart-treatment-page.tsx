"use client";
import {
  ArrowRight, Calendar, MessageCircle, CheckCircle2,
  Cpu, Activity, Target, Sparkles, MapPin, ClipboardList,
  IndianRupee, CreditCard, Building2, Stethoscope,
  Brain, BarChart3, Cloud, Wifi, Heart, Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, Stagger, StaggerItem, Magnetic, Float } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/home-page";
import { SectionHead, Eyebrow } from "@/components/ivf-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";

/* ---------- Data ---------- */

const SMART_FEATURES = [
  {
    icon: Cpu,
    title: "Smart Use of Technology",
    description:
      "All technology under one roof — advanced IVF labs, ultrasound suites, operation theatres, and diagnostic centres. We carefully suggest only the treatment options worth the extra cost for your individual case, never unnecessary add-ons.",
    highlights: [
      "State-of-the-art IVF laboratory",
      "Integrated diagnostic centre",
      "Cost-effective technology recommendations",
    ],
  },
  {
    icon: Activity,
    title: "Smart Monitoring",
    description:
      "We monitor all clinical and IVF lab KPIs — fertilization rate, embryo formation rate, embryo quality index, and more. Early problem detection before it affects your outcomes gives us the advantage of course-correcting in real time.",
    highlights: [
      "Real-time lab KPI tracking",
      "Fertilization & embryo quality index",
      "Early anomaly detection",
    ],
  },
  {
    icon: Target,
    title: "Smart Treatment Selection",
    description:
      "Correct and smart choice of treatment is the first step to your success. Our team has a unique ability to predict IVF success at the start of treatment and again at embryo transfer — giving you clarity and confidence at every stage.",
    highlights: [
      "Predictive success modelling",
      "Personalized protocol selection",
      "Evidence-based decision making",
    ],
  },
  {
    icon: Brain,
    title: "Smart Use of Latest Techniques",
    description:
      "We harness big data, cloud computing, and artificial intelligence to refine treatment protocols. IoT technology powers our smart fertility clinic — from incubator monitoring to environmental control in the embryology lab.",
    highlights: [
      "AI-assisted embryo selection",
      "Cloud-based data analytics",
      "IoT-enabled lab environment",
    ],
  },
  {
    icon: MapPin,
    title: "Patient Convenience",
    description:
      "Your treatment is managed at your local town or city. You visit the centre only for key procedures — no unnecessary trips. We stay flexible with your schedule so that fertility treatment fits into your life, not the other way around.",
    highlights: [
      "Local treatment management",
      "Visit only for procedures",
      "Flexible scheduling",
    ],
  },
  {
    icon: ClipboardList,
    title: "Canny Blueprint of Timeline",
    description:
      "Our team walks the extra mile to streamline your journey. Reports and prescriptions are prepared in advance. Complete notes for future planning ensure you always know the next step — no surprises, no confusion.",
    highlights: [
      "Advance report preparation",
      "Streamlined prescriptions",
      "Clear future planning notes",
    ],
  },
  {
    icon: Stethoscope,
    title: "Smart Diagnosis",
    description:
      "Diagnosis first, treatment later. We follow a step-by-step approach to identify the exact cause of infertility. Only pertinent tests are ordered — no blanket panels, no unnecessary investigations, no wasted time or money.",
    highlights: [
      "Systematic cause identification",
      "Only pertinent tests ordered",
      "Evidence-based diagnostics",
    ],
  },
  {
    icon: Building2,
    title: "Patient-Centric Architecture",
    description:
      "Every department in our centres is designed to be patient-centric. Consultations, labs, scans, and procedures are all under one roof — no transferring from one end of the building to another, no navigating a maze of corridors.",
    highlights: [
      "All departments under one roof",
      "Seamless patient flow",
      "Comfort-first clinic design",
    ],
  },
];

const COST_PACKAGES = [
  {
    icon: IndianRupee,
    title: "Best Treatment at Optimal Pricing",
    description:
      "Economy of scale across 15+ centres means you receive world-class treatment at a fraction of the cost charged by standalone clinics. Smart packages for every pocket.",
  },
  {
    icon: Heart,
    title: "Three-Cycle Packages",
    description:
      "Our multi-cycle packages maximise your chances of success while reducing per-cycle cost. A structured plan that gives you the best shot at parenthood.",
  },
  {
    icon: Shield,
    title: "Suraksha Kavach Package",
    description:
      "India's only IVF protection program. It promises at least one healthy baby — and if medical circumstances prevent your success, the package is fully transferable to a loved one.",
  },
  {
    icon: CreditCard,
    title: "Easy EMI at 0% Interest",
    description:
      "Digital payment options, secure online portals, and 0% interest EMI available — because financial barriers should never stand between you and parenthood.",
  },
];

const SMART_PILLARS = [
  { icon: Cpu, label: "Smart Technology" },
  { icon: BarChart3, label: "Smart Monitoring" },
  { icon: Target, label: "Smart Selection" },
  { icon: Brain, label: "AI & Big Data" },
  { icon: Cloud, label: "Cloud Computing" },
  { icon: Wifi, label: "IoT Enabled" },
];

/* ---------- Page ---------- */

export function SmartTreatmentPage() {
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
          <span className="font-medium text-[color:var(--plum)]">Smart Treatment</span>
        </nav>
      </div>

      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden bg-[color:var(--plum)] text-white noise">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 left-1/4 h-[32rem] w-[32rem] rounded-full bg-[color:var(--rose)]/25 blur-3xl"
            animate={{ x: [0, 60, 0], y: [0, 30, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-20 right-0 h-[28rem] w-[28rem] rounded-full bg-[color:var(--gold)]/15 blur-3xl"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="container-px relative mx-auto max-w-[1400px] py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/80">
                <Sparkles className="h-3.5 w-3.5" /> Intelligent Fertility Care
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-6 text-4xl font-medium leading-[1.05] md:text-5xl lg:text-[3.5rem] text-balance">
                Smart Treatments and Steady Care{" "}
                <em className="font-display italic text-[color:var(--rose-soft)]">
                  Meets the Goal.
                </em>
              </h1>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/75 text-pretty">
                The most important decision of your life — having a child and starting a family — calls for
                a personalized smart strategy. At Bavishi Fertility Institute, every step is intelligent,
                every choice is data-driven, and every outcome is optimized for your success.
              </p>
            </Reveal>

            {/* Smart pillars row */}
            <Reveal delay={0.25}>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                {SMART_PILLARS.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/80 backdrop-blur"
                  >
                    <p.icon className="h-4 w-4 text-[color:var(--rose-soft)]" />
                    {p.label}
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.35}>
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
        </div>
      </section>

      {/* ==================== INTRO ==================== */}
      <section className="bg-[color:var(--ivory)] py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <Eyebrow>The Smart Approach</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 text-3xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-4xl lg:text-[2.75rem] text-balance">
                Why &ldquo;smart&rdquo; isn&#39;t just a{" "}
                <em className="font-display italic text-[color:var(--rose)]">buzzword for us.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground text-pretty">
                Most fertility clinics offer treatment. We offer intelligent treatment — where every
                decision is backed by data, every process is optimized for efficiency, and every
                recommendation is tailored to your unique biology. From diagnosis to delivery, our
                smart approach means fewer unnecessary procedures, lower costs, and higher success rates.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ==================== SMART FEATURES GRID ==================== */}
      <section className="py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Smart Care Pillars"
            title={
              <>
                Eight pillars of{" "}
                <em className="font-display italic text-[color:var(--rose)]">
                  intelligent fertility care.
                </em>
              </>
            }
            subtitle="Each pillar works together to create a treatment ecosystem that is efficient, affordable, and optimized for the best possible outcome."
          />
          <Stagger className="mx-auto mt-12 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {SMART_FEATURES.map((f, i) => (
              <StaggerItem key={i}>
                <div className="group h-full rounded-2xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="flex items-start gap-5">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[color:var(--rose-soft)]/50 text-[color:var(--rose)] transition-colors group-hover:bg-[color:var(--rose)] group-hover:text-white">
                      <f.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[color:var(--plum)]">{f.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                        {f.description}
                      </p>
                      <ul className="mt-4 space-y-1.5">
                        {f.highlights.map((h, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-[color:var(--rose)]" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ==================== SMART DIAGNOSIS HIGHLIGHT ==================== */}
      <section className="bg-[color:var(--rose-soft)]/40 py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <Reveal>
                <Eyebrow>Smart Diagnosis</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 text-3xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-4xl text-balance">
                  Diagnosis first,{" "}
                  <em className="font-display italic text-[color:var(--rose)]">treatment later.</em>
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-muted-foreground">
                  <p>
                    At Bavishi Fertility Institute, we believe that the right diagnosis is the foundation
                    of successful treatment. Before recommending any procedure, our specialists follow
                    a systematic, step-by-step approach to identify the exact cause of infertility.
                  </p>
                  <p>
                    We order only the tests that are pertinent to your case — no blanket panels, no
                    unnecessary investigations. This means{" "}
                    <strong className="text-[color:var(--plum)]">less time waiting, lower costs, and a
                    faster path to the right treatment.</strong>
                  </p>
                  <p>
                    Our predictive models assess your likelihood of success before treatment even begins,
                    giving you honest guidance and realistic expectations from day one.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Magnetic
                    as="a"
                    href="/#book"
                    className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-soft"
                  >
                    <Calendar className="h-4 w-4" /> Get Your Diagnosis
                  </Magnetic>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.15}>
              <Float amplitude={6}>
                <div className="relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-lift">
                  <div className="space-y-4">
                    {[
                      { step: "01", text: "Detailed medical history and lifestyle assessment" },
                      { step: "02", text: "Targeted hormonal and diagnostic blood work" },
                      { step: "03", text: "3D sonography and structural evaluation" },
                      { step: "04", text: "Male partner semen analysis and testing" },
                      { step: "05", text: "Predictive success modelling and treatment plan" },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-4 rounded-xl border border-border/50 bg-[color:var(--ivory)]/60 p-4">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[color:var(--rose)] text-xs font-bold text-white">
                          {s.step}
                        </div>
                        <p className="text-sm font-medium text-[color:var(--plum)]">{s.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Float>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ==================== COST PACKAGES (HIGHLIGHT) ==================== */}
      <section className="py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Parsimonious Cost Packages"
            title={
              <>
                World-class care,{" "}
                <em className="font-display italic text-[color:var(--rose)]">
                  smartly priced.
                </em>
              </>
            }
            subtitle="We believe the best fertility treatment should be accessible. Smart packages designed for every pocket — with no compromise on quality."
          />

          <Stagger className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2">
            {COST_PACKAGES.map((pkg, i) => (
              <StaggerItem key={i}>
                <div className="group h-full rounded-2xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-[color:var(--rose-soft)]/50 text-[color:var(--rose)] transition-colors group-hover:bg-[color:var(--rose)] group-hover:text-white">
                    <pkg.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[color:var(--plum)]">{pkg.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                    {pkg.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          {/* Special Suraksha Kavach callout */}
          <Reveal delay={0.15}>
            <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-[color:var(--rose)]/20 bg-gradient-to-r from-[color:var(--rose-soft)]/20 via-white to-[color:var(--rose-soft)]/20 p-8 md:p-10">
              <div className="flex flex-col items-center gap-6 md:flex-row">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[color:var(--rose)]/10">
                  <Shield className="h-8 w-8 text-[color:var(--rose)]" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-semibold text-[color:var(--plum)]">
                    Suraksha Kavach — India&#39;s Only IVF Protection Program
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                    Our flagship package promises at least one healthy baby. Multiple cycles covered,
                    fully transferable, and designed for complete peace of mind. 98% of enrolled couples
                    achieve a successful outcome.
                  </p>
                </div>
                <Magnetic
                  as="a"
                  href="/suraksha-kavach"
                  className="btn-luxury inline-flex shrink-0 items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-soft"
                >
                  Learn More <ArrowRight className="h-4 w-4" />
                </Magnetic>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==================== PROMISE BANNER ==================== */}
      <section className="bg-[color:var(--ivory)] py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[color:var(--plum)] px-8 py-16 text-center text-white noise md:px-16 md:py-20">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 left-1/3 h-72 w-72 rounded-full bg-[color:var(--rose)]/20 blur-3xl" />
              <div className="absolute -bottom-20 right-1/4 h-72 w-72 rounded-full bg-[color:var(--gold)]/15 blur-3xl" />
            </div>
            <div className="relative">
              <Reveal>
                <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-white/10">
                  <Sparkles className="h-8 w-8 text-[color:var(--rose-soft)]" />
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mx-auto max-w-3xl text-3xl font-medium leading-[1.1] md:text-4xl lg:text-[2.75rem] text-balance">
                  Smart treatment isn&#39;t about doing more —{" "}
                  <em className="font-display italic text-[color:var(--rose-soft)]">
                    it&#39;s about doing what&#39;s right.
                  </em>
                </h2>
              </Reveal>
              <Reveal delay={0.18}>
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
                  Every protocol, every test, and every decision at Bavishi Fertility Institute is guided by
                  intelligence, experience, and a genuine commitment to your success. No unnecessary procedures.
                  No inflated costs. Just the smartest path to parenthood.
                </p>
              </Reveal>
              <Reveal delay={0.25}>
                <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
                  {[
                    { icon: Cpu, text: "Technology Under One Roof" },
                    { icon: Activity, text: "Real-Time Monitoring" },
                    { icon: Target, text: "Predictive Success" },
                    { icon: IndianRupee, text: "Smart Pricing" },
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

      {/* ==================== FINAL CTA ==================== */}
      <section className="container-px mx-auto max-w-[1400px] pb-16 md:pb-20">
        <div className="relative overflow-hidden rounded-[2.5rem] gradient-dark px-8 py-16 text-center text-white noise md:px-16 md:py-20">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-3xl font-medium leading-[1.1] md:text-4xl lg:text-5xl text-balance">
              Ready to experience{" "}
              <em className="font-display italic text-[color:var(--rose-soft)]">
                smarter fertility care?
              </em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
              Book a free consultation to see how our smart approach can give you the best chance of
              success — with fewer procedures, lower costs, and a treatment plan tailored entirely to you.
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
          <Reveal delay={0.25}>
            <p className="mt-4 text-xs text-white/40">
              Free consultation at any of our 15+ centres across India.
            </p>
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
