export function Progress({
  value,
  showLabel = true,
  className = "",
}: {
  value: number;
  showLabel?: boolean;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-brand-600 transition-all"
            style={{ width: `${clamped}%` }}
            role="progressbar"
            aria-valuenow={clamped}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progress"
          />
        </div>
        {showLabel ? <span className="w-12 shrink-0 text-right text-sm font-semibold text-brand-700">{clamped}%</span> : null}
      </div>
    </div>
  );
}