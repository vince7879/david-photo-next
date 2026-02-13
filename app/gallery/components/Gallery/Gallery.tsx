"use client";

import React, { useState } from "react";
import galleryStyles from "./Gallery.module.scss";
import Image from "next/image";
import { Grid, IconButton, Skeleton } from "@radix-ui/themes";
import classNames from "classnames";
import { useRouter, usePathname } from "next/navigation";
import { Photo } from "@prisma/client";
import { DashboardIcon } from "@radix-ui/react-icons";
import Pagination, { PaginationProps } from "../Pagination/Pagination";

interface GalleryProps {
  currentColor?: Photo["color"];
  photos?: Photo[];
  isLoading?: boolean;
  handleChangeGallery?: () => void;
  isRecent?: boolean;
}

const Gallery: React.FC<GalleryProps> = ({
  currentColor,
  photos = [],
  isLoading = false,
  handleChangeGallery,
  isRecent = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [page, setPage] = useState<1 | 2 | 3>(isRecent ? 1 : 2);

  const handlePagination = () => {
    if (isRecent) {
      if (page === 1) setPage(2);
      else if (page === 2) setPage(3);
      else setPage(1);
    } else {
      // for the galleries of colors, toggle between page 1 and page 2
      setPage(page === 2 ? 1 : 2);
    }
  };

  const handleClickThumbnail = (
    color: Photo["color"],
    id: Photo["publicId"]
  ) => {
    if (pathname.includes("edit"))
      router.push(`/gallery/${color}/photo/${id}/edit`);
    else router.push(`/gallery/${color}/photo/${id}`);
  };

  const getPaginatedPhotos = () => {
    if (isRecent) {
      if (page === 1) return photos.slice(0, 16);
      if (page === 2) return photos.slice(16, 32);
      return photos.slice(32, 48);
    } else {
      // for the galleries of colors, page 1 shows the 16 oldest photos, page 2 shows the 16 most recent photos
      return photos.slice(page === 2 ? 0 : 16, page === 2 ? 16 : 32);
    }
  };

  const paginatedPhotos = getPaginatedPhotos();

  // Calculate the page number to display in the pagination component
  const getDisplayPageNumber = (): 1 | 2 | 3 => {
    if (isRecent) {
      if (page === 1) return 2;
      if (page === 2) return 3;
      return 1;
    }
    return page as 1 | 2;
  };

  // Determinate whether to show the pagination component or not
  const shouldShowPagination = () => {
    if (isRecent) return photos.length > 16;
    return photos.length > 16 && currentColor;
  };

  return currentColor || isRecent ? (
    <section
      className={classNames("main-frame main-frame--has-no-margin-left", {
        [`main-frame--${currentColor}`]: currentColor,
        "main-frame--is-recent": isRecent,
      })}
    >
      {pathname.includes("edit") && (
        <IconButton
          variant="ghost"
          className={galleryStyles.modalButton}
          onClick={handleChangeGallery}
          title="change gallery"
        >
          <DashboardIcon
            width="70"
            height="70"
            color={currentColor === "white" ? "black" : undefined}
          />
        </IconButton>
      )}

      {!isLoading && shouldShowPagination() && (
        <Pagination
          color={currentColor || "black"}
          handlePagination={handlePagination}
          pageNumber={getDisplayPageNumber()}
        />
      )}

      <Grid columns="4" className={galleryStyles.thumbnailsFrame}>
        {isLoading &&
          Array.from({ length: 16 }).map((_, index) => (
            <Skeleton
              key={index}
              width="90px"
              height="90px"
              style={{ placeSelf: "center" }}
            />
          ))}

        {!isLoading &&
          paginatedPhotos.map((photo) => (
            <div
              key={photo.id}
              className={classNames(
                galleryStyles.thumbnailsFrame__thumbnail,
                {
                  [galleryStyles[
                    `thumbnailsFrame__thumbnail--is-portrait`
                  ]]: photo.isPortrait,
                }
              )}
            >
              <Image
                src={photo.photoUrl}
                alt={photo.place}
                width={200}
                height={200}
                onClick={() =>
                  handleClickThumbnail(photo.color, photo.publicId)
                }
              />
            </div>
          ))}
      </Grid>
    </section>
  ) : null;
};

export default Gallery;
