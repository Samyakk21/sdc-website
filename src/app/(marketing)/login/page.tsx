import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { Container } from "@/components/ui/container";
import { getCurrentSession } from "@/lib/auth";
import { GoogleSignInButton } from "./google-sign-in";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to the Student Development Council platform with your IISER Bhopal Google account.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const session = await getCurrentSession();
  if (session) redirect("/");

  const { next, error } = await searchParams;
  const redirectTo = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";

  return (
    <Container className="flex justify-center py-20 sm:py-28">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">
            SDC
          </span>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
            Sign in
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Sign in with your IISER Bhopal account to register for events, join
            Career of the Month tracks, and track your progress.
          </p>

          {error ? (
            <div
              role="alert"
              className="mt-6 rounded-lg border border-brand-200 bg-brand-50 p-3 text-sm text-brand-800"
            >
              Sign-in didn&apos;t complete. Please try again.
            </div>
          ) : null}

          <div className="mt-6">
            <GoogleSignInButton next={redirectTo} />
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
            <p>
              Only accounts ending in{" "}
              <span className="font-medium text-slate-700">@iiserb.ac.in</span>{" "}
              can sign in. Use your IISER Bhopal institutional Google account.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Need help?{" "}
          <Link href="/contact" className="font-medium text-brand-600 hover:text-brand-700">
            Contact SDC
          </Link>
        </p>
      </div>
    </Container>
  );
}