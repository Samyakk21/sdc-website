"use client";

import { useActionState } from "react";
import { CheckCircle2, Users } from "lucide-react";

import {
  cancelRegistration,
  registerForEvent,
  type RegistrationState,
} from "@/lib/events/actions";

function Message({ state }: { state: RegistrationState }) {
  if (!state?.message) return null;
  const isError = state.ok !== true;
  return (
    <p
      role="status"
      className={`mt-4 rounded-lg px-3 py-2 text-sm ${
        isError
          ? "border border-red-200 bg-red-50 text-red-700"
          : "border border-green-200 bg-green-50 text-green-700"
      }`}
    >
      {state.message}
    </p>
  );
}

export function RegisterPanel({
  slug,
  mode,
  cancelable,
  seatsFilled,
  capacity,
  deadlineLabel,
}: {
  slug: string;
  mode: "register" | "registered";
  cancelable: boolean;
  seatsFilled: number;
  capacity?: number;
  deadlineLabel?: string;
}) {
  const [registerState, registerAction, registering] = useActionState(registerForEvent, null);
  const [cancelState, cancelAction, cancelling] = useActionState(cancelRegistration, null);

  const seatsFull =
    capacity != null && mode === "register" && seatsFilled >= capacity;

  return (
    <div>
      {mode === "register" ? (
        <form action={registerAction}>
          <h2 className="text-lg font-semibold text-slate-900">Registration open</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Sign in with your IISER Bhopal account to grab your seat.
          </p>

          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <Users className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
            {capacity != null ? (
              <span>
                <span className="font-medium text-slate-900">{seatsFilled}</span> of{" "}
                {capacity} seats filled
              </span>
            ) : (
              <span>Open to all IISER Bhopal students</span>
            )}
          </div>

          {deadlineLabel ? (
            <p className="mt-2 text-xs text-slate-500">Closes {deadlineLabel}.</p>
          ) : null}

          <input type="hidden" name="slug" value={slug} />
          <button
            type="submit"
            disabled={registering || seatsFull}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {registering ? "Registering…" : seatsFull ? "Fully booked" : "Register for this event"}
          </button>
          <Message state={registerState} />
        </form>
      ) : (
        <form action={cancelAction}>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <CheckCircle2 className="h-5 w-5 text-green-600" aria-hidden />
            You're registered
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            We've got your seat. See you at the event!
          </p>

          {cancelable ? (
            <p className="mt-2 text-xs text-slate-500">
              You can cancel until {deadlineLabel}. No questions asked.
            </p>
          ) : (
            <p className="mt-2 text-xs text-slate-500">
              The deadline to cancel this registration has passed.
            </p>
          )}

          <input type="hidden" name="slug" value={slug} />
          <button
            type="submit"
            disabled={cancelling || !cancelable}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-6 py-3 text-base font-medium text-red-600 transition-colors hover:border-red-600 hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelling ? "Cancelling…" : "Cancel registration"}
          </button>
          <Message state={cancelState} />
        </form>
      )}
    </div>
  );
}