import type { EventStatus } from "@/lib/types";

export const eventStatusMeta: Record<EventStatus, { label: string; tone: "brand" | "green" | "amber" | "slate" | "red" }> = {
  registration_open: { label: "Registration Open", tone: "green" },
  upcoming: { label: "Upcoming", tone: "brand" },
  registration_closed: { label: "Registration Closed", tone: "amber" },
  ongoing: { label: "Ongoing", tone: "brand" },
  completed: { label: "Completed", tone: "slate" },
  cancelled: { label: "Cancelled", tone: "red" },
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function isEventOpen(event: { status: EventStatus; registrationDeadline?: string }) {
  if (event.status !== "registration_open") return false;
  if (!event.registrationDeadline) return true;
  return new Date(event.registrationDeadline).getTime() >= Date.now();
}

export function currentTimeMs() {
  return Date.now();
}

export function isDeadlinePast(deadline?: string) {
  if (!deadline) return false;
  return new Date(`${deadline}T23:59:59`).getTime() < currentTimeMs();
}

/**
 * Derived display phase of an event. The DB `status` stays editorial; this is
 * purely for rendering sections.
 * - "cancelled" — always cancelled
 * - "open" — future start, or ended within the last 7 days
 * - "finished" — ended more than 7 days ago
 */
export function eventPhase(event: {
  status: EventStatus;
  startsAt?: string | null;
  endsAt?: string | null;
}): "cancelled" | "open" | "finished" {
  if (event.status === "cancelled") return "cancelled";

  const now = Date.now();
  const startedMs = event.startsAt ? new Date(event.startsAt).getTime() : null;
  const endedMs = event.endsAt ? new Date(event.endsAt).getTime() : null;

  if (startedMs && startedMs > now) return "open";
  if (endedMs != null) {
    const daysOld = (now - endedMs) / DAY_MS;
    if (daysOld <= 7) return "open";
    return "finished";
  }
  return "open";
}

/** True when the event starts in the future (suitable for the home page). */
export function isFutureEvent(event: { startsAt?: string | null }) {
  if (!event.startsAt) return false;
  return new Date(event.startsAt).getTime() > Date.now();
}

export function daysSinceEnded(event: { endsAt?: string | null }) {
  if (!event.endsAt) return null;
  return (Date.now() - new Date(event.endsAt).getTime()) / DAY_MS;
}
