import type { Metadata } from "next";
import Link from "next/link";
import { photos } from "@/lib/photos";
import { EditorialPhoto } from "@/components/marketing/editorial-photo";
import { MarketingFrame } from "@/components/marketing/frame";
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
    photo: photos.stylist,
    href: "/login",
    cta: "Entrar nessa demo",
  },
  {
    id: "clinica",
    kicker: "Clínica e estúdio",
    title: "Clínica Horizonte · Ribeirão Preto",
    body: "Retorno de procedimento era papel na recepção. Paciente sumia, a agenda furava e ninguém cobrava a sessão seguinte. O mesmo fluxo: lead de indicação, orçamento de pacote, horário confirmado e lista de quem parou de voltar.",
    photo: photos.desk,
    href: "/#manha",
    cta: "Ver o fluxo",
  },
  {
    id: "oficina",
    kicker: "Oficina e serviços",
    title: "Oficina Nunes · Jundiaí",
    body: "Orçamento de funilaria saía no WhatsApp e morria. Sem OS, sem status, sem Pix combinado. No Atendia o orçamento tem número, a ordem de serviço acompanha a execução e o financeiro mostra o que ainda não entrou.",
    photo: photos.hands,
    href: "/contato",
    cta: "Falar com vendas",
  },
];

export default function CasesPage() {
  return (
    <MarketingFrame>
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Casos</p>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl tracking-tight">
          O fluxo é o mesmo. Muda só o tipo de serviço.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          A demo ao vivo é um salão. Os outros dois casos mostram como clínica e
          oficina usam o mesmo hub — lead, proposta, agenda, caixa e retorno.
        </p>
        <div className="mt-16 space-y-20">
          {CASES.map((item, i) => (
            <article
              key={item.id}
              id={item.id}
              className="scroll-mt-24 grid items-start gap-10 lg:grid-cols-2"
            >
              <div className={i % 2 ? "lg:order-2" : ""}>
                <EditorialPhoto photo={item.photo} imgClassName="aspect-[4/5] object-cover" />
              </div>
              <div className={i % 2 ? "lg:order-1" : ""}>
                <p className="text-[11px] uppercase tracking-[0.18em] text-copper">{item.kicker}</p>
                <h2 className="mt-2 font-serif text-4xl tracking-tight">{item.title}</h2>
                <p className="mt-4 leading-relaxed text-muted">{item.body}</p>
                <Button href={item.href} className="mt-8">
                  {item.cta}
                </Button>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-16 text-sm text-muted">
          Ainda não é o seu segmento?{" "}
          <Link href="/contato" className="ink-link text-ink">
            Conte como vocês vendem hoje
          </Link>
          .
        </p>
      </main>
    </MarketingFrame>
  );
}
