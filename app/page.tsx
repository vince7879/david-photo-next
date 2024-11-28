"use client";

import React from "react";
import classNames from "classnames";
import homeStyles from "@/app/styles/Home.module.scss";
import { ColorShape } from "./components/ColorShape/ColorShape";
import Image from "next/image";
import { COLORS } from "@/app/constants/colors";

const handleClickSign = () =>
  console.log("click signature to access admin panel");

const Home: React.FC = () => (
  <section className="main-frame">
    {/* <TopWhiteRecent> */}
    <div className={classNames(homeStyles.shape, homeStyles.topWhiteRecent)}>
      <span>新鋭</span>
    </div>
    {/* </TopWhiteRecent> */}
    {/* top white */}
    <ColorShape variant="top-middle" color={COLORS.WHITE} />
    {/* top orange */}
    <ColorShape variant="top-right" color={COLORS.ORANGE} />
    {/* left brown */}
    <ColorShape variant="left-side-top" color={COLORS.BROWN} />
    {/* left white */}
    <ColorShape variant="left-side-middle" color={COLORS.WHITE} />
    {/* left yellow */}
    <ColorShape variant="left-side-bottom" color={COLORS.YELLOW} />
    {/* Big red */}
    <ColorShape variant="big-square" color={COLORS.RED} />
    {/* big yellow */}
    <ColorShape variant="top-small-square" color={COLORS.YELLOW} />
    {/* long white */}
    <ColorShape variant="first-vertical-rectangle" color={COLORS.WHITE} />
    {/* long purple */}
    <ColorShape variant="second-vertical-rectangle" color={COLORS.PURPLE} />
    {/* purple square */}
    <ColorShape variant="bottom-small-square" color={COLORS.PURPLE} />
    {/* center black */}
    <ColorShape variant="first-horizontal-rectangle" color={COLORS.BLACK} />
    {/* center green */}
    <ColorShape variant="third-horizontal-rectangle" color={COLORS.GREEN} />

    <div className={classNames(homeStyles.shape, homeStyles.signature)}>
      <Image
        src="/images/sign.png"
        alt="signature"
        width={140}
        height={50}
        style={{ objectFit: "contain" }}
        onClick={() => handleClickSign()}
      />
    </div>

    {/* big blue */}
    <ColorShape variant="big-horizontal-rectangle" color={COLORS.BLUE} />
    {/* bottom grey */}
    <ColorShape variant="tiny-horizontal-rectangle" color={COLORS.GREY} />
    {/* bottom black & white */}
    <ColorShape variant="bottom-rectangle" color={COLORS.BLACK_WHITE} />

    <div className={classNames(homeStyles.shape, homeStyles.copyright)}>
      <span>&copy; 2010 DAVID PREAT</span>
      <span>Tous droits réservés</span>
    </div>

    {/* right white */}
    <ColorShape variant="right-side-top" color={COLORS.WHITE} />
    {/* right orange */}
    <ColorShape variant="right-side-bottom" color={COLORS.ORANGE} />
  </section>
);

export default Home;
