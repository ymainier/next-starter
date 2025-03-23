import { expect } from "@playwright/test";
import { test } from "../test";

test.describe("/", () => {
  test("should display the logged-in user name", async ({
    loggedInUser,
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByRole("heading")).toHaveText(
      new RegExp(loggedInUser.name, "i"),
    );
  });

  test("should redirect to /login if the user is not logged in", async ({
    page,
  }) => {
    await page.goto("/");

    expect(page.url()).toBe("http://127.0.0.1:3000/login");
  });
});
