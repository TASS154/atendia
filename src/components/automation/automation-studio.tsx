"use client";

import { useState, useTransition } from "react";
import { saveAutomation, toggleAutomation, runPendingAutomations } from "@/actions/comms";
import { AUTOMATION_TRIGGERS, labelOf } from "@/lib/constants";
import { Badge, Card, PageHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";

type Step = { type: string; config: Record<string, unknown> };

const STEP_TYPES = [
  { id: "WAIT", label: "Esperar" },
  { id: "CONDITION", label: "Condição" },
  { id: "ACTION", label: "Ação" },
];

export function AutomationStudio({
  automations,
}: {
  automations: {
    id: string;
    name: string;
    description: string | null;
    trigger: string;
    active: boolean;
    steps: { id: string; type: string; config: string; order: number }[];
    runs: { id: string; status: string }[];
  }[];
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [steps, setSteps] = useState<Step[]>([
    { type: "WAIT", config: { days: 2 } },
    { type: "CONDITION", config: { kind: "quote_unanswered" } },
    { type: "ACTION", config: { action: "SEND_WHATSAPP", message: "Olá, {{cliente}}! Tudo bem?" } },
  ]);

  return (
    <div>
      <PageHeader
        title="Automações"
        subtitle="Gatilho, espera, condição e WhatsApp. As regras ficam no banco e o simulador pode avançá-las."
        actions={
          <>
            <Button variant="secondary" disabled={pending} onClick={() => start(() => runPendingAutomations())}>
              Processar agora
            </Button>
            <Button onClick={() => setOpen(true)}>Nova automação</Button>
          </>
        }
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {automations.map((a) => (
          <Card key={a.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{a.name}</p>
                <p className="text-sm text-muted">{a.description}</p>
                <p className="mt-1 text-xs text-muted">
                  Gatilho: {labelOf(AUTOMATION_TRIGGERS, a.trigger)}
                </p>
              </div>
              <button
                className="text-xs text-brand"
                onClick={() => start(() => toggleAutomation(a.id, !a.active))}
              >
                {a.active ? "Desativar" : "Ativar"}
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {a.steps.map((s, i) => {
                const cfg = JSON.parse(s.config) as Record<string, unknown>;
                return (
                  <div key={s.id} className="rounded-xl bg-bg px-3 py-2 text-sm">
                    <span className="text-xs uppercase tracking-wide text-muted">{s.type}</span>
                    <p>
                      {s.type === "WAIT" && `Esperar ${cfg.days ?? cfg.hours} ${cfg.days ? "dias" : "horas"}`}
                      {s.type === "CONDITION" && `Se ${String(cfg.kind)}`}
                      {s.type === "ACTION" && String(cfg.message ?? cfg.title ?? cfg.action)}
                    </p>
                    {i < a.steps.length - 1 ? <div className="mt-2 text-center text-xs text-muted">↓</div> : null}
                  </div>
                );
              })}
            </div>
            <div className="mt-3">
              <Badge tone={a.active ? "ok" : "neutral"}>{a.active ? "Ativa" : "Pausada"}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Construtor de automação" wide>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            start(async () => {
              await saveAutomation({
                name: String(fd.get("name")),
                description: String(fd.get("description") || ""),
                trigger: String(fd.get("trigger")),
                active: true,
                steps,
              });
              setOpen(false);
            });
          }}
        >
          <Field label="Nome">
            <Input name="name" required placeholder="Follow-up de orçamento" />
          </Field>
          <Field label="Descrição">
            <Textarea name="description" />
          </Field>
          <Field label="Gatilho">
            <Select name="trigger" defaultValue="QUOTE_SENT">
              {AUTOMATION_TRIGGERS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </Select>
          </Field>
          <div className="space-y-2">
            {steps.map((step, idx) => (
              <div key={idx} className="rounded-2xl border border-line p-3">
                <p className="mb-2 text-xs uppercase text-muted">Passo {idx + 1}</p>
                <Select
                  value={step.type}
                  onChange={(e) => {
                    const next = [...steps];
                    next[idx] = { type: e.target.value, config: next[idx].config };
                    setSteps(next);
                  }}
                >
                  {STEP_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </Select>
                {step.type === "WAIT" ? (
                  <Input
                    className="mt-2"
                    type="number"
                    placeholder="Dias"
                    value={Number(step.config.days ?? 1)}
                    onChange={(e) => {
                      const next = [...steps];
                      next[idx] = { ...step, config: { days: Number(e.target.value) } };
                      setSteps(next);
                    }}
                  />
                ) : null}
                {step.type === "CONDITION" ? (
                  <Select
                    className="mt-2"
                    value={String(step.config.kind ?? "always")}
                    onChange={(e) => {
                      const next = [...steps];
                      next[idx] = { ...step, config: { kind: e.target.value } };
                      setSteps(next);
                    }}
                  >
                    <option value="always">Sempre</option>
                    <option value="quote_unanswered">Orçamento sem resposta</option>
                    <option value="customer_inactive">Cliente inativo</option>
                  </Select>
                ) : null}
                {step.type === "ACTION" ? (
                  <Textarea
                    className="mt-2"
                    value={String(step.config.message ?? "")}
                    onChange={(e) => {
                      const next = [...steps];
                      next[idx] = {
                        ...step,
                        config: { action: "SEND_WHATSAPP", message: e.target.value },
                      };
                      setSteps(next);
                    }}
                  />
                ) : null}
              </div>
            ))}
            <Button
              variant="secondary"
              onClick={() => setSteps([...steps, { type: "WAIT", config: { days: 1 } }])}
            >
              Adicionar passo
            </Button>
          </div>
          <Button type="submit" disabled={pending} className="w-full">
            Salvar automação
          </Button>
        </form>
      </Modal>
    </div>
  );
}
