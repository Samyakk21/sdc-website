"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Plus, Search, Sparkles } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { OpportunityCard } from "@/components/opportunities/opportunity-card";
import { OpportunityForm } from "@/components/opportunities/opportunity-form";
import {
  opportunityCategories,
  type Opportunity,
} from "@/lib/opportunity-types";
import type { OpportunityBoardStatus } from "@/lib/opportunities-repo";

type SortMode = "popular" | "newest" | "deadline";

export function OpportunityBoard({
  opportunities,
  isSignedIn,
  status,
}: {
  opportunities: Opportunity[];
  isSignedIn: boolean;
  status: OpportunityBoardStatus;
}) {
  const isAvailable = status === "ready";
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("popular");
  const [showForm, setShowForm] = useState(false);

  const visibleOpportunities = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return opportunities
      .filter((opportunity) => {
        const matchesCategory = category === "All" || opportunity.category === category;
        const matchesQuery =
          normalizedQuery.length === 0 ||
          [opportunity.title, opportunity.organization, opportunity.description, opportunity.category]
            .some((value) => value.toLowerCase().includes(normalizedQuery));
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sort === "popular") {
          return b.upvote_count - a.upvote_count || b.created_at.localeCompare(a.created_at);
        }
        if (sort === "deadline") {
          const aDeadline = a.deadline ?? "9999-12-31";
          const bDeadline = b.deadline ?? "9999-12-31";
          return aDeadline.localeCompare(bDeadline) || b.created_at.localeCompare(a.created_at);
        }
        return b.created_at.localeCompare(a.created_at);
      });
  }, [opportunities, category, query, sort]);

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl bg-ink-900 px-6 py-8 text-white sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-brand-100">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Shared by students, for students
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Good things happen when we share.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
              Find a research role, internship, hackathon, or project — and help your peers find theirs.
            </p>
          </div>
          {isAvailable && isSignedIn ? (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              disabled={!isAvailable}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-ink-900 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Share an opportunity
            </button>
          ) : isAvailable ? (
            <Link
              href="/login?next=/opportunities"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-ink-900 transition-colors hover:bg-brand-50"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Sign in to share
            </Link>
          ) : (
            <span className="inline-flex shrink-0 items-center justify-center rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-slate-300">
              {status === "migration-required" ? "Setup required" : "Board coming soon"}
            </span>
          )}
        </div>
      </section>

      <div className="mt-10 flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
            {["All", ...opportunityCategories].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  category === item
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative block w-full sm:w-64">
              <span className="sr-only">Search opportunities</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search opportunities"
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500"
              />
            </label>
            <label className="relative flex items-center">
              <span className="sr-only">Sort opportunities</span>
              {sort === "popular" ? (
                <ArrowUpWideNarrow className="pointer-events-none absolute left-3 h-4 w-4 text-slate-500" aria-hidden />
              ) : (
                <ArrowDownWideNarrow className="pointer-events-none absolute left-3 h-4 w-4 text-slate-500" aria-hidden />
              )}
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortMode)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-8 text-sm font-medium text-slate-700 focus:border-brand-500 sm:w-auto"
              >
                <option value="popular">Most upvoted</option>
                <option value="newest">Newest</option>
                <option value="deadline">Deadline soon</option>
              </select>
            </label>
          </div>
        </div>

        {isAvailable ? (
          visibleOpportunities.length > 0 ? (
            <>
              <p className="text-sm text-slate-500" aria-live="polite">
                Showing {visibleOpportunities.length}{" "}
                {visibleOpportunities.length === 1 ? "opportunity" : "opportunities"}
              </p>
              <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {visibleOpportunities.map((opportunity) => (
                  <li key={opportunity.id} className="flex min-w-0">
                    <OpportunityCard opportunity={opportunity} isSignedIn={isSignedIn} />
                  </li>
                ))}
              </ul>
            </>
          ) : opportunities.length > 0 ? (
            <EmptyState
              title="No opportunities match your search"
              description="Try another keyword or category to find what you're looking for."
            />
          ) : (
            <EmptyState
              title="The board is open"
              description="No opportunities have been shared yet. Be the first to post one and help someone take their next step."
              action={
                isSignedIn ? (
                  <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                  >
                    Share the first opportunity
                  </button>
                ) : (
                  <Link
                    href="/login?next=/opportunities"
                    className="inline-flex rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                  >
                    Sign in to share
                  </Link>
                )
              }
            />
          )
        ) : (
          <EmptyState
            title={status === "migration-required" ? "One setup step left" : "The board is getting ready"}
            description={
              status === "migration-required"
                ? "The opportunities database migration has not been applied yet. Apply the migration listed in the project README to enable posts and voting."
                : "The opportunities board needs a connected database before students can post and vote. Please check back soon."
            }
          />
        )}
      </div>

      {showForm ? <OpportunityForm onClose={() => setShowForm(false)} /> : null}
    </>
  );
}
