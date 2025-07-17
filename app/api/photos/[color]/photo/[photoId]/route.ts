import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { PhotoPageProps } from "@/app/gallery/[color]/photo/[photoId]/page";

export async function GET(request: NextRequest, { params }: PhotoPageProps) {
  const { color, photoId } = params;
  const photo = await prisma.photo.findUnique({
    where: { publicId: photoId, color },
  });

  return NextResponse.json(photo);
}

export async function PATCH(request: NextRequest, { params }: PhotoPageProps) {
  const { color: oldColor, photoId } = params;
  const body = await request.json();
  const newColor = body.color;
  const photo = await prisma.photo.findUnique({
    where: { publicId: photoId, color: oldColor },
  });

  if (!photo)
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });

  // if the color doesn't change, simple update, no need to recalculate the order
  if (oldColor === newColor) {
    const updatedPhoto = await prisma.photo.update({
      where: { id: photo.id },
      data: {
        place: body.place,
        year: body.year,
        month: body.month,
        updatedAt: new Date(), // to guarantee that field is updated
      },
    });

    return NextResponse.json(updatedPhoto);
  }

  try {
    const updatedPhoto = await prisma.$transaction(async (tx) => {
      // 1. Check if the target gallery doesn't reach the max nb of photos (32)
      const targetGalleryCount = await tx.photo.count({
        where: { color: newColor },
      });
      
      if (targetGalleryCount >= 32) {
        throw new Error("This gallery already has the maximum number of photos (32).");
      }

      // 2. update the "order" values of the old gallery
      await tx.photo.updateMany({
        where: {
          color: oldColor,
          order: {
            gt: photo.order,
          },
        },
        data: {
          order: {
            decrement: 1,
          },
        },
      });

      // 3. Update the photo with the new data
      return await tx.photo.update({
        where: { id: photo.id },
        data: {
          place: body.place,
          year: body.year,
          month: body.month,
          color: newColor,
          order: targetGalleryCount, // The photo goes at the end of the target gallery
        },
      });
    });

    return NextResponse.json(updatedPhoto);
  } catch (error: any) {
    if (error.message?.includes("maximum number")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    console.error("❌ Error while updating photo with color change:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while updating the photo." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: PhotoPageProps) {
  const { color, photoId } = params;

  const photo = await prisma.photo.findUnique({
    where: { publicId: photoId, color },
  });

  if (!photo)
    return NextResponse.json({ error: "Invalid photo" }, { status: 404 });

  const deletedPhotoOrder = photo.order;

  try {
    await prisma.$transaction([
      // 1. delete the photo
      prisma.photo.delete({
        where: { id: photo.id },
      }),

      // 2. update the order values of the following photos
      prisma.photo.updateMany({
        where: {
          color,
          order: {
            gt: deletedPhotoOrder,
          },
        },
        data: {
          order: {
            decrement: 1,
          },
        },
      }),
    ]);

    return NextResponse.json({});
  } catch (error) {
    console.error("Photo deletion failed:", error);
    return NextResponse.json(
      { error: "Failed to delete photo and update order." },
      { status: 500 }
    );
  }
}
