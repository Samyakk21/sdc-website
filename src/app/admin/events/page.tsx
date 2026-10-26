import Link from "next/link";

import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { deleteEvent } from "@/app/admin/events/actions";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { requireAdmin } from "@/lib/admin/guard";
import { listEvents } from "@/lib/events-repo";
import { eventStatusMeta } from "@/lib/event-status";
import { formatTime } from "@/lib/format";

export default async function AdminEventsListPage() {
  await requireAdmin();

  const events = await listEvents();

  const rows = events.map((e) => ({
    slug: e.slug,
    title: e.title,
    status: e.status,
    mode: e.mode,
    date: e.date,
    startTime: e.startTime,
  }));

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Events"
        description="Create, edit, and publish SDC events and workshops."
      />
      <Container className="py-10 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <SectionHeading eyebrow="Events" title="All events" />
          <div className="flex gap-2">
            <Button href="/admin/events/new" size="sm">
              Create event
            </Button>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No events yet"
              description="Create your first event to get started."
              action={
                <a href="/admin/events/new" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
                  Create event
                </a>
              }
            />
          </div>
        ) : null}

        {rows.length > 0 ? (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-sm text-slate-600">
              <thead>
                <tr className="bg-slate-50 text-slate-900 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 text-left">Event</th>
                  <th className="px-6 py-3 text-left">Date & time</th>
                  <th className="px-6 py-3 text-left">Mode</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row) => {
                  const meta = eventStatusMeta[
                    row.status as keyof typeof eventStatusMeta
                  ];
                  return (
                    <tr key={row.slug} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/admin/events/${row.slug}/edit`}>
                          {row.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        {row.date}
                        {row.startTime ? ` · ${formatTime(row.startTime)}` : ""}
                      </td>
                      <td className="px-6 py-4">{row.mode}</td>
                      <td className="px-6 py-4">
                        <Badge tone={meta.tone}>{meta.label}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/events/${row.slug}/edit`}
                          className="text-sm font-medium text-brand-600 hover:text-brand-700"
                        >
                          Edit
                        </Link>
                        <form action={deleteEvent} className="inline">
                          <input type="hidden" name="slug" value={row.slug} />
                          <ConfirmSubmitButton
                            className="ml-3 text-sm font-medium text-red-600 hover:text-red-800"
                            message={`Delete “${row.title}”? This cannot be undone.`}
                          >
                            Delete
                          </ConfirmSubmitButton>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </Container>
    </>
  );
}
