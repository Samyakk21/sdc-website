import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to the Student Development Council platform with your IISER Bhopal Google account.",
};

export default function LoginPage() {
  return (
    <Container className="flex justify-center py-20 sm:py-28">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">
            SDC
          </span>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">Sign in</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Sign in with your IISER Bhopal account to register for events, join Career of the Month tracks, and track
            your progress.
          </p>

          <button
            type="button"
            disabled
            aria-disabled="true"
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-500"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84Z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
            <p>
              Only accounts ending in <span className="font-medium text-slate-700">@iiserb.ac.in</span> can sign in.
              Authentication is being enabled for launch.
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