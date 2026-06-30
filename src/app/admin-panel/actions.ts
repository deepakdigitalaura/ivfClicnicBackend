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
  saveDoctor,
  deleteDoctor,
  saveTestimonial,
  deleteTestimonial,
  saveHomepage,
  saveSiteSettings,
  saveEducationVideo,
  deleteEducationVideo,
  deleteBlog,
  type Inquiry,
  type AdminDoctor,
  type AdminTestimonial,
  type AdminHomepage,
  type AdminSiteSettings,
  type AdminEducationVideo,
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

// ── Doctors ──

/** Revalidate every public surface that renders doctor data. */
function revalidateDoctorPages() {
  revalidatePath("/doctors");
  revalidatePath("/doctors/[slug]", "page");
  revalidatePath("/"); // homepage doctor cards
  revalidatePath("/admin-panel/doctors");
}

export async function saveDoctorAction(doc: AdminDoctor): Promise<SaveResult> {
  const r = await guard(() => saveDoctor(doc));
  revalidateDoctorPages();
  return r;
}

export async function deleteDoctorAction(id: string): Promise<SaveResult> {
  const r = await guard(() => deleteDoctor(id));
  revalidateDoctorPages();
  return r;
}

// ── Testimonials ──

function revalidateTestimonialPages() {
  revalidatePath("/"); // homepage patient-review cards
  revalidatePath("/testimonial-videos");
  revalidatePath("/admin-panel/testimonials");
}

export async function saveTestimonialAction(doc: AdminTestimonial): Promise<SaveResult> {
  const r = await guard(() => saveTestimonial(doc));
  revalidateTestimonialPages();
  return r;
}

export async function deleteTestimonialAction(id: string): Promise<SaveResult> {
  const r = await guard(() => deleteTestimonial(id));
  revalidateTestimonialPages();
  return r;
}

// ── Homepage ──

export async function saveHomepageAction(data: AdminHomepage): Promise<SaveResult> {
  const r = await guard(() => saveHomepage(data));
  revalidatePath("/");
  revalidatePath("/admin-panel/homepage");
  return r;
}

// ── Site Settings (affects every page: header, footer, schema, contact) ──

export async function saveSiteSettingsAction(data: AdminSiteSettings): Promise<SaveResult> {
  const r = await guard(() => saveSiteSettings(data));
  revalidatePath("/", "layout"); // header/footer/schema render on every page
  revalidatePath("/admin-panel/site-settings");
  return r;
}

// ── Education Videos ──

function revalidateEducationVideoPages() {
  revalidatePath("/education-videos");
  revalidatePath("/admin-panel/education-videos");
}

export async function saveEducationVideoAction(doc: AdminEducationVideo): Promise<SaveResult> {
  const r = await guard(() => saveEducationVideo(doc));
  revalidateEducationVideoPages();
  return r;
}

export async function deleteEducationVideoAction(id: string): Promise<SaveResult> {
  const r = await guard(() => deleteEducationVideo(id));
  revalidateEducationVideoPages();
  return r;
}

// ── Blogs ──

function revalidateBlogPages(slug?: string) {
  revalidatePath("/blogs");
  revalidatePath("/cme");
  revalidatePath("/admin-panel/blogs");
  if (slug) revalidatePath(`/blogs/${slug}`);
}

export async function deleteBlogAction(id: string, slug?: string): Promise<SaveResult> {
  const r = await guard(() => deleteBlog(id));
  revalidateBlogPages(slug);
  return r;
}
