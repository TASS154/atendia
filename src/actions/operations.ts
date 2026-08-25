"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { addHistory, notify } from "@/lib/history";
import { startAutomations } from "@/lib/automation";
import { getWhatsAppService } from "@/lib/whatsapp";
import { formatTime } from "@/lib/format";
import { interpolate } from "@/lib/utils";
import { formatBRL } from "@/lib/format";

function refresh() {
  revalidatePath("/agenda");
  revalidatePath("/dashboard");
  revalidatePath("/clientes");
  revalidatePath("/financeiro");
  revalidatePath("/whatsapp");
  revalidatePath("/ordens");
  revalidatePath("/recuperacao");
}

export async function createAppointment(input: {
  customerId?: string;
  serviceId?: string;
  professionalId?: string;
  title: string;
  type: string;
  startsAt: string;
  durationMin: number;
  notes?: string;
}) {
  const { user } = await requireUser();
  const startsAt = new Date(input.startsAt);
  const appointment = await prisma.appointment.create({
    data: {
      companyId: user.companyId,
      customerId: input.customerId || null,
      serviceId: input.serviceId || null,
      professionalId: input.professionalId || user.id,
      title: input.title,
      type: input.type,
      startsAt,
      durationMin: input.durationMin,
      status: "SCHEDULED",
      notes: input.notes || null,
    },
    include: { customer: true, service: true },
  });

  if (appointment.customerId && appointment.customer) {
    await addHistory({
      customerId: appointment.customerId,
      type: "APPOINTMENT",
      title: "Serviço agendado",
      description: `${appointment.title} — ${startsAt.toLocaleString("pt-BR")}`,
    });

    const wa = await getWhatsAppService(user.companyId);
    const tpl = await prisma.messageTemplate.findFirst({
      where: { companyId: user.companyId, category: "CONFIRMATION" },
    });
    const body = interpolate(
      tpl?.body ??
        "Olá, {{cliente}}! Passando para confirmar seu agendamento amanhã às {{horario}}.",
      {
        cliente: appointment.customer.name,
        horario: formatTime(startsAt),
      },
    );
    await wa.sendMessage(appointment.customer.phone, body, { isAutomated: true });
    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { confirmationSentAt: new Date(), status: "CONFIRMED" },
    });

    await addHistory({
      customerId: appointment.customerId,
      type: "FOLLOWUP",
      title: "Confirmação automática enviada",
      description: body,
    });

    await startAutomations(user.companyId, "APPOINTMENT_SCHEDULED", {
      customerId: appointment.customerId,
      appointmentId: appointment.id,
      customerName: appointment.customer.name,
      phone: appointment.customer.phone,
      horario: formatTime(startsAt),
    });
  }

  await notify({
    companyId: user.companyId,
    type: "APPOINTMENT",
    title: "Novo agendamento",
    body: appointment.title,
    href: "/agenda",
  });

  refresh();
  return appointment;
}

export async function updateAppointmentStatus(id: string, status: string) {
  const { user } = await requireUser();
  const current = await prisma.appointment.findFirst({
    where: { id, companyId: user.companyId },
  });
  if (!current) return;
  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status },
    include: { customer: true, service: true },
  });

  if (status === "COMPLETED" && appointment.customerId) {
    await prisma.customer.update({
      where: { id: appointment.customerId },
      data: {
        lastServiceAt: new Date(),
        lastContactAt: new Date(),
        visitCount: { increment: 1 },
        nextReturnAt: new Date(Date.now() + 30 * 864e5),
      },
    });
    await addHistory({
      customerId: appointment.customerId,
      type: "SERVICE",
      title: "Serviço concluído",
      description: appointment.title,
    });
    await addHistory({
      customerId: appointment.customerId,
      type: "RETURN",
      title: "Retorno recomendado",
      description: "Retorno sugerido em 30 dias",
    });

    if (appointment.service) {
      await prisma.payment.create({
        data: {
          companyId: user.companyId,
          customerId: appointment.customerId,
          appointmentId: appointment.id,
          description: appointment.service.name,
          amount: appointment.service.price,
          dueDate: new Date(),
          status: "PENDING",
          method: "PIX",
        },
      });
    }

    await startAutomations(user.companyId, "SERVICE_COMPLETED", {
      customerId: appointment.customerId,
      appointmentId: appointment.id,
      customerName: appointment.customer?.name,
      phone: appointment.customer?.phone,
    });
  }

  refresh();
  revalidatePath(`/clientes/${appointment.customerId ?? ""}`);
}

export async function registerPayment(input: {
  customerId: string;
  description: string;
  amount: number;
  dueDate: string;
  method?: string;
  quoteId?: string;
  workOrderId?: string;
  appointmentId?: string;
  markPaid?: boolean;
}) {
  const { user } = await requireUser();
  const paid = Boolean(input.markPaid);
  const payment = await prisma.payment.create({
    data: {
      companyId: user.companyId,
      customerId: input.customerId,
      description: input.description,
      amount: input.amount,
      dueDate: new Date(input.dueDate),
      method: input.method || "PIX",
      quoteId: input.quoteId || null,
      workOrderId: input.workOrderId || null,
      appointmentId: input.appointmentId || null,
      status: paid ? "PAID" : "PENDING",
      paidAt: paid ? new Date() : null,
    },
  });

  if (paid) {
    await prisma.customer.update({
      where: { id: input.customerId },
      data: { totalSpent: { increment: input.amount } },
    });
    await addHistory({
      customerId: input.customerId,
      type: "PAYMENT",
      title: "Pagamento registrado",
      description: `${formatBRL(input.amount)} — ${input.description}`,
    });
  }

  refresh();
  return payment;
}

export async function markPaymentPaid(id: string) {
  const { user } = await requireUser();
  const payment = await prisma.payment.findFirst({
    where: { id, companyId: user.companyId },
  });
  if (!payment) return;
  await prisma.payment.update({
    where: { id },
    data: { status: "PAID", paidAt: new Date() },
  });
  await prisma.customer.update({
    where: { id: payment.customerId },
    data: { totalSpent: { increment: payment.amount } },
  });
  await addHistory({
    customerId: payment.customerId,
    type: "PAYMENT",
    title: "Pagamento registrado",
    description: formatBRL(payment.amount),
  });
  refresh();
}

export async function createWorkOrder(input: {
  customerId: string;
  serviceId?: string;
  quoteId?: string;
  professionalId?: string;
  description?: string;
  materials?: string;
  value: number;
  status?: string;
  notes?: string;
}) {
  const { user } = await requireUser();
  const count = await prisma.workOrder.count({ where: { companyId: user.companyId } });
  const os = await prisma.workOrder.create({
    data: {
      companyId: user.companyId,
      number: `OS-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`,
      customerId: input.customerId,
      serviceId: input.serviceId || null,
      quoteId: input.quoteId || null,
      professionalId: input.professionalId || user.id,
      description: input.description || null,
      materials: input.materials || null,
      value: input.value,
      status: input.status || "OPEN",
      date: new Date(),
      notes: input.notes || null,
    },
  });
  await addHistory({
    customerId: input.customerId,
    type: "SERVICE",
    title: `Ordem de serviço ${os.number} aberta`,
    description: input.description,
  });
  revalidatePath("/ordens");
  revalidatePath("/dashboard");
  return os;
}

export async function updateWorkOrderStatus(id: string, status: string) {
  const { user } = await requireUser();
  const current = await prisma.workOrder.findFirst({
    where: { id, companyId: user.companyId },
  });
  if (!current) return;
  const os = await prisma.workOrder.update({
    where: { id },
    data: { status },
  });
  if (status === "COMPLETED") {
    await addHistory({
      customerId: os.customerId,
      type: "SERVICE",
      title: `OS ${os.number} concluída`,
    });
    await prisma.customer.update({
      where: { id: os.customerId },
      data: {
        lastServiceAt: new Date(),
        visitCount: { increment: 1 },
      },
    });
  }
  revalidatePath("/ordens");
  revalidatePath(`/ordens/${id}`);
}

export async function createTask(input: {
  title: string;
  description?: string;
  ownerId?: string;
  customerId?: string;
  dueDate?: string;
  priority: string;
}) {
  const { user } = await requireUser();
  await prisma.task.create({
    data: {
      companyId: user.companyId,
      title: input.title,
      description: input.description || null,
      ownerId: input.ownerId || user.id,
      customerId: input.customerId || null,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      priority: input.priority,
      status: "TODO",
    },
  });
  revalidatePath("/tarefas");
  revalidatePath("/dashboard");
}

export async function updateTaskStatus(id: string, status: string) {
  const { user } = await requireUser();
  await prisma.task.updateMany({
    where: { id, companyId: user.companyId },
    data: { status },
  });
  revalidatePath("/tarefas");
}

export async function createService(input: {
  name: string;
  description?: string;
  price: number;
  durationMin: number;
  category: string;
}) {
  const { user } = await requireUser();
  await prisma.service.create({
    data: {
      companyId: user.companyId,
      name: input.name,
      description: input.description || null,
      price: input.price,
      durationMin: input.durationMin,
      category: input.category,
      active: true,
    },
  });
  revalidatePath("/servicos");
  revalidatePath("/configuracoes");
}

export async function toggleService(id: string, active: boolean) {
  const { user } = await requireUser();
  await prisma.service.updateMany({
    where: { id, companyId: user.companyId },
    data: { active },
  });
  revalidatePath("/servicos");
}
