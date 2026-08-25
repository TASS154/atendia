import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/utils";
import { LeadsBoard } from "@/components/leads/leads-board";

export default async function LeadsPage() {
  const ctx = await requireSession();
  if (!ctx) redirect("/login");

  const [leads, users] = await Promise.all([
    prisma.lead.findMany({
      where: { companyId: ctx.user.companyId },
      include: { owner: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { companyId: ctx.user.companyId, active: true },
    }),
  ]);

  return <LeadsBoard leads={serialize(leads)} users={serialize(users)} />;
}
