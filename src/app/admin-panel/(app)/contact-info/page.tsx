import { readContactInfo } from "@/sanity/lib/admin";
import { ContactInfoForm } from "./form";

export const dynamic = "force-dynamic";

export default async function ContactInfoPage() {
  const doc = await readContactInfo();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Contact Cards</h1>
        <p className="admin-sub">The Call / WhatsApp / Email / Hours cards shown on the Contact page. Leave empty to keep the built-in cards.</p>
      </div>
      <ContactInfoForm initial={doc} />
    </>
  );
}
