import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/utils";
import { TasksView } from "@/components/tasks/tasks-view";

export default async function TasksPage() {
  const ctx = await requireSession();
  if (!ctx) redirect("/login");
  const [tasks, users, customers] = await Promise.all([
    prisma.task.findMany({
      where: { companyId: ctx.user.companyId },
      include: { owner: true, customer: true },
      orderBy: { dueDate: "asc" },
    }),
    prisma.user.findMany({ where: { companyId: ctx.user.companyId, active: true } }),
    prisma.customer.findMany({ where: { companyId: ctx.user.companyId }, orderBy: { name: "asc" } }),
  ]);
  return (
    <TasksView tasks={serialize(tasks)} users={serialize(users)} customers={serialize(customers)} />
  );
}
