import { readAdminBlogs } from "@/sanity/lib/admin";
import { getDoctors } from "@/lib/payload";
import { BlogsManager } from "./manager";

export const dynamic = "force-dynamic";

export default async function BlogsAdminPage() {
  const [items, doctors] = await Promise.all([readAdminBlogs(), getDoctors()]);
  const doctorOptions = doctors.map((d) => ({
    slug: d.slug,
    name: d.name,
    role: d.role ?? "",
    credentials: d.credentials ?? "",
    avatarUrl: d.image ?? "",
  }));
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Blogs</h1>
        <p className="admin-sub">
          {items.length} articles · all visible at /blogs · CME articles at /cme.
        </p>
      </div>
      <BlogsManager initial={items} doctors={doctorOptions} />
    </>
  );
}
