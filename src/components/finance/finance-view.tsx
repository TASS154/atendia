"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { markPaymentPaid, registerPayment } from "@/actions/operations";
import { formatBRL, formatDate } from "@/lib/format";
import { labelOf, PAYMENT_METHODS, PAYMENT_STATUSES } from "@/lib/constants";
import { Badge, Card, PageHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";

type Payment = {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: string;
  method: string | null;
  customer: { name: string };
};

export function FinanceView({
  payments,
  customers,
  from,
  to,
}: {
  payments: Payment[];
  customers: { id: string; name: string }[];
  from: string;
  to: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const stats = useMemo(() => {
    const received = payments.filter((p) => p.status === "PAID").reduce((a, p) => a + p.amount, 0);
    const pendingAmt = payments.filter((p) => p.status === "PENDING").reduce((a, p) => a + p.amount, 0);
    const overdue = payments.filter((p) => p.status === "OVERDUE").reduce((a, p) => a + p.amount, 0);
    const paidCount = payments.filter((p) => p.status === "PAID").length;
    return {
      month: received + pendingAmt + overdue,
      received,
      pending: pendingAmt,
      overdue,
      ticket: paidCount ? received / paidCount : 0,
    };
  }, [payments]);

  return (
    <div>
      <PageHeader
        title="Financeiro operacional"
        subtitle="O essencial para não esquecer cobrança — sem virar um ERP."
        actions={<Button onClick={() => setOpen(true)}>Nova conta</Button>}
      />
      <form
        className="mb-4 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          router.push(`/financeiro?from=${fd.get("from")}&to=${fd.get("to")}`);
        }}
      >
        <Input type="date" name="from" defaultValue={from} className="w-auto" />
        <Input type="date" name="to" defaultValue={to} className="w-auto" />
        <Button type="submit" variant="secondary">
          Filtrar período
        </Button>
      </form>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Receita do mês", formatBRL(stats.month)],
          ["Recebida", formatBRL(stats.received)],
          ["Pendente", formatBRL(stats.pending)],
          ["Atrasada", formatBRL(stats.overdue)],
          ["Ticket médio", formatBRL(stats.ticket)],
        ].map(([l, v]) => (
          <Card key={l} className="p-4">
            <p className="text-xs text-muted">{l}</p>
            <p className="mt-2 text-xl font-semibold">{v}</p>
          </Card>
        ))}
      </div>
      <div className="mt-6 space-y-3">
        {payments.map((p) => (
          <div
            key={p.id}
            className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">{p.customer.name}</p>
              <p className="text-sm text-muted">
                {p.description} · venc. {formatDate(p.dueDate)} · {p.method ?? "—"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold">{formatBRL(p.amount)}</span>
              <Badge tone={p.status === "PAID" ? "ok" : p.status === "OVERDUE" ? "danger" : "warn"}>
                {labelOf(PAYMENT_STATUSES, p.status)}
              </Badge>
              {p.status !== "PAID" && p.status !== "CANCELLED" ? (
                <Button size="sm" disabled={pending} onClick={() => start(() => markPaymentPaid(p.id))}>
                  Dar baixa
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Conta a receber">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            start(async () => {
              await registerPayment({
                customerId: String(fd.get("customerId")),
                description: String(fd.get("description")),
                amount: Number(fd.get("amount")),
                dueDate: String(fd.get("dueDate")),
                method: String(fd.get("method")),
                markPaid: fd.get("markPaid") === "on",
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
          <Field label="Descrição">
            <Input name="description" required />
          </Field>
          <Field label="Valor">
            <Input name="amount" type="number" step="0.01" required />
          </Field>
          <Field label="Vencimento">
            <Input name="dueDate" type="date" required />
          </Field>
          <Field label="Forma">
            <Select name="method" defaultValue="PIX">
              {PAYMENT_METHODS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </Select>
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="markPaid" /> Já pago
          </label>
          <Button type="submit" disabled={pending} className="w-full">
            Salvar
          </Button>
        </form>
      </Modal>
    </div>
  );
}
