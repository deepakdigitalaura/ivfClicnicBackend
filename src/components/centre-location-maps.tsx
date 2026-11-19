"use client";

import { ExternalLink, Navigation, Star } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { centreMapUrl, type Centre } from "@/lib/locations";
import { getReviews } from "@/lib/reviews";

/* One map per centre, with the centre's own card floating on it.
 *
 * Replaces the single combined map. A shared map answers "where are they
 * all" but not "which one do I go to": every pin looks alike, and the
 * address, rating and directions link live somewhere else on the page.
 * Putting each centre's card on its own map answers both at a glance, and
 * is the layout the reference uses.
 *
 * The embed is Google's keyless `maps?q=…&output=embed`, the same one the
 * rest of the site already uses, so there is no API key, no third-party
 * script and no extra licence to track.
 *
 * Rating and review count come from the build-time review cache and are
 * rendered ONLY when that cache actually holds them — a centre with no
 * synced reviews shows the card without a rating rather than a zero. */

function MapCard({ centre }: { centre: Centre }) {
  const agg = getReviews(centre.slug)?.aggregate;
  const mapsUrl = centreMapUrl(centre);

  return (
    <div className="relative h-[400px] overflow-hidden rounded-3xl border border-border/70 shadow-soft">
      <iframe
        title={`${centre.fullName} — map`}
        src={`https://maps.google.com/maps?q=${encodeURIComponent(centre.mapQuery)}&output=embed`}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      <div className="pointer-events-none absolute inset-x-4 top-4 flex">
        <div className="pointer-events-auto w-full max-w-[320px] rounded-2xl bg-white/95 p-4 shadow-lift ring-1 ring-black/5 backdrop-blur">
          <h3 className="text-[15px] font-semibold leading-snug text-[color:var(--plum)]">
            {centre.fullName}
          </h3>
          <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-muted-foreground">
            {centre.address}
          </p>

          {agg?.ratingValue ? (
            <div className="mt-2 flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-[#f5a623] text-[#f5a623]" />
              <span className="text-[13px] font-semibold text-[color:var(--plum)]">
                {agg.ratingValue}
              </span>
              {agg.reviewCount ? (
                <span className="text-[12px] text-muted-foreground">
                  ({agg.reviewCount.toLocaleString("en-IN")})
                </span>
              ) : null}
            </div>
          ) : null}

          <div className="mt-3 flex items-center gap-2">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[color:var(--rose)] px-3.5 py-2 text-[12.5px] font-semibold text-white transition hover:brightness-110"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Open in Maps
            </a>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Directions to ${centre.fullName}`}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[color:var(--plum)]/15 text-[color:var(--plum)] transition hover:bg-[color:var(--rose-soft)]/40"
            >
              <Navigation className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CentreLocationMaps({ centres }: { centres: Centre[] }) {
  const withMaps = centres.filter((c) => c.mapQuery);
  if (withMaps.length === 0) return null;

  return (
    <Reveal delay={0.1}>
      <Stagger
        className={`grid gap-6 ${
          withMaps.length === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
        }`}
      >
        {withMaps.map((c) => (
          <StaggerItem key={c.slug}>
            <MapCard centre={c} />
          </StaggerItem>
        ))}
      </Stagger>
    </Reveal>
  );
}
