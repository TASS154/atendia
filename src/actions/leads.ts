"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { addHistory, notify } from "@/lib/history";
import { startAutomations } from "@/lib/automation";

function refresh() {
  revalidatePath("/dashboard");
  revalidatePath("/leads");
  revalidatePath("/clientes");
  revalidatePath("/whatsapp");
  revalidatePath("/orcamentos");
}

export async function createLead(input: {
  name: string;
  phone: string;
  email?: string;
  estimatedValue?: number;
  origin: string;
  stage?: string;
  notes?: string;
  ownerId?: string;
  followUpAt?: string;
}) {
  const { user } = await requireUser();
  const lead = await prisma.lead.create({
    data: {
      companyId: user.companyId,
      name: input.name,
      phone: input.phone,
      email: input.email || null,
      estimatedValue: input.estimatedValue || null,
      origin: input.origin || "WhatsApp",
      stage: input.stage || "NEW",
      notes: input.notes || null,
      ownerId: input.ownerId || user.id,
      lastContactAt: new Date(),
      followUpAt: input.followUpAt ? new Date(input.followUpAt) : null,
    },
  });

  await prisma.conversation.create({
    data: {
      companyId: user.companyId,
      leadId: lead.id,
      phone: lead.phone,
      ownerId: lead.ownerId,
      status: "OPEN",
      label: "Novo lead",
      lastMessage: "Lead criado no Atendia",
      lastMessageAt: new Date(),
    },
  });

  await notify({
    companyId: user.companyId,
    type: "LEAD",
    title: "Novo lead recebido",
    body: `${lead.name} chegou via ${lead.origin}.`,
    href: "/leads",
  });

  await startAutomations(user.companyId, "LEAD_CREATED", {
    leadId: lead.id,
    customerName: lead.name,
    phone: lead.phone,
  });

  refresh();
  return lead;
}

export async function updateLead(
  id: string,
  data: {
    name?: string;
    phone?: string;
    email?: string | null;
    estimatedValue?: number | null;
    origin?: string;
    stage?: string;
    notes?: string | null;
    ownerId?: string | null;
    followUpAt?: Date | null;
  },
) {
  const { user } = await requireUser();
  const existing = await prisma.lead.findFirst({
    where: { id, companyId: user.companyId },
  });
  if (!existing) throw new Error("Lead não encontrado");
  const lead = await prisma.lead.update({
    where: { id },
    data: { ...data, lastContactAt: new Date() },
  });
  refresh();
  return lead;
}

export async function moveLeadStage(id: string, stage: string) {
  const { user } = await requireUser();
  await prisma.lead.updateMany({
    where: { id, companyId: user.companyId },
    data: { stage },
  });
  refresh();
}

export async function deleteLead(id: string) {
  const { user } = await requireUser();
  await prisma.lead.deleteMany({ where: { id, companyId: user.companyId } });
  refresh();
}

export async function convertLead(id: string) {
  const { user } = await requireUser();
  const lead = await prisma.lead.findFirst({
    where: { id, companyId: user.companyId },
  });
  if (!lead) throw new Error("Lead não encontrado");

  const customer = await prisma.customer.create({
    data: {
      companyId: user.companyId,
      name: lead.name,
      phone: lead.phone,
      whatsapp: lead.phone,
      email: lead.email,
      origin: lead.origin,
      notes: lead.notes,
      ownerId: lead.ownerId,
      lastContactAt: new Date(),
      convertedFromLeadId: lead.id,
    },
  });

  await prisma.lead.update({
    where: { id: lead.id },
    data: { stage: "WON", convertedCustomerId: customer.id },
  });

  await prisma.quote.updateMany({
    where: { leadId: lead.id },
    data: { customerId: customer.id },
  });

  await prisma.conversation.updateMany({
    where: { leadId: lead.id },
    data: { customerId: customer.id },
  });

  await addHistory({
    customerId: customer.id,
    type: "CONTACT",
    title: "Lead convertido em cliente",
    description: `Origem ${lead.origin}. Convertido a partir do atendimento no WhatsApp.`,
  });

  await notify({
    companyId: user.companyId,
    type: "LEAD",
    title: "Lead convertido",
    body: `${customer.name} agora está no CRM.`,
    href: `/clientes/${customer.id}`,
  });

  refresh();
  revalidatePath(`/clientes/${customer.id}`);
  return customer;
}
