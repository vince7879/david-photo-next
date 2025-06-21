import React from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { ExitIcon, ImageIcon, MoveIcon } from "@radix-ui/react-icons"

// interface NavBarDashboardProps {
//   currentColor: any;
// }

// @todo: move the navbar into the page where it's used if it's not used in multiple places
const NavBarDashboard: React.FC = () => (
  <nav className={`flex flex-col justify-between items-center`}>
  {/* mini-mondrian to go to the homepage */}
  <Link href="/" className="mb-6">
    <Image
      src="/images/mondrian-mini.png"
      alt="mondrian-mini"
      width={50}
      height={50}
      priority={true}
    />
  </Link>
  <Link href={"/dashboard/add-photo"} title="add a new photo" className="mb-3"><ImageIcon width="58" height="58"/></Link>
  <Link href={"/dashboard/reorder-photos"} title="edit a gallery" className="mb-10"><MoveIcon width="58" height="58" /></Link>
  <button title="sign out" onClick={() => signOut({ redirectTo: "/" })}><ExitIcon width="58" height="58" /></button>
</nav>
);

export default NavBarDashboard;
