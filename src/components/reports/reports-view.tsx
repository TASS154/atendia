"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatBRL } from "@/lib/format";
import { Card, PageHeader } from "@/components/ui/card";

export function ReportsView({
  sales,
  leads,
  customers,
  finance,
  quotesWaiting,
}: {
  sales: {
    count: number;
    ticket: number;
    conversion: number;
    byOrigin: { name: string; value: number }[];
    byPeople: { name: string; value: number }[];
  };
  leads: {
    quantity: number;
    conversion: number;
    byOrigin: { name: string; value: number }[];
  };
  customers: { novos: number; recorrentes: number; inativos: number; recuperados: number };
  finance: { faturamento: number; recebido: number; pendente: number; atrasado: number };
  quotesWaiting: number;
}) {
  return (
    <div>
      <PageHeader
        title="Relatórios"
        subtitle="Vendas, leads, clientes e financeiro — o dono enxerga a operação sem pedir relatório no WhatsApp."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-muted">Vendas no funil</p>
          <p className="mt-2 text-2xl font-semibold">{sales.count}</p>
          <p className="text-xs text-muted">Ticket {formatBRL(sales.ticket)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">Conversão de leads</p>
          <p className="mt-2 text-2xl font-semibold">{leads.conversion}%</p>
          <p className="text-xs text-muted">{leads.quantity} leads no total</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">Recebido no mês</p>
          <p className="mt-2 text-2xl font-semibold">{formatBRL(finance.recebido)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">Orçamentos em aberto</p>
          <p className="mt-2 text-2xl font-semibold">{quotesWaiting}</p>
        </Card>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-4 font-medium">Leads por origem</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sales.byOrigin}>
                <CartesianGrid stroke="#e4ddd2" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#0e6b63" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="mb-4 font-medium">Vendas por responsável</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sales.byPeople}>
                <CartesianGrid stroke="#e4ddd2" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip formatter={(v) => formatBRL(Number(v))} />
                <Bar dataKey="value" fill="#c45c26" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-muted">Novos clientes</p>
          <p className="mt-2 text-2xl font-semibold">{customers.novos}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">Recorrentes</p>
          <p className="mt-2 text-2xl font-semibold">{customers.recorrentes}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">Inativos</p>
          <p className="mt-2 text-2xl font-semibold">{customers.inativos}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">Recuperados no mês</p>
          <p className="mt-2 text-2xl font-semibold">{customers.recuperados}</p>
        </Card>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-muted">Faturamento</p>
          <p className="mt-2 text-xl font-semibold">{formatBRL(finance.faturamento)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">Recebido</p>
          <p className="mt-2 text-xl font-semibold">{formatBRL(finance.recebido)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">Pendente</p>
          <p className="mt-2 text-xl font-semibold">{formatBRL(finance.pendente)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">Atrasado</p>
          <p className="mt-2 text-xl font-semibold">{formatBRL(finance.atrasado)}</p>
        </Card>
      </div>
    </div>
  );
}
