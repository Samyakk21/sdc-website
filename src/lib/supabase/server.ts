import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Server-side Supabase client bound to the request's cookie store.
 * Call `supabase.auth.getUser()` (not `getSession()`) to validate sessions —
 * it verifies the JWT with Supabase on every call.
 */
export async function createClient() {
  if (!hasSupabaseEnv()) {
    throw new Error(
      "Supabase environment variables are not set (see .env.example)."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component. Safe to ignore; proxy.ts refreshes
            // the session on the next request.
          }
        },
      },
    },
  );
}