import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
  id,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  id?: string;
}) {
  const alignment = align === "center" ? "mx-auto text-center" : "";
  return (
    <div className={`max-w-2xl ${alignment} ${className}`}>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">{eyebrow}</p>
      ) : null}
      <h2 id={id} className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
      {description ? <p className="mt-3 text-base leading-relaxed text-slate-600">{description}</p> : null}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} align={align} />
      {action}
    </div>
  );
}