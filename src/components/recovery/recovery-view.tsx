"use client";

import { useState, useTransition } from "react";
import { sendRecoveryMessage } from "@/actions/comms";
import { scheduleCustomerReturn } from "@/actions/customers";
import { formatBRL, formatDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";

export function RecoveryView({
  customers,
}: {
  customers: {
    id: string;
    name: string;
    lastServiceAt: string | null;
    days: number;
    avgTicket: number;
  }[];
}) {
  const [pending, start] = useTransition();
  const [dates, setDates] = useState<Record<string, string>>({});

  return (
    <div>
      <PageHeader
        title="Clientes para recuperar"
        subtitle="Quem já deveria ter voltado. Um toque no WhatsApp ou um retorno na agenda."
      />
      <div className="hidden overflow-hidden rounded-2xl border border-line md:block">
        <table className="w-full text-sm">
          <thead className="bg-bg-2 text-left text-xs text-muted">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Último atendimento</th>
              <th className="px-4 py-3">Dias</th>
              <th className="px-4 py-3">Valor médio</th>
              <th className="px-4 py-3">Ação</th>
            </tr>
          </thead>
          <tbody className="bg-surface">
            {customers.map((c) => (
              <tr key={c.id} className="border-t border-line">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3">{formatDate(c.lastServiceAt)}</td>
                <td className="px-4 py-3">{c.days}</td>
                <td className="px-4 py-3">{formatBRL(c.avgTicket)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      disabled={pending}
                      onClick={() => start(async () => { await sendRecoveryMessage(c.id); })}
                    >
                      WhatsApp
                    </Button>
                    <Input
                      type="datetime-local"
                      className="w-auto"
                      value={dates[c.id] ?? ""}
                      onChange={(e) => setDates({ ...dates, [c.id]: e.target.value })}
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={!dates[c.id] || pending}
                      onClick={() => start(() => scheduleCustomerReturn(c.id, dates[c.id]))}
                    >
                      Agendar retorno
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 md:hidden">
        {customers.map((c) => (
          <div key={c.id} className="rounded-2xl border border-line bg-surface p-4">
            <p className="font-medium">{c.name}</p>
            <p className="text-sm text-muted">
              {formatDate(c.lastServiceAt)} · {c.days} dias · {formatBRL(c.avgTicket)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => start(async () => { await sendRecoveryMessage(c.id); })}>
                WhatsApp
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
