"use client";

/* =====================================================================
 * Live-preview wrapper for the homepage (admin Homepage editor iframe).
 * ---------------------------------------------------------------------
 * Rendered ONLY inside the branded admin Homepage editor's preview iframe
 * (via /live-preview/homepage). It:
 *   - renders the real <HomePage> with the current resolved data,
 *   - listens for `bfi-preview-data` messages from the parent editor and
 *     re-renders instantly (live preview as you type),
 *   - wraps everything in <MarkProvider> so every <Editable> becomes a
 *     click-to-select target (clicking postMessages its path to the parent),
 *   - scrolls to + flashes the section the parent asks for (`bfi-scroll`).
 * No Payload, no contentEditable — selection/editing happens in the parent's
 * side panel; this iframe is preview + click-target only.
 * ===================================================================== */

import { useEffect, useState } from "react";
import { HomePage } from "@/components/home-page";
import { MarkProvider } from "@/components/editor/mark-context";
import type { HomepageData } from "@/lib/homepage";

export function HomePageLive({ initialData }: { initialData: HomepageData }) {
  const [data, setData] = useState<HomepageData>(initialData);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      const msg = e.data;
      if (!msg || typeof msg !== "object") return;
      if (msg.type === "bfi-preview-data" && msg.data) {
        setData(msg.data as HomepageData);
      } else if (msg.type === "bfi-scroll" && msg.section) {
        const el = document.getElementById(`lp-${msg.section}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          el.classList.add("lp-flash");
          window.setTimeout(() => el.classList.remove("lp-flash"), 1300);
        }
      }
    }
    window.addEventListener("message", onMsg);
    // Tell the parent we're mounted so it can push the current draft immediately.
    window.parent?.postMessage({ type: "bfi-preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  return (
    <>
      <style>{`
        .bfi-mark { cursor: pointer; border-radius: 4px; transition: outline-color .1s, background .1s; }
        .bfi-mark:hover {
          outline: 2px dashed var(--rose);
          outline-offset: 3px;
          background: color-mix(in oklch, var(--rose) 8%, transparent);
        }
        .lp-flash { animation: lpFlash 1.3s ease-out; border-radius: 6px; }
        @keyframes lpFlash {
          0%   { outline: 2px solid var(--rose); outline-offset: -2px; box-shadow: 0 0 0 0 color-mix(in oklch, var(--rose) 0%, transparent); }
          30%  { outline: 2px solid var(--rose); outline-offset: -2px; box-shadow: 0 0 0 6px color-mix(in oklch, var(--rose) 18%, transparent); }
          100% { outline: 2px solid transparent; outline-offset: -2px; box-shadow: 0 0 0 0 transparent; }
        }
      `}</style>
      <MarkProvider>
        <HomePage data={data} previewAnchors />
      </MarkProvider>
    </>
  );
}

export default HomePageLive;
