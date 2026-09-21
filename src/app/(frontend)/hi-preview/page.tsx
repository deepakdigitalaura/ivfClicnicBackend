import { HomePage } from "@/components/home-page";
import { TranslationDemoBanner } from "@/components/translation-demo-banner";
import { buildPreviewHomepage } from "@/lib/homepage-preview-translations";

export const metadata = { title: "हिंदी पूर्वावलोकन — Bavishi Fertility Institute" };

// Demo-only Hindi translation preview of the homepage, for client approval.
// Not linked from nav/sitemap; static data (HOMEPAGE_DEFAULTS translation),
// no CMS fetch needed.
export default function Page() {
  const data = buildPreviewHomepage("hi");
  return (
    <>
      <TranslationDemoBanner locale="hi" path="/" />
      <HomePage data={data} testimonials={[]} />
    </>
  );
}
