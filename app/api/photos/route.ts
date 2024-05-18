import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { createPhotoSchema } from "../../validationSchemas";

export async function POST(request: NextRequest) {
    const body = await request.json()
    const validation = createPhotoSchema.safeParse(body)

    if(!validation.success) 
        return NextResponse.json(validation.error.format(), { status: 400 })

    const newPhoto = await prisma.photo.create({
        data: { place: body.place, month: body.month, color: body.color }
    })

    return NextResponse.json(newPhoto, { status: 201 })
}