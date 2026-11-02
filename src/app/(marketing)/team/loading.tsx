import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingLabel, Skeleton, TeamCardSkeleton } from "@/components/ui/skeleton";

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
        {Array.from({ length: 3 }).map((_, group) => (
          <section key={group} aria-hidden>
            <Skeleton className="mx-auto h-3 w-24" />
            <Skeleton className="mx-auto mt-3 h-8 w-56 max-w-full" />
            <ul className="mt-10 flex flex-wrap justify-center gap-6">
              {Array.from({ length: 3 }).map((_, member) => (
                <li
                  key={member}
                  className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                >
                  <TeamCardSkeleton />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Container>
    </>
  );
}
