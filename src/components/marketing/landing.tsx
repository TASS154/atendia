"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  MessageCircle,
  Receipt,
  Repeat2,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductPreview } from "./product-preview";

const FEATURES = [
  {
    icon: MessageCircle,
    title: "WhatsApp vira operação",
    body: "Inbox com contexto do cliente, templates e histórico. A conversa deixa de morrer no celular da dona.",
  },
  {
    icon: Receipt,
    title: "Orçamento com follow-up",
    body: "Do rascunho ao Pix. Status muda, o funil reage e ninguém esquece de cobrar resposta.",
  },
  {
    icon: CalendarDays,
    title: "Agenda da equipe",
    body: "Horários, profissionais e confirmação no mesmo lugar — sem planilha paralela.",
  },
  {
    icon: Wallet,
    title: "Caixa à vista",
    body: "A receber, atrasado e recebido no mês. O dinheiro que ainda não entrou deixa de ser surpresa.",
  },
  {
    icon: Repeat2,
    title: "Recuperação de clientes",
    body: "Quem sumiu há 30 dias aparece numa lista pronta para mensagem. Pós-venda deixa de ser improvisação.",
  },
  {
    icon: Sparkles,
    title: "Automação sem drama",
    body: "Follow-up de orçamento, lembrete de horário e retorno de serviço — no modo demo, você vê acontecendo.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "O lead chega no WhatsApp",
    body: "A conversa vira card no funil, com valor estimado e responsável.",
  },
  {
    n: "02",
    title: "Você orça, agenda e cobra",
    body: "Proposta, horário e pagamento ficam no prontuário da pessoa — não em prints.",
  },
  {
    n: "03",
    title: "O sistema lembra o retorno",
    body: "Se o cliente some, a recuperação aparece. Se o orçamento esfria, o follow-up dispara.",
  },
];

const PLANS = [
  {
    name: "Demonstração",
    price: "Grátis",
    hint: "Studio Bella, dados reais de operação",
    items: ["Inbox mock", "Funil completo", "Automações visíveis", "Simulador ao vivo"],
    cta: "Entrar na demo",
    href: "/login",
    featured: false,
  },
  {
    name: "Essencial",
    price: "R$ 189",
    hint: "por mês, 1 unidade",
    items: ["Até 3 usuários", "WhatsApp Cloud API", "Orçamentos e agenda", "Financeiro básico"],
    cta: "Falar com vendas",
    href: "/login",
    featured: true,
  },
  {
    name: "Operação",
    price: "R$ 349",
    hint: "por mês, equipe completa",
    items: ["Usuários ilimitados", "Automações avançadas", "Relatórios do dono", "Vários profissionais"],
    cta: "Falar com vendas",
    href: "/login",
    featured: false,
  },
];

const FAQ = [
  {
    q: "Isso substitui o WhatsApp Business?",
    a: "Não. O Atendia organiza o que já acontece no WhatsApp: funil, orçamento, agenda, cobrança e retorno. A conversa continua no mesmo número.",
  },
  {
    q: "Serve só para salão?",
    a: "A demo é um salão — Studio Bella, em Campinas — mas o fluxo é o de qualquer PME que vende e atende pelo WhatsApp: clínica, oficina, estúdio, assistência.",
  },
  {
    q: "Os dados da demo são de verdade?",
    a: "São fictícios, mas consistentes. Clientes, leads, orçamentos e atrasos se cruzam. Você pode arrastar cards, mudar status e usar o simulador.",
  },
  {
    q: "Precisa de cartão para testar?",
    a: "Não. Entre com um clique, percorra o roteiro e saia. A conta da Marina já vem preenchida.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-full bg-bg text-ink">
      <header className="sticky top-0 z-30 border-b border-line/70 bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-serif text-2xl tracking-tight">
            Atendia
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
            <a href="#produto">Produto</a>
            <a href="#como">Como funciona</a>
            <a href="#precos">Preços</a>
            <Link href="/login">Entrar</Link>
          </nav>
          <Button href="/login">Ver demonstração</Button>
        </div>
      </header>

      <section className="mesh grain relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="rise">
            <p className="text-xs uppercase tracking-[0.22em] text-brand-2">
              Hub comercial para quem vive no WhatsApp
            </p>
            <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl">
              Pare de perder dinheiro por esquecer o cliente.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              Leads, orçamentos, agenda, cobrança e pós-venda no mesmo lugar.
              O Atendia transforma conversa solta em operação que fecha.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/login" size="lg">
                Entrar no Studio Bella
                <ArrowRight size={16} />
              </Button>
              <Button href="#produto" size="lg" variant="secondary">
                Ver o produto
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted">
              Demo ao vivo · ivan.p@example.net · senha demo1234
            </p>
          </div>
          <ProductPreview />
        </div>
      </section>

      <section className="border-y border-line bg-surface/70">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 sm:grid-cols-3">
          {[
            ["Salões e estética", "Como o Studio Bella"],
            ["Clínicas e estúdios", "Agenda + retorno"],
            ["Oficinas e serviços", "Orçamento + OS + Pix"],
          ].map(([title, hint]) => (
            <div key={title}>
              <p className="font-medium">{title}</p>
              <p className="text-sm text-muted">{hint}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="produto" className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">O que o dono enxerga</p>
        <h2 className="mt-3 max-w-2xl font-serif text-4xl tracking-tight">
          Um único lugar para o que hoje está espalhado em conversas, cadernos e a cabeça da equipe.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-3xl border border-line bg-surface p-5">
              <f.icon className="text-brand" size={20} />
              <h3 className="mt-4 font-medium">{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="como" className="bg-sidebar text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-xs uppercase tracking-[0.22em] text-white/50">Como funciona</p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight">Três movimentos. O resto o sistema segura.</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="font-serif text-3xl text-white/35">{s.n}</p>
                <h3 className="mt-4 text-lg">{s.title}</h3>
                <p className="mt-2 text-sm text-white/65">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-copper">Caso da demo</p>
            <h2 className="mt-3 font-serif text-4xl tracking-tight">Studio Bella, Campinas</h2>
            <p className="mt-4 text-muted">
              Salão com quatro pessoas na operação. A Marina (dona) entra e vê leads
              parados, orçamentos sem resposta, agenda do dia e clientes que sumiram.
              Nada é mock de tela: cada número abre uma lista de verdade.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              {[
                "30 clientes com histórico e tags",
                "Funil com novos, atendimento, orçamento e negociação",
                "Inbox com conversas e templates prontos",
                "Automações de follow-up, lembrete e retorno",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <Check size={16} className="mt-0.5 text-brand" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[2rem] border border-line bg-surface p-6 shadow-[0_20px_50px_rgba(20,18,16,0.06)]">
            <p className="text-sm text-muted">O que a Marina vê hoje</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ["Leads novos", "4"],
                ["Orçamentos abertos", "vários"],
                ["Agenda hoje", "cheia"],
                ["Clientes parados", "lista pronta"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl bg-bg p-4">
                  <p className="text-xs text-muted">{k}</p>
                  <p className="mt-1 font-serif text-2xl">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="precos" className="border-t border-line bg-surface/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Preços</p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight">Comece pela demo. Fale de plano depois.</h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-[2rem] border p-6 ${
                  plan.featured
                    ? "border-brand bg-sidebar text-white"
                    : "border-line bg-surface"
                }`}
              >
                <p className="text-sm">{plan.name}</p>
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
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="font-serif text-4xl tracking-tight">Perguntas frequentes</h2>
        <div className="mt-8 space-y-4">
          {FAQ.map((item) => (
            <div key={item.q} className="rounded-3xl border border-line bg-surface p-5">
              <p className="font-medium">{item.q}</p>
              <p className="mt-2 text-sm text-muted">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-sidebar px-8 py-14 text-white mesh">
          <p className="font-serif text-4xl tracking-tight">Pronto para ver a operação inteira?</p>
          <p className="mt-3 max-w-xl text-white/70">
            Entre como Marina Costa, dona do Studio Bella. Em dois minutos você
            entende o funil, o caixa e quem está parado.
          </p>
          <Button href="/login" size="lg" variant="secondary" className="mt-8">
            Abrir a demonstração
          </Button>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Atendia · hub comercial para PMEs no WhatsApp</p>
          <p>Demo Studio Bella · Campinas/SP</p>
        </div>
      </footer>
    </div>
  );
}
