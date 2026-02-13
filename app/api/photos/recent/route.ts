import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import { sortPhotosByDateDesc } from "@/app/constants";

export async function GET() {
  try {
    // get all photos
    const photos = await prisma.photo.findMany();

    // Sort photos from most recent to least recent
    const sorted = photos.sort(sortPhotosByDateDesc);

    // Keep only the 16 most recent
    const recentPhotos = sorted.slice(0, 16);

    return NextResponse.json(recentPhotos);
  } catch (error) {
    console.error("❌ Error fetching recent photos:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent photos." },
      { status: 500 }
    );
  }
}
