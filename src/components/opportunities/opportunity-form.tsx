"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CheckCircle2, ChevronDown, X } from "lucide-react";

import {
  createOpportunity,
  type OpportunityFormState,
} from "@/lib/opportunities/actions";
import { departments, type Department } from "@/lib/opportunity-types";

export function OpportunityForm({
  onClose,
  availableTags = [],
}: {
  onClose: () => void;
  availableTags?: string[];
}) {
  const [state, formAction, pending] = useActionState<OpportunityFormState, FormData>(
    createOpportunity,
    null,
  );

  const [selectedDepartments, setSelectedDepartments] = useState<Set<Department>>(
    new Set(),
  );
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [departmentMenuOpen, setDepartmentMenuOpen] = useState(false);
  const departmentMenuRef = useRef<HTMLDivElement>(null);
  const [tagMenuOpen, setTagMenuOpen] = useState(false);
  const tagMenuRef = useRef<HTMLDivElement>(null);

  // Close the department dropdown when clicking outside or pressing Escape.
  useEffect(() => {
    if (!departmentMenuOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        departmentMenuRef.current &&
        !departmentMenuRef.current.contains(event.target as Node)
      ) {
        setDepartmentMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setDepartmentMenuOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [departmentMenuOpen]);

  // Close the tag dropdown when clicking outside or pressing Escape.
  useEffect(() => {
    if (!tagMenuOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (tagMenuRef.current && !tagMenuRef.current.contains(event.target as Node)) {
        setTagMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setTagMenuOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [tagMenuOpen]);

  function toggleDepartment(department: Department) {
    const next = new Set(selectedDepartments);
    if (next.has(department)) next.delete(department);
    else next.add(department);
    setSelectedDepartments(next);
  }

  function addTag() {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    if (trimmed.length > 30) return;
    if (tags.length >= 5) return;
    if (tags.includes(trimmed)) return;
    setTags([...tags, trimmed]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  function toggleTag(tag: string) {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
      return;
    }
    if (tags.length >= 5 || tag.length > 30) return;
    setTags([...tags, tag]);
  }

  // Existing tags from the board plus anything already selected locally.
  const tagOptions = Array.from(new Set([...availableTags, ...tags])).sort();

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
            {/* Hidden inputs so every selected department is submitted. */}
            {Array.from(selectedDepartments).map((department) => (
              <input
                key={department}
                type="hidden"
                name="department"
                value={department}
              />
            ))}
            {/* Selected tags are submitted as a comma-separated list. */}
            <input type="hidden" name="tags" value={tags.join(",")} />

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

            <div className="space-y-2">
              <label
                htmlFor="department-select"
                className="block text-sm font-medium text-slate-700"
              >
                Department{" "}
                <span className="font-normal text-slate-400">· select all that apply</span>
              </label>
              <div className="relative" ref={departmentMenuRef}>
                <button
                  id="department-select"
                  type="button"
                  onClick={() => setDepartmentMenuOpen((open) => !open)}
                  aria-haspopup="listbox"
                  aria-expanded={departmentMenuOpen}
                  className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-left text-sm transition-colors hover:border-brand-500 focus:border-brand-500"
                >
                  <span
                    className={
                      selectedDepartments.size > 0
                        ? "text-slate-900"
                        : "text-slate-400"
                    }
                  >
                    {selectedDepartments.size === 0
                      ? "Select departments"
                      : `${selectedDepartments.size} department${
                          selectedDepartments.size === 1 ? "" : "s"
                        } selected`}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${
                      departmentMenuOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>

                {departmentMenuOpen ? (
                  <div
                    role="listbox"
                    aria-multiselectable="true"
                    aria-label="Departments"
                    className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
                  >
                    {departments.map((department) => {
                      const active = selectedDepartments.has(department);
                      return (
                        <label
                          key={department}
                          className="flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                        >
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => toggleDepartment(department)}
                            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                          />
                          {department}
                        </label>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              {selectedDepartments.size > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {Array.from(selectedDepartments).map((department) => (
                    <span
                      key={department}
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
                    >
                      {department}
                      <button
                        type="button"
                        onClick={() => toggleDepartment(department)}
                        aria-label={`Remove ${department}`}
                        className="rounded-full p-0.5 text-brand-600 hover:bg-brand-100"
                      >
                        <X className="h-3 w-3" aria-hidden />
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Application deadline{" "}
                <span className="font-normal text-slate-400">· optional</span>
              </label>
              <input
                name="deadline"
                type="date"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-500 sm:max-w-xs"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="tag-select"
                className="block text-sm font-medium text-slate-700"
              >
                Tags{" "}
                <span className="font-normal text-slate-400">
                  · select existing or add your own
                </span>
              </label>
              <div className="relative" ref={tagMenuRef}>
                <button
                  id="tag-select"
                  type="button"
                  onClick={() => setTagMenuOpen((open) => !open)}
                  aria-haspopup="listbox"
                  aria-expanded={tagMenuOpen}
                  className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-left text-sm transition-colors hover:border-brand-500 focus:border-brand-500"
                >
                  <span className={tags.length > 0 ? "text-slate-900" : "text-slate-400"}>
                    {tags.length === 0
                      ? "Select or add tags"
                      : `${tags.length} tag${tags.length === 1 ? "" : "s"} selected`}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${
                      tagMenuOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>

                {tagMenuOpen ? (
                  <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                    <div
                      role="listbox"
                      aria-multiselectable="true"
                      aria-label="Tags"
                      className="max-h-48 overflow-y-auto p-1"
                    >
                      {tagOptions.length === 0 ? (
                        <p className="px-3 py-2 text-xs text-slate-500">
                          No tags yet — add the first one below.
                        </p>
                      ) : (
                        tagOptions.map((tag) => {
                          const active = tags.includes(tag);
                          return (
                            <label
                              key={tag}
                              className="flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                            >
                              <input
                                type="checkbox"
                                checked={active}
                                onChange={() => toggleTag(tag)}
                                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                              />
                              {tag}
                            </label>
                          );
                        })
                      )}
                    </div>
                    <div className="flex items-center gap-2 border-t border-slate-100 p-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(event) => setTagInput(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === ",") {
                            event.preventDefault();
                            addTag();
                          }
                        }}
                        maxLength={30}
                        placeholder="Add a new tag"
                        aria-label="Add a new tag"
                        className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="shrink-0 rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        aria-label={`Remove tag ${tag}`}
                        className="rounded-full p-0.5 text-brand-600 hover:bg-brand-100"
                      >
                        <X className="h-3 w-3" aria-hidden />
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
              <p className="text-xs text-slate-500">Up to 5 tags, 30 characters each.</p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">
                What should applicants know?
              </label>
              <textarea
                name="description"
                required
                minLength={20}
                maxLength={2000}
                rows={4}
                placeholder="Share the role, who can apply, and any details that will help students decide."
                className="mt-1.5 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-brand-500"
              />
            </div>

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
