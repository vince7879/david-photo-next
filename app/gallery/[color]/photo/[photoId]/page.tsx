"use client";

import Photo from "@/app/components/Photo/Photo";
import React, { useState } from "react";
import NavBarPhoto from "@/app/components/NavBar/NavBarPhoto/NavBarPhoto";
import { GalleryPhotosProvider } from "@/app/contexts/GalleryPhotosContext";
import { Photo as TPhoto } from "@prisma/client"

export interface PhotoPageProps {
  params: { color: TPhoto['color']; photoId: TPhoto['publicId'] };
}

const PhotoPage: React.FC<PhotoPageProps> = ({
  params: { color, photoId },
}) => {
  const [photoPublicId, setPhotoPublicId] = useState<TPhoto['publicId']>(photoId);

  const handleClickedButton = (futureId: TPhoto['publicId']) => {
    setPhotoPublicId(futureId);
    window.history.pushState(null, "", `/gallery/${color}/photo/${futureId}`);
  };

  return (
    <GalleryPhotosProvider color={color}>
      <aside>
        <NavBarPhoto
          currentColor={color}
          currentPhotoId={photoPublicId}
          onButtonClicked={handleClickedButton}
        />
      </aside>
      <Photo id={photoPublicId} />
    </GalleryPhotosProvider>
  );
};

export default PhotoPage;
