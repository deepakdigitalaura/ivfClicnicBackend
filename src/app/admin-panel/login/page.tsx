import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/admin-auth";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/admin-panel");
  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <span className="admin-brand-mark">BF</span>
          <span className="admin-login-title">BFI Admin</span>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
