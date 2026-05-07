import prisma from "@/prisma/client";
import { Photo as TPhoto } from "@prisma/client";
import PhotoPageClient from "./PhotoPageClient";
import { sortPhotosByDateDesc, RECENT_GALLERY_MAX_PHOTOS } from "@/app/constants";

export const dynamic = "force-static";
export const revalidate = 3600;

export interface RecentPhotoPageProps {
  params: { photoId: TPhoto["publicId"] };
}

const RecentPhotoPage: React.FC<RecentPhotoPageProps> = async ({
  params: { photoId },
}) => {
  // fetch all photos, sort them by date desc and keep the most recent ones
  const allPhotos = await prisma.photo.findMany();
  const sortedPhotos = allPhotos.sort(sortPhotosByDateDesc);
  const photos = sortedPhotos.slice(0, RECENT_GALLERY_MAX_PHOTOS);

  return <PhotoPageClient initialPhotoId={photoId} photos={photos} />;
};

export default RecentPhotoPage;
