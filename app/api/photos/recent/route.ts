import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import { Photo } from "@prisma/client";

const MONTHS: Record<Photo["month"], number> = {
  janvier: 1,
  février: 2,
  mars: 3,
  avril: 4,
  mai: 5,
  juin: 6,
  juillet: 7,
  août: 8,
  septembre: 9,
  octobre: 10,
  novembre: 11,
  décembre: 12,
};

export async function GET() {
  try {
    // get all photos
    const photos = await prisma.photo.findMany();

    // Transform the month in numbers to properly order them
    const sorted = photos.sort((a, b) => {
      const yearDiff = Number(b.year) - Number(a.year);
      if (yearDiff !== 0) return yearDiff;

      const monthA = MONTHS[a.month.toLowerCase()];
      const monthB = MONTHS[b.month.toLowerCase()];
      return monthB - monthA; // descending sort
    });

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
