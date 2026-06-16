"use client";
import { Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/home-page";
import { SectionHead, Eyebrow } from "@/components/ivf-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { RichText } from "@/components/rich-text";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import type { Blog, Author, Category, Media } from "@/payload-types";

const asObj = <T,>(v: T | number | null | undefined): T | null =>
  v && typeof v === "object" ? (v as T) : null;

/** Hero copy + optional intro, sourced from the Blog Hub global. Both are
 *  optional — when absent the original hardcoded design is rendered, so the
 *  page is visually unchanged until an editor fills the global. */
type Hub = {
  hero?: { title?: string | null; description?: string | null } | null;
  intro?: DefaultTypedEditorState | null;
};

const DEFAULT_HERO_DESCRIPTION =
  "Expert, compassionate guidance on fertility, IVF and your journey to parenthood — reviewed by our specialists.";

const pageHref = (n: number) => (n <= 1 ? "/blog" : `/blog?page=${n}`);

/** Windowed page-number pagination: first, last, current ±1, with "…" gaps. */
function Pagination({
  page,
  totalPages,
  hasPrevPage,
  hasNextPage,
}: {
  page: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}) {
  if (totalPages <= 1) return null;

  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1].filter((n) => n >= 1 && n <= totalPages));
  const sorted = Array.from(pages).sort((a, b) => a - b);

  const items: (number | "ellipsis")[] = [];
  let prev = 0;
  for (const n of sorted) {
    if (prev && n - prev > 1) items.push("ellipsis");
    items.push(n);
    prev = n;
  }

  const linkClass =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors";

  return (
    <nav aria-label="Blog pagination" className="mt-4 flex items-center justify-center gap-2">
      <a
        href={hasPrevPage ? pageHref(page - 1) : undefined}
        aria-disabled={!hasPrevPage}
        className={`${linkClass} ${hasPrevPage ? "text-[color:var(--plum)] hover:bg-[color:var(--rose)]/10" : "pointer-events-none text-muted-foreground/40"}`}
      >
        <ChevronLeft className="h-4 w-4" />
      </a>

      {items.map((it, i) =>
        it === "ellipsis" ? (
          <span key={`e${i}`} className="px-1 text-sm text-muted-foreground">…</span>
        ) : (
          <a
            key={it}
            href={pageHref(it)}
            aria-current={it === page ? "page" : undefined}
            className={`${linkClass} ${
              it === page
                ? "bg-[color:var(--rose)] text-white"
                : "text-[color:var(--plum)] hover:bg-[color:var(--rose)]/10"
            }`}
          >
            {it}
          </a>
        ),
      )}

      <a
        href={hasNextPage ? pageHref(page + 1) : undefined}
        aria-disabled={!hasNextPage}
        className={`${linkClass} ${hasNextPage ? "text-[color:var(--plum)] hover:bg-[color:var(--rose)]/10" : "pointer-events-none text-muted-foreground/40"}`}
      >
        <ChevronRight className="h-4 w-4" />
      </a>
    </nav>
  );
}

export function BlogHub({
  posts,
  hero,
  intro,
  page = 1,
  totalPages = 1,
  hasPrevPage = false,
  hasNextPage = false,
}: {
  posts: Blog[];
  page?: number;
  totalPages?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
} & Hub) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)]">Blog</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="gradient-warm noise relative overflow-hidden">
        <div className="container-px mx-auto max-w-[1400px] py-14 text-center md:py-20">
          <Reveal><div className="flex justify-center"><Eyebrow>Knowledge & Resources</Eyebrow></div></Reveal>
          <Reveal delay={0.05}>
            <h1 className="mx-auto mt-5 text-4xl font-medium leading-[1.05] text-[color:var(--plum)] md:text-5xl">
              {hero?.title ? hero.title : <>The Bavishi Fertility <em className="font-display italic text-[color:var(--rose)]">Blog</em></>}
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              {hero?.description ?? DEFAULT_HERO_DESCRIPTION}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Optional CMS intro prose (Blog Hub global) — only renders when set */}
      {intro && (
        <section className="container-px mx-auto max-w-3xl pt-10 md:pt-14">
          <RichText data={intro} className="text-base" />
        </section>
      )}

      {/* Grid */}
      <section className="container-px mx-auto max-w-[1400px] py-12 md:py-16">
        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground">New articles are on the way. Please check back soon.</p>
        ) : (
          <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => {
              const cat = asObj<Category>(p.category ?? undefined);
              const author = asObj<Author>(p.author);
              const hero = asObj<Media>(p.heroImage ?? undefined);
              return (
                <StaggerItem key={p.id} className="h-full">
                  <a href={`/blog/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                    <div className="relative aspect-[16/10] overflow-hidden bg-[color:var(--plum)]/5">
                      {hero?.url && (
                        <img src={hero.url} alt={hero.alt ?? p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      {cat && <span className="inline-block w-fit rounded-full bg-[color:var(--rose)]/10 px-2.5 py-1 text-xs font-semibold text-[color:var(--rose)]">{cat.title}</span>}
                      <h3 className="mt-3 text-xl font-semibold leading-snug text-[color:var(--plum)] text-pretty">{p.title}</h3>
                      {p.excerpt && <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>}
                      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        {author && <span className="font-medium text-[color:var(--plum)]">{author.name}</span>}
                        {p.publishedAt && <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {format(new Date(p.publishedAt), "MMM d, yyyy")}</span>}
                        {p.readMins ? <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {p.readMins} min</span> : null}
                      </div>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--rose)]">
                        Read article <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </a>
                </StaggerItem>
              );
            })}
          </Stagger>
        )}

        <Pagination page={page} totalPages={totalPages} hasPrevPage={hasPrevPage} hasNextPage={hasNextPage} />
      </section>

      <Footer />
      <FloatingCTA />
      <ScrollToTop />
      <MobileBottomBar />
    </div>
  );
}
