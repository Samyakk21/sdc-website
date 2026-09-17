import type { Metadata } from "next";
import { ArrowUpRight, Mail, MapPin, Phone, User } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { contact, links } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach out to the Student Development Council at IISER Bhopal.",
};

const channels = [
  {
    icon: Mail,
    label: "Email",
    value: contact.email,
    href: `mailto:${contact.email}`,
    hint: "For questions, ideas, and opportunities.",
  },
  {
    icon: Phone,
    label: "Phone",
    value: contact.phone,
    href: `tel:${contact.phone.replace(/\s/g, "")}`,
    hint: "Reachable during working hours.",
  },
  {
    icon: User,
    label: "Secretary",
    value: contact.secretary,
    href: null,
    hint: "Point of contact for the council.",
  },
  {
    icon: MapPin,
    label: "Office",
    value: contact.addressLines.join(", "),
    href: null,
    hint: `${contact.institute}.`,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's connect"
        description="Questions, ideas, or opportunities? We'd love to hear from you — drop us a line and we'll get back to you."
      />

      <Container className="py-16 sm:py-20">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((channel) => {
            const Icon = channel.icon;
            const inner = (
              <>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="mt-4 text-sm font-semibold uppercase tracking-wider text-slate-400">{channel.label}</h2>
                <p className="mt-1 font-semibold text-slate-900">{channel.value}</p>
                <p className="mt-1 text-sm text-slate-600">{channel.hint}</p>
              </>
            );
            return (
              <li key={channel.label}>
                {channel.href ? (
                  <a
                    href={channel.href}
                    className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-8">
            <h2 className="text-2xl font-bold text-slate-900">Prefer our community channels?</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Follow our Linktree for socials and explore our blogs and compendiums for deep dives.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                { href: links.linktree, label: "Our Linktree" },
                { href: links.blogs, label: "SDC Blogs" },
                { href: links.compendiums, label: "Compendiums" },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
                  >
                    {item.label}
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-between rounded-xl bg-ink-950 p-8 text-white">
            <div>
              <h2 className="text-2xl font-bold">Drop by the SDC Room</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {contact.addressLines.join(", ")}, {contact.institute}.
              </p>
            </div>
            <p className="mt-6 text-sm text-slate-400">
              Questions? Write to us at{" "}
              <a href={`mailto:${contact.email}`} className="font-medium text-white underline underline-offset-2">
                {contact.email}
              </a>
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}