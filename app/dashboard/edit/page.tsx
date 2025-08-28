"use client";

import { GalleryPhotosProvider } from "@/app/contexts/GalleryPhotosContext";
import React, { useState } from "react";
import classNames from "classnames";
import NavBarDashboard from "@/app/components/NavBar/NavBarDashboard/NavBarDashboard";
import Modal from "@/app/components/Modal/Modal";
import colorShapeStyles from "@/app/components/ColorShape/ColorShape.module.scss";
import colorSquareStyles from "@/app/components/ColorSquare/ColorSquare.module.scss";
import dragAndDropPanelStyles from "@/app/dashboard/reorder/components/DragAndDropPanel.module.scss";
import { Color } from "@prisma/client";
import { Flex, Grid } from "@radix-ui/themes";
import Gallery from "@/app/gallery/components/Gallery/Gallery";

const EditPhotosPage: React.FC = () => {
  const [showModal, setShowModal] = useState(true);
  const [userColorChoice, setUserColorChoice] = useState<Color | undefined>();

  const handleChoice = (colorChoice: Color) => {
    setUserColorChoice(colorChoice);
    setShowModal(false);
  };

  const handleChangeGallery = () => {
    setShowModal(true);
  };

  return (
    <>
      <Modal isShown={showModal} title="Choose a gallery to edit">
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
        {!showModal && (
          <Flex direction="column">
            <h1 className="text-3xl font-bold mb-5">Choose a photo to edit</h1>
            <Gallery
              currentColor={userColorChoice}
              handleChangeGallery={handleChangeGallery}
            />
          </Flex>
        )}
      </GalleryPhotosProvider>
    </>
  );
};

export default EditPhotosPage;
