import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingLabel, Skeleton } from "@/components/ui/skeleton";

export default function EventsLoading() {
  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Events & workshops"
        description="Talks, workshops, and sessions organised by the council. Registration is free for IISER Bhopal students."
      />
      <Container className="py-16 sm:py-20">
        <LoadingLabel label="Loading events" />
        <section aria-hidden>
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-8 w-80 max-w-full" />
          <Skeleton className="mt-3 h-4 w-full max-w-xl" />
          <Skeleton className="mt-8 h-72 w-full rounded-xl" />
        </section>
      </Container>
    </>
  );
}
