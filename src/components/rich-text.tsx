import {
  RichText as PayloadRichText,
  type JSXConvertersFunction,
  LinkJSXConverter,
} from "@payloadcms/richtext-lexical/react";
import type { DefaultTypedEditorState, SerializedLinkNode } from "@payloadcms/richtext-lexical";
import type { ElementType } from "react";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { slugify } from "@/lib/headings";

/* =====================================================================
 * Reusable rich-text renderer (Lexical -> JSX).
 * ---------------------------------------------------------------------
 * Maps Lexical nodes to the site's typography tokens so output matches
 * hand-authored prose. Headings receive an `id` attribute (via slugify)
 * so the blog sidebar table-of-contents can link & scrollspy them.
 * Blockquotes render as amber "Practical Tip" callout boxes — in the
 * WP-extracted content they are always editorial highlights, not
 * semantic quotations.
 * ===================================================================== */

/** Resolve an internal document link to an href. */
const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }): string => {
  const doc = linkNode.fields?.doc;
  const value = doc && typeof doc.value === "object" ? (doc.value as { slug?: string }) : null;
  return value?.slug ? `/${value.slug}` : "#";
};

const headingClass: Record<string, string> = {
  h1: "text-3xl font-medium leading-tight text-[color:var(--plum)] md:text-4xl",
  h2: "mt-10 text-2xl font-medium leading-snug text-[color:var(--plum)] md:text-3xl scroll-mt-28",
  h3: "mt-8 text-xl font-medium leading-snug text-[color:var(--plum)] scroll-mt-28",
  h4: "mt-6 text-lg font-semibold text-[color:var(--plum)] scroll-mt-28",
  h5: "mt-6 text-base font-semibold text-[color:var(--plum)]",
  h6: "mt-6 text-sm font-semibold uppercase tracking-wider text-[color:var(--plum)]",
};

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),

  paragraph: ({ node, nodesToJSX }) => (
    <p className="mt-4 leading-relaxed text-muted-foreground text-pretty first:mt-0">
      {nodesToJSX({ nodes: node.children })}
    </p>
  ),

  heading: ({ node, nodesToJSX }) => {
    const tag = (node.tag in headingClass ? node.tag : "h3") as keyof typeof headingClass;
    const Tag = tag as ElementType;
    // Collect plain text for anchor id (same algorithm as extractHeadings in lib/headings.ts)
    const plainText = node.children
      .map((c: Record<string, unknown>) => (typeof c.text === "string" ? c.text : ""))
      .join("");
    const id = slugify(plainText);
    return (
      <Tag id={id || undefined} className={headingClass[tag]}>
        {nodesToJSX({ nodes: node.children })}
      </Tag>
    );
  },

  list: ({ node, nodesToJSX }) => {
    const cls =
      "mt-4 space-y-2 pl-5 text-muted-foreground " +
      (node.tag === "ol" ? "list-decimal" : "list-disc");
    return node.tag === "ol" ? (
      <ol className={cls}>{nodesToJSX({ nodes: node.children })}</ol>
    ) : (
      <ul className={cls}>{nodesToJSX({ nodes: node.children })}</ul>
    );
  },

  /* Inline images (Upload nodes) — render at natural size, never cropped.
   * The default Payload converter wraps them in a <span> which can collapse
   * dimensions; we render a plain block-level <figure> instead. */
  upload: ({ node }) => {
    const value = node.value as unknown as Record<string, unknown> | undefined;
    const url = typeof value?.url === "string" ? value.url : null;
    const alt = typeof value?.alt === "string" ? value.alt : "";
    if (!url) return null;
    return (
      <figure className="my-8 overflow-hidden rounded-2xl border border-border/40 bg-white shadow-soft">
        <img src={url} alt={alt} className="h-auto w-full" loading="lazy" />
        {alt && (
          <figcaption className="px-4 py-2 text-center text-xs text-muted-foreground">
            {alt}
          </figcaption>
        )}
      </figure>
    );
  },

  /* Amber "Practical Tip" callout — editors use blockquotes for tips/highlights
   * in the WP-extracted medical content, not for semantic quotations. */
  quote: ({ node, nodesToJSX }) => (
    <div className="mt-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-700">
          Practical Tip
        </p>
        <div className="text-sm leading-relaxed text-amber-800 [&>p]:mt-1 [&>p:first-child]:mt-0">
          {nodesToJSX({ nodes: node.children })}
        </div>
      </div>
    </div>
  ),
});

export function RichText({
  data,
  className,
}: {
  data: DefaultTypedEditorState;
  className?: string;
}) {
  return (
    <PayloadRichText
      data={data}
      converters={jsxConverters}
      disableContainer
      className={cn(className)}
    />
  );
}
