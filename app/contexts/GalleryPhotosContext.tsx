"use client";

import { createContext, useContextSelector } from "use-context-selector";
import React, { PropsWithChildren, useEffect, useState } from "react";
import axios from "axios";
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
  isRecent?: boolean;
}
export const GalleryPhotosProvider = ({
  color,
  isRecent,
  children,
}: PropsWithChildren<IProvider>) => {
  const [photosByColor, setPhotosByColor] =
    useState<IContext["photosByColor"]>();
  const [photosRecent, setPhotosRecent] = useState<IContext["photosRecent"]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!color) return;

    setIsLoading(true);
    setPhotosByColor(undefined);

    const fetchPhotosByColor = async () => {
      const { data } = await axios.get("/api/photos/" + color);
      // @todo: handle the redirect to 404 if color in url param is not valid

      setPhotosByColor(data);
      setIsLoading(false);
    };

    fetchPhotosByColor();
  }, [color]);

  useEffect(() => {
    if (!isRecent) return;

    setIsLoading(true);
    setPhotosRecent(undefined);

    const fetchPhotosRecent = async () => {
      const { data } = await axios.get("/api/photos/recent");

      setPhotosRecent(data);
      setIsLoading(false);
    };

    fetchPhotosRecent();
  }, [isRecent]);

  return (
    <GalleryPhotosContext.Provider
      value={{
        photosByColor,
        photosRecent,
        isLoading,
      }}
    >
      {children}
    </GalleryPhotosContext.Provider>
  );
};

export const usePhotosByColorData = () =>
  useContextSelector(GalleryPhotosContext, (state) => state.photosByColor);
export const usePhotosRecentData = () =>
  useContextSelector(GalleryPhotosContext, (state) => state.photosRecent);
export const useGalleryPhotosIsLoadingSelector = () =>
  useContextSelector(GalleryPhotosContext, (state) => state.isLoading);
