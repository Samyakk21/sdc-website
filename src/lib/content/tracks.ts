import type { Track } from "@/lib/types";

// Intentionally empty: no Career of the Month track is running right now.
// The home CoTM section and the `/cotm` track lists render only when this
// array has content, so the pages stay empty until the next track is approved.
export const tracks: Track[] = [];

export function getTrack(slug: string) {
  return tracks.find((track) => track.slug === slug);
}
