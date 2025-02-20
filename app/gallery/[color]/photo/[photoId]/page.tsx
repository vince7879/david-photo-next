"use client";

import React from "react";
import Photo from "@/app/components/Photo/Photo";

interface PhotoPageProps {
  params: { color: any; photoId: any };
}

const PhotoPage: React.FC<PhotoPageProps> = ({
  params: { color, photoId },
}) => {
  // @todo: handle color to display in the navbar
  // @todo: display 2 arrows to swith from to another photo from that gallery

  return (
    <Photo id={photoId} />
  );
};

export default PhotoPage;
