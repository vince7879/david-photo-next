"use client";

import React, { useState } from "react";
import Photo from "./components/Photo/Photo";
import NavBarPhoto from "@/app/components/NavBar/NavBarPhoto/NavBarPhoto";
import { Photo as TPhoto } from "@prisma/client";

interface Props {
  initialPhotoId: TPhoto["publicId"];
  photos: TPhoto[];
}

export default function PhotoPageClient({
  initialPhotoId,
  photos,
}: Props) {
  const [photoPublicId, setPhotoPublicId] =
    useState<TPhoto["publicId"]>(initialPhotoId);

  const handleClickedButton = (futureId: TPhoto["publicId"]) => {
    setPhotoPublicId(futureId);
    window.history.pushState(null, "", `/gallery/recent/photo/${futureId}`);
  };

  return (
    <>
      <aside>
        <NavBarPhoto
          currentPhotoId={photoPublicId}
          onButtonClicked={handleClickedButton}
          photos={photos}
        />
      </aside>

      <Photo id={photoPublicId} photos={photos} />
    </>
  );
}