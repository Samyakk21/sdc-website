import Link from "next/link";
import { ArrowRight, Megaphone, Pin } from "lucide-react";

import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/format";
import type { Announcement } from "@/lib/types";

export function AnnouncementsSection({ announcements, limit = 2 }: { announcements: Announcement[]; limit?: number }) {
  const visible = announcements.slice(0, limit);
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow="Announcements"
          title="Latest updates"
          description="Important news and notices from the SDC team."
          action={
            <Link
              href="/announcements"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              View all announcements
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          }
        />
        {visible.length > 0 ? (
          <ul className="mt-8 space-y-4">
            {visible.map((announcement) => (
              <li
                key={announcement.title}
                className="rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-sm"
              >
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
                <h3 className="mt-2 font-semibold text-slate-900">{announcement.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{announcement.body}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8">
            <EmptyState
              icon={<Megaphone className="h-8 w-8" aria-hidden />}
              title="No announcements yet"
              description="SDC announcements will appear here."
            />
          </div>
        )}
      </Container>
    </section>
  );
}