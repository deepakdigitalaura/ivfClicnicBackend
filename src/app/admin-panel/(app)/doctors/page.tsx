import { readAdminDoctors } from "@/sanity/lib/admin";
import { DOCTORS } from "@/lib/doctors";
import { DoctorsManager } from "./manager";

export const dynamic = "force-dynamic";

export default async function DoctorsAdminPage() {
  const sanityDoctors = await readAdminDoctors();
  // Code doctors shown as a reference so staff can override by matching slug.
  const codeDoctors = DOCTORS.map((d) => ({
    slug: d.slug,
    name: d.name,
    specialty: d.specialty,
    image: d.image,
  }));
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Doctors</h1>
        <p className="admin-sub">Add new doctors or override the built-in profiles. Live on /doctors.</p>
      </div>
      <DoctorsManager initial={sanityDoctors} codeDoctors={codeDoctors} />
    </>
  );
}
