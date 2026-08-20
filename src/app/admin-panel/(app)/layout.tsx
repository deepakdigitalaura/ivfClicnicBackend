import { redirect } from "next/navigation";
import { getSession } from "@/lib/admin-auth";
import { Sidebar } from "./_components/sidebar";

export default async function AdminAppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin-panel/login");
  return (
    <div className="admin-shell">
      <Sidebar role={session.role} />
      <main className="admin-main">{children}</main>
    </div>
  );
}
