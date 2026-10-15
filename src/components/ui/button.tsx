import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-brand text-white hover:bg-brand-2",
  secondary: "border border-line bg-surface text-ink hover:bg-bg-2",
  ghost: "text-muted hover:text-ink",
  danger: "bg-danger text-white hover:opacity-90",
  copper: "bg-copper text-white hover:opacity-90",
  dark: "bg-ink text-white hover:bg-black",
} as const;

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-sm",
} as const;

function buttonClass(
  variant: keyof typeof variants,
  size: keyof typeof sizes,
  className?: string,
) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-sm font-medium tracking-wide transition duration-200 disabled:opacity-50",
    sizes[size],
    variants[variant],
    className,
  );
}

type Common = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children?: ReactNode;
};

type ButtonAsButton = Common &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = Common & {
  href: string;
  target?: string;
  onClick?: () => void;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const variant = props.variant ?? "primary";
  const size = props.size ?? "md";

  if ("href" in props && props.href) {
    const className = buttonClass(variant, size, props.className);
    const { href, target, children, onClick } = props;
    if (href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) {
      return (
        <a href={href} target={target} className={className} onClick={onClick}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} target={target} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className, type = "button", ...rest } =
    props as ButtonAsButton;
  return <button type={type} className={buttonClass(variant, size, className)} {...rest} />;
}
