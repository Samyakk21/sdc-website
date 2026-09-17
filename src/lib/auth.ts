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

/**
 * Current validated session (or null). Returns null when there is no session,
 * the account is not an approved @iiserb.ac.in address, or the profile row is
 * missing (e.g. sign-up blocked before the sync trigger could run).
 */
export async function getCurrentSession() {
  // Public pages stay prerenderable (and the site stays usable) before
  // Supabase credentials are configured.
  if (!hasSupabaseEnv()) return null;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;
  if (!user.email?.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`)) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("id, email, full_name, avatar_url, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return null;

  return {
    user,
    profile: profile as SessionProfile,
  };
}

export function isAdminRole(role: ProfileRole) {
  return role === "admin" || role === "super_admin";
}