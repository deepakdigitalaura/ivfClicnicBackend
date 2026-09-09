"use client";

import "./editor.css";
import { EditProvider } from "./edit-context";
import { EditorToolbar } from "./EditorToolbar";
import { FloatingToolbar } from "./FloatingToolbar";
import type { CalculatorCmsData, CalculatorSlug } from "@/lib/calculators";
import { IvfSuccessRateCalculatorPage } from "@/components/ivf-success-rate-calculator";
import { IvfCostCalculatorPage } from "@/components/ivf-cost-calculator";
import { OvulationPregnancyCalculatorPage } from "@/components/ovulation-pregnancy-calculator";
import { NaturalPregnancyCalculatorPage } from "@/components/natural-pregnancy-calculator";
import { FertilePeriodCalculatorPage } from "@/components/fertile-period-calculator";
import { AmhLevelInterpreterPage } from "@/components/amh-level-interpreter";
import { SemenAnalysisCalculatorPage } from "@/components/semen-analysis-calculator";
import { MiscarriageRiskCalculatorPage } from "@/components/miscarriage-risk-calculator";

type CalculatorDoc = CalculatorCmsData & { id: string | number };

function CalculatorWidget({ slug, cms }: { slug: CalculatorSlug; cms: CalculatorCmsData }) {
  switch (slug) {
    case "ivf-success-rate": return <IvfSuccessRateCalculatorPage cms={cms} />;
    case "ivf-cost": return <IvfCostCalculatorPage cms={cms} />;
    case "ovulation": return <OvulationPregnancyCalculatorPage cms={cms} />;
    case "natural-pregnancy": return <NaturalPregnancyCalculatorPage cms={cms} />;
    case "fertile-period": return <FertilePeriodCalculatorPage cms={cms} />;
    case "amh-level": return <AmhLevelInterpreterPage cms={cms} />;
    case "semen-analysis": return <SemenAnalysisCalculatorPage cms={cms} />;
    case "miscarriage-risk": return <MiscarriageRiskCalculatorPage cms={cms} />;
  }
}

export function CalculatorEditor({
  slug,
  initialDoc,
  apiPath,
}: {
  slug: CalculatorSlug;
  initialDoc: CalculatorDoc;
  apiPath: string;
}) {
  return (
    <EditProvider<CalculatorDoc> apiPath={apiPath} method="PATCH" initial={initialDoc}>
      {(draft) => (
        <div className="bfi-editing notranslate" translate="no">
          <EditorToolbar
            pageLabel={`Calculator: ${draft.title || slug}`}
            backUrl={`/calculators/${slug}`}
          />
          <FloatingToolbar />
          <div className="bfi-edit-canvas">
            <CalculatorWidget slug={slug} cms={draft} />
          </div>
        </div>
      )}
    </EditProvider>
  );
}

export default CalculatorEditor;
