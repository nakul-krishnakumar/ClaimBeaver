import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StickyGlassNavbar from "@/components/navbar/navbar";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Claim Beaver",
  description: "Claim Beaver is a platform that helps you claim your insurance easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-white`}
      >
        <StickyGlassNavbar />
        {children}
      </body>
    </html>
  );
}
