"use client";

import { AwardsStage, PressStage } from "@/components/home-page";
import { SectionHead } from "@/components/ivf-page";
import { Reveal } from "@/components/motion";
import { GUJARAT_AWARDS, pressForCity } from "@/lib/gujarat-credibility";

/* Awards and press sections for the Ahmedabad city and centre pages.
 *
 * Both reuse the carousels the homepage already ships, so the cards look
 * and behave exactly as they do there — no second implementation to keep
 * in step. What changes is the input: these are fed the Gujarat and
 * Ahmedabad subsets rather than the national list.
 *
 * Each section renders nothing when its list is empty, so a city with no
 * local recognition on file simply doesn't get the band. */

const MoreLink = ({ href, label }: { href: string; label: string }) => (
  <Reveal delay={0.25}>
    <div className="mt-8 text-center">
      <a
        href={href}
        className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-6 py-3 text-sm font-semibold text-[color:var(--plum)] shadow-soft transition-colors duration-300 hover:border-[color:var(--rose)]/40 hover:text-[color:var(--rose)]"
      >
        {label}
      </a>
    </div>
  </Reveal>
);

export function LocalAwards({ city }: { city: string }) {
  if (GUJARAT_AWARDS.length === 0) return null;
  return (
    <section className="bg-white py-10 md:py-16">
      <div className="container-px mx-auto max-w-[1400px]">
        <SectionHead
          center
          eyebrow="Awards &amp; Recognition"
          title={
            <>
              Recognised as a leading{" "}
              <em className="font-display italic text-[color:var(--rose)]">
                IVF centre in Gujarat
              </em>
            </>
          }
          subtitle={`Awards and recognitions earned across Gujarat, including ${city}.`}
        />
        <AwardsStage items={GUJARAT_AWARDS} />
        <MoreLink href="/awards" label="See all awards" />
      </div>
    </section>
  );
}

export function LocalPress({ city }: { city: string }) {
  const { items, label, publications } = pressForCity(city);
  if (items.length === 0) return null;
  return (
    <section className="py-10 md:py-16">
      <div className="container-px mx-auto max-w-[1400px]">
        <SectionHead
          center
          eyebrow="News &amp; Media"
          title={
            <>
              Our work in the{" "}
              <em className="font-display italic text-[color:var(--rose)]">
                {label} press
              </em>
            </>
          }
          subtitle={`Reported in ${publications}.`}
        />
        <PressStage items={items} />
        <MoreLink href="/press" label="Read all coverage" />
      </div>
    </section>
  );
}
