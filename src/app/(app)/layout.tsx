import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/utils";
import { AppShell } from "@/components/layout/app-shell";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const ctx = await requireSession();
  if (!ctx) redirect("/login");

  const notifications = await prisma.notification.findMany({
    where: { companyId: ctx.user.companyId },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return (
    <AppShell
      company={ctx.company.name}
      user={{
        name: ctx.user.name,
        role: ctx.user.role,
        initials: ctx.user.initials,
      }}
      notifications={serialize(notifications)}
    >
      {children}
    </AppShell>
  );
}
