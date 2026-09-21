"use client";

import { SiteHeader } from "@/components/site-header";
import { Footer, TreatmentCard, TREATMENT_TITLE_HREFS } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { SectionHead } from "@/components/ivf-page";
import { Stagger, StaggerItem } from "@/components/motion";
import { resolveIcon } from "@/lib/icon-map";
import { HOMEPAGE_DEFAULTS } from "@/lib/homepage";
import { TranslationDemoBanner } from "@/components/translation-demo-banner";

// Demo-only Hindi translation of /treatments. Preview for boss approval — not
// linked from nav, not indexed, no SEO metadata. Reuses TreatmentCard/href
// map by keeping the original English `t` for lookup and only swapping the
// *displayed* title/description via titleNode/descNode.
const HI = {
  eyebrow: "इलाज",
  heading: { lead: "प्रजनन देखभाल,", em: "पूर्ण और सुविचारित।" },
  subtitle: "हमारे हर इलाज में एक जैसी क्लिनिकल उत्कृष्टता और भावनात्मक देखभाल दी जाती है।",
  items: [
    { t: "पुरुष बांझपन (Male Infertility)", d: "पुरुष कारकों की संपूर्ण जांच और इलाज।" },
    { t: "महिला बांझपन (Female Infertility)", d: "हर महिला प्रजनन समस्या के लिए व्यक्तिगत उपचार योजना।" },
    { t: "एडवांस्ड फर्टिलिटी तकनीकें", d: "नवीनतम असिस्टेड रिप्रोडक्शन प्रोटोकॉल।" },
    { t: "आईयूआई (IUI)", d: "चुनिंदा प्रजनन प्रोफाइल के लिए इंट्रायूटेराइन इनसेमिनेशन।" },
    { t: "आईवीएफ / आईसीएसआई / एआरटी (IVF / ICSI / ART)", d: "आईसीएसआई सहित एडवांस्ड इन-विट्रो फर्टिलाइजेशन।" },
    { t: "फर्टिलिटी प्रिजर्वेशन", d: "भविष्य के लिए एग, स्पर्म और भ्रूण फ्रीजिंग।" },
    { t: "स्पर्म डोनेशन", d: "जांचे-परखे, नैतिक स्पर्म डोनर कार्यक्रम।" },
    { t: "एग डोनेशन", d: "सावधानीपूर्वक मिलान किए गए एग डोनर कार्यक्रम।" },
    { t: "फाइब्रॉएड्स", d: "निदान और प्रजनन-सुरक्षित इलाज।" },
    { t: "एंडोमेट्रियोसिस", d: "विशेष एंडोमेट्रियोसिस प्रजनन देखभाल।" },
    { t: "ओवेरियन रिजुविनेशन", d: "कम ओवेरियन रिजर्व के लिए एडवांस्ड थेरेपी।" },
    { t: "हाई रिस्क प्रसूति (High Risk Obstetrics)", d: "जटिल गर्भावस्थाओं के लिए विशेषज्ञ देखभाल।" },
    { t: "मातृत्व सेवाएं", d: "संपूर्ण मातृत्व और नवजात देखभाल।" },
  ],
};

export default function Page() {
  const { items: originalItems } = HOMEPAGE_DEFAULTS.treatments;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TranslationDemoBanner locale="hi" path="/treatments" />
      <SiteHeader />

      <section className="container-px mx-auto max-w-[1400px] py-12 md:py-16">
        <SectionHead
          center
          as="h1"
          eyebrow={HI.eyebrow}
          title={<>{HI.heading.lead} <em className="font-display italic text-[color:var(--rose)]">{HI.heading.em}</em></>}
          subtitle={HI.subtitle}
        />
        <Stagger className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
          {originalItems.map((orig, i) => {
            const translated = HI.items[i];
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
