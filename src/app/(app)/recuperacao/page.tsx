import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getRecoveryCustomers } from "@/lib/queries";
import { serialize } from "@/lib/utils";
import { RecoveryView } from "@/components/recovery/recovery-view";

export default async function RecoveryPage() {
  const ctx = await requireSession();
  if (!ctx) redirect("/login");
  const customers = await getRecoveryCustomers(ctx.user.companyId);
  return <RecoveryView customers={serialize(customers)} />;
}
