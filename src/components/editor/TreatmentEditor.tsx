"use client";

/* Wires the inline editor for a Treatment page: holds the editable draft of the
 * treatment document (collection item), renders the real <TreatmentPage> from the
 * resolved draft, and shows the floating toolbar. Save PATCHes the draft back to
 * Payload. */

import "./editor.css";
import { EditProvider } from "./edit-context";
import { EditorToolbar } from "./EditorToolbar";
import { FloatingToolbar } from "./FloatingToolbar";
import { TreatmentPage } from "@/components/treatment-page";
import { resolveTreatment, materializeTreatmentSource, type TreatmentSource } from "@/lib/treatment-content";
import { testimonialsForTreatment, type VideoTestimonial } from "@/lib/video-testimonials";

type TreatmentSrc = NonNullable<TreatmentSource>;

export function TreatmentEditor({
  slug,
  initialSource,
  apiPath,
}: {
  slug: string;
  initialSource: TreatmentSrc;
  apiPath: string;
}) {
  // Seed the draft fully populated (every section/row/field present) so editing
  // one field never PATCHes a sparse array that fails Payload's required-field
  // validation.
  const seeded = materializeTreatmentSource(slug, initialSource);

  return (
    <EditProvider<TreatmentSrc> apiPath={apiPath} method="PATCH" initial={seeded}>
      {(draft) => {
        const resolved = resolveTreatment(slug, draft);
        // Resolve testimonials from the draft first; fall back to code defaults.
        // The draft is always fully seeded by materializeTreatmentSource, so
        // draft.testimonials will be populated from the first render.
        const editTestimonials: VideoTestimonial[] = draft.testimonials?.length
          ? (draft.testimonials as { youTubeId?: string | null; name?: string | null; quote?: string | null; location?: string | null }[]).map((t) => ({
              youTubeId: t.youTubeId ?? "",
              name: t.name ?? "",
              quote: t.quote ?? "",
              ...(t.location ? { location: t.location } : {}),
            }))
          : testimonialsForTreatment(slug);
        return (
          <div className="bfi-editing notranslate" translate="no">
            <EditorToolbar pageLabel={`Treatment: ${draft.name || slug}`} />
            <FloatingToolbar />
            <div className="bfi-edit-canvas">
              {resolved && <TreatmentPage slug={slug} content={resolved} editTestimonials={editTestimonials} />}
            </div>
          </div>
        );
      }}
    </EditProvider>
  );
}

export default TreatmentEditor;
