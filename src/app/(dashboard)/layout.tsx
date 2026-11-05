import type { ReactNode } from "react";
import { Suspense } from "react";

import { Navbar } from "@/components/layout/navbar";
import { SessionNavbar } from "@/components/layout/session-navbar";
import { Footer } from "@/components/layout/footer";

// Authenticated area: keep blocking on the server until the dashboard is
// split into its own Suspense boundaries.
export const instant = false;

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={<Navbar session={null} />}>
        <SessionNavbar />
      </Suspense>
      <main id="main" tabIndex={-1} className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
