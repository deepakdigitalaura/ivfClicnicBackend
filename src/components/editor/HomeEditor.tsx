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
import { resolveHomepage, materializeHomepageSource, type HomepageSource } from "@/lib/homepage";

type HomepageSrc = NonNullable<HomepageSource>;

export function HomeEditor({ initialSource }: { initialSource: HomepageSrc }) {
  // Seed the draft fully populated (every section/row/field present) so editing
  // one field never POSTs a sparse array that fails Payload's required-field
  // validation. Render is unchanged (resolveHomepage of a full source is the
  // same data); the public site never uses this path.
  const seeded = materializeHomepageSource(initialSource);
  return (
    <EditProvider<HomepageSrc> apiPath="/api/globals/homepage" initial={seeded}>
      {(draft) => (
        // `translate="no"` + `notranslate` keep Chrome's "Translate this page"
        // away from the editor. Translate rewrites text nodes (wrapping them in
        // <font> tags); when an <Editable> contentEditable then re-renders on
        // select, React reconciles against those mutated nodes and wipes the
        // text — the classic React + Google-Translate disappearing-content bug.
        // Excluding the whole editing surface is correct anyway: you edit the
        // real source copy here, not a translation.
        <div className="bfi-editing notranslate" translate="no">
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
