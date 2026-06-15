"use client";

/* Wires the inline editor for the About-BFI page (/edit/about-bfi): holds the
 * editable draft of the `about-page` global, renders the real <AboutPage> from
 * the resolved draft, and shows the floating toolbar. Save POSTs the draft →
 * live. Mirrors HomeEditor (global, not a collection item). */

import "./editor.css";
import { EditProvider } from "./edit-context";
import { EditorToolbar } from "./EditorToolbar";
import { FloatingToolbar } from "./FloatingToolbar";
import { AboutPage } from "@/components/about-page";
import { resolveAbout, materializeAboutSource, type AboutSource } from "@/lib/about";

type AboutSrc = NonNullable<AboutSource>;

export function AboutEditor({ initialSource }: { initialSource: AboutSrc }) {
  const seeded = materializeAboutSource(initialSource);
  return (
    <EditProvider<AboutSrc> apiPath="/api/globals/about-page" initial={seeded}>
      {(draft) => (
        <div className="bfi-editing notranslate" translate="no">
          <EditorToolbar pageLabel="About Bavishi Fertility Institute" backUrl="/about-bfi" />
          <FloatingToolbar />
          <div className="bfi-edit-canvas">
            <AboutPage data={resolveAbout(draft)} />
          </div>
        </div>
      )}
    </EditProvider>
  );
}

export default AboutEditor;
