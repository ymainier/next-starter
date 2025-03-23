import prisma from "@/lib/prisma";
import { createSession, generateSessionToken } from "@/lib/session";
import { createUser, type User } from "@/lib/user";
import { faker } from "@faker-js/faker";
import { test as base } from "@playwright/test";

// Declare the types of your fixtures.
type LoggedInUser = {
  loggedInUser: User;
};

// Extend base test by providing "todoPage" and "settingsPage".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = base.extend<LoggedInUser>({
  loggedInUser: async ({ context }, use) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = faker.person.fullName({ firstName, lastName });
    const email = faker.internet.email({
      firstName,
      lastName,
      provider: "gmail",
    });
    // create a new user
    const user = await createUser(
      `google-id-${Date.now()}`,
      email,
      name,
      faker.image.avatar(),
    );
    // create a session
    const token = generateSessionToken();
    const session = await createSession(token, user.id);
    // drop the session cookie
    await context.addCookies([
      {
        name: "session",
        value: token,
        domain: "127.0.0.1",
        path: "/",
        httpOnly: true,
        sameSite: "Lax",
        expires: Math.floor(session.expiresAt.getTime() / 1000),
      },
    ]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(user);

    // clear the cookie and the database
    await context.clearCookies({ name: "session" });
    await prisma.session.delete({ where: { id: session.id } });
    await prisma.user.delete({ where: { id: user.id } });
  },
});
