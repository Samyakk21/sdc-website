/**
 * Renders schema.org structured data. The payload is built by the caller from
 * trusted, local objects (never user input echoed verbatim), and `<` is escaped
 * so a value can never terminate the script tag.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
