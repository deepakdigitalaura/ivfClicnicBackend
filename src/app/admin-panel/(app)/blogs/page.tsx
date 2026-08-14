import { readAdminBlogs } from "@/sanity/lib/admin";
import { BlogsManager } from "./manager";

export const dynamic = "force-dynamic";

export default async function BlogsAdminPage() {
  const items = await readAdminBlogs();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Blogs</h1>
        <p className="admin-sub">
          {items.length} articles · all visible at /blogs · CME articles at /cme.
        </p>
      </div>
      <BlogsManager initial={items} />
    </>
  );
}
