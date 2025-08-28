import React from "react";
import Gallery from "../components/Gallery/Gallery";
import NavBarGallery from "@/app/components/NavBar/NavBarGallery/NavBarGallery";
import { GalleryPhotosProvider } from "@/app/contexts/GalleryPhotosContext";

const RecentPhotosPage: React.FC = () => {
  return (
    <>
      <aside>
        <NavBarGallery />
      </aside>
      <GalleryPhotosProvider isRecent>
        <Gallery isRecent />
      </GalleryPhotosProvider>
    </>
  );
};

export default RecentPhotosPage;
