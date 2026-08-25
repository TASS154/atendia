import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/utils";
import { AutomationStudio } from "@/components/automation/automation-studio";

export default async function AutomationPage() {
  const ctx = await requireSession();
  if (!ctx) redirect("/login");
  const automations = await prisma.automation.findMany({
    where: { companyId: ctx.user.companyId },
    include: { steps: { orderBy: { order: "asc" } }, runs: { take: 5, orderBy: { createdAt: "desc" } } },
    orderBy: { createdAt: "desc" },
  });
  return <AutomationStudio automations={serialize(automations)} />;
}
