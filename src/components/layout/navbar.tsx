"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";

import { Brand } from "@/components/layout/brand";
import { signOut } from "@/lib/supabase/actions";

export type NavbarSession = {
  full_name: string | null;
  role: "student" | "admin" | "super_admin";
} | null;

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/initiatives", label: "Initiatives" },
  { href: "/events", label: "Events" },
  { href: "/cotm", label: "Career of the Month" },
  { href: "/resources", label: "Resources" },
  { href: "/announcements", label: "Announcements" },
];

const mobileExtraLinks = [{ href: "/contact", label: "Contact" }];

function initials(name: string | null) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  return parts
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export function Navbar({ session }: { session: NavbarSession }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        aria-label="Main"
      >
        <Brand />

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <span className="hidden items-center gap-2 sm:inline-flex">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700"
                  aria-hidden
                >
                  {initials(session.full_name)}
                </span>
                <span className="max-w-[10rem] truncate text-sm font-medium text-slate-700">
                  {session.full_name ?? "Your account"}
                </span>
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:inline-flex"
                >
                  <LogOut className="h-4 w-4" aria-hidden />
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-lg bg-ink-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ink-800 sm:inline-flex"
            >
              Sign In
            </Link>
          )}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </nav>

      {open ? (
        <div id="mobile-menu" className="border-t border-slate-200 bg-white lg:hidden">
          <ul className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-4">
            {[...navLinks, ...mobileExtraLinks].map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      active ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li className="mt-2 border-t border-slate-100 pt-3">
              {session ? (
                <form action={signOut}>
                  <button
                    type="submit"
                    className="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Sign out ({session.full_name ?? "your account"})
                  </button>
                </form>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg bg-ink-900 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-ink-800"
                >
                  Sign In
                </Link>
              )}
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}