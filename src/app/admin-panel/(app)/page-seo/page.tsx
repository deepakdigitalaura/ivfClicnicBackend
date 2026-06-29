import { readAllPageSeo } from "@/sanity/lib/admin";
import { PageSeoManager } from "./manager";

export const dynamic = "force-dynamic";

export default async function PageSeoPage() {
  const entries = await readAllPageSeo();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Page SEO</h1>
        <p className="admin-sub">Set the title, description &amp; social preview for any page.</p>
      </div>
      <PageSeoManager initial={entries} />
    </>
  );
}
