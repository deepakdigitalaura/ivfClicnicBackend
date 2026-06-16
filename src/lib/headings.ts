/** Utilities for extracting a table-of-contents from Lexical rich-text JSON. */

export type TocHeading = { id: string; text: string; level: 2 | 3 };

/** Convert heading text to a URL-safe anchor id (mirrors what rich-text.tsx
 *  applies as the `id` attribute on rendered heading elements). */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Collect plain text from a Lexical node tree (handles nested inline nodes). */
function collectText(node: Record<string, unknown>): string {
  if (node.type === "text" && typeof node.text === "string") return node.text;
  if (Array.isArray(node.children)) {
    return (node.children as Record<string, unknown>[]).map(collectText).join("");
  }
  return "";
}

/**
 * Walk a Payload Lexical editor-state JSON object and return all h2 / h3
 * headings as an ordered flat list for use as a table-of-contents.
 *
 * Payload wraps the Lexical state as: `{ root: { children: [...topNodes] } }`
 */
export function extractHeadings(lexical: unknown): TocHeading[] {
  if (!lexical || typeof lexical !== "object") return [];
  const root = (lexical as Record<string, unknown>).root as
    | Record<string, unknown>
    | undefined;
  const children = Array.isArray(root?.children) ? root!.children : [];

  const headings: TocHeading[] = [];
  for (const node of children as Record<string, unknown>[]) {
    if (
      node.type === "heading" &&
      (node.tag === "h2" || node.tag === "h3")
    ) {
      const text = collectText(node).trim();
      if (text) {
        headings.push({
          id: slugify(text),
          text,
          level: node.tag === "h2" ? 2 : 3,
        });
      }
    }
  }
  return headings;
}
