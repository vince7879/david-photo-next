"use client";

import React, { useState } from "react";
import { Color, Photo } from "@prisma/client";
import { getPhotosByColor } from "@/app/dashboard/actions/getPhotosByColor";
import classNames from "classnames";
import NavBarDashboard from "@/app/components/NavBar/NavBarDashboard/NavBarDashboard";
import DragAndDropPanel from "@/app/dashboard/reorder/components/DragAndDropPanel";
import Modal from "@/app/components/Modal/Modal";
import { Grid } from "@radix-ui/themes";
import colorShapeStyles from "@/app/components/ColorShape/ColorShape.module.scss";
import colorSquareStyles from "@/app/components/ColorSquare/ColorSquare.module.scss";
import dragAndDropPanelStyles from "@/app/dashboard/reorder/components/DragAndDropPanel.module.scss";

const ReorderPhotosPage: React.FC = () => {
  const [showModal, setShowModal] = useState(true);
  const [userColorChoice, setUserColorChoice] = useState<Color | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChoice = async (colorChoice: Color) => {
    setUserColorChoice(colorChoice);
    setShowModal(false);

    setIsLoading(true);
    const data = await getPhotosByColor(colorChoice);
    setPhotos(data);
    setIsLoading(false);
  };

  const handleChooseGallery = () => {
    setShowModal(true);
  };

  return (
    <>
      <Modal isShown={showModal} title="Choose a gallery to reorder">
        <Grid
          columns="3"
          gap="5"
          align="center"
          className={dragAndDropPanelStyles.modal}
        >
          {Object.values(Color).map((color) => (
            <button key={color} onClick={() => handleChoice(color)}>
              <div
                style={{ width: "50px", height: "50px" }}
                className={classNames(
                  colorShapeStyles.shape,
                  colorSquareStyles.square,
                  {
                    [colorShapeStyles[`shape--${color}`]]: true,
                    [colorSquareStyles["square--has-grey-borders"]]: true,
                  },
                )}
              />
            </button>
          ))}
        </Grid>
      </Modal>

      <>
        <aside>
          <NavBarDashboard />
        </aside>

        {!showModal && (
          <DragAndDropPanel
            currentColor={userColorChoice}
            photos={photos}
            setPhotos={setPhotos}
            isLoading={isLoading}
            handleChooseGallery={handleChooseGallery}
          />
        )}
      </>
    </>
  );
};

export default ReorderPhotosPage;
