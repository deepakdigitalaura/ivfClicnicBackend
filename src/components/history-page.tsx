"use client";
import {
  ArrowRight, Calendar, MessageCircle, Award, MapPin, BookOpen,
  Tv, Trophy, Building2, Baby, FlaskConical, Handshake, Star,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, Stagger, StaggerItem, Magnetic, Float } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/home-page";
import { SectionHead, Eyebrow } from "@/components/ivf-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";

/* ---------- Timeline data ---------- */

const MILESTONES = [
  {
    year: "2020",
    title: "All India No. 1 & Bhuj Expansion",
    description:
      'Established in Bhuj. Ranked "All India No. 1" by Times of India. Named "No. 1 in Western India" for the 5th consecutive year (2016–2020).',
    icon: Trophy,
  },
  {
    year: "2019",
    title: "Vadodara & National Recognition",
    description:
      'Established in Vadodara. Awarded "Best IVF Clinic Chain in India – West" by The Economic Times.',
    icon: Award,
  },
  {
    year: "2018",
    title: "Surat, TV Series & Mid Day Award",
    description:
      'Established in Surat. TV series "Devna Didhela Mangine Lidhela" aired on Colours Gujarati, sharing the stories of 26 couples. Awarded "Best IVF Clinic Chain in India" by Mid Day.',
    icon: Tv,
  },
  {
    year: "2017",
    title: "European Recognition & Pregnancy Guide",
    description:
      'Awarded "Excellence in IVF" by My FM. Received the prestigious "Rose of Paracelsus" from the European Medical Association. Published "You Miracle In Making" — a comprehensive pregnancy guide.',
    icon: Star,
  },
  {
    year: "2016",
    title: "Kolkata Expansion",
    description:
      "Established in Kolkata as Bavishi Pratiksha, extending world-class fertility care to Eastern India.",
    icon: MapPin,
  },
  {
    year: "2015",
    title: "Power Brand Award",
    description:
      'Awarded "Power Brand" by IVF India (India Today group), recognising Bavishi Fertility Institute as a trusted name in fertility care.',
    icon: Award,
  },
  {
    year: "2014",
    title: "INSTAR Leadership",
    description:
      "Dr Himanshu Bavishi installed as founder president of INSTAR (Indian Society for Third-Party Assisted Reproduction).",
    icon: Handshake,
  },
  {
    year: "2013",
    title: "Public Awareness Programmes",
    description:
      'Launched "Jan Jagruti Abhiyan" and "Parivar Milan" — large-scale public awareness programmes to destigmatise infertility across Gujarat.',
    icon: Heart,
  },
  {
    year: "2012",
    title: "Vighna Daud Publication",
    description:
      'Published "Vighna Daud" — a book chronicling the emotional and medical journey of couples overcoming infertility.',
    icon: BookOpen,
  },
  {
    year: "2011",
    title: "CSR Initiative & 111 IVF Stories",
    description:
      'Founded "Divya Santan Sansthan" — a CSR and patient support group. Published "Dev na Didhela Mangine Lidhela", documenting 111 real IVF success stories.',
    icon: BookOpen,
  },
  {
    year: "2010",
    title: "Mumbai Expansion",
    description:
      "Established in Mumbai, bringing Bavishi Fertility Institute’s expertise to India’s financial capital.",
    icon: MapPin,
  },
  {
    year: "2009",
    title: "India’s First Vitrified-Oocyte Live Birth & Delhi",
    description:
      "Achieved India’s first live birth from a vitrified frozen oocyte — a landmark in reproductive medicine. Also established in Delhi.",
    icon: Baby,
  },
  {
    year: "2007",
    title: "Santan Semen Bank Founded",
    description:
      'Started "Santan Semen Bank" (now Santan ART Bank) — one of India’s earliest dedicated reproductive tissue banks.',
    icon: FlaskConical,
  },
  {
    year: "2006",
    title: "Endoscopy Excellence Institute",
    description:
      "Added a dedicated Endoscopy Excellence Institute, expanding minimally invasive fertility surgery capabilities.",
    icon: FlaskConical,
  },
  {
    year: "2005",
    title: "One of India’s Biggest Fertility Institutes",
    description:
      "Moved to a new, state-of-the-art facility — becoming one of India’s biggest and most advanced fertility institutes.",
    icon: Building2,
  },
  {
    year: "2004",
    title: "First Test-Tube Babies Meet",
    description:
      'Organised India’s first "test-tube babies meet" — a heartwarming reunion of families who conceived through IVF at the institute.',
    icon: Baby,
  },
  {
    year: "2002",
    title: "PGS-PGD — First in Gujarat",
    description:
      "Added PGS-PGD (Pre-implantation Genetic Screening & Diagnosis) — the first centre in Gujarat to offer genetic screening of embryos.",
    icon: FlaskConical,
  },
  {
    year: "1998",
    title: "International-Standard IVF Clinic",
    description:
      "Technical collaboration with the Diamond Institute, USA. IVF clinic established per international standards — the foundation of today’s Bavishi Fertility Institute.",
    icon: Award,
  },
  {
    year: "1990",
    title: "Maternity Home in Ahmedabad",
    description:
      "Maternity home established in the heart of Ahmedabad, serving thousands of families in the city.",
    icon: Building2,
  },
  {
    year: "1987",
    title: "Second Maternity Home",
    description:
      "A second maternity home opened on the outskirts of Ahmedabad to serve the growing patient community.",
    icon: Building2,
  },
  {
    year: "1986",
    title: "Where It All Began",
    description:
      "An eight-bedded Bavishi Maternity Home established by Dr Falguni & Dr Himanshu Bavishi — the seed that would grow into India’s No. 1 fertility institute.",
    icon: Building2,
  },
];

/* ---------- Page ---------- */

export function HistoryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)]">History</span>
        </nav>
      </div>

      {/* ==================== HERO ==================== */}
      <section className="gradient-warm noise relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-32 -right-20 h-[34rem] w-[34rem] rounded-full bg-[color:var(--rose)]/20 blur-3xl"
            animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-[color:var(--plum)]/15 blur-3xl"
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="container-px relative mx-auto max-w-[1400px] py-16 md:py-24 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <Eyebrow>Our History</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-5 text-4xl font-medium leading-[1.05] text-[color:var(--plum)] md:text-5xl lg:text-[3.5rem] text-balance">
                From Humble Beginnings to{" "}
                <em className="font-display italic text-[color:var(--rose)]">Best in India</em>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
                From 1986 to the present day, here are some of the landmark achievements
                we&apos;ve made over the years.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Magnetic as="a" href="/#book" className="btn-luxury group inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-soft">
                  <Calendar className="h-4 w-4" /> Book Consultation
                </Magnetic>
                <Magnetic as="a" href="/about-bfi" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-[color:var(--plum)]/15 bg-white/70 px-6 py-3.5 text-sm font-semibold text-[color:var(--plum)] backdrop-blur transition-all hover:bg-white">
                  About BFI <ArrowRight className="h-4 w-4" />
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ==================== PRESENT DAY HIGHLIGHT ==================== */}
      <section className="bg-[color:var(--ivory)] py-16 md:py-20">
        <div className="container-px mx-auto max-w-[1400px]">
          <Reveal>
            <div className="mx-auto max-w-4xl rounded-3xl border border-border/70 bg-card p-8 shadow-soft md:p-12">
              <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)]">
                  <Trophy className="h-8 w-8" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)]">Present Day</div>
                  <h2 className="mt-2 text-2xl font-medium text-[color:var(--plum)] md:text-3xl text-balance">
                    India&apos;s No. 1 Fertility Institute
                  </h2>
                  <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
                    Today, Bavishi Fertility Institute has achieved <strong className="text-[color:var(--plum)]">25,000+ successful IVF pregnancies</strong> across
                    14 centres in 8 cities. Our commitment remains the same as day one: excellence in service
                    quality, cutting-edge reproductive technology, and unconditional patient support at every
                    step of the journey.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==================== TIMELINE ==================== */}
      <section className="bg-[color:var(--rose-soft)]/40 py-16 md:py-24">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Milestones"
            title={<>35+ Years of <em className="font-display italic text-[color:var(--rose)]">Landmark Achievements</em></>}
            subtitle="Every milestone represents thousands of families who trusted us with their dream of parenthood."
          />

          {/* Desktop: alternating left/right timeline */}
          <div className="mx-auto mt-14 hidden max-w-5xl md:block">
            <div className="relative">
              {/* Centre vertical line */}
              <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-[color:var(--rose)]/20" />

              {MILESTONES.map((m, i) => {
                const isLeft = i % 2 === 0;
                const Icon = m.icon;
                return (
                  <Reveal key={m.year + i} delay={i * 0.03}>
                    <div className={`relative mb-12 flex items-start ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
                      {/* Content card */}
                      <div className={`w-[calc(50%-2rem)] ${isLeft ? "pr-4 text-right" : "pl-4 text-left"}`}>
                        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                          <div className="text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)]">{m.year}</div>
                          <h3 className="mt-2 text-lg font-semibold text-[color:var(--plum)]">{m.title}</h3>
                          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{m.description}</p>
                        </div>
                      </div>

                      {/* Centre dot */}
                      <div className="absolute left-1/2 z-10 -translate-x-1/2">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-[color:var(--rose)] text-white ring-4 ring-white shadow-soft">
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>

                      {/* Spacer for opposite side */}
                      <div className="w-[calc(50%-2rem)]" />
                    </div>
                  </Reveal>
                );
              })}

              {/* End cap */}
              <div className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[color:var(--plum)] text-white ring-4 ring-white shadow-soft">
                  <Heart className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: single-column timeline with border-l-2 */}
          <div className="mx-auto mt-10 max-w-2xl md:hidden">
            <Stagger className="relative space-y-8 border-l-2 border-[color:var(--rose)]/20 pl-8">
              {MILESTONES.map((m, i) => {
                const Icon = m.icon;
                return (
                  <StaggerItem key={m.year + i}>
                    <div className="relative">
                      <span className="absolute -left-[2.6rem] top-1 grid h-6 w-6 place-items-center rounded-full bg-[color:var(--rose)] text-white ring-4 ring-white">
                        <Icon className="h-3 w-3" />
                      </span>
                      <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--rose)]">{m.year}</div>
                      <h3 className="mt-1 text-xl font-semibold text-[color:var(--plum)]">{m.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{m.description}</p>
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="container-px mx-auto max-w-[1400px] py-16 md:py-20">
        <div className="relative overflow-hidden rounded-[2.5rem] gradient-dark px-8 py-16 text-center text-white noise md:px-16 md:py-20">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-3xl font-medium leading-[1.1] md:text-4xl lg:text-5xl text-balance">
              Be part of our <em className="font-display italic text-[color:var(--rose-soft)]">next chapter.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
              35+ years of trust, 25,000+ successful pregnancies, and counting. Book a consultation
              to start your own family&apos;s story with Bavishi Fertility Institute.
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
