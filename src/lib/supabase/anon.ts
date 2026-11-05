import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-free Supabase client for cached reads (`use cache`).
 *
 * Cached functions must not touch `cookies()` or `headers()`, so public data
 * is fetched with the anon key and relies on RLS policies that allow public
 * selects. Never use this client for writes or user-specific reads.
 */
export function createAnonClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}
