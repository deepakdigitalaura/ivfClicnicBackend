"use client";

/* =====================================================================
 * Animated graphical content blocks for blog articles.
 * ---------------------------------------------------------------------
 * "use client" — these use framer-motion + React state for animations;
 * they are imported by rich-text.tsx (a Server Component) and hydrated
 * on the client, which is the standard Next.js RSC pattern.
 *
 * Blocks defined in src/blocks/articleBlocks.ts; types in payload-types.ts.
 * Visual contract: plum/rose/gold palette, framer-motion entrance
 * animations, hover micro-interactions. No dependency on EditContext so
 * animations always play on public blog pages.
 * ===================================================================== */

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Lightbulb } from "lucide-react";
import { Reveal, Stagger, StaggerItem, Counter } from "@/components/motion";
import { resolveIcon } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import type {
  StatStripBlock,
  ComparisonTableBlock,
  HighlightCardBlock,
  DecisionListBlock,
  ConclusionPanelBlock,
  InlineCtaBlock,
  ExternalImageBlock,
} from "@/payload-types";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Colour token maps ─────────────────────────────────────────────── */
const accent: Record<
  "plum" | "rose" | "gold",
  { bg: string; text: string; soft: string; iconRing: string }
> = {
  plum: {
    bg: "bg-[color:var(--plum)]",
    text: "text-[color:var(--plum)]",
    soft: "bg-[color:var(--plum)]/[0.06]",
    iconRing: "ring-[color:var(--plum)]/15",
  },
  rose: {
    bg: "bg-[color:var(--rose)]",
    text: "text-[color:var(--rose)]",
    soft: "bg-[color:var(--rose)]/[0.06]",
    iconRing: "ring-[color:var(--rose)]/15",
  },
  gold: {
    bg: "bg-[color:var(--gold)]",
    text: "text-[color:var(--gold)]",
    soft: "bg-[color:var(--gold)]/[0.08]",
    iconRing: "ring-[color:var(--gold)]/20",
  },
};

/* Static grid-cols map — avoids dynamic string interpolation that Tailwind
 * can't detect at build time. */
const factsColsClass: Record<1 | 2 | 3 | 4, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

/* Blob placement varies by colour so repeat cards look different. */
const blobPos: Record<"plum" | "rose" | "gold", string> = {
  plum: "-top-10 -right-10",
  rose: "-bottom-10 -right-10",
  gold: "-top-6 left-1/3",
};

/* ── Value parsing helpers for stat counter ────────────────────────── */
function parseNumeric(value: string): number | null {
  const trimmed = value.trim();
  // Multi-word values ("3 Cycles", "Up to 20%", "Day 3–5") display as plain text.
  if (/\s/.test(trimmed)) return null;
  // Must start with a digit — "~40%", "Over 90%", "₹1.2L" display as plain text.
  if (!/^\d/.test(trimmed)) return null;
  // Don't animate range values like "10–20%" — stripping dashes concatenates digits.
  if (/\d[–\-]\d/.test(trimmed)) return null;
  const cleaned = trimmed.replace(/[^0-9.]/g, "");
  if (!cleaned) return null;
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

function getNumericSuffix(value: string): string {
  return value.replace(/^[\d,.]+\s*/, "").trim();
}

/* ══════════════════════════════════════════════════════════════════════
 * StatStrip — dark gradient stat row with counting animation.
 *
 * Three or four headline statistics displayed in a dark plum card with
 * ambient colour blobs, a subtle grid texture, and per-stat counting
 * animation driven by Payload's Counter primitive. Stagger entrance.
 * ══════════════════════════════════════════════════════════════════════ */
export function AnimatedStatStrip({ node }: { node: { fields: unknown } }) {
  const items = (node.fields as StatStripBlock).items ?? [];
  if (!items.length) return null;

  const gridCls =
    items.length === 2
      ? "grid-cols-2"
      : items.length === 3
      ? "grid-cols-3"
      : "grid-cols-2 sm:grid-cols-4";

  return (
    <Reveal className="my-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[color:var(--plum)] to-[color:var(--plum)]/80 shadow-xl">

        {/* Ambient colour glow blobs */}
        <div aria-hidden className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-[color:var(--rose)]/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[color:var(--gold)]/20 blur-3xl" />

        {/* Stat items — staggered entrance */}
        <Stagger
          className={cn("relative grid divide-x divide-white/10", gridCls)}
          stagger={0.1}
        >
          {items.map((item, i) => {
            const numeric = parseNumeric(item.value);
            const suffix = numeric !== null ? getNumericSuffix(item.value) : "";
            return (
              <StaggerItem key={i}>
                <div className="flex flex-col items-center px-5 py-7 text-center">
                  <p className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
                    {numeric !== null ? (
                      <><Counter to={numeric} duration={1.8} />{suffix}</>
                    ) : (
                      item.value
                    )}
                  </p>
                  {/* Gold accent divider */}
                  <div className="my-2.5 h-px w-8 rounded-full bg-[color:var(--gold)]/60" />
                  <p className="text-xs font-medium leading-snug text-white/65 max-w-[12ch]">
                    {item.label}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Reveal>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * ComparisonTable — scannable side-by-side table with hover row highlight.
 *
 * Each row reacts to hover with a left-border accent (inset box-shadow)
 * and a faint background tint. Whole table has a Reveal entrance.
 * ══════════════════════════════════════════════════════════════════════ */
type CellShape = { value: string; id?: string | null };
type RowShape = {
  rowLabel: string;
  cells?: CellShape[] | null;
  id?: string | null;
};

function HoverTableRow({ row, isEven }: { row: RowShape; isEven: boolean }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "transition-colors duration-150",
        hovered ? "bg-[color:var(--plum)]/[0.04]" : isEven ? "bg-white" : "bg-[color:var(--ivory)]",
      )}
      style={{
        boxShadow: hovered ? "inset 3px 0 0 var(--plum)" : "inset 3px 0 0 transparent",
        transition: "box-shadow 0.15s ease, background-color 0.15s ease",
      }}
    >
      <td className="px-5 py-3.5 font-semibold text-[color:var(--plum)]">{row.rowLabel}</td>
      {(row.cells ?? []).map((cell, j) => (
        <td key={j} className="px-5 py-3.5 text-muted-foreground">{cell.value}</td>
      ))}
    </tr>
  );
}

export function AnimatedComparisonTable({ node }: { node: { fields: unknown } }) {
  const { rowHeader, columns, rows } = node.fields as ComparisonTableBlock;
  if (!columns?.length || !rows?.length) return null;

  return (
    <Reveal className="my-8">
      <div className="overflow-x-auto rounded-2xl border border-border/60 shadow-soft">
        <table className="w-full min-w-[480px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-[color:var(--plum)] to-[color:var(--plum)]/80">
              <th className="px-5 py-4 font-semibold text-white">{rowHeader || "Type"}</th>
              {(columns ?? []).map((col, i) => (
                <th key={i} className="px-5 py-4 font-semibold text-white/90">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((row, i) => (
              <HoverTableRow
                key={row.id ?? i}
                row={row as RowShape}
                isEven={i % 2 === 0}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Reveal>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * HighlightCard — treatment type card with coloured header, icon
 * medallion, facts row, and "best suited for" callout.
 *
 * Entrance: Reveal (fade-up). Interaction: lift + shadow on hover.
 * Blob position varies per colour (plum/rose/gold) so repeated cards
 * look visually distinct even with the same layout.
 * ══════════════════════════════════════════════════════════════════════ */
export function AnimatedHighlightCard({ node }: { node: { fields: unknown } }) {
  const {
    badge,
    tagline,
    icon: iconKey,
    color: rawColor,
    facts: factsRaw,
    bestSuitedFor,
  } = node.fields as HighlightCardBlock;

  const color = (rawColor ?? "plum") as "plum" | "rose" | "gold";
  const facts = factsRaw ?? [];
  const a = accent[color];
  const IconComp = resolveIcon(iconKey as string | null | undefined);

  return (
    <Reveal className="my-8">
      <motion.div
        whileHover={{ y: -6, boxShadow: "0 24px 64px rgba(0,0,0,0.12)" }}
        transition={{ duration: 0.5, ease: EASE }}
        className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-soft"
      >
        {/* ── Coloured header bar ── */}
        <div className={cn("relative overflow-hidden px-6 py-5", a.bg)}>
          {/* Decorative white blob — position keyed by colour */}
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute h-40 w-40 rounded-full bg-white/10 blur-3xl",
              blobPos[color],
            )}
          />

          <div className="relative flex items-center justify-between gap-4">
            <div className="min-w-0">
              {/* Badge pill */}
              <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
                {badge}
              </span>
              {/* Tagline */}
              {tagline && (
                <p className="mt-2 text-sm italic leading-snug text-white/80">{tagline}</p>
              )}
            </div>

            {/* Icon medallion */}
            <div className="shrink-0 flex h-14 w-14 items-center justify-center rounded-full bg-white/15 ring-2 ring-white/25 backdrop-blur-sm">
              <IconComp className="h-7 w-7 text-white" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* ── Optional facts row ── */}
        {facts.length > 0 && (
          <div
            className={cn(
              "grid gap-px border-b border-border/40 bg-border/30 grid-cols-2",
              factsColsClass[Math.min(facts.length, 4) as 1 | 2 | 3 | 4],
            )}
          >
            {facts.map((f, i) => (
              <div key={i} className="bg-white px-5 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  {f.label}
                </p>
                <p className={cn("mt-0.5 text-sm font-semibold", a.text)}>{f.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Best suited for callout ── */}
        <div className={cn("flex gap-3 px-6 py-4", a.soft)}>
          <CheckCircle2 className={cn("mt-0.5 h-5 w-5 shrink-0", a.text)} />
          <p className="text-[15px] leading-relaxed text-foreground/85">
            <span className="font-semibold">Best suited for: </span>
            {bestSuitedFor}
          </p>
        </div>
      </motion.div>
    </Reveal>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * DecisionList — situation → recommendation rows, staggered entrance.
 *
 * Each item has an icon circle (or numbered fallback) on the left, the
 * situation label, and a plum pill badge for the recommendation. Items
 * stagger in on scroll and slide slightly right on hover.
 * ══════════════════════════════════════════════════════════════════════ */
export function AnimatedDecisionList({ node }: { node: { fields: unknown } }) {
  const { heading, intro, items: itemsRaw, note } = node.fields as DecisionListBlock;
  const items = itemsRaw ?? [];
  if (!items.length) return null;

  return (
    <Reveal className="my-8">
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft md:p-8">
        {heading && (
          <h3 className="text-xl font-semibold text-[color:var(--plum)]">{heading}</h3>
        )}
        {intro && (
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{intro}</p>
        )}

        {/* Staggered item rows */}
        <Stagger className="mt-5 space-y-3" stagger={0.08} delay={0.1}>
          {items.map((item, i) => {
            const IconComp = item.icon ? resolveIcon(item.icon as string) : null;
            return (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-border/40 bg-[color:var(--ivory)] px-4 py-3.5"
                >
                  {/* Icon circle or index number */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--plum)]/10 ring-1 ring-[color:var(--plum)]/15">
                    {IconComp ? (
                      <IconComp
                        className="h-4 w-4 text-[color:var(--plum)]"
                        strokeWidth={1.75}
                      />
                    ) : (
                      <span className="text-xs font-bold text-[color:var(--plum)]">{i + 1}</span>
                    )}
                  </div>

                  {/* Situation label */}
                  <span className="flex-1 text-sm font-medium text-foreground/80">
                    {item.situation}
                  </span>

                  {/* Recommendation badge */}
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--plum)] px-3.5 py-1.5 text-xs font-semibold text-white">
                    <ArrowRight className="h-3 w-3" />
                    {item.recommendation}
                  </span>
                </motion.div>
              </StaggerItem>
            );
          })}
        </Stagger>

        {/* Optional practical tip */}
        {note && (
          <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-sm leading-relaxed text-amber-800">{note}</p>
          </div>
        )}
      </div>
    </Reveal>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * Infographic — inline SVG process diagram / chart / visual.
 *
 * SVG is set by editors/scripts only (not user input). Rendered via
 * dangerouslySetInnerHTML inside a role="img" container so screen readers
 * use the altText; the SVG itself should omit aria-label to avoid duplication.
 * ══════════════════════════════════════════════════════════════════════ */
export function AnimatedInfographic({ node: _node }: { node: { fields: unknown } }) {
  // Infographic blocks duplicate the "In this article" sidebar TOC — hidden.
  return null;
}

/* ══════════════════════════════════════════════════════════════════════
 * InlineCta — mid-article lead-generation card.
 *
 * Breaks the content flow at high-intent moments with a clear action —
 * primary (filled rose) and optional secondary (outline) buttons.
 * ══════════════════════════════════════════════════════════════════════ */
export function AnimatedInlineCta({ node }: { node: { fields: unknown } }) {
  const { headline, subtext, buttons: buttonsRaw, accent: rawAccent } = node.fields as InlineCtaBlock;
  const buttons = buttonsRaw ?? [];
  const color = (rawAccent ?? "rose") as "rose" | "plum" | "gold";

  /* Fully-static gradient backgrounds keyed by colour — no dynamic Tailwind classes */
  const gradients = {
    rose: "from-[#CF3A6A] to-[#9B2A5E]",
    plum: "from-[#3D1F56] to-[#5A2878]",
    gold: "from-[#C5A130] to-[#9C7D1F]",
  };

  return (
    <Reveal className="my-8">
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradients[color]} p-6 shadow-xl md:p-8`}>
        {/* Ambient white blobs */}
        <div aria-hidden className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-white/8 blur-2xl" />

        <div className="relative">
          <p className="text-xl font-semibold leading-snug text-white">{headline}</p>
          {subtext && (
            <p className="mt-2 text-sm leading-relaxed text-white/75">{subtext}</p>
          )}

          {buttons.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-3">
              {buttons.map((btn, i) => (
                <a
                  key={i}
                  href={btn.url}
                  className={
                    btn.variant === "secondary"
                      ? "inline-flex items-center gap-1.5 rounded-full border-2 border-white/80 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[color:var(--plum)]"
                      : "inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[color:var(--plum)] shadow-sm transition-opacity hover:opacity-90"
                  }
                >
                  {btn.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * ExternalImage — topic-relevant stock photo from Pexels / Unsplash.
 *
 * URL is set by the editorial team / enrichment scripts; never from
 * arbitrary user input. Renders with credit attribution below.
 * ══════════════════════════════════════════════════════════════════════ */
export function AnimatedExternalImage({ node }: { node: { fields: unknown } }) {
  const { url, alt, caption, credit } = node.fields as ExternalImageBlock;
  if (!url) return null;

  return (
    <Reveal className="my-8">
      <figure className="overflow-hidden rounded-2xl border border-border/40 bg-[color:var(--plum)]/5 shadow-soft">
        <img
          src={url}
          alt={alt}
          className="w-full max-h-[520px] object-contain"
          loading="lazy"
        />
        {(caption || credit) && (
          <figcaption className="px-4 py-2.5 text-center text-xs text-muted-foreground">
            {caption}
            {caption && credit && " · "}
            {credit && <span className="opacity-60">{credit}</span>}
          </figcaption>
        )}
      </figure>
    </Reveal>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * ConclusionPanel — dark icon-grid summary card for the conclusion
 * section. Replaces a plain paragraph list with a premium editorial
 * "key takeaways" visual. Points stagger in with icons.
 * ══════════════════════════════════════════════════════════════════════ */
export function AnimatedConclusionPanel({ node }: { node: { fields: unknown } }) {
  const { headline, points: pointsRaw } = node.fields as ConclusionPanelBlock;
  const points = (pointsRaw ?? []) as { icon?: string | null; text: string; id?: string | null }[];
  if (!points.length) return null;

  return (
    <Reveal className="my-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[color:var(--plum)] to-[color:var(--plum)]/75 p-7 shadow-xl md:p-9">
        {/* Ambient blobs */}
        <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[color:var(--rose)]/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-[color:var(--gold)]/15 blur-3xl" />

        {/* Headline */}
        {headline && (
          <div className="relative flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-white/15" />
            <h3 className="font-display text-xl font-bold uppercase tracking-widest text-[color:var(--gold)]">
              {headline}
            </h3>
            <div className="h-px flex-1 bg-white/15" />
          </div>
        )}

        {/* Points grid — 2 columns on sm+ */}
        <Stagger
          className="relative grid gap-3 sm:grid-cols-2"
          stagger={0.09}
          delay={0.05}
        >
          {points.map((point, i) => {
            const IconComp = point.icon ? resolveIcon(point.icon) : resolveIcon("Sparkles");
            return (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="flex gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm ring-1 ring-white/10"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--rose)] ring-2 ring-[color:var(--rose)]/30">
                    <IconComp className="h-4 w-4 text-white" strokeWidth={1.75} />
                  </div>
                  <p className="text-sm leading-snug text-white/85 pt-1">{point.text}</p>
                </motion.div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Reveal>
  );
}
