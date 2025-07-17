import prisma from "@/prisma/client";
import { Photo } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { photoOrders } = body;

  try {
    await prisma.$transaction(
      photoOrders.map(
        ({ id, order }: { id: Photo["id"]; order: Photo["order"] }) =>
          prisma.photo.update({
            where: { id },
            data: { order },
          })
      )
    );

    return NextResponse.json(
      { success: "New order updated successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
