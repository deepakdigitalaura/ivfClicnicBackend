"use client";
import { useCallback, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HeadingNode, QuoteNode, $createHeadingNode, $createQuoteNode, type HeadingTagType } from "@lexical/rich-text";
import { ListNode, ListItemNode, INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from "@lexical/list";
import { LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { TableNode, TableRowNode, TableCellNode, INSERT_TABLE_COMMAND } from "@lexical/table";
import { $setBlocksType } from "@lexical/selection";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import { $getSelection, $isRangeSelection, $createParagraphNode, $getNodeByKey, FORMAT_TEXT_COMMAND, type EditorState } from "lexical";
import { BlockNode, $createBlockNode, $isBlockNode } from "./block-node";
import { BlockForm, BLOCK_LABELS, emptyBlockFormData } from "./block-forms";
import { BlockEditorContext, type EditPayload } from "./block-editor-context";

/* =====================================================================
 * Rich-text editor for article bodies, authored entirely in the admin
 * panel. Serializes to the same Lexical JSON shape rich-text.tsx (a
 * @payloadcms/richtext-lexical renderer, built on core Lexical node
 * types) already renders — paragraph/heading/list/quote/link/table/text
 * plus the site's 9 custom "article blocks" (block-node.tsx) — so no
 * renderer or data migration is needed.
 * ===================================================================== */

const HEADING_TAGS: HeadingTagType[] = ["h2", "h3", "h4"];
const BLOCK_MENU_ORDER = ["externalImage", "infographic", "statStrip", "comparisonTable", "highlightCard", "decisionList", "conclusionPanel", "inlineCta", "prosConsGrid"];

function Toolbar({ onInsertBlock }: { onInsertBlock: (blockType: string) => void }) {
  const [editor] = useLexicalComposerContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const applyHeading = (tag: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) $setBlocksType(selection, () => $createHeadingNode(tag));
    });
  };

  const applyParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) $setBlocksType(selection, () => $createParagraphNode());
    });
  };

  const applyQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) $setBlocksType(selection, () => $createQuoteNode());
    });
  };

  const applyLink = () => {
    const url = window.prompt("Link URL");
    if (url) editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
  };

  const insertTable = () => {
    const cols = window.prompt("Number of columns", "3");
    const rows = window.prompt("Number of rows", "3");
    if (cols && rows) editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns: cols, rows });
  };

  const btn: React.CSSProperties = {
    padding: "5px 10px", fontSize: 12.5, fontWeight: 600,
    border: "1px solid var(--border)", borderRadius: 6, background: "#fff", cursor: "pointer",
  };

  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8, padding: 8, background: "var(--muted)", borderRadius: 8, position: "relative" }}>
      <button type="button" style={btn} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}><b>B</b></button>
      <button type="button" style={btn} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}><i>I</i></button>
      <button type="button" style={btn} onClick={applyParagraph}>¶</button>
      {HEADING_TAGS.map((t) => (
        <button key={t} type="button" style={btn} onClick={() => applyHeading(t)}>{t.toUpperCase()}</button>
      ))}
      <button type="button" style={btn} onClick={applyQuote}>Tip</button>
      <button type="button" style={btn} onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}>• List</button>
      <button type="button" style={btn} onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}>1. List</button>
      <button type="button" style={btn} onClick={applyLink}>Link</button>
      <button type="button" style={btn} onClick={insertTable}>Table</button>

      <div style={{ position: "relative" }}>
        <button type="button" style={{ ...btn, background: "var(--rose)", color: "#fff", borderColor: "var(--rose)" }} onClick={() => setMenuOpen((v) => !v)}>
          + Insert Block ▾
        </button>
        {menuOpen && (
          <div style={{ position: "absolute", top: "110%", left: 0, zIndex: 20, background: "#fff", border: "1px solid var(--border)", borderRadius: 8, boxShadow: "0 6px 20px rgba(0,0,0,.12)", minWidth: 200, overflow: "hidden" }}>
            {BLOCK_MENU_ORDER.map((bt) => (
              <button
                key={bt}
                type="button"
                onClick={() => { setMenuOpen(false); onInsertBlock(bt); }}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", fontSize: 13, border: "none", background: "none", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                {BLOCK_LABELS[bt]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function RichTextEditor({ value, onChange }: { value?: string | null; onChange: (json: string) => void }) {
  const [error, setError] = useState("");

  const handleChange = useCallback(
    (state: EditorState) => onChange(JSON.stringify(state.toJSON())),
    [onChange],
  );

  return (
    <LexicalComposer
      initialConfig={{
        namespace: "blog-body",
        nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, TableNode, TableRowNode, TableCellNode, BlockNode],
        editorState: value || undefined,
        onError: (e) => setError(e.message),
        theme: {
          paragraph: "admin-rte-p",
          heading: { h2: "admin-rte-h2", h3: "admin-rte-h3", h4: "admin-rte-h4" },
          quote: "admin-rte-quote",
          list: { ul: "admin-rte-ul", ol: "admin-rte-ol" },
          link: "admin-rte-link",
          text: { bold: "admin-rte-bold", italic: "admin-rte-italic" },
        },
      }}
    >
      <EditorInner handleChange={handleChange} />
      {error && <p style={{ fontSize: 12.5, color: "var(--destructive)", marginTop: 6 }}>{error}</p>}
    </LexicalComposer>
  );
}

function EditorInner({ handleChange }: { handleChange: (state: EditorState) => void }) {
  const [editor] = useLexicalComposerContext();
  const [target, setTarget] = useState<EditPayload | null>(null);

  const openEdit = useCallback((p: EditPayload) => setTarget(p), []);
  const requestInsert = (blockType: string) => setTarget({ nodeKey: null, blockType, data: emptyBlockFormData(blockType) });

  const save = (data: Record<string, unknown>) => {
    if (target?.nodeKey) {
      editor.update(() => {
        const node = $getNodeByKey(target.nodeKey!);
        if ($isBlockNode(node)) node.setData(data);
      });
    } else if (target) {
      editor.update(() => {
        $insertNodeToNearestRoot($createBlockNode(target.blockType, data));
      });
    }
    setTarget(null);
  };

  return (
    <BlockEditorContext.Provider value={{ openEdit }}>
      <Toolbar onInsertBlock={requestInsert} />
      {target && (
        <BlockForm blockType={target.blockType} initialData={target.data} onCancel={() => setTarget(null)} onSave={save} />
      )}
      <div style={{ border: "1px solid var(--border)", borderRadius: 8, minHeight: 260, padding: "10px 14px", background: "#fff" }}>
        <RichTextPlugin
          contentEditable={<ContentEditable style={{ outline: "none", minHeight: 240, fontSize: 14.5, lineHeight: 1.6 }} />}
          placeholder={<div style={{ color: "var(--muted-foreground)", fontSize: 14.5, pointerEvents: "none", marginTop: -240 }}>Write the article body…</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <TablePlugin />
        <OnChangePlugin onChange={handleChange} />
      </div>
    </BlockEditorContext.Provider>
  );
}
