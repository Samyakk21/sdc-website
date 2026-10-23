"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/guard";

export type ActionState = {
  ok?: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

const resourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum([
    "pdf",
    "article",
    "video",
    "website",
    "roadmap",
    "book",
    "tutorial",
    "link",
  ]),
  category: z.string().optional(),
  url: z.string().url("Enter a valid URL"),
  author: z.string().optional(),
  isPublished: z.boolean().default(false),
});

export async function createResource(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Resources aren't available yet." };
  }

  const parsed = resourceSchema.safeParse(Object.fromEntries(formData.entries()));
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

  const supabase = await createClient();
  const { error } = await supabase.from("resources").insert({
    title: data.title,
    description: data.description,
    type: data.type,
    category: data.category ?? null,
    url: data.url,
    author: data.author ?? null,
    is_published: data.isPublished,
  });

  if (error) {
    return { ok: false, message: "Couldn't create the resource. Please try again." };
  }

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  revalidatePath("/");
  return { ok: true, message: "Resource created." };
}

export async function updateResource(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, message: "Missing resource." };

  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Resources aren't available yet." };
  }

  const parsed = resourceSchema.safeParse(Object.fromEntries(formData.entries()));
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

  const supabase = await createClient();
  const { error } = await supabase
    .from("resources")
    .update({
      title: data.title,
      description: data.description,
      type: data.type,
      category: data.category ?? null,
      url: data.url,
      author: data.author ?? null,
      is_published: data.isPublished,
    })
    .eq("id", id);

  if (error) {
    return { ok: false, message: "Couldn't update the resource. Please try again." };
  }

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  revalidatePath("/");
  return { ok: true, message: "Resource updated." };
}

export async function deleteResource(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  if (!hasSupabaseEnv()) {
    return;
  }

  const supabase = await createClient();
  await supabase.from("resources").delete().eq("id", id);

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  revalidatePath("/");
}
