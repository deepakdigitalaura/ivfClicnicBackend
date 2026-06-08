"use client";
import { Calendar, Clock, ShieldCheck, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Reveal } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { RichText } from "@/components/rich-text";
import type { Blog, Author, Category, Media } from "@/payload-types";

/* Net-new blog article template, built to match the existing design system
 * (plum/rose tokens, Reveal, container widths). Renders CMS data passed in as
 * props — the website remains the product, Payload is the content layer. */

const asObj = <T,>(v: T | number | null | undefined): T | null =>
  v && typeof v === "object" ? (v as T) : null;

function Byline({ author, reviewedBy, publishedAt, readMins }: {
  author: Author | null;
  reviewedBy: Author | null;
  publishedAt?: string | null;
  readMins?: number | null;
}) {
  const avatar = asObj<Media>(author?.avatar ?? undefined);
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
      {author && (
        <span className="inline-flex items-center gap-2">
          {avatar?.url && (
            <img src={avatar.url} alt={avatar.alt ?? author.name} className="h-8 w-8 rounded-full object-cover" />
          )}
          <span className="font-medium text-[color:var(--plum)]">{author.name}</span>
          {author.role && <span className="text-muted-foreground">· {author.role}</span>}
        </span>
      )}
      {publishedAt && (
        <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4 text-[color:var(--rose)]" /> {format(new Date(publishedAt), "MMMM d, yyyy")}</span>
      )}
      {readMins ? (
        <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-[color:var(--rose)]" /> {readMins} min read</span>
      ) : null}
      {reviewedBy && (
        <span className="inline-flex items-center gap-1.5 text-[color:var(--plum)]">
          <ShieldCheck className="h-4 w-4 text-[color:var(--rose)]" /> Medically reviewed by{" "}
          <span className="font-medium">{reviewedBy.name}{reviewedBy.credentials ? `, ${reviewedBy.credentials}` : ""}</span>
        </span>
      )}
    </div>
  );
}

export function BlogArticle({ blog }: { blog: Blog }) {
  const author = asObj<Author>(blog.author);
  const reviewedBy = asObj<Author>(blog.reviewedBy ?? undefined);
  const category = asObj<Category>(blog.category ?? undefined);
  const hero = asObj<Media>(blog.heroImage ?? undefined);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
          <span>/</span>
          <a href="/blog" className="hover:text-[color:var(--rose)]">Blog</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)] line-clamp-1">{blog.title}</span>
        </nav>
      </div>

      {/* Header */}
      <section className="container-px mx-auto max-w-3xl pt-12 md:pt-16">
        <Reveal>
          {category && (
            <span className="inline-block rounded-full bg-[color:var(--rose)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[color:var(--rose)]">
              {category.title}
            </span>
          )}
          <h1 className="mt-4 text-3xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-4xl lg:text-[2.75rem]">
            {blog.title}
          </h1>
          {blog.excerpt && (
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">{blog.excerpt}</p>
          )}
          <Byline author={author} reviewedBy={reviewedBy} publishedAt={blog.publishedAt} readMins={blog.readMins} />
        </Reveal>
      </section>

      {/* Hero image */}
      {hero?.url && (
        <section className="container-px mx-auto mt-8 max-w-4xl">
          <div className="overflow-hidden rounded-3xl border border-border/70 shadow-soft">
            <img src={hero.url} alt={hero.alt ?? blog.title} className="h-full w-full object-cover" />
          </div>
        </section>
      )}

      {/* Body */}
      <section className="container-px mx-auto max-w-3xl py-10 md:py-14">
        {blog.content && <RichText data={blog.content} className="text-base" />}
      </section>

      {/* Back link */}
      <section className="container-px mx-auto max-w-3xl pb-16">
        <a href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--rose)] hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to all articles
        </a>
      </section>

      <Footer />
      <FloatingCTA />
      <ScrollToTop />
      <MobileBottomBar />
    </div>
  );
}
