import { processDueAutomations } from "@/lib/automation";

export async function POST() {
  await processDueAutomations();
  return Response.json({ ok: true });
}

export async function GET() {
  await processDueAutomations();
  return Response.json({ ok: true });
}
