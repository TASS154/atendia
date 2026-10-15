import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  light = false,
  className,
}: {
  href?: string;
  light?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("inline-flex items-baseline gap-2", className)}>
      <span
        className={cn(
          "font-serif text-[1.7rem] leading-none tracking-tight",
          light ? "text-white" : "text-ink",
        )}
      >
        Atendia
      </span>
    </Link>
  );
}
