import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { payloadClient, getGlobalSafe } from "@/lib/payload";
import { HomeEditor } from "@/components/editor/HomeEditor";
import type { HomepageSource } from "@/lib/homepage";

/* =====================================================================
 * Inline editor for the Homepage (/edit/home).
 * ---------------------------------------------------------------------
 * Full-screen "edit in the preview" experience — no admin nav, no side panel.
 * Auth-gated: only a logged-in Payload user (same-origin session) may open it;
 * everyone else is bounced to the admin login. Force-dynamic + noindex. The
 * public homepage (`/`) is untouched.
 * ===================================================================== */
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function EditHomePage() {
  const payload = await payloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect("/admin/login?redirect=/edit/home");

  const source = (await getGlobalSafe("homepage")) as HomepageSource;
  return <HomeEditor initialSource={(source ?? {}) as NonNullable<HomepageSource>} />;
}
