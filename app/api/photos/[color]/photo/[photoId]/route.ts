import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { PhotoPageProps } from "@/app/gallery/[color]/photo/[photoId]/page";

export async function GET(request: NextRequest, { params }: PhotoPageProps) {
  const { color, photoId } = params;
  const photo = await prisma.photo.findUnique({
    where: { publicId: photoId, color },
  });

  return NextResponse.json(photo);
}

export async function PATCH(request: NextRequest, { params }: PhotoPageProps) {
  const { color, photoId } = params;
  const body = await request.json();

  const photo = await prisma.photo.findUnique({
    where: { publicId: photoId, color },
  });

  if (!photo)
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });

  const updatedPhoto = await prisma.photo.update({
    where: { id: photo.id },
    data: {
      place: body.place,
      year: body.year,
      month: body.month,
      color: body.color,
    },
  });

  return NextResponse.json(updatedPhoto);
}

export async function DELETE(request: NextRequest, { params }: PhotoPageProps) {
  const { color, photoId } = params;

  const photo = await prisma.photo.findUnique({
    where: { publicId: photoId, color },
  });

  if (!photo)
    return NextResponse.json({ error: "Invalid photo" }, { status: 404 });

  await prisma.photo.delete({
    where: { id: photo.id },
  });

  return NextResponse.json({});
}
