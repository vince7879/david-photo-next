import React, { useState, useEffect } from "react";
import modalStyles from "./Modal.module.scss";
import { Color } from "@prisma/client";
import { ColorSquare } from "@/app/components/ColorSquare/ColorSquare";

interface ModalProps {
  isShown: boolean;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isShown,
  title,
  children,
}) => {
  const [show, setShow] = useState(isShown);

  useEffect(() => {
    setShow(isShown);
  }, [isShown]);

  const handleCloseModal = () => {
    setShow(false);
  };

  if (!show) return null;

  return (
    // @todo: find a way to add onClick on the overlay to handle the close of the Modal if the user clicks outside of it? Attention: find what to do on the close of the 1st modal when there are no color to edit behind
    <div className={modalStyles.modal}>
      <div className={modalStyles["modal-content"]}>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default Modal;
