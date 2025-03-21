import prisma from "@/lib/prisma";

export async function createUser(
  googleId: string,
  email: string,
  name: string,
  picture: string,
): Promise<User> {
  const user = await prisma.user.create({
    data: { googleId, email, name, picture },
  });

  return user;
}

export async function getUserFromGoogleId(
  googleId: string,
): Promise<User | null> {
  return await prisma.user.findUnique({ where: { googleId } });
}

export interface User {
  id: string;
  email: string;
  googleId: string;
  name?: string;
  picture?: string;
}
