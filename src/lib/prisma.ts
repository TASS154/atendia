import { PrismaClient } from "@prisma/client";
import { copyFileSync, existsSync } from "fs";
import path from "path";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function resolveDatabaseUrl() {
  const fromEnv = process.env.DATABASE_URL ?? "file:./dev.db";

  if (!process.env.VERCEL) {
    return fromEnv;
  }

  const tmpDb = "/tmp/atendia.db";
  const candidates = [
    path.join(process.cwd(), "prisma", "dev.db"),
    path.join(process.cwd(), "dev.db"),
  ];

  if (!existsSync(tmpDb)) {
    const source = candidates.find((file) => existsSync(file));
    if (source) {
      copyFileSync(source, tmpDb);
    }
  }

  return `file:${tmpDb}`;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: { db: { url: resolveDatabaseUrl() } },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
