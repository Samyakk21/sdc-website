import { Suspense } from "react";

import { Hero } from "@/components/home/hero";
import { AboutSection } from "@/components/home/about-section";
import { InitiativesSection } from "@/components/home/initiatives-section";
import { EventsSection, EventsSectionSkeleton } from "@/components/home/events-section";
import { CotMSection } from "@/components/home/cotm-section";
import { ResourcesSection } from "@/components/home/resources-section";
import { AnnouncementsSection } from "@/components/home/announcements-section";
import { CtaBand } from "@/components/home/cta-band";
import { listEvents } from "@/lib/events-repo";
import { isFutureEvent } from "@/lib/event-status";
import { tracks } from "@/lib/content/tracks";
import { resources } from "@/lib/content/resources";
import { announcements } from "@/lib/content/announcements";

export default function HomePage() {
  const activeTrack = tracks.find((track) => track.status === "active") ?? tracks[0] ?? null;

  return (
    <>
      <Hero />
      {announcements.length > 0 ? <AnnouncementsSection announcements={announcements} /> : null}
      <AboutSection />
      <InitiativesSection />
      {/* The events list is the only DB read on the page; stream it in so the
          hero and static sections paint immediately. */}
      <Suspense fallback={<EventsSectionSkeleton />}>
        <UpcomingEventsSection />
      </Suspense>
      {activeTrack ? <CotMSection track={activeTrack} /> : null}
      {resources.length > 0 ? <ResourcesSection resources={resources} /> : null}
      <CtaBand />
    </>
  );
}

async function UpcomingEventsSection() {
  const upcomingEvents = (await listEvents())
    .filter((event) => isFutureEvent(event))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (upcomingEvents.length === 0) return null;
  return <EventsSection events={upcomingEvents} />;
}
