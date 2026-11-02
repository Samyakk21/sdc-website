import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingLabel, Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Overview"
        description="Manage SDC content — events, resources, and opportunity submissions."
      />
      <Container className="py-10 sm:py-12">
        <LoadingLabel label="Loading admin" />
        <div aria-hidden>
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3 h-7 w-64 max-w-full" />
          <Skeleton className="mt-3 h-4 w-full max-w-xl" />

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <Skeleton className="h-3 w-28" />
                <Skeleton className="mt-3 h-7 w-12" />
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-3 h-7 w-48" />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-white p-6"
                >
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-2 h-3 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
