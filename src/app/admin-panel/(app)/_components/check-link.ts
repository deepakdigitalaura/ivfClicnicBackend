/* Shared by rich-text-editor.tsx and link-textarea.tsx: warns when an
 * inserted internal link doesn't resolve, instead of silently saving a
 * guessed/typo'd path. External links are never checked. */
export async function isBrokenInternalLink(url: string): Promise<boolean> {
  if (!url.startsWith("/")) return false;
  try {
    const res = await fetch(`/api/admin/check-link?path=${encodeURIComponent(url)}`);
    if (!res.ok) return false; // fail open — don't block on our own API hiccup
    const data = await res.json();
    return data.ok === false;
  } catch {
    return false;
  }
}
