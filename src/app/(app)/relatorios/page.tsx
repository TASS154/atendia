import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReportsView } from "@/components/reports/reports-view";
import { startOfMonth } from "@/lib/utils";

export default async function ReportsPage() {
  const ctx = await requireSession();
  if (!ctx) redirect("/login");
  const companyId = ctx.user.companyId;
  const monthStart = startOfMonth();

  const [leads, customers, payments, quotes] = await Promise.all([
    prisma.lead.findMany({ where: { companyId } }),
    prisma.customer.findMany({ where: { companyId } }),
    prisma.payment.findMany({ where: { companyId } }),
    prisma.quote.findMany({ where: { companyId } }),
  ]);

  const won = leads.filter((l) => l.stage === "WON");
  const byOrigin: Record<string, number> = {};
  for (const l of leads) byOrigin[l.origin] = (byOrigin[l.origin] ?? 0) + 1;
  const salesOrigin = Object.entries(byOrigin).map(([name, value]) => ({ name, value }));

  const byOwner: Record<string, number> = {};
  for (const l of won) {
    const key = l.ownerId ?? "sem";
    byOwner[key] = (byOwner[key] ?? 0) + (l.estimatedValue ?? 0);
  }
  const users = await prisma.user.findMany({ where: { companyId } });
  const salesPeople = Object.entries(byOwner).map(([id, value]) => ({
    name: users.find((u) => u.id === id)?.name ?? "Sem responsável",
    value,
  }));

  const paid = payments.filter((p) => p.status === "PAID" && p.paidAt && p.paidAt >= monthStart);
  const pending = payments.filter((p) => p.status === "PENDING");
  const overdue = payments.filter((p) => p.status === "OVERDUE");
  const received = paid.reduce((a, p) => a + p.amount, 0);

  const thirty = new Date(Date.now() - 30 * 864e5);
  const inactive = customers.filter(
    (c) => (c.lastServiceAt ?? c.lastContactAt ?? new Date(0)) < thirty,
  ).length;
  const recurring = customers.filter((c) => c.visitCount >= 2).length;
  const recovered = customers.filter(
    (c) => c.lastContactAt && c.lastServiceAt && c.lastContactAt > c.lastServiceAt && c.lastContactAt >= monthStart,
  ).length;

  return (
    <ReportsView
      sales={{
        count: won.length,
        ticket: won.length
          ? won.reduce((a, l) => a + (l.estimatedValue ?? 0), 0) / won.length
          : 0,
        conversion: leads.length ? Math.round((won.length / leads.length) * 100) : 0,
        byOrigin: salesOrigin,
        byPeople: salesPeople,
      }}
      leads={{
        quantity: leads.length,
        conversion: leads.length ? Math.round((won.length / leads.length) * 100) : 0,
        byOrigin: salesOrigin,
      }}
      customers={{
        novos: customers.filter((c) => c.createdAt >= monthStart).length,
        recorrentes: recurring,
        inativos: inactive,
        recuperados: recovered,
      }}
      finance={{
        faturamento: received + pending.reduce((a, p) => a + p.amount, 0),
        recebido: received,
        pendente: pending.reduce((a, p) => a + p.amount, 0),
        atrasado: overdue.reduce((a, p) => a + p.amount, 0),
      }}
      quotesWaiting={quotes.filter((q) => ["SENT", "VIEWED", "NEGOTIATING"].includes(q.status)).length}
    />
  );
}
