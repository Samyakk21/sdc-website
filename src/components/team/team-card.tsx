import Image from "next/image";
import { Mail } from "lucide-react";

import type { TeamMember } from "@/lib/types";

function LinkedInIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const linkClass = "flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-brand-600 hover:text-white";

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 text-center transition-shadow hover:shadow-md">
      <div className="relative mx-auto mb-4 h-28 w-28 overflow-hidden rounded-full bg-slate-200">
        <Image
          src={member.image}
          alt={member.name}
          fill
          sizes="112px"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <h3 className="text-base font-semibold text-slate-900">{member.name}</h3>
      <p className="mt-1 text-sm font-medium text-brand-600">{member.role}</p>

      {member.quote ? (
        <p className="mt-3 flex-1 text-sm italic leading-relaxed text-slate-600">“{member.quote}”</p>
      ) : (
        <div className="flex-1" />
      )}

      {member.linkedin || member.email ? (
        <div className="mt-4 flex items-center justify-center gap-2">
          {member.linkedin ? (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on LinkedIn`}
              className={linkClass}
            >
              <LinkedInIcon />
            </a>
          ) : null}
          {member.email ? (
            <a
              href={`mailto:${member.email}`}
              aria-label={`Email ${member.name}`}
              className={linkClass}
            >
              <Mail className="h-4 w-4" aria-hidden />
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}