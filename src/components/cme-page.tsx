"use client";
import { useState } from "react";
import { Calendar, Clock, ArrowRight, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import type { Blog, Category, Media } from "@/payload-types";

const PAGE_SIZE = 9;

const asObj = <T,>(v: T | number | null | undefined): T | null =>
  v && typeof v === "object" ? (v as T) : null;

function cardAccent(slug: string): { from: string; to: string } {
  const palettes = [
    { from: "from-[#3D1F56]", to: "to-[#CF3A6A]" },
    { from: "from-[#1A3050]", to: "to-[#3D1F56]" },
    { from: "from-[#5A2878]", to: "to-[#CF3A6A]" },
    { from: "from-[#3D1F56]", to: "to-[#5A2878]" },
    { from: "from-[#CF3A6A]", to: "to-[#C5A130]" },
  ];
  const idx = slug.split("").reduce((n, c) => n + c.charCodeAt(0), 0) % palettes.length;
  return palettes[idx];
}

function CMECard({ blog }: { blog: Blog }) {
  const hero = asObj<Media>(blog.heroImage);
  const category = asObj<Category>(blog.category);
  const { from, to } = cardAccent(blog.slug);

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-shadow duration-500 hover:shadow-lift"
    >
      {/* Thumbnail */}
      <a href={`/blog/${blog.slug}`} className="block aspect-[16/9] overflow-hidden">
        {hero?.url ? (
          <img
            src={hero.url}
            alt={hero.alt ?? blog.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className={`relative h-full w-full bg-gradient-to-br ${from} ${to} overflow-hidden`}>
            <div aria-hidden className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex h-full flex-col justify-end p-5">
              <span className="mb-2 inline-block w-fit rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                CME
              </span>
              <p className="line-clamp-2 font-display text-base font-semibold leading-snug text-white/90">
                {blog.title}
              </p>
            </div>
          </div>
        )}
      </a>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-block rounded-full bg-[color:var(--rose)]/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[color:var(--rose)]">
            CME
          </span>
          {category?.title && (
            <span className="inline-block rounded-full bg-[color:var(--plum)]/8 px-3 py-0.5 text-[10px] font-medium text-[color:var(--plum)]/60">
              {category.title}
            </span>
          )}
        </div>

        <a href={`/blog/${blog.slug}`} className="mt-3 block group/title">
          <h3 className="font-display text-base font-semibold leading-snug text-[color:var(--plum)] transition-colors duration-200 group-hover/title:text-[color:var(--rose)] line-clamp-3">
            {blog.title}
          </h3>
        </a>

        {blog.excerpt && (
          <p className="mt-2 text-sm text-[color:var(--plum)]/60 leading-relaxed line-clamp-2">
            {blog.excerpt}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-[color:var(--plum)]/45">
            {blog.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(blog.publishedAt), "MMM d, yyyy")}
              </span>
            )}
            {blog.readMins && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {blog.readMins} min read
              </span>
            )}
          </div>
          <a
            href={`/blog/${blog.slug}`}
            className="flex items-center gap-1 text-xs font-semibold text-[color:var(--rose)] hover:gap-2 transition-all duration-200"
          >
            Read <ArrowRight className="h-3 w-3" />
          </a>
        </div>
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
    <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
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
        Page {page} of {totalPages} &nbsp;·&nbsp; {total} events
      </span>
    </div>
  );
}

export function CmePage({ blogs }: { blogs: Blog[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(blogs.length / PAGE_SIZE);
  const paged = blogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
                Medical Education
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="font-display text-4xl font-bold leading-tight text-[color:var(--plum)] md:text-5xl lg:text-6xl">
                Continuing Medical{" "}
                <em className="font-display italic text-[color:var(--rose)]">Education.</em>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 max-w-2xl text-lg text-[color:var(--plum)]/70">
                Bavishi Fertility Institute is a FOGSI-recognised training centre. We regularly conduct CME
                programmes, seminars, and knowledge-sharing events for gynaecologists and medical professionals
                across India.
              </p>
            </Reveal>

            {/* Stats */}
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-wrap gap-6">
                {[
                  { v: "FOGSI", l: "Recognised Training Centre" },
                  { v: "CME", l: "Programmes across Gujarat" },
                  { v: "SOGOG", l: "Conference Speaker" },
                ].map(({ v, l }) => (
                  <div key={l} className="rounded-2xl bg-white/70 px-5 py-3 shadow-soft backdrop-blur">
                    <div className="font-display text-xl font-bold text-[color:var(--rose)]">{v}</div>
                    <div className="text-xs text-[color:var(--plum)]/60">{l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Blog Cards */}
        <section className="container-px mx-auto max-w-[1400px] py-12 md:py-16">
          <Reveal>
            <div className="mb-8 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)]">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h2 className="font-display text-2xl font-bold text-[color:var(--plum)]">
                  CME Reports & Seminar Highlights
                </h2>
              </div>
              {blogs.length > 0 && (
                <span className="text-sm text-[color:var(--plum)]/50">{blogs.length} events</span>
              )}
            </div>
          </Reveal>

          {blogs.length > 0 ? (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={page}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {paged.map((blog) => (
                      <StaggerItem key={blog.id}>
                        <CMECard blog={blog} />
                      </StaggerItem>
                    ))}
                  </Stagger>
                </motion.div>
              </AnimatePresence>

              <Pagination page={page} total={blogs.length} pageSize={PAGE_SIZE} onChange={goTo} />
            </>
          ) : (
            <div className="rounded-3xl border border-border/50 bg-card py-16 text-center">
              <p className="text-[color:var(--plum)]/50">CME content coming soon.</p>
            </div>
          )}
        </section>

        {/* For Doctors CTA */}
        <section className="bg-[color:var(--plum)] py-12 md:py-16">
          <div className="container-px mx-auto max-w-[1400px]">
            <Reveal>
              <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-[color:var(--rose)]">For Doctors</p>
                  <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
                    Interested in a CME at your institution?
                  </h2>
                  <p className="mt-3 max-w-xl text-sm text-white/65 leading-relaxed">
                    Bavishi Fertility Institute collaborates with hospitals, gynaecologist associations, and IMA
                    chapters to conduct CME programmes. Reach out to partner with us.
                  </p>
                </div>
                <a
                  href="/contact"
                  className="shrink-0 rounded-full bg-[color:var(--rose)] px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-transform duration-300 hover:scale-[1.03]"
                >
                  Partner With Us
                </a>
              </div>
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
