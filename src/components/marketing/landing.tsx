import Image from "next/image";
import Link from "next/link";
import { photos } from "@/lib/photos";
import { Button } from "@/components/ui/button";
import { EditorialPhoto } from "./editorial-photo";
import { Fade } from "./fade";
import { MarketingFrame } from "./frame";
import { ProductPreview } from "./product-preview";

const DAY = [
  {
    hour: "08:12",
    title: "O Zap chega antes da primeira cliente",
    body: "Rita manda áudio: luzes, Instagram, “vocês têm horário amanhã?”. Sem o Atendia, isso mora no celular da recepção até alguém lembrar.",
    href: "/login",
    cta: "Ver o inbox da Marina",
  },
  {
    hour: "08:14",
    title: "A conversa vira um card, com dono",
    body: "O lead entra no funil com valor estimado. Não depende de print no grupo da equipe nem de caderno na gaveta.",
    href: "/login",
    cta: "Abrir o funil",
  },
  {
    hour: "11:40",
    title: "O orçamento sai com validade e follow-up",
    body: "Proposta numerada, itens, Pix. Se Rita não responder, o sistema lembra — a Marina só confirma o horário.",
    href: "/login",
    cta: "Ver um orçamento",
  },
  {
    hour: "Segunda que vem",
    title: "Quem não voltou aparece numa lista",
    body: "Trinta dias sem retorno e a cliente está pronta para uma mensagem. Pós-venda deixa de ser memória da dona.",
    href: "/login",
    cta: "Lista de recuperação",
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
    <MarketingFrame>
      <section className="relative min-h-[88vh] overflow-hidden bg-sidebar text-white">
        <Image
          src={photos.salonDawn.src}
          alt={photos.salonDawn.alt}
          fill
          priority
          sizes="100vw"
          className="photo-treat object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-[#1a1410]/88 via-[#1a1410]/55 to-[#1a1410]/20"
        />
        <div className="grain absolute inset-0" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-6 pb-14 pt-28">
          <Fade>
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/70">
              Studio Bella · Campinas · uma manhã qualquer
            </p>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-[1.02] tracking-tight sm:text-7xl">
              O cliente já falou no Zap.
              <span className="italic text-white/80"> Quem segura a conversa?</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
              Leads, orçamentos, agenda, cobrança e retorno — no mesmo lugar.
              O Atendia transforma conversa solta em operação que fecha.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="/login" size="lg" variant="secondary">
                Entrar como Marina
              </Button>
              <Link href="#manha" className="ink-link text-sm text-white/80">
                Acompanhar a manhã do salão
              </Link>
            </div>
            <p className="mt-5 text-[11px] tracking-wide text-white/50">
              Demo ao vivo · sem cartão · ivan.p@example.net
            </p>
          </Fade>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 md:grid-cols-3">
          {[
            ["Uma inbox", "no lugar de cinco conversas soltas no celular"],
            ["Três movimentos", "lead, proposta, retorno — o sistema segura o resto"],
            ["Doze minutos", "para o dono entender o funil na primeira visita"],
          ].map(([stat, hint]) => (
            <div key={stat} className="md:border-l md:border-line md:pl-8 first:md:border-l-0 first:md:pl-0">
              <p className="font-serif text-3xl tracking-tight">{stat}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{hint}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="manha" className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-[11px] uppercase tracking-[0.22em] text-copper">Um dia no salão</p>
        <h2 className="mt-3 max-w-2xl font-serif text-4xl tracking-tight sm:text-5xl">
          Não é um tour de features. É o caminho que o dinheiro faz — ou deixa de fazer.
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          Siga a ordem em que a Marina trabalha. Cada passo da demo abre o mesmo
          registro que ela veria numa terça de verdade.
        </p>

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <EditorialPhoto photo={photos.cutting} imgClassName="aspect-[3/4] object-cover" />
          <ol className="space-y-0">
            {DAY.map((beat, i) => (
              <li key={beat.hour} className="border-t border-line py-7 first:border-t-0 first:pt-0">
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
                  {String(i + 1).padStart(2, "0")} · {beat.hour}
                </p>
                <h3 className="mt-2 font-serif text-2xl tracking-tight">{beat.title}</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{beat.body}</p>
                <Link href={beat.href} className="ink-link mt-4 inline-block text-sm text-brand-2">
                  {beat.cta} →
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="produto" className="border-y border-line bg-surface/70">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted">O que ela vê</p>
            <h2 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">
              A tela da manhã, não um dashboard de consultoria.
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Alertas primeiro, agenda depois, números por último. A demo já vem
              com Rita no inbox, orçamentos parados e quem sumiu há 30 dias.
              Clique. Nada é mock de vitrine.
            </p>
            <Button href="/login" className="mt-8">
              Abrir a operação
            </Button>
          </div>
          <ProductPreview />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-copper">Caso da demo</p>
            <h2 className="mt-3 font-serif text-5xl tracking-tight">Studio Bella</h2>
            <p className="mt-4 max-w-lg leading-relaxed text-muted">
              Quatro pessoas na operação. Instagram trazendo lead o dia inteiro.
              A Marina perdia orçamento de luzes porque a conversa ficava no
              celular da recepção. Agora o lead tem dono, o orçamento tem
              follow-up, e quem some entra na lista.
            </p>
          </div>
          <p className="font-serif text-xl italic leading-relaxed text-ink/80">
            “Antes eu descobria orçamento parado quando a cliente já tinha ido em
            outro salão.”
            <span className="mt-3 block font-sans text-sm not-italic tracking-wide text-muted">
              — Marina Costa, dona
            </span>
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <EditorialPhoto photo={photos.stylist} imgClassName="aspect-[4/5] object-cover" />
          <EditorialPhoto photo={photos.chairs} imgClassName="aspect-[4/5] object-cover" />
          <EditorialPhoto photo={photos.wash} imgClassName="aspect-[4/5] object-cover" />
        </div>
        <Link href="/casos" className="ink-link mt-8 inline-block text-sm">
          Clínica e oficina usam o mesmo fluxo →
        </Link>
      </section>

      <section id="precos" className="border-y border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Preços</p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight">Comece pela demo. Fale de plano depois.</h2>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-t border-line text-left text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-[0.16em] text-muted">
                  <th className="py-4 pr-4 font-normal">Plano</th>
                  <th className="py-4 pr-4 font-normal">Para quem</th>
                  <th className="py-4 pr-4 font-normal">Valor</th>
                  <th className="py-4 font-normal" />
                </tr>
              </thead>
              <tbody>
                {[
                  ["Demonstração", "Studio Bella, operação completa", "Grátis", "/login", "Entrar"],
                  ["Essencial", "1 unidade, até 3 usuários", "R$ 189 / mês", "/contato", "Falar com vendas"],
                  ["Operação", "Equipe e vários profissionais", "R$ 349 / mês", "/contato", "Falar com vendas"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-line">
                    <td className="py-5 pr-4 font-medium">{row[0]}</td>
                    <td className="py-5 pr-4 text-muted">{row[1]}</td>
                    <td className="py-5 pr-4 font-serif text-xl">{row[2]}</td>
                    <td className="py-5 text-right">
                      <Link href={row[3]} className="ink-link text-brand-2">
                        {row[4]}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="font-serif text-4xl tracking-tight">Perguntas que o dono faz</h2>
        <div className="mt-8">
          {FAQ.map((item) => (
            <div key={item.q} className="border-t border-line py-6">
              <p className="font-medium">{item.q}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-6 pb-20">
          <div className="relative min-h-[22rem] overflow-hidden">
            <Image
              src={photos.desk.src}
              alt={photos.desk.alt}
              fill
              sizes="100vw"
              className="photo-treat object-cover"
            />
            <div className="absolute inset-0 bg-[#1a1410]/70" />
            <div className="relative flex min-h-[22rem] flex-col justify-end px-8 py-12 text-white">
              <p className="font-serif text-4xl tracking-tight sm:text-5xl">
                Pronto para a manhã da Marina?
              </p>
              <p className="mt-3 max-w-lg text-white/75">
                Entre, siga o roteiro, arraste um lead. Em dois minutos você
                entende o funil, o caixa e quem está parado.
              </p>
              <div className="mt-8">
                <Button href="/login" size="lg" variant="secondary">
                  Abrir a demonstração
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingFrame>
  );
}
