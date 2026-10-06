import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

import { Container } from "@/components/ui/container";
import { LogoMark } from "@/components/layout/logo-mark";
import { siteName, contact, links } from "@/lib/content/site";

const pageLinks = [
  { href: "/about", label: "About" },
  { href: "/initiatives", label: "Initiatives" },
  { href: "/events", label: "Events" },
  { href: "/cotm", label: "Career of the Month" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-ink-950 text-slate-300">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-white/20">
                <LogoMark className="h-8 w-8" />
              </span>
              <span className="text-sm font-bold text-white">{siteName}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Supporting student growth through career development, academic excellence, and professional
              networking opportunities.
            </p>
            <p className="mt-4 flex items-start gap-2 text-xs text-slate-400">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>
                {contact.addressLines.join(", ")}
                <br />
                {contact.institute}
              </span>
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Explore</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {pageLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-300 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Resources</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href={links.linktree} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-slate-300 transition-colors hover:text-white">
                  Our Linktree <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              </li>
              <li>
                <a href={links.blogs} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-slate-300 transition-colors hover:text-white">
                  Blogs <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              </li>
              <li>
                <a href={links.compendiums} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-slate-300 transition-colors hover:text-white">
                  Compendiums <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Connect</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 text-slate-300 transition-colors hover:text-white">
                  <Mail className="h-4 w-4" aria-hidden /> {contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 text-slate-300 transition-colors hover:text-white">
                  <Phone className="h-4 w-4" aria-hidden /> {contact.phone}
                </a>
              </li>
              <li className="pt-1 text-xs text-slate-500">
                Secretary: {contact.secretary}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>© 2026 Student Development Council. All rights reserved.</p>
          <p>{contact.institute}</p>
        </div>
      </Container>
    </footer>
  );
}