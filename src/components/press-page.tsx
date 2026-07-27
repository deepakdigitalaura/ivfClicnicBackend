"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { Newspaper, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PRESS_CLIPPINGS, pressHref, type PressClipping } from "@/lib/press";

const ALL = "All coverage";
const EXCERPT_LENGTH = 220;

function excerpt(clipping: PressClipping): string {
  const text = clipping.bodyText.join(" ");
  if (text.length <= EXCERPT_LENGTH) return text;
  return text.slice(0, EXCERPT_LENGTH).replace(/\s+\S*$/, "") + "…";
}

export function PressPage({ clippings = PRESS_CLIPPINGS }: { clippings?: PressClipping[] }) {
  const [filter, setFilter] = React.useState<string>(ALL);

  const publications = React.useMemo(
    () => [ALL, ...new Set(clippings.map((c) => c.publication))],
    [clippings],
  );
  const shown = React.useMemo(
    () => (filter === ALL ? clippings : clippings.filter((c) => c.publication === filter)),
    [clippings, filter],
  );

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
                fertility, IVF and reproductive law. Below is our printed coverage — open any
                article to read the full scan and text.
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
          <Stagger key={filter} className="columns-1 gap-6 sm:columns-2 lg:columns-3">
            {shown.map((c, i) => (
              <StaggerItem key={c.slug} className="mb-6 break-inside-avoid">
                <ClippingCard clipping={c} eager={i < 3} />
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

      <Footer />
      <FloatingCTA />
      <MobileBottomBar />
      <ScrollToTop />
    </>
  );
}

/* ---------- Card ---------- */

function ClippingCard({ clipping: c, eager }: { clipping: PressClipping; eager: boolean }) {
  return (
    <motion.a
      href={pressHref(c.slug)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5 }}
      className="group block break-inside-avoid overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-shadow duration-500 hover:shadow-lift"
      aria-label={`Read full article: ${c.headline}, ${c.publication}`}
    >
      <div className="overflow-hidden bg-white">
        <img
          src={c.thumb}
          alt={`${c.publication} clipping — ${c.headline}`}
          width={c.width}
          height={c.height}
          loading={eager ? "eager" : "lazy"}
          className="w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

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

        <p lang={c.language === "Gujarati" ? "gu" : "en"} className="mt-3 text-sm leading-relaxed text-[color:var(--plum)]/65">
          {excerpt(c)}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {c.doctorsQuoted.map((d) => (
              <span
                key={d}
                className="rounded-full bg-[color:var(--rose)]/8 px-2.5 py-1 text-xs font-medium text-[color:var(--rose)]"
              >
                {d}
              </span>
            ))}
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[color:var(--rose)]">
            Read full article
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </motion.a>
  );
}
