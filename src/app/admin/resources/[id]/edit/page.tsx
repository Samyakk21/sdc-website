import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ResourceForm } from "@/app/admin/resources/_form";
import { requireAdmin } from "@/lib/admin/guard";
import { getResource } from "@/lib/resources-repo";

export const metadata: Metadata = {
  title: "Edit Resource — Admin",
  description: "Edit an SDC library resource.",
  robots: "noindex",
};

export default async function AdminResourceEditPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await requireAdmin();

  const resource = await getResource(id);
  if (!resource) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Edit resource"
        description="Changes save to the database and appear on /resources immediately when published."
      />
      <Container className="py-10 sm:py-12 max-w-3xl">
        <SectionHeading eyebrow="Edit resource" title={resource.title} />
        <ResourceForm
          mode="edit"
          id={id}
          initial={{
            title: resource.title,
            description: resource.description ?? "",
            type: resource.type,
            category: resource.categories?.[0] ?? null,
            url: resource.url ?? "",
            author: resource.author ?? null,
            is_published: true,
          }}
        />
      </Container>
    </>
  );
}
