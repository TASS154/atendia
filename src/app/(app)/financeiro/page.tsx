import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/utils";
import { FinanceView } from "@/components/finance/finance-view";

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const ctx = await requireSession();
  if (!ctx) redirect("/login");
  const sp = await searchParams;
  const from = sp.from ? new Date(sp.from) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const to = sp.to ? new Date(sp.to) : new Date();
  to.setHours(23, 59, 59, 999);

  const payments = await prisma.payment.findMany({
    where: {
      companyId: ctx.user.companyId,
      OR: [
        { paidAt: { gte: from, lte: to } },
        { dueDate: { gte: from, lte: to } },
      ],
    },
    include: { customer: true },
    orderBy: { dueDate: "desc" },
  });
  const customers = await prisma.customer.findMany({
    where: { companyId: ctx.user.companyId },
    orderBy: { name: "asc" },
  });

  return (
    <FinanceView
      payments={serialize(payments)}
      customers={serialize(customers)}
      from={from.toISOString().slice(0, 10)}
      to={to.toISOString().slice(0, 10)}
    />
  );
}
