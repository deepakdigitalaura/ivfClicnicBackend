"use client";

/* Wires the inline editor for a maternity Service page: holds the editable draft
 * of the service document (collection item), renders the real <ServicePage> from
 * the resolved draft, and shows the floating toolbar. Save PATCHes the draft back
 * to Payload. Mirrors TreatmentEditor / DoctorEditor. */

import "./editor.css";
import { EditProvider } from "./edit-context";
import { EditorToolbar } from "./EditorToolbar";
import { FloatingToolbar } from "./FloatingToolbar";
import { ServicePage } from "@/components/service-page";
import { resolveService, materializeServiceSource, type ServiceSource } from "@/lib/services";

type ServiceSrc = NonNullable<ServiceSource>;

export function ServiceEditor({
  slug,
  initialSource,
  apiPath,
}: {
  slug: string;
  initialSource: ServiceSrc;
  apiPath: string;
}) {
  // Seed the draft fully populated (every section/row/field present) so editing
  // one field never PATCHes a sparse array that fails Payload required-field
  // validation.
  const seeded = materializeServiceSource(slug, initialSource);

  return (
    <EditProvider<ServiceSrc> apiPath={apiPath} method="PATCH" initial={seeded}>
      {(draft) => {
        const resolved = resolveService(slug, draft);
        return (
          <div className="bfi-editing notranslate" translate="no">
            <EditorToolbar pageLabel={`Service: ${draft.shortName || slug}`} />
            <FloatingToolbar />
            <div className="bfi-edit-canvas">
              {resolved && <ServicePage slug={slug} content={resolved} />}
            </div>
          </div>
        );
      }}
    </EditProvider>
  );
}

export default ServiceEditor;
