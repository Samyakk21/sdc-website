"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { ResourceCard } from "@/components/resources/resource-card";
import { EmptyState } from "@/components/ui/empty-state";
import type { Resource } from "@/lib/types";

export function ResourceBrowser({ resources }: { resources: Resource[] }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const set = new Set<string>();
    resources.forEach((resource) => resource.categories.forEach((c) => set.add(c)));
    return ["All", ...Array.from(set).sort()];
  }, [resources]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resources.filter((resource) => {
      const matchesCategory = category === "All" || resource.categories.includes(category);
      const matchesQuery =
        q.length === 0 ||
        resource.title.toLowerCase().includes(q) ||
        resource.description.toLowerCase().includes(q) ||
        resource.type.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [resources, category, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                category === c
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="relative block w-full sm:w-64">
          <span className="sr-only">Search resources</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search resources"
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500"
          />
        </label>
      </div>

      {visible.length > 0 ? (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((resource) => (
            <li key={resource.slug}>
              <ResourceCard resource={resource} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8">
          <EmptyState
            title="No resources match your search"
            description="Try a different keyword or category."
          />
        </div>
      )}
    </div>
  );
}