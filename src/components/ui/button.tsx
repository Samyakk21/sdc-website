import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 font-medium text-white transition-colors hover:bg-brand-700",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-ink-900 font-medium text-white transition-colors hover:bg-ink-800",
  outline:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium text-slate-700 transition-colors hover:bg-slate-100",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  external = false,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  external?: boolean;
}) {
  const classes = `${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}