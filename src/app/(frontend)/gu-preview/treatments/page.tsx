"use client";

import { SiteHeader } from "@/components/site-header";
import { Footer, TreatmentCard, TREATMENT_TITLE_HREFS } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { SectionHead } from "@/components/ivf-page";
import { Stagger, StaggerItem } from "@/components/motion";
import { resolveIcon } from "@/lib/icon-map";
import { HOMEPAGE_DEFAULTS } from "@/lib/homepage";
import { TranslationDemoBanner } from "@/components/translation-demo-banner";

// Demo-only Gujarati translation of /treatments. Preview for boss approval —
// not linked from nav, not indexed, no SEO metadata. Reuses TreatmentCard/href
// map by keeping the original English `t` for lookup and only swapping the
// *displayed* title/description via titleNode/descNode.
const GU = {
  eyebrow: "સારવાર",
  heading: { lead: "પ્રજનન સંભાળ,", em: "સંપૂર્ણ અને સુવિચારિત." },
  subtitle: "અમારી દરેક સારવાર એક જ સ્તરની ક્લિનિકલ શ્રેષ્ઠતા અને લાગણીશીલ સંભાળ સાથે આપવામાં આવે છે.",
  items: [
    { t: "પુરુષ વંધ્યત્વ (Male Infertility)", d: "પુરુષ પરિબળોની સંપૂર્ણ તપાસ અને સારવાર." },
    { t: "સ્ત્રી વંધ્યત્વ (Female Infertility)", d: "દરેક સ્ત્રી પ્રજનન સમસ્યા માટે વ્યક્તિગત સારવાર યોજના." },
    { t: "એડવાન્સ્ડ ફર્ટિલિટી ટેકનિક", d: "નવીનતમ આસિસ્ટેડ રિપ્રોડક્શન પ્રોટોકોલ." },
    { t: "આઈયુઆઈ (IUI)", d: "પસંદગીની પ્રજનન પ્રોફાઇલ માટે ઇન્ટ્રાયુટેરાઇન ઇન્સેમિનેશન." },
    { t: "આઈવીએફ / આઈસીએસઆઈ / એઆરટી (IVF / ICSI / ART)", d: "આઈસીએસઆઈ સાથે એડવાન્સ્ડ ઇન-વિટ્રો ફર્ટિલાઇઝેશન." },
    { t: "ફર્ટિલિટી પ્રિઝર્વેશન", d: "ભવિષ્ય માટે એગ, સ્પર્મ અને ભ્રૂણ ફ્રીઝિંગ." },
    { t: "સ્પર્મ ડોનેશન", d: "તપાસેલા, નૈતિક સ્પર્મ ડોનર કાર્યક્રમો." },
    { t: "એગ ડોનેશન", d: "કાળજીપૂર્વક મેચ કરેલા એગ ડોનર કાર્યક્રમો." },
    { t: "ફાઈબ્રોઈડ્સ", d: "નિદાન અને પ્રજનન-સંરક્ષક સારવાર." },
    { t: "એન્ડોમેટ્રિઓસિસ", d: "વિશિષ્ટ એન્ડોમેટ્રિઓસિસ પ્રજનન સંભાળ." },
    { t: "ઓવેરિયન રિજુવિનેશન", d: "ઓછા ઓવેરિયન રિઝર્વ માટે એડવાન્સ્ડ થેરાપી." },
    { t: "હાઈ રિસ્ક પ્રસૂતિ (High Risk Obstetrics)", d: "જટિલ ગર્ભાવસ્થાઓ માટે નિષ્ણાત સંભાળ." },
    { t: "માતૃત્વ સેવાઓ", d: "સંપૂર્ણ માતૃત્વ અને નવજાત સંભાળ." },
  ],
};

export default function Page() {
  const { items: originalItems } = HOMEPAGE_DEFAULTS.treatments;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TranslationDemoBanner locale="gu" path="/treatments" />
      <SiteHeader />

      <section className="container-px mx-auto max-w-[1400px] py-12 md:py-16">
        <SectionHead
          center
          as="h1"
          eyebrow={GU.eyebrow}
          title={<>{GU.heading.lead} <em className="font-display italic text-[color:var(--rose)]">{GU.heading.em}</em></>}
          subtitle={GU.subtitle}
        />
        <Stagger className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
          {originalItems.map((orig, i) => {
            const translated = GU.items[i];
            return (
              <StaggerItem key={orig.t}>
                <TreatmentCard
                  icon={resolveIcon(orig.icon)}
                  title={orig.t}
                  desc={orig.d}
                  titleNode={translated.t}
                  descNode={translated.d}
                  href={TREATMENT_TITLE_HREFS[orig.t]}
                />
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      <Footer />
      <FloatingCTA />
      <ScrollToTop />
      <MobileBottomBar />
    </div>
  );
}
