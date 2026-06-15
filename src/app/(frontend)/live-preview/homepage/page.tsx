import type { Metadata } from "next";
import { HomePageLive } from "@/components/home-page-live";
import { getGlobalSafe } from "@/lib/payload";
import type { HomepageSource } from "@/lib/homepage";

/* =====================================================================
 * Live Preview render target for the Homepage global (admin iframe only).
 * ---------------------------------------------------------------------
 * Loaded inside the Payload admin's side-by-side Live Preview. Force-dynamic so
 * it always reflects the current saved global as the starting point; the admin
 * then streams unsaved edits over postMessage (see HomePageLive). The PUBLIC
 * homepage route (`/`) is untouched and stays static/ISR. Not indexed.
 * ===================================================================== */
export const dynamic = "force-dynamic";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function HomepageLivePreview() {
  const source = (await getGlobalSafe("homepage")) as HomepageSource;
  return <HomePageLive initialSource={source} />;
}
