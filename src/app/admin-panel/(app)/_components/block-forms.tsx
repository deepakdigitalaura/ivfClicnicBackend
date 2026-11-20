"use client";
import { useState } from "react";
import { ICON_OPTIONS } from "@/lib/icon-map";
import { ImageUpload } from "./image-upload";
import { Repeater } from "./repeater";
import type { BlockData } from "./block-node";

/* =====================================================================
 * Data-driven field forms for the 9 article block types (see
 * src/blocks/articleBlocks.ts for the field contract each must match).
 * One generic renderer + a field spec per block, instead of 9 bespoke
 * hand-written forms — same fields, a fraction of the code.
 * ===================================================================== */

type FieldSpec =
  | { key: string; label: string; kind: "text"; hint?: string }
  | { key: string; label: string; kind: "textarea"; hint?: string }
  | { key: string; label: string; kind: "image"; hint?: string }
  | { key: string; label: string; kind: "select"; options: { label: string; value: string }[]; hint?: string }
  | { key: string; label: string; kind: "lines"; hint?: string }
  | { key: string; label: string; kind: "repeater"; itemLabel: string; fields: FieldSpec[] };

const ICON_SELECT = ICON_OPTIONS.map((o) => ({ label: o.label, value: o.value as string }));
const ACCENT_OPTIONS = [{ label: "Plum", value: "plum" }, { label: "Rose", value: "rose" }, { label: "Gold", value: "gold" }];

export const BLOCK_SPECS: Record<string, { label: string; fields: FieldSpec[] }> = {
  infographic: {
    label: "Infographic / Diagram",
    fields: [
      { key: "title", label: "Title (optional label above the graphic)", kind: "text" },
      { key: "svgContent", label: "SVG Content (must start with <svg)", kind: "textarea", hint: "Paste raw inline SVG markup." },
      { key: "altText", label: "Alt Text", kind: "text" },
      { key: "caption", label: "Caption (optional)", kind: "text" },
    ],
  },
  externalImage: {
    label: "Photo",
    fields: [
      { key: "url", label: "Image", kind: "image" },
      { key: "alt", label: "Alt Text", kind: "text" },
      { key: "caption", label: "Caption (optional)", kind: "text" },
      { key: "credit", label: "Photo Credit (optional)", kind: "text" },
    ],
  },
  statStrip: {
    label: "Stat Strip",
    fields: [
      { key: "items", label: "Stats", kind: "repeater", itemLabel: "Stat", fields: [
        { key: "value", label: "Value (e.g. '8 Types')", kind: "text" },
        { key: "label", label: "Label", kind: "text" },
      ] },
    ],
  },
  comparisonTable: {
    label: "Comparison Table",
    fields: [
      { key: "rowHeader", label: "First Column Header", kind: "text" },
      { key: "columnsLines", label: "Column Headers (one per line)", kind: "lines" },
      { key: "rows", label: "Rows", kind: "repeater", itemLabel: "Row", fields: [
        { key: "rowLabel", label: "Row Label", kind: "text" },
        { key: "cellsLines", label: "Cell values (one per line, matching column order)", kind: "lines" },
      ] },
    ],
  },
  highlightCard: {
    label: "Highlight Card",
    fields: [
      { key: "badge", label: "Badge / Name", kind: "text" },
      { key: "tagline", label: "Tagline (optional)", kind: "text" },
      { key: "icon", label: "Icon", kind: "select", options: ICON_SELECT },
      { key: "color", label: "Accent Colour", kind: "select", options: ACCENT_OPTIONS },
      { key: "facts", label: "Facts (optional)", kind: "repeater", itemLabel: "Fact", fields: [
        { key: "label", label: "Label", kind: "text" },
        { key: "value", label: "Value", kind: "text" },
      ] },
      { key: "bestSuitedFor", label: "Best Suited For", kind: "textarea" },
    ],
  },
  decisionList: {
    label: "Decision List",
    fields: [
      { key: "heading", label: "Heading (optional)", kind: "text" },
      { key: "intro", label: "Intro (optional)", kind: "textarea" },
      { key: "items", label: "Items", kind: "repeater", itemLabel: "Item", fields: [
        { key: "icon", label: "Icon", kind: "select", options: ICON_SELECT },
        { key: "situation", label: "If this is your situation", kind: "text" },
        { key: "recommendation", label: "Consider", kind: "text" },
      ] },
      { key: "note", label: "Practical Tip (optional)", kind: "textarea" },
    ],
  },
  conclusionPanel: {
    label: "Conclusion Panel",
    fields: [
      { key: "headline", label: "Headline (e.g. 'Key Takeaways')", kind: "text" },
      { key: "points", label: "Points", kind: "repeater", itemLabel: "Point", fields: [
        { key: "icon", label: "Icon", kind: "select", options: ICON_SELECT },
        { key: "text", label: "Point text", kind: "text" },
      ] },
    ],
  },
  inlineCta: {
    label: "Inline CTA",
    fields: [
      { key: "headline", label: "Headline", kind: "text" },
      { key: "subtext", label: "Subtext (optional)", kind: "text" },
      { key: "buttons", label: "Buttons", kind: "repeater", itemLabel: "Button", fields: [
        { key: "label", label: "Button Label", kind: "text" },
        { key: "url", label: "URL", kind: "text" },
        { key: "variant", label: "Style", kind: "select", options: [{ label: "Primary (filled)", value: "primary" }, { label: "Secondary (outline)", value: "secondary" }] },
      ] },
      { key: "accent", label: "Accent Colour", kind: "select", options: ACCENT_OPTIONS },
    ],
  },
  prosConsGrid: {
    label: "Pros & Cons Grid",
    fields: [
      { key: "prosLabel", label: "Pros Column Label", kind: "text" },
      { key: "consLabel", label: "Cons Column Label", kind: "text" },
      { key: "pros", label: "Pros", kind: "repeater", itemLabel: "Pro", fields: [{ key: "text", label: "Pro item", kind: "text" }] },
      { key: "cons", label: "Cons", kind: "repeater", itemLabel: "Con", fields: [{ key: "text", label: "Con item", kind: "text" }] },
    ],
  },
};

export const BLOCK_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(BLOCK_SPECS).map(([k, v]) => [k, v.label]),
);

const toLines = (a?: unknown) => Array.isArray(a) ? (a as string[]).join("\n") : "";
const fromLines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

/** comparisonTable stores columns/cells as arrays of {header}/{value} objects
 *  (matching the schema); the form works with plain string[] via *Lines
 *  fields for a simpler UI, converted at the form's edges only. */
function toFormData(blockType: string, data: BlockData): BlockData {
  if (blockType !== "comparisonTable") return data;
  const columns = (data.columns as { header?: string }[] | undefined) ?? [];
  const rows = (data.rows as { rowLabel?: string; cells?: { value?: string }[] }[] | undefined) ?? [];
  return {
    rowHeader: data.rowHeader,
    columnsLines: columns.map((c) => c.header ?? "").join("\n"),
    rows: rows.map((r) => ({ rowLabel: r.rowLabel ?? "", cellsLines: (r.cells ?? []).map((c) => c.value ?? "").join("\n") })),
  };
}

function fromFormData(blockType: string, form: BlockData): BlockData {
  if (blockType !== "comparisonTable") return form;
  const columns = fromLines((form.columnsLines as string) ?? "").map((header) => ({ header }));
  const rows = ((form.rows as { rowLabel?: string; cellsLines?: string }[] | undefined) ?? []).map((r) => ({
    rowLabel: r.rowLabel ?? "",
    cells: fromLines(r.cellsLines ?? "").map((value) => ({ value })),
  }));
  return { rowHeader: form.rowHeader, columns, rows };
}

function emptyValue(f: FieldSpec): unknown {
  if (f.kind === "repeater") return [];
  if (f.kind === "select") return f.options[0]?.value ?? "";
  return "";
}

/** Raw (schema-shaped, not form-shaped) empty data for a brand-new block —
 *  always passed through toFormData before use, same as data loaded from
 *  an existing node, so there is exactly one place that knows the
 *  form-shape/schema-shape mapping per block type. */
export function emptyBlockFormData(blockType: string): BlockData {
  const spec = BLOCK_SPECS[blockType];
  if (!spec) return {};
  if (blockType === "comparisonTable") return { rowHeader: "", columns: [], rows: [] };
  return Object.fromEntries(spec.fields.map((f) => [f.key, emptyValue(f)]));
}

function FieldWrap({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      {hint && <p className="admin-hint">{hint}</p>}
      {children}
    </div>
  );
}

function FieldsRenderer({ fields, data, onChange }: { fields: FieldSpec[]; data: BlockData; onChange: (patch: BlockData) => void }) {
  return (
    <>
      {fields.map((f) => {
        const value = data[f.key];
        switch (f.kind) {
          case "text":
            return (
              <FieldWrap key={f.key} label={f.label} hint={f.hint}>
                <input className="admin-input" value={(value as string) ?? ""} onChange={(e) => onChange({ [f.key]: e.target.value })} />
              </FieldWrap>
            );
          case "textarea":
            return (
              <FieldWrap key={f.key} label={f.label} hint={f.hint}>
                <textarea className="admin-textarea" style={{ minHeight: f.key === "svgContent" ? 160 : 80 }} value={(value as string) ?? ""} onChange={(e) => onChange({ [f.key]: e.target.value })} />
              </FieldWrap>
            );
          case "lines":
            return (
              <FieldWrap key={f.key} label={f.label} hint={f.hint}>
                <textarea className="admin-textarea" style={{ minHeight: 70 }} value={(value as string) ?? ""} onChange={(e) => onChange({ [f.key]: e.target.value })} />
              </FieldWrap>
            );
          case "image":
            return (
              <FieldWrap key={f.key} label={f.label} hint={f.hint}>
                <ImageUpload value={(value as string) ?? ""} onChange={(url) => onChange({ [f.key]: url })} label="photo" />
              </FieldWrap>
            );
          case "select":
            return (
              <FieldWrap key={f.key} label={f.label} hint={f.hint}>
                <select className="admin-input" value={(value as string) ?? ""} onChange={(e) => onChange({ [f.key]: e.target.value })}>
                  {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </FieldWrap>
            );
          case "repeater":
            return (
              <FieldWrap key={f.key} label={f.label}>
                <Repeater
                  items={(value as BlockData[] | undefined) ?? []}
                  onChange={(items) => onChange({ [f.key]: items })}
                  newItem={() => Object.fromEntries(f.fields.map((sf) => [sf.key, emptyValue(sf)]))}
                  addLabel={`+ Add ${f.itemLabel}`}
                  rowLabel={(i) => `${f.itemLabel} ${i + 1}`}
                  renderItem={(item, _i, update) => <FieldsRenderer fields={f.fields} data={item} onChange={update} />}
                />
              </FieldWrap>
            );
        }
      })}
    </>
  );
}

export function BlockForm({
  blockType, initialData, onCancel, onSave,
}: {
  blockType: string;
  initialData: BlockData;
  onCancel: () => void;
  onSave: (data: BlockData) => void;
}) {
  const spec = BLOCK_SPECS[blockType];
  const [form, setForm] = useState<BlockData>(() => toFormData(blockType, initialData));
  if (!spec) return null;

  const set = (patch: BlockData) => setForm((p) => ({ ...p, ...patch }));

  return (
    <div className="admin-card" style={{ marginBottom: 12, border: "1px solid var(--rose)" }}>
      <h3 className="admin-card-title" style={{ margin: "0 0 12px", fontSize: 15 }}>{spec.label}</h3>
      <FieldsRenderer fields={spec.fields} data={form} onChange={set} />
      <div className="admin-actions-bar">
        <button type="button" className="admin-btn" onClick={() => onSave(fromFormData(blockType, form))}>Save Block</button>
        <button type="button" className="admin-btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
