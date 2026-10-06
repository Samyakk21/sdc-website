import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { initiatives } from "@/lib/content/initiatives";

export const metadata: Metadata = {
  title: "Initiatives",
  description: "Explore the initiatives run by the Student Development Council at IISER Bhopal.",
};

export default function InitiativesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Initiatives"
        title="What we do"
        description="Six core verticals working together to accelerate your growth and success — each built around a real need of the student community."
      />
      <Container className="py-16 sm:py-20">
        <div className="space-y-12">
          {initiatives.map((initiative, index) => (
            <article
              key={initiative.slug}
              id={initiative.slug}
              className="grid gap-6 rounded-xl border border-slate-200 bg-white p-6 sm:p-8 lg:grid-cols-3"
            >
              <div className="lg:col-span-1">
                <p className="text-sm font-medium text-slate-400">0{index + 1}</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{initiative.title}</h2>
              </div>
              <div className="lg:col-span-2">
                <p className="text-base leading-relaxed text-slate-600">{initiative.description}</p>
                {initiative.href ? (
                  <a
                    href={initiative.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
                  >
                    Visit the {initiative.shortTitle} website
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </>
  );
}