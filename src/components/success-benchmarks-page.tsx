"use client";
import {
  ArrowRight, Calendar, MessageCircle, CheckCircle2,
  Microscope, Users, Heart, Baby, Sparkles, Award,
  FlaskConical, Stethoscope, IndianRupee, ShieldCheck,
  Target, TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, Stagger, StaggerItem, Magnetic, Float, Counter } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/home-page";
import { SectionHead, Eyebrow } from "@/components/ivf-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";

/* ---------- Data ---------- */

const HERO_STATS = [
  { value: 25000, suffix: "+", label: "Successful IVF Pregnancies" },
  { value: 25, suffix: "+", label: "Years of Excellence" },
  { value: 100, suffix: "+", label: "Years Combined Experience" },
  { value: 14, suffix: "", label: "Centres Across India" },
];

const PILLARS = [
  {
    icon: FlaskConical,
    title: "Technology & Medicinal Science",
    description:
      "We invest in the latest equipment and maintain Class 1000 pure air labs — 10 times cleaner than European standards. ICSI is offered to most patients, and our protocols include Day 5 blastocyst transfers, PGS, laser-assisted hatching, pICSI, and IMSI — giving every embryo the best environment and every couple the best chance.",
    highlights: [
      "Class 1000 pure air IVF labs",
      "ICSI for maximum fertilisation",
      "Day 5 blastocyst culture & transfer",
      "PGS, pICSI, IMSI & laser-assisted hatching",
    ],
  },
  {
    icon: Users,
    title: "Humans Behind the Technology",
    description:
      "Technology alone doesn't create life — people do. Our team of internationally acclaimed fertility specialists has trained across India and abroad. They bring decades of clinical expertise, continuous knowledge upgradation, and an unwavering commitment to honest, sincere, and dedicated care.",
    highlights: [
      "Internationally acclaimed specialists",
      "Trained in India and abroad",
      "Continuous knowledge upgradation",
      "Honest, sincere & dedicated",
    ],
  },
  {
    icon: Heart,
    title: "Holistic Approach",
    description:
      "Success in IVF is not just about embryos and labs — it's about preparing the whole person. We conduct thorough pre-treatment evaluations to uncover every factor, prepare both body and mind for the journey ahead, and ensure mental preparedness for pregnancy and parenthood.",
    highlights: [
      "Thorough pre-treatment evaluation",
      "Body and mind preparation",
      "Mental preparedness for pregnancy",
    ],
  },
  {
    icon: Baby,
    title: "Not Just Pregnancy — Successful Live Birth",
    description:
      "Our definition of success is not a positive test — it's a healthy baby in your arms. We follow strict protocols to prevent higher-order multiple pregnancies, provide continuous pregnancy guidance and meticulous monitoring, and partner with the best maternity services to see you through delivery.",
    highlights: [
      "Protocols to prevent higher-order multiples",
      "Continuous pregnancy guidance",
      "Meticulous monitoring throughout",
      "Best maternity services partnership",
    ],
  },
  {
    icon: IndianRupee,
    title: "Unique IVF Packages",
    description:
      "World-class fertility care should not be a privilege. We offer parsimonious packages for every pocket — from our three-cycle package that maximises your chances over multiple attempts to the Suraksha Kavach Package that gives you complete financial peace of mind.",
    highlights: [
      "Parsimonious packages for every budget",
      "Three-cycle package for maximum chances",
      "Suraksha Kavach — complete peace of mind",
    ],
  },
];

const CLOSING_BADGES = [
  { icon: Target, text: "Simple" },
  { icon: ShieldCheck, text: "Safe" },
  { icon: Sparkles, text: "Smart" },
  { icon: TrendingUp, text: "Successful" },
];

/* ---------- Page ---------- */

export function SuccessBenchmarksPage() {
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
          <span className="font-medium text-[color:var(--plum)]">Success Benchmarks</span>
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
              <Award className="h-3.5 w-3.5 text-[color:var(--rose)]" /> Proven Track Record
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-medium leading-[1.05] text-[color:var(--plum)] md:text-5xl lg:text-[3.5rem] text-balance">
              Our numbers <em className="font-display italic text-[color:var(--rose)]">speak.</em>
            </h1>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[color:var(--plum)]/70 text-pretty">
              With over 25,000+ successful IVF pregnancies and one of the highest success rates
              across India and the world!
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <blockquote className="mt-8 mx-auto max-w-2xl rounded-2xl border border-[color:var(--plum)]/10 bg-white/50 px-8 py-6 backdrop-blur">
              <p className="text-[15px] leading-relaxed text-[color:var(--plum)]/70 italic text-pretty">
                &ldquo;Success is not a random incident; it is years of learning, observing,
                implementing best practices, and prudent use of technology and resources.&rdquo;
              </p>
            </blockquote>
          </Reveal>
          <Reveal delay={0.35}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Magnetic
                as="a"
                href="/contact#book"
                className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-4 text-sm font-semibold text-white shadow-glow"
              >
                <Calendar className="h-4 w-4" /> Book Consultation <ArrowRight className="h-4 w-4" />
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

      {/* ==================== STATS STRIP ==================== */}
      <section className="relative overflow-hidden bg-[color:var(--plum)] text-white noise border-t border-white/10 py-14 lg:py-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-[color:var(--rose)]/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[color:var(--gold)]/15 blur-3xl" />
        </div>
        <div className="container-px relative mx-auto max-w-[1400px]">
          <Stagger className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {HERO_STATS.map((s, i) => (
              <StaggerItem key={i}>
                <div className="text-center">
                  <div className="text-3xl font-semibold md:text-4xl lg:text-5xl">
                    <Counter to={s.value} />{s.suffix}
                  </div>
                  <div className="mt-2 text-xs font-medium uppercase tracking-wider text-white/80 sm:text-sm">
                    {s.label}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ==================== SUCCESS PILLARS ==================== */}
      <section className="py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="The Pillars of Our Success"
            title={
              <>
                What makes our success rate{" "}
                <em className="font-display italic text-[color:var(--rose)]">one of the highest in the world.</em>
              </>
            }
            subtitle="Every successful pregnancy at Bavishi Fertility Institute is built on five unshakable pillars — technology, people, holistic care, live-birth focus, and accessible packages."
          />
          <Stagger className="mx-auto mt-14 grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p, i) => (
              <StaggerItem key={i}>
                <div className="group h-full rounded-2xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-[color:var(--rose-soft)]/50 text-[color:var(--rose)] transition-colors group-hover:bg-[color:var(--rose)] group-hover:text-white">
                    <p.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[color:var(--plum)]">{p.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{p.description}</p>
                  <ul className="mt-4 space-y-2">
                    {p.highlights.map((h, j) => (
                      <li key={j} className="flex items-start gap-2 text-[14px] text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--rose)]" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ==================== TECHNOLOGY SPOTLIGHT ==================== */}
      <section className="bg-[color:var(--ivory)] py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <Reveal>
                <Eyebrow>World-Class Labs</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 text-3xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-4xl text-balance">
                  Class 1000 Pure Air Labs —{" "}
                  <em className="font-display italic text-[color:var(--rose)]">10x cleaner than European standards.</em>
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-muted-foreground">
                  <p>
                    While the international benchmark for IVF labs is Class 10,000, every Bavishi Fertility
                    Institute lab operates at Class 1,000 — an air purity standard that is ten times more
                    stringent. This protects your embryos from volatile organic compounds, particulates,
                    and temperature fluctuations at every critical moment.
                  </p>
                  <p>
                    Combined with next-generation time-lapse incubators, strict quality-control protocols,
                    and a dedicated embryology team, our labs consistently deliver fertilisation and
                    blastocyst rates that rank among the best in the country.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {[
                    { icon: Microscope, label: "ICSI for Every Couple" },
                    { icon: FlaskConical, label: "Class 1000 Air Purity" },
                    { icon: Sparkles, label: "Laser-Assisted Hatching" },
                    { icon: Stethoscope, label: "PGS & IMSI Available" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-border/60 bg-white p-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[color:var(--rose-soft)]/40 text-[color:var(--rose)]">
                        <item.icon className="h-4.5 w-4.5" />
                      </div>
                      <span className="text-sm font-medium text-[color:var(--plum)]">{item.label}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.15}>
              <Float amplitude={6}>
                <div className="relative overflow-hidden rounded-[2rem] shadow-lift">
                  <img
                    src="/assets/ivf-lab.jpg"
                    alt="Bavishi Fertility Institute Class 1000 IVF laboratory with advanced embryology equipment"
                    className="aspect-square w-full object-cover"
                  />
                </div>
              </Float>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ==================== LIVE BIRTH FOCUS ==================== */}
      <section className="bg-[color:var(--rose-soft)]/40 py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Beyond Pregnancy"
            title={
              <>
                Our goal is a <em className="font-display italic text-[color:var(--rose)]">healthy baby in your arms.</em>
              </>
            }
            subtitle="A positive pregnancy test is a milestone, not the finish line. Our protocols, monitoring, and maternity partnerships are designed to carry you safely from embryo transfer to delivery and beyond."
          />
          <Stagger className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
            {[
              {
                icon: ShieldCheck,
                title: "Prevention of Higher-Order Multiples",
                desc: "Single or double embryo transfer protocols minimise the risk of triplets or higher — protecting both mother and babies.",
              },
              {
                icon: Stethoscope,
                title: "Continuous Pregnancy Monitoring",
                desc: "From the Beta-HCG confirmation through every trimester, our team tracks fetal growth, hormone levels, and maternal health with precision.",
              },
              {
                icon: Heart,
                title: "Pregnancy Guidance & Counselling",
                desc: "Nutritional planning, activity recommendations, mental health support, and 24/7 access to our team throughout your pregnancy journey.",
              },
              {
                icon: Baby,
                title: "Best Maternity Services",
                desc: "We partner with top maternity hospitals to ensure you have access to world-class delivery care when the big day arrives.",
              },
            ].map((item, i) => (
              <StaggerItem key={i}>
                <div className="group h-full rounded-2xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-[color:var(--rose-soft)]/50 text-[color:var(--rose)] transition-colors group-hover:bg-[color:var(--rose)] group-hover:text-white">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[color:var(--plum)]">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ==================== PACKAGES TEASER ==================== */}
      <section className="py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <Reveal delay={0.1}>
              <Float amplitude={6}>
                <div className="relative overflow-hidden rounded-[2rem] shadow-lift">
                  <img
                    src="/assets/happy-couple.jpg"
                    alt="Happy couple after successful IVF treatment at Bavishi Fertility Institute"
                    className="aspect-square w-full object-cover"
                  />
                </div>
              </Float>
            </Reveal>
            <div>
              <Reveal>
                <Eyebrow>Affordable Excellence</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 text-3xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-4xl text-balance">
                  Unique IVF packages{" "}
                  <em className="font-display italic text-[color:var(--rose)]">for every family.</em>
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-muted-foreground">
                  <p>
                    We believe world-class fertility care should be accessible to everyone. That&#39;s why
                    we&#39;ve designed packages that remove financial barriers without compromising on quality.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.18}>
                <div className="mt-6 space-y-4">
                  {[
                    {
                      title: "Parsimonious Packages",
                      desc: "Transparent, all-inclusive pricing tailored to every budget — no hidden costs, no surprises.",
                    },
                    {
                      title: "Three-Cycle Package",
                      desc: "Maximise your chances with up to three IVF/ICSI cycles at a consolidated cost.",
                    },
                    {
                      title: "Suraksha Kavach Package",
                      desc: "India's only IVF protection program — complete financial peace of mind with multiple cycles covered.",
                    },
                  ].map((pkg, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[color:var(--rose)]" />
                      <div>
                        <div className="font-semibold text-[color:var(--plum)]">{pkg.title}</div>
                        <p className="mt-0.5 text-[15px] text-muted-foreground">{pkg.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.25}>
                <div className="mt-8">
                  <Magnetic
                    as="a"
                    href="/suraksha-kavach"
                    className="btn-luxury inline-flex items-center gap-2 rounded-full border border-[color:var(--plum)]/15 bg-[color:var(--plum)] px-6 py-3.5 text-sm font-semibold text-white shadow-soft"
                  >
                    Learn About Suraksha Kavach <ArrowRight className="h-4 w-4" />
                  </Magnetic>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CLOSING CTA BANNER ==================== */}
      <section className="container-px mx-auto max-w-[1400px] pb-16 md:pb-20">
        <div className="relative overflow-hidden rounded-[2.5rem] gradient-dark px-8 py-16 text-center text-white noise md:px-16 md:py-20">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 left-1/3 h-72 w-72 rounded-full bg-[color:var(--rose)]/20 blur-3xl" />
            <div className="absolute -bottom-20 right-1/4 h-72 w-72 rounded-full bg-[color:var(--gold)]/15 blur-3xl" />
          </div>
          <div className="relative">
            <Reveal>
              <h2 className="mx-auto max-w-3xl text-3xl font-medium leading-[1.1] md:text-4xl lg:text-[2.75rem] text-balance">
                Our goals are aligned with{" "}
                <em className="font-display italic text-[color:var(--rose-soft)]">your objectives.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
                We make your fertility treatment journey with us simple, safe, smart, and
                successful. Your dream of parenthood is our commitment.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
                {CLOSING_BADGES.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/80">
                    <item.icon className="h-4 w-4 text-[color:var(--rose-soft)]" /> {item.text}
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Magnetic
                  as="a"
                  href="/contact#book"
                  className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-4 text-sm font-semibold text-white shadow-glow"
                >
                  <Calendar className="h-4 w-4" /> Book Consultation <ArrowRight className="h-4 w-4" />
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

      <Footer />
      <FloatingCTA />
      <ScrollToTop />
      <MobileBottomBar />
    </div>
  );
}
