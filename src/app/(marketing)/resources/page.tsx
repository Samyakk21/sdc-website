import type { Metadata } from "next";

import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { ResourceBrowser } from "@/components/resources/resource-browser";
import { resources } from "@/lib/content/resources";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Roadmaps, guides, articles, videos, and curated links maintained by the Student Development Council.",
};

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Learn with curated resources"
        description="Roadmaps, guides, videos, and references collected by the council — filter by category or search for something specific."
      />
      <Container className="py-16 sm:py-20">
        <ResourceBrowser resources={resources} />
      </Container>
    </>
  );
}