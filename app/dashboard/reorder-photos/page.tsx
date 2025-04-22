"use client";

import { GalleryPhotosProvider } from "@/app/contexts/GalleryPhotosContext";
import React from "react";
import DragAndDropPanel from "./DragAndDropPanel";
import NavBarDashboard from "@/app/components/NavBar/NavBarDashboard/NavBarDashboard";

const ReorderPhotosPage: React.FC = () => (
  // @todo: make the color dynamic
  <GalleryPhotosProvider color={"red"}>
    <aside>
      <NavBarDashboard />
    </aside>
    <DragAndDropPanel />
  </GalleryPhotosProvider>
);

export default ReorderPhotosPage;
