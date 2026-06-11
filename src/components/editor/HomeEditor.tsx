"use client";

/* Wires the inline editor for the Homepage: holds the editable draft of the
 * `homepage` global, renders the real <HomePage> from the resolved draft, and
 * shows the floating toolbar. Every <Editable> inside <HomePage> reads the
 * provider context and becomes click-to-edit. Save POSTs the draft → live. */

import "./editor.css";
import { EditProvider } from "./edit-context";
import { EditorToolbar } from "./EditorToolbar";
import { FloatingToolbar } from "./FloatingToolbar";
import { HomePage } from "@/components/home-page";
import { resolveHomepage, type HomepageSource } from "@/lib/homepage";

type HomepageSrc = NonNullable<HomepageSource>;

export function HomeEditor({ initialSource }: { initialSource: HomepageSrc }) {
  return (
    <EditProvider<HomepageSrc> apiPath="/api/globals/homepage" initial={initialSource}>
      {(draft) => (
        <div className="bfi-editing">
          <EditorToolbar pageLabel="Homepage" />
          <FloatingToolbar />
          <div className="bfi-edit-canvas">
            <HomePage data={resolveHomepage(draft)} />
          </div>
        </div>
      )}
    </EditProvider>
  );
}

export default HomeEditor;
