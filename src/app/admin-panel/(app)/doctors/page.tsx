import { readAdminDoctors } from "@/sanity/lib/admin";
import { DoctorsManager } from "./manager";

export const dynamic = "force-dynamic";

export default async function DoctorsAdminPage() {
  const sanityDoctors = await readAdminDoctors();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Doctors</h1>
        <p className="admin-sub">Add or edit doctor profiles. Live on /doctors.</p>
      </div>
      <DoctorsManager initial={sanityDoctors} />
    </>
  );
}
