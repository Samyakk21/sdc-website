import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RegisterPanel } from "@/components/events/register-panel";
import { getEvent, getEventRow, getMyRegistration, getSeatsFilled } from "@/lib/events-repo";
import { getEventsByTrack } from "@/lib/content/events";
import { getTrack } from "@/lib/content/tracks";
import { getCurrentSession } from "@/lib/auth";
import { eventStatusMeta, isDeadlinePast, isEventOpen } from "@/lib/event-status";
import { formatDate, formatTime } from "@/lib/format";

/** Renders a description keeping its line breaks and turning URLs into links. */
function renderDescription(text: string) {
  return text.split(/(https?:\/\/\S+)/g).map((part, index) =>
    /^https?:\/\//.test(part) ? (
      <a
        key={index}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

export function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  return params.then(async ({ slug }) => {
    const event = await getEvent(slug);
    if (!event) return {};
    return {
      title: event.title,
      description: event.description,
    };
  });
}

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const session = await getCurrentSession();
  const row = await getEventRow(slug);

  const meta = eventStatusMeta[event.status];
  const open = isEventOpen(event);
  const track = event.trackSlug ? getTrack(event.trackSlug) : undefined;
  const trackEvents = track ? getEventsByTrack(track.slug) : [];

  const deadlinePast = isDeadlinePast(event.registrationDeadline);

  const registration = row && session ? await getMyRegistration(row.id, session.profile.id) : null;
  const registered = registration?.status === "registered";
  const seatsFilled = row && event.capacity != null ? await getSeatsFilled(row.id) : 0;

  let panel: React.ReactNode = null;

  if (session && registered) {
    panel = (
      <RegisterPanel
        slug={slug}
        mode="registered"
        cancelable={!deadlinePast}
        seatsFilled={0}
        deadlineLabel={event.registrationDeadline ? formatDate(event.registrationDeadline) : undefined}
      />
    );
  } else if (open) {
    if (session) {
      panel = (
        <RegisterPanel
          slug={slug}
          mode="register"
          cancelable
          seatsFilled={seatsFilled}
          capacity={event.capacity}
          deadlineLabel={event.registrationDeadline ? formatDate(event.registrationDeadline) : undefined}
        />
      );
    } else {
      panel = (
        <>
          <h2 className="text-lg font-semibold text-slate-900">Registration open</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Sign in with your IISER Bhopal account to register. It only takes a moment.
          </p>
          <Button
            href={`/login?next=${encodeURIComponent(`/events/${slug}`)}`}
            className="mt-5 w-full"
            size="lg"
          >
            Sign in to register
          </Button>
        </>
      );
    }
  } else if (event.status === "upcoming") {
    panel = (
      <>
        <h2 className="text-lg font-semibold text-slate-900">Registration opening soon</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Keep an eye on this page — registration will open closer to the event.
        </p>
      </>
    );
  } else if (event.status === "registration_closed") {
    panel = (
      <>
        <h2 className="text-lg font-semibold text-slate-900">Registration closed</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Registrations for this event have closed.
        </p>
      </>
    );
  } else {
    panel = (
      <>
        <h2 className="text-lg font-semibold text-slate-900">{meta.label}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {event.status === "completed"
            ? "This event has ended."
            : event.status === "cancelled"
              ? "This event was cancelled."
              : "This event is currently in progress."}
        </p>
      </>
    );
  }

  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All events
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={meta.tone}>{meta.label}</Badge>
            {track ? (
              <Link href={`/cotm/${track.slug}`}>
                <Badge tone="ink">Career of the Month</Badge>
              </Link>
            ) : null}
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{event.title}</h1>
          <p className="mt-3 text-sm font-medium text-slate-500">Organised by {event.organizer}</p>
          <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-slate-700">
            {renderDescription(event.description)}
          </p>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
            <ul className="space-y-4 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" aria-hidden />
                <span>
                  <span className="font-semibold text-slate-900">{formatDate(event.date)}</span>
                  {event.startTime ? (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-slate-400" aria-hidden />
                      {event.endTime ? `${formatTime(event.startTime)} – ${formatTime(event.endTime)}` : formatTime(event.startTime)}
                    </span>
                  ) : null}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" aria-hidden />
                <span>
                  <span className="font-semibold text-slate-900">{event.location}</span>
                  <span className="ml-2 text-slate-500">{event.mode === "online" ? "· Online" : event.mode === "hybrid" ? "· Hybrid" : "· On campus"}</span>
                </span>
              </li>
              {event.capacity ? (
                <li className="flex items-start gap-3">
                  <Users className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" aria-hidden />
                  <span>Capacity: {event.capacity} participants</span>
                </li>
              ) : null}
              {event.registrationDeadline ? (
                <li className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" aria-hidden />
                  <span>Registration deadline: {formatDate(event.registrationDeadline)}</span>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-slate-200 bg-slate-50 p-6">
            {panel}

            {track ? (
              <div className="mt-6 border-t border-slate-200 pt-5">
                <p className="text-sm font-medium text-slate-900">Part of Career of the Month</p>
                <p className="mt-1 text-xs text-slate-500">
                  {track.title} · {trackEvents.length} events in this track
                </p>
                <Link
                  href={`/cotm/${track.slug}`}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  View track →
                </Link>
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </Container>
  );
}