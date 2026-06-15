"use client";

/* Wires the inline editor for a City hub page (/edit/locations/[slug]): holds
 * the editable draft of the `cities` doc, renders the real <CityPage> from the
 * resolved draft, and shows the floating toolbar. Save PATCHes back to Payload.
 * Mirrors TreatmentEditor / ServiceEditor. */

import "./editor.css";
import { EditProvider } from "./edit-context";
import { EditorToolbar } from "./EditorToolbar";
import { FloatingToolbar } from "./FloatingToolbar";
import { CityPage } from "@/components/city-page";
import { resolveCity, materializeCitySource, type CitySource } from "@/lib/location-content";

type CitySrc = NonNullable<CitySource>;

export function CityEditor({
  slug,
  initialSource,
  apiPath,
}: {
  slug: string;
  initialSource: CitySrc;
  apiPath: string;
}) {
  const seeded = materializeCitySource(slug, initialSource);

  return (
    <EditProvider<CitySrc> apiPath={apiPath} method="PATCH" initial={seeded}>
      {(draft) => {
        const resolved = resolveCity(slug, draft);
        return (
          <div className="bfi-editing notranslate" translate="no">
            <EditorToolbar pageLabel={`City: ${draft.name || slug}`} backUrl={`/locations/${slug}`} />
            <FloatingToolbar />
            <div className="bfi-edit-canvas">
              {resolved && <CityPage city={resolved} />}
            </div>
          </div>
        );
      }}
    </EditProvider>
  );
}

export default CityEditor;
