"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    title: "Olhe o que pede atenção",
    body: "A visão geral já lista orçamento parado, Zap não lido e quem sumiu. Comece por um item numerado.",
    href: "/dashboard",
    cta: "Estou na visão geral",
  },
  {
    title: "A Rita acabou de chegar no Zap",
    body: "Abra o WhatsApp. A conversa já tem contexto da cliente ao lado — não é um print solto.",
    href: "/whatsapp",
    cta: "Abrir o inbox",
  },
  {
    title: "O lead precisa de dono",
    body: "Em Leads, arraste Rita ou Marcos. O funil se move de verdade, com valor estimado.",
    href: "/leads",
    cta: "Abrir o funil",
  },
  {
    title: "Orçamento vira follow-up",
    body: "Abra um orçamento enviado, mude o status. O dashboard reage. Ninguém cobra de memória.",
    href: "/orcamentos",
    cta: "Ver orçamentos",
  },
  {
    title: "Quem parou de voltar",
    body: "A lista Para recuperar mostra quem sumiu há 30 dias — e dispara mensagem pronta.",
    href: "/recuperacao",
    cta: "Recuperar clientes",
  },
];

export function DemoGuide() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const dismissed = localStorage.getItem("atendia-guide");
    if (!dismissed) setOpen(true);
  }, []);

  if (!open) return null;
  const current = STEPS[step];

  function close() {
    localStorage.setItem("atendia-guide", "1");
    setOpen(false);
  }

  return (
    <aside className="fixed bottom-6 right-4 z-40 w-[min(22rem,calc(100vw-2rem))] border border-line bg-surface p-5 shadow-[0_16px_40px_rgba(36,28,22,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-copper">
          Roteiro · {step + 1} de {STEPS.length}
        </p>
        <button type="button" onClick={close} className="text-xs text-muted hover:text-ink">
          Fechar
        </button>
      </div>
      <p className="mt-2 font-serif text-2xl tracking-tight">{current.title}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{current.body}</p>
      <div className="mt-4 flex gap-1">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={`h-px flex-1 ${i <= step ? "bg-brand" : "bg-line"}`}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-2">
        <Button size="sm" variant="ghost" onClick={close}>
          Pular
        </Button>
        <div className="flex gap-2">
          {step > 0 ? (
            <Button size="sm" variant="secondary" onClick={() => setStep((s) => s - 1)}>
              Voltar
            </Button>
          ) : null}
          <Button size="sm" href={current.href} onClick={step === STEPS.length - 1 ? close : undefined}>
            {current.cta}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button size="sm" variant="secondary" onClick={() => setStep((s) => s + 1)}>
              Próximo
            </Button>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
