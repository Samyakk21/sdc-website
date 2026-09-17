import Link from "next/link";
import { ArrowRight, CalendarRange } from "lucide-react";

import type { Track } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const trackStatusTone = {
  planned: "amber",
  active: "green",
  completed: "slate",
} as const;

export function TrackCard({ track, eventCount }: { track: Track; eventCount: number }) {
  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <Badge tone={trackStatusTone[track.status]}>
          {track.status === "active" ? "Current Track" : "Past Track"}
        </Badge>
      </div>
      <h3 className="mt-4 text-xl font-bold text-slate-900">
        <Link href={`/cotm/${track.slug}`} className="after:absolute after:inset-0">
          {track.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{track.tagline}</p>
      <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        <CalendarRange className="h-4 w-4 text-slate-400" aria-hidden />
        <span>{eventCount} events across {track.timeline.length} weeks</span>
      </div>
      <div className="mt-auto flex items-center justify-between pt-5">
        <span className="text-sm font-medium text-brand-600">
          Explore track
          <ArrowRight className="ml-1 inline h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </article>
  );
}