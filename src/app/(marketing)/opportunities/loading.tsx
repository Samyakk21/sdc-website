import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingLabel, OpportunityCardSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function OpportunitiesLoading() {
  return (
    <>
      <PageHeader
        eyebrow="Opportunities"
        title="Student opportunity board"
        description="Opportunities shared by students, for students. Post a research role, internship, hackathon, job, or fellowship to help your peers."
      />
      <Container className="py-16 sm:py-20">
        <LoadingLabel label="Loading opportunities" />
        <div aria-hidden className="space-y-8">
          <div className="rounded-3xl bg-ink-900 px-6 py-8 sm:px-9 sm:py-10">
            <div className="animate-pulse motion-reduce:animate-none space-y-4">
              <div className="h-6 w-52 max-w-full rounded-full bg-white/10" />
              <div className="h-8 w-80 max-w-full rounded-md bg-white/10" />
              <div className="h-4 w-full max-w-lg rounded-md bg-white/10" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-10 w-full rounded-lg sm:w-64" />
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>

          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>

          <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <li key={index} className="min-w-0">
                <OpportunityCardSkeleton />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </>
  );
}
