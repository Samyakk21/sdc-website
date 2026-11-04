/**
 * Lightweight loading placeholders. These render instantly while the real
 * content streams in, and are marked aria-hidden so screen readers jump
 * straight to the loaded page.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`animate-pulse rounded-md bg-slate-200 motion-reduce:animate-none ${className}`}
    />
  );
}

/** Announces loading to assistive tech without duplicating visible text. */
export function LoadingLabel({ label = "Loading…" }: { label?: string }) {
  return (
    <span role="status" className="sr-only">
      {label}
    </span>
  );
}
