import { TranslationDemoBanner } from "@/components/translation-demo-banner";
import { SiteHeader } from "@/components/site-header";
import { Footer, Calculators } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";

// Demo-only Gujarati translation for boss preview. Not linked from nav, no SEO metadata.
// ponytail: calculator card labels are translated for display but the component's
// internal href-by-English-name lookup no longer matches, so cards render without
// links here. Fine for a static-copy preview; if this ships for real, add an
// href-by-index variant to <Calculators>.
const content = {
  eyebrow: "પ્રજનન સાધનો",
  heading: { lead: "અમારા નિષ્ણાતો દ્વારા", em: "મફત કેલ્ક્યુલેટર." },
  subtitle: "વ્યવહારુ, વિજ્ઞાન-આધારિત સાધનો જે તમને તમારી પ્રજનન ક્ષમતા ખાનગી અને તાત્કાલિક રીતે સમજવામાં મદદ કરે છે.",
  items: [
    "આઈવીએફ સફળતા દર કેલ્ક્યુલેટર",
    "ફળદ્રુપ સમયગાળો કેલ્ક્યુલેટર",
    "પુનરાવર્તિત કસુવાવડ જોખમ કેલ્ક્યુલેટર",
    "કુદરતી ગર્ભાવસ્થા કેલ્ક્યુલેટર",
    "આઈવીએફ ખર્ચ કેલ્ક્યુલેટર",
    "એએમએચ સ્તર અર્થઘટક",
    "ઓવ્યુલેશન કેલ્ક્યુલેટર",
    "વીર્ય વિશ્લેષણ કેલ્ક્યુલેટર",
  ],
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TranslationDemoBanner locale="gu" path="/calculators" />
      <SiteHeader />

      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[color:var(--rose)]">હોમ</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)]">કેલ્ક્યુલેટર</span>
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
