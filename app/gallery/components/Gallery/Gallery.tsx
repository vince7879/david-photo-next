"use client";

import React, { useEffect, useState } from "react";
import galleryStyles from "./Gallery.module.scss";
import Image from "next/image";
import { Grid, IconButton, Skeleton } from "@radix-ui/themes";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import {
  useGalleryPhotosIsLoadingSelector,
  usePhotosByColorData,
  // usePhotosRecentData,
} from "@/app/contexts/GalleryPhotosContext";
import { Photo } from "@prisma/client";
import { usePathname } from "next/navigation";
import { DashboardIcon } from "@radix-ui/react-icons";
import Pagination, { PaginationProps } from "../Pagination/Pagination";
import Link from "next/link";

interface GalleryProps {
  currentColor?: Photo["color"];
  handleChangeGallery?: () => void;
  isRecent?: boolean;
}

const Gallery: React.FC<GalleryProps> = ({
  currentColor,
  handleChangeGallery,
  isRecent = false,
}) => {
  const router = useRouter();
  const [page, setPage] = useState<PaginationProps["pageNumber"]>(2);
  const photosByColor = usePhotosByColorData();
  // const photosRecent = usePhotosRecentData();
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
      {!isLoading &&
        currentColor &&
        photosByColor &&
        photosByColor.length > 16 && (
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
            priority={true}
          />
        </Link>
      )}
      <Grid columns="4" className={galleryStyles.thumbnailsFrame}>
        {(isLoading &&
          Array.from({ length: 16 }).map((_, index) => (
            <Skeleton
              key={index}
              width="90px"
              height="90px"
              style={{ placeSelf: "center" }}
            />
          ))) ||
          (currentColor &&
            photosByColor
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
              ))) 
              // ||
          // (isRecent &&
          //   photosRecent?.map((photo) => (
          //     <div
          //       key={photo.id}
          //       className={classNames(
          //         galleryStyles.thumbnailsFrame__thumbnail,
          //         {
          //           [galleryStyles[`thumbnailsFrame__thumbnail--is-portrait`]]:
          //             photo.isPortrait,
          //         }
          //       )}
          //     >
          //       <Image
          //         src={photo.photoUrl}
          //         alt={photo.place}
          //         width={200}
          //         height={200}
          //         onClick={() =>
          //           handleClickThumbnail(photo.color, photo.publicId)
          //         }
          //       />
          //     </div>
          //   )))
          }
      </Grid>
    </section>
  ) : null;
};

export default Gallery;
