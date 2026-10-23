import type { Metadata } from "next";

import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { EmptyState } from "@/components/ui/empty-state";
import { listEvents } from "@/lib/events-repo";
import { requireAdmin } from "@/lib/admin/guard";

export const metadata: Metadata = {
  title: "Admin Overview",
  description: "Admin dashboard for managing SDC events, resources, and submissions.",
  robots: "noindex",
};

export default async function AdminOverviewPage() {
  await requireAdmin();

  const events = await listEvents();
  const upcoming = events.filter(
    (e) => e.status === "registration_open" || e.status === "upcoming",
  );

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Overview"
        description="Manage SDC content — events, resources, and opportunity submissions."
      />
      <Container className="py-10 sm:py-12">
        <SectionHeading
          eyebrow="At a glance"
          title="What needs attention"
          description="A quick summary of the content under administration."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Upcoming events</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{upcoming.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Opportunities pending review</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">—</p>
            <p className="mt-1 text-xs text-slate-500">Moderation queue coming soon.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Published resources</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">0</p>
          </div>
        </div>

        <SectionHeading
          eyebrow="Quick actions"
          title="Manage content"
          className="mt-12"
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <a
            href="/admin/events"
            className="block rounded-xl border border-slate-200 bg-white p-6 hover:bg-slate-50 transition-colors"
          >
            <h3 className="font-semibold text-slate-900">Events</h3>
            <p className="mt-1 text-sm text-slate-600">Create, edit, and publish events.</p>
          </a>
          <a
            href="/admin/resources"
            className="block rounded-xl border border-slate-200 bg-white p-6 hover:bg-slate-50 transition-colors"
          >
            <h3 className="font-semibold text-slate-900">Resources</h3>
            <p className="mt-1 text-sm text-slate-600">Create, edit, and publish resources.</p>
          </a>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="font-semibold text-slate-900">Opportunity moderation</h3>
            <p className="mt-1 text-sm text-slate-600">Approving student submissions.</p>
            <p className="mt-3 text-xs text-slate-500">Coming soon — page on hold.</p>
          </div>
        </div>

        <div className="mt-12">
          <EmptyState
            title="No upcoming events yet"
            description="Create your first event from the Events section to get started."
            action={
              <a
                href="/admin/events/new"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                Create event
              </a>
            }
          />
        </div>
      </Container>
    </>
  );
}
