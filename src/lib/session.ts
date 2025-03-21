import { encodeBase32, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { cookies } from "next/headers";
import { cache } from "react";

import type { User } from "./user";
import prisma from "./prisma";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const sessionWithUser = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { User: true },
  });

  if (sessionWithUser === null || sessionWithUser.User === null) {
    return { session: null, user: null };
  }

  const session: Session = {
    id: sessionWithUser.id,
    userId: sessionWithUser.userId,
    expiresAt: new Date(sessionWithUser.expiresAt * 1000),
  };
  const user: User = {
    id: sessionWithUser.User.id,
    googleId: sessionWithUser.User.googleId,
    email: sessionWithUser.User.email,
    name: sessionWithUser.User.name,
    picture: sessionWithUser.User.picture,
  };
  if (Date.now() >= session.expiresAt.getTime()) {
    await prisma.session.delete({ where: { id: session.id } });
    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15) {
    session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
    await prisma.session.update({
      where: { id: session.id },
      data: { expiresAt: Math.floor(session.expiresAt.getTime() / 1000) },
    });
  }
  return { session, user };
}

export const getCurrentSession = cache(
  async (): Promise<SessionValidationResult> => {
    const token = (await cookies()).get("session")?.value ?? null;
    if (token === null) {
      return { session: null, user: null };
    }
    return validateSessionToken(token);
  },
);

export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.session.delete({ where: { id: sessionId } });
}

export async function invalidateUserSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } });
}

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date,
): Promise<void> {
  (await cookies()).set("session", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  (await cookies()).set("session", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });
}

export function generateSessionToken(): string {
  const tokenBytes = new Uint8Array(20);
  crypto.getRandomValues(tokenBytes);
  const token = encodeBase32(tokenBytes).toLowerCase();
  return token;
}

export async function createSession(
  token: string,
  userId: string,
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + DAY_IN_MS * 30),
  };
  await prisma.session.create({
    data: {
      id: session.id,
      userId: session.userId,
      expiresAt: Math.floor(session.expiresAt.getTime() / 1000),
    },
  });

  return session;
}

export interface Session {
  id: string;
  expiresAt: Date;
  userId: string;
}

type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
