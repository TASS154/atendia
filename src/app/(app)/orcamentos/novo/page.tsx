import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/utils";
import { QuoteForm } from "@/components/quotes/quote-form";

export default async function NewQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string; leadId?: string }>;
}) {
  const ctx = await requireSession();
  if (!ctx) redirect("/login");
  const sp = await searchParams;
  const [customers, leads, services] = await Promise.all([
    prisma.customer.findMany({
      where: { companyId: ctx.user.companyId },
      orderBy: { name: "asc" },
    }),
    prisma.lead.findMany({
      where: { companyId: ctx.user.companyId, convertedCustomerId: null },
      orderBy: { name: "asc" },
    }),
    prisma.service.findMany({
      where: { companyId: ctx.user.companyId, active: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <QuoteForm
      customers={serialize(customers)}
      leads={serialize(leads)}
      services={serialize(services)}
      defaultCustomerId={sp.customerId}
      defaultLeadId={sp.leadId}
    />
  );
}
