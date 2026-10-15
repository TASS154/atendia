import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFrame } from "@/components/marketing/frame";

export const metadata: Metadata = {
  title: "Preços",
  description: "Demo gratuita. Planos Essencial e Operação para o time crescer sem planilha paralela.",
};

const ROWS = [
  {
    name: "Demonstração",
    for: "Conhecer a operação completa",
    price: "Grátis",
    items: "Studio Bella · simulador · inbox, funil e caixa · sem cartão",
    href: "/login",
    cta: "Entrar na demo",
  },
  {
    name: "Essencial",
    for: "Uma unidade, time pequeno",
    price: "R$ 189 / mês",
    items: "Até 3 usuários · WhatsApp Cloud API · orçamentos, agenda e recuperação",
    href: "/contato",
    cta: "Falar com vendas",
  },
  {
    name: "Operação",
    for: "Equipe e vários profissionais",
    price: "R$ 349 / mês",
    items: "Usuários ilimitados · automações · relatórios do dono · suporte próximo",
    href: "/contato",
    cta: "Falar com vendas",
  },
];

export default function PricingPage() {
  return (
    <MarketingFrame>
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Preços</p>
        <h1 className="mt-3 max-w-2xl font-serif text-5xl tracking-tight">
          Simples de explicar para o dono.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          A demo é gratuita e já mostra o produto inteiro. Os planos abaixo são a
          conversa comercial — sem checkout nesta versão.
        </p>
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-t border-line text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-[0.16em] text-muted">
                <th className="py-4 pr-6 font-normal">Plano</th>
                <th className="py-4 pr-6 font-normal">Inclui</th>
                <th className="py-4 pr-6 font-normal">Valor</th>
                <th className="py-4 font-normal" />
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.name} className="border-t border-line align-top">
                  <td className="py-6 pr-6">
                    <p className="font-medium">{row.name}</p>
                    <p className="mt-1 text-sm text-muted">{row.for}</p>
                  </td>
                  <td className="py-6 pr-6 text-sm text-muted">{row.items}</td>
                  <td className="py-6 pr-6 font-serif text-2xl">{row.price}</td>
                  <td className="py-6 text-right">
                    <Link href={row.href} className="ink-link text-sm text-brand-2">
                      {row.cta}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-10 max-w-2xl text-sm text-muted">
          Implantação e conexão da Cloud API entram na conversa de vendas.
          Enquanto isso, o Studio Bella já está pronto para você clicar.
        </p>
      </main>
    </MarketingFrame>
  );
}
