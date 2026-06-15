import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { payloadClient, getGlobalSafe } from "@/lib/payload";
import { AboutEditor } from "@/components/editor/AboutEditor";
import type { AboutSource } from "@/lib/about";

/* =====================================================================
 * Inline editor for the About-BFI page (/edit/about-bfi).
 * Auth-gated; edits the `about-page` global. Mirrors /edit/home.
 * ===================================================================== */
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function EditAboutPage() {
  const payload = await payloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect("/admin/login?redirect=/edit/about-bfi");

  const source = (await getGlobalSafe("about-page")) as AboutSource;
  return <AboutEditor initialSource={(source ?? {}) as NonNullable<AboutSource>} />;
}
