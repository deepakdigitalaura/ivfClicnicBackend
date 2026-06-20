"use client";
import {
  ArrowRight, Calendar, MessageCircle, CheckCircle2,
  Building2, FlaskConical, Microscope, Wind, Users, Monitor,
  ShieldCheck, Thermometer, Database, Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, Stagger, StaggerItem, Magnetic, Float, Counter } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/home-page";
import { SectionHead, Eyebrow } from "@/components/ivf-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";

/* ---------- Data ---------- */

const FACILITIES = [
  {
    icon: Wind,
    title: "Class 1000 IVF Labs",
    description:
      "Our IVF laboratories maintain air purity that is 10 times superior to the international Class 10,000 standard. This ultra-clean environment is the purest possible setting for embryo development — protecting your embryos at every moment.",
  },
  {
    icon: FlaskConical,
    title: "Dedicated IVF Lab Complex",
    description:
      "Separate IVF lab, andrology lab, and cryology lab — each purpose-built for its specialised function. Complete lab infrastructure under one roof means no compromise at any stage of the process.",
  },
  {
    icon: Microscope,
    title: "Advanced Equipment",
    description:
      "Cutting-edge 3D/4D sonography, advanced endoscopy suites, and next-generation IVF laboratory equipment. At Bavishi Fertility Institute, every piece of technology is the best available — because your embryos deserve nothing less.",
  },
  {
    icon: Building2,
    title: "Separate Operating Theatres",
    description:
      "Dedicated IVF operating theatres and separate endoscopy operating theatres for specialised procedures. Purpose-built spaces ensure the highest standards of sterility and procedural efficiency.",
  },
  {
    icon: Users,
    title: "Patient Comfort Areas",
    description:
      "Multiple private consulting rooms, dedicated counselling rooms, and comfortable waiting and recovery areas. Every space is designed for privacy, dignity, and your emotional wellbeing.",
  },
  {
    icon: Monitor,
    title: "Self-Sufficient Centres",
    description:
      "Every Bavishi Fertility Institute centre is a standalone facility equipped to handle even the most advanced cases. No need for external referrals — everything you need is available in one place.",
  },
];

const TECH_HIGHLIGHTS = [
  {
    icon: Wind,
    title: "HEPA-Filtered Laminar Flow Hoods",
    description: "Ultra-clean workstations that remove 99.97% of airborne particles, creating a sterile environment for embryo handling and preparation.",
  },
  {
    icon: Thermometer,
    title: "AI-Integrated Trigas Incubators",
    description: "Smart incubators with AI monitoring and alarm systems that precisely regulate oxygen, CO₂, and nitrogen levels — mimicking the natural environment of the womb.",
  },
  {
    icon: ShieldCheck,
    title: "Temperature Monitoring Systems",
    description: "Continuous, automated temperature monitoring across all laboratories and storage areas. Any deviation triggers immediate alerts to protect your embryos 24/7.",
  },
  {
    icon: Database,
    title: "International-Standard Data Management",
    description: "Patient data management systems built to international benchmarks — ensuring accuracy, security, and seamless coordination across all departments.",
  },
  {
    icon: Eye,
    title: "Double-Witnessing Protocols",
    description: "Every critical step — from egg retrieval to embryo transfer — is verified by two independent professionals. A rigorous safety protocol that eliminates the possibility of error.",
  },
];

const STATS = [
  { value: 14, suffix: "", label: "Centres", sub: "across 8 cities in India" },
  { value: 10, suffix: "x", label: "Superior Air Quality", sub: "Class 1000 vs Class 10,000" },
  { value: 25, suffix: "+", label: "Years of Excellence", sub: "pioneering IVF since 1998" },
  { value: 25000, suffix: "+", label: "Successful Pregnancies", sub: "across all centres" },
];

/* ---------- Page ---------- */

export function InfrastructurePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)]">Infrastructure</span>
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
                <Building2 className="h-3.5 w-3.5 text-[color:var(--rose)]" /> World-Class Facilities
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-6 text-4xl font-medium leading-[1.05] text-[color:var(--plum)] md:text-5xl lg:text-[3.5rem] text-balance">
                World-Class IVF Lab <em className="font-display italic text-[color:var(--rose)]">&amp; Infrastructure</em>
              </h1>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[color:var(--plum)]/70 text-pretty">
                Scientifically designed and aesthetically decorated centres combining functional
                proficiency with privacy and comfort &mdash; everything your fertility journey demands,
                all under one roof.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Magnetic as="a" href="/#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-4 text-sm font-semibold text-white shadow-glow">
                  <Calendar className="h-4 w-4" /> Book Free Consultation <ArrowRight className="h-4 w-4" />
                </Magnetic>
                <Magnetic as="a" href="https://wa.me/919712622288" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-[color:var(--plum)]/15 bg-white/70 px-7 py-4 text-sm font-semibold text-[color:var(--plum)]">
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ==================== STATS STRIP ==================== */}
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
                    <Counter to={s.value} />{s.suffix}
                  </div>
                  <div className="mt-2 text-sm font-medium uppercase tracking-wider text-white/80">{s.label}</div>
                  <div className="mt-1 text-xs text-white/50">{s.sub}</div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ==================== FACILITY HIGHLIGHTS ==================== */}
      <section className="py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Our Facilities"
            title={<>Purpose-built centres for <em className="font-display italic text-[color:var(--rose)]">world-class fertility care.</em></>}
            subtitle="Every Bavishi Fertility Institute centre is scientifically designed to deliver the highest standards of care — from the laboratory to the recovery room."
          />
          <Stagger className="mx-auto mt-12 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FACILITIES.map((f, i) => (
              <StaggerItem key={i}>
                <div className="group h-full rounded-2xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-[color:var(--rose-soft)]/50 text-[color:var(--rose)] transition-colors group-hover:bg-[color:var(--rose)] group-hover:text-white">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[color:var(--plum)]">{f.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{f.description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ==================== STAFFING ==================== */}
      <section className="bg-[color:var(--ivory)] py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <Float amplitude={6}>
                <div className="relative overflow-hidden rounded-[2rem] bg-[color:var(--plum)] p-10 text-white noise shadow-lift">
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[color:var(--rose)]/20 blur-3xl" />
                  </div>
                  <div className="relative space-y-6">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10">
                      <Users className="h-7 w-7 text-[color:var(--rose-soft)]" />
                    </div>
                    <h3 className="text-2xl font-medium">Expert Team, Continuous Training</h3>
                    <p className="text-white/70 leading-relaxed">
                      Every centre is staffed by a <strong className="text-white">multidisciplinary team</strong> of
                      consultants, counsellors, embryologists, and nurses &mdash; each trained and regularly
                      upskilled to maintain the highest standards.
                    </p>
                    <div className="space-y-3">
                      {[
                        "Senior fertility consultants with decades of experience",
                        "Internationally accredited embryologists",
                        "Dedicated counsellors for emotional support",
                        "Trained nursing staff with regular SOP upgrades",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-[color:var(--rose-soft)] mt-0.5" />
                          <span className="text-sm text-white/80">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Float>
            </Reveal>

            <div>
              <Reveal>
                <Eyebrow>Our Team</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 text-3xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-4xl text-balance">
                  Skilled professionals, <em className="font-display italic text-[color:var(--rose)]">continuously trained.</em>
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-muted-foreground">
                  <p>
                    Infrastructure is only as good as the people who operate it. At Bavishi Fertility Institute,
                    every team member &mdash; from senior consultants to nursing staff &mdash; undergoes regular
                    training for skill enhancement and SOP upgrades.
                  </p>
                  <p>
                    Our embryologists are internationally accredited. Our counsellors are trained to provide
                    not just medical guidance, but genuine emotional support throughout your journey. And our
                    nursing staff are specialists in fertility care, not generalists.
                  </p>
                  <p>
                    This combination of world-class infrastructure and a deeply experienced, continuously
                    trained team is what makes Bavishi Fertility Institute different.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TECHNOLOGY HIGHLIGHTS ==================== */}
      <section className="bg-[color:var(--rose-soft)]/40 py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Technology"
            title={<>Advanced systems that <em className="font-display italic text-[color:var(--rose)]">protect your embryos.</em></>}
            subtitle="From HEPA-filtered clean rooms to AI-integrated incubators, every technology in our labs is chosen for one reason — to give your embryos the best possible chance."
          />
          <div className="mx-auto mt-14 max-w-5xl">
            <Stagger className="space-y-5">
              {TECH_HIGHLIGHTS.map((t, i) => (
                <StaggerItem key={i}>
                  <div className="group flex gap-6 rounded-2xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[color:var(--rose-soft)]/50 text-[color:var(--rose)] transition-colors group-hover:bg-[color:var(--rose)] group-hover:text-white">
                      <t.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[color:var(--plum)]">{t.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t.description}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ==================== CLASS 1000 DEEP-DIVE ==================== */}
      <section className="py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <Reveal>
                <Eyebrow>The Gold Standard</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 text-3xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-4xl text-balance">
                  Why Class 1000 <em className="font-display italic text-[color:var(--rose)]">makes the difference.</em>
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-muted-foreground">
                  <p>
                    Air quality in an IVF lab directly impacts embryo development. The international
                    standard for IVF labs is Class 10,000 &mdash; meaning no more than 10,000 particles
                    per cubic foot of air.
                  </p>
                  <p>
                    Bavishi Fertility Institute labs are <strong className="text-[color:var(--plum)]">Class 1000</strong> &mdash;
                    10 times cleaner than required. Fewer airborne particles mean fewer volatile organic
                    compounds that could harm embryo development. It is one of the most significant
                    investments a fertility clinic can make, and one of the most impactful for outcomes.
                  </p>
                  <p>
                    Combined with HEPA-filtered laminar flow hoods, positive-pressure air systems, and
                    strict contamination-control protocols, our labs provide the purest possible
                    environment for your embryos to grow.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.18}>
                <div className="mt-6 space-y-3">
                  {[
                    "10x superior air quality to international standards",
                    "HEPA filtration removes 99.97% of particles",
                    "Positive-pressure clean rooms prevent contamination",
                    "Continuous environmental monitoring 24/7",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-[color:var(--rose)] mt-0.5" />
                      <span className="text-[15px] text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <Float amplitude={6}>
                <div className="relative overflow-hidden rounded-[2rem] bg-[color:var(--plum)] p-10 text-white noise shadow-lift">
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[color:var(--rose)]/20 blur-3xl" />
                    <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[color:var(--gold)]/15 blur-3xl" />
                  </div>
                  <div className="relative space-y-8 text-center">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/10">
                      <FlaskConical className="h-8 w-8 text-[color:var(--rose-soft)]" />
                    </div>
                    <div>
                      <div className="text-5xl font-semibold md:text-6xl">
                        <Counter to={10} />x
                      </div>
                      <div className="mt-2 text-sm font-medium uppercase tracking-wider text-white/80">
                        Superior Air Quality
                      </div>
                      <div className="mt-1 text-xs text-white/50">
                        Class 1000 vs international Class 10,000 standard
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-left">
                      <p className="text-sm leading-relaxed text-white/70">
                        The purest environment possible for embryo development &mdash; fewer particles, fewer
                        volatile organic compounds, better outcomes.
                      </p>
                    </div>
                  </div>
                </div>
              </Float>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ==================== CTA BANNER ==================== */}
      <section className="container-px mx-auto max-w-[1400px] pb-16 md:pb-20">
        <div className="relative overflow-hidden rounded-[2.5rem] gradient-dark px-8 py-16 text-center text-white noise md:px-16 md:py-20">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 left-1/3 h-72 w-72 rounded-full bg-[color:var(--rose)]/20 blur-3xl" />
            <div className="absolute -bottom-20 right-1/4 h-72 w-72 rounded-full bg-[color:var(--gold)]/15 blur-3xl" />
          </div>
          <div className="relative">
            <Reveal>
              <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-white/10">
                <Building2 className="h-8 w-8 text-[color:var(--rose-soft)]" />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mx-auto max-w-3xl text-3xl font-medium leading-[1.1] md:text-4xl lg:text-[2.75rem] text-balance">
                See our world-class facilities <em className="font-display italic text-[color:var(--rose-soft)]">for yourself.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
                Book a free consultation and visit any of our 14 centres across India. See the
                Class 1000 labs, meet the team, and experience the difference that world-class
                infrastructure makes for your fertility journey.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Magnetic as="a" href="/#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-4 text-sm font-semibold text-white shadow-glow">
                  <Calendar className="h-4 w-4" /> Book Free Consultation <ArrowRight className="h-4 w-4" />
                </Magnetic>
                <Magnetic as="a" href="https://wa.me/919712622288" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold text-white">
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingCTA />
      <ScrollToTop />
      <MobileBottomBar />
    </div>
  );
}
