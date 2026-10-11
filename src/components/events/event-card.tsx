import Link from "next/link";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";

import type { SDCEvent } from "@/lib/types";
import { formatDate, formatDateShort, formatTime } from "@/lib/format";
import { eventStatusMeta } from "@/lib/event-status";
import { Badge } from "@/components/ui/badge";

export function EventCard({ event }: { event: SDCEvent }) {
  const meta = eventStatusMeta[event.status];
  const day = formatDateShort(event.date).split(" ")[0];
  const month = formatDateShort(event.date).split(" ")[1];

  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="flex flex-col-reverse items-start gap-3 sm:flex-row sm:justify-between sm:gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <time
            dateTime={event.date}
            className="flex w-14 flex-col items-center rounded-lg bg-ink-50 px-2 py-2 text-center shrink-0"
          >
            <span className="text-lg font-bold leading-none text-ink-900">{day}</span>
            <span className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-600">{month}</span>
          </time>
          <div className="min-w-0">
            <h3 className="text-base font-semibold leading-snug text-slate-900 break-words">
              <Link href={`/events/${event.slug}`} className="after:absolute after:inset-0">
                {event.title}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-slate-600 break-words">{event.organizer}</p>
          </div>
        </div>
        <Badge tone={meta.tone} className="shrink-0">{meta.label}</Badge>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-600 break-words">{event.description}</p>

      <dl className="mt-4 space-y-1.5 text-sm text-slate-600">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <Calendar className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
          <span className="break-words">{formatDate(event.date)}</span>
          {event.startTime ? (
            <span className="flex items-center gap-1 break-words">
              <Clock className="ml-2 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
              {event.endTime ? `${formatTime(event.startTime)} – ${formatTime(event.endTime)}` : formatTime(event.startTime)}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
          <span className="break-words min-w-0">{event.location}</span>
        </div>
      </dl>

      <div className="mt-auto flex items-center justify-between pt-5">
        <span className="text-sm font-medium text-brand-600">
          View details
          <ArrowRight className="ml-1 inline h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </article>
  );
}