"use client";
import {
  ArrowRight, Calendar, MessageCircle, IndianRupee, Wallet,
  CheckCircle2, CreditCard, Smartphone, Shield, Package,
  Calculator, Heart, Percent, BadgeCheck, Repeat, Gift,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, Stagger, StaggerItem, Magnetic, Float } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/home-page";
import { SectionHead, Eyebrow } from "@/components/ivf-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { useState } from "react";

/* ---------- Data ---------- */

const ZERO_EMI_BENEFITS = [
  {
    icon: Percent,
    title: "0% Interest Rate",
    description: "Absolutely zero interest on your EMI. The amount you see is the amount you pay — no hidden charges, no extra cost.",
  },
  {
    icon: Calendar,
    title: "Flexible Tenure",
    description: "Choose a repayment plan that suits your budget. Spread your treatment cost over comfortable monthly instalments.",
  },
  {
    icon: BadgeCheck,
    title: "Quick Approval",
    description: "Minimal documentation and fast processing. Get approved and start your treatment without delays.",
  },
  {
    icon: IndianRupee,
    title: "No Financial Stress",
    description: "Focus entirely on your treatment journey. Our EMI plans ensure finances never come in the way of your dream of parenthood.",
  },
];

const PAYMENT_OPTIONS = [
  {
    icon: Smartphone,
    title: "UPI & Digital Wallets",
    description: "Pay seamlessly through Google Pay, PhonePe, Paytm, and all major UPI apps. Instant, secure, and convenient.",
  },
  {
    icon: CreditCard,
    title: "Credit & Debit Cards",
    description: "All major credit and debit cards accepted — Visa, Mastercard, RuPay, and American Express. EMI options available on select cards.",
  },
  {
    icon: Wallet,
    title: "Net Banking",
    description: "Secure online transfers from all major banks. Pay from the comfort of your home with bank-level encryption and safety.",
  },
  {
    icon: IndianRupee,
    title: "Cash & Cheque",
    description: "Traditional payment methods are always welcome at our centres. Pay in person at any Bavishi Fertility Institute location.",
  },
];

const VALUE_PACKAGES = [
  {
    icon: Package,
    title: "Best Treatment at Optimal Pricing",
    description: "We leverage our scale across 14 centres to negotiate the best rates for medications, consumables, and lab services — savings we pass directly to you.",
  },
  {
    icon: BadgeCheck,
    title: "Highest Quality Products",
    description: "No compromise on quality. We use premium-grade medications, culture media, and lab consumables — sourced at competitive costs through our pan-India procurement network.",
  },
  {
    icon: Heart,
    title: "Optimal Resource Utilisation",
    description: "Our high patient volume and efficient operations mean optimal utilisation of world-class labs, equipment, and specialist time — delivering more value per rupee.",
  },
];

const SMART_PACKAGES = [
  {
    title: "Single Cycle Package",
    highlight: false,
    description: "Ideal for patients with a good prognosis. A comprehensive single IVF/ICSI cycle with all consultations, procedures, and lab work included.",
    features: [
      "Complete IVF/ICSI cycle",
      "All consultations included",
      "Lab & embryology charges covered",
      "Transparent pricing — no hidden costs",
    ],
  },
  {
    title: "Multi-Cycle Package",
    highlight: true,
    description: "Best value for couples who want to maximise their chances. Multiple cycles at significantly reduced per-cycle cost.",
    features: [
      "Multiple IVF/ICSI cycles at reduced cost",
      "Priority scheduling & care",
      "Dedicated coordinator assigned",
      "Substantial savings over individual cycles",
    ],
  },
  {
    title: "Three-Cycle Package",
    highlight: false,
    description: "Triple your chances of success. Our three-cycle package gives you the highest probability of achieving pregnancy at the most competitive pricing.",
    features: [
      "Three complete IVF/ICSI cycles",
      "Maximum cost savings",
      "Extended support & monitoring",
      "Best success probability",
    ],
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "How does 0% interest EMI work?",
    a: "Our 0% interest EMI program means you pay no additional cost beyond the treatment price. The total amount is simply divided into equal monthly instalments. There is no processing fee, no hidden charges, and no interest — the total you pay is exactly the treatment cost.",
  },
  {
    q: "What documents are needed for EMI approval?",
    a: "Minimal documentation is required — typically a valid ID proof (Aadhaar/PAN), address proof, income proof (salary slips or bank statements for the last 3 months), and a cancelled cheque. Our finance team will guide you through the quick approval process.",
  },
  {
    q: "Can I combine EMI with a package?",
    a: "Yes, absolutely. You can opt for any of our value-based packages — single cycle, multi-cycle, or three-cycle — and pay for it via 0% interest EMI. This gives you the dual benefit of package savings and easy monthly payments.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major payment modes — cash, cheque, credit/debit cards (Visa, Mastercard, RuPay, Amex), net banking, UPI (Google Pay, PhonePe, Paytm), and digital wallets. You can choose the method most convenient for you.",
  },
  {
    q: "Is the pricing transparent? Are there hidden costs?",
    a: "Complete transparency is our policy. Every package clearly lists what is included — consultations, procedures, lab work, medications, and monitoring. There are no surprise bills or hidden charges. Your coordinator will walk you through the detailed cost breakup before you begin.",
  },
  {
    q: "What is Suraksha Kavach and how is it different?",
    a: "Suraksha Kavach is our exclusive IVF protection program — the only one of its kind in the world. It covers multiple IVF cycles and promises at least one healthy baby. If medical circumstances prevent success, the package is fully transferable. It goes beyond affordability to offer complete peace of mind.",
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

export function EasyEmiPage() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)]">Easy / Interest Free EMI</span>
        </nav>
      </div>

      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[color:var(--plum)] via-[color:var(--plum)] to-[#3a1f50] text-white noise">
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
                <Wallet className="h-3.5 w-3.5" /> Affordable Fertility Care
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-6 text-4xl font-medium leading-[1.05] md:text-5xl lg:text-[3.5rem] text-balance">
                Making IVF Affordable <em className="font-display italic text-[color:var(--rose-soft)]">for Every Family</em>
              </h1>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/75 text-pretty">
                Your dream of parenthood shouldn&#39;t be limited by finances. We offer smart payment
                solutions to make world-class fertility treatment accessible to all.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Magnetic as="a" href="/contact#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-4 text-sm font-semibold text-white shadow-glow">
                  <Calendar className="h-4 w-4" /> Book Consultation <ArrowRight className="h-4 w-4" />
                </Magnetic>
                <Magnetic as="a" href="https://wa.me/919712622288" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold text-white">
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ==================== 0% INTEREST EMI HIGHLIGHT ==================== */}
      <section className="relative overflow-hidden bg-[color:var(--ivory)] py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          {/* Highlight banner */}
          <Reveal>
            <div className="relative mx-auto mb-16 max-w-4xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-[color:var(--plum)] to-[#3a1f50] px-8 py-12 text-white noise md:px-14 md:py-14">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[color:var(--rose)]/20 blur-3xl" />
                <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-[color:var(--gold)]/15 blur-3xl" />
              </div>
              <div className="relative flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-10">
                <Float amplitude={6}>
                  <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-white/10 ring-2 ring-white/10">
                    <IndianRupee className="h-10 w-10 text-[color:var(--rose-soft)]" />
                  </div>
                </Float>
                <div>
                  <h2 className="text-3xl font-medium leading-[1.1] md:text-4xl text-balance">
                    0% Interest EMI <em className="font-display italic text-[color:var(--rose-soft)]">on IVF Treatment</em>
                  </h2>
                  <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-white/70">
                    Budget planning made easy. Easy EMI at 0% interest available for all patients at
                    Bavishi Fertility Institute. No financial stress during your treatment journey — just
                    focus on building your family.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <SectionHead
            center
            eyebrow="Zero Interest EMI"
            title={<>Why 0% EMI makes <em className="font-display italic text-[color:var(--rose)]">your journey easier</em></>}
            subtitle="Spread your IVF treatment cost over comfortable monthly instalments — without paying a single rupee in interest."
          />

          <Stagger className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ZERO_EMI_BENEFITS.map((b, i) => (
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

      {/* ==================== SMART PAYMENT OPTIONS ==================== */}
      <section className="py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Smart Payment Options"
            title={<>Pay where and how <em className="font-display italic text-[color:var(--rose)]">you want</em></>}
            subtitle="Digital payments, cards, net banking, or cash — we support every payment channel so you can pay the way that is most convenient for you."
          />

          <Stagger className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PAYMENT_OPTIONS.map((p, i) => (
              <StaggerItem key={i}>
                <div className="group h-full rounded-2xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-[color:var(--rose-soft)]/50 text-[color:var(--rose)] transition-colors group-hover:bg-[color:var(--rose)] group-hover:text-white">
                    <p.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[color:var(--plum)]">{p.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{p.description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ==================== VALUE-BASED PACKAGES ==================== */}
      <section className="bg-[color:var(--rose-soft)]/40 py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Value-Based Packages"
            title={<>Best treatment at <em className="font-display italic text-[color:var(--rose)]">optimal pricing</em></>}
            subtitle="Economy of scale means we deliver the highest quality products and treatments at the most competitive cost — without ever compromising on care."
          />

          <Stagger className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-3">
            {VALUE_PACKAGES.map((v, i) => (
              <StaggerItem key={i}>
                <div className="group h-full rounded-2xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-[color:var(--rose-soft)]/50 text-[color:var(--rose)] transition-colors group-hover:bg-[color:var(--rose)] group-hover:text-white">
                    <v.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[color:var(--plum)]">{v.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{v.description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ==================== SMART PACKAGE OPTIONS ==================== */}
      <section className="py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Smart Package Options"
            title={<>Packages for <em className="font-display italic text-[color:var(--rose)]">every pocket</em></>}
            subtitle="Multi-cycle packages at reduced costs. Choose a three-cycle package to triple your chances — and save significantly."
          />

          <Stagger className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SMART_PACKAGES.map((pkg, i) => (
              <StaggerItem key={i}>
                <div
                  className={`group relative h-full rounded-2xl border p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${
                    pkg.highlight
                      ? "border-[color:var(--rose)]/40 bg-gradient-to-b from-[color:var(--rose-soft)]/20 to-card ring-1 ring-[color:var(--rose)]/20"
                      : "border-border/70 bg-card"
                  }`}
                >
                  {pkg.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[color:var(--rose)] px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-soft">
                      Best Value
                    </span>
                  )}
                  <h3 className="text-xl font-semibold text-[color:var(--plum)]">{pkg.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{pkg.description}</p>
                  <ul className="mt-5 space-y-2.5">
                    {pkg.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2.5 text-[15px] text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--rose)]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Magnetic as="a" href="/contact#book" className="btn-luxury inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--plum)] px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-[color:var(--rose)]">
                      <Calendar className="h-4 w-4" /> Enquire Now
                    </Magnetic>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ==================== SURAKSHA KAVACH LINK ==================== */}
      <section className="bg-[color:var(--ivory)] py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[color:var(--plum)] px-8 py-16 text-white noise md:px-16 md:py-20">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 left-1/3 h-72 w-72 rounded-full bg-[color:var(--rose)]/20 blur-3xl" />
              <div className="absolute -bottom-20 right-1/4 h-72 w-72 rounded-full bg-[color:var(--gold)]/15 blur-3xl" />
            </div>
            <div className="relative mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto]">
              <div>
                <Reveal>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/80">
                    <Shield className="h-3.5 w-3.5" /> Complete Peace of Mind
                  </span>
                </Reveal>
                <Reveal delay={0.05}>
                  <h2 className="mt-5 text-3xl font-medium leading-[1.1] md:text-4xl text-balance">
                    Suraksha Kavach <em className="font-display italic text-[color:var(--rose-soft)]">Package</em>
                  </h2>
                </Reveal>
                <Reveal delay={0.12}>
                  <div className="mt-5 space-y-3 text-[17px] leading-relaxed text-white/70">
                    <p>
                      India&#39;s only IVF protection program. Multiple cycles covered under a single package.
                      If medical circumstances prevent success, the entire package is fully transferable to
                      a family member or loved one.
                    </p>
                    <p>
                      Multiple IVF cycles covered with complete financial protection — for you, or transferable to someone you choose.
                    </p>
                  </div>
                </Reveal>
                <Reveal delay={0.2}>
                  <div className="mt-6 flex flex-wrap gap-6 text-sm">
                    {[
                      { icon: Repeat, text: "Multiple Cycles Covered" },
                      { icon: Gift, text: "Fully Transferable" },
                      { icon: Shield, text: "25,000+ Happy Families" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-white/80">
                        <item.icon className="h-4 w-4 text-[color:var(--rose-soft)]" /> {item.text}
                      </div>
                    ))}
                  </div>
                </Reveal>
                <Reveal delay={0.25}>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Magnetic as="a" href="/suraksha-kavach" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-4 text-sm font-semibold text-white shadow-glow">
                      Learn About Suraksha Kavach <ArrowRight className="h-4 w-4" />
                    </Magnetic>
                    <Magnetic as="a" href="/contact#book" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold text-white">
                      <Calendar className="h-4 w-4" /> Book Consultation
                    </Magnetic>
                  </div>
                </Reveal>
              </div>
              <Reveal delay={0.15}>
                <Float amplitude={8}>
                  <div className="grid h-40 w-40 place-items-center rounded-full bg-white/10 ring-2 ring-white/10 lg:h-52 lg:w-52">
                    <Shield className="h-20 w-20 text-[color:var(--rose-soft)] lg:h-24 lg:w-24" />
                  </div>
                </Float>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== IVF COST CALCULATOR ==================== */}
      <section className="py-20 lg:py-28">
        <div className="container-px mx-auto max-w-[1400px]">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-[color:var(--rose-soft)]/50">
                <Calculator className="h-8 w-8 text-[color:var(--rose)]" />
              </div>
            </Reveal>
            <SectionHead
              center
              eyebrow="IVF Cost Calculator"
              title={<>Estimate your <em className="font-display italic text-[color:var(--rose)]">treatment expenses</em></>}
              subtitle="Use our expert IVF cost calculator to get a personalised estimate of your treatment expenses. Know what to expect before you begin."
            />
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Magnetic as="a" href="/ivf-cost-calculator" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--plum)] px-7 py-4 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-[color:var(--rose)]">
                  <Calculator className="h-4 w-4" /> Open Cost Calculator <ArrowRight className="h-4 w-4" />
                </Magnetic>
                <Magnetic as="a" href="/contact#book" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-[color:var(--plum)]/15 bg-white/70 px-7 py-4 text-sm font-semibold text-[color:var(--plum)]">
                  <MessageCircle className="h-4 w-4" /> Talk to Our Team
                </Magnetic>
              </div>
            </Reveal>
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
                  We believe in complete transparency when it comes to finances. Here are the most common
                  questions about our payment options and EMI plans. For anything else, our team is always
                  ready to help.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Magnetic as="a" href="/contact#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-soft">
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
              Don&#39;t let finances hold you back from <em className="font-display italic text-[color:var(--rose-soft)]">becoming a parent.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
              Book a consultation to discuss your treatment plan and explore the payment options that
              work best for you. No obligation, no pressure — just honest, transparent guidance.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Magnetic as="a" href="/contact#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-4 text-sm font-semibold text-white shadow-glow">
                <Calendar className="h-4 w-4" /> Book Consultation <ArrowRight className="h-4 w-4" />
              </Magnetic>
              <Magnetic as="a" href="https://wa.me/919712622288" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold text-white">
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </Magnetic>
            </div>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="mt-4 text-xs text-white/40">* EMI eligibility subject to approval. Terms and conditions apply.</p>
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
