"use client";
import { useEffect, useState } from "react";
import Script from "next/script";
import type { ScriptEntry } from "@/sanity/lib/fetch";
import { CONSENT_CHANGE_EVENT, hasAnalyticsConsent } from "@/components/cookie-consent";

/** Renders analytics/marketing scripts only once the visitor has accepted cookies.
 *  Necessary scripts bypass this entirely and render server-side in the layout. */
export function ConsentScripts({ scripts }: { scripts: ScriptEntry[] }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(hasAnalyticsConsent());
    const onChange = () => setAllowed(hasAnalyticsConsent());
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
  }, []);

  if (!allowed) return null;

  return (
    <>
      {scripts.map((s, i) => (
        <Script
          key={i}
          id={`consent-script-${i}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: s.code! }}
        />
      ))}
    </>
  );
}
