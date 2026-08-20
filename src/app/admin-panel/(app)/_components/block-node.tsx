import {
  DecoratorNode,
  type EditorConfig,
  type LexicalEditor,
  type LexicalNode,
  type SerializedLexicalNode,
  type Spread,
} from "lexical";
import type { JSX } from "react";

/* =====================================================================
 * Generic container for the site's 9 "article block" types (statStrip,
 * infographic, etc. — see src/blocks/articleBlocks.ts). Exports/imports
 * the exact JSON shape Payload's Lexical editor already produces
 * ({ type: "block", version: 2, fields: { id, blockName, blockType,
 * ...data } }), so blocks authored here render via the same
 * rich-text.tsx `blocks` converter map as blocks from the old pipeline,
 * and round-trip correctly if re-opened for editing.
 * ===================================================================== */

export type BlockData = Record<string, unknown>;

export type SerializedBlockNode = Spread<
  { fields: { id: string; blockName: string; blockType: string } & BlockData },
  SerializedLexicalNode
>;

const uid = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `blk_${Date.now()}_${Math.random().toString(36).slice(2)}`);

export class BlockNode extends DecoratorNode<JSX.Element> {
  __id: string;
  __blockType: string;
  __data: BlockData;

  static getType(): string {
    return "block";
  }

  static clone(node: BlockNode): BlockNode {
    return new BlockNode(node.__blockType, node.__data, node.__id, node.__key);
  }

  constructor(blockType: string, data: BlockData, id?: string, key?: string) {
    super(key);
    this.__id = id ?? uid();
    this.__blockType = blockType;
    this.__data = data;
  }

  static importJSON(serialized: SerializedBlockNode): BlockNode {
    const { id, blockName: _blockName, blockType, ...data } = serialized.fields;
    void _blockName;
    return new BlockNode(blockType, data, id);
  }

  exportJSON(): SerializedBlockNode {
    return {
      type: "block",
      version: 2,
      fields: { id: this.__id, blockName: "", blockType: this.__blockType, ...this.__data },
    };
  }

  createDOM(): HTMLElement {
    const div = document.createElement("div");
    return div;
  }

  updateDOM(): boolean {
    return false;
  }

  isInline(): boolean {
    return false;
  }

  getBlockType(): string {
    return this.__blockType;
  }

  getData(): BlockData {
    return this.__data;
  }

  setData(data: BlockData): void {
    const writable = this.getWritable();
    writable.__data = data;
  }

  decorate(_editor: LexicalEditor, _config: EditorConfig): JSX.Element {
    return <BlockCard nodeKey={this.getKey()} blockType={this.__blockType} data={this.__data} />;
  }
}

export function $createBlockNode(blockType: string, data: BlockData): BlockNode {
  return new BlockNode(blockType, data);
}

export function $isBlockNode(node: LexicalNode | null | undefined): node is BlockNode {
  return node instanceof BlockNode;
}

// Rendered lazily to avoid a circular import between this file and the
// toolbar/form code that opens the edit dialog for an existing block.
import { BlockCard } from "./block-card";
