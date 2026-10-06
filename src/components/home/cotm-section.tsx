import { ArrowRight, Compass } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getEventsByTrack } from "@/lib/content/events";
import type { Track } from "@/lib/types";

export function CotMSection({ track }: { track: Track }) {
  const trackEvents = getEventsByTrack(track.slug);
  return (
    <section className="relative overflow-hidden bg-ink-950 py-16 text-white sm:py-20">
      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge tone="brand">Career of the Month</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{track.title}</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">{track.tagline}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {trackEvents.length > 0 ? `${trackEvents.length} events · ` : ""}
              {track.timeline.length} weeks · this month's structured track
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href={`/cotm/${track.slug}`} variant="primary" size="md">
                Explore this track
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
              <Button href="/cotm" variant="outline" size="md" className="border-slate-600 text-white hover:border-slate-500 hover:bg-white/10 hover:text-white">
                All tracks
              </Button>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-inset ring-white/10">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
              <Compass className="h-4 w-4" aria-hidden />
              This month's journey
            </h3>
            <ol className="mt-5 space-y-4">
              {track.timeline.map((entry, index) => (
                <li key={entry.week} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{entry.title}</p>
                    <p className="text-xs text-slate-400">{entry.week}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}