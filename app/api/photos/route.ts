import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { createPhotoSchema } from "../../validationSchemas";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const validation = createPhotoSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const photo = validation.data;

  try {
    // Determine the limit by gallery color
    const maxPhotos = photo.color === "blackwhite" ? 48 : 32;

    // count the photos of the current gallery
    const existingPhotosCount = await prisma.photo.count({
      where: {
        color: photo.color,
      },
    });

    // Check the limit
    if (existingPhotosCount >= maxPhotos) {
      throw new Error(
        `This gallery has reached the maximum number of ${maxPhotos} photos.`,
      );
    }

    const newPhoto = await prisma.photo.create({
      data: {
        place: photo.place,
        month: photo.month,
        year: photo.year,
        color: photo.color,
        photoUrl: photo.photoUrl,
        publicId: photo.publicId,
        isPortrait: photo.isPortrait,
        order: existingPhotosCount, // 0-based index
        shotAt: photo.shotAt ? new Date(photo.shotAt) : null,
      },
    });

    revalidatePath(`/gallery/${photo.color}`);
    revalidatePath("/gallery/recent");

    return NextResponse.json(newPhoto, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes("maximum number")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    console.error("❌ Error while creating photo:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while creating the photo." },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const photos = await prisma.photo.findMany();

  return NextResponse.json(photos);
}
