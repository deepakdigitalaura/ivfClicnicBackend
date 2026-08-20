import { readRedirects } from "@/sanity/lib/admin";
import { RedirectsForm } from "./form";

export const dynamic = "force-dynamic";

export default async function RedirectsPage() {
  const data = await readRedirects();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Redirects</h1>
        <p className="admin-sub">Send old or changed URLs to a new destination (301/302).</p>
      </div>
      <RedirectsForm initial={data} />
    </>
  );
}
