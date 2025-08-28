import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const recentPhotos = await prisma.photo.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 16,
    });

    return NextResponse.json(recentPhotos);
  } catch (error) {
    console.error("❌ Error fetching recent photos:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent photos." },
      { status: 500 }
    );
  }
}
