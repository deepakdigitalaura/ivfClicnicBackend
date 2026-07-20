import { readAbout } from "@/sanity/lib/admin";
import { AboutForm } from "./form";

export const dynamic = "force-dynamic";

export default async function AboutAdminPage() {
  const doc = await readAbout();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">About Page</h1>
        <p className="admin-sub">Edit the story, milestones and trust content on /about-bfi. Fields start filled with the current live content.</p>
      </div>
      <AboutForm initial={doc} />
    </>
  );
}
