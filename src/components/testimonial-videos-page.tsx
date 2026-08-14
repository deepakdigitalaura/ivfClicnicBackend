"use client";
import { PlayCircle, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

const PAGE_SIZE = 12;

type TestimonialVideo = { id: string; name: string; quote: string; stars: number };

const DEFAULT_TESTIMONIAL_VIDEOS: TestimonialVideo[] = [
  { id: "6bH_RnV-_2Y", name: "Anita Thakkar", quote: "15 years of waiting and a failed IVF elsewhere — then our miracle finally happened at Bavishi Fertility Institute.", stars: 5 },
  { id: "KKf6tNrlvoc", name: "Rekha's Journey", quote: "From loss to a twin blessing — an inspiring IVF journey with the Bavishi Fertility Institute team by our side.", stars: 5 },
  { id: "SbkV-1fSonM", name: "Jigesh & Jinal", quote: "After failed treatments everywhere else, Bavishi Fertility Institute's personal care made us parents at last.", stars: 5 },
  { id: "dUC9eTcyjbI", name: "Mrudangi (Canada)", quote: "Being treated from Canada was seamless — the care and communication from the BFI team was exceptional.", stars: 5 },
  { id: "wA91XZ15CZI", name: "Chetan bhai, Ahmedabad", quote: "We are grateful for the compassionate guidance we received throughout our IVF journey at BFI.", stars: 5 },
  { id: "jJseAkmdrlo", name: "Mr. Mayur Vyas", quote: "The team's dedication and expert care gave us the family we always dreamed of.", stars: 5 },
  { id: "s8pMxnlipK8", name: "Family of Mr. Prafulchandra", quote: "Words cannot express our gratitude — BFI changed our lives forever.", stars: 5 },
  { id: "6SX-mYSTisU", name: "Shantilal Makwana", quote: "BFI's professional approach and heartfelt support made our fertility journey a success.", stars: 5 },
  { id: "uqaJOoKZLAk", name: "12 Years of Hope", quote: "After 12 long years, Bavishi Fertility Institute's advanced treatment brought us our bundle of joy.", stars: 5 },
  { id: "H40jjkI56D8", name: "Neha & Nilesh", quote: "Our IVF journey with BFI was everything we hoped for — we are now a family of three.", stars: 5 },
];

function VideoCard({ id, name, quote, stars }: { id: string; name: string; quote: string; stars: number }) {
  const [play, setPlay] = useState(false);
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-shadow duration-500 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3]">
        {play ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={`${name} — Patient Story`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlay(true)}
            aria-label={`Play testimonial: ${name}`}
            className="group/yt absolute inset-0 h-full w-full"
          >
            <img
              src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
              alt={`${name} — patient testimonial`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover/yt:scale-105"
            />
            <span className="absolute inset-0 bg-[color:var(--plum)]/15 transition-colors duration-300 group-hover/yt:bg-[color:var(--plum)]/5" />
            <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[color:var(--rose)] shadow-lift transition-transform duration-300 group-hover/yt:scale-110">
              <PlayCircle className="h-8 w-8" />
            </span>
            <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[color:var(--plum)] backdrop-blur">
              Patient Story
            </span>
          </button>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-1 text-[color:var(--gold)]">
          {Array.from({ length: stars }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-current" />
          ))}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[color:var(--plum)]/80 text-pretty">"{quote}"</p>
        <p className="mt-3 text-sm font-semibold text-[color:var(--plum)]">— {name}</p>
      </div>
    </motion.article>
  );
}

function Pagination({
  page, total, pageSize, onChange,
}: { page: number; total: number; pageSize: number; onChange: (p: number) => void }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  return (
    <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-[color:var(--plum)] disabled:opacity-30 hover:border-[color:var(--rose)] hover:text-[color:var(--rose)] transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-1 text-[color:var(--plum)]/40 text-sm">…</span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p as number)}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 ${
              p === page
                ? "bg-[color:var(--rose)] text-white shadow-soft"
                : "border border-border bg-white text-[color:var(--plum)]/70 hover:border-[color:var(--rose)] hover:text-[color:var(--rose)]"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-[color:var(--plum)] disabled:opacity-30 hover:border-[color:var(--rose)] hover:text-[color:var(--rose)] transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <span className="ml-2 text-xs text-[color:var(--plum)]/50">
        Page {page} of {totalPages} &nbsp;·&nbsp; {total} stories
      </span>
    </div>
  );
}

export function TestimonialVideosPage({ videos }: { videos?: TestimonialVideo[] }) {
  const ALL = videos?.length ? videos : DEFAULT_TESTIMONIAL_VIDEOS;
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(ALL.length / PAGE_SIZE);
  const paged = ALL.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function goTo(p: number) {
    setPage(Math.min(Math.max(1, p), totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="bg-[color:var(--rose-soft)]/40 py-14 md:py-20">
          <div className="container-px mx-auto max-w-[1400px]">
            <Reveal>
              <span className="mb-4 inline-block rounded-full bg-[color:var(--rose)]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[color:var(--rose)]">
                Success Stories
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="font-display text-4xl font-bold leading-tight text-[color:var(--plum)] md:text-5xl lg:text-6xl">
                Real Stories,{" "}
                <em className="font-display italic text-[color:var(--rose)]">Real Families.</em>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 max-w-2xl text-lg text-[color:var(--plum)]/70">
                Hear directly from patients who trusted Bavishi Fertility Institute with their parenthood journey.
                These are their stories — in their own words.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex items-center gap-1 text-[color:var(--gold)]">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <span className="text-sm font-medium text-[color:var(--plum)]/70">
                  30,000+ happy families across India &nbsp;·&nbsp; {ALL.length} patient stories
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Video Grid */}
        <section className="container-px mx-auto max-w-[1400px] py-12 md:py-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paged.map((v) => (
                  <StaggerItem key={v.id}>
                    <VideoCard {...v} />
                  </StaggerItem>
                ))}
              </Stagger>
            </motion.div>
          </AnimatePresence>

          <Pagination page={page} total={ALL.length} pageSize={PAGE_SIZE} onChange={goTo} />

          <Reveal delay={0.2}>
            <div className="mt-12 rounded-3xl bg-[color:var(--rose-soft)]/50 p-8 text-center">
              <p className="text-lg font-semibold text-[color:var(--plum)]">Want to share your story?</p>
              <p className="mt-2 text-sm text-[color:var(--plum)]/65">
                We would love to hear about your journey. Reach out to our team.
              </p>
              <a
                href="/contact"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3 text-sm font-semibold text-white shadow-soft transition-transform duration-300 hover:scale-[1.03]"
              >
                Get in Touch
              </a>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
      <MobileBottomBar />
      <ScrollToTop />
    </>
  );
}
