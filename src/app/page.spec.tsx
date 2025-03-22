import { checkGetRateLimit } from "@/lib/rate-limit";
import { getCurrentSession } from "@/lib/session";
import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { redirect } from "next/navigation";
import Page from "./page";

vi.mock("@/lib/rate-limit");
vi.mock("@/lib/session");
vi.mock("next/navigation");

it("display some user info", async () => {
  const session = {
    user: {
      id: "user-1",
      googleId: "google-id-1",
      name: "Yann",
      picture: "https://example.com/yann.jpg",
      email: "user@gmail.com",
    },
    session: {
      id: "session-1",
      userId: "user-1",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  };
  vi.mocked(checkGetRateLimit).mockResolvedValue(true);
  vi.mocked(getCurrentSession).mockResolvedValue(session);

  // unit testing server components is still tricky at the moment
  render(await Page());
  expect(
    screen.getByText(new RegExp(session.user.name, "i")),
  ).toBeInTheDocument();
});

it("redirects to login if user is null", async () => {
  vi.mocked(checkGetRateLimit).mockResolvedValue(true);
  vi.mocked(getCurrentSession).mockResolvedValue({ session: null, user: null });

  render(await Page());
  expect(vi.mocked(redirect)).toHaveBeenCalledWith("/login");
});

it("shows 'Too many requests' if rate limit is exceeded", async () => {
  vi.mocked(checkGetRateLimit).mockResolvedValue(false);

  render(await Page());
  expect(
    screen.getByText(new RegExp("Too many requests", "i")),
  ).toBeInTheDocument();
});
