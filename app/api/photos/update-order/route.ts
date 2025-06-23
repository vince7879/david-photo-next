import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { photoOrders } = body;

  try {
    await prisma.$transaction(async (prisma) => {
        for (const [index, photo] of photoOrders.entries()) {
        await prisma.photo.update({
          where: { id: photo.id,  },
          data: { order: index },
        });
      }
    });

    return NextResponse.json({ success: "new order updated successfully."}, { status: 201 })
  } catch (error) {
    console.error('Error updating order:', error);
  }
};
