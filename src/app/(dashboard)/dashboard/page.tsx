import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CalendarX2, Ticket } from "lucide-react";

import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { EventCard } from "@/components/events/event-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { toEvent, listEvents, type EventRow } from "@/lib/events-repo";
import { isEventOpen, currentTimeMs } from "@/lib/event-status";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your events and registrations on the SDC platform.",
};

type RegisteredRow = {
  registered_at: string;
  events: EventRow | null;
};

function firstWord(name: string | null) {
  return name?.trim().split(/\s+/)[0] || "there";
}

export default async function DashboardPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login?next=/dashboard");

  const supabase = await createClient();

  const { data: registrations } = await supabase
    .from("registrations")
    .select("registered_at, events(*)")
    .eq("user_id", session.profile.id)
    .eq("status", "registered")
    .order("registered_at", { ascending: false });

  const myRows = ((registrations as RegisteredRow[] | null) ?? [])
    .map((r) => r.events)
    .filter((e): e is EventRow => e !== null)
    .map(toEvent);

  const nowMs = currentTimeMs();
  const upcoming = myRows
    .filter((e) => new Date(`${e.date}T${e.startTime ?? "00:00"}`).getTime() >= nowMs)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = myRows
    .filter((e) => new Date(`${e.date}T${e.endTime ?? "23:59"}`).getTime() < nowMs)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const openEvents = (await listEvents())
    .filter((e) => isEventOpen(e))
    .filter((e) => !myRows.some((m) => m.slug === e.slug))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title={`Hi, ${firstWord(session.profile.full_name)}`}
        description="Here's what you're signed up for and what's coming up."
      />
      <Container className="space-y-16 py-16 sm:py-20">
        <section>
          <SectionHeading
            eyebrow="My events"
            title="Your upcoming registrations"
            description="Events you've registered for. You'll find details and cancellation here."
          />
          {upcoming.length > 0 ? (
            <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <li key={event.slug} className="flex">
                  <div className="w-full">
                    <EventCard event={event} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-8">
              <EmptyState
                icon={<Ticket className="h-8 w-8" aria-hidden />}
                title="Nothing registered yet"
                description="When you register for an event, it'll show up here."
              />
            </div>
          )}
        </section>

        {past.length > 0 ? (
          <section>
            <SectionHeading eyebrow="History" title="Events you attended" />
            <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <li key={event.slug} className="flex">
                  <div className="w-full">
                    <EventCard event={event} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {openEvents.length > 0 ? (
          <section>
            <SectionHeading
              eyebrow="Open now"
              title="Available to register"
              description="More sessions you can grab a seat in right now."
            />
            <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {openEvents.map((event) => (
                <li key={event.slug} className="flex">
                  <div className="w-full">
                    <EventCard event={event} />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6">
              <Link
                href="/events"
                className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                Browse all events <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </p>
          </section>
        ) : (
          <section>
            <SectionHeading eyebrow="Open now" title="No open registrations" />
            <div className="mt-8">
              <EmptyState
                icon={<CalendarX2 className="h-8 w-8" aria-hidden />}
                title="Nothing open right now"
                description="Check back soon — new events open regularly."
              />
            </div>
          </section>
        )}
      </Container>
    </>
  );
}