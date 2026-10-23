import type { Resource } from "@/lib/types";
import { resources as staticResources } from "@/lib/content/resources";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";

export type ResourceRow = {
  id: string;
  title: string;
  description: string | null;
  type: Resource["type"];
  category: string | null;
  url: string;
  author: string | null;
  is_published: boolean;
};

function toResource(row: ResourceRow): Resource {
  return {
    slug: row.id,
    title: row.title,
    description: row.description ?? "",
    type: row.type,
    categories: row.category ? [row.category] : [],
    url: row.url,
    author: row.author ?? undefined,
    dateAdded: row.is_published ? "" : "",
  };
}

async function fetchResources(): Promise<Resource[]> {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("id, title, description, type, category, url, author, is_published")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as ResourceRow[]).map(toResource);
}

/**
 * Resources for public pages. Reads from the database; falls back to the
 * static catalog when Supabase is unconfigured or empty.
 */
export async function listResources(): Promise<Resource[]> {
  const db = await fetchResources();
  if (db.length > 0) return db;
  return staticResources;
}

async function fetchResource(id: string): Promise<ResourceRow | null> {
  if (!hasSupabaseEnv()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("id, title, description, type, category, url, author, is_published")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as ResourceRow;
}

export async function getResource(id: string): Promise<Resource | null> {
  const row = await fetchResource(id);
  if (row) return toResource(row);
  return null;
}

/** Admin: all resources regardless of publication status. */
export async function listAdminResources(): Promise<ResourceRow[]> {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("id, title, description, type, category, url, author, is_published")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as ResourceRow[];
}
