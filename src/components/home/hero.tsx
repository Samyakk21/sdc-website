import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { LogoMark } from "@/components/layout/logo-mark";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-ink-50">
      <Container className="relative grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-ink-800 ring-1 ring-inset ring-slate-200">
            Student Development Council · IISER Bhopal
          </p>
          <h1 className="mt-5 text-5xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-6xl">
            <span className="bg-gradient-to-r from-brand-700 to-brand-600 bg-clip-text text-transparent">
              Building Tomorrow's
            </span>
            <br />
            Leaders
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
            From placements to entrepreneurship, we're here to accelerate your professional journey at IISER Bhopal and connect you with opportunities that matter.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="/initiatives" variant="primary" size="lg">
              Explore initiatives
            </Button>
            <Button href="/events" variant="outline" size="lg">
              View events
            </Button>
            <Button href="/about" variant="ghost" size="lg">
              Learn about SDC
            </Button>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-full bg-gradient-to-br from-brand-100 to-ink-100 blur-2xl" aria-hidden />
            <LogoMark
              priority
              className="h-72 w-72 rounded-full bg-white p-2 shadow-xl ring-8 ring-white/70 sm:h-80 sm:w-80 sm:p-3 lg:h-96 lg:w-96 lg:p-4"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}