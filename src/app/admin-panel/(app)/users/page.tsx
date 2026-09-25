import { redirect } from "next/navigation";
import { getSession } from "@/lib/admin-auth";
import { readAdminUsers } from "@/sanity/lib/admin";
import { UsersManager } from "./manager";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const session = await getSession();
  if (session?.role !== "superadmin") redirect("/admin-panel");
  const users = await readAdminUsers();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Team & Access</h1>
        <p className="admin-sub">Add, remove, and set roles for admin panel accounts. SEO accounts can edit content but can't delete anything or access this page.</p>
      </div>
      <UsersManager initial={users.map((u) => ({ _id: u._id!, email: u.email, role: u.role }))} currentEmail={session.email} />
    </>
  );
}
