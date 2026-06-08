import {
  RichText as PayloadRichText,
  type JSXConvertersFunction,
  LinkJSXConverter,
} from "@payloadcms/richtext-lexical/react";
import type { DefaultTypedEditorState, SerializedLinkNode } from "@payloadcms/richtext-lexical";
import type { ElementType } from "react";
import { cn } from "@/lib/utils";

/* =====================================================================
 * Reusable rich-text renderer (Lexical -> JSX).
 * ---------------------------------------------------------------------
 * The single serializer every CMS-driven prose surface uses (Blogs first,
 * then Doctors bio / Locations intro / Treatments). Maps Lexical nodes to the
 * site's typography tokens so output matches the hand-authored prose. Element
 * classes can be tuned per template via `converters` when each collection is
 * migrated; these defaults cover the common cases.
 *
 * NOTE: dormant infrastructure — not yet wired into any live page, so it
 * changes no current UI/SEO. Internal-link resolution is a stub here and is
 * finalised by the Phase 5 internal-linking framework.
 * ===================================================================== */

/** Resolve an internal document link to an href. Stub until collections
 *  define their own path mapping (P2 internal-linking framework). */
const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }): string => {
  const doc = linkNode.fields?.doc;
  const value = doc && typeof doc.value === "object" ? (doc.value as { slug?: string }) : null;
  return value?.slug ? `/${value.slug}` : "#";
};

const headingClass: Record<string, string> = {
  h1: "text-3xl font-medium leading-tight text-[color:var(--plum)] md:text-4xl",
  h2: "mt-10 text-2xl font-medium leading-snug text-[color:var(--plum)] md:text-3xl",
  h3: "mt-8 text-xl font-medium leading-snug text-[color:var(--plum)]",
  h4: "mt-6 text-lg font-semibold text-[color:var(--plum)]",
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
    return <Tag className={headingClass[tag]}>{nodesToJSX({ nodes: node.children })}</Tag>;
  },
  list: ({ node, nodesToJSX }) => {
    const cls = "mt-4 space-y-2 pl-5 text-muted-foreground " + (node.tag === "ol" ? "list-decimal" : "list-disc");
    return node.tag === "ol"
      ? <ol className={cls}>{nodesToJSX({ nodes: node.children })}</ol>
      : <ul className={cls}>{nodesToJSX({ nodes: node.children })}</ul>;
  },
  quote: ({ node, nodesToJSX }) => (
    <blockquote className="mt-6 border-l-2 border-[color:var(--rose)] pl-4 italic text-[color:var(--plum)]">
      {nodesToJSX({ nodes: node.children })}
    </blockquote>
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
