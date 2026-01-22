import { NextResponse } from "next/server";
import { auth } from "@/auth";

const BLOCKED_BOTS = [
  "gptbot",       // OpenAI
  "ahrefs",
  "semrush",
  "mj12",
  "dotbot",
  "petalbot",
  "bytespider",
];

export const config = {
  matcher: [
    "/", 
    "/gallery/:path*",
    "/dashboard/:path+",
    "/(.*)/edit(.*)",
  ],
};

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // 🔐 Zones protégées → NextAuth gère
  if (
    pathname.startsWith("/dashboard") ||
    pathname.includes("/edit")
  ) {
    return NextResponse.next();
  }

  // 🌍 Pages publiques
  if (pathname === "/" || pathname.startsWith("/gallery")) {
    const ua = (req.headers.get("user-agent") ?? "").toLowerCase();

    // Autoriser Google (SEO)
    if (ua.includes("googlebot")) {
      return NextResponse.next();
    }

    // ❌ Bloquer GPTBot & autres crawlers agressifs
    if (BLOCKED_BOTS.some((bot) => ua.includes(bot))) {
      return new Response(null, { status: 403 });
    }
  }

  return NextResponse.next();
});
