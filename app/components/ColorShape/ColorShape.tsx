import React from 'react'
import classNames from "classnames";
import Link from "next/link";
import homeStyles from "@/app/styles/Home.module.scss"
import colorShapeStyles from "./ColorShape.module.scss";
import { Color } from '@prisma/client';

interface ColorShapeProps {
  variant: string
  color: Color
}

export const ColorShape: React.FC<ColorShapeProps> = ({ variant, color }) => (
  <Link href={`/gallery/${color}`}>
    <div
      className={classNames(homeStyles.shape, colorShapeStyles.shape,  {
        [colorShapeStyles[`shape--${variant}`]]: true,
        [colorShapeStyles[`shape--${color}`]]: true,
      })}
    ></div>
  </Link>
);
