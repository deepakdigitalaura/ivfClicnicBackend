import { readInquiries } from "@/sanity/lib/admin";
import { InquiriesList } from "./list";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  const inquiries = await readInquiries();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Inquiries</h1>
        <p className="admin-sub">Leads submitted through the website contact form.</p>
      </div>
      <InquiriesList initial={inquiries} />
    </>
  );
}
