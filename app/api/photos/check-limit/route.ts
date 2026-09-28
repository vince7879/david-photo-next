import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { color } = body;

  if (!color) {
    return NextResponse.json(
      { error: "Color is required" },
      { status: 400 }
    );
  }

  try {
    // determine the limit by gallery
    const maxPhotos = color === "blackwhite" ? 48 : 32;

    // count the photos of the current gallery
    const existingPhotosCount = await prisma.photo.count({
      where: { color },
    });

    // check the limit
    if (existingPhotosCount >= maxPhotos) {
      return NextResponse.json(
        { error: `This gallery has reached the maximum number of ${maxPhotos} photos.` },
        { status: 403 }
      );
    }

    // The gallery has room, we can proceed
    return NextResponse.json(
      { ok: true, currentCount: existingPhotosCount, maxPhotos },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error checking photo limit:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
