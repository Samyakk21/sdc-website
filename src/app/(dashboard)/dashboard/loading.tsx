import { Container } from "@/components/ui/container";
import { EventGridSkeleton, LoadingLabel, Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <>
      <section className="border-b border-slate-200 bg-slate-50 py-14 sm:py-16">
        <Container>
          <LoadingLabel label="Loading dashboard" />
          <div aria-hidden>
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-3 h-9 w-64 max-w-full" />
            <Skeleton className="mt-4 h-4 w-full max-w-md" />
          </div>
        </Container>
      </section>

      <Container className="space-y-16 py-16 sm:py-20">
        <section aria-hidden>
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3 h-7 w-64 max-w-full" />
          <Skeleton className="mt-3 h-4 w-full max-w-xl" />
          <EventGridSkeleton count={3} />
        </section>
      </Container>
    </>
  );
}
