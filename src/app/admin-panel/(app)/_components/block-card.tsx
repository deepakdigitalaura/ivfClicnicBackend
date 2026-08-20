"use client";
import { $getNodeByKey } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Pencil, Trash2 } from "lucide-react";
import { $isBlockNode, type BlockData } from "./block-node";
import { BLOCK_LABELS } from "./block-forms";
import { useBlockEditor } from "./block-editor-context";

function summarize(blockType: string, data: BlockData): string {
  switch (blockType) {
    case "infographic": return (data.title as string) || (data.altText as string) || "untitled";
    case "externalImage": return (data.alt as string) || (data.url as string) || "";
    case "statStrip": return `${(data.items as unknown[] | undefined)?.length ?? 0} stat(s)`;
    case "comparisonTable": return `${(data.rows as unknown[] | undefined)?.length ?? 0} row(s)`;
    case "highlightCard": return (data.badge as string) || "";
    case "decisionList": return (data.heading as string) || `${(data.items as unknown[] | undefined)?.length ?? 0} item(s)`;
    case "conclusionPanel": return (data.headline as string) || "";
    case "inlineCta": return (data.headline as string) || "";
    case "prosConsGrid": return `${(data.pros as unknown[] | undefined)?.length ?? 0} pros / ${(data.cons as unknown[] | undefined)?.length ?? 0} cons`;
    default: return "";
  }
}

export function BlockCard({ nodeKey, blockType, data }: { nodeKey: string; blockType: string; data: BlockData }) {
  const [editor] = useLexicalComposerContext();
  const { openEdit } = useBlockEditor();

  const remove = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isBlockNode(node)) node.remove();
    });
  };

  const edit = () => openEdit({ nodeKey, blockType, data });

  return (
    <div
      contentEditable={false}
      style={{
        margin: "10px 0", padding: "10px 12px", borderRadius: 8,
        border: "1px dashed var(--rose)", background: "var(--rose-soft, #fdf1f3)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
      }}
    >
      <div style={{ fontSize: 13, minWidth: 0 }}>
        <strong style={{ color: "var(--plum)" }}>{BLOCK_LABELS[blockType] ?? blockType}</strong>
        {summarize(blockType, data) && <span style={{ color: "var(--muted-foreground)" }}> — {summarize(blockType, data)}</span>}
      </div>
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <button type="button" onClick={edit} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--plum)" }}><Pencil size={14} /></button>
        <button type="button" onClick={remove} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--destructive)" }}><Trash2 size={14} /></button>
      </div>
    </div>
  );
}
