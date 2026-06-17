import type { Block } from "payload";
import { ICON_OPTIONS } from "@/lib/icon-map";

/* =====================================================================
 * Article rich-content blocks
 * ---------------------------------------------------------------------
 * Editor-insertable Lexical blocks for the Blogs `content` field, built
 * to replace flat "heading + bullet list" sections with the same kind
 * of scannable, graphical presentation used on the best medical/health
 * editorial sites (stat strips, comparison tables, "best suited for"
 * cards, decision lists). Purely additive — existing paragraph/heading/
 * list content keeps working unchanged; editors opt into these blocks
 * wherever a section benefits from them.
 *
 * Rendered in src/components/rich-text.tsx via the `blocks` JSX converter
 * map. Keep field names stable — they are the render contract.
 * ===================================================================== */

/** 3-4 short stats in a row, e.g. "8 Types · Personalised match · 1 consult". */
export const StatStripBlock: Block = {
  slug: "statStrip",
  labels: { singular: "Stat Strip", plural: "Stat Strips" },
  interfaceName: "StatStripBlock",
  fields: [
    {
      name: "items",
      type: "array",
      minRows: 2,
      maxRows: 4,
      labels: { singular: "Stat", plural: "Stats" },
      fields: [
        { name: "value", type: "text", required: true, label: "Value", admin: { description: "Short, e.g. '8 Types' or '15 min'." } },
        { name: "label", type: "text", required: true, label: "Label", admin: { description: "Caption under the value." } },
      ],
    },
  ],
};

/** Scannable side-by-side comparison table for "types of X" sections. */
export const ComparisonTableBlock: Block = {
  slug: "comparisonTable",
  labels: { singular: "Comparison Table", plural: "Comparison Tables" },
  interfaceName: "ComparisonTableBlock",
  fields: [
    { name: "rowHeader", type: "text", label: "First Column Header", defaultValue: "Type", admin: { description: "Header for the left-most label column." } },
    {
      name: "columns",
      type: "array",
      minRows: 1,
      maxRows: 4,
      labels: { singular: "Column", plural: "Columns" },
      fields: [{ name: "header", type: "text", required: true, label: "Column Header" }],
    },
    {
      name: "rows",
      type: "array",
      minRows: 1,
      labels: { singular: "Row", plural: "Rows" },
      fields: [
        { name: "rowLabel", type: "text", required: true, label: "Row Label" },
        {
          name: "cells",
          type: "array",
          labels: { singular: "Cell", plural: "Cells" },
          fields: [{ name: "value", type: "text", required: true, label: "Value" }],
        },
      ],
    },
  ],
};

/** Coloured header card for one option/type — facts row + a highlighted
 *  "best suited for" callout. Mirrors the per-type cards on competitor
 *  reference pages, restyled to this site's plum/rose/gold palette. */
export const HighlightCardBlock: Block = {
  slug: "highlightCard",
  labels: { singular: "Highlight Card", plural: "Highlight Cards" },
  interfaceName: "HighlightCardBlock",
  fields: [
    { name: "badge", type: "text", required: true, label: "Badge / Name", admin: { description: "e.g. 'CONVENTIONAL IVF'" } },
    { name: "tagline", type: "text", label: "Tagline", admin: { description: "One line next to the badge." } },
    {
      name: "icon",
      type: "select",
      label: "Icon",
      options: ICON_OPTIONS,
      admin: { description: "Shown in a medallion on the card — pick whatever best represents this option." },
    },
    {
      name: "color",
      type: "select",
      defaultValue: "plum",
      label: "Accent Colour",
      options: [
        { label: "Plum", value: "plum" },
        { label: "Rose", value: "rose" },
        { label: "Gold", value: "gold" },
      ],
    },
    {
      name: "facts",
      type: "array",
      maxRows: 4,
      labels: { singular: "Fact", plural: "Facts" },
      admin: { description: "Optional small facts row (label + value), e.g. 'Best for / Male factor infertility'." },
      fields: [
        { name: "label", type: "text", required: true, label: "Label" },
        { name: "value", type: "text", required: true, label: "Value" },
      ],
    },
    {
      name: "bestSuitedFor",
      type: "textarea",
      required: true,
      label: "Best Suited For",
      admin: { description: "Highlighted callout text — who this option fits." },
    },
  ],
};

/** "If your situation is X, consider Y" decision rows — turns a flat
 *  bullet list of decision factors into a scannable mapping. */
export const DecisionListBlock: Block = {
  slug: "decisionList",
  labels: { singular: "Decision List", plural: "Decision Lists" },
  interfaceName: "DecisionListBlock",
  fields: [
    { name: "heading", type: "text", label: "Heading" },
    { name: "intro", type: "textarea", label: "Intro" },
    {
      name: "items",
      type: "array",
      minRows: 1,
      labels: { singular: "Item", plural: "Items" },
      fields: [
        { name: "icon", type: "select", label: "Icon", options: ICON_OPTIONS },
        { name: "situation", type: "text", required: true, label: "If this is your situation" },
        { name: "recommendation", type: "text", required: true, label: "Consider" },
      ],
    },
    { name: "note", type: "textarea", label: "Practical Tip (optional)" },
  ],
};

/** Graphical conclusion panel — icon grid + headline above the final
 *  text paragraphs, replacing a plain h2 → paragraph flow. */
export const ConclusionPanelBlock: Block = {
  slug: "conclusionPanel",
  labels: { singular: "Conclusion Panel", plural: "Conclusion Panels" },
  interfaceName: "ConclusionPanelBlock",
  fields: [
    { name: "headline", type: "text", label: "Headline", admin: { description: "e.g. 'Key Takeaways'" } },
    {
      name: "points",
      type: "array",
      minRows: 2,
      maxRows: 6,
      labels: { singular: "Point", plural: "Points" },
      fields: [
        { name: "icon", type: "select", label: "Icon", options: ICON_OPTIONS },
        { name: "text", type: "text", required: true, label: "Point text" },
      ],
    },
  ],
};

export const ARTICLE_BLOCKS: Block[] = [
  StatStripBlock,
  ComparisonTableBlock,
  HighlightCardBlock,
  DecisionListBlock,
  ConclusionPanelBlock,
];
