import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { payloadClient } from "@/lib/payload";
import { PagesLauncher } from "@/components/editor/PagesLauncher";

/* Auth-gated "Pages & Builder" launchpad (linked from the admin sidebar). */
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function StudioPages() {
  const payload = await payloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect("/admin/login?redirect=/studio/pages");
  return <PagesLauncher />;
}
