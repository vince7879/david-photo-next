import React, { useState } from "react";
import Image from "next/image";
import { Skeleton, Text } from "@radix-ui/themes";
import { rgbDataURL } from "@/app/constants";
import photoStyles from "@/app/gallery/[color]/photo/[photoId]/components/Photo/Photo.module.scss";
import classNames from "classnames";
import { Photo as TPhoto } from "@prisma/client";

interface PhotoProps {
  photos: TPhoto[];
  id?: TPhoto["publicId"];
}

const Photo: React.FC<PhotoProps> = ({ photos, id }) => {
  const [imageIsLoading, setImageIsLoading] = useState(true);

  const photo = photos?.find((photo) => photo.publicId === id);

  const legend: string = `${
    photo && photo.place.charAt(0).toUpperCase() + photo.place.slice(1)
  }, ${photo?.month.toLowerCase()} ${photo?.year}`;

  return !photo ? (
    <Skeleton
      width={{ initial: "478px", md: "735px", lg: "1000px" }}
      height={{ initial: "318px", md: "490px", lg: "670px" }}
    />
  ) : (
    <div>
      <Image
        src={photo.photoUrl}
        alt={legend}
        width={1000}
        height={670}
        placeholder="blur"
        blurDataURL={rgbDataURL(46, 46, 46)}
        onLoad={() => setImageIsLoading(false)}
        className={classNames("object-contain object-left max-h-[670px]", {
          [photoStyles.image]: true,
        })}
      />
      {!imageIsLoading && <Text as="p">{legend}</Text>}
    </div>
  );
};

export default Photo;