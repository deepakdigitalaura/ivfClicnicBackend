"use client";

/* Inline visual editor for a single Blog post.
 * Renders the REAL <BlogArticle> layout inside the EditProvider so all
 * <Editable> / <EditableImage> wrappers inside it become click-to-edit.
 * Editable in the inline editor:
 *   title        — click the H1 in the dark hero
 *   excerpt      — click the lead paragraph in the hero
 *   heroImage    — click the featured image to replace
 * Article body (Lexical rich text), FAQs, SEO, and relationships are
 * admin-only: an "Open in Admin" link is shown in place of the body. */

import "./editor.css";
import { EditProvider } from "./edit-context";
import { EditorToolbar } from "./EditorToolbar";
import { FloatingToolbar } from "./FloatingToolbar";
import { BlogArticle } from "@/components/blog-article";
import type { Blog } from "@/payload-types";

export type BlogDoc = Record<string, unknown> & {
  id: number | string;
  title: string;
  slug: string;
  excerpt?: string | null;
  heroImage?: unknown;
  author?: unknown;
  reviewedBy?: unknown;
  category?: unknown;
  publishedAt?: string | null;
  lastUpdatedAt?: string | null;
  readMins?: number | null;
  content?: unknown;
  faqs?: unknown;
  treatmentSlugs?: unknown;
  locationSlugs?: unknown;
};

export function BlogEditor({
  initialDoc,
  apiPath,
}: {
  initialDoc: BlogDoc;
  apiPath: string;
}) {
  return (
    <EditProvider<BlogDoc> apiPath={apiPath} method="PATCH" initial={initialDoc}>
      {(draft) => (
        <div className="bfi-editing notranslate" translate="no">
          <EditorToolbar
            pageLabel={`Blog: ${draft.title || "post"}`}
            backUrl={`/blog/${draft.slug}`}
            deleteUrl={apiPath}
            hubUrl="/edit/blog"
          />
          <FloatingToolbar />
          <div className="bfi-edit-canvas">
            {/* Cast draft → Blog: the draft is the full depth-2 doc from Payload,
                so author/reviewedBy/category/heroImage are populated objects.
                BlogArticle handles both populated and unpopulated shapes via asObj(). */}
            <BlogArticle
              blog={draft as unknown as Blog}
              headings={[]}
              relatedBlogs={[]}
            />
          </div>
        </div>
      )}
    </EditProvider>
  );
}

export default BlogEditor;
