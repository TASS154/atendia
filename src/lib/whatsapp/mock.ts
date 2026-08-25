import { prisma } from "@/lib/prisma";
import type { InboundWhatsAppMessage, WhatsAppMessageResult, WhatsAppService } from "./types";

async function findOrCreateConversation(companyId: string, phone: string) {
  const existing = await prisma.conversation.findFirst({
    where: { companyId, phone },
  });
  if (existing) return existing;

  const customer = await prisma.customer.findFirst({
    where: { companyId, OR: [{ phone }, { whatsapp: phone }] },
  });
  const lead = customer
    ? null
    : await prisma.lead.findFirst({
        where: { companyId, phone, convertedCustomerId: null },
      });

  return prisma.conversation.create({
    data: {
      companyId,
      phone,
      customerId: customer?.id,
      leadId: lead?.id,
      status: "OPEN",
    },
  });
}

export class MockWhatsAppService implements WhatsAppService {
  constructor(private companyId: string) {}

  async sendMessage(
    to: string,
    body: string,
    options?: { isAutomated?: boolean },
  ): Promise<WhatsAppMessageResult> {
    const conversation = await findOrCreateConversation(this.companyId, to);
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        direction: "OUT",
        body,
        type: "text",
        status: "SENT",
        isAutomated: options?.isAutomated ?? false,
      },
    });
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessage: body.slice(0, 180),
        lastMessageAt: new Date(),
        status: "OPEN",
      },
    });
    return { id: message.id, provider: "mock", status: "SENT" };
  }

  async sendTemplate(
    to: string,
    template: string,
    params: Record<string, string>,
  ): Promise<WhatsAppMessageResult> {
    const body = template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => params[key] ?? "");
    return this.sendMessage(to, body, { isAutomated: true });
  }

  async sendDocument(to: string, url: string, filename: string) {
    return this.sendMessage(to, `Documento enviado: ${filename}\n${url}`);
  }

  async receiveMessage(payload: unknown): Promise<InboundWhatsAppMessage> {
    const data = payload as { from?: string; body?: string; type?: string };
    if (!data.from || !data.body) {
      throw new Error("Payload de mensagem inválido");
    }
    return {
      from: data.from,
      body: data.body,
      timestamp: new Date(),
      type: data.type ?? "text",
    };
  }

  async handleWebhook(payload: unknown) {
    const inbound = await this.receiveMessage(payload);
    const conversation = await findOrCreateConversation(this.companyId, inbound.from);
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        direction: "IN",
        body: inbound.body,
        type: inbound.type,
        status: "DELIVERED",
      },
    });
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessage: inbound.body.slice(0, 180),
        lastMessageAt: new Date(),
        unreadCount: { increment: 1 },
        status: "OPEN",
      },
    });

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
  }
}
