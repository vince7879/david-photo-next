import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { PhotoPageProps } from "@/app/gallery/[color]/photo/[photoId]/page";

export async function GET(request: NextRequest, { params }: PhotoPageProps) {
    const { color, photoId }  = params
    const photo = await prisma.photo.findFirst({ where: { publicId: photoId, color } })
    
    return NextResponse.json(photo)
}