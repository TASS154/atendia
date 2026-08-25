"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { notify } from "@/lib/history";
import { createLead } from "./leads";
import { updateQuoteStatus } from "./quotes";
import { createAppointment } from "./operations";
import { getWhatsAppService } from "@/lib/whatsapp";
import { addDays } from "@/lib/utils";
import { processDueAutomations } from "@/lib/automation";

function refreshAll() {
  for (const path of [
    "/dashboard",
    "/leads",
    "/clientes",
    "/orcamentos",
    "/whatsapp",
    "/agenda",
    "/financeiro",
    "/recuperacao",
    "/tarefas",
  ]) {
    revalidatePath(path);
  }
}

export async function simulateNewLead() {
  const names = [
    ["Bianca Tavares", "19998880101"],
    ["Rogério Lima", "19998880102"],
    ["Cíntia Moraes", "19998880103"],
    ["Daniel Souza", "19998880104"],
  ];
  const pick = names[Math.floor(Math.random() * names.length)];
  const lead = await createLead({
    name: pick[0],
    phone: pick[1],
    origin: "WhatsApp",
    estimatedValue: 180,
    notes: "Lead simulado pelo modo demonstração.",
    stage: "NEW",
  });
  refreshAll();
  return lead;
}

export async function simulateIncomingMessage() {
  const { user } = await requireUser();
  const conversation = await prisma.conversation.findFirst({
    where: { companyId: user.companyId },
    orderBy: { lastMessageAt: "desc" },
  });
  if (!conversation) throw new Error("Nenhuma conversa para simular");

  const wa = await getWhatsAppService(user.companyId);
  await wa.handleWebhook({
    from: conversation.phone,
    body: "Oi! Vi o orçamento e quero fechar. Qual o próximo horário?",
  });

  await notify({
    companyId: user.companyId,
    type: "LEAD",
    title: "Mensagem recebida",
    body: `${conversation.phone} respondeu no WhatsApp.`,
    href: "/whatsapp",
  });

  refreshAll();
}

export async function simulateQuoteApproved() {
  const { user } = await requireUser();
  const quote = await prisma.quote.findFirst({
    where: {
      companyId: user.companyId,
      status: { in: ["SENT", "VIEWED", "NEGOTIATING"] },
    },
    orderBy: { createdAt: "desc" },
  });
  if (!quote) throw new Error("Nenhum orçamento aguardando");
  await updateQuoteStatus(quote.id, "APPROVED");
  refreshAll();
}

export async function simulateInactiveCustomer() {
  const { user } = await requireUser();
  const customer = await prisma.customer.findFirst({
    where: { companyId: user.companyId },
    orderBy: { lastServiceAt: "desc" },
  });
  if (!customer) throw new Error("Nenhum cliente");
  const when = addDays(new Date(), -35);
  await prisma.customer.update({
    where: { id: customer.id },
    data: { lastServiceAt: when, lastContactAt: when, nextReturnAt: addDays(new Date(), -5) },
  });
  await notify({
    companyId: user.companyId,
    type: "RETURN",
    title: "Cliente sem retorno",
    body: `${customer.name} está há 35 dias sem atendimento.`,
    href: "/recuperacao",
  });
  refreshAll();
  return customer;
}

export async function simulateOverduePayment() {
  const { user } = await requireUser();
  const customer = await prisma.customer.findFirst({
    where: { companyId: user.companyId },
  });
  if (!customer) return;
  await prisma.payment.create({
    data: {
      companyId: user.companyId,
      customerId: customer.id,
      description: "Pagamento simulado em atraso",
      amount: 120,
      dueDate: addDays(new Date(), -7),
      status: "OVERDUE",
      method: "PIX",
    },
  });
  await notify({
    companyId: user.companyId,
    type: "PAYMENT",
    title: "Pagamento atrasado",
    body: `${customer.name} possui um pagamento em atraso.`,
    href: "/financeiro",
  });
  refreshAll();
}

export async function simulateNewAppointment() {
  const { user } = await requireUser();
  const customer = await prisma.customer.findFirst({
    where: { companyId: user.companyId },
    orderBy: { lastContactAt: "desc" },
  });
  const service = await prisma.service.findFirst({
    where: { companyId: user.companyId, active: true },
  });
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(16, 0, 0, 0);
  await createAppointment({
    customerId: customer?.id,
    serviceId: service?.id,
    title: `${service?.name ?? "Atendimento"} — ${customer?.name ?? "Cliente"}`,
    type: "SERVICE",
    startsAt: start.toISOString(),
    durationMin: service?.durationMin ?? 45,
  });
  refreshAll();
}

export async function simulateAdvanceAutomations() {
  const { user } = await requireUser();
  await prisma.automationRun.updateMany({
    where: { status: "ACTIVE", automation: { companyId: user.companyId } },
    data: { nextRunAt: new Date() },
  });
  await processDueAutomations(user.companyId);
  refreshAll();
}
