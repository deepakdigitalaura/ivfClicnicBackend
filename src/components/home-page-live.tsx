"use client";

/* =====================================================================
 * Live-preview wrapper for the homepage.
 * ---------------------------------------------------------------------
 * Rendered ONLY inside the Payload admin's Live Preview iframe (via the
 * /live-preview/homepage route). `useLivePreview` listens for the in-progress
 * `homepage` global form data the admin streams over postMessage, so the editor
 * sees edits instantly — no save required. We run the SAME pure resolver the
 * server uses (resolveHomepage) on that live data, then render the normal
 * <HomePage>, so the preview matches production exactly.
 *
 * To answer "where did my change happen?" we diff each incoming update against
 * the previous one, find the section whose data changed, and smooth-scroll the
 * preview to it + briefly highlight it. Section anchors exist only here
 * (HomePage `previewAnchors`), so the public page DOM is unchanged.
 * ===================================================================== */

import { useEffect, useRef } from "react";
import { useLivePreview } from "@payloadcms/live-preview-react";
import { HomePage } from "@/components/home-page";
import { resolveHomepage, type HomepageSource } from "@/lib/homepage";

/** The non-null branch of HomepageSource — useLivePreview needs an object type. */
type HomepageSrc = NonNullable<HomepageSource>;

/** A few global field keys don't share a section id 1:1 — map them. */
const KEY_TO_SECTION: Record<string, string> = { videos: "successStories" };

export function HomePageLive({ initialSource }: { initialSource: HomepageSource }) {
  const { data } = useLivePreview<HomepageSrc>({
    initialData: (initialSource ?? {}) as HomepageSrc,
    serverURL: typeof window !== "undefined" ? window.location.origin : "",
    depth: 2,
  });

  // Scroll-to + flash the section whose data just changed.
  const prevRef = useRef<HomepageSrc | null>(null);
  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = data;
    if (!prev) return;
    const keys = new Set([...Object.keys(prev), ...Object.keys(data)]);
    for (const key of keys) {
      const a = JSON.stringify((prev as Record<string, unknown>)[key]);
      const b = JSON.stringify((data as Record<string, unknown>)[key]);
      if (a === b) continue;
      const sectionId = KEY_TO_SECTION[key] ?? key;
      const el = document.getElementById(`lp-${sectionId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.classList.add("lp-flash");
        window.setTimeout(() => el.classList.remove("lp-flash"), 1300);
      }
      break; // one section per keystroke is enough
    }
  }, [data]);

  return (
    <>
      {/* Highlight pulse for the section being edited (preview-only styling). */}
      <style>{`
        .lp-flash { animation: lpFlash 1.3s ease-out; border-radius: 6px; }
        @keyframes lpFlash {
          0%   { box-shadow: 0 0 0 0 rgba(214,51,108,0.0); outline: 2px solid rgba(214,51,108,0.9); outline-offset: -2px; }
          30%  { box-shadow: 0 0 0 6px rgba(214,51,108,0.18); outline: 2px solid rgba(214,51,108,0.9); outline-offset: -2px; }
          100% { box-shadow: 0 0 0 0 rgba(214,51,108,0.0); outline: 2px solid rgba(214,51,108,0); outline-offset: -2px; }
        }
      `}</style>
      <HomePage data={resolveHomepage(data)} previewAnchors />
    </>
  );
}

export default HomePageLive;
