import { HOMEPAGE_DEFAULTS } from "@/lib/homepage";
import { getSanityTreatmentsHub } from "@/sanity/lib/fetch";
import type { Locale } from "@/lib/i18n";

export const PATH = "/treatments";

export async function loadTreatmentsHub(locale: Locale = "en") {
  const cms = await getSanityTreatmentsHub(locale);
  const defaults = HOMEPAGE_DEFAULTS.treatments;
  const eyebrow = cms?.eyebrow || defaults.eyebrow;
  const heading =
    cms?.heading?.lead || cms?.heading?.em
      ? { lead: cms.heading?.lead || "", em: cms.heading?.em || "" }
      : defaults.heading;
  const subtitle = cms?.subtitle || defaults.subtitle;
  return { eyebrow, heading, subtitle, items: defaults.items };
}
