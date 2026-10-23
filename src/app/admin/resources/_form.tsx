"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  createResource,
  updateResource,
} from "@/app/admin/resources/actions";

type FormMode = "create" | "edit";

interface ResourceFormProps {
  mode: FormMode;
  id?: string;
  initial?: {
    title: string;
    description: string | null;
    type: string;
    category: string | null;
    url: string;
    author: string | null;
    is_published: boolean;
  };
}

export function ResourceForm({ mode, id, initial }: ResourceFormProps) {
  const [state, formAction, isPending] = useActionState(
    mode === "create" ? createResource : updateResource,
    null,
  );
  const router = useRouter();
  const isEdit = mode === "edit";

  const defaultValues = {
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    type: initial?.type ?? "link",
    category: initial?.category ?? "",
    url: initial?.url ?? "",
    author: initial?.author ?? "",
    isPublished: initial?.is_published ?? false,
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
      {isEdit && <input type="hidden" name="id" value={id ?? ""} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Title <span className="text-red-600">*</span>
          </label>
          <input
            name="title"
            defaultValue={values.title}
            className={`block w-full rounded-md border px-3 py-2 text-sm ${
              hasError("title") ? "border-red-500" : "border-slate-300"
            } focus:ring-brand-500`}
          />
          {fieldError("title") && (
            <p className="mt-1 text-xs text-red-600">{fieldError("title")}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Type
          </label>
          <select
            name="type"
            defaultValue={values.type}
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-brand-500"
          >
            <option value="link">Link</option>
            <option value="website">Website</option>
            <option value="article">Article</option>
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
            <option value="roadmap">Roadmap</option>
            <option value="book">Book</option>
            <option value="tutorial">Tutorial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Category
          </label>
          <input
            name="category"
            defaultValue={values.category}
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-brand-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            e.g. Internships, Roadmaps, Coding
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            URL <span className="text-red-600">*</span>
          </label>
          <input
            name="url"
            defaultValue={values.url}
            className={`block w-full rounded-md border px-3 py-2 text-sm ${
              hasError("url") ? "border-red-500" : "border-slate-300"
            } focus:ring-brand-500`}
          />
          {fieldError("url") && (
            <p className="mt-1 text-xs text-red-600">{fieldError("url")}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Author
          </label>
          <input
            name="author"
            defaultValue={values.author}
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-brand-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description <span className="text-red-600">*</span>
          </label>
          <textarea
            name="description"
            defaultValue={values.description}
            rows={4}
            className={`block w-full rounded-md border px-3 py-2 text-sm ${
              hasError("description") ? "border-red-500" : "border-slate-300"
            } focus:ring-brand-500`}
          />
          {fieldError("description") && (
            <p className="mt-1 text-xs text-red-600">{fieldError("description")}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={values.isPublished}
            className="rounded-md text-brand-600 focus:ring-brand-500"
          />
          Published
        </label>
        <p className="text-xs text-slate-500">
          Drafts are hidden from the public library.
        </p>
      </div>

      {state && !state.ok && state.message && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.message}
        </p>
      )}

      {state?.fieldErrors && (
        <ul className="mt-2 space-y-1 text-xs text-red-600 list-disc pl-5">
          {Object.entries(state.fieldErrors).flatMap(([field, errors]) =>
            errors.map((err) => (
              <li key={`${field}-${err}`}>{err}</li>
            ))
          )}
        </ul>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className={`inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto ${isPending ? "opacity-80" : ""}`}
        >
          {isPending ? "Saving…" : isEdit ? "Update resource" : "Create resource"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/resources")}
          disabled={isPending}
          className={`inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed ${isPending ? "opacity-80" : ""}`}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
