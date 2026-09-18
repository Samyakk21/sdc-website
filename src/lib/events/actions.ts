"use server";

import { revalidatePath } from "next/cache";

import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { getCurrentSession } from "@/lib/auth";
import { getEventRow, getSeatsFilled } from "@/lib/events-repo";

export type RegistrationState = {
  message?: string;
  ok?: boolean;
} | null;

function now() {
  return new Date();
}

function isRegistrationOpen(row: {
  status: string;
  registration_deadline: string | null;
}): { open: boolean; reason?: string } {
  if (row.status !== "registration_open") {
    return { open: false, reason: "Registration for this event is not open." };
  }
  if (
    row.registration_deadline &&
    new Date(row.registration_deadline).getTime() < now().getTime()
  ) {
    return { open: false, reason: "The registration deadline has passed." };
  }
  return { open: true };
}

export async function registerForEvent(
  _prev: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return { ok: false, message: "Missing event." };

  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Registration isn't available yet." };
  }

  const session = await getCurrentSession();
  if (!session) return { ok: false, message: "Sign in to register for events." };

  const row = await getEventRow(slug);
  if (!row) return { ok: false, message: "This event could not be found." };

  const availability = isRegistrationOpen(row);
  if (!availability.open) {
    return { ok: false, message: availability.reason };
  }

  const supabase = await createClient();

  const existing = await supabase
    .from("registrations")
    .select("id")
    .eq("user_id", session.profile.id)
    .eq("event_id", row.id)
    .eq("status", "registered")
    .maybeSingle();

  if (existing.data) {
    return { ok: false, message: "You're already registered for this event." };
  }

  if (row.capacity !== null) {
    const seatsFilled = await getSeatsFilled(row.id);
    if (seatsFilled >= row.capacity) {
      return { ok: false, message: "Sorry — this event is fully booked." };
    }
  }

  const { error } = await supabase.from("registrations").insert({
    user_id: session.profile.id,
    event_id: row.id,
    status: "registered",
  });

  if (error) {
    return { ok: false, message: "Couldn't complete your registration. Please try again." };
  }

  revalidatePath(`/events/${slug}`);
  revalidatePath("/dashboard");
  return { ok: true, message: "You're registered! See you there." };
}

export async function cancelRegistration(
  _prev: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return { ok: false, message: "Missing event." };

  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Registration isn't available yet." };
  }

  const session = await getCurrentSession();
  if (!session) return { ok: false, message: "Sign in to manage your registrations." };

  const row = await getEventRow(slug);
  if (!row) return { ok: false, message: "This event could not be found." };

  if (
    row.registration_deadline &&
    new Date(row.registration_deadline).getTime() < now().getTime()
  ) {
    return {
      ok: false,
      message: "The cancellation window has closed (deadline passed).",
    };
  }

  const supabase = await createClient();

  const existing = await supabase
    .from("registrations")
    .select("id")
    .eq("user_id", session.profile.id)
    .eq("event_id", row.id)
    .eq("status", "registered")
    .maybeSingle();

  if (!existing.data) {
    return { ok: false, message: "You don't have an active registration for this event." };
  }

  const { error } = await supabase
    .from("registrations")
    .update({ status: "cancelled", cancelled_at: now().toISOString() })
    .eq("id", existing.data.id);

  if (error) {
    return { ok: false, message: "Couldn't cancel your registration. Please try again." };
  }

  revalidatePath(`/events/${slug}`);
  revalidatePath("/dashboard");
  return { ok: true, message: "Your registration has been cancelled." };
}