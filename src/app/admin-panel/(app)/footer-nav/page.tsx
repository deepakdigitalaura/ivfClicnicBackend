import { readFooterNav } from "@/sanity/lib/admin";
import { FooterNavForm } from "./form";

export const dynamic = "force-dynamic";

export default async function FooterNavPage() {
  const doc = await readFooterNav();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Footer</h1>
        <p className="admin-sub">Footer link columns, social links, copyright and bottom legal links. Leave empty to keep the built-in footer. The Treatments/Doctors/Locations groups are auto-generated from their own sections and are not edited here.</p>
      </div>
      <FooterNavForm initial={doc} />
    </>
  );
}
