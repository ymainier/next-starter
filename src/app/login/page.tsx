import { checkGetRateLimit } from "@/lib/rate-limit";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Page() {
  if (!checkGetRateLimit()) {
    return "Too many requests";
  }
  const { user } = await getCurrentSession();
  if (user !== null) {
    return redirect("/");
  }
  return (
    <>
      <h1>Sign in</h1>
      <a href="/login/google">Sign in with Google</a>
    </>
  );
}
