import type { SDCEvent } from "@/lib/types";
import { events as staticEvents, getEvent as getStaticEvent } from "@/lib/content/events";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";

export type EventRow = {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  status: SDCEvent["status"];
  starts_at: string;
  ends_at: string | null;
  is_online: boolean;
  location: string | null;
  capacity: number | null;
  registration_deadline: string | null;
  organizer: string | null;
};

const IST = "Asia/Kolkata";

function istDate(date: Date) {
  return date.toLocaleDateString("en-CA", { timeZone: IST });
}

function istTime(date: Date) {
  return date.toLocaleTimeString("en-IN", {
    timeZone: IST,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
}

export function toEvent(row: EventRow): SDCEvent {
  const startsAt = new Date(row.starts_at);
  const endsAt = row.ends_at ? new Date(row.ends_at) : undefined;
  const deadline = row.registration_deadline ? new Date(row.registration_deadline) : undefined;

  return {
    slug: row.slug,
    title: row.title,
    description: row.description ?? "",
    date: istDate(startsAt),
    startTime: istTime(startsAt),
    endTime: endsAt ? istTime(endsAt) : undefined,
    location: row.location ?? (row.is_online ? "Online" : "TBA"),
    mode: row.is_online ? "online" : "offline",
    organizer: row.organizer ?? "Student Development Council",
    capacity: row.capacity ?? undefined,
    registrationDeadline: deadline ? istDate(deadline) : undefined,
    status: row.status,
  };
}

async function fetchEvents(): Promise<SDCEvent[]> {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, slug, title, tagline, description, status, starts_at, ends_at, is_online, location, capacity, registration_deadline, organizer")
    .order("starts_at", { ascending: true });

  if (error || !data) return [];

  return (data as EventRow[]).map(toEvent);
}

/**
 * Events for public pages. Reads from the database; falls back to the static
 * seed catalog when Supabase is unconfigured or the table is still empty, so
 * the site always renders something sensible.
 */
export async function listEvents(): Promise<SDCEvent[]> {
  const db = await fetchEvents();
  if (db.length > 0) return db;
  return staticEvents;
}

async function fetchEventRow(slug: string): Promise<EventRow | null> {
  if (!hasSupabaseEnv()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, slug, title, tagline, description, status, starts_at, ends_at, is_online, location, capacity, registration_deadline, organizer")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return data as EventRow;
}

export async function getEvent(slug: string): Promise<SDCEvent | null> {
  const row = await fetchEventRow(slug);
  if (row) return toEvent(row);
  return getStaticEvent(slug) ?? null;
}

/** Raw event id for a slug (used by registration actions). */
export async function getEventId(slug: string): Promise<string | null> {
  const row = await fetchEventRow(slug);
  return row?.id ?? null;
}

export async function getEventRow(slug: string): Promise<EventRow | null> {
  return fetchEventRow(slug);
}

/** Active (status = 'registered') seat count for an event. */
export async function getSeatsFilled(eventId: string): Promise<number> {
  if (!hasSupabaseEnv()) return 0;

  const supabase = await createClient();
  const { data } = await supabase.rpc("count_active_registrations", {
    p_event_id: eventId,
  });
  return typeof data === "number" ? data : 0;
}

/** A user's active registration for an event (or null). */
export async function getMyRegistration(eventId: string, userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("registrations")
    .select("id, status, registered_at, cancelled_at")
    .eq("user_id", userId)
    .eq("event_id", eventId)
    .eq("status", "registered")
    .maybeSingle();

  if (error || !data) return null;
  return data as { id: string; status: string; registered_at: string; cancelled_at: string | null };
}