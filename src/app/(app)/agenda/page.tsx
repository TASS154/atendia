import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/utils";
import { AgendaView } from "@/components/agenda/agenda-view";

export default async function AgendaPage() {
  const ctx = await requireSession();
  if (!ctx) redirect("/login");
  const [appointments, customers, services, users] = await Promise.all([
    prisma.appointment.findMany({
      where: { companyId: ctx.user.companyId },
      include: { customer: true, service: true, professional: true },
      orderBy: { startsAt: "asc" },
    }),
    prisma.customer.findMany({
      where: { companyId: ctx.user.companyId },
      orderBy: { name: "asc" },
    }),
    prisma.service.findMany({
      where: { companyId: ctx.user.companyId, active: true },
    }),
    prisma.user.findMany({ where: { companyId: ctx.user.companyId, active: true } }),
  ]);
  return (
    <AgendaView
      appointments={serialize(appointments)}
      customers={serialize(customers)}
      services={serialize(services)}
      users={serialize(users)}
    />
  );
}
