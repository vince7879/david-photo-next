import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { createPhotoSchema } from "../../validationSchemas";

export async function POST(request: NextRequest) {
    const body = await request.json()
    const validation = createPhotoSchema.safeParse(body)

    if(!validation.success) 
        return NextResponse.json(validation.error.format(), { status: 400 })

    const newPhoto = await prisma.photo.create({
        data: { 
            place: body.place, 
            month: body.month, 
            color: body.color, 
            photoUrl: body.photoUrl, 
            publicId: body.publicId 
        }
    })

    return NextResponse.json(newPhoto, { status: 201 })
}

export async function GET(request: NextRequest) {
    const photos = await prisma.photo.findMany()

    return NextResponse.json(photos)
}