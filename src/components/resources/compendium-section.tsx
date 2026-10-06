import { ArrowUpRight, BookOpenText, CheckCircle2, Info } from "lucide-react";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  compendiumHighlights,
  compendiumNote,
  type Compendium,
} from "@/lib/content/compendiums";

export function CompendiumSection({ compendiums }: { compendiums: Compendium[] }) {
  if (compendiums.length === 0) return null;

  return (
    <section id="compendium" aria-labelledby="compendium-heading" className="bg-white py-16 sm:py-20">
      <Container>
        <SectionHeading
          id="compendium-heading"
          eyebrow="Compendiums"
          title="Internship compendiums"
          description="Two living documents from the SDC that collect internship and fellowship opportunities for students."
        />

        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {compendiums.map((compendium) => (
            <li key={compendium.slug}>
              <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <BookOpenText className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{compendium.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{compendium.description}</p>
                <a
                  href={compendium.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  Open compendium
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-10 rounded-xl bg-slate-50 p-6 sm:p-8">
          <h3 className="text-base font-semibold text-slate-900">What&apos;s inside the compendiums?</h3>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {compendiumHighlights.map((highlight) => (
              <li key={highlight.title} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
                <div>
                  <p className="text-sm font-medium text-slate-900">{highlight.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{highlight.description}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-slate-600">
            Students from all academic disciplines and years are encouraged to explore these resources
            and begin planning their applications early — we hope these compendiums prove invaluable in
            kickstarting your internship journey.
          </p>
        </div>

        <div className="mt-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
          <p className="text-sm leading-relaxed text-amber-900">{compendiumNote}</p>
        </div>
      </Container>
    </section>
  );
}
