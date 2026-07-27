"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop, useBodyLock } from "@/components/conversion";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PRESS_CLIPPINGS, pressPublications, type PressClipping } from "@/lib/press";

const ALL = "All coverage";

export function PressPage({ clippings = PRESS_CLIPPINGS }: { clippings?: PressClipping[] }) {
  const [filter, setFilter] = React.useState<string>(ALL);
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const publications = React.useMemo(
    () => [ALL, ...new Set(clippings.map((c) => c.publication))],
    [clippings],
  );
  const shown = React.useMemo(
    () => (filter === ALL ? clippings : clippings.filter((c) => c.publication === filter)),
    [clippings, filter],
  );

  // Filtering changes what index N points at, so never keep a stale lightbox open.
  React.useEffect(() => setOpenIndex(null), [filter]);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="bg-[color:var(--rose-soft)]/40 py-14 md:py-20">
          <div className="container-px mx-auto max-w-[1400px]">
            <Reveal>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[color:var(--rose)]">
                <Newspaper className="h-3.5 w-3.5" />
                Media &amp; Press
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="font-display text-4xl font-bold leading-tight text-[color:var(--plum)] md:text-5xl lg:text-6xl">
                Bavishi Fertility Institute{" "}
                <em className="font-display italic text-[color:var(--rose)]">in the news.</em>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 max-w-2xl text-lg text-[color:var(--plum)]/70">
                Our specialists are regularly consulted by national and regional press on
                fertility, IVF and reproductive law. Below are scans of the printed coverage —
                tap any clipping to read it full size.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Filter */}
        <section className="container-px mx-auto max-w-[1400px] pt-10 md:pt-14">
          <Reveal>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter coverage by publication">
              {publications.map((p) => {
                const active = p === filter;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFilter(p)}
                    aria-pressed={active}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                      active
                        ? "border-[color:var(--rose)] bg-[color:var(--rose)] text-white"
                        : "border-border/70 bg-card text-[color:var(--plum)]/70 hover:border-[color:var(--rose)]/40 hover:text-[color:var(--plum)]"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </Reveal>
        </section>

        {/* Clipping wall */}
        <section className="container-px mx-auto max-w-[1400px] py-10 md:py-14">
          {/* CSS columns give the wall its newspaper feel across mixed portrait /
              landscape scans. StaggerItem is the direct column child, so the
              break-avoid + gutter live there rather than on the card. */}
          <Stagger key={filter} className="columns-1 gap-6 sm:columns-2 lg:columns-3">
            {shown.map((c, i) => (
              <StaggerItem key={c.slug} className="mb-6 break-inside-avoid">
                <ClippingCard clipping={c} onOpen={() => setOpenIndex(i)} eager={i < 3} />
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* Press enquiries */}
        <section className="bg-[color:var(--plum)]/4 py-12 md:py-16">
          <div className="container-px mx-auto max-w-[1400px] text-center">
            <Reveal>
              <h2 className="font-display text-2xl font-bold text-[color:var(--plum)] md:text-3xl">
                Press &amp; media{" "}
                <em className="font-display italic text-[color:var(--rose)]">enquiries.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-4 max-w-2xl text-[color:var(--plum)]/70">
                Journalists looking for expert comment on fertility, IVF or reproductive health
                are welcome to get in touch — our specialists are available for interviews and
                background briefings.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <a
                href="/contact"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition-transform duration-300 hover:scale-[1.03]"
              >
                Contact our team
              </a>
            </Reveal>
          </div>
        </section>
      </main>

      <Lightbox
        clippings={shown}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />

      <Footer />
      <FloatingCTA />
      <MobileBottomBar />
      <ScrollToTop />
    </>
  );
}

/* ---------- Card ---------- */

function ClippingCard({
  clipping: c,
  onOpen,
  eager,
}: {
  clipping: PressClipping;
  onOpen: () => void;
  eager: boolean;
}) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5 }}
      className="break-inside-avoid overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-shadow duration-500 hover:shadow-lift"
    >
      <button
        type="button"
        onClick={onOpen}
        className="group block w-full text-left"
        aria-label={`Open full-size clipping: ${c.headline}, ${c.publication}`}
      >
        <div className="relative overflow-hidden bg-white">
          <img
            src={c.thumb}
            alt={`${c.publication} clipping — ${c.headline}`}
            width={c.width}
            height={c.height}
            loading={eager ? "eager" : "lazy"}
            className="w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--plum)]/75 px-3 py-1.5 text-xs font-semibold text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            <Maximize2 className="h-3.5 w-3.5" />
            Read full size
          </span>
        </div>
      </button>

      <div className="border-t border-border/70 p-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold uppercase tracking-widest text-[color:var(--rose)]">
          <span>{c.publication}</span>
          {c.edition ? <span className="text-[color:var(--plum)]/35">· {c.edition}</span> : null}
          {c.date ? <span className="text-[color:var(--plum)]/35">· {c.date}</span> : null}
        </div>

        <h2 className="mt-2 font-display text-lg font-semibold leading-snug text-[color:var(--plum)]">
          {c.headline}
        </h2>
        {c.headlineOriginal ? (
          <p lang="gu" className="mt-1.5 text-sm leading-relaxed text-[color:var(--plum)]/55">
            {c.headlineOriginal}
          </p>
        ) : null}
        {c.standfirst ? (
          <p className="mt-1.5 text-sm font-medium text-[color:var(--plum)]/60">{c.standfirst}</p>
        ) : null}

        <p className="mt-3 text-sm leading-relaxed text-[color:var(--plum)]/65">{c.summary}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {c.doctorsQuoted.map((d) => (
            <span
              key={d}
              className="rounded-full bg-[color:var(--rose)]/8 px-2.5 py-1 text-xs font-medium text-[color:var(--rose)]"
            >
              {d}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

/* ---------- Lightbox ---------- */

function Lightbox({
  clippings,
  index,
  onClose,
  onNavigate,
}: {
  clippings: PressClipping[];
  index: number | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const open = index !== null;
  useBodyLock(open);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index! + 1) % clippings.length);
      if (e.key === "ArrowLeft") onNavigate((index! - 1 + clippings.length) % clippings.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, clippings.length, onClose, onNavigate]);

  const c = open ? clippings[index!] : null;

  return (
    <AnimatePresence>
      {c ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${c.publication} — ${c.headline}`}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex flex-col bg-[color:var(--plum)]/92 backdrop-blur-sm"
        >
          {/* Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex shrink-0 items-start justify-between gap-4 px-4 py-4 text-white md:px-8"
          >
            <div className="min-w-0">
              <div className="text-xs font-bold uppercase tracking-widest text-white/60">
                {c.publication}
                {c.edition ? ` · ${c.edition}` : ""}
                {c.date ? ` · ${c.date}` : ""}
              </div>
              <div className="mt-1 truncate font-display text-base font-semibold md:text-lg">
                {c.headline}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href={c.image}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-1.5 rounded-full border border-white/25 px-4 py-2 text-xs font-semibold transition-colors hover:bg-white/10 sm:inline-flex"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                Open full size
              </a>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 transition-colors hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="flex min-h-0 flex-1 items-center justify-center px-2 pb-4 md:px-8">
            <motion.img
              key={c.slug}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              src={c.image}
              alt={`${c.publication} clipping — ${c.headline}`}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full rounded-lg bg-white object-contain shadow-lift"
            />
          </div>

          {/* Nav */}
          {clippings.length > 1 ? (
            <>
              <NavArrow
                side="left"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate((index! - 1 + clippings.length) % clippings.length);
                }}
              />
              <NavArrow
                side="right"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate((index! + 1) % clippings.length);
                }}
              />
            </>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function NavArrow({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: (e: React.MouseEvent) => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous clipping" : "Next clipping"}
      className={`absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 md:inline-flex ${
        side === "left" ? "left-3" : "right-3"
      }`}
    >
      <Icon className="h-6 w-6" />
    </button>
  );
}
