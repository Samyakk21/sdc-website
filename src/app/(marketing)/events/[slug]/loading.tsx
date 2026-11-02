import { Container } from "@/components/ui/container";
import { LoadingLabel, Skeleton } from "@/components/ui/skeleton";

export default function EventDetailLoading() {
  return (
    <Container className="py-12 sm:py-16">
      <LoadingLabel label="Loading event" />
      <div aria-hidden>
        <Skeleton className="h-4 w-24" />

        <div className="mt-6 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="mt-4 h-10 w-full max-w-xl" />
            <Skeleton className="mt-3 h-4 w-56" />
            <div className="mt-6 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-4/5" />
            </div>

            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
              <div className="space-y-4">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="mt-3 h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-4/5" />
              <Skeleton className="mt-5 h-10 w-full rounded-lg" />
            </div>
          </aside>
        </div>
      </div>
    </Container>
  );
}
