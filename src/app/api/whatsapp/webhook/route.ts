import { prisma } from "@/lib/prisma";
import { getWhatsAppService } from "@/lib/whatsapp";
import { notify } from "@/lib/history";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  const config = await prisma.whatsAppConfig.findFirst();
  if (mode === "subscribe" && token && config?.verifyToken === token) {
    return new Response(challenge ?? "", { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const config = await prisma.whatsAppConfig.findFirst();
  if (!config) return Response.json({ ok: false }, { status: 400 });

  const service = await getWhatsAppService(config.companyId);
  try {
    await service.handleWebhook(payload);
    await notify({
      companyId: config.companyId,
      type: "LEAD",
      title: "Mensagem recebida",
      body: "Uma nova mensagem chegou pelo WhatsApp.",
      href: "/whatsapp",
    });
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  return Response.json({ ok: true });
}
