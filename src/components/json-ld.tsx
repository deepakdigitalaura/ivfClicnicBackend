/* Server-safe JSON-LD injector.
 *
 * Renders a single <script type="application/ld+json"> with a schema.org
 * @graph. Passing an array (graph) keeps all nodes in ONE script so their
 * @id cross-references (#organization, #website, etc.) resolve as a single
 * connected graph — which is how Google and LLM crawlers merge entities. */
export function JsonLd({ graph }: { graph: Record<string, unknown>[] }) {
  const data = { "@context": "https://schema.org", "@graph": graph };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
