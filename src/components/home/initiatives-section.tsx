import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { initiatives } from "@/lib/content/initiatives";

export function InitiativesSection({ limit = 6 }: { limit?: number }) {
  const visible = initiatives.slice(0, limit);
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow="What we do"
          title="Six core verticals working together"
          description="Every initiative exists to accelerate your growth — from placements and careers to leadership and entrepreneurship."
          action={
            <Button href="/initiatives" variant="outline" size="sm">
              View all initiatives
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          }
        />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((initiative) => (
            <li key={initiative.slug}>
              <a
                href={initiative.href ?? `/initiatives#${initiative.slug}`}
                target={initiative.href ? "_blank" : undefined}
                rel={initiative.href ? "noopener noreferrer" : undefined}
                className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-brand-700">
                  {initiative.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{initiative.description}</p>
                <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-medium text-brand-600">
                  {initiative.href ? "Visit website" : "Learn more"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}