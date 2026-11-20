import { LinkNode, type SerializedLinkNode as SerializedVanillaLinkNode } from "@lexical/link";
import type { LexicalNode, NodeKey, Spread } from "lexical";

/* =====================================================================
 * Link node matching the ON-DISK shape of this site's existing content.
 *
 * All 285 blog posts were authored through Payload's Lexical editor,
 * which serializes links as { type: "link", fields: { url, newTab,
 * linkType, doc? } } — NOT vanilla @lexical/link's flat { url, target,
 * rel }. Registering the stock LinkNode made every such link import
 * with url === undefined, and Lexical's sanitizeUrl() then threw
 * "Cannot read properties of undefined (reading 'match')" while
 * building the DOM, crashing the whole editor on open.
 *
 * This subclass translates Payload's shape on the way in and back out
 * again on the way out, so old posts open correctly and re-save without
 * silently rewriting their link format (which would break the public
 * renderer in src/components/rich-text.tsx, whose `link` converter
 * reads node.fields).
 * ===================================================================== */

type PayloadLinkFields = {
  url?: string;
  newTab?: boolean;
  linkType?: "custom" | "internal";
  doc?: { relationTo?: string; value?: unknown } | null;
};

export type SerializedPayloadLinkNode = Spread<
  { fields: PayloadLinkFields; id?: string },
  SerializedVanillaLinkNode
>;

/** Internal (doc-relationship) links carry no plain URL; fall back to the
 *  referenced slug so the href is still meaningful and never undefined. */
function urlFromFields(fields: PayloadLinkFields): string {
  if (fields.linkType === "internal") {
    const value = fields.doc?.value;
    const slug = value && typeof value === "object" ? (value as { slug?: string }).slug : undefined;
    return slug ? `/${slug}` : "#";
  }
  return fields.url ?? "#";
}

export class PayloadLinkNode extends LinkNode {
  __fields: PayloadLinkFields;
  __payloadId?: string;

  static getType(): string {
    return "link";
  }

  static clone(node: PayloadLinkNode): PayloadLinkNode {
    const clone = new PayloadLinkNode(node.__fields, node.__payloadId, node.__key);
    return clone;
  }

  constructor(fields: PayloadLinkFields = {}, id?: string, key?: NodeKey) {
    super(urlFromFields(fields), { target: fields.newTab ? "_blank" : null }, key);
    this.__fields = fields;
    this.__payloadId = id;
  }

  static importJSON(serialized: SerializedPayloadLinkNode): PayloadLinkNode {
    return new PayloadLinkNode(serialized.fields ?? {}, serialized.id);
  }

  exportJSON(): SerializedPayloadLinkNode {
    // Drop vanilla's flat url/target/rel/title so the saved JSON keeps the
    // exact Payload shape the public renderer expects, with no stray keys.
    const base = super.exportJSON() as Record<string, unknown>;
    delete base.url;
    delete base.target;
    delete base.rel;
    delete base.title;
    return {
      ...base,
      type: "link",
      version: 1,
      fields: this.__fields,
      ...(this.__payloadId ? { id: this.__payloadId } : {}),
    } as SerializedPayloadLinkNode;
  }

  /** Guard the inherited JSON-update path: modern Lexical may route through
   *  updateFromJSON, whose base implementation reads the flat `url` key that
   *  Payload-shaped content does not have (the original crash). */
  updateFromJSON(serialized: SerializedPayloadLinkNode): this {
    const writable = this.getWritable();
    writable.__fields = serialized.fields ?? {};
    writable.__payloadId = serialized.id;
    writable.__url = urlFromFields(writable.__fields);
    writable.__target = writable.__fields.newTab ? "_blank" : null;
    return writable;
  }

  getFields(): PayloadLinkFields {
    return this.getLatest().__fields;
  }

  setFields(fields: PayloadLinkFields): void {
    const writable = this.getWritable();
    writable.__fields = fields;
    writable.__url = urlFromFields(fields);
  }
}

export function $createPayloadLinkNode(url: string, newTab = false): PayloadLinkNode {
  return new PayloadLinkNode({ url, newTab, linkType: "custom" });
}

export function $isPayloadLinkNode(node: LexicalNode | null | undefined): node is PayloadLinkNode {
  return node instanceof PayloadLinkNode;
}
