import { TranslationDemoBanner } from "@/components/translation-demo-banner";
import { SiteHeader } from "@/components/site-header";
import { Footer, Calculators } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";

// Demo-only Hindi translation for boss preview. Not linked from nav, no SEO metadata.
// ponytail: calculator card labels are translated for display but the component's
// internal href-by-English-name lookup no longer matches, so cards render without
// links here. Fine for a static-copy preview; if this ships for real, add an
// href-by-index variant to <Calculators>.
const content = {
  eyebrow: "प्रजनन उपकरण",
  heading: { lead: "हमारे विशेषज्ञों द्वारा", em: "निःशुल्क कैलकुलेटर।" },
  subtitle: "व्यावहारिक, विज्ञान-आधारित उपकरण जो आपको अपनी प्रजनन क्षमता को निजी और तुरंत समझने में मदद करते हैं।",
  items: [
    "आईवीएफ सफलता दर कैलकुलेटर",
    "उर्वर अवधि कैलकुलेटर",
    "बार-बार गर्भपात जोखिम कैलकुलेटर",
    "प्राकृतिक गर्भावस्था कैलकुलेटर",
    "आईवीएफ लागत कैलकुलेटर",
    "एएमएच स्तर व्याख्याता",
    "ओव्यूलेशन कैलकुलेटर",
    "वीर्य विश्लेषण कैलकुलेटर",
  ],
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TranslationDemoBanner locale="hi" path="/calculators" />
      <SiteHeader />

      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[color:var(--rose)]">होम</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)]">कैलकुलेटर</span>
        </nav>
      </div>

      <Calculators as="h1" content={content} />

      <Footer />
      <FloatingCTA />
      <ScrollToTop />
      <MobileBottomBar />
    </div>
  );
}
