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
import Link from "next/link";

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
  const [page, setPage] = useState<PaginationProps["pageNumber"]>(2);

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

  const paginatedPhotos =
    photos.slice(page === 2 ? 0 : 16, page === 2 ? 16 : 32);

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

      {!isLoading && photos.length > 16 && currentColor && (
        <Pagination
          color={currentColor}
          handlePagination={handlePagination}
          pageNumber={page}
        />
      )}

      {!isLoading && isRecent && (
        <Link href="/" className={galleryStyles.logoLink}>
          <Image
            src="/images/mondrian-mini.png"
            alt="mondrian-mini"
            width={75}
            height={75}
            priority
          />
        </Link>
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
