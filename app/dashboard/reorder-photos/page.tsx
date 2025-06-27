"use client";

import { GalleryPhotosProvider } from "@/app/contexts/GalleryPhotosContext";
import React, { useState } from "react";
import DragAndDropPanel from "./DragAndDropPanel";
import NavBarDashboard from "@/app/components/NavBar/NavBarDashboard/NavBarDashboard";
import Modal from "@/app/components/Modal/Modal";
import { Color } from "@prisma/client";

const ReorderPhotosPage: React.FC = () => {
  const [showModal, setShowModal] = useState(true);
  const [userColorChoice, setUserColorChoice] = useState<Color | null>(null);

  const handleChoice = (colorChoice: Color) => {
    setUserColorChoice(colorChoice);
    setShowModal(false)
  };

  const handleChooseGallery = () => {
    setShowModal(true);
  };

  return (
    <>
      <Modal
        isShown={showModal}
        title="Choose a color to edit"
      >
        {Object.values(Color).map((color) => (
          // @todo: style the color buttons in the modal
          <button key={color} onClick={() => handleChoice(color)}>
            {color}
          </button>
        ))}
      </Modal>

      <GalleryPhotosProvider color={userColorChoice!}>
        <aside>
          <NavBarDashboard />
        </aside>
        <DragAndDropPanel currentColor={userColorChoice} handleChooseGallery={handleChooseGallery} />
      </GalleryPhotosProvider>
    </>
  );
};

export default ReorderPhotosPage;
