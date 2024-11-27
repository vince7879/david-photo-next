import React from "react";
import layoutStyles from "@/app/styles/Layout.module.scss";
import galleryStyles from "./Gallery.module.scss";
import prisma from "@/prisma/client";
import Image from "next/image";
import { Grid } from "@radix-ui/themes";

interface GalleryProps {
  color: any;
}

const Gallery: React.FC<GalleryProps> = async ({ color }) => {
  const photos = await prisma.photo.findMany({ where: { color } });

  return (
    <div
      className={layoutStyles.frame}
      style={{ backgroundColor: `var(--${color})` }}
    >
      {/* add page number for pagination / absolute on top-right could work */}
      {/* handle 16 thumbnails to display */}
      <Grid columns="4" className={galleryStyles.thumbnailsFrame}>
        {photos.slice(0, 16).map((photo, id) => (
          <Image
            key={id}
            src={photo.photoUrl}
            alt={photo.place}
            width={200}
            height={200}
          />
        ))}
      </Grid>
    </div>
  );
};

export default Gallery;
