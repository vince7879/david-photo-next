"use client";

import React, { useEffect, useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { usePhotosByColorData } from "@/app/contexts/GalleryPhotosContext";
import Image from "next/image";
import { Button, Flex, Grid, Skeleton } from "@radix-ui/themes";
import dragAndDropPanelStyles from "./DragAndDropPanel.module.scss";
import classNames from "classnames";
import { Photo } from "@prisma/client";
import { Color } from "@prisma/client";
import { areArraysEqual } from "@/app/helpers/arrayHelper";
import axios from "axios";
import { useRouter } from "next/navigation";

interface DragAndDropPanelProps {
  currentColor: Color | null;
  handleChooseGallery: () => void;
}

// @todo extract component
const PhotoItem = ({
  id,
  url,
  onClickThumbnail,
}: {
  id: Photo["id"];
  url: Photo["photoUrl"];
  onClickThumbnail?: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Image
        src={url}
        alt={`Photo ${id}`}
        width={200}
        height={200}
        className={dragAndDropPanelStyles.thumbnailsFrame__thumbnail}
        onClick={onClickThumbnail}
      />
    </div>
  );
};

const DragAndDropPanel: React.FC<DragAndDropPanelProps> = ({
  currentColor,
  handleChooseGallery,
}) => {
  const photosByColor = usePhotosByColorData();
  const router = useRouter();

  const [sortedPhotos, setSortedPhotos] = useState<Photo[] | undefined>(
    photosByColor
  );

  useEffect(() => {
    setSortedPhotos(photosByColor);
  }, [photosByColor]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const activeIndex = sortedPhotos!.findIndex(
        (photo) => photo.id === active.id
      );
      const overIndex = sortedPhotos!.findIndex(
        (photo) => photo.id === over?.id
      );

      setSortedPhotos((prevPhotos) =>
        arrayMove(prevPhotos!, activeIndex, overIndex)
      );
    }
  };

  const handleValidate = async () => {
    try {
      const response = await axios.post("/api/photos/update-order", {
        photoOrders: sortedPhotos,
      });
      // @todo: find what to display to the user once the new order is validated successfully
      // maybe evolve and use the Modal whith a children? just a tiny msg next to the button?
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  return photosByColor && sortedPhotos && currentColor ? (
    <Flex direction="column" gap="5">
      <h1
        className={classNames(
          "text-3xl font-bold",
          dragAndDropPanelStyles.thumbnailsFrame__title
        )}
      >
        Reorder the{" "}
        {currentColor === "blackwhite" ? "black and white" : currentColor}{" "}
        gallery
      </h1>
      <Flex gap="4" align="center">
        <Button color="bronze" onClick={handleChooseGallery}>
          Choose another gallery
        </Button>
        {(sortedPhotos.length === 0 && (
          <span className="mr-5">There are no photos in this gallery</span>
        )) ||
          (!areArraysEqual(photosByColor, sortedPhotos) && (
            <Button onClick={handleValidate}>Validate the new order</Button>
          )) ||
          null}
      </Flex>
      {sortedPhotos.length > 0 ? (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedPhotos.slice(0, 32)}
            strategy={rectSortingStrategy}
          >
            <div className={dragAndDropPanelStyles.thumbnailsFrame}>
              {/* @todo: hide "Page 1" if there are not more than 16 photos  */}
              <h3
                className={classNames(
                  dragAndDropPanelStyles.thumbnailsFrame__pageTitle,
                  {
                    [dragAndDropPanelStyles[
                      `thumbnailsFrame__pageTitle--${currentColor}`
                    ]]: currentColor,
                  }
                )}
              >
                Page 1
              </h3>
              <Grid
                columns="4"
                className={classNames(
                  dragAndDropPanelStyles.thumbnailsFrame__page,
                  {
                    [dragAndDropPanelStyles[
                      `thumbnailsFrame__page--${currentColor}`
                    ]]: currentColor,
                    [dragAndDropPanelStyles[
                      `thumbnailsFrame__page--has-${currentColor}-border-bottom`
                    ]]: sortedPhotos.length <= 16 || sortedPhotos.length > 28,
                  }
                )}
              >
                {sortedPhotos.slice(0, 32).map((photo) => (
                  <PhotoItem
                    key={photo.id}
                    id={photo.id}
                    url={photo.photoUrl}
                  />
                ))}
              </Grid>
              {sortedPhotos.length > 16 && (
                <h3
                  className={classNames(
                    dragAndDropPanelStyles.thumbnailsFrame__pageSeparator,
                    dragAndDropPanelStyles.thumbnailsFrame__pageTitle,
                    {
                      [dragAndDropPanelStyles[
                        `thumbnailsFrame__pageSeparator--${currentColor}`
                      ]]: currentColor,
                    }
                  )}
                >
                  Page 2
                </h3>
              )}
              {sortedPhotos.length > 16 && sortedPhotos.length <= 28 && (
                <div
                  className={classNames(
                    dragAndDropPanelStyles.thumbnailsFrame__bottomSecondPage,
                    {
                      [dragAndDropPanelStyles[
                        `thumbnailsFrame__bottomSecondPage--${currentColor}`
                      ]]: currentColor,
                      [dragAndDropPanelStyles[
                        "thumbnailsFrame__bottomSecondPage--has-1-line"
                      ]]: sortedPhotos.length > 16 && sortedPhotos.length <= 20,
                      [dragAndDropPanelStyles[
                        "thumbnailsFrame__bottomSecondPage--has-2-lines"
                      ]]: sortedPhotos.length > 20 && sortedPhotos.length <= 24,
                      [dragAndDropPanelStyles[
                        "thumbnailsFrame__bottomSecondPage--has-3-lines"
                      ]]: sortedPhotos.length > 24 && sortedPhotos.length <= 28,
                    }
                  )}
                ></div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      ) : null}
    </Flex>
  ) : null;
};

export default DragAndDropPanel;
