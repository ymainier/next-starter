import { mergeTests } from "@playwright/test";
import { test as loggedInFixture } from "./fixtures/user-with-session";

export const test = mergeTests(loggedInFixture);
