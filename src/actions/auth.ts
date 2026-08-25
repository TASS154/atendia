"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/auth";

async function signIn(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
  if (!user || !user.active) {
    return { error: "E-mail ou senha inválidos." };
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return { error: "E-mail ou senha inválidos." };
  }
  await createSession({
    id: user.id,
    companyId: user.companyId,
    name: user.name,
    email: user.email,
    role: user.role,
    initials: user.initials,
  });
  return { error: null as string | null };
}

export async function loginAction(formData: FormData) {
  const result = await signIn(
    String(formData.get("email") ?? ""),
    String(formData.get("password") ?? ""),
  );
  if (result.error) return result;
  redirect("/dashboard");
}

export async function demoLoginAction() {
  const result = await signIn("ivan.p@example.net", "demo1234");
  if (result.error) {
    redirect("/login?error=1");
  }
  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
