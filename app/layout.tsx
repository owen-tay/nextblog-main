import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../app/components/Navbar";
import Navinfo from "./components/Navinfo";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blog | Owen Taylor",
  description: "A little blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-theme="forest" lang="en">
      <head>
      </head>
      <body>
        <Navbar/>
        <Navinfo />
        {children}
      </body>
    </html>
  );
}
