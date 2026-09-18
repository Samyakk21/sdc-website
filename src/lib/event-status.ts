import type { EventStatus } from "@/lib/types";

export const eventStatusMeta: Record<EventStatus, { label: string; tone: "brand" | "green" | "amber" | "slate" | "red" }> = {
  registration_open: { label: "Registration Open", tone: "green" },
  upcoming: { label: "Upcoming", tone: "brand" },
  registration_closed: { label: "Registration Closed", tone: "amber" },
  ongoing: { label: "Ongoing", tone: "brand" },
  completed: { label: "Completed", tone: "slate" },
  cancelled: { label: "Cancelled", tone: "red" },
};

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