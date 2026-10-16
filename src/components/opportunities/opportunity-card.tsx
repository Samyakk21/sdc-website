"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowUp, CalendarDays, ExternalLink } from "lucide-react";

import { toggleOpportunityVote } from "@/lib/opportunities/actions";
import type { Opportunity } from "@/lib/opportunity-types";

function formatDeadline(deadline: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${deadline}T00:00:00`));
}

export function OpportunityCard({
  opportunity,
  isSignedIn,
}: {
  opportunity: Opportunity;
  isSignedIn: boolean;
}) {
  const [hasUpvoted, setHasUpvoted] = useState(opportunity.has_upvoted);
  const [count, setCount] = useState(opportunity.upvote_count);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function handleVote() {
    setMessage("");
    startTransition(async () => {
      const result = await toggleOpportunityVote(opportunity.id);
      if (!result.ok) {
        setMessage(result.message ?? "Couldn't update your vote.");
        return;
      }
      setHasUpvoted(result.upvoted ?? false);
      setCount(result.count ?? count);
    });
  }

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          {opportunity.category}
        </span>
        {opportunity.deadline ? (
          <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-slate-500">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden />
            Deadline {formatDeadline(opportunity.deadline)}
          </span>
        ) : null}
      </div>

      <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {opportunity.organization}
      </p>
      <h2 className="mt-1 text-xl font-semibold leading-snug tracking-tight text-slate-900">
        {opportunity.title}
      </h2>
      <p className="mt-3 line-clamp-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">
        {opportunity.description}
      </p>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5 mt-6">
        <div>
          {isSignedIn ? (
            <button
              type="button"
              onClick={handleVote}
              disabled={pending}
              aria-pressed={hasUpvoted}
              aria-label={`${hasUpvoted ? "Remove upvote" : "Upvote"} ${opportunity.title}; ${count} upvotes`}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors disabled:cursor-wait disabled:opacity-60 ${
                hasUpvoted
                  ? "border-brand-200 bg-brand-50 text-brand-700"
                  : "border-slate-200 text-slate-600 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
              }`}
            >
              <ArrowUp className="h-4 w-4" aria-hidden />
              {count}
            </button>
          ) : (
            <Link
              href="/login?next=/opportunities"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
              aria-label={`Sign in to upvote ${opportunity.title}; ${count} upvotes`}
            >
              <ArrowUp className="h-4 w-4" aria-hidden />
              {count}
            </Link>
          )}
          {message ? <p role="alert" className="mt-2 max-w-48 text-xs text-brand-700">{message}</p> : null}
        </div>

        <a
          href={opportunity.application_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-800"
        >
          Apply now
          <ExternalLink className="h-4 w-4" aria-hidden />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </article>
  );
}
