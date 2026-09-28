import { notFound } from "next/navigation";
import { readCalculator } from "@/sanity/lib/admin";
import { isCalculatorSlug } from "@/lib/calculators";
import { CalculatorForm } from "./form";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function CalculatorEditorPage({ params }: Props) {
  const { slug } = await params;
  if (!isCalculatorSlug(slug)) notFound();
  const doc = await readCalculator(slug);
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">{slug}</h1>
        <p className="admin-sub">Title, subtitle, disclaimer, FAQs and SEO for this calculator page.</p>
      </div>
      <CalculatorForm slug={slug} initial={doc} />
    </>
  );
}
