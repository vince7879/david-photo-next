import Gallery from "@/app/components/Gallery/Gallery";
import React from "react";

interface GalleryPageProps {
  params: { color: any };
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  params: { color },
}) => {
  // handle the redirect to 404 if color in url param is not valid

  return (
    <>
      {/* vertical sidebar with 
  mini-mondrian at the top 
  the squares of the other colors */}
      <Gallery color={color} />
    </>
  );
};

export default GalleryPage;
