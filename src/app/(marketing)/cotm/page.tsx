import type { Metadata } from "next";
import { ArrowRight, UserPlus, CalendarCheck, Gauge, Trophy } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { TrackCard } from "@/components/cotm/track-card";
import { tracks } from "@/lib/content/tracks";
import { getEventsByTrack } from "@/lib/content/events";

export const metadata: Metadata = {
  title: "Career of the Month",
  description:
    "Career of the Month exposes IISER Bhopal students to a career domain through a structured set of events, resources, and activities each month.",
};

const steps = [
  {
    icon: UserPlus,
    title: "Enroll",
    description: "Join the track with your IISER Bhopal account.",
  },
  {
    icon: CalendarCheck,
    title: "Participate",
    description: "Attend the track's events and work through its resources.",
  },
  {
    icon: Gauge,
    title: "Track progress",
    description: "Watch your progress grow as you join each part of the track.",
  },
  {
    icon: Trophy,
    title: "Complete",
    description: "Reach the threshold to complete the track.",
  },
];

export default function CotMPage() {
  const active = tracks.find((track) => track.status === "active");
  return (
    <>
      <PageHeader
        eyebrow="Career of the Month"
        title="One field, one month, one structured path"
        description="Each month, Career of the Month takes you deep into a career domain — through events, resources, and activities put together so you actually walk away knowing the field."
      />

      <Container className="py-16 sm:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="rounded-xl border border-slate-200 bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Step {index + 1}</p>
                <span className="mt-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="mt-3 font-semibold text-slate-900">{step.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.description}</p>
              </div>
            );
          })}
        </div>

        {active ? (
          <section className="mt-16">
            <SectionHeading
              eyebrow="Current"
              title="Active track this month"
              description="The track that's running right now."
            />
            <div className="mt-8 rounded-2xl bg-ink-950 p-8 text-white sm:p-10">
              <div className="grid items-center gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <p className="text-sm uppercase tracking-wider text-brand-400">This month</p>
                  <h2 className="mt-2 text-3xl font-bold">{active.title}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">{active.tagline}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button href={`/cotm/${active.slug}`} variant="primary" size="md">
                      Enroll now
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                    <Button
                      href={`/cotm/${active.slug}`}
                      variant="outline"
                      size="md"
                      className="border-slate-600 text-white hover:border-slate-500 hover:bg-white/10 hover:text-white"
                    >
                      View track details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="mt-16">
          <SectionHeading eyebrow="Tracks" title="All tracks" />
          <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {tracks.map((track) => (
              <li key={track.slug}>
                <TrackCard track={track} eventCount={getEventsByTrack(track.slug).length} />
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}