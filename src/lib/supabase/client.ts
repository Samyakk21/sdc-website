import { createBrowserClient } from "@supabase/ssr";

/** Browser-side Supabase client for interactive auth flows (sign-in). */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase environment variables are not set (see .env.example)."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}