"use client";

import Photo from "@/app/components/Photo/Photo";
import React, { useState } from "react";
import NavBarPhoto from "@/app/components/NavBar/NavBarPhoto/NavBarPhoto";
import { GalleryPhotosProvider } from "@/app/contexts/GalleryPhotosContext";

export interface PhotoPageProps {
  params: { color: any; photoId: any };
}

const PhotoPage: React.FC<PhotoPageProps> = ({
  params: { color, photoId },
}) => {
  const [photoPublicId, setPhotoPublicId] = useState<any>(photoId);

  const handleClickedButton = (futureId: string) => {
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
