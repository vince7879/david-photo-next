"use server";

import prisma from "@/prisma/client";

export async function reorderPhotos(updates: { id: number; order: number }[]) {
  await prisma.$transaction(
    updates.map((photo) =>
      prisma.photo.update({
        where: { id: photo.id },
        data: { order: photo.order },
      }),
    ),
  );
}
