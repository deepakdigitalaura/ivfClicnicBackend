"use client";
import {
  ArrowRight, Calendar, MessageCircle, Award, Heart, Baby,
  Microscope, Users, Shield, Stethoscope, Clock, CheckCircle2,
  FlaskConical, Sparkles, Scale, HandHeart, Eye, Building2,
  Lightbulb, Star, Zap, ThumbsUp, HeartHandshake,
} from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, Stagger, StaggerItem, Magnetic, Float, Counter } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/home-page";
import { SectionHead, Eyebrow } from "@/components/ivf-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";

/* ---------- Data ---------- */

const STATS = [
  { value: 25000, suffix: "+", label: "Successful IVF Pregnancies", sub: "and counting" },
  { value: 98, suffix: "%", label: "Success Rate", sub: "couples achieved a healthy baby" },
  { value: 25, suffix: "+", label: "Years of Trust", sub: "pioneering IVF since 1998" },
  { value: 14, suffix: "", label: "Centres", sub: "across 8 cities in India" },
];

const REASONS = [
  {
    icon: Award,
    title: "Pioneers Since 1998",
    description:
      "Working in women’s health since 1986 and pioneering ART/IVF in India since 1998, in collaboration with the Diamond Institute, USA. Ranked No. 1 fertility clinic in All India.",
  },
  {
    icon: Baby,
    title: "25,000+ Successful IVF Pregnancies",
    description:
      "Over 25,000 happy families and counting. 98% of couples who entrusted us with their dream received a healthy live-born baby through our proven protocols.",
  },
  {
    icon: Lightbulb,
    title: "Path-Breaking Innovations",
    description:
      "India’s first live birth with frozen eggs, first international surrogacy, first Suraksha Kavach program — we don’t follow trends, we set them.",
  },
  {
    icon: Stethoscope,
    title: "Expert Team",
    description:
      "Experienced infertility gynaecologists, internationally accredited embryologists, and competent midwives — a multidisciplinary team dedicated to your success.",
  },
  {
    icon: Building2,
    title: "All Under One Roof",
    description:
      "A true one-stop clinic: surgeries, IUI, IVF, ICSI, laser-assisted hatching, PGT, donor services, surrogacy, and counselling — everything you need, in one place.",
  },
  {
    icon: Sparkles,
    title: "Personalization & Customization",
    description:
      "One size doesn’t fit all. Every protocol is highly customised to your unique physiology. We offer 365-day, 24/7 service because fertility doesn’t follow a calendar.",
  },
  {
    icon: Shield,
    title: "Ethics — Your Eggs, Your Sperm",
    description:
      "Fully dedicated to ethical practice. Your eggs and your sperm are guaranteed — we follow a strict code of Availability, Adequacy, Affordability, and Adaptability.",
  },
  {
    icon: Eye,
    title: "Honest & Transparent",
    description:
      "We discuss pros and cons openly, share realistic success expectations, and are completely transparent about costs — no hidden charges, no surprises.",
  },
  {
    icon: HeartHandshake,
    title: "Counselling & Hand-Holding",
    description:
      "Thorough counselling at every step. Emotional support, psychological guidance, and a compassionate team that holds your hand through the entire journey.",
  },
  {
    icon: FlaskConical,
    title: "Class 1000 IVF Labs",
    description:
      "Our labs maintain 10× superior air quality to the international Class 10,000 standard — protecting your embryos with the purest environment possible.",
  },
  {
    icon: Heart,
    title: "OHSS-Free Clinic",
    description:
      "Zero cases of severe Ovarian Hyperstimulation Syndrome for over 10 years. Our protocols are designed for safety as much as success.",
  },
  {
    icon: Scale,
    title: "Value-Based Services",
    description:
      "High-quality treatment at affordable prices. Economy of scale across 14 centres means we offer a range of packages without compromising on care.",
  },
];

const FIRSTS = [
  { year: "1998", milestone: "Pioneered ART/IVF in India in collaboration with Diamond Institute, USA" },
  { year: "2004", milestone: "India’s first live birth using frozen (vitrified) eggs" },
  { year: "2006", milestone: "India’s first international surrogacy program" },
  { year: "2010", milestone: "Launched Suraksha Kavach — the world’s only IVF protection program" },
  { year: "2014", milestone: "Introduced PGT (Preimplantation Genetic Testing) across all centres" },
  { year: "2018", milestone: "Achieved 25,000+ successful IVF pregnancies milestone" },
  { year: "2022", milestone: "Expanded to 14 centres across 8 cities in India" },
];

const ETHICS = [
  { icon: CheckCircle2, title: "Availability", description: "365/24/7 service. Your fertility journey doesn’t follow office hours — neither do we." },
  { icon: CheckCircle2, title: "Adequacy", description: "Complete, thorough care from diagnosis to delivery. No shortcuts, no half-measures." },
  { icon: CheckCircle2, title: "Affordability", description: "World-class IVF treatment at honest prices. Multiple package options to suit every budget." },
  { icon: CheckCircle2, title: "Adaptability", description: "Every protocol, every plan, every decision is adapted to your unique medical and personal needs." },
];

/* ---------- Page ---------- */

export function WhyBfiPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)]">Why BFI</span>
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
                <Star className="h-3.5 w-3.5 text-[color:var(--rose)]" /> India&#39;s No. 1 Fertility Clinic
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-6 text-4xl font-medium leading-[1.05] text-[color:var(--plum)] md:text-5xl lg:text-[3.5rem] text-balance">
                Why Choose <em className="font-display italic text-[color:var(--rose)]">Bavishi Fertility Institute?</em>
              </h1>
            </Reveal>
            <Reveal delay={0.18}>
              <blockquote className="mt-8 rounded-2xl border border-[color:var(--plum)]/10 bg-white/50 px-8 py-6 backdrop-blur">
                <p className="text-lg leading-relaxed text-[color:var(--plum)]/80 italic text-pretty">
                  &#34;The right treatment at the right time at the right place in the right numbers can almost always bring success.&#34;
                </p>
                <footer className="mt-3 text-sm font-medium text-[color:var(--rose)]">
                  &mdash; Bavishi Fertility Institute
                </footer>
              </blockquote>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Magnetic as="a" href="/#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-4 text-sm font-semibold text-white shadow-glow">
                  <Calendar className="h-4 w-4" /> Book Consultation <ArrowRight className="h-4 w-4" />
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

      {/* ==================== WHY BFI GRID ==================== */}
      <section className="py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Why Bavishi Fertility Institute"
            title={<>12 reasons families <em className="font-display italic text-[color:var(--rose)]">trust us with their dreams.</em></>}
            subtitle="For over 25 years, Bavishi Fertility Institute has been India&#39;s most trusted name in fertility care. Here&#39;s what sets us apart."
          />
          <Stagger className="mx-auto mt-12 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {REASONS.map((r, i) => (
              <StaggerItem key={i}>
                <div className="group h-full rounded-2xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-[color:var(--rose-soft)]/50 text-[color:var(--rose)] transition-colors group-hover:bg-[color:var(--rose)] group-hover:text-white">
                    <r.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[color:var(--plum)]">{r.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{r.description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ==================== INNOVATIONS TIMELINE ==================== */}
      <section className="bg-[color:var(--ivory)] py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Path-Breaking Firsts"
            title={<>A legacy of <em className="font-display italic text-[color:var(--rose)]">innovation in fertility care.</em></>}
            subtitle="From our founding partnership with Diamond Institute USA to pioneering breakthroughs that changed Indian fertility medicine forever."
          />
          <div className="mx-auto mt-14 max-w-4xl">
            <Stagger className="relative space-y-0">
              {/* Vertical line */}
              <div className="absolute left-[1.65rem] top-4 bottom-4 w-px bg-gradient-to-b from-[color:var(--rose)] via-[color:var(--rose)]/40 to-transparent lg:left-[1.85rem]" />

              {FIRSTS.map((f, i) => (
                <StaggerItem key={i}>
                  <div className="relative flex gap-6 pb-10 last:pb-0 lg:gap-8">
                    <div className="relative z-10 grid h-[3.3rem] w-[3.3rem] shrink-0 place-items-center rounded-full bg-[color:var(--rose)] text-xs font-bold text-white shadow-soft ring-4 ring-[color:var(--ivory)] lg:h-[3.7rem] lg:w-[3.7rem]">
                      {f.year}
                    </div>
                    <div className="pt-2">
                      <p className="text-[17px] leading-relaxed text-[color:var(--plum)] font-medium">{f.milestone}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ==================== ETHICS & TRANSPARENCY ==================== */}
      <section className="bg-[color:var(--rose-soft)]/40 py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <Reveal>
                <Eyebrow>Ethics & Transparency</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 text-3xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-4xl text-balance">
                  Your eggs. Your sperm. <em className="font-display italic text-[color:var(--rose)]">Guaranteed.</em>
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-muted-foreground">
                  <p>
                    At Bavishi Fertility Institute, ethics are not an afterthought &mdash; they are the foundation
                    of everything we do. We are fully dedicated to the highest standards of ethical practice in
                    fertility care.
                  </p>
                  <p>
                    We discuss the pros and cons of every treatment option openly. We are completely transparent
                    about costs, success rates, and realistic expectations. No hidden charges, no inflated promises
                    &mdash; just honest, compassionate guidance.
                  </p>
                  <p>
                    Our patients receive thorough counselling at every stage &mdash; emotional support, psychological
                    guidance, and a team that truly cares about your wellbeing beyond just the medical outcome.
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {ETHICS.map((e, i) => (
                  <StaggerItem key={i}>
                    <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-[color:var(--rose-soft)]/50 text-[color:var(--rose)]">
                        <e.icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 text-base font-semibold text-[color:var(--plum)]">{e.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{e.description}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ==================== LAB & SAFETY ==================== */}
      <section className="py-20 lg:py-28">
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
                      <FlaskConical className="h-7 w-7 text-[color:var(--rose-soft)]" />
                    </div>
                    <h3 className="text-2xl font-medium">Class 1000 IVF Labs</h3>
                    <p className="text-white/70 leading-relaxed">
                      Our IVF laboratories maintain air quality that is <strong className="text-white">10 times
                      superior</strong> to the international Class 10,000 standard. This ultra-clean environment
                      protects your embryos at every moment of their development.
                    </p>
                    <div className="flex items-center gap-3 rounded-xl bg-white/5 px-5 py-4 border border-white/10">
                      <Zap className="h-5 w-5 text-[color:var(--gold)] shrink-0" />
                      <span className="text-sm text-white/80">
                        Zero cases of severe OHSS for over 10 consecutive years
                      </span>
                    </div>
                  </div>
                </div>
              </Float>
            </Reveal>

            <div>
              <Reveal>
                <Eyebrow>World-Class Infrastructure</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 text-3xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-4xl text-balance">
                  Safety, quality, and <em className="font-display italic text-[color:var(--rose)]">precision at every step.</em>
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-muted-foreground">
                  <p>
                    Bavishi Fertility Institute operates OHSS-free clinics &mdash; we have recorded zero cases of severe
                    Ovarian Hyperstimulation Syndrome for over a decade. Our stimulation protocols are designed for your
                    safety as much as your success.
                  </p>
                  <p>
                    Every centre is equipped with next-generation incubators, advanced cryopreservation systems, and
                    Class 1000 clean-room IVF laboratories that meet and exceed international standards.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.18}>
                <div className="mt-6 space-y-3">
                  {[
                    "ICSI for every couple — maximum fertilisation success",
                    "Laser-assisted hatching for improved implantation",
                    "Vitrification with close to 100% embryo survival",
                    "PGT for genetic screening and healthy births",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-[color:var(--rose)] mt-0.5" />
                      <span className="text-[15px] text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PROMISE BANNER ==================== */}
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
                  <Heart className="h-8 w-8 text-[color:var(--rose-soft)]" />
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mx-auto max-w-3xl text-3xl font-medium leading-[1.1] md:text-4xl lg:text-[2.75rem] text-balance">
                  One stop. One team. <em className="font-display italic text-[color:var(--rose-soft)]">One dream fulfilled.</em>
                </h2>
              </Reveal>
              <Reveal delay={0.18}>
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
                  From your first consultation to the moment you hold your baby, everything happens under one roof.
                  Surgeries, IUI, IVF, ICSI, PGT, donor services, counselling, and emotional support &mdash;
                  Bavishi Fertility Institute is the only partner you need on your journey to parenthood.
                </p>
              </Reveal>
              <Reveal delay={0.25}>
                <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
                  {[
                    { icon: Users, text: "Multidisciplinary Experts" },
                    { icon: Clock, text: "365/24/7 Service" },
                    { icon: Shield, text: "Ethical Practice" },
                    { icon: ThumbsUp, text: "Transparent Pricing" },
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
              Ready to begin your journey <em className="font-display italic text-[color:var(--rose-soft)]">with India&#39;s most trusted team?</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
              Book a consultation at any of our 14 centres across India. No obligation, no pressure &mdash; just honest, compassionate guidance from the pioneers of IVF in India.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Magnetic as="a" href="/#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-4 text-sm font-semibold text-white shadow-glow">
                <Calendar className="h-4 w-4" /> Book Consultation <ArrowRight className="h-4 w-4" />
              </Magnetic>
              <Magnetic as="a" href="https://wa.me/919712622288" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold text-white">
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
