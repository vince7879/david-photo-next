"use client";

import { GalleryPhotosProvider } from "@/app/contexts/GalleryPhotosContext";
import React, { useState } from "react";
import classNames from "classnames";
import DragAndDropPanel from "./DragAndDropPanel";
import NavBarDashboard from "@/app/components/NavBar/NavBarDashboard/NavBarDashboard";
import Modal from "@/app/components/Modal/Modal";
import colorShapeStyles from "@/app/components/ColorShape/ColorShape.module.scss";
import colorSquareStyles from "@/app/components/ColorSquare/ColorSquare.module.scss";
import dragAndDropPanelStyles from "./DragAndDropPanel.module.scss";
import { Color } from "@prisma/client";
import { Grid } from "@radix-ui/themes";

const ReorderPhotosPage: React.FC = () => {
  const [showModal, setShowModal] = useState(true);
  const [userColorChoice, setUserColorChoice] = useState<Color | null>(null);

  const handleChoice = (colorChoice: Color) => {
    setUserColorChoice(colorChoice);
    setShowModal(false);
  };

  const handleChooseGallery = () => {
    setShowModal(true);
  };

  return (
    <>
      <Modal isShown={showModal} title="Choose a color to edit">
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
                  }
                )}
              />
            </button>
          ))}
        </Grid>
      </Modal>

      <GalleryPhotosProvider color={userColorChoice!}>
        <aside>
          <NavBarDashboard />
        </aside>
        <DragAndDropPanel
          currentColor={userColorChoice}
          handleChooseGallery={handleChooseGallery}
        />
      </GalleryPhotosProvider>
    </>
  );
};

export default ReorderPhotosPage;
