import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingLabel, Skeleton } from "@/components/ui/skeleton";

export default function TeamLoading() {
  return (
    <>
      <PageHeader
        eyebrow="Team · Tenure 2026–27"
        title="Meet the SDC Team (2026–27)"
        description="The faculty and students who run the Student Development Council at IISER Bhopal for the 2026–27 tenure — advisors, office bearers, the core committee, and our trainees."
      />
      <Container className="space-y-20 py-16 sm:py-20">
        <LoadingLabel label="Loading team" />
        {Array.from({ length: 2 }).map((_, group) => (
          <section key={group} aria-hidden>
            <Skeleton className="mx-auto h-3 w-24" />
            <Skeleton className="mx-auto mt-3 h-8 w-56 max-w-full" />
            <Skeleton className="mx-auto mt-8 h-64 w-full max-w-4xl rounded-xl" />
          </section>
        ))}
      </Container>
    </>
  );
}
