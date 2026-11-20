import Link from "next/link";
import { HUB_SLUGS, HUB_LABELS } from "@/lib/category-hub";

const CATEGORY_HUB_PATHS: Record<string, string> = {
  "advanced-fertility-techniques": "/treatments/advanced-fertility-techniques",
  "male-infertility": "/treatments/male-infertility",
  "female-infertility": "/treatments/female-infertility",
  "maternity-services": "/services/maternity-services",
};

export const dynamic = "force-dynamic";

export default function CategoryHubsAdminPage() {
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Category Hub Pages</h1>
        <p className="admin-sub">Edit the hero, cards, overview, signs, why-choose-us and FAQs on each of these 4 landing pages.</p>
      </div>
      <div className="admin-card">
        {HUB_SLUGS.map((slug) => (
          <div key={slug} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--admin-border, #eee)" }}>
            <div>
              <div style={{ fontWeight: 600 }}>{HUB_LABELS[slug]}</div>
              <div className="admin-hint">{CATEGORY_HUB_PATHS[slug]}</div>
            </div>
            <Link href={`/admin-panel/category-hubs/${slug}`} className="admin-btn">Edit</Link>
          </div>
        ))}
      </div>
    </>
  );
}
