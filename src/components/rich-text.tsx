import {
  RichText as PayloadRichText,
  type JSXConvertersFunction,
  LinkJSXConverter,
} from "@payloadcms/richtext-lexical/react";
import type { DefaultTypedEditorState, SerializedLinkNode } from "@payloadcms/richtext-lexical";
import type { ElementType } from "react";
import { Lightbulb, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { slugify } from "@/lib/headings";
import type {
  StatStripBlock,
  ComparisonTableBlock,
  HighlightCardBlock,
  DecisionListBlock,
} from "@/payload-types";

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

  blocks: {
    statStrip: StatStrip,
    comparisonTable: ComparisonTable,
    highlightCard: HighlightCard,
    decisionList: DecisionList,
  },
});

/* ── Graphical content blocks ────────────────────────────────────────
 * Render the editor-insertable blocks defined in src/blocks/articleBlocks.ts.
 * See that file for the field contract. */

const accent: Record<"plum" | "rose" | "gold", { bg: string; text: string; soft: string; border: string }> = {
  plum: { bg: "bg-[color:var(--plum)]", text: "text-[color:var(--plum)]", soft: "bg-[color:var(--plum)]/[0.06]", border: "border-[color:var(--plum)]/15" },
  rose: { bg: "bg-[color:var(--rose)]", text: "text-[color:var(--rose)]", soft: "bg-[color:var(--rose)]/[0.06]", border: "border-[color:var(--rose)]/15" },
  gold: { bg: "bg-[color:var(--gold)]", text: "text-[color:var(--gold)]", soft: "bg-[color:var(--gold)]/[0.08]", border: "border-[color:var(--gold)]/20" },
};

function StatStrip({ node }: { node: { fields: unknown } }) {
  const items = (node.fields as StatStripBlock).items ?? [];
  if (!items.length) return null;
  return (
    <div
      className={cn(
        "my-8 grid gap-3 rounded-2xl border border-[color:var(--plum)]/10 bg-white p-2 shadow-soft",
        items.length === 2 ? "grid-cols-2" : items.length === 3 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4",
      )}
    >
      {items.map((item, i) => (
        <div key={i} className="rounded-xl px-4 py-5 text-center">
          <p className="font-display text-2xl text-[color:var(--plum)] md:text-3xl">{item.value}</p>
          <p className="mt-1 text-xs leading-snug text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

function ComparisonTable({ node }: { node: { fields: unknown } }) {
  const { rowHeader, columns = [], rows = [] } = node.fields as ComparisonTableBlock;
  if (!columns?.length || !rows?.length) return null;
  return (
    <div className="my-8 overflow-x-auto rounded-2xl border border-border/60 shadow-soft">
      <table className="w-full min-w-[480px] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-[color:var(--plum)] text-white">
            <th className="px-4 py-3 font-semibold">{rowHeader || "Type"}</th>
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-3 font-semibold">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[color:var(--ivory)]"}>
              <td className="px-4 py-3 font-semibold text-[color:var(--plum)]">{row.rowLabel}</td>
              {(row.cells ?? []).map((cell, j) => (
                <td key={j} className="px-4 py-3 text-muted-foreground">{cell.value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const factsColsClass: Record<1 | 2 | 3 | 4, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

function HighlightCard({ node }: { node: { fields: unknown } }) {
  const { badge, tagline, color, facts: factsRaw, bestSuitedFor } = node.fields as HighlightCardBlock;
  const facts = factsRaw ?? [];
  const a = accent[color ?? "plum"];
  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-border/60 shadow-soft">
      <div className={cn("flex flex-wrap items-center gap-3 px-5 py-3.5", a.bg)}>
        <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
          {badge}
        </span>
        {tagline && <span className="text-sm text-white/85">{tagline}</span>}
      </div>
      {facts.length > 0 && (
        <div
          className={cn(
            "grid gap-px border-b border-border/50 bg-border/50 grid-cols-2",
            factsColsClass[Math.min(facts.length, 4) as 1 | 2 | 3 | 4],
          )}
        >
          {facts.map((f, i) => (
            <div key={i} className="bg-white px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">{f.label}</p>
              <p className={cn("mt-0.5 text-sm font-semibold", a.text)}>{f.value}</p>
            </div>
          ))}
        </div>
      )}
      <div className={cn("flex gap-2.5 px-5 py-4", a.soft)}>
        <CheckCircle2 className={cn("mt-0.5 h-4 w-4 shrink-0", a.text)} />
        <p className="text-[15px] leading-relaxed text-foreground/85">
          <span className="font-semibold">Best suited for: </span>
          {bestSuitedFor}
        </p>
      </div>
    </div>
  );
}

function DecisionList({ node }: { node: { fields: unknown } }) {
  const { heading, intro, items: itemsRaw, note } = node.fields as DecisionListBlock;
  const items = itemsRaw ?? [];
  if (!items.length) return null;
  return (
    <div className="my-8 rounded-2xl border border-border/60 bg-card p-6 shadow-soft md:p-7">
      {heading && <h3 className="text-lg font-semibold text-[color:var(--plum)]">{heading}</h3>}
      {intro && <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{intro}</p>}
      <div className="mt-5 space-y-2.5">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[color:var(--ivory)] px-4 py-3"
          >
            <span className="text-sm text-foreground/85">{item.situation}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--plum)] px-3 py-1.5 text-xs font-semibold text-white">
              <ArrowRight className="h-3 w-3" /> {item.recommendation}
            </span>
          </div>
        ))}
      </div>
      {note && (
        <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-sm leading-relaxed text-amber-800">{note}</p>
        </div>
      )}
    </div>
  );
}

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
