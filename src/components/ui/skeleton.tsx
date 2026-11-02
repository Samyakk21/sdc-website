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

export function EventCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex flex-col-reverse items-start gap-3 sm:flex-row sm:justify-between sm:gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <Skeleton className="h-16 w-14 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1">
            <Skeleton className="h-4 w-40 max-w-full" />
            <Skeleton className="mt-2 h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
      </div>

      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>

      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>

      <div className="mt-auto pt-5">
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export function EventGridSkeleton({
  count = 3,
  className = "mt-8",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <ul className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <li key={index} className="min-w-0">
          <EventCardSkeleton />
        </li>
      ))}
    </ul>
  );
}

export function TeamCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 text-center">
      <Skeleton className="mx-auto mb-4 h-28 w-28 rounded-full" />
      <Skeleton className="mx-auto h-4 w-32" />
      <Skeleton className="mx-auto mt-2 h-3 w-24" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="mx-auto h-3 w-4/5" />
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
    </div>
  );
}

export function OpportunityCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="mt-2 h-3 w-1/2" />
        </div>
        <Skeleton className="h-12 w-11 shrink-0 rounded-lg" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>

      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-2/3" />
      </div>

      <div className="mt-auto flex items-center justify-between pt-5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  );
}
