import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "O Atendia nasceu para o dono de PME que vende pelo WhatsApp e perde dinheiro no follow-up.",
};

export default function AboutPage() {
  return (
    <div className="min-h-full bg-bg">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Sobre o Atendia</p>
        <h1 className="mt-3 font-serif text-5xl tracking-tight">
          Feito para quem atende o dia inteiro e só vê o caixa no domingo.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          A maior parte das PMEs brasileiras já vende pelo WhatsApp. O problema não é
          falta de cliente — é o orçamento que ninguém cobrou, o horário que não foi
          confirmado e a pessoa que sumiu há 40 dias.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          O Atendia não tenta substituir o Zap. Ele vira o hub ao redor da conversa:
          funil, proposta, agenda, Pix e retorno. O dono entra e sabe o que precisa
          de atenção hoje.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {[
            ["Para quem", "Salão, clínica, oficina, estúdio, assistência — qualquer operação que fecha pelo WhatsApp."],
            ["O que não é", "Não é um megasistema de corporação. É o mínimo que falta entre o celular e o caixa."],
            ["Como começa", "Pela demo do Studio Bella. Sem cartão, com dados consistentes, para você mexer de verdade."],
            ["O que vem depois", "WhatsApp Cloud API no número da empresa, equipe no mesmo funil e relatório do dono."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-3xl border border-line bg-surface p-5">
              <p className="font-medium">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-[2rem] bg-sidebar px-6 py-10 text-white">
          <p className="font-serif text-3xl tracking-tight">Quer ver isso com a sua operação?</p>
          <p className="mt-3 max-w-lg text-sm text-white/70">
            Entre na demo como Marina ou fale com a gente para um tenant com a cara
            do seu negócio.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/login" variant="secondary">
              Abrir a demo
            </Button>
            <Button href="/contato" variant="ghost" className="text-white hover:bg-white/10">
              Falar com vendas
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
