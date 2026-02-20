import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { PhotoPageProps } from "@/app/gallery/[color]/photo/[photoId]/page";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

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

    revalidatePath(`/gallery/${oldColor}`);
    revalidatePath("/gallery/recent");

    return NextResponse.json(updatedPhoto);
  }

  try {
    const updatedPhoto = await prisma.$transaction(async (tx) => {
      // Determine the limit by gallery color
      const maxPhotos = newColor === "blackwhite" ? 48 : 32;

      // 1. Check if the target gallery doesn't reach the max nb of photos
      const targetGalleryCount = await tx.photo.count({
        where: { color: newColor },
      });

      if (targetGalleryCount >= maxPhotos) {
        throw new Error(
          `This gallery already has the maximum number of photos (${maxPhotos}).`,
        );
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

    revalidatePath(`/gallery/${oldColor}`);
    revalidatePath(`/gallery/${newColor}`);
    revalidatePath("/gallery/recent");

    return NextResponse.json(updatedPhoto);
  } catch (error: any) {
    if (error.message?.includes("maximum number")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    console.error("❌ Error while updating photo with color change:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while updating the photo." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: PhotoPageProps) {
  const { color, photoId } = params;

  try {
    // 1. Check if the photo exists
    const photo = await prisma.photo.findUnique({
      where: { publicId: photoId, color },
    });

    if (!photo) {
      return NextResponse.json({ error: "Photo not found." }, { status: 404 });
    }

    // 2. transaction DB : detetion + new order for the gallery
    const deletedPhoto = await prisma.$transaction(async (tx) => {
      // update the order values of the following photos
      await tx.photo.updateMany({
        where: {
          color,
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

      // delete the photo from the DB
      return tx.photo.delete({
        where: { id: photo.id },
      });
    });

    // 3. delete the photo from Cloudinary (after the DB transaction to avoid inconsistencies in case of Cloudinary failure)
    try {
      await cloudinary.uploader.destroy(deletedPhoto.publicId);
    } catch (cloudinaryError) {
      console.error("⚠️ Cloudinary deletion failed:", cloudinaryError);
      // we do not block the response: the DB is already consistent
    }

    revalidatePath(`/gallery/${color}`);
    revalidatePath("/gallery/recent");

    return NextResponse.json(
      { success: "Photo deleted successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ Error deleting photo:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred while deleting the photo." },
      { status: 500 },
    );
  }
}
