"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  ArrowRight, Phone, MessageCircle, Calendar, CheckCircle2, Clock, Star,
  Sparkles, ShieldCheck, PlayCircle, MapPin, Stethoscope, Quote, BookOpen,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem, Magnetic } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer, Locations, Calculators, TreatmentCard } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { SectionHead, Faq } from "@/components/ivf-page";
import { MedicalReviewer } from "@/components/medical-reviewer";
import { Linkify } from "@/components/linkify";
import type { Heading, Treatment } from "@/lib/treatments";
import { treatmentCardData, treatmentBySlug } from "@/lib/treatments";
import { resolveIcon } from "@/lib/icon-map";
import type { ResolvedTreatment } from "@/lib/treatment-content";
import type { Doctor } from "@/lib/doctors";
import { doctorsForTreatment, doctorUrl, doctorBySlug } from "@/lib/doctors";
import { blogsForTreatment } from "@/lib/blogs";
import { testimonialsForTreatment } from "@/lib/video-testimonials";
import { destinationHref } from "@/lib/internal-links";

/* ---------- heading renderer (data → SectionHead title) ---------- */
function H({ h }: { h: Heading }) {
  return (
    <>
      {h.lead}
      {h.em ? <> <em className="font-display italic text-[color:var(--rose)]">{h.em}</em></> : null}
    </>
  );
}

/* ---------- lazy YouTube facade ---------- */
function LiteVideo({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[1.5rem] bg-[color:var(--plum)]/5">
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
        <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0 h-full w-full" aria-label={`Play video: ${title}`}>
          <img src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`} alt={title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <span className="absolute inset-0 bg-[color:var(--plum)]/25 transition-colors duration-300 group-hover:bg-[color:var(--plum)]/15" />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[color:var(--rose)] shadow-lift transition-transform duration-300 group-hover:scale-110">
            <PlayCircle className="h-9 w-9" />
          </span>
        </button>
      )}
    </div>
  );
}

/* ---------- reusable doctor card ----------
 * The single source of doctor-card markup, kept visually identical to the
 * original grid card (typography, palette, spacing, radius, badges, CTAs).
 * Reused inside <DoctorCarousel> so there is no duplicate card UI. */
function DoctorCard({ d }: { d: Doctor }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift">
      {/* aspect-[4/5] gives the photo slightly more prominence while staying
          consistent across every card; object-top keeps faces uncropped. */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--rose-soft)]/40">
        <img
          src={d.image} alt={d.name} loading="lazy"
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--rose)] backdrop-blur">
          {d.experienceLabel}
        </div>
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[color:var(--plum)] backdrop-blur">
          <MapPin className="h-3 w-3" /> {d.cities.join(", ")}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-[color:var(--plum)]">
          <a href={doctorUrl(d.slug)} className="transition-colors hover:text-[color:var(--rose)]">{d.name}</a>
        </h3>
        <p className="text-sm text-muted-foreground">{d.credentials} · {d.specialty}</p>
        <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
          <a
            href={doctorUrl(d.slug)}
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
    </article>
  );
}

/* ---------- premium doctor carousel ----------
 * Data-driven, scrollable showcase that scales from 4 to 50+ doctors with no
 * redesign. CSS scroll-snap drives native touch swipe (mobile/tablet); arrows
 * page through on desktop. Responsive cards-per-view:
 *   mobile 1 · tablet 2 · large tablet 3 · desktop 4.
 * Endless loop: when there is more than one screenful, the list is rendered
 * twice and the resting scroll position is kept inside the first run. Because
 * the second run is an identical clone, subtracting one run-width is invisible,
 * so next/prev (and swipe) cycle forever in both directions with no dead end. */
function DoctorCarousel({ docs, label }: { docs: Doctor[]; label: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0..1 scroll position
  const [overflowing, setOverflowing] = useState(false); // do cards exceed the view?
  // Infinite loop only when there is more than one desktop screenful (4 cards).
  const loop = docs.length > 4;

  // Exact pixel offset between a real card and its clone = one full run. Must be
  // measured (not scrollWidth/2, which is off by half the flex gap) so the
  // teleport lands precisely on a card boundary and stays snap-aligned.
  const runOf = useCallback((el: HTMLDivElement) => {
    const card = el.querySelector<HTMLElement>("[data-card]");
    return docs.length * ((card?.offsetWidth ?? 0) + 24); // 24 = gap-6 (1.5rem)
  }, [docs.length]);

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    if (loop) {
      const run = runOf(el); // width of one (un-cloned) run of cards
      setOverflowing(true);
      setProgress(run > 0 ? (el.scrollLeft % run) / run : 0);
    } else {
      const max = el.scrollWidth - el.clientWidth;
      setOverflowing(max > 1);
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    }
  }, [loop]);

  // Keep the resting position inside the first run so the loop never ends.
  // Runs instantly between animations (debounced on settle), never during one.
  const normalize = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || !loop) return;
    const run = runOf(el);
    if (run <= 0) return;
    // Force an instant jump: the scroller has scroll-behavior:smooth, which
    // would otherwise animate a direct scrollLeft change and reveal the seam.
    const prev = el.style.scrollBehavior;
    el.style.scrollBehavior = "auto";
    while (el.scrollLeft >= run) el.scrollLeft -= run; // identical clone → invisible
    while (el.scrollLeft < 0) el.scrollLeft += run;
    el.style.scrollBehavior = prev;
  }, [loop, runOf]);

  useEffect(() => {
    update();
    const el = scrollerRef.current;
    if (!el) return;
    window.addEventListener("resize", update);
    // Debounced settle fires after scrolling (incl. smooth-scroll) stops, so the
    // teleport happens at rest and never interrupts an in-flight animation.
    let t: number | undefined;
    const onScroll = () => {
      update();
      window.clearTimeout(t);
      t = window.setTimeout(normalize, 120);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      el.removeEventListener("scroll", onScroll);
      window.clearTimeout(t);
    };
  }, [update, normalize]);

  const page = useCallback((dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const gap = 24; // gap-6 = 1.5rem
    const step = card ? card.offsetWidth + gap : el.clientWidth;
    if (loop) {
      const run = runOf(el);
      // Going back from the very start would hit the 0 wall — pre-teleport into
      // the clone run (instant, invisible) so there is always room to scroll.
      if (dir === -1 && el.scrollLeft - step < 0) {
        const prev = el.style.scrollBehavior;
        el.style.scrollBehavior = "auto";
        el.scrollLeft += run;
        el.style.scrollBehavior = prev;
      }
      el.scrollBy({ left: dir * step, behavior: "smooth" });
      return;
    }
    // Non-looping: at the end, glide back to the start so autoplay keeps cycling.
    const max = el.scrollWidth - el.clientWidth;
    if (dir === 1 && el.scrollLeft >= max - 2) {
      el.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, [loop, runOf]);

  // Autoplay — advance one card every few seconds. Pauses while the user hovers,
  // touches, or focuses the carousel, and stays off for prefers-reduced-motion.
  const pausedRef = useRef(false);
  useEffect(() => {
    if (!overflowing) return;
    if (typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (pausedRef.current || document.hidden) return;
      page(1);
    }, 4000);
    return () => window.clearInterval(id);
  }, [overflowing, page]);
  const pause = () => { pausedRef.current = true; };
  const resume = () => { pausedRef.current = false; };

  return (
    <div
      className="relative mt-10"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
    >
      {/* Prev / Next — desktop & tablet (mobile uses swipe). Only when the
          cards actually overflow the view, so they never sit dead with ≤4. */}
      {overflowing && (
        <>
          <button
            type="button"
            onClick={() => page(-1)}
            aria-label="Previous specialists"
            className="absolute -left-3 top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-white text-[color:var(--plum)] shadow-lift transition-all hover:text-[color:var(--rose)] hover:shadow-soft active:scale-95 md:flex lg:-left-5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => page(1)}
            aria-label="Next specialists"
            className="absolute -right-3 top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-white text-[color:var(--plum)] shadow-lift transition-all hover:text-[color:var(--rose)] hover:shadow-soft active:scale-95 md:flex lg:-right-5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <div
        ref={scrollerRef}
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        // Centre the cards when they fit (no empty space on the right with ≤4);
        // left-align only when scrollable so the first card is never clipped.
        className={`flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${overflowing ? "justify-start" : "justify-center"}`}
      >
        {docs.map((d) => (
          <div
            key={d.slug}
            data-card
            className="shrink-0 snap-start basis-full sm:[flex-basis:calc((100%-1.5rem)/2)] lg:[flex-basis:calc((100%-3rem)/3)] xl:[flex-basis:calc((100%-4.5rem)/4)]"
          >
            <DoctorCard d={d} />
          </div>
        ))}
        {/* Clone run — powers the seamless loop (identical cards) */}
        {loop && docs.map((d) => (
          <div
            key={`clone-${d.slug}`}
            data-card
            inert
            className="shrink-0 snap-start basis-full sm:[flex-basis:calc((100%-1.5rem)/2)] lg:[flex-basis:calc((100%-3rem)/3)] xl:[flex-basis:calc((100%-4.5rem)/4)]"
          >
            <DoctorCard d={d} />
          </div>
        ))}
      </div>

      {/* Progress track — subtle position indicator (only when scrollable) */}
      {overflowing && (
        <div className="mx-auto mt-5 h-1 w-40 overflow-hidden rounded-full bg-[color:var(--plum)]/10" aria-hidden>
          <div
            className="h-full rounded-full bg-[color:var(--rose)] transition-[width,margin] duration-200"
            style={{ width: "28%", marginLeft: `${progress * 72}%` }}
          />
        </div>
      )}
    </div>
  );
}

/* ---------- CMS content → render-ready Treatment ----------
 * A `ResolvedTreatment` (Wave 4.4) carries icons as serialisable NAMES so it can
 * cross the Server→Client boundary as a prop. Map those names back to the Lucide
 * components the JSX renders — yielding an object structurally identical to a
 * code `Treatment`, so the rest of the template is untouched. */
function toView(c: ResolvedTreatment): Treatment {
  return {
    ...c,
    ...(c.types ? { types: { ...c.types, items: c.types.items.map((x) => ({ icon: resolveIcon(x.icon), t: x.t, d: x.d })) } } : {}),
    process: { ...c.process, steps: c.process.steps.map((s) => ({ icon: resolveIcon(s.icon), n: s.n, t: s.t, d: s.d })) },
    ...(c.technology ? { technology: { ...c.technology, items: c.technology.items.map((x) => ({ icon: resolveIcon(x.icon), t: x.t, d: x.d })) } } : {}),
    ...(c.whyUs ? { whyUs: { ...c.whyUs, items: c.whyUs.items.map((x) => ({ icon: resolveIcon(x.icon), t: x.t, d: x.d })) } } : {}),
  } as Treatment;
}

/* ---------- reusable treatment page ----------
 * Two data sources, byte-identical output:
 *  - `content` (Wave 4.4): a CMS-resolved `ResolvedTreatment` (icons as names) —
 *    used by migrated routes that read through getTreatment().
 *  - `slug` (legacy/code path): resolves the code `Treatment` here, client-side.
 * Keeping lucide icon *components* out of the props (functions aren't
 * serializable) is why the CMS path passes names and re-resolves them in toView.
 * The route still builds JSON-LD + metadata server-side from the same data. */
export function TreatmentPage({ slug, content }: { slug?: string; content?: ResolvedTreatment }) {
  const t = content ? toView(content) : slug ? treatmentBySlug(slug) : undefined;
  if (!t) return null;
  const reviewer = doctorBySlug(t.reviewerSlug);
  const docs = doctorsForTreatment(t.slug);
  const testimonials = testimonialsForTreatment(t.slug);
  const blogs = blogsForTreatment(t.slug, t.shortName);

  /* ---------- render-order zebra ----------
   * Sections are optional, so a hard-coded bg cadence breaks whenever an
   * optional block is absent (two same-tone sections end up adjacent and
   * visually merge). Instead we alternate by *render order*: every band()
   * call advances the stripe, so the ivory ↔ blush rhythm stays correct no
   * matter which optional sections render. ivory (page base) vs rose-soft/40
   * gives a clearly visible partition while staying on-brand; white cards
   * pop on both. Keep new full-width sections on band() — never a fixed bg. */
  let _band = 0;
  const band = () => (_band++ % 2 === 0 ? "bg-[color:var(--ivory)]" : "bg-[color:var(--rose-soft)]/40");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
          <span>/</span>
          <a href="/#treatments" className="hover:text-[color:var(--rose)]">Treatments</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)]">{t.breadcrumbName}</span>
        </nav>
      </div>

      {/* 1. Hero */}
      <section className="gradient-warm noise relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-20 h-[34rem] w-[34rem] rounded-full bg-[color:var(--rose)]/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-[color:var(--plum)]/15 blur-3xl" />
        </div>
        <div className="container-px mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 py-12 md:py-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--rose)]">
                <span className="h-px w-6 bg-[color:var(--rose)]/60" /> {t.hero.eyebrow}
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 text-4xl font-medium leading-[1.05] text-[color:var(--plum)] md:text-5xl lg:text-[3.5rem] text-balance">
                {t.hero.h1} <em className="font-display italic text-[color:var(--rose)]">{t.hero.h1Em}</em>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
                <Linkify text={t.hero.tagline} />
              </p>
            </Reveal>
            {reviewer && (
              <Reveal delay={0.16}>
                <a
                  href={doctorUrl(reviewer.slug)}
                  className="group mt-6 inline-flex items-center gap-3 rounded-full border border-[color:var(--plum)]/10 bg-white/70 py-1.5 pl-1.5 pr-5 shadow-soft backdrop-blur transition-all hover:bg-white"
                >
                  <img
                    src={reviewer.image}
                    alt={reviewer.name}
                    loading="lazy"
                    className="h-11 w-11 shrink-0 rounded-full object-cover object-top ring-2 ring-[color:var(--rose)]/20"
                  />
                  <span className="leading-tight">
                    <span className="block text-sm font-semibold text-[color:var(--plum)] transition-colors group-hover:text-[color:var(--rose)]">
                      {reviewer.name}, {reviewer.credentials}
                    </span>
                    <span className="block text-xs text-muted-foreground">{reviewer.role}</span>
                    <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-[color:var(--rose)]">
                      <MapPin className="h-3 w-3" /> {reviewer.cities[0] ?? "India"} | Bavishi Fertility Institute
                    </span>
                  </span>
                </a>
              </Reveal>
            )}
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Magnetic as="a" href="/#book" className="btn-luxury group inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-soft">
                  <Calendar className="h-4 w-4" /> Book Free Consultation
                </Magnetic>
                <Magnetic as="a" href="https://wa.me/919712622288" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-[color:var(--plum)]/15 bg-white/70 px-6 py-3.5 text-sm font-semibold text-[color:var(--plum)] backdrop-blur transition-all hover:bg-white">
                  <MessageCircle className="h-4 w-4 text-[#25D366]" /> Chat on WhatsApp
                </Magnetic>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[color:var(--plum)]">
                {t.hero.badges.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[color:var(--rose)]" /> {c}</span>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.15}>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-white shadow-lift ring-1 ring-black/5">
                <Image
                  src={t.hero.image}
                  alt={t.hero.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2. What is … */}
      <section className={`${band()} py-8 md:py-14`}>
        <div className="container-px mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
          <div>
            <SectionHead eyebrow={`What is ${t.shortName}`} title={<H h={t.whatIs.heading} />} />
            <div className="mt-6 space-y-5 text-[17px] leading-relaxed text-muted-foreground">
              {t.whatIs.paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.05}><p>{p}</p></Reveal>
              ))}
            </div>
            {reviewer && (
              <div className="mt-8">
                <MedicalReviewer reviewer={reviewer} reviewedOn={t.lastReviewed} />
              </div>
            )}
          </div>
          {t.whatIs.aside && (
            <Reveal delay={0.1}>
              <aside className="rounded-3xl border border-border/70 bg-[color:var(--rose-soft)]/30 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)]">{t.whatIs.aside.title}</div>
                <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--plum)]/90">{t.whatIs.aside.body}</p>
              </aside>
            </Reveal>
          )}
        </div>
      </section>

      {/* 3. Benefits */}
      <section className={`${band()} py-8 md:py-14`}>
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead center eyebrow="Advantages" title={<H h={t.benefits.heading} />} subtitle={t.benefits.subtitle} />
          <Stagger className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.benefits.items.map((item) => (
              <StaggerItem key={item}>
                <div className="flex h-full items-center gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[color:var(--rose)]" />
                  <span className="text-[15px] leading-relaxed text-[color:var(--plum)]/90">{item}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Types (optional) */}
      {t.types && (
        <section className={`${band()} py-8 md:py-14`}>
          <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead center eyebrow={`Types of ${t.shortName}`} title={<H h={t.types.heading} />} subtitle={t.types.subtitle} />
          <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.types.items.map((x) => (
              <StaggerItem key={x.t}>
                <div className="group flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)]"><x.icon className="h-6 w-6" /></div>
                  <h3 className="mt-5 text-lg font-semibold text-[color:var(--plum)]">{x.t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{x.d}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          </div>
        </section>
      )}

      {/* 4. Who needs it */}
      <section className={`${band()} py-8 md:py-14`}>
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead eyebrow="Indications" title={<H h={t.whoNeedsIt.heading} />} subtitle={t.whoNeedsIt.subtitle} />
          <Stagger className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.whoNeedsIt.items.map((item) => (
              <StaggerItem key={item}>
                <div className="flex h-full items-center gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[color:var(--rose)]" />
                  <span className="text-[15px] leading-relaxed text-[color:var(--plum)]/90">{item}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 5. Process */}
      <section className={`${band()} py-8 md:py-14`}>
        <div className="container-px mx-auto max-w-[1400px]">
        <SectionHead center eyebrow="Step by Step" title={<H h={t.process.heading} />} subtitle={t.process.subtitle} />
        <Stagger className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {t.process.steps.map((s) => (
            <StaggerItem key={s.n}>
              <div className="group flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <div className="flex items-center justify-between">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)]"><s.icon className="h-6 w-6" /></div>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--rose)] font-display text-lg font-semibold text-white shadow-sm shadow-[color:var(--rose)]/30 ring-4 ring-[color:var(--rose)]/10">{s.n}</span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-[color:var(--plum)]">{s.t}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        {t.process.note && (
          <Reveal delay={0.1}>
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-[color:var(--rose)]" /> {t.process.note}
            </div>
          </Reveal>
        )}
        </div>
      </section>

      {/* Timeline (optional) */}
      {t.timeline && (
        <section className={`${band()} py-8 md:py-14`}>
          <div className="container-px mx-auto max-w-[1400px]">
            <SectionHead center eyebrow="Treatment Timeline" title={<H h={t.timeline.heading} />} subtitle={t.timeline.subtitle} />
            <Stagger className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {t.timeline.items.map((s, i) => (
                <StaggerItem key={s.t}>
                  <div className="flex h-full flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--rose)]">{s.day}</span>
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--rose)] text-[11px] font-bold text-white">{i + 1}</span>
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-[color:var(--plum)]">{s.t}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{s.d}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            {t.timeline.chips && (
              <Reveal delay={0.1}>
                <div className="mx-auto mt-10 max-w-3xl text-center">
                  {t.timeline.chipsNote && <p className="text-sm text-muted-foreground">{t.timeline.chipsNote}</p>}
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {t.timeline.chips.map((p) => (
                      <span key={p} className="rounded-full border border-border/70 bg-card px-4 py-2 text-xs font-medium text-[color:var(--plum)] shadow-soft">{p}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* Video (optional) */}
      {t.video && (
        <section className={`${band()} py-8 md:py-14`}>
          <div className="container-px mx-auto grid max-w-[1400px] items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <SectionHead eyebrow={t.video.eyebrow} title={<H h={t.video.heading} />} />
              <p className="mt-6 text-[17px] leading-relaxed text-muted-foreground text-pretty">{t.video.description}</p>
            </div>
            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-[2rem] bg-white p-2 shadow-lift ring-1 ring-black/5">
                <LiteVideo id={t.video.id} title={t.video.title} />
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Technology (optional) */}
      {t.technology && (
        <section className={`${band()} py-8 md:py-14`}>
          <div className="container-px mx-auto max-w-[1400px]">
            <SectionHead center eyebrow={t.technology.eyebrow ?? "Technology & Laboratory"} title={<H h={t.technology.heading} />} subtitle={t.technology.subtitle} />
            <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {t.technology.items.map((w) => (
                <StaggerItem key={w.t}>
                  <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-shadow duration-500 hover:shadow-lift">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)]"><w.icon className="h-6 w-6" /></div>
                    <h3 className="mt-5 text-lg font-semibold text-[color:var(--plum)]">{w.t}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{w.d}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Why us (optional) */}
      {t.whyUs && (
        <section className={`${band()} py-8 md:py-14`}>
          <div className="container-px mx-auto max-w-[1400px]">
            <SectionHead center eyebrow="Why Bavishi Fertility Institute" title={<H h={t.whyUs.heading} />} />
            <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {t.whyUs.items.map((w) => (
                <StaggerItem key={w.t}>
                  <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-shadow duration-500 hover:shadow-lift">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)]"><w.icon className="h-6 w-6" /></div>
                    <h3 className="mt-5 text-lg font-semibold text-[color:var(--plum)]">{w.t}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{w.d}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* 6+7. Success factors + 8. Cost */}
      <section className={`${band()} py-8 md:py-14`}>
        <div className="container-px mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-8 shadow-soft">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)]">
                <Star className="h-4 w-4 fill-[color:var(--gold)] text-[color:var(--gold)]" /> Success & Safety
              </div>
              <h3 className="mt-3 text-2xl font-semibold text-[color:var(--plum)]">Real chances, honestly explained</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                Every fertility journey is unique. <strong className="text-[color:var(--plum)]">{t.shortName} success rates</strong> depend on several medical and lifestyle factors.
              </p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-[color:var(--rose)]">Factors affecting success</p>
              <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {t.success.factors.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[14px] text-[color:var(--plum)]/90">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[color:var(--rose)]" /> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-[color:var(--rose-soft)]/40 p-4 text-[14px] leading-relaxed text-[color:var(--plum)]/90">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--rose)]" />
                <span>At Bavishi Fertility Institute, we focus on <strong className="text-[color:var(--plum)]">personalised treatment plans</strong> rather than one-size-fits-all success claims.</span>
              </div>
              {t.success.note && <p className="mt-auto pt-4 text-xs leading-relaxed text-muted-foreground/80">{t.success.note}</p>}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-8 shadow-soft">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)]">
                <ShieldCheck className="h-4 w-4" /> Cost & Assurance
              </div>
              <h3 className="mt-3 text-2xl font-semibold text-[color:var(--plum)]">Transparent, with no hidden costs</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                Know exactly what your <strong className="text-[color:var(--plum)]">{t.shortName} treatment cost</strong> includes before you begin.
              </p>
              <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {t.cost.includes.map((c) => (
                  <li key={c} className="flex items-center gap-2 text-[14px] text-[color:var(--plum)]/90">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[color:var(--rose)]" /> {c}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <Magnetic as="a" href="/#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-5 py-3 text-sm font-semibold text-white shadow-soft">
                  Get a personalised estimate <ArrowRight className="h-4 w-4" />
                </Magnetic>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Risks */}
      <section className={`${band()} py-8 md:py-14`}>
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead center eyebrow="Risks & Considerations" title={<H h={t.risks.heading} />} subtitle={t.risks.subtitle} />
          <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.risks.items.map((r) => (
              <StaggerItem key={r.t}>
                <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft">
                  <h3 className="text-lg font-semibold text-[color:var(--plum)]">{r.t}</h3>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted-foreground">{r.d}</p>
                  <div className="mt-4 flex items-start gap-2 rounded-2xl bg-[color:var(--rose-soft)]/40 p-3.5 text-[13px] leading-relaxed text-[color:var(--plum)]/90">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--rose)]" />
                    <span><strong className="font-semibold text-[color:var(--plum)]">How We Help:</strong> {r.help}</span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Preparation (optional) */}
      {t.preparation && (
        <section className={`${band()} py-8 md:py-14`}>
          <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead center eyebrow="Preparing" title={<H h={t.preparation.heading} />} subtitle={t.preparation.subtitle} />
          <Stagger className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.preparation.items.map((item) => (
              <StaggerItem key={item}>
                <div className="flex h-full items-center gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[color:var(--rose)]" />
                  <span className="text-[15px] leading-relaxed text-[color:var(--plum)]/90">{item}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          </div>
        </section>
      )}

      {/* 9. Doctors — real entity links */}
      {docs.length > 0 && (
        <section className={`${band()} py-8 md:py-14`}>
          <div className="container-px mx-auto max-w-[1400px]">
            <SectionHead
              center
              eyebrow="Our Specialists"
              title={<>Our <em className="font-display italic text-[color:var(--rose)]">{t.shortName}</em> Specialists</>}
              subtitle={`Meet the Bavishi Fertility Institute specialists who treat patients with ${t.shortName}.`}
            />
            <DoctorCarousel docs={docs} label={`${t.shortName} specialists`} />
            <div className="mt-8 text-center">
              <a href="/doctors" className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--plum)] hover:text-[color:var(--rose)]">
                <Stethoscope className="h-4 w-4" /> View all fertility specialists <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* 11. FAQ */}
      <section className={`${band()} py-8 md:py-14`}>
        <div className="container-px mx-auto max-w-3xl">
          <SectionHead center eyebrow="FAQ" title={<>{t.shortName} — <em className="font-display italic text-[color:var(--rose)]">your questions answered</em></>} />
          <div className="mt-9 space-y-3">
            {t.faqs.map((f) => <Faq key={f.q} q={f.q} a={f.a} />)}
          </div>
          {reviewer && (
            <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground/80">
              This page is for educational purposes and is medically reviewed by {reviewer.name}, {reviewer.credentials}. It is not a substitute for personal medical advice — please consult our doctors for guidance specific to you.
            </p>
          )}
        </div>
      </section>

      {/* Video testimonials — treatment-specific patient stories */}
      {testimonials.length > 0 && (
        <section className={`${band()} py-8 md:py-14`}>
          <div className="container-px mx-auto max-w-[1400px]">
            <SectionHead
              center
              eyebrow="Patient Stories"
              title={<>{t.shortName} <em className="font-display italic text-[color:var(--rose)]">success stories</em></>}
              subtitle={`Hear from couples who chose Bavishi Fertility Institute for their ${t.shortName} journey.`}
            />
            <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((v, i) => (
                <StaggerItem key={`${v.name}-${i}`}>
                  <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-all duration-500 hover:shadow-lift">
                    <LiteVideo id={v.youTubeId} title={`${t.shortName} testimonial — ${v.name}`} />
                    <div className="flex flex-1 flex-col p-5">
                      <Quote className="h-5 w-5 text-[color:var(--rose)]/70" />
                      <p className="mt-2 flex-1 text-[15px] leading-relaxed text-[color:var(--plum)]/90">{v.quote}</p>
                      <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-[color:var(--plum)]">
                        {v.name}
                        {v.location && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                            · <MapPin className="h-3 w-3 text-[color:var(--rose)]" /> {v.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Our network — locations (reused) */}
      <div className={band()}><Locations /></div>

      {/* Related treatments — REAL internal links */}
      <section className={`${band()} py-8 md:py-14`}>
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead center eyebrow="Explore More" title={<>Related fertility <em className="font-display italic text-[color:var(--rose)]">treatments & conditions</em></>} />
          <Stagger className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
            {t.related.map((slug) => {
              const c = treatmentCardData(slug);
              return (
                <StaggerItem key={slug}>
                  <TreatmentCard icon={c.icon} title={c.name} desc={c.desc} href={c.href} />
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Related blogs — treatment-specific, data-driven (placeholders until published) */}
      {blogs.length > 0 && (
        <section className={`${band()} py-8 md:py-14`}>
          <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="From Our Blog"
            title={<>Articles related to <em className="font-display italic text-[color:var(--rose)]">{t.shortName}</em></>}
            subtitle={`Helpful reads on ${t.shortName} from the Bavishi Fertility Institute specialists.`}
          />
          <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((b) => (
              <StaggerItem key={b.slug}>
                <a
                  href={b.href}
                  className="group flex h-full flex-col rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--rose)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--rose)]">
                      <BookOpen className="h-3 w-3" /> {b.category}
                    </span>
                    {!b.published && (
                      <span className="rounded-full bg-[color:var(--plum)]/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--plum)]/50">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold leading-snug text-[color:var(--plum)] transition-colors group-hover:text-[color:var(--rose)]">
                    {b.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted-foreground">{b.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--rose)]">
                    Read article
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </a>
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-8 text-center">
            <a href={destinationHref("blog")} className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--plum)] hover:text-[color:var(--rose)]">
              <BookOpen className="h-4 w-4" /> Explore all fertility articles <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          </div>
        </section>
      )}

      {/* Free calculators (reused) */}
      <div className={band()}><Calculators /></div>

      {/* 12. CTA */}
      <section className={`${band()} py-8 md:py-14`}>
        <div className="container-px mx-auto max-w-[1400px]">
        <div className="relative overflow-hidden rounded-[2.5rem] gradient-dark px-8 py-16 text-center text-white noise md:px-16 md:py-20">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-3xl font-medium leading-[1.1] md:text-4xl lg:text-5xl text-balance">
              {t.cta.heading} <em className="font-display italic text-[color:var(--rose-soft)]">{t.cta.headingEm}</em>
            </h2>
          </Reveal>
          {t.cta.subtitle && (
            <Reveal delay={0.1}>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/75">{t.cta.subtitle}</p>
            </Reveal>
          )}
          <Reveal delay={0.2}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Magnetic as="a" href="/#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-glow">
                <Calendar className="h-4 w-4" /> Book Free Consultation
              </Magnetic>
              <Magnetic as="a" href="tel:+919712622288" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white">
                <Phone className="h-4 w-4" /> +91 97126 22288
              </Magnetic>
              <Magnetic as="a" href="https://wa.me/919712622288" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white">
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
