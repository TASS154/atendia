"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

const LINKS = [
  { href: "/#produto", label: "Produto" },
  { href: "/casos", label: "Casos" },
  { href: "/precos", label: "Preços" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-bg/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition hover:text-ink",
                pathname === link.href && "text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="text-sm text-muted hover:text-ink">
            Entrar
          </Link>
          <Button href="/login">Ver demonstração</Button>
        </div>
        <button
          type="button"
          className="rounded-full border border-line bg-surface p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-line bg-surface px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Button href="/login" className="mt-2 w-full" onClick={() => setOpen(false)}>
              Ver demonstração
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
