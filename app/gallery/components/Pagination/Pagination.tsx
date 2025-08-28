import React from "react";
import paginationStyles from "./Pagination.module.scss";
import classNames from "classnames";
import { Photo } from "@prisma/client";
import { Cormorant_Upright } from "next/font/google";

const cormorantFont = Cormorant_Upright({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export interface PaginationProps {
  color: Photo["color"];
  handlePagination: () => void;
  pageNumber: 1 | 2
}

const Pagination: React.FC<PaginationProps> = ({
  color,
  handlePagination,
  pageNumber,
}) => {
  return (
    <div
      className={classNames(
        paginationStyles.paginationNumber,
        {
          [paginationStyles["paginationNumber--is-black"]]:
            color === "white",
        },
        cormorantFont.className
      )}
      onClick={handlePagination}
    >
      {pageNumber}
    </div>
  );
};

export default Pagination;
