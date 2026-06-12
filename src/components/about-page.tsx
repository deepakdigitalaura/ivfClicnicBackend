"use client";
import {
  ArrowRight, Calendar, MessageCircle, CheckCircle2, Building2,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem, Magnetic, Float } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Doctors, AwardsCarousel, Footer } from "@/components/home-page";
import { SectionHead, Eyebrow } from "@/components/ivf-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { Editable, EditableImage } from "@/components/editor/Editable";
import { useEdit } from "@/components/editor/edit-context";
import { ABOUT_DEFAULTS, type AboutData } from "@/lib/about";
import { resolveIcon } from "@/lib/icon-map";

/* `<Editable>` is inert on the public site (byte-identical) and click-to-edit
 * inside /edit/about-bfi. `path` is the dot-path into the about-page global
 * SOURCE draft (see materializeAboutSource). */
const ed = (path: string, value: string, rich = true) => (
  <Editable path={path} rich={rich}>{value}</Editable>
);

/* The page's STRUCTURED editorial content is CMS-managed via the `about-page`
 * global (Wave 4.5, Phase E); the route server-resolves it and prop-drills the
 * plain `AboutData` here. Falls back to ABOUT_DEFAULTS so the page is byte-
 * identical when the global is empty (same pattern as <HomePage>). The inline-
 * <strong> "Our Story"/"Patient First" prose, the decorative <SectionHead> <em>
 * titles, hero/CTA button hrefs+icons, the JSON-LD graph and the reused
 * <Doctors>/<AwardsCarousel> sections stay code-owned. */
export function AboutPage({ data = ABOUT_DEFAULTS }: { data?: AboutData } = {}) {
  const editing = !!useEdit()?.editMode;
  // Reconstruct the hero <h1> as lead + accent <em> + tail from the headline +
  // italic phrase, so the markup stays byte-identical while the words are CMS-
  // editable (the italic phrase appears mid-headline).
  const [heroLead, heroTail] = data.hero.headline.split(data.hero.headlineItalic);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)]">About Bavishi Fertility Institute</span>
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
            <Reveal><Eyebrow>{ed("hero.eyebrow", data.hero.eyebrow)}</Eyebrow></Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 text-4xl font-medium leading-[1.05] text-[color:var(--plum)] md:text-5xl lg:text-[3.5rem] text-balance">
                {editing ? (
                  ed("hero.headline", data.hero.headline)
                ) : (
                  <>{heroLead}<em className="font-display italic text-[color:var(--rose)]">{data.hero.headlineItalic}</em>{heroTail}</>
                )}
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
                {ed("hero.paragraph", data.hero.paragraph)}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Magnetic as="a" href="/#book" className="btn-luxury group inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-soft">
                  <Calendar className="h-4 w-4" /> Book Free Consultation
                </Magnetic>
                <Magnetic as="a" href="/what-is-ivf" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-[color:var(--plum)]/15 bg-white/70 px-6 py-3.5 text-sm font-semibold text-[color:var(--plum)] backdrop-blur transition-all hover:bg-white">
                  Explore IVF <ArrowRight className="h-4 w-4" />
                </Magnetic>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.15}>
              <Float amplitude={8}>
                <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-lift ring-1 ring-black/5">
                  {editing ? (
                    <EditableImage path="hero.image" src={data.hero.image} alt="The Bavishi family — founders and second-generation doctors of Bavishi Fertility Institute" className="aspect-[4/5] w-full object-cover" />
                  ) : (
                    <img src={data.hero.image} alt="The Bavishi family — founders and second-generation doctors of Bavishi Fertility Institute" className="aspect-[4/5] w-full object-cover" />
                  )}
                </div>
              </Float>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
          <div>
            <SectionHead
              eyebrow={ed("story.eyebrow", data.story.eyebrow, false)}
              title={<>{ed("story.heading.lead", data.story.heading.lead, false)} <em className="font-display italic text-[color:var(--rose)]">{ed("story.heading.em", data.story.heading.em, false)}</em></>}
            />
            <div className="mt-6 space-y-5 text-[17px] leading-relaxed text-muted-foreground">
              {data.story.paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.05}><Editable path={`story.paragraphs.${i}.value`} as="p">{p}</Editable></Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={0.1}>
            <aside className="rounded-3xl border border-border/70 bg-[color:var(--rose-soft)]/30 p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)]">At a glance</div>
              <dl className="mt-4 space-y-4">
                {data.atAGlance.map(({ n, l }, i) => (
                  <div key={i} className="flex items-baseline gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0">
                    <dt className="font-display text-2xl font-medium text-[color:var(--plum)]">{ed(`atAGlance.${i}.value`, n, false)}</dt>
                    <dd className="text-sm text-muted-foreground">{ed(`atAGlance.${i}.label`, l, false)}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* Legacy timeline */}
      <section className="bg-[color:var(--rose-soft)]/40 py-8 md:py-14">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow={ed("legacy.eyebrow", data.legacy.eyebrow, false)}
            title={<>{ed("legacy.heading.lead", data.legacy.heading.lead, false)} <em className="font-display italic text-[color:var(--rose)]">{ed("legacy.heading.em", data.legacy.heading.em, false)}</em></>}
          />
          <div className="mx-auto mt-10 max-w-3xl">
            <Stagger className="relative space-y-8 border-l-2 border-[color:var(--rose)]/20 pl-8">
              {data.milestones.map((m, i) => (
                <StaggerItem key={i}>
                  <div className="relative">
                    <span className="absolute -left-[2.6rem] top-1 grid h-6 w-6 place-items-center rounded-full bg-[color:var(--rose)] text-[10px] font-bold text-white ring-4 ring-white">●</span>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--rose)]">{ed(`milestones.${i}.y`, m.y, false)}</div>
                    <h3 className="mt-1 text-xl font-semibold text-[color:var(--plum)]">{ed(`milestones.${i}.t`, m.t)}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{ed(`milestones.${i}.d`, m.d)}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* Why families trust */}
      <section className="bg-[color:var(--ivory)] py-8 md:py-14">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow={ed("trust.eyebrow", data.trust.eyebrow, false)}
            title={<>{ed("trust.heading.lead", data.trust.heading.lead, false)} <em className="font-display italic text-[color:var(--rose)]">{ed("trust.heading.em", data.trust.heading.em, false)}</em></>}
          />
          <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.trustPillars.map((p, i) => {
              const Icon = resolveIcon(p.icon);
              return (
              <StaggerItem key={i}>
                <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)]"><Icon className="h-6 w-6" /></div>
                  <h3 className="mt-5 text-lg font-semibold text-[color:var(--plum)]">{ed(`trustPillars.${i}.t`, p.t)}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{ed(`trustPillars.${i}.d`, p.d)}</p>
                </div>
              </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Meet experts (reused) — wrapped in a blush band so it alternates with
          its ivory (Why-trust) and white (Awards) neighbours */}
      <div className="bg-[color:var(--rose-soft)]/40"><Doctors /></div>

      {/* Awards (reused) */}
      <AwardsCarousel />

      {/* Patient success focus */}
      <section className="bg-[color:var(--rose-soft)]/40 py-8 md:py-14">
        <div className="container-px mx-auto max-w-[1400px] grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHead
              eyebrow={ed("patientFirst.eyebrow", data.patientFirst.eyebrow, false)}
              title={<>{ed("patientFirst.heading.lead", data.patientFirst.heading.lead, false)} <em className="font-display italic text-[color:var(--rose)]">{ed("patientFirst.heading.em", data.patientFirst.heading.em, false)}</em></>}
            />
            <div className="mt-6 space-y-5 text-[16px] leading-relaxed text-muted-foreground">
              {data.patientFirst.paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.05}><Editable path={`patientFirst.paragraphs.${i}.value`} as="p">{p}</Editable></Reveal>
              ))}
            </div>
          </div>
          <Stagger className="grid grid-cols-2 gap-4">
            {data.patientStats.map(({ n, l }, i) => (
              <StaggerItem key={i}>
                <div className="rounded-2xl border border-border/70 bg-card p-6 text-center shadow-soft">
                  <div className="font-display text-3xl font-medium text-[color:var(--plum)]">{ed(`patientStats.${i}.value`, n, false)}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{ed(`patientStats.${i}.label`, l, false)}</div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Centres across India */}
      <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
        <SectionHead center eyebrow="Our Network" title={<>{ed("network.heading.lead", data.network.heading.lead)} <em className="font-display italic text-[color:var(--rose)]">{ed("network.heading.em", data.network.heading.em)}</em></>} subtitle={ed("network.subtitle", data.network.subtitle)} />
        <Stagger className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data.network.cities.map((c, i) => (
            <StaggerItem key={i}>
              <a href={c.c === "Ahmedabad" ? "/locations/ahmedabad" : "/#locations"} className="group flex items-center justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-[color:var(--plum)]"><Building2 className="h-4 w-4 text-[color:var(--rose)]" /> {ed(`network.cities.${i}.c`, c.c, false)}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{ed(`network.cities.${i}.n`, c.n, false)}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-[color:var(--rose)] transition-transform group-hover:translate-x-1" />
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* CTA */}
      <section className="container-px mx-auto max-w-[1400px] pb-8 md:pb-14">
        <div className="relative overflow-hidden rounded-[2.5rem] gradient-dark px-8 py-16 text-center text-white noise md:px-16 md:py-20">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-3xl font-medium leading-[1.1] md:text-4xl lg:text-5xl text-balance">
              {ed("finalCta.heading.lead", data.finalCta.heading.lead)} <em className="font-display italic text-[color:var(--rose-soft)]">{ed("finalCta.heading.em", data.finalCta.heading.em)}</em>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Magnetic as="a" href="/#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-glow"><Calendar className="h-4 w-4" /> {data.finalCta.ctas[0]}</Magnetic>
              <Magnetic as="a" href="https://wa.me/919712622288" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white"><MessageCircle className="h-4 w-4" /> {data.finalCta.ctas[1]}</Magnetic>
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

