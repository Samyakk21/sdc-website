import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function CtaBand() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <Container>
        <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-800 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Get involved towards development today!
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-brand-50">
            Whether you're looking for placement support, want to contribute to our initiatives, or explore
            entrepreneurship, we've got you covered.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/contact" variant="secondary" size="lg" className="bg-ink-900 hover:bg-ink-800">
              Connect with us
            </Button>
            <Button
              href="/initiatives"
              variant="outline"
              size="lg"
              className="border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10 hover:text-white"
            >
              Explore opportunities
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}