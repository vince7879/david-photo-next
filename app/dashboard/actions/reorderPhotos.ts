"use server";

import prisma from "@/prisma/client";
import { Color } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function reorderPhotos(
  updates: { id: number; order: number }[],
  color: Color,
) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await prisma.$transaction(
    updates.map((photo) =>
      prisma.photo.update({
        where: { id: photo.id },
        data: { order: photo.order },
      }),
    ),
  );

  revalidatePath(`/gallery/${color}`);
}
