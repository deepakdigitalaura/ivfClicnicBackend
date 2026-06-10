"use client";
import { useState, useEffect, useRef, useMemo, memo, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, MessageCircle, Calendar, PlayCircle, Shield, Sparkles, HeartPulse,
  Stethoscope, Microscope, Baby, Dna, FlaskConical, Activity, MapPin,
  Star, ArrowRight, ChevronDown, Quote, Clock, CheckCircle2,
  Video, BookOpen, Calculator, Mail, User, Send,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const heroImg = "/assets/hero-mother-baby1.png";
const aboutImg = "/assets/about-clinic.jpg";
const drFalguni = "/assets/doctors/falguni.webp";
const drHimanshu = "/assets/doctors/himanshu.webp";
const drJanki = "/assets/doctors/janki.webp";
const drParth = "/assets/doctors/parth.webp";

import {
  Reveal, Stagger, StaggerItem, WordReveal, ParallaxImage, Magnetic,
  Counter, Marquee, ScrollRotate, LiftCard, Float, GradientField,
} from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import type { Review } from "@/lib/reviews";
import { getBrandReviews, BRAND_LISTING_URL } from "@/lib/reviews";
import { useFooter } from "@/components/footer-provider";
import { cityHref } from "@/lib/locations";
import { resolveIcon } from "@/lib/icon-map";
import {
  HOMEPAGE_DEFAULTS,
  DEFAULT_HOME_LAYOUT,
  type HomepageData,
  type HomeSection,
  type HeroContent,
  type SurakshaContent,
  type FinalCtaContent,
  type EduVideo,
  type ResourceVideo,
  type AwardItem,
} from "@/lib/homepage";

/* ---------- Primitives ---------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--rose)]">
      <span className="h-px w-6 bg-[color:var(--rose)]/60" />
      {children}
    </span>
  );
}

function SectionHeader({
  eyebrow, title, subtitle, align = "left",
}: { eyebrow?: string; title: React.ReactNode; subtitle?: string; align?: "left" | "center" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <Reveal><Eyebrow>{eyebrow}</Eyebrow></Reveal>}
      <Reveal delay={0.05}>
        <h2 className="mt-4 text-4xl font-medium leading-[1.05] text-[color:var(--plum)] md:text-5xl lg:text-[3.25rem] text-balance">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.12}>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}

function PrimaryBtn({ children, icon: Icon }: { children: React.ReactNode; icon?: any }) {
  return (
    <Magnetic className="btn-luxury group inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-soft">
      {Icon && <Icon className="h-4 w-4" />}
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
    </Magnetic>
  );
}
function GhostBtn({ children, icon: Icon, href, target }: { children: React.ReactNode; icon?: any; href?: string; target?: string }) {
  return (
    <Magnetic
      {...(href ? { as: "a" as const, href } : {})}
      {...(target ? { target } : {})}
      {...(target === "_blank" ? { rel: "noopener noreferrer" } : {})}
      className="btn-luxury inline-flex items-center gap-2 rounded-full border border-[color:var(--plum)]/15 bg-white/70 px-6 py-3.5 text-sm font-semibold text-[color:var(--plum)] backdrop-blur transition-all hover:bg-white hover:border-[color:var(--plum)]/30"
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </Magnetic>
  );
}

/* ---------- Scroll progress bar ---------- */
/* ---------- Page ---------- */

export function HomePage({ data = HOMEPAGE_DEFAULTS }: { data?: HomepageData } = {}) {
  // Each homepage section, keyed so the CMS `layout` can reorder / hide it. The
  // map holds the exact same element calls as the original fixed sequence, so
  // the default layout renders byte-identically (a Fragment adds no DOM and the
  // key is never serialised to HTML).
  const sections: Record<HomeSection, React.ReactNode> = {
    hero: <Hero hero={data.hero} />,
    stats: <StatsStrip stats={data.stats} />,
    whyBavishi: <WhyBavishiFertilityInstitute content={data.whyBavishi} />,
    suraksha: <Suraksha content={data.suraksha} />,
    treatments: <Treatments />,
    successStories: <SuccessStories stories={data.videos.stories} />,
    videoHub: <VideoHub videos={data.videos.edu} />,
    about: <About />,
    doctors: <Doctors />,
    whyChoose: <WhyChooseBavishiFertilityInstitute content={data.whyChoose} />,
    awards: <AwardsCarousel content={data.awards} />,
    media: <Media />,
    testimonials: <Testimonials />,
    events: <Events content={data.events} />,
    blogs: <Blogs videos={data.videos.resources} />,
    locations: <Locations />,
    faq: <FAQ content={data.faq} />,
    calculators: <Calculators />,
    inquiry: <InquiryForm />,
    finalCta: <FinalCTA content={data.finalCta} />,
  };
  const layout = data.layout?.length ? data.layout : DEFAULT_HOME_LAYOUT;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      {layout.map(({ section, visible }) =>
        visible && sections[section] ? <Fragment key={section}>{sections[section]}</Fragment> : null,
      )}
      <Footer />
      <FloatingCTA />
      <ScrollToTop />
      <MobileBottomBar />
    </div>
  );
}

/* ---------- Hero ---------- */

function Hero({ hero = HOMEPAGE_DEFAULTS.hero }: { hero?: HeroContent } = {}) {
  return (
    <section className="gradient-warm noise relative overflow-hidden">
      <GradientField />
      <div className="container-px mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-14 py-8 md:py-14 lg:grid-cols-12 lg:gap-10 lg:py-28">
        <div className="relative z-10 lg:col-span-7">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Eyebrow>{hero.eyebrow}</Eyebrow>
          </motion.div>

          <WordReveal
            text={hero.headline}
            italicWord={hero.headlineItalic}
            accentClass="italic text-[color:var(--rose)]"
            className="mt-6 text-[2.75rem] font-medium leading-[1.02] text-[color:var(--plum)] sm:text-5xl md:text-6xl lg:text-[4.25rem] text-balance"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl text-pretty"
          >
            {hero.paragraph}
          </motion.p>

          <Stagger className="mt-8 grid max-w-xl grid-cols-2 gap-3" delay={0.8} stagger={0.07}>
            {hero.badges.map((t) => (
              <StaggerItem key={t}>
                <div className="flex items-start gap-2 text-sm font-medium text-[color:var(--plum)]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--rose)]" />
                  {t}
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <PrimaryBtn icon={Calendar}>{hero.ctas[0]}</PrimaryBtn>
            <GhostBtn icon={Sparkles}>{hero.ctas[1]}</GhostBtn>
            <GhostBtn icon={Video}>{hero.ctas[2]}</GhostBtn>
          </motion.div>
        </div>

        <div className="relative lg:col-span-5">
          {/* LCP element: rendered immediately (no opacity/entrance delay) and
              marked priority so Next preloads it — the single biggest LCP win. */}
          <div className="relative">
            <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-gradient-to-br from-[color:var(--rose)]/20 via-transparent to-[color:var(--plum)]/15 blur-2xl" />
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-lift ring-1 ring-black/5">
              <ParallaxImage src={heroImg} alt="Mother holding her newborn baby" ratio="aspect-[4/5]" priority />
            </div>
          </div>

          <Float className="absolute -top-4 right-4 hidden md:block" amplitude={8} delay={0.6}>
            <div className="glass rounded-2xl px-4 py-3 shadow-soft">
              <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--plum)]">
                <Star className="h-4 w-4 fill-[color:var(--gold)] text-[color:var(--gold)]" />
                {hero.floatingBadge}
              </div>
            </div>
          </Float>
        </div>
      </div>
    </section>
  );
}

/* ---------- Stats strip with counters ---------- */
export function StatsStrip({ stats = HOMEPAGE_DEFAULTS.stats }: { stats?: { value: string; l: string }[] } = {}) {
  return (
    <section className="border-y border-border/60 bg-white py-7 md:py-9">
      <Marquee speed={45}>
        {stats.map((s) => (
          <div key={s.l} className="px-6 text-center">
            <div className="whitespace-nowrap font-display text-3xl font-medium leading-[1.05] text-[color:var(--plum)] md:text-4xl">{s.value}</div>
            <div className="mt-1.5 whitespace-nowrap text-sm uppercase tracking-wider text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </Marquee>
    </section>
  );
}

/* ---------- Why Bavishi Fertility Institute ---------- */

function WhyBavishiFertilityInstitute({ content = HOMEPAGE_DEFAULTS.whyBavishi }: { content?: HomepageData["whyBavishi"] } = {}) {
  return (
    <section className="container-px mx-auto max-w-[1400px] py-10 md:py-16">
      <SectionHeader
        eyebrow={content.eyebrow}
        title={<>{content.heading.lead} <em className="text-[color:var(--rose)] not-italic font-display italic">{content.heading.em}</em></>}
        subtitle={content.subtitle}
      />
      <Stagger className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
        {content.cards.map(({ icon, t, d }) => {
          const Icon = resolveIcon(icon);
          return (
          <StaggerItem key={t}>
            <LiftCard className="group h-full rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-shadow duration-500 hover:shadow-lift">
              <Float amplitude={4} duration={6} className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)]">
                <Icon className="h-6 w-6" />
              </Float>
              <h3 className="mt-6 text-xl font-semibold text-[color:var(--plum)]">{t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d}</p>
              <div className="mt-6 inline-flex translate-y-1 items-center gap-1 text-sm font-medium text-[color:var(--rose)] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                Learn more <ArrowRight className="h-4 w-4" />
              </div>
            </LiftCard>
          </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}

/* ---------- Suraksha ---------- */

function Suraksha({ content = HOMEPAGE_DEFAULTS.suraksha }: { content?: SurakshaContent } = {}) {
  return (
    <section id="suraksha" className="relative overflow-hidden bg-[color:var(--plum)] text-white noise scroll-mt-24">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-32 left-1/4 h-[28rem] w-[28rem] rounded-full bg-[color:var(--rose)]/25 blur-3xl"
          animate={{ x: [0, 60, 0], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[color:var(--gold)]/15 blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="container-px relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 py-24 lg:grid-cols-2 lg:py-32">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-white/80">
              <Shield className="h-3.5 w-3.5" /> {content.badge}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 text-4xl font-medium leading-[1.05] md:text-5xl lg:text-[3.25rem] text-balance">
              {content.heading.lead} <em className="font-display italic text-[color:var(--rose-soft)]">{content.heading.em}</em>
            </h2>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 text-pretty">
              {content.paragraph}
            </p>
          </Reveal>
          <Stagger className="mt-8 grid gap-3 sm:grid-cols-2" delay={0.25}>
            {content.features.map((t) => (
              <StaggerItem key={t}>
                <div className="flex items-center gap-2 text-sm text-white/90">
                  <CheckCircle2 className="h-4 w-4 text-[color:var(--rose)]" /> {t}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.4}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Magnetic as="a" href={content.primaryCta.href} className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-soft">
                {content.primaryCta.label} <ArrowRight className="h-4 w-4" />
              </Magnetic>
              <Magnetic as="a" href={content.secondaryCta.href} className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white">
                {content.secondaryCta.label}
              </Magnetic>
            </div>
          </Reveal>
        </div>

        <div className="relative">
          <ScrollRotate className="absolute -inset-10 -z-0 flex items-center justify-center opacity-40" range={60}>
            <div className="h-[28rem] w-[28rem] rounded-full border border-white/15" />
          </ScrollRotate>
          <ScrollRotate className="absolute -inset-4 -z-0 flex items-center justify-center opacity-50" range={-90}>
            <div className="h-[22rem] w-[22rem] rounded-full border border-[color:var(--rose)]/40" />
          </ScrollRotate>

          <Reveal>
            <Float amplitude={8} className="will-change-transform">
              <motion.div
                whileHover={{ scale: 1.015 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-[2rem] bg-[color:var(--ivory)] shadow-lift"
              >
                <ParallaxImage src={content.image} alt={content.imageAlt} ratio="aspect-[5/4]" />
              </motion.div>
            </Float>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
/* ---------- Treatment card (shared design — homepage + centre pages) ----------
 * Single source of the treatment-card UI. When `href` is supplied the whole
 * card becomes a link (and "Learn more" stays a span to keep valid HTML);
 * without `href` it renders exactly as the original homepage card. */
export function TreatmentCard({
  icon: Icon, title, desc, href,
}: { icon: LucideIcon; title: string; desc: string; href?: string }) {
  const body = (
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
  );
  return href ? (
    <a href={href} aria-label={`${title} — learn more`} className="block h-full">{body}</a>
  ) : body;
}

/* ---------- Treatments ---------- */

export function Treatments() {
  const list = [
    { i: Stethoscope, t: "Male Infertility", d: "Comprehensive evaluation and treatment for male factors." },
    { i: HeartPulse, t: "Female Infertility", d: "Personalised pathways for every female fertility concern." },
    { i: Sparkles, t: "Advanced Fertility Techniques", d: "Latest assisted reproduction protocols." },
    { i: Dna, t: "PGT — Genetic Testing", d: "Pre-implantation testing for healthier embryos." },
    { i: Activity, t: "IUI", d: "Intrauterine insemination for select fertility profiles." },
    { i: FlaskConical, t: "IVF / ICSI / ART", d: "Advanced in-vitro fertilisation with ICSI." },
    { i: Microscope, t: "Fertility Preservation", d: "Egg, sperm and embryo freezing for the future." },
    { i: Baby, t: "Sperm Donation", d: "Screened, ethical donor sperm programs." },
    { i: Baby, t: "Egg Donation", d: "Carefully matched egg donor programs." },
    { i: Baby, t: "Embryo Donation", d: "A compassionate path to parenthood." },
    { i: HeartPulse, t: "Fibroids", d: "Diagnosis and fertility-preserving treatment." },
    { i: HeartPulse, t: "Endometriosis", d: "Specialised endometriosis fertility care." },
    { i: Sparkles, t: "Ovarian Rejuvenation", d: "Advanced therapy for diminished ovarian reserve." },
    { i: Activity, t: "High Risk Obstetrics", d: "Expert care for complex pregnancies." },
    { i: Baby, t: "Maternity Services", d: "End-to-end maternity and newborn care." },
  ];
  return (
    <section id="treatments" className="container-px mx-auto max-w-[1400px] py-10 md:py-16">
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <SectionHeader
          eyebrow="Treatments"
          title={<>Fertility care, <em className="font-display italic text-[color:var(--rose)]">complete and considered.</em></>}
          subtitle="Every treatment we offer is delivered with the same standard of clinical excellence and emotional care."
        />
        <Reveal delay={0.1}><GhostBtn icon={ArrowRight}>View All Treatments</GhostBtn></Reveal>
      </div>
      <Stagger className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
        {list.map(({ i: Icon, t, d }) => (
          <StaggerItem key={t}>
            <TreatmentCard icon={Icon} title={t} desc={d} />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/* ---------- YouTube (lazy facade) ---------- */

export function LiteYouTube({ id, title, className = "" }: { id: string; title: string; className?: string }) {
  const [play, setPlay] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-[color:var(--plum)]/5 ${className}`}>
      {play ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlay(true)} aria-label={`Play video: ${title}`} className="group/yt absolute inset-0 h-full w-full">
          <img
            src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
            alt={title} loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover/yt:scale-105"
          />
          <span className="absolute inset-0 bg-[color:var(--plum)]/15 transition-colors duration-300 group-hover/yt:bg-[color:var(--plum)]/5" />
          <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[color:var(--rose)] shadow-lift transition-transform duration-300 group-hover/yt:scale-110">
            <PlayCircle className="h-8 w-8" />
          </span>
        </button>
      )}
    </div>
  );
}

/* ---------- Success Stories (real patient videos) ---------- */

export function SuccessStories({
  stories = HOMEPAGE_DEFAULTS.videos.stories,
  eyebrow = "Success Stories",
  title = <>30,000+ journeys. <em className="font-display italic text-[color:var(--rose)]">One promise kept.</em></>,
  subtitle = "Real stories from real families who began their parenthood journey with us.",
  tone = "white",
  showCta = true,
}: {
  stories?: { id: string; n: string; q: string; r: number }[];
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  tone?: "white" | "tint";
  showCta?: boolean;
} = {}) {
  return (
    <section className={`${tone === "tint" ? "bg-[color:var(--rose-soft)]/40" : "bg-white"} py-10 md:py-16`}>
      <div className="container-px mx-auto max-w-[1400px]">
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <Stagger className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {stories.map((s) => (
            <StaggerItem key={s.n}>
              <motion.article
                whileHover={{ y: -8 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group h-full overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-shadow duration-500 hover:shadow-lift"
              >
                <div className="relative">
                  <LiteYouTube id={s.id} title={`${s.n} — Patient Story`} className="aspect-[4/3]" />
                  <div className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[color:var(--plum)] shadow-soft backdrop-blur">
                    Patient Story
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-1 text-[color:var(--gold)]">
                    {Array.from({ length: s.r }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="mt-4 text-base leading-relaxed text-[color:var(--plum)]/85 text-pretty">"{s.q}"</p>
                  <div className="mt-4 text-sm font-semibold text-[color:var(--plum)]">{s.n}</div>
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </Stagger>
        {showCta && (
          <Reveal delay={0.2}>
            <div className="mt-9 text-center">
              <GhostBtn icon={ArrowRight}>View More Success Stories</GhostBtn>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ---------- Video Hub ---------- */

export function VideoHub({ videos = HOMEPAGE_DEFAULTS.videos.edu }: { videos?: EduVideo[] } = {}) {
  return (
    <section className="container-px mx-auto max-w-[1400px] py-10 md:py-16">
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <SectionHeader
          eyebrow="Education"
          title={<>Learn from the <em className="font-display italic text-[color:var(--rose)]">experts.</em></>}
          subtitle="Clear, trustworthy fertility education from our specialists."
        />
        <Reveal delay={0.1}>
          <GhostBtn icon={Video} href="https://www.youtube.com/@BavishiFertilityInstitute/videos" target="_blank">Watch All Videos</GhostBtn>
        </Reveal>
      </div>
      <Stagger className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {videos.map((v) => (
          <StaggerItem key={v.id}>
            <motion.a
              href={`https://www.youtube.com/watch?v=${v.id}`}
              target="_blank" rel="noopener noreferrer"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.5 }}
              className="group block h-full overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-shadow duration-500 hover:shadow-lift"
            >
              <div className="relative aspect-video overflow-hidden bg-[color:var(--plum)]/5">
                <img
                  src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                  alt={v.t} loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-[color:var(--plum)]/15 transition-colors duration-300 group-hover:bg-[color:var(--plum)]/5" />
                <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[color:var(--rose)] shadow-lift transition-transform duration-300 group-hover:scale-110">
                  <PlayCircle className="h-7 w-7" />
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-base font-semibold leading-snug text-[color:var(--plum)]">{v.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.d}</p>
              </div>
            </motion.a>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/* ---------- About ---------- */

function About() {
  return (
    <section className="bg-[color:var(--rose-soft)]/40 py-10 md:py-16">
      <div className="container-px mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="relative">
          <Reveal>
            <div className="overflow-hidden rounded-[2rem] shadow-lift">
              <ParallaxImage src={aboutImg} alt="Bavishi Fertility Institute" ratio="aspect-[4/5]" />
            </div>
          </Reveal>
          <Float className="absolute -right-6 bottom-10 hidden md:block" amplitude={6}>
            <div className="glass rounded-2xl p-5 shadow-lift">
              <div className="font-display text-3xl font-medium text-[color:var(--plum)]">Since 1983</div>
              <div className="text-xs text-muted-foreground">Pioneering fertility care</div>
            </div>
          </Float>
        </div>
        <div>
          <SectionHeader
            eyebrow="About the Institute"
            title={<>A legacy of <em className="font-display italic text-[color:var(--rose)]">life-changing care.</em></>}
            subtitle="For over four decades, Bavishi Fertility Institute has stood at the forefront of reproductive medicine in India — pioneering IVF, leading clinical research, and building one of the country's most respected fertility networks."
          />
          <Stagger className="mt-8 grid grid-cols-2 gap-6" stagger={0.08}>
            {[
              { k: "Legacy", v: "40+ Years" },
              { k: "Recognition", v: "Award-Winning" },
              { k: "Patient Care", v: "Personalised" },
              { k: "IVF Leadership", v: "India's First" },
            ].map((x) => (
              <StaggerItem key={x.k}>
                <div className="border-l-2 border-[color:var(--rose)]/40 pl-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{x.k}</div>
                  <div className="mt-1 font-display text-xl text-[color:var(--plum)]">{x.v}</div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap gap-3">
              <PrimaryBtn>Read More</PrimaryBtn>
              <GhostBtn>Our Story</GhostBtn>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Doctors ---------- */

export type Doc = { img: string; n: string; deg: string; spec: string; loc: string; exp: string; slug?: string };
const defaultDocs: Doc[] = [
  { img: drHimanshu, n: "Dr. Himanshu Bavishi", deg: "M.D", spec: "Reproductive Medicine & IVF", loc: "Ahmedabad", exp: "35+ yrs", slug: "himanshu-bavishi" },
  { img: drFalguni,  n: "Dr. Falguni Bavishi",  deg: "M.D", spec: "Infertility & Gynaecology", loc: "Ahmedabad", exp: "30+ yrs", slug: "falguni-bavishi" },
  { img: drParth,    n: "Dr. Parth Bavishi",    deg: "M.D", spec: "IVF & Andrology",           loc: "Mumbai",    exp: "15+ yrs", slug: "parth-bavishi" },
  { img: drJanki,    n: "Dr. Janki Bavishi",    deg: "M.S", spec: "Reproductive Surgery",      loc: "Mumbai",    exp: "12+ yrs", slug: "janki-bavishi" },
];
export function Doctors({
  docs = defaultDocs,
  eyebrow = "Meet the Specialists",
  title = <>Meet Our <em className="font-display italic text-[color:var(--rose)]">Promoter Doctors.</em></>,
  subtitle = "A family of fertility experts trusted by generations.",
}: { docs?: Doc[]; eyebrow?: string; title?: React.ReactNode; subtitle?: string } = {}) {
  return (
    <section id="doctors" className="container-px mx-auto max-w-[1400px] py-10 md:py-16">
      <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
        {docs.map((d) => (
          <StaggerItem key={d.n}>
            <motion.article
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="group h-full overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-shadow duration-500 hover:shadow-lift"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[color:var(--rose-soft)]/40">
                <motion.img
                  src={d.img} alt={d.n} loading="lazy"
                  className="h-full w-full object-cover object-top"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
                {d.exp && (
                  <motion.div
                    className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--rose)] backdrop-blur"
                    initial={{ opacity: 0, y: -8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    {d.exp}
                  </motion.div>
                )}
                <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[color:var(--plum)] backdrop-blur">
                  <MapPin className="h-3 w-3" /> {d.loc}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-[color:var(--plum)]">
                  {d.slug ? (
                    <a href={`/doctors/${d.slug}`} className="transition-colors hover:text-[color:var(--rose)]">{d.n}</a>
                  ) : d.n}
                </h3>
                <p className="text-sm text-muted-foreground">{[d.deg, d.spec].filter(Boolean).join(" · ")}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <a
                    href={d.slug ? `/doctors/${d.slug}` : "/doctors"}
                    className="group/btn inline-flex items-center justify-center gap-1.5 rounded-full border border-[color:var(--plum)]/15 px-3 py-2 text-xs font-semibold text-[color:var(--plum)] transition-all duration-300 hover:border-[color:var(--plum)]/30 hover:bg-[color:var(--plum)]/5 active:scale-[0.97]"
                  >
                    View Profile
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                  </a>
                  <a
                    href="/#book"
                    className="group/btn inline-flex items-center justify-center gap-1.5 rounded-full bg-[color:var(--rose)] px-3 py-2 text-xs font-semibold text-white shadow-sm shadow-[color:var(--rose)]/20 transition-all duration-300 hover:bg-[color:var(--rose)]/90 hover:shadow-md hover:shadow-[color:var(--rose)]/30 active:scale-[0.97]"
                  >
                    <Calendar className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover/btn:-translate-y-0.5" />
                    Book Consultation
                  </a>
                </div>
              </div>
            </motion.article>
          </StaggerItem>
        ))}
      </Stagger>
      <Reveal delay={0.2}>
        <div className="mt-9 text-center">
          <Magnetic as="a" href="/doctors" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-soft">
            View All Doctors <ArrowRight className="h-4 w-4" />
          </Magnetic>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Why Choose Bavishi Fertility Institute (icon-led pillars) ---------- */

function WhyChooseBavishiFertilityInstitute({ content = HOMEPAGE_DEFAULTS.whyChoose }: { content?: HomepageData["whyChoose"] } = {}) {
  return (
    <section className="bg-[color:var(--rose-soft)]/40 py-10 md:py-16">
      <div className="container-px mx-auto max-w-[1400px]">
      <SectionHeader
        eyebrow={content.eyebrow}
        title={<>{content.heading.lead} <em className="font-display italic text-[color:var(--rose)]">{content.heading.em}</em></>}
        subtitle={content.subtitle}
        align="center"
      />
      <Stagger className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2" stagger={0.08}>
        {content.blocks.map((b) => (
          <StaggerItem key={b.title} className="h-full">
            <motion.article
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-shadow duration-500 hover:shadow-lift md:p-8"
            >
              <div className="flex items-center gap-4">
                <div className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--rose)]/[0.08]">
                  <img src={b.icon} alt={b.alt} loading="lazy" className="h-9 w-9 object-contain" />
                </div>
                <h3 className="text-xl font-semibold leading-tight text-[color:var(--plum)]">
                  <span className="font-display italic text-[color:var(--rose)]">{b.title}</span>
                  <span className="mt-0.5 block text-sm font-medium text-muted-foreground">{b.subtitle}</span>
                </h3>
              </div>
              <ul className="mt-6 space-y-3.5">
                {b.points.map((p) => (
                  <li key={p.h} className="flex gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--rose)]" />
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <span className="font-semibold text-[color:var(--plum)]">{p.h}</span> – {p.d}
                    </p>
                  </li>
                ))}
              </ul>
            </motion.article>
          </StaggerItem>
        ))}
      </Stagger>
      </div>
    </section>
  );
}

/* ---------- Awards & Achievements (carousel) ---------- */

// A single award card. Memoized + keyed so its <img> never reloads between
// slide changes — only the cheap transform values (x/scale/opacity) update.
const AwardCard = memo(function AwardCard({ a }: { a: AwardItem }) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
      {/* Full rectangular award image — fills the card edge-to-edge */}
      <div className="aspect-video w-full overflow-hidden bg-white">
        <img src={a.img} alt={a.title} loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="border-t border-border/60 px-5 py-4 text-center">
        <h3 className="text-base font-semibold leading-snug text-[color:var(--plum)] md:text-lg">{a.title}</h3>
        {a.desc && <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>}
      </div>
    </div>
  );
});

// Only this inner component holds the rotating state, so slide changes never
// re-render the section header or CTA — just the transform-animated cards.
function AwardsStage({ items }: { items: AwardItem[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(300);
  const startX = useRef(0);

  // Repeat the awards so there are always enough off-stage "buffer" cards for a
  // seamless infinite loop (a 3-item loop would otherwise teleport across centre).
  const dotCount = items.length;
  const slides = useMemo(
    () =>
      dotCount < 5
        ? Array.from({ length: Math.ceil(6 / dotCount) }, () => items).flat()
        : items,
    [items, dotCount],
  );
  const L = slides.length;

  useEffect(() => {
    const measure = () => {
      const w = wrapRef.current?.offsetWidth ?? 0;
      setShift(Math.min(Math.max(w * 0.34, 150), 360));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % L), 3800);
    return () => window.clearInterval(id);
  }, [paused, L]);

  const go = (dir: number) => setActive((a) => (a + dir + L) % L);
  const relPos = (i: number) => {
    let d = i - active;
    if (d > L / 2) d -= L;
    if (d < -L / 2) d += L;
    return d;
  };

  const activeDot = ((active % dotCount) + dotCount) % dotCount;
  const goToDot = (i: number) =>
    setActive((a) => a - (((a % dotCount) + dotCount) % dotCount) + i);

  return (
    <>
      <div
        ref={wrapRef}
        className="relative mx-auto mt-10 flex h-[360px] max-w-5xl items-center justify-center overflow-hidden md:h-[400px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(e) => { setPaused(true); startX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - startX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          setPaused(false);
        }}
      >
        {slides.map((a, i) => {
          const p = relPos(i);
          const visible = Math.abs(p) <= 1;
          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(280px,82vw,400px)] select-none"
              style={{ zIndex: p === 0 ? 30 : 20 - Math.abs(p), pointerEvents: visible ? "auto" : "none" }}
              aria-hidden={p !== 0}
            >
              <motion.div
                initial={false}
                animate={{
                  x: p * shift,
                  scale: p === 0 ? 1 : 0.86,
                  opacity: visible ? (p === 0 ? 1 : 0.55) : 0,
                }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <AwardCard a={a} />
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div className="mt-8 flex justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goToDot(i)}
            aria-label={`Go to award ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${i === activeDot ? "w-6 bg-[color:var(--rose)]" : "w-2 bg-[color:var(--plum)]/20 hover:bg-[color:var(--plum)]/40"}`}
          />
        ))}
      </div>
    </>
  );
}

export function AwardsCarousel({ content = HOMEPAGE_DEFAULTS.awards }: { content?: HomepageData["awards"] } = {}) {
  return (
    <section className="bg-white py-10 md:py-16">
      <div className="container-px mx-auto max-w-[1400px]">
        <SectionHeader
          eyebrow={content.eyebrow}
          title={<>{content.heading.lead} <em className="font-display italic text-[color:var(--rose)]">{content.heading.em}</em></>}
          subtitle={content.subtitle}
          align="center"
        />

        <AwardsStage items={content.items} />

        {/* CTA */}
        <div className="mt-10 text-center">
          <Magnetic as="a" href="#awards" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-soft">
            View More <ArrowRight className="h-4 w-4" />
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

/* ---------- Media ---------- */

function Media() {
  const logos = [
    { src: "/assets/media/news-gujarati.png", alt: "News18 Gujarati" },
    { src: "/assets/media/sandesh-tv.png", alt: "Sandesh News" },
    { src: "/assets/media/my-fm.png", alt: "MY FM" },
  ];
  const loop = [...logos, ...logos, ...logos, ...logos];
  return (
    <section className="container-px mx-auto max-w-[1400px] py-20">
      <SectionHeader
        eyebrow="As Featured In"
        title={<>Media coverage <em className="font-display italic text-[color:var(--rose)]">across India.</em></>}
        align="center"
      />
      <Reveal delay={0.15}>
        <div className="mt-10">
          <Marquee speed={28}>
            {loop.map((l, i) => (
              <div key={i} className="flex h-20 w-44 items-center justify-center rounded-xl border border-border/70 bg-card px-6 shadow-soft">
                <img src={l.src} alt={l.alt} loading="lazy" className="max-h-12 w-auto object-contain transition-transform duration-300 hover:scale-105" />
              </div>
            ))}
          </Marquee>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Testimonials (verified cached reviews only — NO fabricated data) ----------
 * Driven by the same review service as the location pages (local cache synced
 * from the review API by scripts/sync-reviews.mjs). Real reviews render once the
 * "brand" source is configured; until then the section shows an honest
 * "Read reviews" link — never invented names, quotes or stars. */

export type Testimonial = { n: string; r: number; q: string };

function ReviewTestimonialCard({ r, verified }: { r: Review; verified: boolean }) {
  return (
    <blockquote className="flex h-full min-h-[300px] flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft md:p-8">
      <div className="flex items-center justify-between">
        <Quote className="h-7 w-7 text-[color:var(--rose)]/50" />
        <div className="flex text-[color:var(--gold)]">
          {Array.from({ length: Math.round(r.rating) }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
        </div>
      </div>
      <p className="mt-4 line-clamp-6 flex-1 text-[15px] leading-relaxed text-[color:var(--plum)]/90 text-pretty">"{r.text}"</p>
      <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--rose)]/10 text-sm font-semibold text-[color:var(--rose)]">
          {r.author.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-semibold text-[color:var(--plum)]">{r.author}</div>
          <div className="text-xs text-muted-foreground">{verified ? "Google review" : "Patient review"}{r.relativeTime ? ` · ${r.relativeTime}` : ""}</div>
        </div>
      </div>
    </blockquote>
  );
}

export function Testimonials({
  eyebrow = "Testimonials",
  title = <>Words from <em className="font-display italic text-[color:var(--rose)]">our families.</em></>,
}: { eyebrow?: string; title?: React.ReactNode } = {}) {
  const data = getBrandReviews();
  const reviews: Review[] = data?.reviews ?? [];
  const verified = !!data?.verified;
  const aggregate = verified ? data?.aggregate : undefined; // rating badge only for real data
  const listingUrl = data?.mapsUrl ?? BRAND_LISTING_URL;

  const reviewPages = Array.from(
    { length: Math.max(1, Math.ceil(reviews.length / 3)) },
    (_, p) => reviews.slice(p * 3, p * 3 + 3),
  );
  const pages = reviewPages.length;
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || reviews.length === 0) return;
    const id = window.setInterval(() => setPage((p) => (p + 1) % pages), 5500);
    return () => window.clearInterval(id);
  }, [paused, pages, reviews.length]);

  // No verified reviews yet → honest CTA, never fabricated testimonial cards.
  if (reviews.length === 0) {
    return (
      <section className="bg-[color:var(--rose-soft)]/40 py-10 md:py-16">
        <div className="container-px mx-auto max-w-[1400px] text-center">
          <SectionHeader eyebrow={eyebrow} title={title} align="center" />
          <Reveal delay={0.1}>
            <div className="mt-8 flex justify-center">
              <a
                href={listingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[color:var(--plum)] shadow-soft ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <Star className="h-4 w-4 fill-[color:var(--gold)] text-[color:var(--gold)]" /> Read our reviews on Google
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[color:var(--rose-soft)]/40 py-10 md:py-16">
      <div className="container-px mx-auto max-w-[1400px]">
        <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:items-end md:text-left">
          <SectionHeader eyebrow={eyebrow} title={title} />
          {aggregate && (
            <Reveal delay={0.1}>
              <a href={listingUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-full bg-white px-5 py-3 shadow-soft">
                <Star className="h-4 w-4 fill-[color:var(--gold)] text-[color:var(--gold)]" />
                <span className="text-sm font-semibold text-[color:var(--plum)]">{aggregate.ratingValue.toFixed(1)} on Google · {aggregate.reviewCount.toLocaleString()} reviews</span>
              </a>
            </Reveal>
          )}
        </div>

        <div className="mt-10" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {reviewPages[page].map((r, i) => (
                  <ReviewTestimonialCard key={`${r.author}-${i}`} r={r} verified={verified} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {pages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {reviewPages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i)}
                  aria-label={`Go to reviews page ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${i === page ? "w-6 bg-[color:var(--rose)]" : "w-2 bg-[color:var(--plum)]/20 hover:bg-[color:var(--plum)]/40"}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- Events ---------- */

function Events({ content = HOMEPAGE_DEFAULTS.events }: { content?: HomepageData["events"] } = {}) {
  return (
    <section className="container-px mx-auto max-w-[1400px] py-10 md:py-16">
      <SectionHeader
        eyebrow={content.eyebrow}
        title={<>{content.heading.lead} <em className="font-display italic text-[color:var(--rose)]">{content.heading.em}</em></>}
        align="center"
      />
      <Stagger className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        {content.posters.map((e) => (
          <StaggerItem key={e.src}>
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-shadow duration-500 hover:shadow-lift"
            >
              <img src={e.src} alt={e.alt} loading="lazy" className="aspect-[4/5] w-full object-cover" />
            </motion.div>
          </StaggerItem>
        ))}
      </Stagger>
      <Reveal delay={0.2}>
        <div className="mt-9 text-center">
          <Magnetic as="a" href="#contact" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-soft">
            View More Events <ArrowRight className="h-4 w-4" />
          </Magnetic>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Blogs ---------- */

function Blogs({ videos = HOMEPAGE_DEFAULTS.videos.resources }: { videos?: ResourceVideo[] } = {}) {
  return (
    <section id="resources" className="bg-white py-10 md:py-16">
      <div className="container-px mx-auto max-w-[1400px]">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="Knowledge & Resources"
            title={<>Knowledge, <em className="font-display italic text-[color:var(--rose)]">beautifully explained.</em></>}
          />
          <Reveal delay={0.1}>
            <GhostBtn icon={BookOpen} href="https://www.youtube.com/@BavishiFertilityInstitute/videos" target="_blank">Explore Resources</GhostBtn>
          </Reveal>
        </div>
        <Stagger className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {videos.map((p) => (
            <StaggerItem key={p.id}>
              <motion.a
                href={`https://www.youtube.com/watch?v=${p.id}`}
                target="_blank" rel="noopener noreferrer"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.5 }}
                className="group block h-full overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-shadow duration-500 hover:shadow-lift"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[color:var(--plum)]/5">
                  <img
                    src={`https://img.youtube.com/vi/${p.id}/hqdefault.jpg`}
                    alt={p.t} loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-[color:var(--plum)]/15 transition-colors duration-300 group-hover:bg-[color:var(--plum)]/5" />
                  <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[color:var(--rose)] shadow-lift transition-transform duration-300 group-hover:scale-110">
                    <PlayCircle className="h-7 w-7" />
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="rounded-full bg-[color:var(--rose)]/10 px-2.5 py-1 font-semibold text-[color:var(--rose)]">{p.c}</span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Video className="h-3 w-3" /> {p.date}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold leading-snug text-[color:var(--plum)] text-pretty">{p.t}</h3>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--rose)]">
                    Watch on YouTube <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                  </span>
                </div>
              </motion.a>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ---------- Locations ---------- */

export function Locations() {
  const cities = [
    { c: "Ahmedabad", n: 3, s: "ahmedabad" }, { c: "Mumbai", n: 5, s: "mumbai" }, { c: "Vadodara", n: 1, s: "vadodara" },
    { c: "Surat", n: 1, s: "surat" }, { c: "Bhuj", n: 1, s: "bhuj" }, { c: "Bhavnagar", n: 1, s: "bhavnagar" },
    { c: "Anand", n: 1, s: "anand" }, { c: "Varanasi", n: 1, s: "varanasi" },
  ];
  return (
    <section id="locations" className="container-px mx-auto max-w-[1400px] py-10 md:py-16">
      <SectionHeader
        eyebrow="Our Locations"
        title={<>Find a Bavishi Fertility Institute Centre <em className="font-display italic text-[color:var(--rose)]">near you.</em></>}
        subtitle="15 centres across 8 cities — premium fertility care, close to home wherever you are."
      />
      <Stagger className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" stagger={0.05}>
        {cities.map((c) => (
          <StaggerItem key={c.c}>
            <motion.a
              href={cityHref(c.s) ?? `/locations/${c.s}`}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4 }}
              className="group block h-full rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition-shadow duration-500 hover:shadow-lift"
            >
              <MapPin className="h-5 w-5 text-[color:var(--rose)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110" />
              <h3 className="mt-4 text-xl font-semibold text-[color:var(--plum)]">{c.c}</h3>
              <p className="text-sm text-muted-foreground">{c.n} {c.n > 1 ? "centres" : "centre"}</p>
              <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--rose)]">
                View Centre <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
              </div>
            </motion.a>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/* ---------- FAQ ---------- */

function FAQ({ content = HOMEPAGE_DEFAULTS.faq }: { content?: HomepageData["faq"] } = {}) {
  const faqs = content.items;
  const [open, setOpen] = useState<Set<number>>(new Set([0]));
  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };
  return (
    <section id="faq" className="bg-white py-10 md:py-16">
      <div className="container-px mx-auto max-w-3xl">
        <SectionHeader
          eyebrow={content.eyebrow}
          title={<>{content.heading.lead} <em className="font-display italic text-[color:var(--rose)]">{content.heading.em}</em></>}
          align="center"
        />
        <div className="mt-10 divide-y divide-border rounded-3xl border border-border/70 bg-card shadow-soft">
          {faqs.map((f, i) => {
            const isOpen = open.has(i);
            return (
              <div key={f.q} className="px-6">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-base font-semibold text-[color:var(--plum)] md:text-lg">{f.q}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-[color:var(--rose)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-200 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 text-sm leading-relaxed text-muted-foreground md:text-base">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Calculators ---------- */

export function Calculators() {
  const calcs = [
    "IVF Success Rate Calculator",
    "Fertile Period Calculator",
    "Risk of Repeat Miscarriage Calculator",
    "Natural Pregnancy Calculator",
    "IVF Cost Calculator",
    "AMH Level Interpreter",
    "Ovulation Calculator",
    "Semen Analysis Calculator",
  ];
  return (
    <section id="tools" className="container-px mx-auto max-w-[1400px] py-10 md:py-16">
      <SectionHeader
        eyebrow="Fertility Tools"
        title={<>Free calculators by <em className="font-display italic text-[color:var(--rose)]">our experts.</em></>}
        subtitle="Practical, science-backed tools to help you understand your fertility — privately and instantly."
      />
      <Stagger className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.05}>
        {calcs.map((c) => (
          <StaggerItem key={c}>
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4 }}
              className="group h-full rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition-shadow duration-500 hover:shadow-lift"
            >
              <Float amplitude={4} className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--rose-soft)] text-[color:var(--rose)]">
                <Calculator className="h-5 w-5" />
              </Float>
              <h3 className="mt-5 text-base font-semibold leading-snug text-[color:var(--plum)] text-pretty">{c}</h3>
              <a className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--rose)]">
                Use Calculator <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
              </a>
            </motion.div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/* ---------- Final CTA ---------- */

/* ---------- Inquiry Form ---------- */

const inquiryTreatments = [
  "IVF / ICSI", "IUI", "Male Infertility", "Female Infertility",
  "Donor Services", "Fertility Preservation", "Maternity Services", "Not sure yet",
];
const inquiryLocations = [
  "Ahmedabad", "Mumbai", "Surat", "Vadodara", "Bhuj", "Bhavnagar", "Anand", "Varanasi",
];

export function InquiryForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", treatment: "", location: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Please enter your name";
    if (!/^[+\d][\d\s-]{7,}$/.test(form.phone.trim())) next.phone = "Enter a valid phone number";
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) next.email = "Enter a valid email";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      // No backend wired yet — surface success; replace with an API/WhatsApp post when available.
      setSubmitted(true);
    }
  };

  const fieldCls = (k: string) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-[color:var(--plum)] outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-[color:var(--rose)]/20 ${errors[k] ? "border-[color:var(--rose)]" : "border-border focus:border-[color:var(--rose)]"}`;

  return (
    <section id="book" className="bg-[color:var(--rose-soft)]/40 py-10 md:py-16">
      <div className="container-px mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left — info */}
        <div>
          <SectionHeader
            eyebrow="Book an Appointment"
            title={<>Start your <em className="font-display italic text-[color:var(--rose)]">parenthood journey.</em></>}
            subtitle="Share a few details and our fertility counsellor will call you back — confidential, compassionate and complimentary."
          />
          <div className="mt-8 space-y-4">
            {[
              { icon: Phone, h: "Call us", d: "+91 97126 22288" },
              { icon: MessageCircle, h: "WhatsApp", d: "Chat with our team 24×7" },
              { icon: Clock, h: "Response time", d: "We typically respond within 30 minutes" },
            ].map((x) => (
              <div key={x.h} className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--rose)]/10 text-[color:var(--rose)]">
                  <x.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[color:var(--plum)]">{x.h}</div>
                  <div className="text-sm text-muted-foreground">{x.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form card */}
        <Reveal delay={0.1}>
          <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-lift md:p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--rose)]/10 text-[color:var(--rose)]">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-[color:var(--plum)]">Thank you, {form.name.split(" ")[0]}!</h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Your inquiry has been received. Our fertility counsellor will reach out to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", email: "", treatment: "", location: "", message: "" }); }}
                  className="mt-6 text-sm font-semibold text-[color:var(--rose)] hover:underline"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="if-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">Full Name *</label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input id="if-name" type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" className={`${fieldCls("name")} pl-10`} />
                    </div>
                    {errors.name && <p className="mt-1 text-xs text-[color:var(--rose)]">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="if-phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">Phone *</label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input id="if-phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 00000 00000" className={`${fieldCls("phone")} pl-10`} />
                    </div>
                    {errors.phone && <p className="mt-1 text-xs text-[color:var(--rose)]">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="if-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">Email</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input id="if-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" className={`${fieldCls("email")} pl-10`} />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-[color:var(--rose)]">{errors.email}</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="if-treatment" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">Treatment of Interest</label>
                    <select id="if-treatment" value={form.treatment} onChange={(e) => set("treatment", e.target.value)} className={`${fieldCls("treatment")} appearance-none`}>
                      <option value="">Select an option</option>
                      {inquiryTreatments.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="if-location" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">Preferred Centre</label>
                    <select id="if-location" value={form.location} onChange={(e) => set("location", e.target.value)} className={`${fieldCls("location")} appearance-none`}>
                      <option value="">Select a centre</option>
                      {inquiryLocations.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="if-message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">Message</label>
                  <textarea id="if-message" rows={3} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Tell us briefly how we can help…" className={`${fieldCls("message")} resize-none`} />
                </div>

                <button type="submit" className="btn-luxury inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-110">
                  <Send className="h-4 w-4" /> Request a Callback
                </button>
                <p className="text-center text-xs text-muted-foreground">
                  Your details are kept strictly confidential. We never share your information.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCTA({ content = HOMEPAGE_DEFAULTS.finalCta }: { content?: FinalCtaContent } = {}) {
  const ctaIcons = [Calendar, MessageCircle, Phone];
  return (
    <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
      <div className="relative overflow-hidden rounded-[2.5rem] gradient-dark px-8 py-20 text-center text-white noise md:px-16 md:py-28">
        <motion.div
          className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[color:var(--rose)]/40 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-[color:var(--gold)]/30 blur-3xl"
          animate={{ x: [0, -30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative">
          <Reveal><Eyebrow>{content.eyebrow}</Eyebrow></Reveal>
          <Reveal delay={0.1}>
            <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-medium leading-[1.05] md:text-5xl lg:text-6xl text-balance">
              {content.heading.lead} <em className="font-display italic text-[color:var(--rose-soft)]">{content.heading.em}</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/75">
              {content.paragraph}
            </p>
          </Reveal>

          <Stagger className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-6" delay={0.3}>
            {content.stats.map((x) => (
              <StaggerItem key={x.l} className="text-center">
                <div className="font-display text-3xl font-medium md:text-4xl">
                  <Counter to={x.v} suffix={x.s} />
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-white/60">{x.l}</div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.5}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {content.ctas.map((label, i) => {
                const Icon = ctaIcons[i] ?? Calendar;
                const cls =
                  i === 0
                    ? "btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-glow"
                    : "btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white";
                return (
                  <Magnetic key={label} className={cls}>
                    <Icon className="h-4 w-4" /> {label}
                  </Magnetic>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */

// Footer content is CMS-managed via the `footer` global (Phase 3.5B, Item 3):
// the root layout resolves it (getFooter) and passes it through FooterProvider;
// here we read it with useFooter(), which falls back to FOOTER_DEFAULTS so the
// markup is byte-identical when the CMS is empty. Contact links resolve their
// href from Site Settings (no duplicated numbers). Nothing about the HTML
// structure / classes / hierarchy changed — only the data source.
export function Footer() {
  const { groups, copyrightText, legal } = useFooter();
  return (
    <footer id="contact" className="border-t border-border bg-[color:var(--ivory)]">
      <div className="container-px mx-auto max-w-[1400px] pt-20 pb-24 md:pb-8">
        {/* Sitemap grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {groups.map((c) => (
            <div key={c.h}>
              <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[color:var(--plum)]">{c.h}</h4>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                {c.l.map((x) => (
                  <li key={x.label}>
                    {x.href ? (
                      <a
                        href={x.href}
                        {...(x.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="transition-colors hover:text-[color:var(--rose)]"
                      >
                        {x.label}
                      </a>
                    ) : (
                      <span className="cursor-default text-muted-foreground/70">{x.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} {copyrightText}</div>
          <div className="flex flex-wrap items-center justify-center gap-5">
            {legal.map((x) => (
              <a
                key={x.label}
                href={x.href ?? "#"}
                {...(x.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="hover:text-[color:var(--rose)]"
              >
                {x.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
