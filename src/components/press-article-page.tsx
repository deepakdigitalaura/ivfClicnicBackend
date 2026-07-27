import { Maximize2, Newspaper } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { pressHref, type PressClipping } from "@/lib/press";

export function PressArticlePage({
  clipping: c,
  more,
}: {
  clipping: PressClipping;
  more: PressClipping[];
}) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        {/* Hero / meta */}
        <section className="bg-[color:var(--rose-soft)]/40 py-12 md:py-16">
          <div className="container-px mx-auto max-w-[900px]">
            <Reveal>
              <nav aria-label="Breadcrumb" className="mb-5 text-sm text-[color:var(--plum)]/55">
                <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
                <span className="mx-2">/</span>
                <a href="/press" className="hover:text-[color:var(--rose)]">Media &amp; Press</a>
              </nav>
            </Reveal>
            <Reveal delay={0.05}>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[color:var(--rose)]">
                <Newspaper className="h-3.5 w-3.5" />
                {c.publication}
                {c.edition ? ` · ${c.edition}` : ""}
                {c.date ? ` · ${c.date}` : ""}
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="font-display text-3xl font-bold leading-tight text-[color:var(--plum)] md:text-4xl lg:text-5xl">
                {c.headline}
              </h1>
            </Reveal>
            {c.headlineOriginal ? (
              <Reveal delay={0.15}>
                <p lang="gu" className="mt-3 text-lg text-[color:var(--plum)]/60">
                  {c.headlineOriginal}
                </p>
              </Reveal>
            ) : null}
            {c.standfirst ? (
              <Reveal delay={0.18}>
                <p className="mt-3 text-lg font-medium text-[color:var(--plum)]/70">{c.standfirst}</p>
              </Reveal>
            ) : null}
            <Reveal delay={0.22}>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {c.byline ? (
                  <span className="text-sm text-[color:var(--plum)]/55">By {c.byline} ·</span>
                ) : null}
                {c.doctorsQuoted.map((d) => (
                  <span
                    key={d}
                    className="rounded-full bg-[color:var(--rose)]/8 px-2.5 py-1 text-xs font-medium text-[color:var(--rose)]"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Scan + full text */}
        <section className="container-px mx-auto max-w-[900px] py-10 md:py-14">
          <Reveal>
            <figure className="overflow-hidden rounded-3xl border border-border/70 bg-white shadow-soft">
              <img
                src={c.image}
                alt={`${c.publication} clipping — ${c.headline}`}
                width={c.width}
                height={c.height}
                className="w-full object-contain"
              />
              <figcaption className="flex items-center justify-between gap-4 border-t border-border/70 px-5 py-3 text-sm text-[color:var(--plum)]/55">
                <span>Original scan, as printed.</span>
                <a
                  href={c.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-[color:var(--rose)] hover:underline"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  Open full size
                </a>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.1}>
            <div lang={c.language === "Gujarati" ? "gu" : "en"} className="mt-10">
              {c.bodyText.map((para, i) => (
                <p key={i} className="mb-5 text-lg leading-relaxed text-[color:var(--plum)]/80">
                  {para}
                </p>
              ))}
            </div>
          </Reveal>
        </section>

        {/* More coverage */}
        {more.length > 0 ? (
          <section className="bg-[color:var(--plum)]/4 py-12 md:py-16">
            <div className="container-px mx-auto max-w-[1400px]">
              <Reveal>
                <h2 className="mb-8 font-display text-2xl font-bold text-[color:var(--plum)] md:text-3xl">
                  More press{" "}
                  <em className="font-display italic text-[color:var(--rose)]">coverage.</em>
                </h2>
              </Reveal>
              <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {more.slice(0, 3).map((m) => (
                  <StaggerItem key={m.slug}>
                    <a
                      href={pressHref(m.slug)}
                      className="group block overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-shadow duration-500 hover:shadow-lift"
                    >
                      <div className="overflow-hidden bg-white">
                        <img
                          src={m.thumb}
                          alt={`${m.publication} clipping — ${m.headline}`}
                          loading="lazy"
                          className="w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="p-5">
                        <div className="text-xs font-bold uppercase tracking-widest text-[color:var(--rose)]">
                          {m.publication}
                        </div>
                        <h3 className="mt-2 font-display text-base font-semibold leading-snug text-[color:var(--plum)]">
                          {m.headline}
                        </h3>
                      </div>
                    </a>
                  </StaggerItem>
                ))}
              </Stagger>
              <Reveal delay={0.15}>
                <div className="mt-8 text-center">
                  <a
                    href="/press"
                    className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-6 py-3 text-sm font-semibold text-[color:var(--plum)] shadow-soft transition-colors duration-300 hover:border-[color:var(--rose)]/40 hover:text-[color:var(--rose)]"
                  >
                    View all press coverage
                  </a>
                </div>
              </Reveal>
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
      <FloatingCTA />
      <MobileBottomBar />
      <ScrollToTop />
    </>
  );
}
