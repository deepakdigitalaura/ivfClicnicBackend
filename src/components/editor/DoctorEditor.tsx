"use client";

import "./editor.css";
import { EditProvider } from "./edit-context";
import { EditorToolbar } from "./EditorToolbar";
import { FloatingToolbar } from "./FloatingToolbar";
import { DoctorProfile } from "@/components/doctor-page";
import { resolveDoctor, materializeDoctorSource, type DoctorSource } from "@/lib/doctors";

type DoctorSrc = NonNullable<DoctorSource>;

export function DoctorEditor({
  slug,
  initialSource,
  apiPath,
}: {
  slug: string;
  initialSource: DoctorSrc;
  apiPath: string;
}) {
  const seeded = materializeDoctorSource(slug, initialSource);

  return (
    <EditProvider<DoctorSrc> apiPath={apiPath} method="PATCH" initial={seeded}>
      {(draft) => {
        const resolved = resolveDoctor(slug, draft);
        return (
          <div className="bfi-editing notranslate" translate="no">
            <EditorToolbar pageLabel={`Doctor: ${draft.name || slug}`} />
            <FloatingToolbar />
            <div className="bfi-edit-canvas">
              {resolved && <DoctorProfile doctor={resolved} />}
            </div>
          </div>
        );
      }}
    </EditProvider>
  );
}

export default DoctorEditor;
