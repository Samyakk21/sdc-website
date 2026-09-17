import Link from "next/link";
import { Compass } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Brand } from "@/components/layout/brand";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col">
      <Container className="flex flex-col items-center justify-center py-24 text-center sm:py-32">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <Compass className="h-7 w-7" aria-hidden />
        </div>
        <h1 className="mt-6 text-6xl font-extrabold tracking-tight text-slate-900">404</h1>
        <p className="mt-3 text-lg font-medium text-slate-900">Page not found</p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
          The page you're looking for doesn't exist or may have moved. Head back home to keep exploring.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            Back to home
          </Link>
          <Link
            href="/events"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
          >
            Browse events
          </Link>
        </div>
        <div className="mt-12 border-t border-slate-100 pt-8">
          <Brand />
        </div>
      </Container>
    </main>
  );
}