import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { createPhotoSchema } from "../../validationSchemas";

export async function POST(request: NextRequest) {
    const body = await request.json()
    const validation = createPhotoSchema.safeParse(body)

    if(!validation.success) 
        return NextResponse.json(validation.error.format(), { status: 400 })

    // to count the photos of the current gallery
    const existingPhotosCount = await prisma.photo.count({
        where: {
            color: body.color,
        },
    });

    // Check the limit
    if (existingPhotosCount >= 32) {
        return NextResponse.json(
            { message: "This gallery has reached the maximum number of 32 photos" },
            { status: 403 } 
        );
    }

    const newPhoto = await prisma.photo.create({
        data: { 
            place: body.place,
            month: body.month,
            year: body.year,
            color: body.color,
            photoUrl: body.photoUrl,
            publicId: body.publicId,
            isPortrait: body.isPortrait,
            order: existingPhotosCount, // 0-based index
        }
    })

    return NextResponse.json(newPhoto, { status: 201 })
}

export async function GET(request: NextRequest) {
    const photos = await prisma.photo.findMany()

    return NextResponse.json(photos)
}