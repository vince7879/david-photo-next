"use server";

import prisma from "@/prisma/client";
import { Color } from "@prisma/client";
import { auth } from "@/auth";

export async function getPhotosByColor(color: Color) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return prisma.photo.findMany({
    where: { color },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}
