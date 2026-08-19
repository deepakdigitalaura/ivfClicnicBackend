"use client";
import { useState } from "react";
import {
  ArrowRight, Calendar, MessageCircle, Shield,
  Clock, Users, Award, ShieldCheck, ChevronDown, Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, Stagger, StaggerItem, Magnetic, Float, Counter } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/home-page";
import { SectionHead, Eyebrow } from "@/components/ivf-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { resolveIcon } from "@/lib/icon-map";
import { SURAKSHA_KAVACH_DEFAULTS, type SurakshaKavachData } from "@/lib/suraksha-kavach";

/* ---------- FAQ Accordion ---------- */

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border/60 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left text-[17px] font-medium text-[color:var(--plum)] transition-colors hover:text-[color:var(--rose)]"
      >
        {q}
        <ChevronDown className={`h-5 w-5 shrink-0 text-[color:var(--rose)] transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[15px] leading-relaxed text-muted-foreground">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Page ---------- */

export function SurakshaKavachPage({ data = SURAKSHA_KAVACH_DEFAULTS }: { data?: SurakshaKavachData } = {}) {
  const [openFaq, setOpenFaq] = useState(0);
  const { hero, story, benefits: BENEFITS, stats: STATS, steps: STEPS, faqs: FAQS } = data;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)]">Suraksha Kavach</span>
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

        <div className="container-px relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--plum)]/15 bg-white/60 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--plum)]">
                <Shield className="h-3.5 w-3.5 text-[color:var(--rose)]" /> {hero.eyebrow}
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-6 text-4xl font-medium leading-[1.05] text-[color:var(--plum)] md:text-5xl lg:text-[3.5rem] text-balance">
                {hero.headline.split(hero.headlineEm)[0]}<em className="font-display italic text-[color:var(--rose)]">{hero.headlineEm}</em>{hero.headline.split(hero.headlineEm)[1]}
              </h1>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[color:var(--plum)]/70 text-pretty">
                {hero.paragraph}
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[color:var(--plum)]/10 bg-white/60 px-5 py-4 backdrop-blur">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[color:var(--rose-soft)]/50">
                  <Award className="h-6 w-6 text-[color:var(--rose)]" />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-[color:var(--plum)]">{hero.badgeNumber}</div>
                  <div className="text-sm text-[color:var(--plum)]/60">{hero.badgeLabel}</div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.35}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Magnetic as="a" href="/contact#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-4 text-sm font-semibold text-white shadow-glow">
                  <Calendar className="h-4 w-4" /> Book Consultation <ArrowRight className="h-4 w-4" />
                </Magnetic>
                <Magnetic as="a" href="https://wa.me/919712522289" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-[color:var(--plum)]/15 bg-white/70 px-7 py-4 text-sm font-semibold text-[color:var(--plum)]">
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </Magnetic>
              </div>
            </Reveal>
          </div>

          <div className="relative">
            <Reveal delay={0.15}>
              <Float amplitude={8}>
                <motion.div
                  whileHover={{ scale: 1.015 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="relative overflow-hidden rounded-[2rem] bg-[color:var(--ivory)] shadow-lift"
                >
                  <img
                    src={hero.image}
                    alt="Happy mother holding her newborn baby — the promise of Suraksha Kavach"
                    className="aspect-[4/5] w-full object-cover"
                  />
                </motion.div>
              </Float>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ==================== WHAT IS SURAKSHA KAVACH ==================== */}
      <section className="bg-[color:var(--ivory)] py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <Float amplitude={6}>
                <div className="relative overflow-hidden rounded-[2rem] shadow-lift">
                  <img
                    src="/assets/suraksha-shield.jpg"
                    alt="Suraksha Kavach — your shield of protection on the fertility journey"
                    className="aspect-square w-full object-cover"
                  />
                </div>
              </Float>
            </Reveal>
            <div>
              <Reveal>
                <Eyebrow>{story.eyebrow}</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 text-3xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-4xl text-balance">
                  {story.heading.lead} <em className="font-display italic text-[color:var(--rose)]">{story.heading.em}</em>
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-muted-foreground">
                  {story.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== BENEFITS GRID ==================== */}
      <section className="py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Why Suraksha Kavach"
            title={<>Everything you need for <em className="font-display italic text-[color:var(--rose)]">a worry-free journey.</em></>}
            subtitle="Suraksha Kavach takes the financial uncertainty out of IVF — so you can focus entirely on what matters most."
          />
          <Stagger className="mx-auto mt-12 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b, i) => {
              const Icon = resolveIcon(b.icon);
              return (
                <StaggerItem key={i}>
                  <div className="group h-full rounded-2xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-[color:var(--rose-soft)]/50 text-[color:var(--rose)] transition-colors group-hover:bg-[color:var(--rose)] group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-[color:var(--plum)]">{b.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{b.description}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
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

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="bg-[color:var(--ivory)] py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="How It Works"
            title={<>Your journey to parenthood, <em className="font-display italic text-[color:var(--rose)]">step by step.</em></>}
            subtitle="From your first consultation to holding your baby — every step is planned, protected, and supported."
          />
          <div className="mx-auto mt-14 max-w-4xl">
            <Stagger className="relative space-y-0">
              {/* Vertical line */}
              <div className="absolute left-[1.65rem] top-4 bottom-4 w-px bg-gradient-to-b from-[color:var(--rose)] via-[color:var(--rose)]/40 to-transparent lg:left-[1.85rem]" />

              {STEPS.map((s, i) => (
                <StaggerItem key={i}>
                  <div className="relative flex gap-6 pb-10 last:pb-0 lg:gap-8">
                    <div className="relative z-10 grid h-[3.3rem] w-[3.3rem] shrink-0 place-items-center rounded-full bg-[color:var(--rose)] text-sm font-bold text-white shadow-soft ring-4 ring-[color:var(--ivory)] lg:h-[3.7rem] lg:w-[3.7rem]">
                      {s.step}
                    </div>
                    <div className="pt-1">
                      <h3 className="text-xl font-semibold text-[color:var(--plum)]">{s.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{s.description}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ==================== PROMISE BANNER ====================
          Hidden for now per doctor's request. Content preserved below
          in case it needs to come back later. */}
      {false && (
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
                  <Shield className="h-8 w-8 text-[color:var(--rose-soft)]" />
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mx-auto max-w-3xl text-3xl font-medium leading-[1.1] md:text-4xl lg:text-[2.75rem] text-balance">
                  We don&#39;t stop until <em className="font-display italic text-[color:var(--rose-soft)]">you&#39;re holding your baby.</em>
                </h2>
              </Reveal>
              <Reveal delay={0.18}>
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
                  That&#39;s not a tagline — it&#39;s the foundation of every Suraksha Kavach enrolment.
                  Your dreams are our responsibility. We stand by you through every cycle, every step of the way.
                </p>
              </Reveal>
              <Reveal delay={0.25}>
                <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
                  {[
                    { icon: ShieldCheck, text: "Transferable Protection" },
                    { icon: Clock, text: "Multiple Cycles Covered" },
                    { icon: Users, text: "Priority Care" },
                    { icon: Heart, text: "Healthy Live Birth" },
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
      )}

      {/* ==================== FAQ ==================== */}
      <section className="bg-[color:var(--ivory)] py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <SectionHead
                eyebrow="Frequently Asked Questions"
                title={<>Have questions? <em className="font-display italic text-[color:var(--rose)]">We have answers.</em></>}
              />
              <Reveal delay={0.15}>
                <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
                  We understand that choosing an IVF program is a big decision. Here are the most common questions
                  couples ask about Suraksha Kavach. For anything else, our team is just a call away.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Magnetic as="a" href="/contact#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-soft">
                    <Calendar className="h-4 w-4" /> Book Consultation
                  </Magnetic>
                  <Magnetic as="a" href="https://wa.me/919712522289" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-[color:var(--plum)]/15 bg-white/70 px-6 py-3.5 text-sm font-semibold text-[color:var(--plum)]">
                    <MessageCircle className="h-4 w-4" /> WhatsApp Us
                  </Magnetic>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-border/70 bg-card px-6 shadow-soft lg:px-8">
                {FAQS.map((faq, i) => (
                  <FaqItem
                    key={i}
                    q={faq.q}
                    a={faq.a}
                    open={openFaq === i}
                    onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="container-px mx-auto max-w-[1400px] pb-16 md:pb-20">
        <div className="relative overflow-hidden rounded-[2.5rem] gradient-dark px-8 py-16 text-center text-white noise md:px-16 md:py-20">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-3xl font-medium leading-[1.1] md:text-4xl lg:text-5xl text-balance">
              Ready to start your journey <em className="font-display italic text-[color:var(--rose-soft)]">with complete peace of mind?</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
              Book a consultation to learn if Suraksha Kavach is right for you. No obligation, no pressure — just honest guidance from Bavishi Fertility Institute.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Magnetic as="a" href="/contact#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-4 text-sm font-semibold text-white shadow-glow">
                <Calendar className="h-4 w-4" /> Book Consultation <ArrowRight className="h-4 w-4" />
              </Magnetic>
              <Magnetic as="a" href="https://wa.me/919712522289" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold text-white">
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </Magnetic>
            </div>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="mt-4 text-xs text-white/40">* Terms and conditions apply. Eligibility determined during consultation.</p>
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
