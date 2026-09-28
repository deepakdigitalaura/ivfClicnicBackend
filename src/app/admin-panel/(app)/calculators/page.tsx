import Link from "next/link";
import { CALCULATOR_SLUGS } from "@/lib/calculators";

const LABELS: Record<string, string> = {
  "ivf-success-rate": "IVF Success Rate Calculator",
  "ivf-cost": "IVF Cost Calculator",
  ovulation: "Ovulation & Pregnancy Calculator",
  "natural-pregnancy": "Natural Pregnancy Calculator",
  "fertile-period": "Fertile Period Calculator",
  "amh-level": "AMH Level Interpreter",
  "semen-analysis": "Semen Analysis Calculator",
  "miscarriage-risk": "Miscarriage Risk Calculator",
};

export default function CalculatorsListPage() {
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Calculators</h1>
        <p className="admin-sub">Edit each calculator page's title, subtitle, disclaimer, FAQs and SEO.</p>
      </div>
      <div className="admin-card">
        {CALCULATOR_SLUGS.map((slug) => (
          <div key={slug} className="admin-row">
            <Link href={`/admin-panel/calculators/${slug}`} className="admin-row-title">
              {LABELS[slug] ?? slug}
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
