"use client";
import { TreatmentCard, TREATMENT_TITLE_HREFS } from "@/components/home-page";
import { Stagger, StaggerItem } from "@/components/motion";
import { resolveIcon } from "@/lib/icon-map";
import type { IconName } from "@/lib/icon-map";

/** Full, unfiltered treatments grid for the /treatments index page — unlike
 *  the homepage teaser section, every category is shown at every breakpoint. */
export function TreatmentsGrid({ items }: { items: { icon: IconName; t: string; d: string }[] }) {
  return (
    <Stagger className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
      {items.map(({ icon, t, d }) => (
        <StaggerItem key={t}>
          <TreatmentCard icon={resolveIcon(icon)} title={t} desc={d} href={TREATMENT_TITLE_HREFS[t]} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
