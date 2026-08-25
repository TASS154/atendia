import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

export type SessionUser = {
  id: string;
  companyId: string;
  name: string;
  email: string;
  role: string;
  initials: string;
};

const COOKIE = "atendia_session";

function secret() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET ?? "atendia-demo-secret-change-in-production",
  );
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(secret());

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findFirst({
    where: { id: session.id, active: true },
    include: { company: true },
  });
  if (!user) return null;
  return { user, company: user.company, session };
}

export async function requireUser() {
  const ctx = await requireSession();
  if (!ctx) {
    throw new Error("UNAUTHENTICATED");
  }
  return ctx;
}
