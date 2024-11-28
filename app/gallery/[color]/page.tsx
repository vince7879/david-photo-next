import Gallery from "@/app/components/Gallery/Gallery";
import NavBar from "@/app/components/NavBar/NavBar";
import prisma from "@/prisma/client";
import React from "react";

interface GalleryPageProps {
  params: { color: any };
}

export const GalleryPage: React.FC<GalleryPageProps> = async ({
  params: { color },
}) => {
  // @todo: handle the redirect to 404 if color in url param is not valid

  const photos = await prisma.photo.findMany({ where: { color } });

  return (
    <>
      <aside>
        <NavBar currentColor={color} />
      </aside>
      <Gallery currentColor={color} photos={photos} />
    </>
  );
};

export default GalleryPage;
