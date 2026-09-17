import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpenText, CalendarCheck, CheckCircle2 } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { EventCard } from "@/components/events/event-card";
import { ResourceCard } from "@/components/resources/resource-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getTrack } from "@/lib/content/tracks";
import { getEventsByTrack } from "@/lib/content/events";
import { resources } from "@/lib/content/resources";

export async function generateMetadata({ params }: PageProps<"/cotm/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const track = getTrack(slug);
  if (!track) return {};
  return {
    title: track.title,
    description: track.tagline,
  };
}

export default async function TrackPage({ params }: PageProps<"/cotm/[slug]">) {
  const { slug } = await params;
  const track = getTrack(slug);
  if (!track) notFound();

  const trackEvents = getEventsByTrack(track.slug);
  const trackResources = resources.filter((resource) => resource.trackSlug === track.slug);

  return (
    <>
      <Container className="py-12 sm:py-16">
        <Link
          href="/cotm"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Career of the Month
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="brand">Career of the Month</Badge>
              <Badge tone="green">Active</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{track.title}</h1>
            <p className="mt-3 text-lg leading-relaxed text-slate-600">{track.tagline}</p>

            <SectionHeading className="mt-10" eyebrow="About the track" title="Why this month" />
            <p className="mt-4 text-base leading-relaxed text-slate-700">{track.description}</p>

            <h2 className="mt-8 text-lg font-semibold text-slate-900">Why this matters</h2>
            <p className="mt-2 text-base leading-relaxed text-slate-700">{track.whyItMatters}</p>

            {track.skills.length > 0 ? (
              <>
                <h2 className="mt-8 text-lg font-semibold text-slate-900">What you'll build</h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {track.skills.map((skill) => (
                    <li key={skill} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
                      {skill}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            <h2 className="mt-10 text-lg font-semibold text-slate-900">Timeline</h2>
            <ol className="mt-4 space-y-4">
              {track.timeline.map((entry, index) => (
                <li key={entry.week} className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{entry.week}</p>
                    <h3 className="font-semibold text-slate-900">{entry.title}</h3>
                    {entry.description ? <p className="mt-1 text-sm text-slate-600">{entry.description}</p> : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-lg font-semibold text-slate-900">Join this track</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Enroll to follow your progress across the month's events.
                </p>
                <Button href="/login" className="mt-5 w-full" size="lg">
                  Enroll in this track
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
                <p className="mt-4 text-xs text-slate-500">
                  Track events: {trackEvents.length} · Weeks: {track.timeline.length}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-lg font-semibold text-slate-900">Your journey so far</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Enroll to unlock progress tracking for this track.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Container>

      <Container className="pb-16 sm:pb-20">
        <section>
          <SectionHeading
            eyebrow="Track events"
            title="Events in this track"
            description="The sessions that make up this month's journey."
          />
          {trackEvents.length > 0 ? (
            <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {trackEvents.map((event) => (
                <li key={event.slug}>
                  <EventCard event={event} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-8">
              <EmptyState icon={<CalendarCheck className="h-8 w-8" aria-hidden />} title="Events coming soon" description="Track events will be announced shortly." />
            </div>
          )}
        </section>

        <section className="mt-16">
          <SectionHeading
            eyebrow="Track resources"
            title="Resources for this track"
            description="Curated reading, videos, and roadmaps to deepen your understanding."
          />
          {trackResources.length > 0 ? (
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trackResources.map((resource) => (
                <li key={resource.slug}>
                  <ResourceCard resource={resource} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-8">
              <EmptyState
                icon={<BookOpenText className="h-8 w-8" aria-hidden />}
                title="No resources yet"
                description="Track resources will be added as the month progresses."
              />
            </div>
          )}
        </section>
      </Container>
    </>
  );
}