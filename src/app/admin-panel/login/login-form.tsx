"use client";
import { useActionState } from "react";
import { loginAction } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);
  return (
    <form action={action}>
      {state?.error && <div className="admin-login-error">{state.error}</div>}
      <div className="admin-field">
        <label className="admin-label" htmlFor="email">Email</label>
        <input className="admin-input" id="email" name="email" type="email" autoComplete="username" required />
      </div>
      <div className="admin-field">
        <label className="admin-label" htmlFor="password">Password</label>
        <input className="admin-input" id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <button className="admin-btn" type="submit" disabled={pending} style={{ width: "100%", justifyContent: "center", marginTop: 6 }}>
        {pending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
