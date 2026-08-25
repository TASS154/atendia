import type { Metadata } from "next";
import { Check } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Casos",
  description:
    "Como salão, clínica e oficina usam o Atendia para não perder lead, horário e cobrança.",
};

const CASES = [
  {
    id: "salao",
    kicker: "Salão e estética",
    title: "Studio Bella · Campinas",
    body: "Quatro pessoas na operação, Instagram trazendo lead o dia inteiro. A Marina perdia orçamento de luzes porque a conversa ficava no celular da recepção. Na demo, o lead vira card, o orçamento tem follow-up e quem some há 30 dias entra na lista de recuperação.",
    points: [
      "Inbox com contexto da cliente ao lado da conversa",
      "Agenda das profissionais ligada ao serviço",
      "Caixa do mês com atrasados visíveis",
    ],
    cta: "Entrar nessa demo",
    href: "/login",
  },
  {
    id: "clinica",
    kicker: "Clínica e estúdio",
    title: "Clínica Horizonte · Ribeirão Preto",
    body: "Retorno de procedimento era papel na recepção. Paciente sumia, a agenda furava e ninguém cobrava a sessão seguinte. O mesmo fluxo do Atendia serve: lead de indicação, orçamento de pacote, horário confirmado e lista de quem parou de voltar.",
    points: [
      "Pacote vira orçamento com validade",
      "Lembrete de horário sem planilha",
      "Pós-venda deixa de depender da memória da equipe",
    ],
    cta: "Ver o produto",
    href: "/#produto",
  },
  {
    id: "oficina",
    kicker: "Oficina e serviços",
    title: "Oficina Nunes · Jundiaí",
    body: "Orçamento de funilaria saía no WhatsApp e morria. Sem OS, sem status, sem Pix combinado. No Atendia o orçamento tem número, a ordem de serviço acompanha a execução e o financeiro mostra o que ainda não entrou.",
    points: [
      "Proposta com itens, desconto e validade",
      "Ordem de serviço ligada ao cliente",
      "A receber e atrasado no mesmo painel",
    ],
    cta: "Falar com vendas",
    href: "/contato",
  },
];

export default function CasesPage() {
  return (
    <div className="min-h-full bg-bg">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Casos</p>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl tracking-tight">
          O fluxo é o mesmo. Muda só o tipo de serviço.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          A demo ao vivo é um salão. Os outros dois casos mostram como clínica e
          oficina usam o mesmo hub — lead, proposta, agenda, caixa e retorno.
        </p>
        <div className="mt-12 space-y-6">
          {CASES.map((item) => (
            <article
              key={item.id}
              id={item.id}
              className="scroll-mt-24 rounded-[2rem] border border-line bg-surface p-6 md:p-8"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-copper">{item.kicker}</p>
              <h2 className="mt-2 font-serif text-3xl tracking-tight">{item.title}</h2>
              <p className="mt-4 max-w-3xl leading-relaxed text-muted">{item.body}</p>
              <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-3">
                {item.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <Check size={16} className="mt-0.5 shrink-0 text-brand" />
                    {point}
                  </li>
                ))}
              </ul>
              <Button href={item.href} className="mt-6">
                {item.cta}
              </Button>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
