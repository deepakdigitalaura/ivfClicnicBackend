"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHead } from "@/components/ivf-page";
import { ahmedabadReading, type ReadingItem } from "@/lib/ahmedabad-reading";

/* Reading carousel for the Ahmedabad city and centre pages.
 *
 * Deliberately TEXT-ONLY. The existing blog cards elsewhere carry a cover
 * image, and across twenty-seven posts those covers vary in aspect ratio and
 * weight — which is what makes a card grid look ragged and slows the page.
 * With no image there is nothing to crop, nothing to load and every card is
 * the same height, so the row reads cleanly whatever the title length.
 *
 * Built on native scroll-snap rather than a transform track: it stays
 * keyboard- and touch-native, needs no library, and degrades to a plain
 * horizontal scroller if the JavaScript never runs. */

export function ReadingCarousel({
  items,
  eyebrow = "Reading",
  title,
  subtitle,
  tone = "plain",
}: {
  items?: ReadingItem[];
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  tone?: "plain" | "tint" | "white";
}) {
  const posts = items ?? ahmedabadReading();
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setPages(Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth)));
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  useEffect(() => {
    measure();
    const el = trackRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [measure]);

  const step = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    if (dir > 0 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  if (!posts.length) return null;
  const bg =
    tone === "tint" ? "bg-[color:var(--rose-soft)]/40 " : tone === "white" ? "bg-white " : "";

  return (
    <section className={`${bg}py-8 md:py-14`}>
      <div className="container-px mx-auto max-w-[1400px]">
        <SectionHead center eyebrow={eyebrow} title={title} subtitle={subtitle} />

        <div className="relative mt-9">
          <div
            ref={trackRef}
            role="group"
            aria-roledescription="carousel"
            aria-label="Related reading"
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
            style={{ scrollbarWidth: "none" }}
          >
            {posts.map((p) => (
              <a
                key={p.slug}
                href={`/blogs/${p.slug}`}
                className="group flex h-[13.5rem] w-[300px] shrink-0 snap-start flex-col rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-[color:var(--rose)]/40 hover:shadow-lift sm:w-[340px]"
              >
                <span className="inline-flex w-fit rounded-full bg-[color:var(--rose)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--rose)]">
                  {p.tag}
                </span>
                <h3 className="mt-4 line-clamp-3 text-[17px] font-medium leading-snug text-[color:var(--plum)] transition-colors group-hover:text-[color:var(--rose)]">
                  {p.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-muted-foreground">
                  {p.blurb}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-[13.5px] font-medium text-[color:var(--rose)]">
                  Read more
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </a>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="flex gap-1.5" aria-hidden="true">
              {Array.from({ length: pages }, (_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === page ? "w-5 bg-[color:var(--rose)]" : "w-1.5 bg-[color:var(--plum)]/20"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous articles"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card text-[color:var(--plum)] shadow-soft transition-all hover:border-[color:var(--rose)]/40 hover:text-[color:var(--rose)]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next articles"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card text-[color:var(--plum)] shadow-soft transition-all hover:border-[color:var(--rose)]/40 hover:text-[color:var(--rose)]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
