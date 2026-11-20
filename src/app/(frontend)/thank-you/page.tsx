import type { Metadata } from "next";
import { ThankYouPage } from "@/components/thank-you-page";
import { getGlobalSafe } from "@/lib/payload";
import { resolveContactValues } from "@/lib/contact";

/* =====================================================================
 * /thank-you — where the inquiry form lands after a successful submit.
 * ---------------------------------------------------------------------
 * noindex, and deliberately left out of the sitemap: a thank-you page has
 * no search value, and letting it rank would add visitors who never filled
 * the form to whatever conversion is measured on this URL.
 * ===================================================================== */

const TITLE = "Thank you — we've received your enquiry | Bavishi Fertility Institute";
const DESCRIPTION =
  "Your enquiry has reached our team. A fertility counsellor will call you shortly.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: true },
  alternates: { canonical: "/thank-you" },
};

export default async function Page() {
  const contact = resolveContactValues(await getGlobalSafe("site-settings"));
  return <ThankYouPage contact={contact} />;
}
