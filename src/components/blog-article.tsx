"use client";
import {
  Calendar,
  Clock,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  BookOpen,
  Phone,
  MessageCircle,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { Reveal, Magnetic, Stagger, StaggerItem } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { RichText } from "@/components/rich-text";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  TableOfContents,
  AuthorSidebarCard,
  CtaSidebarCard,
  TrustSidebarCard,
} from "@/components/blog-sidebar";
import { SITE } from "@/lib/seo";
import type { BlogPost } from "@/lib/blogs";
import type { Blog, Author, Category, Media } from "@/payload-types";
import type { TocHeading } from "@/lib/headings";

/* ── Helpers ─────────────────────────────────────────────────── */
const asObj = <T,>(v: T | number | null | undefined): T | null =>
  v && typeof v === "object" ? (v as T) : null;

/** Strip the external live-site origin so profile links stay on this site.
 *  e.g. "https://ivfclinic.com/doctors/parth-bavishi" → "/doctors/parth-bavishi" */
const localizeUrl = (url: string) =>
  url.replace(/^https?:\/\/ivfclinic\.com/i, "") || url;

/* ── Medical disclaimer ──────────────────────────────────────── */
function MedicalDisclaimer() {
  return (
    <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
      <div>
        <p className="text-sm font-semibold text-amber-800">Medical Disclaimer</p>
        <p className="mt-1 text-sm leading-relaxed text-amber-700">
          This article is for informational purposes only and does not substitute professional
          medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider
          before making any health-related decisions.
        </p>
      </div>
    </div>
  );
}

/* ── About the Author ────────────────────────────────────────── */
function AboutAuthor({ author }: { author: Author }) {
  const avatar = asObj<Media>(author.avatar ?? undefined);
  const profileUrl = author.sameAs?.[0]?.url
    ? localizeUrl(author.sameAs[0].url)
    : null;

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft md:p-8">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--plum)]/50">
        About the Author
      </p>
      <div className="mt-5 flex items-start gap-5">
        {avatar?.url ? (
          <img
            src={avatar.url}
            alt={avatar.alt ?? author.name}
            className="h-20 w-20 shrink-0 rounded-full object-cover ring-4 ring-[color:var(--rose)]/15"
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[color:var(--rose)]/10">
            <span className="font-display text-3xl text-[color:var(--rose)]">
              {author.name[0]}
            </span>
          </div>
        )}
        <div>
          <p className="text-xl font-semibold leading-tight text-[color:var(--plum)]">
            {author.name}
          </p>
          {author.credentials && (
            <p className="mt-1 text-sm text-muted-foreground">{author.credentials}</p>
          )}
          {author.role && (
            <p className="mt-1 text-sm font-medium text-[color:var(--rose)]">{author.role}</p>
          )}
        </div>
      </div>
      {author.bio && (
        <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">{author.bio}</p>
      )}
      {profileUrl && (
        <a
          href={profileUrl}
          className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-[color:var(--rose)]/30 px-5 py-2 text-sm font-semibold text-[color:var(--rose)] transition-colors hover:bg-[color:var(--rose)] hover:text-white"
        >
          View Full Profile <ChevronRight className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}

/* ── FAQ accordion ───────────────────────────────────────────── */
function FaqSection({ faqs }: { faqs: { question: string; answer: string }[] }) {
  if (!faqs.length) return null;
  return (
    <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft md:p-8">
      <h2 className="text-2xl font-medium leading-tight text-[color:var(--plum)] md:text-3xl">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="mt-6">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left text-base font-medium text-[color:var(--plum)]">
              {f.question}
            </AccordionTrigger>
            <AccordionContent className="whitespace-pre-line text-[15px] leading-relaxed text-muted-foreground">
              {f.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

/* ── Keep Reading ────────────────────────────────────────────── */
function KeepReading({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null;
  return (
    <section className="border-t border-border/60 bg-[color:var(--ivory)] py-14">
      <div className="container-px mx-auto max-w-[1400px]">
        <Reveal>
          <h2 className="text-2xl font-medium leading-tight text-[color:var(--plum)] md:text-3xl">
            Keep Reading
          </h2>
        </Reveal>
        <Stagger className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <StaggerItem key={p.slug}>
              <a
                href={p.href}
                className="group flex h-full flex-col rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
              >
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[color:var(--rose)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--rose)]">
                  <BookOpen className="h-3 w-3" /> {p.category}
                </span>
                <h3 className="mt-4 flex-1 text-lg font-semibold leading-snug text-[color:var(--plum)] transition-colors group-hover:text-[color:var(--rose)]">
                  {p.title}
                </h3>
                {p.excerpt && (
                  <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-muted-foreground">
                    {p.excerpt}
                  </p>
                )}
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--rose)]">
                  Read article <ChevronRight className="h-4 w-4" />
                </span>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ── Full-width CTA banner ───────────────────────────────────── */
function BlogCta() {
  return (
    <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
      <div className="noise relative overflow-hidden rounded-[2.5rem] gradient-dark px-8 py-16 text-center text-white md:px-16 md:py-20">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-medium leading-[1.1] md:text-4xl lg:text-5xl">
            Ready to start your{" "}
            <em className="font-display italic text-[color:var(--rose-soft)]">
              fertility journey?
            </em>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/75">
            Talk to our specialists about your options — no obligation, just honest guidance.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Magnetic
              as="a"
              href="/#book"
              className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-glow"
            >
              <Calendar className="h-4 w-4" /> Book Free Consultation
            </Magnetic>
            <Magnetic
              as="a"
              href={`tel:${SITE.telephone}`}
              className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white"
            >
              <Phone className="h-4 w-4" /> {SITE.telephoneDisplay}
            </Magnetic>
            <Magnetic
              as="a"
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Us
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Main export ─────────────────────────────────────────────── */
export function BlogArticle({
  blog,
  relatedBlogs = [],
  headings = [],
}: {
  blog: Blog;
  relatedBlogs?: BlogPost[];
  /** h2/h3 headings extracted server-side for the sidebar ToC scrollspy. */
  headings?: TocHeading[];
}) {
  const author = asObj<Author>(blog.author);
  const reviewedBy = asObj<Author>(blog.reviewedBy ?? undefined);
  const category = asObj<Category>(blog.category ?? undefined);
  const hero = asObj<Media>(blog.heroImage ?? undefined);
  const faqs = (blog.faqs ?? []).filter(
    (f) => f.question && f.answer,
  ) as { question: string; answer: string }[];

  // "Featured doctor" in sidebar + About section:
  // prefer the medical reviewer (Dr. Parth Bavishi) over the writer.
  const featuredDoctor = reviewedBy ?? author;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* ════════════════════════════════════════
          DARK HERO BAND
      ════════════════════════════════════════ */}
      <section className="noise relative overflow-hidden gradient-dark pb-14 pt-12 md:pb-20 md:pt-16">
        <div className="container-px mx-auto max-w-[1400px]">

          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-white/45"
          >
            <a href="/" className="transition-colors hover:text-white/90">Home</a>
            <span>/</span>
            <a href="/blog" className="transition-colors hover:text-white/90">Blog</a>
            <span>/</span>
            <span className="line-clamp-1 text-white/70">{blog.title}</span>
          </nav>

          {/* Category badge */}
          {category && (
            <div className="mt-5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/80">
                {category.title}
              </span>
            </div>
          )}

          {/* Title */}
          <Reveal>
            <h1 className="mt-4 max-w-4xl text-balance text-3xl font-medium leading-[1.1] text-white md:text-4xl lg:text-5xl">
              {blog.title}
            </h1>
          </Reveal>

          {/* Excerpt / lead */}
          {blog.excerpt && (
            <Reveal delay={0.1}>
              <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-white/70 md:text-lg">
                {blog.excerpt}
              </p>
            </Reveal>
          )}

          {/* Byline row */}
          <Reveal delay={0.15}>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/55">
              {/* Author avatar + name */}
              {author && (() => {
                const av = asObj<Media>(author.avatar ?? undefined);
                return (
                  <span className="inline-flex items-center gap-2.5">
                    {av?.url && (
                      <img
                        src={av.url}
                        alt={author.name}
                        className="h-9 w-9 rounded-full object-cover ring-2 ring-white/20"
                      />
                    )}
                    <span>
                      <span className="font-semibold text-white">{author.name}</span>
                      {author.role && (
                        <span className="ml-1.5 text-white/45">· {author.role}</span>
                      )}
                    </span>
                  </span>
                );
              })()}

              {blog.publishedAt && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[color:var(--rose-soft)]" />
                  {format(new Date(blog.publishedAt), "MMMM d, yyyy")}
                </span>
              )}

              {blog.lastUpdatedAt && (
                <span className="inline-flex items-center gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5 text-[color:var(--rose-soft)]" />
                  Updated {format(new Date(blog.lastUpdatedAt), "MMM d, yyyy")}
                </span>
              )}

              {blog.readMins ? (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[color:var(--rose-soft)]" />
                  {blog.readMins} min read
                </span>
              ) : null}

              {reviewedBy && (
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--gold)]" />
                  <span>
                    Reviewed by{" "}
                    <span className="font-medium text-white/80">
                      {reviewedBy.name}
                      {reviewedBy.credentials ? `, ${reviewedBy.credentials}` : ""}
                    </span>
                  </span>
                </span>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURED IMAGE (bridges hero → body)
          — No crop: let the image show at its natural aspect ratio so
            infographics / tall images are never cut off or dulled.
      ════════════════════════════════════════ */}
      {hero?.url && (
        <div className="container-px mx-auto -mt-6 max-w-5xl relative z-10">
          <div className="rounded-3xl shadow-lift border border-border/40 bg-white overflow-hidden">
            <img
              src={hero.url}
              alt={hero.alt ?? blog.title}
              className="h-auto w-full"
              loading="eager"
            />
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          TWO-COLUMN LAYOUT
      ════════════════════════════════════════ */}
      <div
        className={`container-px mx-auto max-w-[1400px] ${hero?.url ? "mt-10 md:mt-14" : "mt-8 md:mt-12"}`}
      >
        <div className="grid gap-10 lg:grid-cols-[1fr_340px] xl:gap-14 pb-14">

          {/* ── Main content column ── */}
          <main className="min-w-0">
            {/* Medical disclaimer at top of article */}
            <MedicalDisclaimer />

            {/* Article body (rich text) */}
            <div className="mt-8">
              {blog.content && <RichText data={blog.content} className="text-base" />}
            </div>

            {/* Back to blog */}
            <div className="mt-10 border-t border-border/60 pt-6">
              <a
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--rose)] hover:underline"
              >
                <ArrowLeft className="h-4 w-4" /> Back to all articles
              </a>
            </div>

            {/* About the Author — visually distinct section */}
            {featuredDoctor && (
              <div className="mt-8">
                <Reveal>
                  <AboutAuthor author={featuredDoctor} />
                </Reveal>
              </div>
            )}

            {/* FAQ accordion */}
            {faqs.length > 0 && (
              <div className="mt-8">
                <Reveal>
                  <FaqSection faqs={faqs} />
                </Reveal>
              </div>
            )}
          </main>

          {/* ── Sticky sidebar (desktop only) ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 flex flex-col gap-5">
              {headings.length > 0 && <TableOfContents headings={headings} />}
              {featuredDoctor && <AuthorSidebarCard author={featuredDoctor} />}
              <CtaSidebarCard />
              <TrustSidebarCard />
            </div>
          </aside>
        </div>
      </div>

      {/* ════════════════════════════════════════
          POST-CONTENT SECTIONS (full width)
      ════════════════════════════════════════ */}
      <BlogCta />
      <KeepReading posts={relatedBlogs} />

      <Footer />
      <FloatingCTA />
      <ScrollToTop />
      <MobileBottomBar />
    </div>
  );
}
