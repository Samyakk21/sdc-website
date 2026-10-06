import type { SDCEvent } from "@/lib/types";

// Intentionally empty: no events are published right now.
// Public pages fall back to the database (`events-repo.ts`), so real events
// added in Supabase show up here without touching this file.
export const events: SDCEvent[] = [];

export function getEvent(slug: string) {
  return events.find((event) => event.slug === slug);
}

export function getEventsByTrack(trackSlug: string) {
  return events.filter((event) => event.trackSlug === trackSlug);
}
