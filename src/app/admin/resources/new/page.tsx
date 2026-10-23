import type { Metadata } from "next";

import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ResourceForm } from "@/app/admin/resources/_form";
import { requireAdmin } from "@/lib/admin/guard";

export const metadata: Metadata = {
  title: "Create Resource — Admin",
  description: "Create a new SDC library resource.",
  robots: "noindex",
};

export default async function AdminResourceNewPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Create resource"
        description="Add a new library resource. Publish it to show it on /resources."
      />
      <Container className="py-10 sm:py-12 max-w-3xl">
        <SectionHeading eyebrow="New resource" title="Resource details" />
        <ResourceForm mode="create" />
      </Container>
    </>
  );
}
