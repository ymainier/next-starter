import { headers } from "next/headers";
import { TokenBucket } from "@/lib/token-bucket";

export const globalBucket = new TokenBucket<string>(100, 1);

export async function checkGetRateLimit(): Promise<boolean> {
  // Note: Assumes X-Forwarded-For will always be defined.
  const clientIP = (await headers()).get("X-Forwarded-For");
  if (clientIP === null) {
    return true;
  }
  return globalBucket.consume(clientIP, 1);
}

export async function checkPostRateLimit(): Promise<boolean> {
  // Note: Assumes X-Forwarded-For will always be defined.
  const clientIP = (await headers()).get("X-Forwarded-For");
  if (clientIP === null) {
    return true;
  }
  return globalBucket.consume(clientIP, 3);
}
