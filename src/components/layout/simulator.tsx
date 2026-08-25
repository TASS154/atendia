"use client";

import { useState, useTransition } from "react";
import { FlaskConical } from "lucide-react";
import {
  simulateAdvanceAutomations,
  simulateInactiveCustomer,
  simulateIncomingMessage,
  simulateNewAppointment,
  simulateNewLead,
  simulateOverduePayment,
  simulateQuoteApproved,
} from "@/actions/simulator";
import { Button } from "@/components/ui/button";

const ACTIONS = [
  { label: "Simular novo lead", run: simulateNewLead },
  { label: "Simular mensagem recebida", run: simulateIncomingMessage },
  { label: "Simular orçamento aprovado", run: simulateQuoteApproved },
  { label: "Simular cliente sem retorno", run: simulateInactiveCustomer },
  { label: "Simular pagamento atrasado", run: simulateOverduePayment },
  { label: "Simular novo agendamento", run: simulateNewAppointment },
  { label: "Avançar automações", run: simulateAdvanceAutomations },
];

export function SimulatorPanel() {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {open ? (
        <div className="mb-3 w-[min(20rem,calc(100vw-2rem))] rounded-3xl border border-line bg-surface p-4 shadow-xl">
          <div className="mb-1 font-serif text-lg">Simulador</div>
          <p className="mb-3 text-xs text-muted">
            Use estes botões na demonstração comercial. Nada depende de WhatsApp
            real — o modo mock registra tudo no sistema.
          </p>
          <div className="space-y-2">
            {ACTIONS.map((a) => (
              <Button
                key={a.label}
                variant="secondary"
                size="sm"
                className="w-full justify-start"
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    try {
                      await a.run();
                      setMessage("Evento simulado com sucesso.");
                    } catch (e) {
                      setMessage(e instanceof Error ? e.message : "Falha na simulação");
                    }
                  })
                }
              >
                {a.label}
              </Button>
            ))}
          </div>
          {message ? <p className="mt-3 text-xs text-brand">{message}</p> : null}
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-sidebar px-4 py-2.5 text-sm text-white shadow-[0_12px_30px_rgba(11,28,26,0.35)]"
      >
        <FlaskConical size={16} />
        Simulador
      </button>
    </div>
  );
}
