"use client";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/home-page";
import { RichText } from "@/components/rich-text";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";

type LegalPageProps = {
  title: string;
  subtitle?: string | null;
  content?: unknown;
  lastUpdated?: string | null;
};

export function LegalPage({ title, subtitle, content, lastUpdated }: LegalPageProps) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[color:var(--cream)]">
        <section className="relative overflow-hidden bg-gradient-to-b from-[color:var(--plum)] to-[color:var(--plum-dark,#3a1c4f)] py-20 text-center text-white md:py-28">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
          </div>
          <div className="relative mx-auto max-w-3xl px-6">
            <h1 className="font-display text-3xl font-semibold leading-tight md:text-5xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-4 text-base text-white/70 md:text-lg">{subtitle}</p>
            )}
            {lastUpdated && (
              <p className="mt-3 text-sm text-white/50">
                Last updated: {new Date(lastUpdated).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          {content ? (
            <div className="prose prose-plum max-w-none prose-headings:font-display prose-headings:text-[color:var(--plum)] prose-h2:mt-10 prose-h2:text-2xl prose-h3:mt-8 prose-h3:text-xl prose-p:text-[color:var(--text)] prose-p:leading-relaxed prose-li:text-[color:var(--text)] prose-strong:text-[color:var(--plum)] prose-a:text-[color:var(--rose)] prose-a:underline hover:prose-a:text-[color:var(--plum)]">
              <RichText data={content as DefaultTypedEditorState} />
            </div>
          ) : (
            <p className="text-center text-[color:var(--text-muted)]">
              Content coming soon.
            </p>
          )}
        </section>
      </main>
      <Footer />
      <FloatingCTA />
      <MobileBottomBar />
      <ScrollToTop />
    </>
  );
}
