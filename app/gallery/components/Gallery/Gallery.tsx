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
  
  // Determine the number of pages for this gallery
  const getMaxPages = () => {
    if (isRecent) return Math.min(5, Math.ceil(photos.length / 16)) || 1; // Recent: up to 5 pages based on photo count
    if (currentColor === "blackwhite" && photos.length > 32) return 3;
    if (photos.length > 16) return 2; // Any gallery with 17+ photos has at least 2 pages
    return 1; // Single page
  };
  
  const maxPages = getMaxPages();
  
  // Initialize page based on max pages (page 1 for multi-page, page 2 for legacy 2-page galleries)
  const getInitialPage = (): 1 | 2 | 3 | 4 | 5 => {
    if (maxPages === 1) return 1;
    if (isRecent || maxPages >= 3) return 1; // Recent and blackwhite start at page 1
    return 2; // Legacy 2-page galleries start at page 2
  };
  
  const [page, setPage] = useState<1 | 2 | 3 | 4 | 5>(getInitialPage());

  const handlePagination = () => {
    if (isRecent) {
      // For Recent: cycle 1 -> 2 -> ... -> maxPages -> 1
      setPage((page === maxPages ? 1 : page + 1) as 1 | 2 | 3 | 4 | 5);
    } else if (maxPages === 3) {
      // For blackwhite (>32 photos): cycle 1 -> 2 -> 3 -> 1
      if (page === 1) setPage(2);
      else if (page === 2) setPage(3);
      else setPage(1);
    } else if (maxPages === 2) {
      // For other galleries with 2 pages: cycle 1 <-> 2
      setPage(page === 2 ? 1 : 2);
    }
    // maxPages === 1: no pagination, do nothing
  };

  const handleClickThumbnail = (
    color: Photo["color"],
    id: Photo["publicId"]
  ) => {
    if (pathname.includes("edit"))
      router.push(`/gallery/${color}/photo/${id}/edit`);
    else router.push(`/gallery/${isRecent ? "recent/" : color}/photo/${id}`);
  };

  // Pagination calculation
  const getPaginatedPhotos = () => {
    if (maxPages === 1) {
      // Single page: return all photos
      return photos;
    } else if (isRecent) {
      // For Recent: pages of 16 photos
      return photos.slice((page - 1) * 16, page * 16);
    } else if (maxPages === 3) {
      // For blackwhite (>32 photos): 3 pages of 16 photos
      if (page === 1) return photos.slice(0, 16);
      if (page === 2) return photos.slice(16, 32);
      return photos.slice(32, 48);
    } else {
      // For other galleries with 2 pages: 16 photos per page
      return photos.slice(page === 2 ? 0 : 16, page === 2 ? 16 : 32);
    }
  };

  const paginatedPhotos = getPaginatedPhotos();

  // Calculate the page number to display in pagination
  const getDisplayPageNumber = (): 1 | 2 | 3 | 4 | 5 => {
    if (isRecent) {
      // Display the next page number
      return (page === maxPages ? 1 : page + 1) as 1 | 2 | 3 | 4 | 5;
    } else if (maxPages === 3) {
      if (page === 1) return 2;
      if (page === 2) return 3;
      return 1;
    }
    return page;
  };

  // Determine if pagination should be shown
  const shouldShowPagination = () => {
    return maxPages > 1 && photos.length > 16;
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
