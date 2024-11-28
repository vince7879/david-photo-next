"use client";

import React from "react";
import navBarStyles from "./NavBar.module.scss";
import { COLORS } from "@/app/constants/colors";
import Link from "next/link";

interface NavBarProps {
  currentColor: any;
}

const NavBar: React.FC<NavBarProps> = ({ currentColor }) => {
  return (
    <nav className={`flex flex-col justify-between ${navBarStyles.navBar}`}>
      {/* @todo: mini-mondrian at the top */}
      <Link href="/">homepage</Link>
      {/* @todo: create the squares for the colors */}
      {Object.values(COLORS)
        .filter((color) => color !== currentColor)
        .map((color) => (
          <Link key={color} href={`/gallery/${color}`}>
            {color}
          </Link>
        ))}
    </nav>
  );
};

export default NavBar;
