import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { EventForm } from "@/app/admin/events/_form";
import { requireAdmin } from "@/lib/admin/guard";
import { getEventRow } from "@/lib/events-repo";

export const metadata: Metadata = {
  title: "Edit Event — Admin",
  description: "Edit an SDC event.",
  robots: "noindex",
};

export default async function AdminEventEditPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  await requireAdmin();

  const row = await getEventRow(slug);
  if (!row) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Edit event"
        description="Changes save to the database and appear on /events immediately."
      />
      <Container className="py-10 sm:py-12 max-w-3xl">
        <SectionHeading eyebrow="Edit event" title={row.title} />
        <EventForm
          mode="edit"
          slug={slug}
          initial={{
            title: row.title,
            tagline: row.tagline,
            description: row.description ?? "",
            starts_at: row.starts_at,
            ends_at: row.ends_at,
            mode: row.mode,
            location: row.location,
            capacity: row.capacity,
            registration_deadline: row.registration_deadline,
            organizer: row.organizer,
            status: row.status,
          }}
        />
      </Container>
    </>
  );
}
