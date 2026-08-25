import Link from "next/link";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatBRL, formatDate } from "@/lib/format";
import { labelOf, QUOTE_STATUSES } from "@/lib/constants";
import { Badge, PageHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function QuotesPage() {
  const ctx = await requireSession();
  if (!ctx) redirect("/login");
  const quotes = await prisma.quote.findMany({
    where: { companyId: ctx.user.companyId },
    include: { customer: true, lead: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Orçamentos"
        subtitle="Do rascunho ao WhatsApp — o status muda de verdade e alimenta o dashboard."
        actions={
          <Button href="/orcamentos/novo">Novo orçamento</Button>
        }
      />
      <div className="hidden overflow-hidden rounded-2xl border border-line md:block">
        <table className="w-full text-sm">
          <thead className="bg-bg-2 text-left text-xs text-muted">
            <tr>
              <th className="px-4 py-3">Número</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Validade</th>
            </tr>
          </thead>
          <tbody className="bg-surface">
            {quotes.map((q) => (
              <tr key={q.id} className="border-t border-line transition hover:bg-bg">
                <td className="px-4 py-3">
                  <Link href={`/orcamentos/${q.id}`} className="font-medium hover:text-brand">
                    {q.number}
                  </Link>
                </td>
                <td className="px-4 py-3">{q.customer?.name ?? q.lead?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <Badge tone={q.status === "APPROVED" ? "ok" : q.status === "SENT" || q.status === "VIEWED" ? "warn" : "neutral"}>
                    {labelOf(QUOTE_STATUSES, q.status)}
                  </Badge>
                </td>
                <td className="px-4 py-3">{formatBRL(q.total)}</td>
                <td className="px-4 py-3">{formatDate(q.validUntil)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 md:hidden">
        {quotes.map((q) => (
          <Link
            key={q.id}
            href={`/orcamentos/${q.id}`}
            className="block rounded-2xl border border-line bg-surface p-4"
          >
            <p className="font-medium">{q.number}</p>
            <p className="text-sm text-muted">{q.customer?.name ?? q.lead?.name}</p>
            <p className="mt-2 text-sm">
              {formatBRL(q.total)} · {labelOf(QUOTE_STATUSES, q.status)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
