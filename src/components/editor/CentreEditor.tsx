"use client";

/* Wires the inline editor for a Centre detail page (/edit/locations/[city]/[centre]):
 * holds the editable draft of the `centres` doc, renders the real <CenterPage> from
 * the resolved draft, and shows the floating toolbar. Mirrors CityEditor. */

import "./editor.css";
import { EditProvider } from "./edit-context";
import { EditorToolbar } from "./EditorToolbar";
import { FloatingToolbar } from "./FloatingToolbar";
import { CenterPage } from "@/components/center-page";
import { resolveCentre, materializeCentreSource, type CentreSource } from "@/lib/location-content";

type CentreSrc = NonNullable<CentreSource>;

export function CentreEditor({
  citySlug,
  slug,
  initialSource,
  apiPath,
}: {
  citySlug: string;
  slug: string;
  initialSource: CentreSrc;
  apiPath: string;
}) {
  const seeded = materializeCentreSource(citySlug, slug, initialSource);

  return (
    <EditProvider<CentreSrc> apiPath={apiPath} method="PATCH" initial={seeded}>
      {(draft) => {
        const resolved = resolveCentre(citySlug, slug, draft);
        return (
          <div className="bfi-editing notranslate" translate="no">
            <EditorToolbar
              pageLabel={`Centre: ${draft.name || slug}`}
              backUrl={`/edit/locations/${citySlug}`}
            />
            <FloatingToolbar />
            <div className="bfi-edit-canvas">
              {resolved && <CenterPage centre={resolved} />}
            </div>
          </div>
        );
      }}
    </EditProvider>
  );
}

export default CentreEditor;
