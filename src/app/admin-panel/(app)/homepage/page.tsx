import { readHomepage } from "@/sanity/lib/admin";
import { HOMEPAGE_DEFAULTS } from "@/lib/homepage";
import { HomepageEditor } from "./editor";

export const dynamic = "force-dynamic";

export default async function HomepageAdminPage() {
  const doc = await readHomepage();
  // The editor renders full-screen (fixed overlay with its own top bar), so it
  // intentionally covers the admin shell sidebar for maximum preview width.
  return <HomepageEditor initial={doc} defaults={HOMEPAGE_DEFAULTS} />;
}
