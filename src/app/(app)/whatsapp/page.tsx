import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/utils";
import { Inbox } from "@/components/whatsapp/inbox";

export default async function WhatsAppPage() {
  const ctx = await requireSession();
  if (!ctx) redirect("/login");
  const [conversations, templates] = await Promise.all([
    prisma.conversation.findMany({
      where: { companyId: ctx.user.companyId },
      include: {
        customer: true,
        lead: true,
        owner: true,
        messages: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { lastMessageAt: "desc" },
    }),
    prisma.messageTemplate.findMany({
      where: { companyId: ctx.user.companyId },
    }),
  ]);
  return (
    <Inbox
      conversations={serialize(conversations)}
      templates={serialize(templates)}
    />
  );
}
