import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiKey || !cloudName || !apiSecret) {
    console.error("Cloudinary upload signing is not configured.");
    return NextResponse.json(
      { error: "Photo uploads are not configured." },
      { status: 500 }
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request({ timestamp }, apiSecret);

  return NextResponse.json({
    apiKey,
    cloudName,
    signature,
    timestamp,
  });
}
