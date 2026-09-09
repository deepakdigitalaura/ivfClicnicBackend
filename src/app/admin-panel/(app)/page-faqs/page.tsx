import { readPageFaqs } from "@/sanity/lib/admin";
import { PageFaqsForm } from "./form";

export const dynamic = "force-dynamic";

export default async function PageFaqsPage() {
  const data = await readPageFaqs();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Page FAQs</h1>
        <p className="admin-sub">
          Manage the FAQ section shown on each category page. Leave a page's FAQs empty to use its
          default set.
        </p>
      </div>
      <PageFaqsForm initial={data} />
    </>
  );
}
