import { FileText, Video, Globe, Map as MapIcon, BookOpen, GraduationCap, Link as LinkIcon, File } from "lucide-react";

import type { Resource, ResourceType } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

const resourceIcons: Record<ResourceType, React.ComponentType<{ className?: string }>> = {
  pdf: FileText,
  article: FileText,
  video: Video,
  website: Globe,
  roadmap: MapIcon,
  book: BookOpen,
  tutorial: GraduationCap,
  link: LinkIcon,
};

export function ResourceCard({ resource, showMeta = true }: { resource: Resource; showMeta?: boolean }) {
  const Icon = resourceIcons[resource.type] ?? File;

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <Badge tone="ink">{resource.type}</Badge>
      </div>
      <h3 className="mt-4 text-base font-semibold leading-snug text-slate-900">{resource.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{resource.description}</p>
      {showMeta ? (
        <div className="mt-auto flex items-center justify-between pt-5 text-xs text-slate-500">
          <span>{resource.author ?? "SDC"}</span>
          <time dateTime={resource.dateAdded}>{formatDate(resource.dateAdded)}</time>
        </div>
      ) : null}
    </article>
  );
}