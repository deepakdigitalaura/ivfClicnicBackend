import type { Metadata } from "next";
import { HomePageLive } from "@/components/home-page-live";
import { getHomepage } from "@/lib/payload";

/* =====================================================================
 * Live-preview render target for the Homepage editor (admin iframe only).
 * ---------------------------------------------------------------------
 * force-dynamic so it always reflects the current saved Sanity homepage as the
 * starting point; the branded admin editor then streams unsaved edits over
 * postMessage (see HomePageLive). The PUBLIC homepage route (`/`) is untouched
 * and stays static/ISR. Not indexed.
 * ===================================================================== */
export const dynamic = "force-dynamic";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function HomepageLivePreview() {
  const data = await getHomepage();
  return <HomePageLive initialData={data} />;
}
