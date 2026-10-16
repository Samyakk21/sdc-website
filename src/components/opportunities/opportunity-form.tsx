"use client";

import { useActionState } from "react";
import { CheckCircle2, X } from "lucide-react";

import {
  createOpportunity,
  type OpportunityFormState,
} from "@/lib/opportunities/actions";
import { opportunityCategories } from "@/lib/opportunity-types";

export function OpportunityForm({ onClose }: { onClose: () => void }) {
  const [state, formAction, pending] = useActionState<OpportunityFormState, FormData>(
    createOpportunity,
    null,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="opportunity-form-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:rounded-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Give it a boost
            </p>
            <h2 id="opportunity-form-title" className="mt-1 text-2xl font-bold text-slate-900">
              Share an opportunity
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Help someone in the IISER Bhopal community find their next step.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close form"
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {state?.ok ? (
          <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-green-700" aria-hidden />
            <h3 className="mt-3 text-lg font-semibold text-slate-900">Thanks for sharing!</h3>
            <p className="mt-1 text-sm text-slate-600">{state.message}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 rounded-lg bg-ink-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-800"
            >
              Back to opportunities
            </button>
          </div>
        ) : (
          <form action={formAction} className="mt-7 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Opportunity title
                <input
                  name="title"
                  required
                  minLength={5}
                  maxLength={160}
                  placeholder="e.g. Summer research assistant"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Organization
                <input
                  name="organization"
                  required
                  minLength={2}
                  maxLength={120}
                  placeholder="Lab, company, or organizer"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500"
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Category
                <select
                  name="category"
                  required
                  defaultValue="Research"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-500"
                >
                  {opportunityCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Application deadline <span className="font-normal text-slate-400">· optional</span>
                <input
                  name="deadline"
                  type="date"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-500"
                />
              </label>
            </div>

            <label className="block text-sm font-medium text-slate-700">
              What should applicants know?
              <textarea
                name="description"
                required
                minLength={20}
                maxLength={2000}
                rows={4}
                placeholder="Share the role, who can apply, and any details that will help students decide."
                className="mt-1.5 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-brand-500"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Application link
              <input
                name="application_url"
                type="url"
                required
                placeholder="https://"
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500"
              />
            </label>

            {state && !state.ok ? (
              <p role="alert" className="rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-800">
                {state.message}
              </p>
            ) : null}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pending}
                className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-wait disabled:opacity-60"
              >
                {pending ? "Sharing…" : "Share opportunity"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
