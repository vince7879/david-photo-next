import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Text } from "@radix-ui/themes";

interface PhotoProps {
    id: number
}

const Photo: React.FC<PhotoProps> = ({ id }) => {
  const [isLoading, SetIsLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();


  const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

  const toBase64 = (str: string) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

  return (
    <div>
      <Image
        src={`https://res.cloudinary.com/dnaf0ui17/image/upload/${id}.jpg`}
        alt=""
        width={800}
        height={650}
        placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(800, 650))}`}
        style={{
          objectFit: "contain",
          maxHeight: "650px",
          objectPosition: "left",
        }}
        onLoad={() => SetIsLoading(false)}
      />
      {!isLoading && (
        <Text as="p">{`${
          searchParams.get("place")!.charAt(0).toUpperCase() +
          searchParams.get("place")!.slice(1)
        }, ${searchParams.get("month")} 2024`}</Text>
      )}
    </div>
  );
};

export default Photo;
