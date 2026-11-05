import type { ReactNode } from "react";
import { Suspense } from "react";

import { Navbar } from "@/components/layout/navbar";
import { SessionNavbar } from "@/components/layout/session-navbar";
import { Footer } from "@/components/layout/footer";
import { AdminSubNav } from "./sub-nav";

// Every admin page calls requireAdmin() (cookies), so this segment keeps
// blocking on the server rather than streaming.
export const instant = false;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={<Navbar session={null} />}>
        <SessionNavbar />
      </Suspense>
      <main id="main" tabIndex={-1} className="flex-1">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <AdminSubNav />
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
