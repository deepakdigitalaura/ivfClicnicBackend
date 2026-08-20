"use server";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { verifyCredentials, createSession, destroySession, credsConfigured, getSession, hashPassword, type AdminUser } from "@/lib/admin-auth";
import { saveAdminUser, deleteAdminUser } from "@/sanity/lib/admin";
import {
  saveRobots,
  saveScripts,
  saveCamps,
  saveRedirects,
  saveSitemap,
  saveSchema,
  savePageSeo,
  deletePageSeo,
  setInquiryStatus,
  deleteInquiry,
  saveDoctor,
  deleteDoctor,
  saveTreatment,
  deleteTreatment,
  saveService,
  deleteService,
  saveCity,
  deleteCity,
  saveCentre,
  deleteCentre,
  saveTestimonial,
  deleteTestimonial,
  saveHomepage,
  saveAbout,
  saveSurakshaKavach,
  saveCategoryHub,
  saveHistoryPage,
  saveInfrastructurePage,
  saveWhyBfiPage,
  saveSimpleTreatmentPage,
  saveSafeTreatmentPage,
  saveSmartTreatmentPage,
  saveSuccessBenchmarksPage,
  saveSiteSettings,
  saveEducationVideo,
  deleteEducationVideo,
  savePress,
  deletePress,
  saveBlog,
  deleteBlog,
  setBlogStatus,
  refreshAllReviews,
  backfillLegacyReviewCache,
  poolBrandReviews,
  readAdminReviews,
  createManualReview,
  createManualReviews,
  deleteReview,
  type ManualReviewInput,
  type Inquiry,
  type AdminDoctor,
  type AdminTreatment,
  type AdminService,
  type AdminCity,
  type AdminCentre,
  type AdminTestimonial,
  type AdminHomepage,
  type AdminAbout,
  type AdminSurakshaKavach,
  type AdminCategoryHub,
  type AdminHistoryPage,
  type AdminInfrastructurePage,
  type AdminWhyBfiPage,
  type AdminSimpleTreatmentPage,
  type AdminSafeTreatmentPage,
  type AdminSmartTreatmentPage,
  type AdminSuccessBenchmarksPage,
  type AdminSiteSettings,
  type AdminEducationVideo,
  type AdminPress,
  type AdminBlogMeta,
  type ReviewRefreshResult,
  type AdminGoogleReview,
} from "@/sanity/lib/admin";
import type {
  RobotsConfig,
  ScriptsConfig,
  CampsConfig,
  RedirectsConfig,
  SitemapConfig,
  SchemaOrgConfig,
  PageSeo,
} from "@/sanity/lib/fetch";

// ── Auth ──

export async function loginAction(_prev: { error?: string } | null, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const session = await verifyCredentials(email, password);
  if (!session) {
    if (!credsConfigured()) {
      return { error: "Login is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in Vercel, then redeploy, or ask a superadmin to create your account." };
    }
    return { error: "Incorrect email or password." };
  }
  await createSession(session);
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

/** Same as guard(), but blocks the "seo" role from destructive actions. */
async function guardDelete<T>(fn: () => Promise<T>): Promise<SaveResult> {
  const session = await getSession();
  if (session?.role !== "superadmin") {
    return { ok: false, error: "Only a superadmin can delete this." };
  }
  return guard(fn);
}

/** Blocks anyone but a superadmin from an action entirely (Team & Access). */
async function guardSuperadmin<T>(fn: () => Promise<T>): Promise<SaveResult> {
  const session = await getSession();
  if (session?.role !== "superadmin") {
    return { ok: false, error: "Only a superadmin can do this." };
  }
  return guard(fn);
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

export async function saveCampsAction(data: CampsConfig): Promise<SaveResult> {
  const r = await guard(() => saveCamps(data));
  revalidatePath("/admin-panel/camps");
  revalidatePath("/");
  revalidatePath("/camps");
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
  const r = await guardDelete(() => deletePageSeo(id));
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
  const r = await guardDelete(() => deleteInquiry(id));
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
  const r = await guardDelete(() => deleteDoctor(id));
  revalidateDoctorPages();
  return r;
}

// ── Treatments ──

/** Revalidate every public surface that renders treatment data (page content
 *  and the header/footer nav menus, which read the same tagged cache). */
function revalidateTreatmentPages() {
  revalidateTag("sanity-treatments"); // bust the unstable_cache backing getSanityTreatment(s)
  revalidatePath("/treatments/[slug]", "page");
  revalidatePath("/"); // homepage treatment carousel
  revalidatePath("/admin-panel/treatments");
}

export async function saveTreatmentAction(doc: AdminTreatment): Promise<SaveResult> {
  const r = await guard(() => saveTreatment(doc));
  revalidateTreatmentPages();
  return r;
}

export async function deleteTreatmentAction(id: string): Promise<SaveResult> {
  const r = await guardDelete(() => deleteTreatment(id));
  revalidateTreatmentPages();
  return r;
}

// ── Services ──

function revalidateServicePages() {
  revalidatePath("/services/[slug]", "page");
  revalidatePath("/admin-panel/services");
}

export async function saveServiceAction(doc: AdminService): Promise<SaveResult> {
  const r = await guard(() => saveService(doc));
  revalidateServicePages();
  return r;
}

export async function deleteServiceAction(id: string): Promise<SaveResult> {
  const r = await guardDelete(() => deleteService(id));
  revalidateServicePages();
  return r;
}

// ── Locations (Cities + Centres) ──

/** Revalidate every public surface that renders city/centre data (page
 *  content and the header/footer nav menus, which read the same tagged
 *  cache — see getNavLocations() in src/lib/payload.ts). */
function revalidateLocationPages() {
  revalidatePath("/locations/[city]", "page");
  revalidatePath("/locations/[city]/[center]", "page");
  revalidatePath("/"); // homepage location cards
  revalidatePath("/admin-panel/locations");
}

export async function saveCityAction(doc: AdminCity): Promise<SaveResult> {
  const r = await guard(() => saveCity(doc));
  revalidateLocationPages();
  return r;
}

export async function deleteCityAction(id: string): Promise<SaveResult> {
  const r = await guardDelete(() => deleteCity(id));
  revalidateLocationPages();
  return r;
}

export async function saveCentreAction(doc: AdminCentre): Promise<SaveResult> {
  const r = await guard(() => saveCentre(doc));
  revalidateLocationPages();
  return r;
}

export async function deleteCentreAction(id: string): Promise<SaveResult> {
  const r = await guardDelete(() => deleteCentre(id));
  revalidateLocationPages();
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
  const r = await guardDelete(() => deleteTestimonial(id));
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

// ── About Page ──

export async function saveAboutAction(data: AdminAbout): Promise<SaveResult> {
  const r = await guard(() => saveAbout(data));
  revalidatePath("/about-bfi");
  revalidatePath("/admin-panel/about");
  return r;
}

export async function saveSurakshaKavachAction(data: AdminSurakshaKavach): Promise<SaveResult> {
  const r = await guard(() => saveSurakshaKavach(data));
  revalidatePath("/suraksha-kavach");
  revalidatePath("/admin-panel/suraksha-kavach");
  return r;
}

const CATEGORY_HUB_PATHS: Record<string, string> = {
  "advanced-fertility-techniques": "/treatments/advanced-fertility-techniques",
  "male-infertility": "/treatments/male-infertility",
  "female-infertility": "/treatments/female-infertility",
  "maternity-services": "/services/maternity-services",
};

export async function saveCategoryHubAction(slug: string, data: AdminCategoryHub): Promise<SaveResult> {
  const r = await guard(() => saveCategoryHub(slug, data));
  const path = CATEGORY_HUB_PATHS[slug];
  if (path) revalidatePath(path);
  revalidatePath(`/admin-panel/category-hubs/${slug}`);
  return r;
}

export async function saveHistoryPageAction(data: AdminHistoryPage): Promise<SaveResult> {
  const r = await guard(() => saveHistoryPage(data));
  revalidatePath("/history");
  revalidatePath("/admin-panel/history");
  return r;
}

export async function saveInfrastructurePageAction(data: AdminInfrastructurePage): Promise<SaveResult> {
  const r = await guard(() => saveInfrastructurePage(data));
  revalidatePath("/infrastructure");
  revalidatePath("/admin-panel/infrastructure");
  return r;
}

export async function saveWhyBfiPageAction(data: AdminWhyBfiPage): Promise<SaveResult> {
  const r = await guard(() => saveWhyBfiPage(data));
  revalidatePath("/why-bfi");
  revalidatePath("/admin-panel/why-bfi");
  return r;
}

export async function saveSimpleTreatmentPageAction(data: AdminSimpleTreatmentPage): Promise<SaveResult> {
  const r = await guard(() => saveSimpleTreatmentPage(data));
  revalidatePath("/simple-treatment");
  revalidatePath("/admin-panel/simple-treatment");
  return r;
}

export async function saveSafeTreatmentPageAction(data: AdminSafeTreatmentPage): Promise<SaveResult> {
  const r = await guard(() => saveSafeTreatmentPage(data));
  revalidatePath("/safe-treatment");
  revalidatePath("/admin-panel/safe-treatment");
  return r;
}

export async function saveSmartTreatmentPageAction(data: AdminSmartTreatmentPage): Promise<SaveResult> {
  const r = await guard(() => saveSmartTreatmentPage(data));
  revalidatePath("/smart-treatment");
  revalidatePath("/admin-panel/smart-treatment");
  return r;
}

export async function saveSuccessBenchmarksPageAction(data: AdminSuccessBenchmarksPage): Promise<SaveResult> {
  const r = await guard(() => saveSuccessBenchmarksPage(data));
  revalidatePath("/success-benchmarks");
  revalidatePath("/admin-panel/success-benchmarks");
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
  const r = await guardDelete(() => deleteEducationVideo(id));
  revalidateEducationVideoPages();
  return r;
}

// ── Press ──

function revalidatePressPages(slug?: string) {
  revalidateTag("sanity-press");
  revalidatePath("/press");
  revalidatePath("/admin-panel/press");
  if (slug) revalidatePath(`/press/${slug}`);
}

export async function savePressAction(doc: AdminPress): Promise<SaveResult> {
  const r = await guard(() => savePress(doc));
  revalidatePressPages(doc.slug);
  return r;
}

export async function deletePressAction(id: string, slug?: string): Promise<SaveResult> {
  const r = await guardDelete(() => deletePress(id));
  revalidatePressPages(slug);
  return r;
}

// ── Blogs ──

function revalidateBlogPages(slug?: string) {
  revalidatePath("/blogs");
  revalidatePath("/cme");
  revalidatePath("/admin-panel/blogs");
  if (slug) revalidatePath(`/blogs/${slug}`);
}

export async function saveBlogAction(doc: AdminBlogMeta): Promise<SaveResult> {
  const r = await guard(() => saveBlog(doc));
  revalidateBlogPages(doc.slug);
  return r;
}

export async function deleteBlogAction(id: string, slug?: string): Promise<SaveResult> {
  const r = await guardDelete(() => deleteBlog(id));
  revalidateBlogPages(slug);
  return r;
}

export async function setBlogStatusAction(id: string, status: "published" | "draft", slug?: string): Promise<SaveResult> {
  const r = await guard(() => setBlogStatus(id, status));
  revalidateBlogPages(slug);
  return r;
}

// ── Reviews ──

export type RefreshReviewsResult = { ok: boolean; error?: string; results?: ReviewRefreshResult[]; reviews?: AdminGoogleReview[] };

export async function refreshReviewsAction(): Promise<RefreshReviewsResult> {
  try {
    const results = await refreshAllReviews();
    const reviews = await readAdminReviews();
    revalidatePath("/admin-panel/reviews");
    return { ok: true, results, reviews };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Refresh failed" };
  }
}

/** TEMPORARY — one-time migration of src/data/reviews-cache.json into the new
 *  Sanity store. Remove this + its button in reviews/manager.tsx once run. */
export async function backfillLegacyReviewsAction(): Promise<RefreshReviewsResult> {
  try {
    const results = await backfillLegacyReviewCache();
    const reviews = await readAdminReviews();
    revalidatePath("/admin-panel/reviews");
    return { ok: true, results, reviews };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Backfill failed" };
  }
}

export type PoolBrandReviewsResult = { ok: boolean; error?: string; added?: number; reviews?: AdminGoogleReview[] };

export async function poolBrandReviewsAction(count = 15): Promise<PoolBrandReviewsResult> {
  try {
    const { added } = await poolBrandReviews(count);
    const reviews = await readAdminReviews();
    revalidatePath("/admin-panel/reviews");
    return { ok: true, added, reviews };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Pool failed" };
  }
}

export async function deleteReviewAction(id: string): Promise<SaveResult> {
  const r = await guardDelete(() => deleteReview(id));
  revalidatePath("/admin-panel/reviews");
  return r;
}

export async function createManualReviewAction(input: ManualReviewInput): Promise<RefreshReviewsResult> {
  try {
    await createManualReview(input);
    const reviews = await readAdminReviews();
    revalidatePath("/admin-panel/reviews");
    return { ok: true, reviews };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Add failed" };
  }
}

export async function createManualReviewsAction(inputs: ManualReviewInput[]): Promise<RefreshReviewsResult> {
  try {
    await createManualReviews(inputs);
    const reviews = await readAdminReviews();
    revalidatePath("/admin-panel/reviews");
    return { ok: true, reviews };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Bulk add failed" };
  }
}

// ── Team & Access (Admin Users / RBAC) — superadmin only ──

export async function createAdminUserAction(email: string, password: string, role: AdminUser["role"]): Promise<SaveResult> {
  const r = await guardSuperadmin(() =>
    saveAdminUser({ email: email.trim(), passwordHash: hashPassword(password), role, createdAt: new Date().toISOString() }),
  );
  revalidatePath("/admin-panel/users");
  return r;
}

export async function deleteAdminUserAction(id: string): Promise<SaveResult> {
  const r = await guardSuperadmin(() => deleteAdminUser(id));
  revalidatePath("/admin-panel/users");
  return r;
}
