import { notFound, redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/utils";
import { QuoteDetail } from "@/components/quotes/quote-detail";

export default async function QuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const ctx = await requireSession();
  if (!ctx) redirect("/login");
  const { id } = await params;
  const quote = await prisma.quote.findFirst({
    where: { id, companyId: ctx.user.companyId },
    include: { customer: true, lead: true, items: true },
  });
  if (!quote) notFound();
  return <QuoteDetail quote={serialize(quote)} />;
}
