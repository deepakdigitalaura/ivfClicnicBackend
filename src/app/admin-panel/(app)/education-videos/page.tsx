import { readAdminEducationVideos } from "@/sanity/lib/admin";
import { EducationVideosManager } from "./manager";

export const dynamic = "force-dynamic";

export default async function EducationVideosAdminPage() {
  const items = await readAdminEducationVideos();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Education Videos</h1>
        <p className="admin-sub">
          Manage fertility education videos shown on /education-videos. Videos are grouped by Category tab.
        </p>
      </div>
      <EducationVideosManager initial={items} />
    </>
  );
}
