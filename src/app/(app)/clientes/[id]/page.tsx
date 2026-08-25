import { notFound, redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/utils";
import { CustomerDetail } from "@/components/customers/customer-detail";

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const ctx = await requireSession();
  if (!ctx) redirect("/login");
  const { id } = await params;
  const customer = await prisma.customer.findFirst({
    where: { id, companyId: ctx.user.companyId },
    include: {
      owner: true,
      tags: { include: { tag: true } },
      history: { orderBy: { createdAt: "desc" } },
      quotes: { orderBy: { createdAt: "desc" }, take: 5 },
      appointments: { orderBy: { startsAt: "desc" }, take: 5 },
      payments: { orderBy: { dueDate: "desc" }, take: 5 },
    },
  });
  if (!customer) notFound();
  return <CustomerDetail customer={serialize(customer)} />;
}
