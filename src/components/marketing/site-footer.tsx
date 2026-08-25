import Link from "next/link";
import { Logo } from "./logo";

const COLS = [
  {
    title: "Produto",
    links: [
      { href: "/#produto", label: "O que faz" },
      { href: "/#como", label: "Como funciona" },
      { href: "/precos", label: "Preços" },
      { href: "/login", label: "Demonstração" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/sobre", label: "Sobre" },
      { href: "/casos", label: "Casos" },
      { href: "/contato", label: "Falar com vendas" },
    ],
  },
  {
    title: "Para quem",
    links: [
      { href: "/casos#salao", label: "Salões e estética" },
      { href: "/casos#clinica", label: "Clínicas" },
      { href: "/casos#oficina", label: "Oficinas e serviços" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.2fr_2fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted">
            Hub comercial para PMEs que vendem e atendem pelo WhatsApp.
            A conversa deixa de morrer no celular da dona.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {COLS.map((col) => (
            <div key={col.title}>
              <p className="text-xs uppercase tracking-[0.18em] text-muted">{col.title}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-ink/80 hover:text-brand">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Atendia. Demo comercial · Studio Bella, Campinas/SP.</p>
          <p>Conta da demo: ivan.p@example.net · senha demo1234</p>
        </div>
      </div>
    </footer>
  );
}
