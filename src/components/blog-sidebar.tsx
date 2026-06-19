"use client";
import { useEffect, useState } from "react";
import { Calendar, Phone, ChevronRight } from "lucide-react";
import type { TocHeading } from "@/lib/headings";
import type { Author, Media } from "@/payload-types";
import { SITE } from "@/lib/seo";

const asObj = <T,>(v: T | number | null | undefined): T | null =>
  v && typeof v === "object" ? (v as T) : null;

/** Strip the external live-site origin so profile links stay on this site.
 *  e.g. "https://ivfclinic.com/doctors/parth-bavishi" → "/doctors/parth-bavishi" */
const localizeUrl = (url: string) =>
  url.replace(/^https?:\/\/ivfclinic\.com/i, "") || url;

/* ── Table of Contents ──────────────────────────────────────── */
export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost intersecting heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActiveId(visible[0].target.id);
      },
      {
        // Fire when heading enters the top third of the viewport
        rootMargin: "0px 0px -65% 0px",
        threshold: 0,
      },
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--plum)]/50">
        In This Article
      </p>
      <nav aria-label="Table of contents" className="mt-3">
        <ul className="space-y-0.5">
          {headings.map((h) => {
            const isActive = activeId === h.id;
            return (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById(h.id)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    setActiveId(h.id);
                  }}
                  className={[
                    "block rounded-lg px-3 py-1.5 text-sm leading-snug transition-all duration-200",
                    h.level === 3 ? "ml-3 text-[13px]" : "",
                    isActive
                      ? "bg-[color:var(--rose)]/8 font-semibold text-[color:var(--rose)] border-l-[3px] border-[color:var(--rose)] rounded-l-none pl-2.5"
                      : "text-muted-foreground hover:text-[color:var(--plum)] hover:bg-muted/50",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {h.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

/* ── Author / Reviewer card ─────────────────────────────────── */
export function AuthorSidebarCard({ author }: { author: Author | null }) {
  if (!author) return null;
  const avatar = asObj<Media>(author.avatar ?? undefined);
  const profileUrl = author.sameAs?.[0]?.url
    ? localizeUrl(author.sameAs[0].url)
    : null;

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--plum)]/50">
        Medical Reviewer
      </p>
      <div className="mt-4 flex items-center gap-3">
        {avatar?.url ? (
          <img
            src={avatar.url}
            alt={avatar.alt ?? author.name}
            className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-[color:var(--rose)]/20"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[color:var(--rose)]/10">
            <span className="font-display text-2xl text-[color:var(--rose)]">
              {author.name[0]}
            </span>
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold leading-tight text-[color:var(--plum)]">
            {author.name}
          </p>
          {author.credentials && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {author.credentials}
            </p>
          )}
          {author.role && (
            <p className="mt-1 truncate text-xs font-medium text-[color:var(--rose)]">
              {author.role}
            </p>
          )}
        </div>
      </div>
      {author.bio && (
        <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
          {author.bio}
        </p>
      )}
      {profileUrl && (
        <a
          href={profileUrl}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--rose)] hover:underline"
        >
          View Full Profile <ChevronRight className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}

/* ── Dark CTA card ──────────────────────────────────────────── */
export function CtaSidebarCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl gradient-dark noise p-5 text-white">
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
        Free Consultation
      </p>
      <h3 className="mt-2 font-display text-lg font-medium leading-tight text-balance">
        Start Your{" "}
        <em className="italic text-[color:var(--rose-soft)]">Fertility Journey</em>
      </h3>
      <p className="mt-1.5 text-xs leading-relaxed text-white/65">
        Talk to our specialists — no obligation, just honest guidance.
      </p>
      <a
        href="/#book"
        className="btn-luxury mt-4 flex items-center justify-center gap-2 rounded-full bg-[color:var(--rose)] px-4 py-2.5 text-sm font-semibold text-white shadow-glow"
      >
        <Calendar className="h-3.5 w-3.5" /> Book Free Consultation
      </a>
      <a
        href={`tel:${SITE.telephone}`}
        className="btn-luxury mt-2 flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/8 px-4 py-2.5 text-sm font-semibold text-white"
      >
        <Phone className="h-3.5 w-3.5" /> {SITE.telephoneDisplay}
      </a>
    </div>
  );
}

/* ── Trust stats card ───────────────────────────────────────── */
/* Stats sourced from ivfclinic.com homepage (verified June 2026). */
const TRUST_STATS = [
  { label: "Successful IVF Pregnancies", value: "25,000+" },
  { label: "Fertility Centres", value: "14" },
  { label: "5-Star Google Reviews", value: "1,800+" },
  { label: "National Fertility Awards", value: "5 Years" },
] as const;

export function TrustSidebarCard() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--plum)]/50">
        Why Choose Bavishi Fertility Institute
      </p>
      <ul className="mt-4 space-y-3">
        {TRUST_STATS.map((s) => (
          <li
            key={s.label}
            className="flex items-center justify-between gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0"
          >
            <span className="text-xs leading-tight text-muted-foreground">{s.label}</span>
            <span className="shrink-0 text-sm font-bold text-[color:var(--plum)]">{s.value}</span>
          </li>
        ))}
      </ul>
      <a
        href="/#book"
        className="btn-luxury mt-4 flex items-center justify-center gap-2 rounded-full bg-[color:var(--plum)] px-4 py-2 text-xs font-semibold text-white"
      >
        Book Appointment <ChevronRight className="h-3 w-3" />
      </a>
    </div>
  );
}
