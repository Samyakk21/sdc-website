import Link from "next/link";
import { ArrowRight, Compass, HandHeart, CalendarCheck } from "lucide-react";

import { Container } from "@/components/ui/container";
import { aboutStatement, aboutHighlights } from "@/lib/content/initiatives";

const highlightIcons = [HandHeart, Compass, CalendarCheck];

export function AboutSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Who we are
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">{aboutStatement}</p>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              More about SDC
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {aboutHighlights.map((highlight, index) => {
              const Icon = highlightIcons[index];
              return (
                <li key={highlight.title} className="rounded-xl border border-slate-200 bg-white p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-semibold text-slate-900">{highlight.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{highlight.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}