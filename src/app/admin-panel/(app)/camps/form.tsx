"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { CampsConfig, CampPoster } from "@/sanity/lib/fetch";
import { saveCampsAction } from "../../actions";
import { useSave, Toast, SaveBar } from "../_components/save-kit";
import { ImageUpload } from "../_components/image-upload";

export function CampsForm({ initial }: { initial: CampsConfig | null }) {
  const [posters, setPosters] = useState<CampPoster[]>(initial?.posters ?? []);
  const { pending, toast, run } = useSave();

  const update = (i: number, patch: Partial<CampPoster>) =>
    setPosters(posters.map((p, j) => (j === i ? { ...p, ...patch } : p)));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => saveCampsAction({ posters }), { tags: ["sanity-camps"], paths: ["/", "/camps"] });
  };

  return (
    <form onSubmit={submit}>
      <div className="admin-card">
        <h2 className="admin-card-title">Posters</h2>
        <p className="admin-card-desc">
          Add, remove or reorder poster images. Each poster needs an image and alt text.
        </p>
        {posters.map((p, i) => (
          <div className="admin-row" key={i}>
            <div className="admin-row-head">
              <span className="admin-badge">Poster {i + 1}</span>
              <button type="button" className="admin-remove" onClick={() => setPosters(posters.filter((_, j) => j !== i))}>
                <Trash2 size={14} style={{ verticalAlign: "-2px" }} /> Remove
              </button>
            </div>
            <div className="admin-field" style={{ marginBottom: 10 }}>
              <ImageUpload value={p.src ?? ""} onChange={(url) => update(i, { src: url })} label="Poster Image" />
            </div>
            <div className="admin-field">
              <input
                className="admin-input"
                placeholder="Alt text (e.g. Doctor visit — upcoming camp)"
                value={p.alt ?? ""}
                onChange={(e) => update(i, { alt: e.target.value })}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          className="admin-add-btn"
          onClick={() => setPosters([...posters, { src: "", alt: "" }])}
        >
          + Add poster
        </button>
      </div>
      <SaveBar pending={pending} />
      <Toast toast={toast} />
    </form>
  );
}
