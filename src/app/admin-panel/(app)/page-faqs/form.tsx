"use client";
import { useState } from "react";
import type { PageFaqsConfig, PageFaqEntry } from "@/sanity/lib/fetch";
import { savePageFaqsAction } from "../../actions";
import { useSave, Toast, SaveBar } from "../_components/save-kit";
import { Repeater } from "../_components/repeater";

type PageDef = { key: string; label: string };

const PAGES: PageDef[] = [
  { key: "female-infertility", label: "Female Infertility" },
  { key: "male-infertility", label: "Male Infertility" },
  { key: "advanced-fertility-techniques", label: "Advanced Fertility Techniques" },
  { key: "maternity-services", label: "Maternity Services" },
  { key: "suraksha-kavach", label: "Suraksha Kavach" },
];

export function PageFaqsForm({ initial }: { initial: PageFaqsConfig | null }) {
  const [byPage, setByPage] = useState<Record<string, PageFaqEntry[]>>(() => {
    const map: Record<string, PageFaqEntry[]> = {};
    for (const p of PAGES) {
      map[p.key] = initial?.pages?.find((x) => x.pageKey === p.key)?.faqs ?? [];
    }
    return map;
  });
  const { pending, toast, run } = useSave();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const pages = PAGES.map((p) => ({ pageKey: p.key, faqs: byPage[p.key] ?? [] }));
    run(() => savePageFaqsAction({ pages }), {
      tags: ["sanity-page-faqs"],
      paths: [
        "/treatments/female-infertility",
        "/treatments/male-infertility",
        "/treatments/advanced-fertility-techniques",
        "/services/maternity-services",
        "/suraksha-kavach",
      ],
    });
  };

  return (
    <form onSubmit={submit}>
      {PAGES.map((p) => (
        <div className="admin-card" key={p.key}>
          <h2 className="admin-card-title">{p.label}</h2>
          <p className="admin-card-desc">
            FAQs shown on this page. Leave empty to use the page's default set.
          </p>
          <Repeater
            items={byPage[p.key]}
            onChange={(next) => setByPage({ ...byPage, [p.key]: next })}
            newItem={() => ({ q: "", a: "" })}
            addLabel="+ Add FAQ"
            rowLabel={(i) => byPage[p.key][i]?.q || `FAQ ${i + 1}`}
            renderItem={(row, i, update) => (
              <div>
                <input
                  className="admin-input"
                  placeholder={`Question ${i + 1}`}
                  value={row.q ?? ""}
                  onChange={(e) => update({ q: e.target.value })}
                />
                <textarea
                  className="admin-textarea"
                  style={{ fontFamily: "inherit", minHeight: 60, marginTop: 6 }}
                  placeholder="Answer"
                  value={row.a ?? ""}
                  onChange={(e) => update({ a: e.target.value })}
                />
              </div>
            )}
          />
        </div>
      ))}
      <SaveBar pending={pending} />
      <Toast toast={toast} />
    </form>
  );
}
