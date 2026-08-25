import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "copper";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition disabled:opacity-50",
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "md" && "px-4 py-2 text-sm",
        size === "lg" && "px-5 py-2.5 text-sm",
        variant === "primary" && "bg-brand text-white hover:bg-brand-2",
        variant === "secondary" && "border border-line bg-surface text-ink hover:bg-bg-2",
        variant === "ghost" && "text-muted hover:bg-bg-2 hover:text-ink",
        variant === "danger" && "bg-danger text-white hover:opacity-90",
        variant === "copper" && "bg-copper text-white hover:opacity-90",
        className,
      )}
      {...props}
    />
  );
}
