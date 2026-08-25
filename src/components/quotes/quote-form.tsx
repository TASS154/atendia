"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createQuote, type QuoteItemInput } from "@/actions/quotes";
import { formatBRL } from "@/lib/format";
import { PageHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";

type Service = { id: string; name: string; price: number };
type Person = { id: string; name: string };

export function QuoteForm({
  customers,
  leads,
  services,
  defaultCustomerId,
  defaultLeadId,
}: {
  customers: Person[];
  leads: Person[];
  services: Service[];
  defaultCustomerId?: string;
  defaultLeadId?: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [customerId, setCustomerId] = useState(defaultCustomerId ?? "");
  const [leadId, setLeadId] = useState(defaultLeadId ?? "");
  const [extraDiscount, setExtraDiscount] = useState(0);
  const [items, setItems] = useState<QuoteItemInput[]>([
    { kind: "SERVICE", name: "", quantity: 1, unitPrice: 0, discount: 0 },
  ]);

  const calc = useMemo(() => {
    const subtotal = items.reduce(
      (acc, i) => acc + i.quantity * i.unitPrice - (i.discount ?? 0),
      0,
    );
    return { subtotal, discount: extraDiscount, total: Math.max(0, subtotal - extraDiscount) };
  }, [items, extraDiscount]);

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Novo orçamento"
        subtitle="Serviços, produtos, desconto e validade. O total atualiza sozinho."
      />
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          start(async () => {
            const quote = await createQuote({
              customerId: customerId || undefined,
              leadId: leadId || undefined,
              notes: String(fd.get("notes") || ""),
              validUntil: String(fd.get("validUntil") || "") || undefined,
              paymentTerms: String(fd.get("paymentTerms") || ""),
              discount: extraDiscount,
              items: items.filter((i) => i.name),
            });
            router.push(`/orcamentos/${quote.id}`);
          });
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Cliente">
            <Select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
              <option value="">Nenhum</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Lead">
            <Select value={leadId} onChange={(e) => setLeadId(e.target.value)}>
              <option value="">Nenhum</option>
              {leads.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="grid gap-2 rounded-2xl border border-line p-3 sm:grid-cols-6">
              <Field label="Tipo" className="sm:col-span-1">
                <Select
                  value={item.kind}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = { ...item, kind: e.target.value as "SERVICE" | "PRODUCT" };
                    setItems(next);
                  }}
                >
                  <option value="SERVICE">Serviço</option>
                  <option value="PRODUCT">Produto</option>
                </Select>
              </Field>
              <Field label="Item" className="sm:col-span-2">
                <Select
                  value={item.serviceId ?? ""}
                  onChange={(e) => {
                    const svc = services.find((s) => s.id === e.target.value);
                    const next = [...items];
                    next[idx] = {
                      ...item,
                      serviceId: svc?.id,
                      name: svc?.name ?? item.name,
                      unitPrice: svc?.price ?? item.unitPrice,
                    };
                    setItems(next);
                  }}
                >
                  <option value="">Personalizado</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Qtd">
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = { ...item, quantity: Number(e.target.value) };
                    setItems(next);
                  }}
                />
              </Field>
              <Field label="Preço">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = { ...item, unitPrice: Number(e.target.value) };
                    setItems(next);
                  }}
                />
              </Field>
              <Field label="Desc.">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.discount ?? 0}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = { ...item, discount: Number(e.target.value) };
                    setItems(next);
                  }}
                />
              </Field>
              {!item.serviceId ? (
                <Field label="Nome" className="sm:col-span-6">
                  <Input
                    value={item.name}
                    onChange={(e) => {
                      const next = [...items];
                      next[idx] = { ...item, name: e.target.value };
                      setItems(next);
                    }}
                  />
                </Field>
              ) : null}
            </div>
          ))}
          <Button
            variant="secondary"
            onClick={() =>
              setItems([...items, { kind: "SERVICE", name: "", quantity: 1, unitPrice: 0, discount: 0 }])
            }
          >
            Adicionar item
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Validade">
            <Input name="validUntil" type="date" />
          </Field>
          <Field label="Condições de pagamento">
            <Input name="paymentTerms" placeholder="Pix, cartão em 2x..." />
          </Field>
        </div>
        <Field label="Observações">
          <Textarea name="notes" />
        </Field>
        <Field label="Desconto extra">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={extraDiscount}
            onChange={(e) => setExtraDiscount(Number(e.target.value))}
          />
        </Field>

        <div className="rounded-2xl bg-bg-2 p-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatBRL(calc.subtotal)}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span>Desconto</span>
            <span>{formatBRL(calc.discount)}</span>
          </div>
          <div className="mt-2 flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatBRL(calc.total)}</span>
          </div>
        </div>
        <Button type="submit" disabled={pending}>
          Salvar orçamento
        </Button>
      </form>
    </div>
  );
}
