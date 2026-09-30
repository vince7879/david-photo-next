import React from "react";
import navBarStyles from "../NavBar.module.scss";
import Link from "next/link";
import Image from "next/image";
import { ColorSquare } from "@/app/components/ColorSquare/ColorSquare";
import { Photo } from "@prisma/client";

interface NavBarPhotoProps {
  photos: Photo[];
  onButtonClicked: (id: string) => void;
  currentColor?: Photo['color'];
  currentPhotoId?: Photo['publicId'];
}

const NavBarPhoto: React.FC<NavBarPhotoProps> = ({
  photos,
  onButtonClicked,
  currentColor,
  currentPhotoId,
}) => {
  const currentPhotoIndexInGallery = photos?.findIndex(
    (photo) => photo.publicId === currentPhotoId,
  );
  const hasValidIndex =
    currentPhotoIndexInGallery !== undefined && currentPhotoIndexInGallery >= 0;

  // for the recent gallery, we use a neutral color (black)
  const displayColor = currentColor || "black";

  const arrowSuffix =
    currentColor === "white"
      ? "-black"
      : currentColor === "blackwhite"
      ? "-blackwhite"
      : "-white";

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

      {/* current gallery color (or multicolor from recent gallery) for the Photo page */}
      {<ColorSquare color={currentColor || "recent"} />}

      {/* 2 arrows to switch from one to another photo of the current gallery */}
      {photos && hasValidIndex && (
        <>
          <ColorSquare
            color={displayColor}
            buttonVariant="previous"
            isDisabled={currentPhotoIndexInGallery === 0}
            className="mt-3.5"
            onButtonClicked={() => {
              if (currentPhotoIndexInGallery > 0) {
                onButtonClicked(photos[currentPhotoIndexInGallery - 1].publicId);
              }
            }}
          >
            <Image
              width="48"
              height="48"
              src={`/images/left-arrow${arrowSuffix}.svg`}
              alt="previous photo"
            />
          </ColorSquare>
          <ColorSquare
            color={displayColor}
            buttonVariant="next"
            isDisabled={currentPhotoIndexInGallery === photos.length - 1}
            className="mt-3.5"
            onButtonClicked={() => {
              if (currentPhotoIndexInGallery < photos.length - 1) {
                onButtonClicked(photos[currentPhotoIndexInGallery + 1].publicId);
              }
            }}
          >
            <Image
              width="48"
              height="48"
              src={`/images/right-arrow${arrowSuffix}.svg`}
              alt="next photo"
            />
          </ColorSquare>
        </>
      )}
    </nav>
  );
};

export default NavBarPhoto;
