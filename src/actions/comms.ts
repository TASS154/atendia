"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { getWhatsAppService } from "@/lib/whatsapp";
import { addHistory } from "@/lib/history";
import { processDueAutomations } from "@/lib/automation";

function refresh() {
  revalidatePath("/whatsapp");
  revalidatePath("/automacao");
  revalidatePath("/dashboard");
  revalidatePath("/clientes");
}

export async function sendInboxMessage(conversationId: string, body: string) {
  const { user } = await requireUser();
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, companyId: user.companyId },
  });
  if (!conversation) throw new Error("Conversa não encontrada");

  const wa = await getWhatsAppService(user.companyId);
  await wa.sendMessage(conversation.phone, body);

  if (conversation.customerId) {
    await prisma.customer.update({
      where: { id: conversation.customerId },
      data: { lastContactAt: new Date() },
    });
  }
  if (conversation.leadId) {
    await prisma.lead.update({
      where: { id: conversation.leadId },
      data: { lastContactAt: new Date() },
    });
  }

  refresh();
}

export async function sendRecoveryMessage(customerId: string) {
  const { user } = await requireUser();
  const customer = await prisma.customer.findFirst({
    where: { id: customerId, companyId: user.companyId },
  });
  if (!customer) throw new Error("Cliente não encontrado");

  const tpl = await prisma.messageTemplate.findFirst({
    where: { companyId: user.companyId, category: "RETURN" },
  });
  const body = (tpl?.body ??
    "Olá, {{cliente}}! Já faz um tempinho desde seu último atendimento. Gostaria de agendar novamente?"
  ).replace("{{cliente}}", customer.name);

  const wa = await getWhatsAppService(user.companyId);
  await wa.sendMessage(customer.phone, body, { isAutomated: false });
  await prisma.customer.update({
    where: { id: customer.id },
    data: { lastContactAt: new Date() },
  });
  await addHistory({
    customerId: customer.id,
    type: "FOLLOWUP",
    title: "Mensagem de retorno enviada",
    description: body,
  });
  revalidatePath("/recuperacao");
  revalidatePath("/whatsapp");
  revalidatePath(`/clientes/${customer.id}`);
  return { message: body };
}

export async function markNotificationsRead() {
  const { user } = await requireUser();
  await prisma.notification.updateMany({
    where: { companyId: user.companyId, read: false },
    data: { read: true },
  });
  revalidatePath("/dashboard");
}

export async function markNotificationRead(id: string) {
  const { user } = await requireUser();
  const n = await prisma.notification.findFirst({
    where: { id, companyId: user.companyId },
  });
  if (!n) return;
  await prisma.notification.update({ where: { id }, data: { read: true } });
  revalidatePath("/dashboard");
}

export async function saveAutomation(input: {
  id?: string;
  name: string;
  description?: string;
  trigger: string;
  active: boolean;
  steps: { type: string; config: Record<string, unknown> }[];
}) {
  const { user } = await requireUser();
  if (input.id) {
    await prisma.automationStep.deleteMany({ where: { automationId: input.id } });
    await prisma.automation.update({
      where: { id: input.id },
      data: {
        name: input.name,
        description: input.description,
        trigger: input.trigger,
        active: input.active,
        steps: {
          create: input.steps.map((s, i) => ({
            order: i + 1,
            type: s.type,
            config: JSON.stringify(s.config),
          })),
        },
      },
    });
  } else {
    await prisma.automation.create({
      data: {
        companyId: user.companyId,
        name: input.name,
        description: input.description,
        trigger: input.trigger,
        active: input.active,
        steps: {
          create: input.steps.map((s, i) => ({
            order: i + 1,
            type: s.type,
            config: JSON.stringify(s.config),
          })),
        },
      },
    });
  }
  revalidatePath("/automacao");
}

export async function toggleAutomation(id: string, active: boolean) {
  await prisma.automation.update({ where: { id }, data: { active } });
  revalidatePath("/automacao");
}

export async function runPendingAutomations() {
  const { user } = await requireUser();
  await processDueAutomations(user.companyId);
  refresh();
}

export async function saveWhatsAppConfig(input: {
  phoneNumberId?: string;
  businessAccountId?: string;
  accessToken?: string;
  webhookUrl?: string;
  verifyToken?: string;
  mode: string;
}) {
  const { user } = await requireUser();
  await prisma.whatsAppConfig.upsert({
    where: { companyId: user.companyId },
    update: {
      ...input,
      connected: input.mode === "live" && Boolean(input.phoneNumberId && input.accessToken),
    },
    create: {
      companyId: user.companyId,
      ...input,
      connected: input.mode === "live",
    },
  });
  revalidatePath("/configuracoes");
}

export async function saveCompany(input: {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  document?: string;
  segment?: string;
}) {
  const { user } = await requireUser();
  await prisma.company.update({
    where: { id: user.companyId },
    data: input,
  });
  revalidatePath("/configuracoes");
}

export async function saveTemplate(input: {
  id?: string;
  name: string;
  category: string;
  body: string;
}) {
  const { user } = await requireUser();
  if (input.id) {
    await prisma.messageTemplate.update({
      where: { id: input.id },
      data: { name: input.name, category: input.category, body: input.body },
    });
  } else {
    await prisma.messageTemplate.create({
      data: { companyId: user.companyId, ...input },
    });
  }
  revalidatePath("/configuracoes");
  revalidatePath("/whatsapp");
}

export async function createUserAccount(input: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  const { user } = await requireUser();
  if (user.role !== "ADMIN") throw new Error("Sem permissão");
  const bcrypt = await import("bcryptjs");
  await prisma.user.create({
    data: {
      companyId: user.companyId,
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash: await bcrypt.hash(input.password, 10),
      role: input.role,
      initials: input.name
        .split(" ")
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase(),
    },
  });
  revalidatePath("/configuracoes");
}
