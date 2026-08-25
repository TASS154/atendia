"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { addHistory, notify } from "@/lib/history";
import { startAutomations } from "@/lib/automation";
import { getWhatsAppService } from "@/lib/whatsapp";
import { formatBRL, formatDate } from "@/lib/format";
import { interpolate, waLink } from "@/lib/utils";

function refresh(id?: string) {
  revalidatePath("/orcamentos");
  revalidatePath("/dashboard");
  revalidatePath("/clientes");
  revalidatePath("/whatsapp");
  if (id) revalidatePath(`/orcamentos/${id}`);
}

async function nextNumber(companyId: string, prefix: string) {
  const count = await prisma.quote.count({ where: { companyId } });
  return `${prefix}-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;
}

export type QuoteItemInput = {
  serviceId?: string;
  kind: "SERVICE" | "PRODUCT";
  name: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
};

function totals(items: QuoteItemInput[], extraDiscount = 0) {
  const subtotal = items.reduce((acc, i) => {
    const line = i.quantity * i.unitPrice - (i.discount ?? 0);
    return acc + line;
  }, 0);
  const discount = extraDiscount;
  return { subtotal, discount, total: Math.max(0, subtotal - discount) };
}

export async function createQuote(input: {
  customerId?: string;
  leadId?: string;
  notes?: string;
  validUntil?: string;
  paymentTerms?: string;
  discount?: number;
  items: QuoteItemInput[];
}) {
  const { user } = await requireUser();
  const calc = totals(input.items, input.discount ?? 0);
  const quote = await prisma.quote.create({
    data: {
      companyId: user.companyId,
      number: await nextNumber(user.companyId, "ORC"),
      customerId: input.customerId || null,
      leadId: input.leadId || null,
      status: "DRAFT",
      notes: input.notes || null,
      validUntil: input.validUntil ? new Date(input.validUntil) : null,
      paymentTerms: input.paymentTerms || null,
      discount: calc.discount,
      subtotal: calc.subtotal,
      total: calc.total,
      items: {
        create: input.items.map((i) => ({
          serviceId: i.serviceId || null,
          kind: i.kind,
          name: i.name,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          discount: i.discount ?? 0,
          total: i.quantity * i.unitPrice - (i.discount ?? 0),
        })),
      },
    },
  });

  if (input.customerId) {
    await addHistory({
      customerId: input.customerId,
      type: "QUOTE",
      title: `Orçamento de ${formatBRL(quote.total)} criado`,
      description: quote.number,
    });
  }

  await startAutomations(user.companyId, "QUOTE_CREATED", {
    customerId: input.customerId,
    leadId: input.leadId,
    quoteId: quote.id,
  });

  refresh(quote.id);
  return quote;
}

export async function updateQuoteStatus(id: string, status: string) {
  const { user } = await requireUser();
  const current = await prisma.quote.findFirst({
    where: { id, companyId: user.companyId },
  });
  if (!current) throw new Error("Orçamento não encontrado");
  const quote = await prisma.quote.update({
    where: { id },
    data: {
      status,
      respondedAt: ["APPROVED", "REJECTED"].includes(status) ? new Date() : undefined,
      viewedAt: status === "VIEWED" ? new Date() : undefined,
    },
    include: { customer: true, lead: true },
  });

  if (status === "APPROVED") {
    await approveQuoteInternal(user.companyId, user.id, quote);
  }

  refresh(id);
  return quote;
}

async function approveQuoteInternal(
  companyId: string,
  userId: string,
  quote: {
    id: string;
    number: string;
    total: number;
    customerId: string | null;
    leadId: string | null;
    customer: { id: string; name: string } | null;
    lead: { id: string; name: string; phone: string } | null;
  },
) {
  if (quote.customerId) {
    await addHistory({
      customerId: quote.customerId,
      type: "QUOTE",
      title: "Orçamento aprovado",
      description: `${quote.number} — ${formatBRL(quote.total)}`,
    });
    const osCount = await prisma.workOrder.count({ where: { companyId } });
    await prisma.workOrder.create({
      data: {
        companyId,
        number: `OS-${new Date().getFullYear()}-${String(osCount + 1).padStart(3, "0")}`,
        customerId: quote.customerId,
        quoteId: quote.id,
        professionalId: userId,
        description: `OS gerada a partir do orçamento ${quote.number}`,
        value: quote.total,
        status: "APPROVED",
        date: new Date(),
      },
    });
    await prisma.payment.create({
      data: {
        companyId,
        customerId: quote.customerId,
        quoteId: quote.id,
        description: `Orçamento ${quote.number}`,
        amount: quote.total,
        dueDate: new Date(),
        status: "PENDING",
        method: "PIX",
      },
    });
  }

  await notify({
    companyId,
    type: "QUOTE",
    title: "Orçamento aprovado",
    body: `${quote.customer?.name ?? quote.lead?.name ?? "Cliente"} aprovou ${quote.number}.`,
    href: `/orcamentos/${quote.id}`,
  });
}

export async function sendQuoteWhatsApp(id: string) {
  const { user } = await requireUser();
  const quote = await prisma.quote.findFirst({
    where: { id, companyId: user.companyId },
    include: { customer: true, lead: true, items: true },
  });
  if (!quote) throw new Error("Orçamento não encontrado");

  const person = quote.customer ?? quote.lead;
  if (!person) throw new Error("Vincule um cliente ou lead");

  const template = await prisma.messageTemplate.findFirst({
    where: { companyId: user.companyId, category: "QUOTE" },
  });

  const message = interpolate(
    template?.body ??
      "Olá, {{cliente}}! Segue o orçamento {{numero}} no valor de {{total}}. Validade até {{validade}}.",
    {
      cliente: person.name,
      numero: quote.number,
      total: formatBRL(quote.total),
      validade: formatDate(quote.validUntil),
    },
  );

  const wa = await getWhatsAppService(user.companyId);
  await wa.sendMessage(person.phone, message);

  await prisma.quote.update({
    where: { id: quote.id },
    data: { status: quote.status === "DRAFT" ? "SENT" : quote.status, sentAt: new Date() },
  });

  if (quote.leadId) {
    await prisma.lead.update({
      where: { id: quote.leadId },
      data: { stage: "QUOTE", lastContactAt: new Date() },
    });
  }

  if (quote.customerId) {
    await addHistory({
      customerId: quote.customerId,
      type: "QUOTE",
      title: `Orçamento de ${formatBRL(quote.total)} enviado`,
      description: "Enviado pelo WhatsApp",
    });
    await prisma.customer.update({
      where: { id: quote.customerId },
      data: { lastContactAt: new Date() },
    });
  }

  await notify({
    companyId: user.companyId,
    type: "QUOTE",
    title: "Orçamento aguardando resposta",
    body: `${quote.number} enviado para ${person.name}.`,
    href: `/orcamentos/${quote.id}`,
  });

  await startAutomations(user.companyId, "QUOTE_SENT", {
    customerId: quote.customerId ?? undefined,
    leadId: quote.leadId ?? undefined,
    quoteId: quote.id,
    customerName: person.name,
    phone: person.phone,
  });

  refresh(quote.id);
  return { ok: true, waUrl: waLink(person.phone, message), message };
}

export async function deleteQuote(id: string) {
  const { user } = await requireUser();
  await prisma.quote.deleteMany({ where: { id, companyId: user.companyId } });
  refresh();
}
