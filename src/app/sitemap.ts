import type { MetadataRoute } from "next";

import { listEvents } from "@/lib/events-repo";
import { tracks } from "@/lib/content/tracks";
import { absoluteUrl } from "@/lib/seo";

// Events are stored in Supabase, so refresh the sitemap hourly instead of
// freezing it at build time.
export const revalidate = 3600;

const publicRoutes: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/events", priority: 0.9, changeFrequency: "daily" },
  { path: "/opportunities", priority: 0.9, changeFrequency: "daily" },
  { path: "/initiatives", priority: 0.8, changeFrequency: "monthly" },
  { path: "/resources", priority: 0.8, changeFrequency: "weekly" },
  { path: "/cotm", priority: 0.7, changeFrequency: "monthly" },
  { path: "/team", priority: 0.6, changeFrequency: "yearly" },
  { path: "/about", priority: 0.6, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = publicRoutes.map(
    ({ path, priority, changeFrequency }) => ({
      url: absoluteUrl(path),
      changeFrequency,
      priority,
    }),
  );

  let events: MetadataRoute.Sitemap = [];
  try {
    const list = await listEvents();
    events = list
      .filter((event) => event.status !== "cancelled")
      .map((event) => ({
        url: absoluteUrl(`/events/${event.slug}`),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
  } catch {
    // A database hiccup must not break the sitemap for crawlers.
  }

  const trackEntries: MetadataRoute.Sitemap = tracks.map((track) => ({
    url: absoluteUrl(`/cotm/${track.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...events, ...trackEntries];
}
