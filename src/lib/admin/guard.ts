import { redirect } from "next/navigation";

import { getCurrentSession } from "@/lib/auth";

export type AdminProfile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "admin" | "super_admin";
};

/**
 * Requires an authenticated admin/super_admin session.
 * Redirects unauthenticated users to login, non-admins home.
 * Defense-in-depth on top of the proxy.ts route gate and RLS.
 */
export async function requireAdmin(): Promise<AdminProfile> {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login?next=/admin");
  }
  if (
    session.profile.role !== "admin" &&
    session.profile.role !== "super_admin"
  ) {
    redirect("/");
  }
  return session.profile as AdminProfile;
}
