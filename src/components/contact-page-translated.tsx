/* Demo-only translated rendering of the Contact page for hi-preview/gu-preview
 * routes. Not linked from nav, not indexed — see translation-demo-banner.tsx.
 * Mirrors src/components/contact-page.tsx markup; do NOT edit that shared
 * production component for this demo (kept isolated on purpose). */
"use client";
import { Phone, Mail, MessageCircle, Clock, MapPin, Calendar, Navigation, type LucideIcon } from "lucide-react";
import { Reveal, Stagger, StaggerItem, Magnetic } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { InquiryForm, Footer } from "@/components/home-page";
import { SectionHead, Eyebrow, Faq } from "@/components/ivf-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";

const ICONS: Record<string, LucideIcon> = { Phone, MessageCircle, Mail, Clock, MapPin, Calendar };

export type TCard = { icon: string; t: string; v: string; href?: string | null; note?: string | null };
export type TCentre = { name: string; address: string; phone: string; phoneLabel: string; hours?: string; href?: string };
export type TFaq = { q: string; a: string };
export type THero = { eyebrow: string; lead: string; em: string; subtitle: string };

type UiStrings = {
  breadcrumbHome: string;
  breadcrumbContact: string;
  networkEyebrow: string;
  networkTitleLead: string;
  networkTitleEm: string;
  networkSubtitle: string;
  call: string;
  directions: string;
  needHelpTitle: string;
  needHelpSubtitle: string;
  bookConsultation: string;
  faqEyebrow: string;
  faqTitleLead: string;
  faqTitleEm: string;
  bottomHeading: string;
  bottomHeadingEm: string;
  whatsappUs: string;
};

export function ContactPageTranslated({
  hero,
  faqs,
  cards,
  directory,
  ui,
}: {
  hero: THero;
  faqs: TFaq[];
  cards: TCard[];
  directory: TCentre[];
  ui: UiStrings;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[color:var(--rose)]">{ui.breadcrumbHome}</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)]">{ui.breadcrumbContact}</span>
        </nav>
      </div>

      <section className="gradient-warm noise relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-20 h-[30rem] w-[30rem] rounded-full bg-[color:var(--rose)]/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-24 h-[26rem] w-[26rem] rounded-full bg-[color:var(--plum)]/15 blur-3xl" />
        </div>
        <div className="container-px mx-auto max-w-[1400px] py-16 text-center md:py-20">
          <Reveal><div className="flex justify-center"><Eyebrow>{hero.eyebrow}</Eyebrow></div></Reveal>
          <Reveal delay={0.05}>
            <h1 className="mx-auto mt-5 text-4xl font-medium leading-[1.05] text-[color:var(--plum)] md:text-5xl lg:text-[3.25rem] lg:whitespace-nowrap xl:text-[3.5rem]">
              {hero.lead} <em className="font-display italic text-[color:var(--rose)]">{hero.em}</em>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              {hero.subtitle}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-px mx-auto max-w-[1400px] py-10 md:py-16">
        <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {cards.map((c) => {
            const Icon = ICONS[c.icon] ?? Phone;
            const inner = (
              <div className="flex h-full flex-col items-start rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--rose)]/10 text-[color:var(--rose)]"><Icon className="h-5 w-5" /></div>
                <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-[color:var(--rose)]">{c.t}</div>
                <div className="mt-1 text-base font-semibold text-[color:var(--plum)]">{c.v}</div>
                <div className="mt-1 text-sm text-muted-foreground">{c.note}</div>
              </div>
            );
            return (
              <StaggerItem key={c.t}>
                {c.href ? <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined} className="block h-full">{inner}</a> : inner}
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* Form itself stays English in this demo (shared production component). */}
      <InquiryForm />

      <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
        <SectionHead center eyebrow={ui.networkEyebrow} title={<>{ui.networkTitleLead} <em className="font-display italic text-[color:var(--rose)]">{ui.networkTitleEm}</em></>} subtitle={ui.networkSubtitle} />

        <Stagger className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {directory.map((c) => (
            <StaggerItem key={c.name} className="h-full">
              <article className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-[color:var(--rose)]/40 hover:shadow-lift">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--rose)]/10 text-[color:var(--rose)]">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <h3 className="text-[15px] font-semibold leading-snug text-[color:var(--plum)]">{c.name}</h3>
                </div>

                <p className="mt-4 flex-1 text-[13px] leading-relaxed text-muted-foreground">{c.address}</p>

                <a href={`tel:+${c.phone}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--plum)] transition-colors hover:text-[color:var(--rose)]">
                  <Phone className="h-4 w-4 text-[color:var(--rose)]" /> {c.phoneLabel}
                </a>

                {c.hours && (
                  <div className="mt-2 inline-flex items-start gap-2 text-[12px] text-muted-foreground">
                    <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--rose)]" />
                    <span>{c.hours}</span>
                  </div>
                )}

                <div className="mt-auto flex flex-nowrap items-center gap-1.5 border-t border-border/60 pt-4">
                  <a href={`tel:+${c.phone}`} className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-[color:var(--rose)] px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:brightness-110">
                    <Phone className="h-3 w-3" /> {ui.call}
                  </a>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Bavishi Fertility Institute " + c.name.replace(" — ", " "))}`} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-[color:var(--plum)]/15 px-2.5 py-1.5 text-[11px] font-semibold text-[color:var(--plum)] transition hover:bg-[color:var(--plum)]/5">
                    <Navigation className="h-3 w-3" /> {ui.directions}
                  </a>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <div className="mt-9 flex flex-col items-center justify-between gap-6 rounded-3xl border border-border/70 bg-[color:var(--rose-soft)]/30 px-8 py-8 text-center md:flex-row md:text-left">
            <div>
              <h3 className="text-xl font-semibold text-[color:var(--plum)]">{ui.needHelpTitle}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{ui.needHelpSubtitle}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="tel:+919712622288" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:brightness-110">
                <Phone className="h-4 w-4" /> {cards[0]?.t ?? "Call Us"}
              </a>
              <a href="#book" className="inline-flex items-center gap-2 rounded-full border border-[color:var(--plum)]/15 bg-white px-6 py-3 text-sm font-semibold text-[color:var(--plum)] transition hover:border-[color:var(--rose)]/40">
                <Calendar className="h-4 w-4" /> {ui.bookConsultation}
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-[color:var(--rose-soft)]/40 py-8 md:py-14">
        <div className="container-px mx-auto max-w-3xl">
          <SectionHead center eyebrow={ui.faqEyebrow} title={<>{ui.faqTitleLead} <em className="font-display italic text-[color:var(--rose)]">{ui.faqTitleEm}</em></>} />
          <div className="mt-9 space-y-3">
            {faqs.map((f, i) => <Faq key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      <section className="container-px mx-auto max-w-[1400px] pb-8 md:pb-14">
        <div className="relative overflow-hidden rounded-[2.5rem] gradient-dark px-8 py-16 text-center text-white noise md:px-16 md:py-20">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-3xl font-medium leading-[1.1] md:text-4xl lg:text-5xl text-balance">
              {ui.bottomHeading} <em className="font-display italic text-[color:var(--rose-soft)]">{ui.bottomHeadingEm}</em>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Magnetic as="a" href="#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-glow"><Calendar className="h-4 w-4" /> {ui.bookConsultation}</Magnetic>
              <Magnetic as="a" href="tel:+919712622288" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white"><Phone className="h-4 w-4" /> +91 97126 22288</Magnetic>
              <Magnetic as="a" href="https://wa.me/919712522289" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white"><MessageCircle className="h-4 w-4" /> {ui.whatsappUs}</Magnetic>
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
