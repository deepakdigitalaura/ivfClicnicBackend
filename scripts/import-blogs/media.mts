/* Remote image -> Payload Media upload, via the REST multipart contract
 * (`file` part = binary, `_payload` part = JSON string of other fields).
 * Dedupes by filename so re-running the import doesn't create duplicates. */

export async function uploadImageFromUrl(
  baseUrl: string,
  authHeader: string,
  srcUrl: string,
  alt: string,
): Promise<number> {
  const filename = decodeURIComponent(srcUrl.split("/").pop()!.split("?")[0]) || "image.jpg";

  const existing = await fetch(
    `${baseUrl}/api/media?where[filename][equals]=${encodeURIComponent(filename)}&limit=1`,
    { headers: { Authorization: authHeader } },
  ).then((r) => r.json());
  if (existing.docs?.length) return existing.docs[0].id;

  const imgRes = await fetch(srcUrl);
  if (!imgRes.ok) throw new Error(`image fetch failed ${srcUrl}: HTTP ${imgRes.status}`);
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const mime = imgRes.headers.get("content-type") || "image/png";

  const form = new FormData();
  form.append("file", new Blob([buf], { type: mime }), filename);
  form.append("_payload", JSON.stringify({ alt }));

  const res = await fetch(`${baseUrl}/api/media`, {
    method: "POST",
    headers: { Authorization: authHeader },
    body: form,
  });
  const out = await res.json();
  if (!res.ok) throw new Error(`media upload failed for ${filename}: HTTP ${res.status} ${JSON.stringify(out)}`);
  return out.doc.id;
}
