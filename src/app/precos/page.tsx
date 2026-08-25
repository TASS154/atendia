import type { Metadata } from "next";
import { Check } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Preços",
  description: "Demo gratuita. Planos Essencial e Operação para o time crescer sem planilha paralela.",
};

const PLANS = [
  {
    name: "Demonstração",
    price: "Grátis",
    hint: "Para conhecer a operação completa",
    items: [
      "Tenant Studio Bella",
      "Simulador ao vivo",
      "Inbox, funil e caixa",
      "Sem cartão",
    ],
    featured: false,
    href: "/login",
    cta: "Entrar na demo",
  },
  {
    name: "Essencial",
    price: "R$ 189/mês",
    hint: "Uma unidade, time pequeno",
    items: [
      "Até 3 usuários",
      "WhatsApp Cloud API",
      "Orçamentos e agenda",
      "Financeiro básico",
      "Recuperação de clientes",
    ],
    featured: true,
    href: "/contato",
    cta: "Falar com vendas",
  },
  {
    name: "Operação",
    price: "R$ 349/mês",
    hint: "Equipe e vários profissionais",
    items: [
      "Usuários ilimitados",
      "Automações avançadas",
      "Relatórios do dono",
      "Vários profissionais",
      "Suporte próximo",
    ],
    featured: false,
    href: "/contato",
    cta: "Falar com vendas",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-full bg-bg">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Preços</p>
        <h1 className="mt-3 font-serif text-5xl tracking-tight">Simples de explicar para o dono.</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          A demo é gratuita e já mostra o produto inteiro. Os planos abaixo são a
          conversa comercial — sem checkout nesta versão.
        </p>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-[2rem] border p-6 ${
                plan.featured ? "border-brand bg-sidebar text-white" : "border-line bg-surface"
              }`}
            >
              {plan.featured ? (
                <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-white/50">
                  Mais escolhido
                </p>
              ) : null}
              <p>{plan.name}</p>
              <p className="mt-2 font-serif text-4xl">{plan.price}</p>
              <p className={`mt-1 text-sm ${plan.featured ? "text-white/60" : "text-muted"}`}>
                {plan.hint}
              </p>
              <ul className="mt-6 space-y-2 text-sm">
                {plan.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check size={16} className="mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                href={plan.href}
                className="mt-6 w-full"
                variant={plan.featured ? "secondary" : "primary"}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
        <p className="mt-10 max-w-2xl text-sm text-muted">
          Implantação e conexão da Cloud API entram na conversa de vendas.
          Enquanto isso, o Studio Bella já está pronto para você clicar.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
