"use client";

import Photo from "@/app/components/Photo/Photo";
import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBarPhoto from "@/app/components/NavBar/NavBarPhoto/NavBarPhoto";
import { Flex, Skeleton } from "@radix-ui/themes";

export interface PhotoPageProps {
  params: { color: any; photoId: any };
}

const PhotoPage: React.FC<PhotoPageProps> = ({
  params: { color, photoId },
}) => {
  const [photoData, setPhotoData] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPhotoData = async () => {
      const { data } = await axios.get(
        "/api/photos/" + color + "/photo/" + photoId
      );
      setPhotoData(data);
      setIsLoading(false);
    };

    fetchPhotoData();
  }, [color, photoId]);

  // @todo: maybe simplify this method to handle switch btn
  // useEffect(() => {
  //   const fetchPhotosByColor = async () => {
  //     const { data } = await axios.get("/api/photos/" + color);
  //     setPhotosByColor(data);
  //     setIsLoading(false)
  //   };

  //   fetchPhotosByColor();
  // }, [color])

  // if (isLoading) return <p>Loading...</p>
  // if (!photosByColor) return null
  // const photos = await prisma.photo.findMany({ where: { color } });
  // const galleryIds = photosByColor.map((photo) => photo.publicId);

  const handleClickedButton = (buttonVariant: string) => {
    console.log("🚀 ~ handleClickedButton ~ buttonVariant:", buttonVariant);
    // @todo: grab next or previous id and router.push(`/gallery/${color}/photo/${id} whare id is the new id
  };

  return (
    <>
      <aside>
        <NavBarPhoto
          currentColor={color}
          // galleryIds={galleryIds}
          currentPhotoId={photoId}
          onButtonClicked={handleClickedButton}
        />
      </aside>
      {isLoading ? (
        <Skeleton
          width={{ initial: "478px", md: "735px", lg: "1000px" }}
          height={{ initial: "318px", md: "490px", lg: "670px" }}
        />
      ) : (
        <Photo
          data={photoData}
        />
      )}
    </>
  );
};

export default PhotoPage;
