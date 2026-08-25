"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { addHistory } from "@/lib/history";

function refresh(id?: string) {
  revalidatePath("/clientes");
  revalidatePath("/dashboard");
  revalidatePath("/recuperacao");
  if (id) revalidatePath(`/clientes/${id}`);
}

export async function createCustomer(input: {
  name: string;
  phone: string;
  email?: string;
  document?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  origin?: string;
  notes?: string;
  ownerId?: string;
  tagIds?: string[];
}) {
  const { user } = await requireUser();
  const customer = await prisma.customer.create({
    data: {
      companyId: user.companyId,
      name: input.name,
      phone: input.phone,
      whatsapp: input.phone,
      email: input.email || null,
      document: input.document || null,
      address: input.address || null,
      neighborhood: input.neighborhood || null,
      city: input.city || "Campinas",
      origin: input.origin || "WhatsApp",
      notes: input.notes || null,
      ownerId: input.ownerId || user.id,
      lastContactAt: new Date(),
      tags: input.tagIds?.length
        ? { create: input.tagIds.map((tagId) => ({ tagId })) }
        : undefined,
    },
  });

  await addHistory({
    customerId: customer.id,
    type: "CONTACT",
    title: "Cliente cadastrado",
    description: `Origem: ${customer.origin}.`,
  });

  refresh(customer.id);
  return customer;
}

export async function updateCustomer(
  id: string,
  data: {
    name?: string;
    phone?: string;
    whatsapp?: string | null;
    email?: string | null;
    document?: string | null;
    address?: string | null;
    neighborhood?: string | null;
    city?: string | null;
    origin?: string | null;
    notes?: string | null;
    ownerId?: string | null;
    nextReturnAt?: Date | null;
  },
) {
  const { user } = await requireUser();
  const existing = await prisma.customer.findFirst({
    where: { id, companyId: user.companyId },
  });
  if (!existing) return;
  await prisma.customer.update({
    where: { id },
    data,
  });
  refresh(id);
}

export async function deleteCustomer(id: string) {
  const { user } = await requireUser();
  await prisma.customer.deleteMany({ where: { id, companyId: user.companyId } });
  refresh();
}

export async function scheduleCustomerReturn(customerId: string, dateIso: string) {
  const { user } = await requireUser();
  const when = new Date(dateIso);
  await prisma.customer.updateMany({
    where: { id: customerId, companyId: user.companyId },
    data: { nextReturnAt: when },
  });
  await prisma.appointment.create({
    data: {
      companyId: user.companyId,
      customerId,
      title: "Retorno",
      type: "RETURN",
      startsAt: when,
      durationMin: 30,
      status: "SCHEDULED",
      professionalId: user.id,
    },
  });
  await addHistory({
    customerId,
    type: "RETURN",
    title: "Retorno agendado",
    description: when.toLocaleString("pt-BR"),
  });
  refresh(customerId);
  revalidatePath("/agenda");
}

export async function addCustomerNote(customerId: string, note: string) {
  const { user } = await requireUser();
  const customer = await prisma.customer.findFirst({
    where: { id: customerId, companyId: user.companyId },
  });
  if (!customer) return;
  await prisma.customer.update({
    where: { id: customerId },
    data: { notes: customer.notes ? `${customer.notes}\n${note}` : note },
  });
  await addHistory({
    customerId,
    type: "NOTE",
    title: "Observação adicionada",
    description: note,
  });
  refresh(customerId);
}
