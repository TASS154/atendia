import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/utils";
import { ServicesView } from "@/components/catalog/services-view";

export default async function ServicesPage() {
  const ctx = await requireSession();
  if (!ctx) redirect("/login");
  const [services, categories] = await Promise.all([
    prisma.service.findMany({
      where: { companyId: ctx.user.companyId },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({ where: { companyId: ctx.user.companyId } }),
  ]);
  return <ServicesView services={serialize(services)} categories={serialize(categories)} />;
}
