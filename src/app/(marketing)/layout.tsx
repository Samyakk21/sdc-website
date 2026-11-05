import { Suspense } from "react";

import { Navbar } from "@/components/layout/navbar";
import { SessionNavbar } from "@/components/layout/session-navbar";
import { Footer } from "@/components/layout/footer";

export default function MarketingLayout({ children }: LayoutProps<"/">) {
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
