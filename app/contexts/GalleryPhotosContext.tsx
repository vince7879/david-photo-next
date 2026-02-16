"use client";

import { createContext, useContextSelector } from "use-context-selector";
import React, { PropsWithChildren, useState } from "react";
import { Photo, Color } from "@prisma/client";

interface IContext {
  photosByColor?: Photo[];
  photosRecent?: Photo[];
  isLoading: boolean;
}

const GalleryPhotosContext = createContext<IContext>({
  photosByColor: undefined,
  isLoading: false,
});

interface IProvider {
  color?: Color;
  initialPhotosByColor?: Photo[];
}

export const GalleryPhotosProvider = ({
  initialPhotosByColor,
  children,
}: PropsWithChildren<IProvider>) => {
  const [photosByColor] = useState(initialPhotosByColor);
  const [isLoading] = useState(false);

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
export const useGalleryPhotosIsLoadingSelector = () =>
  useContextSelector(GalleryPhotosContext, (state) => state.isLoading);
