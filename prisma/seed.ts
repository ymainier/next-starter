import { PrismaClient } from "@prisma/client";

const { DATABASE_URL } = process.env;
if (DATABASE_URL !== "file:./test.db") {
  console.log(`No seeds for ${DATABASE_URL}`);
  process.exit(0);
}

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.session.deleteMany(),
    prisma.user.deleteMany(),
    prisma.user.createMany({
      data: [
        {
          id: "1",
          googleId: "google-id-1",
          name: "Alice",
          email: "alice@example.com",
        },
        {
          id: "2",
          googleId: "google-id-2",
          name: "Bob",
          email: "bob@example.com",
        },
      ],
    }),
  ]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
