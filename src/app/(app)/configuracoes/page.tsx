import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/utils";
import { SettingsView } from "@/components/settings/settings-view";

export default async function SettingsPage() {
  const ctx = await requireSession();
  if (!ctx) redirect("/login");
  const [users, templates, wa, categories] = await Promise.all([
    prisma.user.findMany({ where: { companyId: ctx.user.companyId } }),
    prisma.messageTemplate.findMany({ where: { companyId: ctx.user.companyId } }),
    prisma.whatsAppConfig.findUnique({ where: { companyId: ctx.user.companyId } }),
    prisma.category.findMany({ where: { companyId: ctx.user.companyId } }),
  ]);
  return (
    <SettingsView
      company={serialize(ctx.company)}
      users={serialize(users)}
      templates={serialize(templates)}
      whatsapp={serialize(wa)}
      categories={serialize(categories)}
      role={ctx.user.role}
    />
  );
}
