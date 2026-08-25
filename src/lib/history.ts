import { prisma } from "./prisma";

export async function addHistory(input: {
  customerId: string;
  type: string;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
}) {
  return prisma.customerHistory.create({
    data: {
      customerId: input.customerId,
      type: input.type,
      title: input.title,
      description: input.description,
      metadata: input.metadata ? JSON.stringify(input.metadata) : undefined,
      createdAt: input.createdAt,
    },
  });
}

export async function notify(input: {
  companyId: string;
  type: string;
  title: string;
  body: string;
  href?: string;
  userId?: string;
}) {
  return prisma.notification.create({ data: input });
}
