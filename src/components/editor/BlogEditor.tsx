"use client";

/* Inline visual editor for a single Blog post.
 * Renders the blog article layout with <Editable> wrappers around title,
 * excerpt, and hero image. The article body (Lexical rich text) stays
 * admin-only — an "Open in Admin" link is shown instead.
 * Save PATCHes the draft to /api/blogs/<id>. */

import "./editor.css";
import { EditProvider } from "./edit-context";
import { EditorToolbar } from "./EditorToolbar";
import { FloatingToolbar } from "./FloatingToolbar";
import { Editable, EditableImage } from "./Editable";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/home-page";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

export type BlogDoc = Record<string, unknown> & {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  heroImage?: unknown;
  author?: unknown;
  category?: unknown;
  publishedAt?: string | null;
  readMins?: number | null;
};

type MediaObj = { id?: string; url?: string | null; alt?: string | null };
type AuthorObj = { name: string; role?: string | null };
type CategoryObj = { title: string };

function asObj<T>(v: unknown): T | null {
  return v && typeof v === "object" ? (v as T) : null;
}

function BlogEditorCanvas({ doc }: { doc: BlogDoc }) {
  const author = asObj<AuthorObj>(doc.author);
  const category = asObj<CategoryObj>(doc.category);
  const heroMedia = asObj<MediaObj>(doc.heroImage);
  // After editor image replace, heroImage may be a plain string URL
  const heroUrl = typeof doc.heroImage === "string" ? doc.heroImage : heroMedia?.url;
  const heroAlt = heroMedia?.alt ?? doc.title;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav
          className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
          <span>/</span>
          <a href="/blog" className="hover:text-[color:var(--rose)]">Blog</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)] line-clamp-1">{doc.title}</span>
        </nav>
      </div>

      {/* Header */}
      <section className="container-px mx-auto max-w-3xl pt-12 md:pt-16">
        {category && (
          <span className="inline-block rounded-full bg-[color:var(--rose)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[color:var(--rose)]">
            {category.title}
          </span>
        )}
        <h1 className="mt-4 text-3xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-4xl lg:text-[2.75rem]">
          <Editable path="title" rich={false}>{doc.title}</Editable>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">
          <Editable path="excerpt" rich={false}>{doc.excerpt ?? ""}</Editable>
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {author && (
            <span className="font-medium text-[color:var(--plum)]">{author.name}</span>
          )}
          {doc.publishedAt && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-[color:var(--rose)]" />
              {format(new Date(doc.publishedAt as string), "MMMM d, yyyy")}
            </span>
          )}
          {doc.readMins ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-[color:var(--rose)]" />
              {doc.readMins as number} min read
            </span>
          ) : null}
        </div>
      </section>

      {/* Hero image */}
      {heroUrl && (
        <section className="container-px mx-auto mt-8 max-w-4xl">
          <div className="overflow-hidden rounded-3xl border border-border/70 shadow-soft">
            <EditableImage
              path="heroImage"
              src={heroUrl}
              alt={heroAlt}
              className="h-full w-full object-cover"
            />
          </div>
        </section>
      )}

      {/* Content — admin only in the inline editor */}
      <section className="container-px mx-auto max-w-3xl py-10 md:py-14">
        <div className="rounded-2xl border border-dashed border-[color:var(--rose)]/40 bg-[color:var(--rose)]/5 p-8 text-center">
          <p className="text-sm font-medium text-[color:var(--plum)]">
            Article body (rich text) is edited in the admin panel
          </p>
          <a
            href={`/admin/collections/blogs/${doc.id}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--rose)] hover:underline"
          >
            Open in Admin →
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

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
            <BlogEditorCanvas doc={draft} />
          </div>
        </div>
      )}
    </EditProvider>
  );
}

export default BlogEditor;
