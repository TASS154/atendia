"use client";

import { useState, useTransition } from "react";
import { createWorkOrder, updateWorkOrderStatus } from "@/actions/operations";
import { formatBRL, formatDate } from "@/lib/format";
import { labelOf, WORK_ORDER_STATUSES } from "@/lib/constants";
import { Badge, PageHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";

type Order = {
  id: string;
  number: string;
  description: string | null;
  materials: string | null;
  value: number;
  status: string;
  date: string;
  customer: { name: string };
  professional: { name: string } | null;
};

export function WorkOrdersView({
  orders,
  customers,
  services,
  users,
}: {
  orders: Order[];
  customers: { id: string; name: string }[];
  services: { id: string; name: string; price: number }[];
  users: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  return (
    <div>
      <PageHeader
        title="Ordens de serviço"
        subtitle="Solicitação → orçamento → aprovação → execução → conclusão → pagamento."
        actions={<Button onClick={() => setOpen(true)}>Nova OS</Button>}
      />
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="rounded-2xl border border-line bg-surface p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">
                  {o.number} · {o.customer.name}
                </p>
                <p className="text-sm text-muted">
                  {o.description ?? "Sem descrição"} · {formatDate(o.date)}
                </p>
                {o.materials ? <p className="text-xs text-muted">Materiais: {o.materials}</p> : null}
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatBRL(o.value)}</p>
                <Badge>{labelOf(WORK_ORDER_STATUSES, o.status)}</Badge>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {WORK_ORDER_STATUSES.map((s) => (
                <Button
                  key={s.id}
                  size="sm"
                  variant={o.status === s.id ? "primary" : "secondary"}
                  disabled={pending}
                  onClick={() => start(() => updateWorkOrderStatus(o.id, s.id))}
                >
                  {s.label}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Nova ordem de serviço">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            start(async () => {
              await createWorkOrder({
                customerId: String(fd.get("customerId")),
                serviceId: String(fd.get("serviceId") || "") || undefined,
                professionalId: String(fd.get("professionalId") || "") || undefined,
                description: String(fd.get("description") || ""),
                materials: String(fd.get("materials") || ""),
                value: Number(fd.get("value")),
                notes: String(fd.get("notes") || ""),
              });
              setOpen(false);
            });
          }}
        >
          <Field label="Cliente">
            <Select name="customerId" required>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Serviço">
            <Select name="serviceId">
              <option value="">—</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Responsável">
            <Select name="professionalId">
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Valor">
            <Input name="value" type="number" step="0.01" required />
          </Field>
          <Field label="Descrição">
            <Textarea name="description" />
          </Field>
          <Field label="Materiais">
            <Input name="materials" />
          </Field>
          <Button type="submit" disabled={pending} className="w-full">
            Abrir OS
          </Button>
        </form>
      </Modal>
    </div>
  );
}
