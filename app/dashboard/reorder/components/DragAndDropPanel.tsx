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
import Image from "next/image";
import { Button, Flex, Grid, Text } from "@radix-ui/themes";
import dragAndDropPanelStyles from "./DragAndDropPanel.module.scss";
import classNames from "classnames";
import { Photo } from "@prisma/client";
import { Color } from "@prisma/client";
import { areArraysEqual } from "@/app/helpers/arrayHelper";
import Spinner from "@/app/components/Spinner";
import { reorderPhotos } from "@/app/dashboard/actions/reorderPhotos";

interface DragAndDropPanelProps {
  currentColor: Color | null;
  photos: Photo[];
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
  isLoading: boolean;
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
  photos,
  setPhotos,
  isLoading,
  handleChooseGallery,
}) => {
  const [initialPhotos, setInitialPhotos] = useState<Photo[]>(photos);
  const [sortedPhotos, setSortedPhotos] = useState<Photo[]>(photos);
  const [isValidatingNewOrder, setIsValidatingNewOrder] = useState(false);
  const [newOrderValidationMessage, setNewOrderValidationMessage] =
    useState("");

  useEffect(() => {
    setNewOrderValidationMessage("");
  }, [currentColor]);

  useEffect(() => {
    setInitialPhotos(photos);
    setSortedPhotos(photos);
    setNewOrderValidationMessage("");
  }, [photos]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !sortedPhotos) return;
    if (active.id === over.id) return;

    const activeIndex = sortedPhotos.findIndex(
      (photo) => photo.id === active.id,
    );
    const overIndex = sortedPhotos.findIndex((photo) => photo.id === over.id);

    setSortedPhotos((prev) => arrayMove(prev!, activeIndex, overIndex));
  };

  const validateNewOrder = async () => {
    try {
      setIsValidatingNewOrder(true);

      await reorderPhotos(
        sortedPhotos.map((photo, index) => ({
          id: photo.id,
          order: index,
        })),
        currentColor!,
      );

      setInitialPhotos(sortedPhotos);
      setNewOrderValidationMessage("New order applied successfully!");
    } catch (error) {
      console.error(error);
      setNewOrderValidationMessage("An unexpected error occurred.");
    } finally {
      setIsValidatingNewOrder(false);
    }
  };

  if (!currentColor) return null;

  return initialPhotos && sortedPhotos ? (
    <Flex direction="column" gap="5">
      <h1
        className={classNames(
          "text-3xl font-bold",
          dragAndDropPanelStyles.thumbnailsFrame__title,
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
          (!areArraysEqual(initialPhotos, sortedPhotos) &&
            !newOrderValidationMessage && (
              <Button
                onClick={validateNewOrder}
                disabled={isValidatingNewOrder}
              >
                Validate the new order
                {isValidatingNewOrder && <Spinner />}
              </Button>
            )) ||
          null}
        {newOrderValidationMessage && (
          <Text
            color={
              newOrderValidationMessage.includes("success") ? "green" : "red"
            }
          >
            {newOrderValidationMessage}
          </Text>
        )}
      </Flex>

      {isLoading && (
        <Flex justify="center" align="center">
          <Spinner />
        </Flex>
      )}

      {!isLoading && sortedPhotos?.length > 0 ? (
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
                  },
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
                  },
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
                    },
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
                    },
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
