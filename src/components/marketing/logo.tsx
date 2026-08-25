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
    <Link href={href} className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "grid h-8 w-8 place-items-center rounded-xl text-[13px] font-semibold tracking-tight shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]",
          light ? "bg-white/15 text-white" : "bg-brand text-white",
        )}
      >
        A
      </span>
      <span
        className={cn(
          "font-serif text-[1.65rem] leading-none tracking-tight",
          light ? "text-white" : "text-ink",
        )}
      >
        Atendia
      </span>
    </Link>
  );
}
