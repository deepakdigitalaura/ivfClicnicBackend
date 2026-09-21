import { getHeader, getFooter } from "@/lib/payload";
import { HeaderProvider } from "@/components/header-provider";
import { FooterProvider } from "@/components/footer-provider";
import type { Locale } from "@/lib/i18n";

/** Re-wraps children in a locale-specific Header/Footer provider, shadowing
 *  the English one set by the root layout. Used by /hi and /gu segment layouts. */
export async function LocaleProviders({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const [header, footer] = await Promise.all([getHeader(locale), getFooter(locale)]);
  return (
    <HeaderProvider value={header}>
      <FooterProvider value={footer}>
        {/* lang drives the Indic-script typography overrides in styles.css */}
        <div lang={locale} className="contents">{children}</div>
      </FooterProvider>
    </HeaderProvider>
  );
}
