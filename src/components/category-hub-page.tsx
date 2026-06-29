"use client";
import React from "react";
import Image from "next/image";
import { ArrowRight, Phone, Calendar, CheckCircle2, ChevronDown, Award, Users, Clock, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer, InquiryForm } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { useState } from "react";

export type HubCard = {
  title: string;
  desc: string;
  href: string;
  icon: LucideIcon;
};

export type HubStat = {
  value: string;
  label: string;
};

export type HubFaq = {
  q: string;
  a: string;
};

export type HubWhyPoint = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

type CategoryHubProps = {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  breadcrumbLabel: string;
  cards: HubCard[];
  cardsSectionTitle?: string;
  cardsSectionSubtitle?: string;
  stats?: HubStat[];
  overviewTitle?: string;
  overviewTitleAccent?: string;
  overviewParagraphs?: string[];
  overviewBullets?: string[];
  signsTitle?: string;
  signsTitleAccent?: string;
  signsSubtitle?: string;
  signs?: string[];
  whyTitle?: string;
  whyTitleAccent?: string;
  whyPoints?: HubWhyPoint[];
  faqs?: HubFaq[];
  heroImage?: string;
  heroImageAlt?: string;
  ctaHeading?: string;
  ctaSubtitle?: string;
  logoSrc?: string;
  logoAlt?: string;
};

function HubCardItem({ icon: Icon, title, desc, href }: HubCard) {
  return (
    <a href={href} aria-label={`${title} — learn more`} className="block h-full">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="group relative h-full overflow-hidden rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition-shadow duration-500 hover:shadow-lift"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[color:var(--rose)]/0 via-transparent to-[color:var(--rose)]/0 opacity-0 transition-opacity duration-500 group-hover:from-[color:var(--rose)]/[0.06] group-hover:to-transparent group-hover:opacity-100" />
        <div className="relative flex items-start gap-4">
          <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[color:var(--rose-soft)] text-[color:var(--rose)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[color:var(--plum)]">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[color:var(--rose)]">
              Learn more <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </motion.div>
    </a>
  );
}

function FaqItem({ q, a }: HubFaq) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-semibold text-[color:var(--plum)]">{q}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-[color:var(--rose)] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-[15px] leading-relaxed text-muted-foreground">{a}</p>
        </div>
      </div>
    </div>
  );
}

export function CategoryHubPage({
  eyebrow,
  title,
  titleAccent,
  subtitle,
  breadcrumbLabel,
  cards,
  cardsSectionTitle = "Explore Our Treatments",
  cardsSectionSubtitle = "Click on any treatment below to learn more about the condition, our approach, and how we can help.",
  stats,
  overviewTitle,
  overviewTitleAccent,
  overviewParagraphs,
  overviewBullets,
  signsTitle,
  signsTitleAccent,
  signsSubtitle,
  signs,
  whyTitle = "Why Choose Bavishi",
  whyTitleAccent = "Fertility Institute?",
  whyPoints,
  faqs,
  heroImage,
  heroImageAlt = "",
  ctaHeading = "Ready to Take the Next Step?",
  ctaSubtitle = "Book a consultation with our specialists to discuss your personalised treatment plan.",
  logoSrc,
  logoAlt,
}: CategoryHubProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader {...(logoSrc ? { logoSrc, logoAlt } : {})} />

      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)]">{breadcrumbLabel}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="gradient-warm noise relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-20 h-[34rem] w-[34rem] rounded-full bg-[color:var(--rose)]/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-[color:var(--plum)]/15 blur-3xl" />
        </div>
        <div className="container-px mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 py-12 md:py-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--rose)]">
                <span className="h-px w-6 bg-[color:var(--rose)]/60" /> {eyebrow}
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 text-4xl font-medium leading-[1.05] text-[color:var(--plum)] md:text-5xl lg:text-[3.5rem] text-balance">
                {title}{" "}
                {titleAccent && (
                  <em className="font-display italic text-[color:var(--rose)]">{titleAccent}</em>
                )}
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
                {subtitle}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#book"
                  className="inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110"
                >
                  <Calendar className="h-4 w-4" /> Book Appointment
                </a>
                <a
                  href="tel:+917969108108"
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--plum)]/20 bg-white px-7 py-3 text-sm font-semibold text-[color:var(--plum)] shadow-sm transition-all hover:bg-[color:var(--ivory)]"
                >
                  <Phone className="h-4 w-4" /> Call Us
                </a>
              </div>
            </Reveal>
          </div>
          {heroImage && (
            <div className="lg:col-span-5">
              <Reveal delay={0.15}>
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-white shadow-lift ring-1 ring-black/5">
                  <Image
                    src={heroImage}
                    alt={heroImageAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-center"
                  />
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </section>

      {/* Stats Strip */}
      {stats && stats.length > 0 && (
        <section className="border-b border-border/60 bg-white">
          <div className="container-px mx-auto max-w-[1400px]">
            <div className="grid grid-cols-2 divide-x divide-border/60 md:grid-cols-4">
              {stats.map((s) => (
                <Reveal key={s.label}>
                  <div className="px-4 py-8 text-center md:py-10">
                    <div className="text-3xl font-bold text-[color:var(--plum)] md:text-4xl">{s.value}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Overview */}
      {overviewParagraphs && overviewParagraphs.length > 0 && (
        <section className="bg-white py-16 md:py-24">
          <div className="container-px mx-auto max-w-[1400px]">
            <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
              <div>
                <Reveal>
                  <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--rose)]">
                    <span className="h-px w-6 bg-[color:var(--rose)]/60" /> Understanding the Condition
                  </span>
                </Reveal>
                <Reveal delay={0.05}>
                  <h2 className="mt-4 text-3xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-4xl text-balance">
                    {overviewTitle}{" "}
                    {overviewTitleAccent && (
                      <em className="font-display italic text-[color:var(--rose)]">{overviewTitleAccent}</em>
                    )}
                  </h2>
                </Reveal>
                <div className="mt-6 space-y-4">
                  {overviewParagraphs.map((p, i) => (
                    <Reveal key={i} delay={0.1 + i * 0.05}>
                      <p className="text-[15px] leading-relaxed text-muted-foreground">{p}</p>
                    </Reveal>
                  ))}
                </div>
              </div>
              {overviewBullets && overviewBullets.length > 0 && (
                <div className="self-start rounded-3xl border border-border/70 bg-[color:var(--ivory)] p-6 lg:mt-12">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--plum)]">Key Facts</h3>
                  <ul className="mt-4 space-y-3">
                    {overviewBullets.map((b, i) => (
                      <Reveal key={i} delay={0.05 * i}>
                        <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--rose)]" />
                          <span>{b}</span>
                        </li>
                      </Reveal>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Card Grid */}
      <section className="bg-[color:var(--ivory)] py-16 md:py-24">
        <div className="container-px mx-auto max-w-[1400px]">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--rose)]">
              <span className="h-px w-6 bg-[color:var(--rose)]/60" /> Conditions & Treatments
            </span>
            <h2 className="mt-4 text-2xl font-semibold text-[color:var(--plum)] md:text-3xl">
              {cardsSectionTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {cardsSectionSubtitle}
            </p>
          </Reveal>
          <Stagger className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
            {cards.map((card) => (
              <StaggerItem key={card.href}>
                <HubCardItem {...card} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Signs / When to see a specialist */}
      {signs && signs.length > 0 && (
        <section className="bg-white py-16 md:py-24">
          <div className="container-px mx-auto max-w-[1400px]">
            <div className="mx-auto max-w-3xl text-center">
              <Reveal>
                <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--rose)]">
                  <span className="h-px w-6 bg-[color:var(--rose)]/60" /> When to See a Specialist
                </span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 text-3xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-4xl text-balance">
                  {signsTitle}{" "}
                  {signsTitleAccent && (
                    <em className="font-display italic text-[color:var(--rose)]">{signsTitleAccent}</em>
                  )}
                </h2>
              </Reveal>
              {signsSubtitle && (
                <Reveal delay={0.1}>
                  <p className="mt-4 text-muted-foreground">{signsSubtitle}</p>
                </Reveal>
              )}
            </div>
            <Stagger className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.04}>
              {signs.map((s, i) => (
                <StaggerItem key={i}>
                  <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-[color:var(--ivory)] p-5">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--rose)]" />
                    <span className="text-sm leading-relaxed text-[color:var(--plum)]">{s}</span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      {whyPoints && whyPoints.length > 0 && (
        <section className="bg-[color:var(--rose-soft)]/40 py-16 md:py-24">
          <div className="container-px mx-auto max-w-[1400px]">
            <div className="mx-auto max-w-3xl text-center">
              <Reveal>
                <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--rose)]">
                  <span className="h-px w-6 bg-[color:var(--rose)]/60" /> Why Choose Us
                </span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 text-3xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-4xl text-balance">
                  {whyTitle}{" "}
                  {whyTitleAccent && (
                    <em className="font-display italic text-[color:var(--rose)]">{whyTitleAccent}</em>
                  )}
                </h2>
              </Reveal>
            </div>
            <Stagger className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
              {whyPoints.map((p) => (
                <StaggerItem key={p.title}>
                  <div className="rounded-3xl border border-border/70 bg-white p-6 shadow-soft">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--rose-soft)] text-[color:var(--rose)]">
                      <p.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-[color:var(--plum)]">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* FAQs */}
      {faqs && faqs.length > 0 && (
        <section className="bg-white py-16 md:py-24">
          <div className="container-px mx-auto max-w-[1400px]">
            <div className="mx-auto max-w-3xl">
              <Reveal>
                <div className="text-center">
                  <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--rose)]">
                    <span className="h-px w-6 bg-[color:var(--rose)]/60" /> FAQs
                  </span>
                  <h2 className="mt-4 text-3xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-4xl">
                    Frequently Asked <em className="font-display italic text-[color:var(--rose)]">Questions</em>
                  </h2>
                </div>
              </Reveal>
              <div className="mt-10 space-y-3">
                {faqs.map((faq, i) => (
                  <Reveal key={i} delay={0.03 * i}>
                    <FaqItem {...faq} />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-[color:var(--plum)] py-16 md:py-20">
        <div className="container-px mx-auto max-w-[1400px] text-center">
          <Reveal>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">{ctaHeading}</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">{ctaSubtitle}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="#book"
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110"
              >
                <Calendar className="h-4 w-4" /> Book a Consultation
              </a>
              <a
                href="tel:+917969108108"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                <Phone className="h-4 w-4" /> +91 7969 108 108
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <InquiryForm />
      <Footer />
      <FloatingCTA />
      <MobileBottomBar />
      <ScrollToTop />
    </div>
  );
}
