"use server";

import prisma from "@/prisma/client";
import { Color } from "@prisma/client";

export async function getPhotosByColor(color: Color) {
  return prisma.photo.findMany({
    where: { color },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}
