/**
 * Renders a JSON-LD block.
 *
 * The payload is built server-side from our own configuration — never from
 * user input — and serialised with `<` escaped so a stray character can not
 * close the script tag early.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
