import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/utils";
import { CustomersView } from "@/components/customers/customers-view";

export default async function CustomersPage() {
  const ctx = await requireSession();
  if (!ctx) redirect("/login");
  const [customers, users, tags] = await Promise.all([
    prisma.customer.findMany({
      where: { companyId: ctx.user.companyId },
      include: { owner: true, tags: { include: { tag: true } } },
      orderBy: { lastContactAt: "desc" },
    }),
    prisma.user.findMany({ where: { companyId: ctx.user.companyId, active: true } }),
    prisma.tag.findMany({ where: { companyId: ctx.user.companyId } }),
  ]);
  return (
    <CustomersView
      customers={serialize(customers)}
      users={serialize(users)}
      tags={serialize(tags)}
    />
  );
}
