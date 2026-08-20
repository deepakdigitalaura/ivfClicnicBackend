import { readAdminTestimonials } from "@/sanity/lib/admin";
import { TestimonialsManager } from "./manager";

export const dynamic = "force-dynamic";

export default async function TestimonialsAdminPage() {
  const items = await readAdminTestimonials();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Testimonials</h1>
        <p className="admin-sub">Manage text &amp; video testimonials. Live on the homepage and /testimonial-videos.</p>
      </div>
      <TestimonialsManager initial={items} />
    </>
  );
}
