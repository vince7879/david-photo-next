"use client";

import React, { useState } from "react";
import galleryStyles from "./Gallery.module.scss";
import Image from "next/image";
import { Grid } from "@radix-ui/themes";
import classNames from "classnames";

interface GalleryProps {
  // @todo: add correct type on color
  currentColor: any;
  photos: any;
}

const Gallery: React.FC<GalleryProps> = ({ currentColor, photos }) => {
  const [page, setPage] = useState<1 | 2>(2);

  const handlePagination = () => {
    page === 2 ? setPage(1) : setPage(2);
  };

  return (
    <section
      className={classNames("main-frame main-frame--has-no-margin-left", {
        [`main-frame--${currentColor}`]: true,
      })}
    >
      {photos.length > 16 && (
        <div
          className={galleryStyles.paginationNumber}
          onClick={handlePagination}
        >
          {page}
        </div>
      )}
      <Grid columns="4" className={galleryStyles.thumbnailsFrame}>
        {photos
          .slice(page === 2 ? 0 : 16, page === 2 ? 16 : undefined)
          .map(
            (
              photo: { photoUrl: string; place: string },
              id: React.Key | null | undefined
            ) => (
              <Image
                key={id}
                src={photo.photoUrl}
                alt={photo.place}
                width={200}
                height={200}
              />
            )
          )}
      </Grid>
    </section>
  );
};

export default Gallery;
