import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/utils";
import { WorkOrdersView } from "@/components/orders/work-orders-view";

export default async function WorkOrdersPage() {
  const ctx = await requireSession();
  if (!ctx) redirect("/login");
  const [orders, customers, services, users] = await Promise.all([
    prisma.workOrder.findMany({
      where: { companyId: ctx.user.companyId },
      include: { customer: true, service: true, professional: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.customer.findMany({ where: { companyId: ctx.user.companyId }, orderBy: { name: "asc" } }),
    prisma.service.findMany({ where: { companyId: ctx.user.companyId, active: true } }),
    prisma.user.findMany({ where: { companyId: ctx.user.companyId, active: true } }),
  ]);
  return (
    <WorkOrdersView
      orders={serialize(orders)}
      customers={serialize(customers)}
      services={serialize(services)}
      users={serialize(users)}
    />
  );
}
