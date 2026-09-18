import type { Metadata } from "next";
import { CalendarX2 } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { EventCard } from "@/components/events/event-card";
import { EmptyState } from "@/components/ui/empty-state";
import { listEvents } from "@/lib/events-repo";
import { isEventOpen } from "@/lib/event-status";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming events, workshops, and sessions from the Student Development Council at IISER Bhopal.",
};

export default async function EventsPage() {
  const events = await listEvents();

  const byDate = (a: { date: string }, b: { date: string }) =>
    new Date(a.date).getTime() - new Date(b.date).getTime();
  const byDateDesc = (a: { date: string }, b: { date: string }) =>
    new Date(b.date).getTime() - new Date(a.date).getTime();

  const registerNow = events.filter(isEventOpen).sort(byDate);
  const comingUp = events
    .filter((event) => event.status === "upcoming")
    .sort(byDate);
  const past = events
    .filter((event) => event.status === "completed" || event.status === "cancelled" || event.status === "registration_closed")
    .sort(byDateDesc);

  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Events & workshops"
        description="Talks, workshops, and sessions organised by the council. Registration is free for IISER Bhopal students."
      />

      <Container className="py-16 sm:py-20">
        <div className="space-y-16">
          <section>
            <SectionHeading
              eyebrow="Open now"
              title="Register for these sessions"
              description="Slots are limited — secure your seat before the deadline."
            />
            {registerNow.length > 0 ? (
              <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {registerNow.map((event) => (
                  <li key={event.slug}>
                    <EventCard event={event} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-8">
                <EmptyState
                  icon={<CalendarX2 className="h-8 w-8" aria-hidden />}
                  title="Registration is closed right now"
                  description="New registrations will open when the next event is announced."
                />
              </div>
            )}
          </section>

          <section>
            <SectionHeading
              eyebrow="Coming up"
              title="Upcoming events"
              description="Get these on your calendar before they arrive."
            />
            {comingUp.length > 0 ? (
              <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {comingUp.map((event) => (
                  <li key={event.slug}>
                    <EventCard event={event} />
                  </li>
                ))}
              </ul>
            ) : null}
          </section>

          <section>
            <SectionHeading eyebrow="Past" title="Recently ended" />
            <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <li key={event.slug}>
                  <EventCard event={event} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Container>
    </>
  );
}