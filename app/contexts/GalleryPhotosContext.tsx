"use client";

import { createContext, useContextSelector } from "use-context-selector";
import React, { useEffect, useState } from "react";
import axios from "axios";

const GalleryPhotosContext = createContext<any>(null);

interface GalleryProps {
  // @todo: add correct type on color
  color: any;
  children: React.ReactNode;
}
export const GalleryPhotosProvider: React.FC<GalleryProps> = ({
  color,
  children,
}) => {
  const [photosByColor, setPhotosByColor] = useState<any>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotosByColor = async () => {
      const { data } = await axios.get("/api/photos/" + color);
      // @todo: handle the redirect to 404 if color in url param is not valid

      setPhotosByColor(data);
      setLoading(false);
    };

    fetchPhotosByColor();
  }, [color]);

  return (
    <GalleryPhotosContext.Provider
      value={{
        photosByColor,
        isLoading,
      }}
    >
      {children}
    </GalleryPhotosContext.Provider>
  );
};

export const usePhotosByColorData = () =>
  useContextSelector(GalleryPhotosContext, (state) => state.photosByColor);
export const useGalleryPhotosLoadingSelector = () =>
  useContextSelector(GalleryPhotosContext, (state) => state.isLoading);
