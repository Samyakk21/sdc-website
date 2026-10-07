import { Hero } from "@/components/home/hero";
import { AboutSection } from "@/components/home/about-section";
import { InitiativesSection } from "@/components/home/initiatives-section";
import { EventsSection } from "@/components/home/events-section";
import { CotMSection } from "@/components/home/cotm-section";
import { ResourcesSection } from "@/components/home/resources-section";
import { AnnouncementsSection } from "@/components/home/announcements-section";
import { CtaBand } from "@/components/home/cta-band";
import { listEvents } from "@/lib/events-repo";
import { tracks } from "@/lib/content/tracks";
import { resources } from "@/lib/content/resources";
import { announcements } from "@/lib/content/announcements";

export default async function HomePage() {
  const upcomingEvents = (await listEvents())
    .filter((event) => event.status === "registration_open" || event.status === "upcoming")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const activeTrack = tracks.find((track) => track.status === "active") ?? tracks[0] ?? null;

  return (
    <>
      <Hero />
      {announcements.length > 0 ? <AnnouncementsSection announcements={announcements} /> : null}
      <AboutSection />
      <InitiativesSection />
      {upcomingEvents.length > 0 ? <EventsSection events={upcomingEvents} /> : null}
      {activeTrack ? <CotMSection track={activeTrack} /> : null}
      {resources.length > 0 ? <ResourcesSection resources={resources} /> : null}
      <CtaBand />
    </>
  );
}