import { readHeaderNav } from "@/sanity/lib/admin";
import { HeaderNavForm } from "./form";

export const dynamic = "force-dynamic";

export default async function HeaderNavPage() {
  const doc = await readHeaderNav();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Header &amp; Navigation</h1>
        <p className="admin-sub">Logo, top-level menu and the main button. Leave empty to keep the built-in menu. The Doctors panel, IVF Treatments/Maternity/Locations mega menus stay auto-generated from their own sections and are not edited here.</p>
      </div>
      <HeaderNavForm initial={doc} />
    </>
  );
}
