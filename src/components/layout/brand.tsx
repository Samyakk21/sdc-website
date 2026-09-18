import Link from "next/link";

import { LogoMark } from "@/components/layout/logo-mark";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Student Development Council – Home">
      <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
        <LogoMark className="h-8 w-8" />
      </span>
      {!compact ? (
        <span className="hidden flex-col leading-tight sm:flex">
          <span className="text-sm font-bold text-slate-900">Student Development Council</span>
          <span className="text-xs text-slate-500">IISER Bhopal</span>
        </span>
      ) : null}
    </Link>
  );
}