import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { GalleryPageProps } from "@/app/gallery/[color]/page";

export async function GET(request: NextRequest, { params }: GalleryPageProps) {
    const { color } = params
    const photos = await prisma.photo.findMany({ 
        where: { color }, 
        orderBy: [
            // First sort by the `order` column in ascending order
            { order: 'asc' },
            // If `order` is NULL, sort by `createdAt` in ascending order
            { createdAt: 'asc' },
        ], 
    })
    
    return NextResponse.json(photos)
}