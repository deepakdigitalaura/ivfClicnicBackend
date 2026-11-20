import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";

/* Lets the admin-panel link tool warn on internal URLs that don't resolve,
 * instead of silently saving a typo/guessed path (e.g. /recurrent-pregnancy-loss
 * instead of /treatments/recurrent-miscarriage). Only checks internal paths;
 * external http(s) links are left alone. */
export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const path = req.nextUrl.searchParams.get("path");
  if (!path || !path.startsWith("/")) {
    return NextResponse.json({ error: "path must be an internal path starting with /" }, { status: 400 });
  }

  const target = new URL(path, req.nextUrl.origin);
  try {
    const res = await fetch(target, { method: "GET", redirect: "manual" });
    const ok = res.status < 400 || (res.status >= 300 && res.status < 400);
    return NextResponse.json({ ok, status: res.status });
  } catch {
    return NextResponse.json({ ok: false, status: 0 });
  }
}
