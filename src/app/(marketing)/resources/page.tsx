import type { Metadata } from "next";

import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { ResourceBrowser } from "@/components/resources/resource-browser";
import { CompendiumSection } from "@/components/resources/compendium-section";
import { resources } from "@/lib/content/resources";
import { compendiums } from "@/lib/content/compendiums";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Internship compendiums, roadmaps, guides, articles, videos, and curated links maintained by the Student Development Council.",
};

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Learn with curated resources"
        description="Internship compendiums, roadmaps, guides, videos, and references collected by the council."
      />
      <CompendiumSection compendiums={compendiums} />
      <Container className="py-16 sm:py-20">
        {resources.length > 0 ? (
          <ResourceBrowser resources={resources} />
        ) : (
          <EmptyState
            title="Nothing in the library yet"
            description="We only list a resource once there is something real to open — a link, a PDF, a video. For now, start with the compendiums above, and check our Linktree and blogs in the footer."
          />
        )}
      </Container>
    </>
  );
}
