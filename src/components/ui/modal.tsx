"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  title,
  onClose,
  children,
  wide,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-ink/30"
        onClick={onClose}
        aria-label="Fechar"
      />
      <div
        className={cn(
          "relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-surface p-5 shadow-xl sm:rounded-3xl sm:p-6",
          wide ? "sm:max-w-2xl" : "sm:max-w-lg",
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-muted hover:text-ink"
          >
            Fechar
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
