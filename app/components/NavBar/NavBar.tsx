"use client";

import React from "react";
import navBarStyles from "./NavBar.module.scss";
import { COLORS } from "@/app/constants/colors";
import Link from "next/link";
import Image from "next/image";
import { ColorSquare } from "../ColorSquare/ColorSquare";

interface NavBarProps {
  currentColor: any;
}

const NavBar: React.FC<NavBarProps> = ({ currentColor }) => {
  return (
    <nav
      className={`flex flex-col justify-between items-center ${navBarStyles.navBar}`}
    >
      {/* @todo: mini-mondrian at the top */}
      <Link href="/" className="mb-3.5">
        <Image
          src="/images/mondrian-mini.png"
          alt="mondrian-mini"
          width={50}
          height={50}
        />
      </Link>
      {/* @todo: create the squares for the colors */}
      {Object.values(COLORS)
        .filter((color) => color !== currentColor)
        .map((color) => (
          <ColorSquare key={color} color={color} />
        ))}
    </nav>
  );
};

export default NavBar;
