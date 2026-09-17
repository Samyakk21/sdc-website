import type { Metadata } from "next";

import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { aboutStatement, aboutHighlights } from "@/lib/content/initiatives";

export const metadata: Metadata = {
  title: "About",
  description: "Learn what the Student Development Council is and what it does for students at IISER Bhopal.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="The Student Development Council"
        description="SDC is the driving force behind student development at IISER Bhopal — your partners in growth, connecting the dots between where you are and where you want to be."
      />
      <Container className="py-16 sm:py-20">
        <div className="max-w-3xl space-y-6 text-base leading-relaxed text-slate-700 sm:text-lg">
          <p>{aboutStatement}</p>
          <p>
            Through careers, competitions, conversations, and communities, we run initiatives that help students
            build skills, explore paths, and open doors — from placements and internships to entrepreneurship,
            leadership, and beyond.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-3">
          {aboutHighlights.map((highlight) => (
            <li key={highlight.title} className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900">{highlight.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{highlight.description}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-2xl bg-ink-950 p-8 text-white sm:p-12">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold">Want to get involved?</h2>
              <p className="mt-2 text-sm text-slate-300">
                Join an initiative, pitch an idea, or just drop by the SDC Room.
              </p>
            </div>
            <Button href="/contact" variant="primary" size="md">
              Contact SDC
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}