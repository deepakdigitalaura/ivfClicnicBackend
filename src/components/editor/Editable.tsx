"use client";

/* =====================================================================
 * <Editable> / <EditableImage> — the click-to-edit primitives.
 * ---------------------------------------------------------------------
 * Used INSIDE the real page components, gated by the editor context:
 *   - Public site (no provider) → renders bare children / the plain element,
 *     so the DOM is byte-identical and ships zero editor behaviour. (A field
 *     opted into `rich` renders its stored HTML, so basic formatting shows.)
 *   - Inside /edit/<page> → text becomes contentEditable (commit on blur),
 *     images become click-to-replace. Selecting an element drives the floating
 *     toolbar (see EditorToolbar / FloatingToolbar).
 * `path` is the dot-path into the page's CMS SOURCE draft (e.g. "hero.paragraph"
 * or "hero.badges.0.text"). `rich` (DEFAULT true) gives a field inline
 * formatting (bold/italic/underline/colour) — its value is stored + rendered as
 * HTML, so EVERY text field shows the same full floating toolbar across the whole
 * site. The public render then wraps the text in a bare inline <span>; the SEO
 * parity surface (title/meta/canonical/JSON-LD/links — see scripts/seo/extract.mjs)
 * ignores body spans, so this stays byte-identical to the SEO gate. Pass
 * `rich={false}` only for a field that must render as a raw text node with no
 * wrapper at all.
 * ===================================================================== */

import { useEdit } from "./edit-context";

type Tag = keyof React.JSX.IntrinsicElements;

export function Editable({
  path,
  as = "span",
  className,
  rich = true,
  children,
}: {
  path: string;
  as?: Tag;
  className?: string;
  rich?: boolean;
  children: React.ReactNode;
}) {
  const ctx = useEdit();
  const Comp = as as React.ElementType;

  if (!ctx?.editMode) {
    if (rich && typeof children === "string") {
      return <Comp className={className} dangerouslySetInnerHTML={{ __html: children }} />;
    }
    return <>{children}</>;
  }

  const commonProps = {
    className: `${className ?? ""} bfi-editable notranslate`.trim(),
    "data-edit-path": path,
    "data-bfi-rich": rich ? "true" : undefined,
    "data-bfi-selected": ctx.selected === path ? "true" : undefined,
    contentEditable: true,
    suppressContentEditableWarning: true,
    spellCheck: false,
    // Keep browser writing-assistants / translators OUT of these contentEditable
    // fields: Grammarly (and friends) inject overlay nodes into the editable and
    // Chrome Translate rewraps its text, both of which mutate the DOM out from
    // under React — on the next re-render React reconciles against the foreign
    // nodes and the field's text disappears. These opt-outs make every major tool
    // skip the field.
    translate: "no" as const,
    "data-gramm": "false",
    "data-gramm_editor": "false",
    "data-enable-grammarly": "false",
    role: "textbox",
    tabIndex: 0,
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      // Cancel any ancestor's default action (e.g. an enclosing <a> navigating)
      // so selecting text never leaves the page. Caret placement happens on
      // mousedown, so this does not affect putting the cursor in the field.
      e.preventDefault();
      ctx.select(path, "text");
    },
    onFocus: () => ctx.select(path, "text"),
    onBlur: (e: React.FocusEvent<HTMLElement>) =>
      ctx.update(path, rich ? e.currentTarget.innerHTML : e.currentTarget.textContent ?? ""),
    onKeyDown: (e: React.KeyboardEvent) => {
      // Enter commits + blurs (single-line fields); Shift+Enter keeps a newline.
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        (e.currentTarget as HTMLElement).blur();
      }
    },
  };

  // For a rich field we seed the contentEditable with stored HTML; for a plain
  // field we render the text children directly.
  if (rich && typeof children === "string") {
    return <Comp {...commonProps} dangerouslySetInnerHTML={{ __html: children }} />;
  }
  return <Comp {...commonProps}>{children}</Comp>;
}

/** A click-to-replace image. In the editor a click selects it (→ toolbar shows
 *  "Replace image"); on the public site it renders a plain <img>. `loading` is
 *  passed straight through so a section that shipped a `loading="lazy"` <img>
 *  stays byte-identical (and keeps its perf hint) when swapped to <EditableImage>. */
export function EditableImage({
  path,
  src,
  alt,
  className,
  loading,
}: {
  path: string;
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  const ctx = useEdit();
  if (!ctx?.editMode) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading={loading} className={className} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={`${className ?? ""} bfi-editable bfi-editable-img`.trim()}
      data-edit-path={path}
      data-bfi-selected={ctx.selected === path ? "true" : undefined}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        ctx.select(path, "image");
      }}
    />
  );
}
