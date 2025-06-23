import React, { useState, useEffect } from "react";
import modalStyles from "./Modal.module.scss";
import { Color } from "@prisma/client";
import { ColorSquare } from "@/app/components/ColorSquare/ColorSquare";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  onChoose: (color: Color) => void;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, onChoose }) => {
  const handleChoice = (color: Color) => {
    onChoose(color);
    onClose();
  };

  if (!show) return null;

  return (
    // @todo: add onClick to that div to handle the close of the Modal if the user clicks outside of it. Attention: find what to do on the close of the 1st modal when there are no color to edit behind
    <div className={modalStyles.modal} onClick={() => console.log('>>>>> close <<<<<<')}>
      <div className={modalStyles["modal-content"]}>
        <h2>Choose a color to edit</h2>
        {Object.values(Color).map((color) => (
          // @todo: style the color buttons in the modal
          <button key={color} onClick={() => handleChoice(color)}>
            {color}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Modal;
