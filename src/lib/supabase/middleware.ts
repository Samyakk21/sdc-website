import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { hasSupabaseEnv } from "@/lib/supabase/server";

const ALLOWED_DOMAIN = "iiserb.ac.in";
const ADMIN_ROLES = ["admin", "super_admin"] as const;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sdc-iiserb.vercel.app";

/**
 * Vercel's auto-generated aliases for this project. They are protected by
 * Deployment Protection and would split auth cookies from the canonical
 * domain, so never serve the app from them.
 */
const ALIAS_HOSTS = new Set([
  "sdc-website-samyakk21.vercel.app",
  "sdc-website-git-main-samyakk21.vercel.app",
  "sdc-website-ten-umber.vercel.app",
]);

function canonicalOrigin(): URL | null {
  try {
    const url = new URL(SITE_URL);
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return null;
    return url;
  } catch {
    return null;
  }
}

function isAllowedEmail(email: string | undefined) {
  return !!email?.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`);
}

/**
 * Session refresh + route protection, shared by proxy.ts.
 * Refreshes the Supabase auth cookies and guards /dashboard and /admin.
 */
export async function updateSession(request: NextRequest) {
  // Keep every visitor on the canonical domain. This matters for OAuth
  // callbacks: Supabase falls back to its configured Site URL, which can point
  // at a protected *.vercel.app alias. Forwarding the path and query (including
  // `?code`) lets the PKCE exchange finish against the cookies set here.
  const canonical = canonicalOrigin();
  if (canonical) {
    const host = (request.headers.get("host") ?? request.nextUrl.host)
      .split(":")[0]
      .toLowerCase();
    if (host !== canonical.hostname.toLowerCase() && ALIAS_HOSTS.has(host)) {
      const url = request.nextUrl.clone();
      url.protocol = canonical.protocol;
      url.hostname = canonical.hostname;
      url.port = canonical.port;
      return NextResponse.redirect(url, 307);
    }
  }

  // No-op until Supabase credentials are configured (local builds, early dev).
  if (!hasSupabaseEnv()) return NextResponse.next({ request });

  // Supabase replaces an unrecognised `redirect_to` with the Site URL, which
  // drops the /auth/callback path and leaves the PKCE code unhandled at `/`.
  // Route any stray code (on whatever path or host) through the callback.
  if (
    request.nextUrl.pathname !== "/auth/callback" &&
    request.nextUrl.searchParams.has("code")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/callback";
    return NextResponse.redirect(url, 307);
  }

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
    const url = new URL("/dashboard", origin);
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