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

          <Skeleton className="mt-8 h-28 w-full rounded-xl" />

          <div className="mt-12">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-3 h-7 w-48" />
            <Skeleton className="mt-8 h-40 w-full rounded-xl" />
          </div>
        </div>
      </Container>
    </>
  );
}
