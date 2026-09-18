import type { ReactNode } from "react";

import { Navbar, type NavbarSession } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getCurrentSession } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getCurrentSession();

  const navbarSession: NavbarSession = session
    ? { full_name: session.profile.full_name, role: session.profile.role }
    : null;

  return (
    <>
      <Navbar session={navbarSession} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}