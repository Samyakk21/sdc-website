"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  createEvent,
  updateEvent,
} from "@/app/admin/events/actions";

type FormMode = "create" | "edit";

interface EventFormProps {
  mode: FormMode;
  slug?: string;
  initial?: {
    title: string;
    tagline?: string | null;
    description: string;
    starts_at?: string | null;
    ends_at?: string | null;
    mode?: string | null;
    location?: string | null;
    capacity?: number | null;
    registration_deadline?: string | null;
    organizer?: string | null;
    status?: string | null;
  };
}

function parseISTTimestamp(iso?: string | null) {
  if (!iso) return { date: "", time: "" };
  const d = new Date(iso);
  const date = d.toISOString().slice(0, 10);
  const time = d.toISOString().slice(11, 16);
  return { date, time };
}

export function EventForm({ mode, slug, initial }: EventFormProps) {
  const [state, formAction, isPending] = useActionState(
    mode === "create" ? createEvent : updateEvent,
    null,
  );

  const router = useRouter();
  const isEdit = mode === "edit";

  const defaultValues = {
    title: initial?.title ?? "",
    tagline: initial?.tagline ?? "",
    description: initial?.description ?? "",
    date: initial ? parseISTTimestamp(initial.starts_at).date : "",
    startTime: initial ? parseISTTimestamp(initial.starts_at).time : "",
    endTime: initial ? parseISTTimestamp(initial.ends_at).time : "",
    mode: initial?.mode ?? "offline",
    location: initial?.location ?? "",
    organizer: initial?.organizer ?? "",
    capacity: initial?.capacity?.toString() ?? "",
    registrationDeadline: initial
      ? initial.registration_deadline?.slice(0, 10) ?? ""
      : "",
    status: initial?.status ?? "upcoming",
    registrationOpen: (initial?.status ?? "upcoming") === "registration_open",
  };

  const [values] = useState(defaultValues);

  function fieldError(name: string) {
    return state?.fieldErrors?.[name]?.[0];
  }

  function hasError(name: string) {
    return Boolean(fieldError(name));
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="slug" value={slug ?? ""} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Title <span className="text-red-600">*</span>
          </label>
          <input
            name="title"
            defaultValue={values.title}
            className={`block w-full rounded-md border px-3 py-2 text-sm ${
              hasError("title") ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-brand-500"
            }`}
          />
          {fieldError("title") && (
            <p className="mt-1 text-xs text-red-600">{fieldError("title")}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Status
          </label>
          <select
            name="status"
            defaultValue={values.status}
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-brand-500"
          >
            <option value="upcoming">Upcoming</option>
            <option value="registration_open">Registration open</option>
            <option value="registration_closed">Registration closed</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              name="registrationOpen"
              defaultChecked={values.registrationOpen}
              className="rounded-md text-brand-600 focus:ring-brand-500"
            />
            Registration open
          </label>
          <p className="text-xs text-slate-500 mt-1">
            When on, the event is published as “Registration open”; otherwise it keeps the status above.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Date <span className="text-red-600">*</span>
          </label>
          <input
            name="date"
            type="date"
            defaultValue={values.date}
            className={`block w-full rounded-md border px-3 py-2 text-sm ${
              hasError("date") ? "border-red-500" : "border-slate-300"
            }`}
          />
          {fieldError("date") && (
            <p className="mt-1 text-xs text-red-600">{fieldError("date")}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Start time (IST)
          </label>
          <input
            name="startTime"
            type="time"
            defaultValue={values.startTime}
            className={`block w-full rounded-md border px-3 py-2 text-sm ${
              hasError("startTime") ? "border-red-500" : "border-slate-300"
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            End time (IST)
          </label>
          <input
            name="endTime"
            type="time"
            defaultValue={values.endTime}
            className={`block w-full rounded-md border px-3 py-2 text-sm ${
              hasError("endTime") ? "border-red-500" : "border-slate-300"
            }`}
          />
          {fieldError("endTime") && (
            <p className="mt-1 text-xs text-red-600">{fieldError("endTime")}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Mode
          </label>
          <select
            name="mode"
            defaultValue={values.mode}
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-brand-500"
          >
            <option value="online">Online</option>
            <option value="offline">Offline (on campus)</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Location
          </label>
          <input
            name="location"
            defaultValue={values.location}
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-brand-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            e.g. L1, Lecture Hall, Online
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Organizer
          </label>
          <input
            name="organizer"
            defaultValue={values.organizer}
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-brand-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            Defaults to Student Development Council.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Capacity
          </label>
          <input
            name="capacity"
            type="number"
            min="1"
            defaultValue={values.capacity}
            className={`block w-full rounded-md border px-3 py-2 text-sm ${
              hasError("capacity") ? "border-red-500" : "border-slate-300"
            }`}
          />
          {fieldError("capacity") && (
            <p className="mt-1 text-xs text-red-600">{fieldError("capacity")}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tagline
          </label>
          <input
            name="tagline"
            defaultValue={values.tagline}
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-brand-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            Short one-line summary shown on event cards.
          </p>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description <span className="text-red-600">*</span>
          </label>
          <textarea
            name="description"
            defaultValue={values.description}
            rows={5}
            className={`block w-full rounded-md border px-3 py-2 text-sm ${
              hasError("description") ? "border-red-500" : "border-slate-300"
            } focus:ring-brand-500`}
          />
          {fieldError("description") && (
            <p className="mt-1 text-xs text-red-600">{fieldError("description")}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Registration deadline
          </label>
          <input
            name="registrationDeadline"
            type="date"
            defaultValue={values.registrationDeadline}
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-brand-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            Optional. Registrations close at end of this day.
          </p>
        </div>
      </div>

      {state && !state.ok && state.message && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.message}
        </p>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className={`inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto ${isPending ? "opacity-80" : ""}`}
        >
          {isPending ? "Saving…" : isEdit ? "Update event" : "Create event"}
        </button>
        <button
          type="button"
          onClick={() => {
            router.push("/admin/events");
          }}
          disabled={isPending}
          className={`inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed ${isPending ? "opacity-80" : ""}`}
        >
          Cancel
        </button>
      </div>

      <p className="text-xs text-slate-500">
        The event slug is generated from the title and cannot be changed after creation.
      </p>
    </form>
  );
}
