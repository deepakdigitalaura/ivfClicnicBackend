"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifyCredentials, createSession, destroySession, credsConfigured } from "@/lib/admin-auth";
import {
  saveRobots,
  saveScripts,
  saveRedirects,
  saveSitemap,
  saveSchema,
  savePageSeo,
  deletePageSeo,
  setInquiryStatus,
  deleteInquiry,
  type Inquiry,
} from "@/sanity/lib/admin";
import type {
  RobotsConfig,
  ScriptsConfig,
  RedirectsConfig,
  SitemapConfig,
  SchemaOrgConfig,
  PageSeo,
} from "@/sanity/lib/fetch";

// ── Auth ──

export async function loginAction(_prev: { error?: string } | null, formData: FormData) {
  if (!credsConfigured()) {
    return { error: "Login is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in Vercel, then redeploy." };
  }
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!verifyCredentials(email, password)) {
    return { error: "Incorrect email or password." };
  }
  await createSession();
  redirect("/admin-panel");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin-panel/login");
}

// ── Feature saves (each returns {ok} for the client toast) ──

type SaveResult = { ok: boolean; error?: string };

async function guard<T>(fn: () => Promise<T>): Promise<SaveResult> {
  try {
    await fn();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed" };
  }
}

export async function saveRobotsAction(data: RobotsConfig): Promise<SaveResult> {
  const r = await guard(() => saveRobots(data));
  revalidatePath("/admin-panel/robots");
  return r;
}

export async function saveScriptsAction(data: ScriptsConfig): Promise<SaveResult> {
  const r = await guard(() => saveScripts(data));
  revalidatePath("/admin-panel/scripts");
  return r;
}

export async function saveRedirectsAction(data: RedirectsConfig): Promise<SaveResult> {
  const r = await guard(() => saveRedirects(data));
  revalidatePath("/admin-panel/redirects");
  return r;
}

export async function saveSitemapAction(data: SitemapConfig): Promise<SaveResult> {
  const r = await guard(() => saveSitemap(data));
  revalidatePath("/admin-panel/sitemap");
  return r;
}

export async function saveSchemaAction(data: SchemaOrgConfig): Promise<SaveResult> {
  const r = await guard(() => saveSchema(data));
  revalidatePath("/admin-panel/schema");
  return r;
}

export async function savePageSeoAction(doc: PageSeo & { _id?: string }): Promise<SaveResult> {
  const r = await guard(() => savePageSeo(doc));
  revalidatePath("/admin-panel/page-seo");
  return r;
}

export async function deletePageSeoAction(id: string): Promise<SaveResult> {
  const r = await guard(() => deletePageSeo(id));
  revalidatePath("/admin-panel/page-seo");
  return r;
}

// ── Inquiries ──

export async function setInquiryStatusAction(id: string, status: Inquiry["status"]): Promise<SaveResult> {
  const r = await guard(() => setInquiryStatus(id, status));
  revalidatePath("/admin-panel/inquiries");
  revalidatePath("/admin-panel");
  return r;
}

export async function deleteInquiryAction(id: string): Promise<SaveResult> {
  const r = await guard(() => deleteInquiry(id));
  revalidatePath("/admin-panel/inquiries");
  revalidatePath("/admin-panel");
  return r;
}
