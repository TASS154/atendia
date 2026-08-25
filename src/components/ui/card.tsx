import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-line/80 bg-surface shadow-[0_1px_2px_rgba(20,18,16,0.04),0_16px_40px_rgba(20,18,16,0.045)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "ok" | "warn" | "danger" | "copper";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        tone === "neutral" && "bg-bg-2 text-muted",
        tone === "brand" && "bg-brand-soft text-brand-2",
        tone === "ok" && "bg-emerald-50 text-ok",
        tone === "warn" && "bg-amber-50 text-warn",
        tone === "danger" && "bg-red-50 text-danger",
        tone === "copper" && "bg-orange-50 text-copper",
      )}
    >
      {children}
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-serif text-3xl tracking-tight text-ink">{title}</h1>
        {subtitle ? <p className="mt-1 max-w-2xl text-sm text-muted">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  href,
  icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
  icon?: ReactNode;
}) {
  const inner = (
    <Card className="h-full p-4 transition duration-200 hover:-translate-y-0.5 hover:border-brand/30">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{label}</p>
        {icon ? (
          <span className="rounded-2xl bg-brand-soft p-1.5 text-brand-2">{icon}</span>
        ) : null}
      </div>
      <p className="mt-3 font-serif text-3xl tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-[11px] text-muted">{hint}</p> : null}
    </Card>
  );
  if (!href) return inner;
  return (
    <Link href={href} className="block">
      {inner}
    </Link>
  );
}
