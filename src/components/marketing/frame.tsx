import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

export function MarketingFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full bg-bg text-ink">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
