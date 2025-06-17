"use client";

import { createContext, useContextSelector } from "use-context-selector";
import React, { PropsWithChildren, useEffect, useState } from "react";
import axios from "axios";
import { Photo, Color } from "@prisma/client";

interface IContext {
  photosByColor?: Photo[];
  isLoading: boolean;
}

const GalleryPhotosContext = createContext<IContext>({
  photosByColor: undefined,
  isLoading: true,
});

interface IProvider {
  color: Color;
}
export const GalleryPhotosProvider = ({
  color,
  children,
}: PropsWithChildren<IProvider>) => {
  const [photosByColor, setPhotosByColor] = useState<IContext['photosByColor']>();
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
