"use client";
import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

interface Props {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = "Photo" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload-image", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {value && (
        <div style={{ position: "relative", display: "inline-block", marginBottom: 10 }}>
          <img
            src={value}
            alt="Preview"
            style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 10, border: "1px solid var(--border)", display: "block" }}
          />
          <button
            type="button"
            title="Remove photo"
            onClick={() => onChange("")}
            style={{
              position: "absolute", top: -7, right: -7,
              background: "var(--destructive)", color: "#fff", border: "none",
              borderRadius: "50%", width: 22, height: 22, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,.2)",
            }}
          >
            <X size={12} />
          </button>
        </div>
      )}

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        style={{
          width: "100%", border: "1.5px dashed var(--border)", borderRadius: 10,
          padding: "14px 12px", textAlign: "center", cursor: uploading ? "not-allowed" : "pointer",
          background: "#fff", transition: "border-color .12s, background .12s",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        }}
        onMouseEnter={e => { if (!uploading) (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--rose)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; }}
      >
        {uploading ? (
          <span style={{ fontSize: 13.5, color: "var(--muted-foreground)" }}>Uploading…</span>
        ) : (
          <>
            <Upload size={18} style={{ color: "var(--rose)" }} />
            <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--plum)" }}>
              {value ? `Change ${label}` : `Upload ${label}`}
            </span>
            <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>JPG, PNG, WebP · max 5 MB</span>
          </>
        )}
      </button>

      {error && <p style={{ fontSize: 12.5, color: "var(--destructive)", margin: "6px 0 0" }}>{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        style={{ display: "none" }}
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
