import type { Metadata } from "next";
import { CalendarX2, Pin } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "@/components/events/event-card";
import { EmptyState } from "@/components/ui/empty-state";
import { listEvents } from "@/lib/events-repo";
import { isEventOpen } from "@/lib/event-status";
import { announcements } from "@/lib/content/announcements";
import { formatDate } from "@/lib/format";

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

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Events & workshops"
        description="Talks, workshops, and sessions organised by the council. Registration is free for IISER Bhopal students."
      />

      <Container className="py-16 sm:py-20">
        <div className="space-y-16">
          {sortedAnnouncements.length > 0 ? (
            <section id="announcements" aria-labelledby="announcements-heading">
              <SectionHeading
                id="announcements-heading"
                eyebrow="Announcements"
                title="News & notices"
                description="Official updates from the council — enrolment deadlines, launches, and important information."
              />
              <ol className="mt-8 space-y-4">
                {sortedAnnouncements.map((announcement) => (
                  <li key={announcement.title} className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-2">
                      {announcement.pinned ? (
                        <Badge tone="brand">
                          <Pin className="h-3 w-3" aria-hidden />
                          Pinned
                        </Badge>
                      ) : null}
                      <time className="text-xs text-slate-500" dateTime={announcement.date}>
                        {formatDate(announcement.date)}
                      </time>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-slate-900">{announcement.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{announcement.body}</p>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <section aria-labelledby="open-now-heading">
            <SectionHeading
              id="open-now-heading"
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

          {comingUp.length > 0 ? (
            <section aria-labelledby="coming-up-heading">
              <SectionHeading
                id="coming-up-heading"
                eyebrow="Coming up"
                title="Upcoming events"
                description="Get these on your calendar before they arrive."
              />
              <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {comingUp.map((event) => (
                  <li key={event.slug}>
                    <EventCard event={event} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {past.length > 0 ? (
            <section aria-labelledby="past-heading">
              <SectionHeading id="past-heading" eyebrow="Past" title="Recently ended" />
              <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {past.map((event) => (
                  <li key={event.slug}>
                    <EventCard event={event} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </Container>
    </>
  );
}
