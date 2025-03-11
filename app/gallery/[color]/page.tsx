import Gallery from "@/app/components/Gallery/Gallery";
import NavBarGallery from "@/app/components/NavBar/NavBarGallery/NavBarGallery";
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
    <Gallery currentColor={color} />
  </>
);

export default GalleryPage;
