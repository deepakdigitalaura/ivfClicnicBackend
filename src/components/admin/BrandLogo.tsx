/* =====================================================================
 * Brand graphics for the Payload admin (admin.components.graphics).
 * BrandIcon  → the small mark in the sidebar header.
 * BrandLogo  → the larger lockup on the login screen.
 * Both use the clinic logo in /public/assets/logo.png (served at /assets/logo.png).
 * ===================================================================== */

export function BrandIcon() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/logo.png" alt="Bavishi Fertility" height={26} style={{ height: 26, width: "auto" }} />
    </span>
  );
}

export function BrandLogo() {
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/logo.png" alt="Bavishi Fertility Institute" height={56} style={{ height: 56, width: "auto" }} />
      <span style={{ fontWeight: 700, fontSize: 18, color: "oklch(0.27 0.09 305)" }}>Admin Panel</span>
      <span style={{ fontSize: 13, color: "oklch(0.5 0.04 305)" }}>Manage your website content</span>
    </span>
  );
}

export default BrandLogo;
