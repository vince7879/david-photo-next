import React from "react";
import navBarStyles from "../NavBar.module.scss";
import Link from "next/link";
import Image from "next/image";
import { ColorSquare } from "../../ColorSquare/ColorSquare";

interface NavBarGalleryProps {
  currentColor: any;
  galleryIds?: string[];
  currentPhotoId?: string;
  onButtonClicked?: (data: string) => void;
}

const NavBarGallery: React.FC<NavBarGalleryProps> = ({
  currentColor,
  galleryIds,
  currentPhotoId,
  onButtonClicked,
}) => {
  const currentPhotoIndexInGallery = galleryIds?.findIndex(
    (galleryId) => galleryId === currentPhotoId
  );

  return (
    <nav className={`flex flex-col items-center ${navBarStyles.navBar}`}>
      {/* mini-mondrian to go to the homepage */}
      <Link href="/" className="mb-7">
        <Image
          src="/images/mondrian-mini.png"
          alt="mondrian-mini"
          width={50}
          height={50}
          priority={true}
        />
      </Link>

      {/* current gallery color (for the Photo page) */}
      {<ColorSquare color={currentColor} />}

      {/* @todo: display 2 arrows to swith from to another photo from that gallery */}
      {galleryIds && (
        <>
          <ColorSquare
            color={currentColor}
            buttonVariant="previous"
            isDisabled={currentPhotoIndexInGallery === 0}
            className="mt-3.5"
            onButtonClicked={onButtonClicked}
          >
            <Image
              width="48"
              height="48"
              src="/images/left-arrow.svg"
              alt="previous photo"
            />
          </ColorSquare>
          <ColorSquare
            color={currentColor}
            buttonVariant="next"
            isDisabled={currentPhotoIndexInGallery === galleryIds.length - 1}
            className="mt-3.5"
            onButtonClicked={onButtonClicked}
          >
            <Image
              width="48"
              height="48"
              src="/images/right-arrow.svg"
              alt="next photo"
            />
          </ColorSquare>
        </>
      )}
    </nav>
  );
};

export default NavBarGallery;
