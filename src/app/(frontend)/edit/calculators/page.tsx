import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { payloadClient } from "@/lib/payload";
import { CALCULATOR_SLUGS } from "@/lib/calculators";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit Calculators", robots: { index: false, follow: false } };

const CALCULATOR_LABELS: Record<string, string> = {
  "ivf-success-rate": "IVF Success Rate Calculator",
  "ivf-cost": "IVF Cost Calculator",
  "ovulation": "Ovulation & Pregnancy Calculator",
  "natural-pregnancy": "Natural Pregnancy Calculator",
  "fertile-period": "Fertile Period Calculator",
  "amh-level": "AMH Level Interpreter",
  "semen-analysis": "Semen Analysis Calculator",
  "miscarriage-risk": "Miscarriage Risk Calculator",
};

export default async function EditCalculatorsHubPage() {
  const payload = await payloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect("/admin/login?redirect=/edit/calculators");

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f11", color: "#fff", fontFamily: "system-ui, sans-serif", padding: "3rem 2rem" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <a href="/studio/pages" style={{ color: "#aaa", textDecoration: "none", fontSize: "0.85rem" }}>← Pages &amp; Builder</a>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginTop: "1.5rem", marginBottom: "0.5rem" }}>Calculators</h1>
        <p style={{ color: "#aaa", marginBottom: "2.5rem", fontSize: "0.95rem" }}>
          Click a calculator to edit its title, subtitle, disclaimer and FAQs inline.
          For SEO and advanced fields, use the <a href="/admin/collections/calculators" style={{ color: "#c97" }}>admin panel</a>.
        </p>
        <div style={{ display: "grid", gap: "1rem" }}>
          {CALCULATOR_SLUGS.map((slug) => (
            <a
              key={slug}
              href={`/edit/calculators/${slug}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#1a1a1f",
                border: "1px solid #2a2a30",
                borderRadius: 12,
                padding: "1rem 1.25rem",
                color: "#fff",
                textDecoration: "none",
                transition: "border-color 0.15s",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{CALCULATOR_LABELS[slug] ?? slug}</div>
                <div style={{ color: "#888", fontSize: "0.8rem", marginTop: 2 }}>/calculators/{slug}</div>
              </div>
              <span style={{ color: "#c97", fontSize: "0.85rem" }}>Open editor →</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
