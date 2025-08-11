"use client";

import React, { useState } from "react";
import classNames from "classnames";
import homeStyles from "@/app/styles/Home.module.scss";
import { ColorShape } from "./components/ColorShape/ColorShape";
import Image from "next/image";
import { Color } from "@prisma/client";
import { signIn } from "next-auth/react";
import { Spinner } from "@radix-ui/themes";

const Home: React.FC = () => {
  const [dashboardIsLoading, setDashboardIsLoading] = useState(false);

  const handleSignIn = () => {
    setDashboardIsLoading(true);
    signIn("google", { redirectTo: "/dashboard/new" });
  };

  return (
    <section className="main-frame">
      {/* <TopWhiteRecent> */}
      <div className={classNames(homeStyles.shape, homeStyles.topWhiteRecent)}>
        <span>新鋭</span>
      </div>
      {/* </TopWhiteRecent> */}
      {/* top green */}
      <ColorShape variant="top-middle" color={Color.green} />
      {/* top orange */}
      <ColorShape variant="top-right" color={Color.orange} />
      {/* left brown */}
      <ColorShape variant="left-side-top" color={Color.brown} />
      {/* left white */}
      <ColorShape variant="left-side-middle" color={Color.white} />
      {/* left yellow */}
      <ColorShape variant="left-side-bottom" color={Color.yellow} />
      {/* big red */}
      <ColorShape variant="big-square" color={Color.red} />
      {/* big yellow */}
      <ColorShape variant="top-small-square" color={Color.yellow} />
      {/* long grey */}
      <ColorShape variant="first-vertical-rectangle" color={Color.grey} />
      {/* long purple */}
      <ColorShape variant="second-vertical-rectangle" color={Color.purple} />
      {/* purple square */}
      <ColorShape variant="bottom-small-square" color={Color.purple} />
      {/* center black */}
      <ColorShape variant="first-horizontal-rectangle" color={Color.black} />
      {/* center green */}
      <ColorShape variant="third-horizontal-rectangle" color={Color.green} />

      <div
        className={classNames(homeStyles.shape, homeStyles.signature)}
        onClick={handleSignIn}
      >
        {dashboardIsLoading ? (
          <Spinner size="3" className={homeStyles.spinner} />
        ) : (
          <Image
            src="/images/sign.png"
            alt="signature"
            width={140}
            height={50}
            className="object-contain"
          />
        )}
      </div>

      {/* big blue */}
      <ColorShape variant="big-horizontal-rectangle" color={Color.blue} />
      {/* bottom grey */}
      <ColorShape variant="tiny-horizontal-rectangle" color={Color.grey} />
      {/* bottom black & white */}
      <ColorShape variant="bottom-rectangle" color={Color.blackwhite} />

      <div className={classNames(homeStyles.shape, homeStyles.copyright)}>
        <span>&copy; 2010</span>
        <span>Tous droits réservés</span>
      </div>

      {/* right white */}
      <ColorShape variant="right-side-top" color={Color.white} />
      {/* right orange */}
      <ColorShape variant="right-side-bottom" color={Color.orange} />
    </section>
  );
};

export default Home;
