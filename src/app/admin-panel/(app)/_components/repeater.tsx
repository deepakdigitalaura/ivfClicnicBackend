"use client";
import { Trash2 } from "lucide-react";

/** Shared variable-length list editor — add/remove rows, each row rendered by
 *  the caller. Matches the `.admin-row` / `.admin-add-btn` convention already
 *  used inline in sitemap/schema/scripts forms (see e.g. sitemap/form.tsx's
 *  "Additional URLs" list) so a section that grows over time (About's
 *  milestones, Treatments' FAQs/benefits) gets the same look everywhere. */
export function Repeater<T>({
  items, onChange, newItem, renderItem, addLabel = "+ Add", rowLabel,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  renderItem: (item: T, index: number, update: (patch: Partial<T>) => void) => React.ReactNode;
  addLabel?: string;
  rowLabel?: (index: number) => string;
}) {
  const update = (i: number, patch: Partial<T>) => {
    const next = [...items];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, newItem()]);

  return (
    <div>
      {items.map((item, i) => (
        <div className="admin-row" key={i}>
          <div className="admin-row-head">
            <span className="admin-row-title">{rowLabel ? rowLabel(i) : `Item ${i + 1}`}</span>
            <button type="button" className="admin-remove" onClick={() => remove(i)}>
              <Trash2 size={14} style={{ verticalAlign: "-2px" }} /> Remove
            </button>
          </div>
          {renderItem(item, i, (patch) => update(i, patch))}
        </div>
      ))}
      <button type="button" className="admin-add-btn" style={{ marginTop: items.length ? 12 : 0 }} onClick={add}>
        {addLabel}
      </button>
    </div>
  );
}
