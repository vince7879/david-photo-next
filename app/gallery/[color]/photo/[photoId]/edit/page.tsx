import React from "react";
import PhotoForm from "../../../../../dashboard/components/PhotoForm";
import { Photo as TPhoto } from "@prisma/client";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";

export interface EditPhotoPageProps {
  params: { photoId: TPhoto["publicId"] };
}

const EditPhotoPage: React.FC<EditPhotoPageProps> = async ({
  params: { photoId },
}) => {
  const photo = await prisma.photo.findUnique({
    where: { publicId: photoId },
  });

  if (!photo) notFound();

  return <PhotoForm photoData={photo} />;
};

export default EditPhotoPage;
