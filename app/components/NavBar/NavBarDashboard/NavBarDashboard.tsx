import React from "react";
import navBarStyles from "../NavBar.module.scss";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { ExitIcon, ImageIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

// @todo: move the navbar into the page where it's used if it's not used in multiple places
const NavBarDashboard: React.FC = () => {
  const router = useRouter();

  return (
    <nav
      className={`flex flex-col justify-between items-center ${navBarStyles.navBarDashboard}`}
    >
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
      <IconButton
        variant="ghost"
        className={navBarStyles.navBarDashboard__toolButton}
        onClick={() => router.push("/dashboard/add-photo")}
        mb="3"
      >
        <ImageIcon width="58" height="58" />
      </IconButton>
      <IconButton
        variant="ghost"
        className={navBarStyles.navBarDashboard__toolButton}
        onClick={() => router.push("/dashboard/reorder-photos")}
        mb="9"
      >
        <Pencil2Icon width="58" height="58" viewBox="2 1 12 14" />
      </IconButton>
      <button title="sign out" onClick={() => signOut({ redirectTo: "/" })}>
        <ExitIcon width="58" height="58" />
      </button>
    </nav>
  );
};

export default NavBarDashboard;
