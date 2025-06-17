import React from "react";
import navBarStyles from "../NavBar.module.scss";
import Link from "next/link";
import Image from "next/image";
import { ColorSquare } from "../../ColorSquare/ColorSquare";
import { Color } from "@prisma/client";

interface NavBarGalleryProps {
  currentColor: Color;
}

const NavBarGallery: React.FC<NavBarGalleryProps> = ({ currentColor }) => (
  <nav
    className={`flex flex-col justify-between items-center ${navBarStyles.navBar}`}
  >
    {/* mini-mondrian to go to the homepage */}
    <Link href="/" className="mb-3.5">
      <Image
        src="/images/mondrian-mini.png"
        alt="mondrian-mini"
        width={50}
        height={50}
        priority={true}
      />
    </Link>

    {/* list of colors' squares to go to the galleries (for the Gallery page) */}
    {Object.values(Color)
      .filter((color) => color !== currentColor)
      .map((color) => (
        <ColorSquare key={color} color={color} />
      ))}
  </nav>
);

export default NavBarGallery;
