import React from 'react'
import layoutStyles from "@/app/styles/Layout.module.scss";
import galleryStyles from "./Gallery.module.scss";

interface GalleryProps {
    color: any
}

const Gallery: React.FC<GalleryProps> = ({color}) => {
  return (
    <div
      className={layoutStyles.frame}
      style={{ backgroundColor: `var(--${color})` }}
    >
      {/* add page number for pagination / absolute on top-right could work */}
      <div className={galleryStyles.thumbnailsFrame}>
        {/* handle 16 thumbnails to display */}
      </div>
    </div>
  )
}

export default Gallery