import { ArrowRight, CalendarX2 } from "lucide-react";

import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { EventCard } from "@/components/events/event-card";
import type { SDCEvent } from "@/lib/types";

export function EventsSection({ events, limit = 3 }: { events: SDCEvent[]; limit?: number }) {
  const visible = events.slice(0, limit);
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow="Events"
          title="Upcoming events"
          description="Talks, workshops, and sessions you can attend now."
          action={
            <Button href="/events" variant="outline" size="sm">
              View all events
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          }
        />
        {visible.length > 0 ? (
          <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((event) => (
              <li key={event.slug}>
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10">
            <EmptyState
              icon={<CalendarX2 className="h-8 w-8" aria-hidden />}
              title="No upcoming events"
              description="New events will appear here as soon as they're announced."
            />
          </div>
        )}
      </Container>
    </section>
  );
}