"use client";

import React, { useState } from "react";
import galleryStyles from "./Gallery.module.scss";
import Image from "next/image";
import { Grid, IconButton, Skeleton } from "@radix-ui/themes";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import {
  useGalleryPhotosIsLoadingSelector,
  usePhotosByColorData,
} from "@/app/contexts/GalleryPhotosContext";
import { Photo } from "@prisma/client";
import { usePathname } from "next/navigation";
import { DashboardIcon } from "@radix-ui/react-icons";

interface GalleryProps {
  currentColor?: Photo["color"];
  handleChangeGallery?: () => void;
}

const Gallery: React.FC<GalleryProps> = ({
  currentColor,
  handleChangeGallery,
}) => {
  const router = useRouter();
  const [page, setPage] = useState<1 | 2>(2);
  const photosByColor = usePhotosByColorData();
  const isLoading = useGalleryPhotosIsLoadingSelector();
  const pathname = usePathname();

  const handlePagination = () => {
    page === 2 ? setPage(1) : setPage(2);
  };

  const handleClickThumbnail = (
    color: Photo["color"],
    id: Photo["publicId"]
  ) => {
    if (pathname.includes("edit"))
      router.push(`/gallery/${color}/photo/${id}/edit`);
    else router.push(`/gallery/${color}/photo/${id}`);
  };

  return currentColor ? (
    <section
      className={classNames("main-frame main-frame--has-no-margin-left", {
        [`main-frame--${currentColor}`]: true,
      })}
    >
      {pathname.includes("edit") && (
        <IconButton
          variant="ghost"
          className={galleryStyles.modalButton}
          onClick={handleChangeGallery}
          title="change gallery"
        >
          <DashboardIcon width="80" height="80" />
        </IconButton>
      )}
      {!isLoading && photosByColor && photosByColor.length > 16 && (
        <div
          className={galleryStyles.paginationNumber}
          onClick={handlePagination}
        >
          {page}
        </div>
      )}
      {/* @todo add tiny border to thumbnails */}
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
              ?.slice(page === 2 ? 0 : 16, page === 2 ? 16 : 32)
              .map((photo) => (
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
                      handleClickThumbnail(currentColor, photo.publicId)
                    }
                  />
                </div>
              ))}
      </Grid>
    </section>
  ) : null;
};

export default Gallery;
