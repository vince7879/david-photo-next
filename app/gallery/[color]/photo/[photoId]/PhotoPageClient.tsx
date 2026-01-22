"use client";

import React, { useState } from "react";
import Photo from "./components/Photo/Photo";
import NavBarPhoto from "@/app/components/NavBar/NavBarPhoto/NavBarPhoto";
import { Photo as TPhoto } from "@prisma/client";

interface Props {
  color: TPhoto["color"];
  initialPhotoId: TPhoto["publicId"];
}

export default function PhotoPageClient({
  color,
  initialPhotoId,
}: Props) {
  const [photoPublicId, setPhotoPublicId] =
    useState<TPhoto["publicId"]>(initialPhotoId);

  const handleClickedButton = (futureId: TPhoto["publicId"]) => {
    setPhotoPublicId(futureId);
    window.history.pushState(
      null,
      "",
      `/gallery/${color}/photo/${futureId}`
    );
  };

  return (
    <>
      <aside>
        <NavBarPhoto
          currentColor={color}
          currentPhotoId={photoPublicId}
          onButtonClicked={handleClickedButton}
        />
      </aside>

      <Photo id={photoPublicId} />
    </>
  );
}
