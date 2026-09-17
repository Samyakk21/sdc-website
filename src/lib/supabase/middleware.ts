import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { hasSupabaseEnv } from "@/lib/supabase/server";

const ALLOWED_DOMAIN = "iiserb.ac.in";
const ADMIN_ROLES = ["admin", "super_admin"] as const;

function isAllowedEmail(email: string | undefined) {
  return !!email?.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`);
}

/**
 * Session refresh + route protection, shared by proxy.ts.
 * Refreshes the Supabase auth cookies and guards /dashboard and /admin.
 */
export async function updateSession(request: NextRequest) {
  // No-op until Supabase credentials are configured (local builds, early dev).
  if (!hasSupabaseEnv()) return NextResponse.next({ request });

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, origin } = request.nextUrl;
  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const isLoginPage = pathname === "/login";

  const signedIn = !!user && isAllowedEmail(user.email);

  if (!signedIn) {
    if (isProtected) {
      const url = new URL(`/login?next=${encodeURIComponent(pathname)}`, origin);
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  if (isLoginPage) {
    const url = new URL("/", origin);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin")) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (
      !profile ||
      !ADMIN_ROLES.includes(profile.role as (typeof ADMIN_ROLES)[number])
    ) {
      const url = new URL("/", origin);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}