import { NextResponse } from "next/server";
import { auth } from "@/auth";

const BLOCKED_BOTS = ["gptbot", "ahrefs", "semrush", "mj12", "dotbot", "petalbot", "bytespider"];

export const config = {
  matcher: ["/", "/gallery/:path*", "/dashboard/:path*", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = pathname.startsWith("/dashboard") || pathname.includes("/edit");

  // 🔐 Protection stricte des zones d'administration
  if (isProtected) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/unauthorized", req.nextUrl));
    }
    return NextResponse.next();
  }

  // 🤖 Filtrage robots sur les routes publiques
  const ua = (req.headers.get("user-agent") ?? "").toLowerCase();
  if (!ua.includes("googlebot") && BLOCKED_BOTS.some((bot) => ua.includes(bot))) {
    return new Response("Forbidden", { status: 403 });
  }

  return NextResponse.next();
});