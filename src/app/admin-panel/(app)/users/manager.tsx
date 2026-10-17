"use client";
import { useState, useTransition } from "react";
import { createAdminUserAction, deleteAdminUserAction } from "../../actions";

type UserRow = { _id: string; email: string; role: "superadmin" | "seo" };

export function UsersManager({ initial, currentEmail }: { initial: UserRow[]; currentEmail: string }) {
  const [items, setItems] = useState(initial);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"superadmin" | "seo">("seo");
  const [toast, setToast] = useState("");
  const [pending, startTransition] = useTransition();

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const add = () => {
    if (!email.trim() || password.length < 8) {
      flash("Email required, password must be at least 8 characters.");
      return;
    }
    startTransition(async () => {
      const r = await createAdminUserAction(email.trim(), password, role);
      if (!r.ok) { flash(`Error: ${r.error}`); return; }
      flash("Account created.");
      setEmail(""); setPassword(""); setRole("seo");
      window.location.reload();
    });
  };

  const del = (id: string, userEmail: string) => {
    if (userEmail === currentEmail) { flash("You can't delete your own account."); return; }
    if (!confirm(`Remove access for ${userEmail}?`)) return;
    startTransition(async () => {
      const r = await deleteAdminUserAction(id);
      if (!r.ok) { flash(`Error: ${r.error}`); return; }
      setItems((prev) => prev.filter((u) => u._id !== id));
      flash("Removed.");
    });
  };

  return (
    <div>
      {toast && <div className="admin-toast">{toast}</div>}

      <div className="admin-card" style={{ marginBottom: 24 }}>
        <h2 className="admin-h2" style={{ marginBottom: 16 }}>Add Account</h2>
        <div className="admin-form-grid">
          <label className="admin-label">Email
            <input className="admin-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="admin-label">Password (min 8 characters)
            <input className="admin-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <label className="admin-label">Role
            <select className="admin-input" value={role} onChange={(e) => setRole(e.target.value as "superadmin" | "seo")}>
              <option value="seo">SEO — can edit, can't delete</option>
              <option value="superadmin">Superadmin — full access</option>
            </select>
          </label>
        </div>
        <div style={{ marginTop: 16 }}>
          <button className="admin-btn" onClick={add} disabled={pending}>{pending ? "Adding…" : "+ Add Account"}</button>
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {items.map((u) => (
          <div key={u._id} className="admin-card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{u.email}</div>
              <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{u.role === "superadmin" ? "Superadmin" : "SEO"}</div>
            </div>
            <button className="admin-btn-ghost" style={{ fontSize: 12, color: "var(--destructive)" }} onClick={() => del(u._id, u.email)}>Delete</button>
          </div>
        ))}
        {items.length === 0 && <p className="admin-sub">No accounts yet — the legacy ADMIN_EMAIL/ADMIN_PASSWORD login still works until you add one.</p>}
      </div>
    </div>
  );
}
