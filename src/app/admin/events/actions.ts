"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/guard";
import { getEventRow } from "@/lib/events-repo";

export type ActionState = {
  ok?: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

const IST_OFFSET = "+05:30";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  tagline: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  mode: z.enum(["online", "offline", "hybrid"]),
  location: z.string().optional(),
  organizer: z.string().optional(),
  capacity: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const n = Number(val);
      return Number.isFinite(n) && n > 0;
    }, "Capacity must be greater than 0"),
  registrationDeadline: z.string().optional(),
  status: z.enum([
    "upcoming",
    "registration_open",
    "registration_closed",
    "ongoing",
    "completed",
    "cancelled",
  ]),
  registrationOpen: z.coerce.boolean().default(false),
});

function toISTTimestamp(date: string, time?: string) {
  if (!time) return undefined;
  const [hours, minutes] = time.split(":").map(Number);
  const d = new Date(`${date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00${IST_OFFSET}`);
  return d.toISOString();
}

function slugFromTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function validateTimes(data: {
  date: string;
  startTime?: string;
  endTime?: string;
  registrationDeadline?: string;
  status: string;
}): { start?: string; end?: string; deadline?: string; error?: string } {
  const start = toISTTimestamp(data.date, data.startTime);
  const end = data.endTime ? toISTTimestamp(data.date, data.endTime) : undefined;
  const deadline = data.registrationDeadline
    ? `${data.registrationDeadline}T00:00:00${IST_OFFSET}`
    : undefined;

  if (start && end && new Date(end).getTime() < new Date(start).getTime()) {
    return { error: "End time must be after start time." };
  }
  if (deadline && start && new Date(deadline).getTime() > new Date(start).getTime()) {
    return { error: "Registration deadline must be before the event start." };
  }
  return { start, end, deadline };
}

async function isSlugTaken(slug: string, excludeId?: string) {
  if (!hasSupabaseEnv()) return false;
  const supabase = await createClient();
  let query = supabase.from("events").select("id").eq("slug", slug);
  if (excludeId) query = query.neq("id", excludeId);
  const { data } = await query.maybeSingle();
  return Boolean(data);
}

export async function createEvent(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Events aren't available yet." };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const [key, err] of Object.entries(
      parsed.error.flatten().fieldErrors,
    )) {
      fieldErrors[key] = err;
    }
    return { ok: false, message: "Please fix the errors below.", fieldErrors };
  }

  const data = parsed.data;
  const timing = validateTimes(data);
  if (timing.error) {
    return { ok: false, message: timing.error };
  }

  const slug = slugFromTitle(data.title);
  if (await isSlugTaken(slug)) {
    return {
      ok: false,
      message: "An event with this title already exists.",
      fieldErrors: { title: ["An event with this title already exists."] },
    };
  }

  const status = data.registrationOpen ? "registration_open" : data.status;

  const supabase = await createClient();
  const { error } = await supabase.from("events").insert({
    slug,
    title: data.title,
    tagline: data.tagline ?? null,
    description: data.description,
    status,
    starts_at: timing.start,
    ends_at: timing.end,
    mode: data.mode,
    location: data.location ?? null,
    capacity: data.capacity ? Number(data.capacity) : null,
    registration_deadline: timing.deadline,
    organizer: data.organizer ?? null,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        message: "An event with this title already exists.",
        fieldErrors: { title: ["An event with this title already exists."] },
      };
    }
    return {
      ok: false,
      message: `Database error: ${error.message} (code: ${error.code})`,
    };
  }

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
  return { ok: true, message: "Event created." };
}

export async function updateEvent(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return { ok: false, message: "Missing event." };

  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Events aren't available yet." };
  }

  const row = await getEventRow(slug);
  if (!row) return { ok: false, message: "This event could not be found." };

  const raw = Object.fromEntries(formData.entries());
  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const [key, err] of Object.entries(
      parsed.error.flatten().fieldErrors,
    )) {
      fieldErrors[key] = err;
    }
    return { ok: false, message: "Please fix the errors below.", fieldErrors };
  }

  const data = parsed.data;
  const timing = validateTimes(data);
  if (timing.error) {
    return { ok: false, message: timing.error };
  }

  const status = data.registrationOpen ? "registration_open" : data.status;

  const supabase = await createClient();
  const { error } = await supabase
    .from("events")
    .update({
      title: data.title,
      tagline: data.tagline ?? null,
      description: data.description,
      status,
      starts_at: timing.start,
      ends_at: timing.end,
      mode: data.mode,
      location: data.location ?? null,
      capacity: data.capacity ? Number(data.capacity) : null,
      registration_deadline: timing.deadline,
      organizer: data.organizer ?? null,
    })
    .eq("slug", slug);

  if (error) {
    return {
      ok: false,
      message: `Database error: ${error.message} (code: ${error.code})`,
    };
  }

  revalidatePath(`/admin/events`);
  revalidatePath(`/events/${slug}`);
  revalidatePath("/events");
  revalidatePath("/");
  return { ok: true, message: "Event updated." };
}

export async function deleteEvent(formData: FormData): Promise<void> {
  await requireAdmin();

  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return;

  if (!hasSupabaseEnv()) {
    return;
  }

  const row = await getEventRow(slug);
  if (!row) return;

  const supabase = await createClient();
  await supabase.from("events").delete().eq("slug", slug);

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
}
