import React, { useState } from "react";
import Image from "next/image";
import { Text } from "@radix-ui/themes";
import { rgbDataURL } from "@/app/constants/placeholderImage";

interface PhotoProps {
  data: any;
}

const Photo: React.FC<PhotoProps> = ({ data }) => {
  const [imageIsLoading, setImageIsLoading] = useState(true);

  /* @todo: handle year in the photo data */
  const legend: string = `${
    data.place.charAt(0).toUpperCase() +
    data.place.slice(1)
  }, ${data.month.toLowerCase()} ${data.year}`;

  return (
    <div>
      <Image
        src={data.photoUrl}
        alt={legend}
        width={1000}
        height={670}
        placeholder="blur"
        blurDataURL={rgbDataURL(46, 46, 46)}
        style={{
          objectFit: "contain",
          maxHeight: "670px",
          objectPosition: "left",
        }}
        onLoad={() => setImageIsLoading(false)}
      />
      {!imageIsLoading && <Text as="p">{legend}</Text>}
    </div>
  );
};

export default Photo;
