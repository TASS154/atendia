import { prisma } from "./prisma";
import { daysSince, endOfDay, endOfMonth, startOfDay, startOfMonth } from "./utils";

export async function getDashboardData(companyId: string) {
  const monthStart = startOfMonth();
  const monthEnd = endOfMonth();
  const today0 = startOfDay();
  const today1 = endOfDay();
  const twoDaysAgo = new Date(Date.now() - 48 * 36e5);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 864e5);

  const [
    newLeads,
    attendingLeads,
    quotesSent,
    quotesWaiting,
    wonLeads,
    monthPayments,
    receivables,
    inactiveCustomers,
    todayAppointments,
    leadsTotal,
    funnel,
    waitingQuotesList,
    overduePayments,
    unconfirmedAppointments,
    staleLeads,
    recentLeads,
    recentQuotes,
    openTasks,
    unreadInbox,
  ] = await Promise.all([
    prisma.lead.count({
      where: { companyId, stage: "NEW" },
    }),
    prisma.lead.count({
      where: { companyId, stage: "ATTENDING" },
    }),
    prisma.quote.count({
      where: { companyId, status: { in: ["SENT", "VIEWED", "NEGOTIATING"] } },
    }),
    prisma.quote.count({
      where: { companyId, status: { in: ["SENT", "VIEWED"] } },
    }),
    prisma.lead.count({
      where: { companyId, stage: "WON", updatedAt: { gte: monthStart } },
    }),
    prisma.payment.findMany({
      where: {
        companyId,
        status: "PAID",
        paidAt: { gte: monthStart, lte: monthEnd },
      },
    }),
    prisma.payment.findMany({
      where: { companyId, status: { in: ["PENDING", "OVERDUE"] } },
    }),
    prisma.customer.count({
      where: {
        companyId,
        OR: [
          { lastServiceAt: { lte: thirtyDaysAgo } },
          { AND: [{ lastServiceAt: null }, { lastContactAt: { lte: thirtyDaysAgo } }] },
        ],
      },
    }),
    prisma.appointment.findMany({
      where: { companyId, startsAt: { gte: today0, lte: today1 } },
      include: { customer: true, professional: true },
      orderBy: { startsAt: "asc" },
    }),
    prisma.lead.count({ where: { companyId } }),
    prisma.lead.groupBy({
      by: ["stage"],
      where: { companyId, stage: { not: "LOST" } },
      _count: { _all: true },
      _sum: { estimatedValue: true },
    }),
    prisma.quote.count({
      where: { companyId, status: { in: ["SENT", "VIEWED", "NEGOTIATING"] } },
    }),
    prisma.payment.count({ where: { companyId, status: "OVERDUE" } }),
    prisma.appointment.count({
      where: {
        companyId,
        status: "SCHEDULED",
        startsAt: { gte: today0 },
      },
    }),
    prisma.lead.count({
      where: {
        companyId,
        stage: { in: ["NEW", "ATTENDING"] },
        lastContactAt: { lte: twoDaysAgo },
      },
    }),
    prisma.lead.findMany({
      where: { companyId },
      include: { owner: true },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.quote.findMany({
      where: { companyId },
      include: { customer: true, lead: true },
      orderBy: { updatedAt: "desc" },
      take: 4,
    }),
    prisma.task.findMany({
      where: { companyId, status: { not: "DONE" } },
      include: { owner: true, customer: true },
      orderBy: { dueDate: "asc" },
      take: 4,
    }),
    prisma.conversation.count({
      where: { companyId, unreadCount: { gt: 0 } },
    }),
  ]);

  const revenueMonth = monthPayments.reduce((a, p) => a + p.amount, 0);
  const toReceive = receivables.reduce((a, p) => a + p.amount, 0);
  const conversion = leadsTotal ? Math.round((wonLeads / leadsTotal) * 100) : 0;

  const alerts = [
    inactiveCustomers > 0 && {
      href: "/recuperacao",
      text: `${inactiveCustomers} clientes estão há mais de 30 dias sem retornar`,
    },
    waitingQuotesList > 0 && {
      href: "/orcamentos",
      text: `${waitingQuotesList} orçamentos aguardam resposta`,
    },
    overduePayments > 0 && {
      href: "/financeiro",
      text: `${overduePayments} clientes possuem pagamento atrasado`,
    },
    unconfirmedAppointments > 0 && {
      href: "/agenda",
      text: `${unconfirmedAppointments} agendamentos precisam de confirmação`,
    },
    staleLeads > 0 && {
      href: "/leads",
      text:
        staleLeads === 1
          ? "1 lead está sem contato há mais de 48 horas"
          : `${staleLeads} leads estão sem contato há mais de 48 horas`,
    },
  ].filter(Boolean) as { href: string; text: string }[];

  return {
    kpis: {
      newLeads,
      attendingLeads,
      quotesSent,
      quotesWaiting,
      wonLeads,
      revenueMonth,
      toReceive,
      inactiveCustomers,
      todayAppointments: todayAppointments.length,
      conversion,
    },
    funnel: [
      "NEW",
      "ATTENDING",
      "QUOTE",
      "NEGOTIATION",
      "WON",
    ].map((stage) => {
      const row = funnel.find((f) => f.stage === stage);
      return {
        stage,
        count: row?._count._all ?? 0,
        value: row?._sum.estimatedValue ?? 0,
      };
    }),
    alerts,
    todayAppointments,
    recentLeads,
    recentQuotes,
    openTasks,
    unreadInbox,
  };
}

export async function getRecoveryCustomers(companyId: string) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 864e5);
  const customers = await prisma.customer.findMany({
    where: {
      companyId,
      OR: [
        { lastServiceAt: { lte: thirtyDaysAgo } },
        { nextReturnAt: { lte: new Date() } },
        { AND: [{ lastServiceAt: null }, { lastContactAt: { lte: thirtyDaysAgo } }] },
      ],
    },
    include: { owner: true },
    orderBy: { lastServiceAt: "asc" },
  });

  return customers.map((c) => ({
    ...c,
    days: daysSince(c.lastServiceAt ?? c.lastContactAt) ?? 0,
    avgTicket: c.visitCount ? c.totalSpent / c.visitCount : c.totalSpent,
  }));
}
