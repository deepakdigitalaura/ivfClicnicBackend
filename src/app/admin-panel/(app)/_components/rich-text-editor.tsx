"use client";
import { useCallback, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HeadingNode, QuoteNode, $createHeadingNode, $createQuoteNode, type HeadingTagType } from "@lexical/rich-text";
import { ListNode, ListItemNode, INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from "@lexical/list";
import { LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $setBlocksType } from "@lexical/selection";
import { $getSelection, $isRangeSelection, $createParagraphNode, FORMAT_TEXT_COMMAND, type EditorState } from "lexical";

/* =====================================================================
 * Minimal rich-text editor for article bodies, authored entirely in the
 * admin panel. Serializes to the same Lexical JSON shape rich-text.tsx
 * (a @payloadcms/richtext-lexical renderer, itself built on core Lexical
 * node types) already knows how to render — paragraph/heading/list/quote/
 * link/text — so no new renderer or data migration is needed. Graphical
 * content blocks (statStrip, infographic, etc.) remain Sanity Studio-only;
 * this covers ordinary prose authoring.
 * ===================================================================== */

const HEADING_TAGS: HeadingTagType[] = ["h2", "h3", "h4"];

function Toolbar() {
  const [editor] = useLexicalComposerContext();

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

  const btn: React.CSSProperties = {
    padding: "5px 10px",
    fontSize: 12.5,
    fontWeight: 600,
    border: "1px solid var(--border)",
    borderRadius: 6,
    background: "#fff",
    cursor: "pointer",
  };

  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8, padding: 8, background: "var(--muted)", borderRadius: 8 }}>
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
        nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode],
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
      <Toolbar />
      <div style={{ border: "1px solid var(--border)", borderRadius: 8, minHeight: 260, padding: "10px 14px", background: "#fff" }}>
        <RichTextPlugin
          contentEditable={<ContentEditable style={{ outline: "none", minHeight: 240, fontSize: 14.5, lineHeight: 1.6 }} />}
          placeholder={<div style={{ color: "var(--muted-foreground)", fontSize: 14.5, pointerEvents: "none", marginTop: -240 }}>Write the article body…</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <OnChangePlugin onChange={handleChange} />
      </div>
      {error && <p style={{ fontSize: 12.5, color: "var(--destructive)", marginTop: 6 }}>{error}</p>}
    </LexicalComposer>
  );
}
