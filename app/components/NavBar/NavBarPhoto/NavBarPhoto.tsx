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
  const galleryIds = photos?.map((photo) => photo.publicId);
  const currentPhotoIndexInGallery = galleryIds?.findIndex(
    (id: string) => id === currentPhotoId,
  );

  // for the recent gallery, we use a neutral color (black)
  const displayColor = currentColor || "black";

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
      {photos &&
        galleryIds &&
        (currentPhotoIndexInGallery || currentPhotoIndexInGallery === 0) && (
          <>
            <ColorSquare
              color={displayColor}
              buttonVariant="previous"
              isDisabled={currentPhotoIndexInGallery === 0}
              className="mt-3.5"
              onButtonClicked={() =>
                onButtonClicked(photos[currentPhotoIndexInGallery - 1].publicId)
              }
            >
              <Image
                width="48"
                height="48"
                src={`/images/left-arrow${currentColor === 'white' && '-black' || currentColor === 'blackwhite' && '-blackwhite' || '-white'}.svg`}
                alt="previous photo"
              />
            </ColorSquare>
            <ColorSquare
              color={displayColor}
              buttonVariant="next"
              isDisabled={currentPhotoIndexInGallery === galleryIds.length - 1}
              className="mt-3.5"
              onButtonClicked={() =>
                onButtonClicked(photos[currentPhotoIndexInGallery + 1].publicId)
              }
            >
              <Image
                width="48"
                height="48"
                src={`/images/right-arrow${currentColor === 'white' && '-black' || currentColor === 'blackwhite' && '-blackwhite' || '-white'}.svg`}
                alt="next photo"
              />
            </ColorSquare>
          </>
        )}
    </nav>
  );
};

export default NavBarPhoto;
