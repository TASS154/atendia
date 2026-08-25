export type WhatsAppMessageResult = {
  id: string;
  provider: "mock" | "cloud";
  status: "SENT" | "FAILED";
};

export type InboundWhatsAppMessage = {
  from: string;
  body: string;
  timestamp: Date;
  type: string;
};

export interface WhatsAppService {
  sendMessage(to: string, body: string, options?: { isAutomated?: boolean }): Promise<WhatsAppMessageResult>;
  sendTemplate(
    to: string,
    template: string,
    params: Record<string, string>,
  ): Promise<WhatsAppMessageResult>;
  sendDocument(
    to: string,
    url: string,
    filename: string,
  ): Promise<WhatsAppMessageResult>;
  receiveMessage(payload: unknown): Promise<InboundWhatsAppMessage>;
  handleWebhook(payload: unknown): Promise<void>;
}
