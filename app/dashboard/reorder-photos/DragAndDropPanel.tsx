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
import {
  useGalleryPhotosLoadingSelector,
  usePhotosByColorData,
} from "@/app/contexts/GalleryPhotosContext";
import Image from "next/image";
import { Button, Flex, Grid } from "@radix-ui/themes";
import dragAndDropPanelStyles from "./DragAndDropPanel.module.scss";
import classNames from "classnames";
import { Photo } from "@prisma/client";

// @todo extract component
const PhotoItem = ({ id, url }: {id: Photo['id']; url: Photo['photoUrl']}) => {
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
      />
    </div>
  );
};

const DragAndDropPanel: React.FC = () => {
  const photosByColor = usePhotosByColorData();
  const isLoading = useGalleryPhotosLoadingSelector();

  const [sortedPhotos, setSortedPhotos] = useState(photosByColor);

  useEffect(() => {
    if (photosByColor) {
      setSortedPhotos(photosByColor);
    }
  }, [photosByColor]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const activeIndex = sortedPhotos!.findIndex(
        (photo) => photo.id === active.id
      );
      const overIndex = sortedPhotos!.findIndex((photo) => photo.id === over?.id);

      setSortedPhotos((prevPhotos) =>
        arrayMove(prevPhotos!, activeIndex, overIndex)
      );
    }
  };

  const handleValidate = () => {
    console.log("new order:", sortedPhotos);
    // @todo: send new position (sortedPhotos) to the  source that display the galleries (photosByColor in the GalleryPhotosContext)
  };

  const handleChooseGallery = () => {
    // @todo: create a modal with the list of the colors that can be clicked
  };

  return !isLoading && sortedPhotos ? (
    <Flex direction="column" gap="5">
      {/* @todo: add the color name in the title below */}
      <h1 className={classNames("text-3xl font-bold", dragAndDropPanelStyles.thumbnailsFrame__title)}>
        Drag and drop to reorder the red gallery
      </h1>
      <Flex justify="between" align="center">
        <Button onClick={handleValidate}>Validate the new order</Button>
        <Button color="bronze" onClick={handleChooseGallery}>
          Choose another gallery
        </Button>
      </Flex>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={sortedPhotos.slice(0, 32)}
          strategy={rectSortingStrategy}
        >
          <div className={dragAndDropPanelStyles.thumbnailsFrame}>
            <h3 className={dragAndDropPanelStyles.thumbnailsFrame__pageTitle}>
              Page 1
            </h3>
            <Grid
              columns="4"
              className={classNames(
                dragAndDropPanelStyles.thumbnailsFrame__page,
                {
                  [dragAndDropPanelStyles[
                    "thumbnailsFrame__page--has-border-bottom"
                  ]]: sortedPhotos.length <= 16 || sortedPhotos.length > 28,
                }
              )}
            >
              {sortedPhotos.slice(0, 32).map((photo) => (
                <PhotoItem key={photo.id} id={photo.id} url={photo.photoUrl} />
              ))}
            </Grid>
            {sortedPhotos.length > 16 && (
              <h3
                className={classNames(
                  dragAndDropPanelStyles.thumbnailsFrame__pageSeparator,
                  dragAndDropPanelStyles.thumbnailsFrame__pageTitle
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
    </Flex>
  ) : null;
};

export default DragAndDropPanel;
