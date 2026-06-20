"use client";
import { useState } from "react";
import {
  ArrowRight, Calendar, MessageCircle, Shield, CheckCircle2,
  Heart, Baby, RefreshCcw, IndianRupee, Stethoscope, ChevronDown,
  Clock, Users, Award, ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, Stagger, StaggerItem, Magnetic, Float, Counter } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/home-page";
import { SectionHead, Eyebrow } from "@/components/ivf-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";

/* ---------- Data ---------- */

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "100% Investment Protection",
    description: "Your investment is never wasted. The program is designed to deliver a healthy baby — and if your journey takes a different path, your package can be transferred to a loved one.",
  },
  {
    icon: RefreshCcw,
    title: "Multiple IVF Cycles",
    description: "The package covers multiple IVF/ICSI cycles, giving you the best possible chance of success without additional financial burden.",
  },
  {
    icon: Heart,
    title: "Priority Care & Attention",
    description: "Suraksha Kavach patients receive priority scheduling, dedicated coordinators, and direct access to senior fertility specialists at Bavishi Fertility Institute.",
  },
  {
    icon: Stethoscope,
    title: "Comprehensive Treatment",
    description: "Includes consultations, investigations, medications, procedures, embryology, and all lab work — no hidden costs, no surprises.",
  },
  {
    icon: Baby,
    title: "A Baby, Guaranteed",
    description: "Our commitment is to bring at least one healthy baby into the world through your investment — for you, or for someone you choose to gift this journey to.",
  },
  {
    icon: IndianRupee,
    title: "Transferable Package",
    description: "If medical circumstances prevent your success, your entire package can be transferred to a family member, friend, or loved one — ensuring your investment always brings a life into this world.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Initial Consultation",
    description: "Meet our senior fertility specialist for a thorough evaluation. We assess your medical history, run diagnostics, and determine your eligibility for Suraksha Kavach.",
  },
  {
    step: "02",
    title: "Personalised Treatment Plan",
    description: "Our team designs a customised IVF protocol tailored to your unique physiology. Every detail is planned — from medication dosage to embryo transfer strategy.",
  },
  {
    step: "03",
    title: "Enrol in Suraksha Kavach",
    description: "Once eligible, you enrol in the program with complete transparency on what's included. One package, one price, complete peace of mind.",
  },
  {
    step: "04",
    title: "Treatment & Monitoring",
    description: "Begin your IVF journey with priority care. Our team monitors every stage — stimulation, retrieval, fertilisation, and embryo development — with precision.",
  },
  {
    step: "05",
    title: "Embryo Transfer & Support",
    description: "The best-quality embryos are transferred under ultrasound guidance. Post-transfer, you receive dedicated support through the crucial two-week wait and beyond.",
  },
  {
    step: "06",
    title: "A Baby Is Born",
    description: "The program continues until you achieve a healthy live birth. If additional cycles are needed, they're covered. And if medical reasons prevent your success, your package transfers to someone you know — so your investment always results in a new life.",
  },
];

const STATS = [
  { value: 98, suffix: "%", label: "Success Rate", sub: "Suraksha Kavach patients" },
  { value: 30000, suffix: "+", label: "Babies Born", sub: "across all Bavishi Fertility Institute centres" },
  { value: 25, suffix: "+", label: "Years of Trust", sub: "pioneering IVF since 1998" },
  { value: 15, suffix: "", label: "Centres", sub: "across 8 cities in India" },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "What is the Suraksha Kavach Package?",
    a: "Suraksha Kavach is Bavishi Fertility Institute's exclusive IVF protection program — the only one of its kind in the world. It promises to deliver at least one healthy live-born baby. Your investment covers multiple IVF cycles, and if medical circumstances prevent your success, the entire package can be transferred to someone you know — a family member, friend, or loved one.",
  },
  {
    q: "Who is eligible for Suraksha Kavach?",
    a: "Eligibility is determined after an initial consultation and medical evaluation by our senior fertility specialists. Factors such as age, medical history, ovarian reserve, and overall health are assessed. Our doctors will recommend whether Suraksha Kavach is the right fit for your situation.",
  },
  {
    q: "How many IVF cycles are included?",
    a: "The Suraksha Kavach package covers multiple IVF/ICSI cycles as needed. The exact number depends on your personalised treatment plan. The program continues until a healthy live birth is achieved or all agreed-upon cycles are completed.",
  },
  {
    q: "What happens if the treatment is not successful for me?",
    a: "If medical reasons prevent your treatment from succeeding, your Suraksha Kavach package doesn't go to waste. You can transfer the entire package to someone you know — a relative, friend, or anyone who needs fertility treatment. Your investment always results in the gift of life.",
  },
  {
    q: "What does the package include?",
    a: "The package is comprehensive: consultations, diagnostic investigations, medications, ovarian stimulation, egg retrieval, ICSI/IVF procedure, embryology and lab work, embryo transfer, pregnancy monitoring, and post-treatment support. There are no hidden charges.",
  },
  {
    q: "Is the 98% success rate real?",
    a: "Yes. 98% of couples who opted for the Suraksha Kavach package at Bavishi Fertility Institute have achieved a healthy live-born child. This is one of the highest documented success rates for any IVF program in India. We are transparent about our outcomes and can share detailed statistics during your consultation.",
  },
  {
    q: "How do I enrol in Suraksha Kavach?",
    a: "Start by booking a free consultation at any of our 15 centres across India. After your initial evaluation, if you are eligible, our team will walk you through the enrolment process, package details, and answer any questions you may have.",
  },
  {
    q: "Can I transfer my package to someone else?",
    a: "Yes. If your treatment journey doesn't lead to success due to medical reasons, the Suraksha Kavach package is fully transferable. You can pass it on to a family member, friend, or anyone who could benefit from fertility treatment at Bavishi Fertility Institute. This ensures your investment always helps bring a new life into the world.",
  },
];

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

export function SurakshaKavachPage() {
  const [openFaq, setOpenFaq] = useState(0);

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

        <div className="container-px relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/80">
                <Shield className="h-3.5 w-3.5" /> India&#39;s Only IVF Protection Program
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-6 text-4xl font-medium leading-[1.05] md:text-5xl lg:text-[3.5rem] text-balance">
                No tall claims, <em className="font-display italic text-[color:var(--rose-soft)]">but a solid promise.</em>
              </h1>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 text-pretty">
                Suraksha Kavach is a unique and only one-of-its-kind package in the entire world.
                It promises at least one healthy baby from your investment — for you, or for someone you love.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[color:var(--rose)]/20">
                  <Award className="h-6 w-6 text-[color:var(--rose-soft)]" />
                </div>
                <div>
                  <div className="text-2xl font-semibold">98% Success Rate</div>
                  <div className="text-sm text-white/60">of Suraksha Kavach patients have a healthy live-born child</div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.35}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Magnetic as="a" href="/#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-4 text-sm font-semibold text-white shadow-glow">
                  <Calendar className="h-4 w-4" /> Book Free Consultation <ArrowRight className="h-4 w-4" />
                </Magnetic>
                <Magnetic as="a" href="https://wa.me/919712622288" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold text-white">
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
                    src="/assets/hero-mother-baby.jpg"
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
                <Eyebrow>What is Suraksha Kavach?</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 text-3xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-4xl text-balance">
                  The world&#39;s only <em className="font-display italic text-[color:var(--rose)]">IVF protection program.</em>
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-muted-foreground">
                  <p>
                    IVF is an emotional and financial journey. At Bavishi Fertility Institute, we believe no couple
                    should have to choose between their dream of parenthood and financial security.
                  </p>
                  <p>
                    Suraksha Kavach is our revolutionary protection program — the only one of its kind in the
                    entire world. It promises to deliver <strong className="text-[color:var(--plum)]">at least one healthy baby</strong> from
                    your investment. And if medical circumstances prevent your success, the package is fully
                    transferable to a loved one — so your investment always brings a new life into the world.
                  </p>
                  <p>
                    With 98% of enrolled couples achieving a successful outcome, Suraksha Kavach is not just
                    a promise — it&#39;s a proven path to parenthood.
                  </p>
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
            {BENEFITS.map((b, i) => (
              <StaggerItem key={i}>
                <div className="group h-full rounded-2xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-[color:var(--rose-soft)]/50 text-[color:var(--rose)] transition-colors group-hover:bg-[color:var(--rose)] group-hover:text-white">
                    <b.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[color:var(--plum)]">{b.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{b.description}</p>
                </div>
              </StaggerItem>
            ))}
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
                  Your dreams are our responsibility. Your investment always results in the gift of life — for you, or for someone you choose.
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
                  <Magnetic as="a" href="/#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-soft">
                    <Calendar className="h-4 w-4" /> Book Consultation
                  </Magnetic>
                  <Magnetic as="a" href="https://wa.me/919712622288" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-[color:var(--plum)]/15 bg-white/70 px-6 py-3.5 text-sm font-semibold text-[color:var(--plum)]">
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
              Book a free consultation to learn if Suraksha Kavach is right for you. No obligation, no pressure — just honest guidance from Bavishi Fertility Institute.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Magnetic as="a" href="/#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-4 text-sm font-semibold text-white shadow-glow">
                <Calendar className="h-4 w-4" /> Book Free Consultation <ArrowRight className="h-4 w-4" />
              </Magnetic>
              <Magnetic as="a" href="https://wa.me/919712622288" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold text-white">
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
