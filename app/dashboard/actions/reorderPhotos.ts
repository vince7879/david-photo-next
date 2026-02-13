"use server";

import prisma from "@/prisma/client";
import { Color } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function reorderPhotos(
  updates: { id: number; order: number }[],
  color: Color,
) {
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
