import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-slate-200 bg-slate-50 py-14 sm:py-16">
      <Container>
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">{eyebrow}</p>
          ) : null}
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{title}</h1>
          {description ? <p className="mt-4 text-lg leading-relaxed text-slate-600">{description}</p> : null}
          {children}
        </div>
      </Container>
    </section>
  );
}