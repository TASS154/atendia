"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LEAD_STAGES, ORIGINS } from "@/lib/constants";
import { formatBRL, formatPhone, relativeTime } from "@/lib/format";
import { createLead, convertLead, deleteLead, moveLeadStage } from "@/actions/leads";
import { Badge, Card, PageHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";

type Lead = {
  id: string;
  name: string;
  phone: string;
  estimatedValue: number | null;
  origin: string;
  stage: string;
  notes: string | null;
  lastContactAt: string | null;
  owner: { id: string; name: string } | null;
};

export function LeadsBoard({
  leads,
  users,
}: {
  leads: Lead[];
  users: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [selected, setSelected] = useState<Lead | null>(null);
  const grouped = useMemo(() => {
    return LEAD_STAGES.map((stage) => ({
      ...stage,
      items: leads.filter((l) => l.stage === stage.id),
    }));
  }, [leads]);

  return (
    <div>
      <PageHeader
        title="Leads"
        subtitle="Arraste os cards entre as etapas. Converter um lead cria o cliente no CRM."
        actions={
          <Button onClick={() => setOpen(true)}>Novo lead</Button>
        }
      />

      <div className="flex gap-3 overflow-x-auto pb-4">
        {grouped.map((col) => (
          <div
            key={col.id}
            className="w-[17.5rem] shrink-0 rounded-3xl border border-line/70 bg-bg-2/50 p-3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const id = e.dataTransfer.getData("text/lead");
              if (id) start(() => moveLeadStage(id, col.id));
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium">{col.label}</span>
              <Badge>{col.items.length}</Badge>
            </div>
            <div className="space-y-2">
              {col.items.map((lead) => (
                <button
                  key={lead.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/lead", lead.id)}
                  onClick={() => setSelected(lead)}
                  className="w-full rounded-2xl border border-line bg-surface p-3 text-left shadow-sm"
                >
                  <p className="font-medium">{lead.name}</p>
                  <p className="mt-1 text-xs text-muted">{formatPhone(lead.phone)}</p>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="font-medium text-brand">
                      {formatBRL(lead.estimatedValue ?? 0)}
                    </span>
                    <span className="text-muted">{lead.origin}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
                    <span>{lead.owner?.name ?? "Sem responsável"}</span>
                    <span>{relativeTime(lead.lastContactAt)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Novo lead">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            start(async () => {
              await createLead({
                name: String(fd.get("name")),
                phone: String(fd.get("phone")),
                email: String(fd.get("email") || ""),
                origin: String(fd.get("origin")),
                estimatedValue: Number(fd.get("estimatedValue") || 0),
                notes: String(fd.get("notes") || ""),
                ownerId: String(fd.get("ownerId") || ""),
                followUpAt: String(fd.get("followUpAt") || "") || undefined,
              });
              setOpen(false);
            });
          }}
        >
          <Field label="Nome">
            <Input name="name" required />
          </Field>
          <Field label="WhatsApp">
            <Input name="phone" required placeholder="11999999999" />
          </Field>
          <Field label="E-mail">
            <Input name="email" type="email" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Origem">
              <Select name="origin" defaultValue="WhatsApp">
                {ORIGINS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </Select>
            </Field>
            <Field label="Valor estimado">
              <Input name="estimatedValue" type="number" min="0" step="0.01" />
            </Field>
          </div>
          <Field label="Responsável">
            <Select name="ownerId">
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Follow-up">
            <Input name="followUpAt" type="datetime-local" />
          </Field>
          <Field label="Observações">
            <Textarea name="notes" />
          </Field>
          <Button type="submit" disabled={pending} className="w-full">
            Salvar lead
          </Button>
        </form>
      </Modal>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.name ?? "Lead"}
      >
        {selected ? (
          <div className="space-y-4">
            <p className="text-sm text-muted">
              {formatPhone(selected.phone)} · {selected.origin} ·{" "}
              {formatBRL(selected.estimatedValue ?? 0)}
            </p>
            {selected.notes ? (
              <Card className="p-3 text-sm">{selected.notes}</Card>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button
                disabled={pending || selected.stage === "WON"}
                onClick={() =>
                  start(async () => {
                    const customer = await convertLead(selected.id);
                    router.push(`/clientes/${customer.id}`);
                  })
                }
              >
                Converter em cliente
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push(`/orcamentos?leadId=${selected.id}`)}
              >
                Criar orçamento
              </Button>
              <Button
                variant="danger"
                onClick={() =>
                  start(async () => {
                    await deleteLead(selected.id);
                    setSelected(null);
                  })
                }
              >
                Excluir
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
