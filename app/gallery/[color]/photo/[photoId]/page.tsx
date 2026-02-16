import prisma from "@/prisma/client";
import { Photo as TPhoto } from "@prisma/client";
import PhotoPageClient from "./PhotoPageClient";

export const dynamic = "force-static";
export const revalidate = 3600;

export interface PhotoPageProps {
  params: { color: TPhoto["color"]; photoId: TPhoto["publicId"] };
}

const PhotoPage: React.FC<PhotoPageProps> = async ({
  params: { color, photoId },
}) => {
  const photos = await prisma.photo.findMany({
    where: { color },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <PhotoPageClient initialPhotoId={photoId} photos={photos} color={color} />
  );
};

export default PhotoPage;
