import type { Metadata } from "next";
import Image from "next/image";
import { photos } from "@/lib/photos";
import { MarketingFrame } from "@/components/marketing/frame";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "O Atendia nasceu para o dono de PME que vende pelo WhatsApp e perde dinheiro no follow-up.",
};

export default function AboutPage() {
  return (
    <MarketingFrame>
      <main>
        <div className="relative h-[46vh] min-h-[22rem] overflow-hidden">
          <Image
            src={photos.salonDawn.src}
            alt={photos.salonDawn.alt}
            fill
            priority
            sizes="100vw"
            className="photo-treat object-cover"
          />
          <div className="absolute inset-0 bg-[#1a1410]/45" />
        </div>
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Sobre o Atendia</p>
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
          <dl className="mt-12 grid gap-8 border-t border-line pt-10 sm:grid-cols-2">
            {[
              ["Para quem", "Salão, clínica, oficina, estúdio, assistência — qualquer operação que fecha pelo WhatsApp."],
              ["O que não é", "Não é um megasistema de corporação. É o mínimo que falta entre o celular e o caixa."],
              ["Como começa", "Pela demo do Studio Bella. Sem cartão, com dados consistentes, para você mexer de verdade."],
              ["O que vem depois", "WhatsApp Cloud API no número da empresa, equipe no mesmo funil e relatório do dono."],
            ].map(([title, body]) => (
              <div key={title}>
                <dt className="text-[11px] uppercase tracking-[0.16em] text-copper">{title}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">{body}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-14 flex flex-wrap gap-3">
            <Button href="/login">Abrir a demo</Button>
            <Button href="/contato" variant="secondary">
              Falar com vendas
            </Button>
          </div>
        </div>
      </main>
    </MarketingFrame>
  );
}
