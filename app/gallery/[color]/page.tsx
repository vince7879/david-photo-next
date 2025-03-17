import Gallery from "@/app/components/Gallery/Gallery";
import NavBarGallery from "@/app/components/NavBar/NavBarGallery/NavBarGallery";
import { GalleryPhotosProvider } from "@/app/contexts/GalleryPhotosContext";
import React from "react";

export interface GalleryPageProps {
  params: { color: any };
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  params: { color },
}) => (
  <>
    <aside>
      <NavBarGallery currentColor={color} />
    </aside>
    <GalleryPhotosProvider color={color}>
      <Gallery currentColor={color} />
    </GalleryPhotosProvider>
  </>
);

export default GalleryPage;
