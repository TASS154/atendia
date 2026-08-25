"use client";

import { useState, useTransition } from "react";
import { sendQuoteWhatsApp, updateQuoteStatus } from "@/actions/quotes";
import { formatBRL, formatDate } from "@/lib/format";
import { labelOf, QUOTE_STATUSES } from "@/lib/constants";
import { Badge, Card, PageHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";

export function QuoteDetail({
  quote,
}: {
  quote: {
    id: string;
    number: string;
    status: string;
    notes: string | null;
    validUntil: string | null;
    paymentTerms: string | null;
    subtotal: number;
    discount: number;
    total: number;
    customer: { name: string } | null;
    lead: { name: string } | null;
    items: { id: string; name: string; quantity: number; unitPrice: number; total: number }[];
  };
}) {
  const [pending, start] = useTransition();
  const [status, setStatus] = useState(quote.status);
  const [wa, setWa] = useState<string | null>(null);

  return (
    <div className="max-w-3xl">
      <PageHeader
        title={quote.number}
        subtitle={quote.customer?.name ?? quote.lead?.name ?? "Sem cliente"}
        actions={
          <Button
            disabled={pending}
            onClick={() =>
              start(async () => {
                const res = await sendQuoteWhatsApp(quote.id);
                setWa(res.waUrl);
                if (res.waUrl) window.open(res.waUrl, "_blank");
              })
            }
          >
            Enviar pelo WhatsApp
          </Button>
        }
      />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Badge tone={status === "APPROVED" ? "ok" : "warn"}>
          {labelOf(QUOTE_STATUSES, status)}
        </Badge>
        <Select
          value={status}
          onChange={(e) => {
            const value = e.target.value;
            setStatus(value);
            start(async () => { await updateQuoteStatus(quote.id, value); });
          }}
          className="max-w-56"
        >
          {QUOTE_STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </Select>
      </div>
      <Card className="p-5">
        {quote.items.map((i) => (
          <div key={i.id} className="flex justify-between border-b border-line py-2 text-sm">
            <span>
              {i.quantity}× {i.name}
            </span>
            <span>{formatBRL(i.total)}</span>
          </div>
        ))}
        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatBRL(quote.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Desconto</span>
            <span>{formatBRL(quote.discount)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatBRL(quote.total)}</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted">Validade: {formatDate(quote.validUntil)}</p>
        <p className="text-sm text-muted">Pagamento: {quote.paymentTerms ?? "—"}</p>
        {quote.notes ? <p className="mt-3 text-sm">{quote.notes}</p> : null}
        {wa ? (
          <p className="mt-3 text-xs text-brand">
            Mensagem registrada no inbox. O WhatsApp Web também foi aberto com o texto pronto.
          </p>
        ) : null}
      </Card>
    </div>
  );
}
