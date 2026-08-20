"use client";
import { createContext, useContext } from "react";
import type { BlockData } from "./block-node";

export type EditPayload = { nodeKey: string | null; blockType: string; data: BlockData };

export const BlockEditorContext = createContext<{ openEdit: (p: EditPayload) => void }>({
  openEdit: () => {},
});

export const useBlockEditor = () => useContext(BlockEditorContext);
