import { cache } from "react";

import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";

const ALLOWED_DOMAIN = "iiserb.ac.in";

export type ProfileRole = "student" | "admin" | "super_admin";

export type SessionProfile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: ProfileRole;
};

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

function isAllowedEmail(email: string | undefined) {
  return !!email?.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`);
}

async function loadProfile(
  supabase: SupabaseClient,
  userId: string,
  email: string | undefined,
): Promise<SessionProfile | null> {
  if (!isAllowedEmail(email)) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("id, email, full_name, avatar_url, role")
    .eq("id", userId)
    .maybeSingle();

  return (profile as SessionProfile | null) ?? null;
}

/**
 * Read-only session (or null). Uses `getClaims()`: the project signs JWTs with
 * asymmetric keys (ES256), so the token is verified locally instead of hitting
 * the Auth server on every render. Cached per request so the layout, page and
 * navbar share a single lookup. Returns null when there is no session, the
 * account is not an approved @iiserb.ac.in address, or the profile row is
 * missing (e.g. sign-up blocked before the sync trigger could run).
 */
export const getCurrentSession = cache(async () => {
  // Public pages stay prerenderable (and the site stays usable) before
  // Supabase credentials are configured.
  if (!hasSupabaseEnv()) return null;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data) return null;

  const { claims } = data;
  const id = typeof claims.sub === "string" ? claims.sub : null;
  const email = typeof claims.email === "string" ? claims.email : undefined;
  if (!id) return null;

  const profile = await loadProfile(supabase, id, email);
  if (!profile) return null;

  return { profile };
});

/**
 * Verified session for write paths (server actions). Always asks the Auth
 * server via `getUser()` before trusting the token; do not use this on public
 * render paths. Not cached, so every write re-validates.
 */
export async function getVerifiedSession() {
  if (!hasSupabaseEnv()) return null;

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const profile = await loadProfile(supabase, user.id, user.email);
  if (!profile) return null;

  return { user, profile };
}

export function isAdminRole(role: ProfileRole) {
  return role === "admin" || role === "super_admin";
}
