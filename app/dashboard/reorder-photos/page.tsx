"use client";

import { GalleryPhotosProvider } from "@/app/contexts/GalleryPhotosContext";
import React, { useEffect, useState } from "react";
import DragAndDropPanel from "./DragAndDropPanel";
import NavBarDashboard from "@/app/components/NavBar/NavBarDashboard/NavBarDashboard";
import Modal from "./Modal";
import { Color } from "@prisma/client";


const ReorderPhotosPage: React.FC = () => {
  const [showModal, setShowModal] = useState(true);
  const [userColorChoice, setUserColorChoice] = useState<Color | null>(null);

  const handleChoice = (colorChoice: Color) => {
    setUserColorChoice(colorChoice);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  const handleChooseGallery = () => {
    setShowModal(true);
  };

  return (
    <>
      <Modal
        show={showModal}
        onClose={handleCloseModal}
        onChoose={handleChoice}
      />
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
