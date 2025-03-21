"use server";

import { checkPostRateLimit } from "@/lib/rate-limit";
import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from "@/lib/session";
import { redirect } from "next/navigation";

export async function logoutAction(): Promise<ActionResult> {
  if (!checkPostRateLimit()) {
    return {
      message: "Too many requests",
    };
  }
  const { session } = await getCurrentSession();
  if (session === null) {
    return {
      message: "Not authenticated",
    };
  }
  invalidateSession(session.id);
  deleteSessionTokenCookie();
  return redirect("/login");
}

interface ActionResult {
  message: string;
}
