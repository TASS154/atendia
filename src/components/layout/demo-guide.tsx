"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    title: "Comece pelo funil",
    body: "Em Leads, arraste Rita ou Marcos para ver o comercial se mover de verdade.",
    href: "/leads",
    cta: "Abrir leads",
  },
  {
    title: "O WhatsApp deixa de ser conversa solta",
    body: "A inbox já tem histórico, templates e o contexto do cliente ao lado.",
    href: "/whatsapp",
    cta: "Ver inbox",
  },
  {
    title: "Orçamento vira follow-up",
    body: "Abra um orçamento enviado, mude o status e veja o dashboard reagir.",
    href: "/orcamentos",
    cta: "Ver orçamentos",
  },
  {
    title: "Recupere quem parou de voltar",
    body: "A tela Para recuperar lista quem sumiu — e dispara mensagem pronta.",
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
    <div className="fixed bottom-20 left-4 z-40 w-[min(22rem,calc(100vw-2rem))] rounded-3xl border border-line bg-surface p-4 shadow-2xl lg:left-[300px]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
            Roteiro da demo · {step + 1}/{STEPS.length}
          </p>
          <p className="mt-1 font-serif text-xl">{current.title}</p>
        </div>
        <button type="button" onClick={close} aria-label="Fechar roteiro">
          <X size={16} className="text-muted" />
        </button>
      </div>
      <p className="mt-2 text-sm text-muted">{current.body}</p>
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
          {step < STEPS.length - 1 ? (
            <Button size="sm" onClick={() => setStep((s) => s + 1)}>
              Próximo
            </Button>
          ) : (
            <Button size="sm" href={current.href} onClick={close}>
              {current.cta}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
