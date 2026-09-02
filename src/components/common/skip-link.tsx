/** Lets keyboard users jump past the header straight to page content. */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only-focusable bg-foreground text-background fixed top-3 left-3 z-100 rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg"
    >
      Skip to content
    </a>
  );
}
