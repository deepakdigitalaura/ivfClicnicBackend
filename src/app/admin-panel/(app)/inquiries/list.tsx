"use client";
import { useState, useMemo } from "react";
import { Mail, Phone, Trash2, Clock, Download } from "lucide-react";
import type { Inquiry } from "@/sanity/lib/admin";
import { setInquiryStatusAction, deleteInquiryAction } from "../../actions";
import { useSave, Toast } from "../_components/save-kit";

const CSV_COLUMNS: (keyof Inquiry)[] = ["createdAt", "name", "phone", "email", "treatment", "location", "status", "source", "message"];

function csvCell(value: unknown): string {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function downloadCsv(rows: Inquiry[]) {
  const lines = [
    CSV_COLUMNS.join(","),
    ...rows.map((r) => CSV_COLUMNS.map((c) => csvCell(r[c])).join(",")),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

type Filter = "all" | "new" | "contacted" | "closed";
const STATUSES: Inquiry["status"][] = ["new", "contacted", "closed"];

const badgeStyle: Record<string, { bg: string; fg: string }> = {
  new: { bg: "#dcfce7", fg: "#166534" },
  contacted: { bg: "#fef3c7", fg: "#b45309" },
  closed: { bg: "var(--muted)", fg: "var(--muted-foreground)" },
};

function fmt(iso?: string) {
  if (!iso) return "";
  try { return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }); }
  catch { return iso; }
}

export function InquiriesList({ initial }: { initial: Inquiry[] }) {
  const [items, setItems] = useState<Inquiry[]>(initial);
  const [filter, setFilter] = useState<Filter>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [location, setLocation] = useState("all");
  const { toast, run } = useSave();

  const counts = useMemo(() => ({
    all: items.length,
    new: items.filter((i) => (i.status ?? "new") === "new").length,
    contacted: items.filter((i) => i.status === "contacted").length,
    closed: items.filter((i) => i.status === "closed").length,
  }), [items]);

  const locations = useMemo(
    () => Array.from(new Set(items.map((i) => i.location).filter((v): v is string => !!v))).sort(),
    [items],
  );

  const filtered = useMemo(() => items.filter((i) => {
    if (filter !== "all" && (i.status ?? "new") !== filter) return false;
    if (location !== "all" && i.location !== location) return false;
    if (dateFrom && (!i.createdAt || i.createdAt.slice(0, 10) < dateFrom)) return false;
    if (dateTo && (!i.createdAt || i.createdAt.slice(0, 10) > dateTo)) return false;
    return true;
  }), [items, filter, location, dateFrom, dateTo]);

  const changeStatus = (id: string, status: Inquiry["status"]) => {
    setItems(items.map((i) => (i._id === id ? { ...i, status } : i)));
    run(() => setInquiryStatusAction(id, status));
  };

  const remove = (id: string) => {
    if (!confirm("Delete this inquiry permanently?")) return;
    setItems(items.filter((i) => i._id !== id));
    run(() => deleteInquiryAction(id));
  };

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {(["all", "new", "contacted", "closed"] as Filter[]).map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)}
            className={filter === f ? "admin-btn" : "admin-btn-ghost"}
            style={{ textTransform: "capitalize", padding: "8px 16px" }}>
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <input type="date" className="admin-input" style={{ width: 150 }} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} title="From date" />
        <span style={{ color: "var(--muted-foreground)", fontSize: 13 }}>to</span>
        <input type="date" className="admin-input" style={{ width: 150 }} value={dateTo} onChange={(e) => setDateTo(e.target.value)} title="To date" />
        <select className="admin-input" style={{ width: 180 }} value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="all">All centres</option>
          {locations.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <div style={{ flex: 1 }} />
        <button type="button" className="admin-btn-ghost" disabled={filtered.length === 0} onClick={() => downloadCsv(filtered)}>
          <Download size={16} /> Export {filtered.length} to CSV
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-empty">No {filter === "all" ? "" : filter} inquiries yet.</div>
      ) : (
        <div className="admin-divider-list">
          {filtered.map((q) => {
            const status = q.status ?? "new";
            const b = badgeStyle[status];
            return (
              <div className="admin-card" key={q._id} style={{ padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <strong style={{ fontSize: 16 }}>{q.name || "Unnamed"}</strong>
                      <span className="admin-badge" style={{ background: b.bg, color: b.fg, textTransform: "capitalize" }}>{status}</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13.5, color: "var(--muted-foreground)", marginBottom: 8 }}>
                      {q.phone && <a href={`tel:${q.phone}`} style={{ color: "var(--plum)", display: "inline-flex", gap: 5, alignItems: "center" }}><Phone size={13} /> {q.phone}</a>}
                      {q.email && <a href={`mailto:${q.email}`} style={{ color: "var(--plum)", display: "inline-flex", gap: 5, alignItems: "center" }}><Mail size={13} /> {q.email}</a>}
                      <span style={{ display: "inline-flex", gap: 5, alignItems: "center" }}><Clock size={13} /> {fmt(q.createdAt)}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: q.message ? 10 : 0 }}>
                      {q.treatment && <span className="admin-badge" style={{ background: "var(--rose-soft)", color: "var(--rose)" }}>{q.treatment}</span>}
                      {q.location && <span className="admin-badge" style={{ background: "#ede9fe", color: "var(--plum)" }}>{q.location}</span>}
                      {q.source && <span className="admin-badge admin-badge-off">from {q.source}</span>}
                    </div>
                    {q.message && <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{q.message}</p>}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", flexShrink: 0 }}>
                    <select className="admin-input" style={{ width: 130, padding: "7px 10px" }} value={status} onChange={(e) => changeStatus(q._id, e.target.value as Inquiry["status"])}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {q.email && (
                      <a className="admin-btn-ghost" style={{ padding: "7px 12px", fontSize: 13, textDecoration: "none" }}
                        href={`mailto:${q.email}?subject=Re: Your inquiry — Bavishi Fertility Institute`}>
                        <Mail size={14} /> Reply
                      </a>
                    )}
                    <button type="button" className="admin-btn-danger" style={{ padding: "7px 12px" }} onClick={() => remove(q._id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Toast toast={toast} />
    </>
  );
}
