import { Navbar, type NavbarSession } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getCurrentSession } from "@/lib/auth";
import { AdminSubNav } from "./sub-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  const navbarSession: NavbarSession = session
    ? { full_name: session.profile.full_name, role: session.profile.role }
    : null;

  return (
    <>
      <Navbar session={navbarSession} />
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
