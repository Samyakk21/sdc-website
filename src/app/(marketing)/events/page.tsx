import type { Metadata } from "next";
import { CalendarX2, Pin } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "@/components/events/event-card";
import { EmptyState } from "@/components/ui/empty-state";
import { listEvents } from "@/lib/events-repo";
import { eventPhase } from "@/lib/event-status";
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

  const openNow = events.filter((e) => eventPhase(e) === "open").sort(byDate);
  const concluded = events
    .filter((e) => eventPhase(e) === "finished")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
          <section aria-labelledby="open-now-heading">
            <SectionHeading
              id="open-now-heading"
              eyebrow="Open now"
              title="Register for these sessions"
              description="New registrations open when the next session is announced."
            />
            {openNow.length > 0 ? (
              <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {openNow.map((event) => (
                  <li key={event.slug} className="min-w-0">
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

          {concluded.length > 0 ? (
            <section aria-labelledby="concluded-heading">
              <SectionHeading
                id="concluded-heading"
                eyebrow="Concluded"
                title="Recently concluded"
                description="Events that wrapped up more than a week ago."
              />
              <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {concluded.map((event) => (
                  <li key={event.slug} className="min-w-0">
                    <EventCard event={event} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

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
        </div>
      </Container>
    </>
  );
}
