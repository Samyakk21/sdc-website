import { Navbar, type NavbarSession } from "@/components/layout/navbar";
import { getCurrentSession } from "@/lib/auth";

/**
 * Session-dependent navbar. Rendered behind `<Suspense>` so the rest of the
 * layout can be part of the prerendered shell while the session is read at
 * request time.
 */
export async function SessionNavbar() {
  const session = await getCurrentSession();

  const navbarSession: NavbarSession = session
    ? { full_name: session.profile.full_name, role: session.profile.role }
    : null;

  return <Navbar session={navbarSession} />;
}
