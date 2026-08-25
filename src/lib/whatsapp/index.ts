import { prisma } from "@/lib/prisma";
import { CloudWhatsAppService } from "./cloud";
import { MockWhatsAppService } from "./mock";
import type { WhatsAppService } from "./types";

export type { WhatsAppService } from "./types";

export async function getWhatsAppService(companyId: string): Promise<WhatsAppService> {
  const config = await prisma.whatsAppConfig.findUnique({
    where: { companyId },
  });

  if (
    config?.mode === "live" &&
    config.connected &&
    config.phoneNumberId &&
    config.accessToken
  ) {
    return new CloudWhatsAppService({
      phoneNumberId: config.phoneNumberId,
      accessToken: config.accessToken,
    });
  }

  return new MockWhatsAppService(companyId);
}
