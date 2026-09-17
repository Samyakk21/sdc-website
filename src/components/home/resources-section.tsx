import { ArrowRight, BookOpenText } from "lucide-react";

import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ResourceCard } from "@/components/resources/resource-card";
import type { Resource } from "@/lib/types";

export function ResourcesSection({ resources, limit = 3 }: { resources: Resource[]; limit?: number }) {
  const visible = resources.slice(0, limit);
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow="Resources"
          title="Curated resources"
          description="Roadmaps, guides, and references to support your learning and applications."
          action={
            <Button href="/resources" variant="outline" size="sm">
              Browse resources
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          }
        />
        {visible.length > 0 ? (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((resource) => (
              <li key={resource.slug}>
                <ResourceCard resource={resource} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10">
            <EmptyState
              icon={<BookOpenText className="h-8 w-8" aria-hidden />}
              title="No resources yet"
              description="Resources will be added by the SDC team."
            />
          </div>
        )}
      </Container>
    </section>
  );
}