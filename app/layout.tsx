import "@radix-ui/themes/styles.css";
import "./theme-config.css";
import "./globals.scss";
import * as Sentry from "@sentry/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Theme, ThemePanel } from "@radix-ui/themes";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export function generateMetadata(): Metadata {
  return {
    title: "David Photo",
    description: "Cool photo galleries by color",
    other: {
      ...Sentry.getTraceData(),
    },
  };
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <Theme appearance="dark" accentColor="teal" scaling="105%">
          <main className="px-5 py-8 flex">{children}</main>
        </Theme>
      </body>
    </html>
  );
}
