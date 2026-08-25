import { prisma } from "./prisma";
import { addDays, addHours, interpolate } from "./utils";
import { getWhatsAppService } from "./whatsapp";
import { addHistory, notify } from "./history";
import { formatTime } from "./format";

type StepConfig = {
  days?: number;
  hours?: number;
  kind?: string;
  action?: string;
  message?: string;
  title?: string;
  body?: string;
  href?: string;
};

type RunContext = {
  customerId?: string;
  leadId?: string;
  quoteId?: string;
  appointmentId?: string;
  customerName?: string;
  phone?: string;
  horario?: string;
};

export async function startAutomations(
  companyId: string,
  trigger: string,
  context: RunContext,
) {
  const automations = await prisma.automation.findMany({
    where: { companyId, trigger, active: true },
    include: { steps: { orderBy: { order: "asc" } } },
  });

  for (const automation of automations) {
    const first = automation.steps[0];
    const nextRunAt =
      first?.type === "WAIT" ? waitUntil(parseConfig(first.config)) : new Date();

    await prisma.automationRun.create({
      data: {
        automationId: automation.id,
        customerId: context.customerId,
        quoteId: context.quoteId,
        leadId: context.leadId,
        appointmentId: context.appointmentId,
        currentStep: 0,
        nextRunAt,
        status: "ACTIVE",
        context: JSON.stringify(context),
      },
    });
  }

  await processDueAutomations(companyId);
}

function parseConfig(raw: string): StepConfig {
  try {
    return JSON.parse(raw) as StepConfig;
  } catch {
    return {};
  }
}

function waitUntil(config: StepConfig) {
  if (config.hours) return addHours(new Date(), config.hours);
  return addDays(new Date(), config.days ?? 1);
}

export async function processDueAutomations(companyId?: string) {
  const runs = await prisma.automationRun.findMany({
    where: {
      status: "ACTIVE",
      nextRunAt: { lte: new Date() },
      ...(companyId ? { automation: { companyId } } : {}),
    },
    include: {
      automation: {
        include: { steps: { orderBy: { order: "asc" } }, company: true },
      },
    },
  });

  for (const run of runs) {
    await executeRun(run.id);
  }
}

async function executeRun(runId: string) {
  const run = await prisma.automationRun.findUnique({
    where: { id: runId },
    include: {
      automation: {
        include: { steps: { orderBy: { order: "asc" } } },
      },
    },
  });
  if (!run || run.status !== "ACTIVE") return;

  const steps = run.automation.steps;
  let index = run.currentStep;
  const context = (run.context ? JSON.parse(run.context) : {}) as RunContext;

  while (index < steps.length) {
    const step = steps[index];
    const config = parseConfig(step.config);

    if (step.type === "WAIT") {
      const alreadyWaited =
        run.currentStep === index &&
        run.nextRunAt !== null &&
        run.nextRunAt.getTime() <= Date.now() + 1000;
      if (alreadyWaited) {
        index += 1;
        continue;
      }
      const due = waitUntil(config);
      await prisma.automationRun.update({
        where: { id: run.id },
        data: { currentStep: index, nextRunAt: due },
      });
      return;
    }

    if (step.type === "CONDITION") {
      const ok = await evaluateCondition(config, context);
      if (!ok) {
        await prisma.automationRun.update({
          where: { id: run.id },
          data: { status: "COMPLETED", currentStep: index },
        });
        return;
      }
      index += 1;
      continue;
    }

    if (step.type === "ACTION") {
      await executeAction(run.automation.companyId, config, context);
      index += 1;
    } else {
      index += 1;
    }
  }

  await prisma.automationRun.update({
    where: { id: run.id },
    data: { status: "COMPLETED", currentStep: index, nextRunAt: null },
  });
}

async function evaluateCondition(config: StepConfig, context: RunContext) {
  if (config.kind === "always") return true;

  if (config.kind === "quote_unanswered" && context.quoteId) {
    const quote = await prisma.quote.findUnique({ where: { id: context.quoteId } });
    return quote ? ["SENT", "VIEWED", "NEGOTIATING"].includes(quote.status) : false;
  }

  if (config.kind === "customer_inactive" && context.customerId) {
    const customer = await prisma.customer.findUnique({
      where: { id: context.customerId },
    });
    if (!customer?.lastServiceAt && !customer?.lastContactAt) return true;
    const ref = customer.lastServiceAt ?? customer.lastContactAt!;
    return Date.now() - ref.getTime() > 30 * 864e5;
  }

  return true;
}

async function executeAction(
  companyId: string,
  config: StepConfig,
  context: RunContext,
) {
  if (config.action === "SEND_WHATSAPP" && context.phone && config.message) {
    const vars = {
      cliente: context.customerName ?? "cliente",
      horario: context.horario ?? "",
    };
    const body = interpolate(config.message, vars);
    const wa = await getWhatsAppService(companyId);
    await wa.sendMessage(context.phone, body, { isAutomated: true });

    if (context.customerId) {
      await addHistory({
        customerId: context.customerId,
        type: "FOLLOWUP",
        title: "Follow-up automático enviado",
        description: body,
      });
      await prisma.customer.update({
        where: { id: context.customerId },
        data: { lastContactAt: new Date() },
      });
    }

    await notify({
      companyId,
      type: "FOLLOWUP",
      title: "Follow-up realizado",
      body: `Mensagem automática enviada para ${context.customerName ?? context.phone}.`,
      href: "/whatsapp",
    });
  }

  if (config.action === "NOTIFY") {
    await notify({
      companyId,
      type: "AUTOMATION",
      title: config.title ?? "Automação",
      body: config.body ?? "",
      href: config.href,
    });
  }
}

export async function runAutomationNow(runId: string) {
  await prisma.automationRun.update({
    where: { id: runId },
    data: { nextRunAt: new Date() },
  });
  await executeRun(runId);
}
