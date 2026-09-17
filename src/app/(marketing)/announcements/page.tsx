import type { Metadata } from "next";
import { Megaphone, Pin } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/format";
import { announcements } from "@/lib/content/announcements";

export const metadata: Metadata = {
  title: "Announcements",
  description: "News and notices from the Student Development Council at IISER Bhopal.",
};

export default function AnnouncementsPage() {
  const sorted = [...announcements].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <>
      <PageHeader
        eyebrow="Announcements"
        title="News & notices"
        description="Official updates from the council — enrolment deadlines, launches, and important information."
      />
      <Container className="py-16 sm:py-20">
        {sorted.length > 0 ? (
          <ol className="mx-auto max-w-3xl space-y-4">
            {sorted.map((announcement) => (
              <li key={announcement.title} className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  {announcement.pinned ? (
                    <Badge tone="brand">
                      <Pin className="h-3 w-3" aria-hidden />
                      Pinned
                    </Badge>
                  ) : null}
                  <time className="text-xs text-slate-500" dateTime={announcement.date}>
                    {formatDate(announcement.date)}
                  </time>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-slate-900">{announcement.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{announcement.body}</p>
              </li>
            ))}
          </ol>
        ) : (
          <EmptyState
            icon={<Megaphone className="h-8 w-8" aria-hidden />}
            title="No announcements yet"
            description="SDC announcements will appear here."
          />
        )}
      </Container>
    </>
  );
}