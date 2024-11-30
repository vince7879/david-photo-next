import React from "react";
import classNames from "classnames";
import Link from "next/link";
import colorShapeStyles from "@/app/components/ColorShape/ColorShape.module.scss";
import colorSquareStyles from "./ColorSquare.module.scss";

interface ColorSquareProps {
  color: any;
}

export const ColorSquare: React.FC<ColorSquareProps> = ({ color }) => (
  <Link href={`/gallery/${color}`}>
    <div
      style={{ width: "50px", height: "50px" }}
      className={classNames(colorShapeStyles.shape, colorSquareStyles.square, {
        [colorShapeStyles[`shape--${color}`]]: true,
        [colorSquareStyles["square--has-grey-borders"]]: true,
      })}
    ></div>
  </Link>
);
