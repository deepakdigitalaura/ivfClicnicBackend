import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/admin-auth";
import { Sidebar } from "./_components/sidebar";

export default async function AdminAppLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) redirect("/admin-panel/login");
  return (
    <div className="admin-shell">
      <Sidebar />
      <main className="admin-main">{children}</main>
    </div>
  );
}
