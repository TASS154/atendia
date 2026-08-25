import type { InboundWhatsAppMessage, WhatsAppMessageResult, WhatsAppService } from "./types";

/**
 * Prepared for WhatsApp Business Cloud API.
 * Replace the mock implementation by wiring these methods to Meta Graph API.
 * Required credentials live in WhatsAppConfig (phoneNumberId, accessToken, etc).
 */
export class CloudWhatsAppService implements WhatsAppService {
  constructor(
    private config: {
      phoneNumberId: string;
      accessToken: string;
    },
  ) {}

  private endpoint() {
    return `https://graph.facebook.com/v21.0/${this.config.phoneNumberId}/messages`;
  }

  async sendMessage(to: string, body: string): Promise<WhatsAppMessageResult> {
    const res = await fetch(this.endpoint(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body },
      }),
    });
    if (!res.ok) {
      return { id: "failed", provider: "cloud" as const, status: "FAILED" as const };
    }
    const json = (await res.json()) as { messages?: { id: string }[] };
    return {
      id: json.messages?.[0]?.id ?? "unknown",
      provider: "cloud" as const,
      status: "SENT" as const,
    };
  }

  async sendTemplate(
    to: string,
    template: string,
    params: Record<string, string>,
  ): Promise<WhatsAppMessageResult> {
    const res = await fetch(this.endpoint(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: template,
          language: { code: "pt_BR" },
          components: [
            {
              type: "body",
              parameters: Object.values(params).map((text) => ({ type: "text", text })),
            },
          ],
        },
      }),
    });
    if (!res.ok) {
      return { id: "failed", provider: "cloud" as const, status: "FAILED" as const };
    }
    const json = (await res.json()) as { messages?: { id: string }[] };
    return {
      id: json.messages?.[0]?.id ?? "unknown",
      provider: "cloud" as const,
      status: "SENT" as const,
    };
  }

  async sendDocument(to: string, url: string, filename: string): Promise<WhatsAppMessageResult> {
    const res = await fetch(this.endpoint(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "document",
        document: { link: url, filename },
      }),
    });
    if (!res.ok) {
      return { id: "failed", provider: "cloud" as const, status: "FAILED" as const };
    }
    const json = (await res.json()) as { messages?: { id: string }[] };
    return {
      id: json.messages?.[0]?.id ?? "unknown",
      provider: "cloud" as const,
      status: "SENT" as const,
    };
  }

  async receiveMessage(payload: unknown): Promise<InboundWhatsAppMessage> {
    const body = payload as {
      entry?: {
        changes?: {
          value?: {
            messages?: { from: string; text?: { body: string }; type: string; timestamp: string }[];
          };
        }[];
      }[];
    };
    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!message) throw new Error("Webhook sem mensagem");
    return {
      from: message.from,
      body: message.text?.body ?? "",
      timestamp: new Date(Number(message.timestamp) * 1000),
      type: message.type,
    };
  }

  async handleWebhook(payload: unknown) {
    await this.receiveMessage(payload);
  }
}
