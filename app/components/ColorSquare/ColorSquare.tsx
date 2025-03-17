import React from "react";
import classNames from "classnames";
import Link from "next/link";
import colorShapeStyles from "@/app/components/ColorShape/ColorShape.module.scss";
import colorSquareStyles from "./ColorSquare.module.scss";

export interface ColorSquareProps {
  color: any;
  buttonVariant?: 'previous' | 'next';
  isDisabled?: boolean
  className?: string
  children?: React.ReactNode
  onButtonClicked?: () => void;
}

export const ColorSquare: React.FC<ColorSquareProps> = ({
  color,
  buttonVariant,
  isDisabled,
  className,
  children,
  onButtonClicked,
}) => {
  const square = (
    <div
      style={{ width: "50px", height: "50px" }}
      className={classNames(colorShapeStyles.shape, colorSquareStyles.square, {
        [colorShapeStyles[`shape--${color}`]]: true,
        [colorSquareStyles["square--has-grey-borders"]]: true,
        [colorSquareStyles["square--is-button"]]: buttonVariant,
        [colorSquareStyles["square--is-disabled"]]: isDisabled,
      })}
    >{children}</div>
  );

  return buttonVariant && onButtonClicked ? (
    <button disabled={isDisabled} onClick={onButtonClicked} className={className}>{square}</button>
  ) : (
    <Link href={`/gallery/${color}`} className={className}>{square}</Link>
  );
};
