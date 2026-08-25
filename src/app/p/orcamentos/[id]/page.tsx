import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatBRL, formatDate, formatPhone } from "@/lib/format";
import { labelOf, QUOTE_STATUSES } from "@/lib/constants";
import { Badge, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { waLink } from "@/lib/utils";

export default async function PublicQuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      items: true,
      customer: true,
      lead: true,
      company: true,
    },
  });
  if (!quote) notFound();

  const person = quote.customer ?? quote.lead;
  const phone = quote.customer?.whatsapp ?? quote.customer?.phone ?? quote.lead?.phone ?? "";
  const message = `Olá, ${quote.company.name}! Vi o orçamento ${quote.number} de ${formatBRL(quote.total)} e quero seguir.`;

  return (
    <div className="mesh grain min-h-full">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/" className="font-serif text-2xl tracking-tight">
          Atendia
        </Link>
        <Card className="mt-8 overflow-hidden">
          <div className="bg-sidebar px-6 py-8 text-white">
            <p className="text-xs uppercase tracking-[0.18em] text-white/50">
              Orçamento {quote.number}
            </p>
            <h1 className="mt-2 font-serif text-4xl tracking-tight">{quote.company.name}</h1>
            <p className="mt-2 text-white/70">
              {quote.company.city}/{quote.company.state} · {formatPhone(quote.company.phone)}
            </p>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted">Para</p>
                <p className="font-medium">{person?.name ?? "Cliente"}</p>
              </div>
              <Badge tone={quote.status === "APPROVED" ? "ok" : "warn"}>
                {labelOf(QUOTE_STATUSES, quote.status)}
              </Badge>
            </div>
            <div className="mt-6 space-y-3">
              {quote.items.map((item) => (
                <div key={item.id} className="flex justify-between border-b border-line py-3 text-sm">
                  <span>
                    {item.quantity}× {item.name}
                  </span>
                  <span>{formatBRL(item.total)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatBRL(quote.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Desconto</span>
                <span>{formatBRL(quote.discount)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatBRL(quote.total)}</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted">Validade: {formatDate(quote.validUntil)}</p>
            <p className="text-sm text-muted">Pagamento: {quote.paymentTerms ?? "A combinar"}</p>
            {quote.notes ? <p className="mt-3 text-sm">{quote.notes}</p> : null}
            <Button href={waLink(phone || quote.company.phone || "", message)} className="mt-6 w-full">
              Responder pelo WhatsApp
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
