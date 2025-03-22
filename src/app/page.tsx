import { checkGetRateLimit } from "@/lib/rate-limit";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { LogoutButton } from "./components";

export default async function Page() {
  if (!(await checkGetRateLimit())) {
    return "Too many requests";
  }
  const { user } = await getCurrentSession();
  if (user === null) {
    return redirect("/login");
  }
  return (
    <>
      <h1>Hi, {user.name}!</h1>
      <img src={user.picture} height="100px" width="100px" alt="profile" />
      <p>Email: {user.email}</p>
      <LogoutButton />
    </>
  );
}
