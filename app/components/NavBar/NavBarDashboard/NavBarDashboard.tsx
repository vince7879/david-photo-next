import React from "react";
import navBarStyles from "../NavBar.module.scss";
import { COLORS } from "@/app/constants/colors";
import Link from "next/link";
import Image from "next/image";
import { ColorSquare } from "../../ColorSquare/ColorSquare";
import { signOut } from "next-auth/react";

// interface NavBarDashboardProps {
//   currentColor: any;
// }

// @todo: move the navbar into the page where it's used if it's not used in multiple places
const NavBarDashboard: React.FC = () => (
  <nav className={`flex flex-col justify-between items-center`}>
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
  <Link href={"/dashboard/add-photo"}>Add Photo</Link>
  <Link href={"/dashboard/reorder-photos"}>Reorder Photos</Link>
  <button onClick={() => signOut({ redirectTo: "/" })}>Sign Out</button>
</nav>
);

export default NavBarDashboard;
