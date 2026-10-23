import type { Metadata } from "next";

import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { EventForm } from "@/app/admin/events/_form";
import { requireAdmin } from "@/lib/admin/guard";

export const metadata: Metadata = {
  title: "Create Event — Admin",
  description: "Create a new SDC event.",
  robots: "noindex",
};

export default async function AdminEventNewPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Create event"
        description="Add a new event. It will appear on /events once published."
      />
      <Container className="py-10 sm:py-12 max-w-3xl">
        <SectionHeading eyebrow="New event" title="Event details" />
        <EventForm mode="create" />
      </Container>
    </>
  );
}
