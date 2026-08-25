"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { formatBRL, formatDate, formatDateTime, formatPhone } from "@/lib/format";
import { scheduleCustomerReturn } from "@/actions/customers";
import { sendRecoveryMessage } from "@/actions/comms";
import { Badge, Card, PageHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { labelOf, QUOTE_STATUSES } from "@/lib/constants";

type History = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  createdAt: string;
};

export function CustomerDetail({
  customer,
}: {
  customer: {
    id: string;
    name: string;
    phone: string;
    whatsapp: string | null;
    email: string | null;
    document: string | null;
    address: string | null;
    neighborhood: string | null;
    origin: string | null;
    notes: string | null;
    lastContactAt: string | null;
    lastServiceAt: string | null;
    nextReturnAt: string | null;
    totalSpent: number;
    visitCount: number;
    createdAt: string;
    owner: { name: string } | null;
    tags: { tag: { name: string } }[];
    history: History[];
    quotes: { id: string; number: string; total: number; status: string }[];
    appointments: { id: string; title: string; startsAt: string; status: string }[];
    payments: { id: string; description: string; amount: number; status: string }[];
  };
}) {
  const [pending, start] = useTransition();
  const [returnAt, setReturnAt] = useState("");

  return (
    <div>
      <PageHeader
        title={customer.name}
        subtitle="Prontuário comercial — cada passo do relacionamento fica registrado."
        actions={
          <>
            <Link href={`/orcamentos/novo?customerId=${customer.id}`}>
              <Button>Novo orçamento</Button>
            </Link>
            <Button
              variant="secondary"
              disabled={pending}
              onClick={() => start(async () => { await sendRecoveryMessage(customer.id); })}
            >
              WhatsApp
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="p-5">
          <h2 className="font-medium">Histórico</h2>
          <ol className="mt-5 space-y-4">
            {customer.history.map((h) => (
              <li key={h.id} className="relative border-l border-line pl-4">
                <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-brand" />
                <p className="text-xs text-muted">{formatDate(h.createdAt)}</p>
                <p className="text-sm font-medium">{h.title}</p>
                {h.description ? (
                  <p className="text-sm text-muted">{h.description}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </Card>

        <div className="space-y-4">
          <Card className="p-5 text-sm">
            <p>
              <span className="text-muted">WhatsApp</span>
              <br />
              {formatPhone(customer.whatsapp || customer.phone)}
            </p>
            <p className="mt-3">
              <span className="text-muted">E-mail</span>
              <br />
              {customer.email ?? "—"}
            </p>
            <p className="mt-3">
              <span className="text-muted">CPF/CNPJ</span>
              <br />
              {customer.document ?? "—"}
            </p>
            <p className="mt-3">
              <span className="text-muted">Endereço</span>
              <br />
              {[customer.address, customer.neighborhood].filter(Boolean).join(" · ") || "—"}
            </p>
            <p className="mt-3">
              <span className="text-muted">Origem / responsável</span>
              <br />
              {customer.origin} · {customer.owner?.name ?? "—"}
            </p>
            <p className="mt-3">
              <span className="text-muted">Cadastro</span>
              <br />
              {formatDateTime(customer.createdAt)}
            </p>
            <div className="mt-3 flex flex-wrap gap-1">
              {customer.tags.map((t) => (
                <Badge key={t.tag.name}>{t.tag.name}</Badge>
              ))}
            </div>
            {customer.notes ? (
              <p className="mt-3 rounded-xl bg-bg p-3 text-muted">{customer.notes}</p>
            ) : null}
          </Card>

          <Card className="p-5">
            <p className="text-sm text-muted">Valor gasto</p>
            <p className="text-2xl font-semibold">{formatBRL(customer.totalSpent)}</p>
            <p className="mt-2 text-sm text-muted">{customer.visitCount} atendimentos</p>
            <p className="mt-2 text-sm">Último serviço: {formatDate(customer.lastServiceAt)}</p>
            <p className="text-sm">Próximo retorno: {formatDate(customer.nextReturnAt)}</p>
            <div className="mt-4 space-y-2">
              <Field label="Agendar retorno">
                <Input
                  type="datetime-local"
                  value={returnAt}
                  onChange={(e) => setReturnAt(e.target.value)}
                />
              </Field>
              <Button
                className="w-full"
                disabled={!returnAt || pending}
                onClick={() => start(() => scheduleCustomerReturn(customer.id, returnAt))}
              >
                Agendar retorno
              </Button>
            </div>
          </Card>

          <Card className="p-5 text-sm">
            <p className="font-medium">Orçamentos</p>
            <div className="mt-2 space-y-2">
              {customer.quotes.map((q) => (
                <Link key={q.id} href={`/orcamentos/${q.id}`} className="flex justify-between">
                  <span>{q.number}</span>
                  <span>
                    {formatBRL(q.total)} · {labelOf(QUOTE_STATUSES, q.status)}
                  </span>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
