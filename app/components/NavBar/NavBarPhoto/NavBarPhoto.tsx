import React from "react";
import navBarStyles from "../NavBar.module.scss";
import Link from "next/link";
import Image from "next/image";
import { ColorSquare } from "../../ColorSquare/ColorSquare";
import { usePhotosByColorData } from "@/app/contexts/GalleryPhotosContext";
import { Photo } from "@prisma/client"

interface NavBarPhotoProps {
  currentColor: Photo['color'];
  currentPhotoId?: Photo['publicId'];
  onButtonClicked: (id: string) => void;
}

const NavBarPhoto: React.FC<NavBarPhotoProps> = ({
  currentColor,
  currentPhotoId,
  onButtonClicked,
}) => {
  const photosByColor = usePhotosByColorData();
  const galleryIds = photosByColor?.map((photo) => photo.publicId);
  const currentPhotoIndexInGallery = galleryIds?.findIndex(
    (id: string) => id === currentPhotoId
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

      {/* 2 arrows to swith from one to another photo of the current gallery */}
      {photosByColor && galleryIds && (currentPhotoIndexInGallery || currentPhotoIndexInGallery === 0) && (
        <>
          <ColorSquare
            // @todo: color black for the black and white arrow btns
            color={currentColor}
            buttonVariant="previous"
            isDisabled={currentPhotoIndexInGallery === 0}
            className="mt-3.5"
            onButtonClicked={() =>
              onButtonClicked(
                photosByColor[currentPhotoIndexInGallery - 1].publicId
              )
            }
          >
            <Image
              width="48"
              height="48"
              src="/images/left-arrow.svg"
              alt="previous photo"
            />
          </ColorSquare>
          <ColorSquare
            // @todo: color black for the black and white arrow btns
            color={currentColor}
            buttonVariant="next"
            isDisabled={currentPhotoIndexInGallery === galleryIds.length - 1}
            className="mt-3.5"
            onButtonClicked={() =>
              onButtonClicked(
                photosByColor[currentPhotoIndexInGallery + 1].publicId
              )
            }
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

export default NavBarPhoto;
