import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Fade({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "header" | "p" | "h1" | "h2";
}) {
  const style = delay
    ? ({ animationDelay: `${delay}ms` } as CSSProperties)
    : undefined;
  return (
    <Tag className={cn("fade-settle", className)} style={style}>
      {children}
    </Tag>
  );
}
