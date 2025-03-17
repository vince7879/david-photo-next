"use client";

import React, { useState } from "react";
import galleryStyles from "./Gallery.module.scss";
import Image from "next/image";
import { Grid, Skeleton } from "@radix-ui/themes";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useGalleryPhotosLoadingSelector, usePhotosByColorData } from "@/app/contexts/GalleryPhotosContext";

interface GalleryProps {
  // @todo: add correct type on color
  currentColor: any;
}

const Gallery: React.FC<GalleryProps> = ({ currentColor }) => {
  const router = useRouter();
  const [page, setPage] = useState<1 | 2>(2);
  const photosByColor = usePhotosByColorData()
  const isLoading = useGalleryPhotosLoadingSelector()

  const handlePagination = () => {
    page === 2 ? setPage(1) : setPage(2);
  };

  const handleClickThumbnail = (color, id) => {
    router.push(`/gallery/${color}/photo/${id}`);
  };

  return (
    <section
      className={classNames("main-frame main-frame--has-no-margin-left", {
        [`main-frame--${currentColor}`]: true,
      })}
    >
      {!isLoading && photosByColor.length > 16 && (
        <div
          className={galleryStyles.paginationNumber}
          onClick={handlePagination}
        >
          {page}
        </div>
      )}
      <Grid columns="4" className={galleryStyles.thumbnailsFrame}>
        {isLoading
          ? Array.from({ length: 16 }).map((_, index) => (
              <Skeleton
                key={index}
                width="90px"
                height="90px"
                style={{ placeSelf: "center" }}
              />
            ))
          : photosByColor
              .slice(page === 2 ? 0 : 16, page === 2 ? 16 : undefined)
              .map((photo) => (
                <Image
                  key={photo.id}
                  src={photo.photoUrl}
                  alt={photo.place}
                  width={200}
                  height={200}
                  className={galleryStyles.thumbnailsFrame__thumbnail}
                  onClick={() =>
                    handleClickThumbnail(currentColor, photo.publicId)
                  }
                />
              ))}
      </Grid>
    </section>
  );
};

export default Gallery;
