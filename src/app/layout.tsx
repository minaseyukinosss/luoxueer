import type { Metadata } from "next";
import { Fjalla_One, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PreLoader from "@/components/PreLoader";
import { LocaleProvider } from "@/components/LocaleProvider";
import NavbarWrapper from "@/components/NavbarWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fjallaOne = Fjalla_One({
  variable: "--font-fjalla-one",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luoxueer",
  description: "Just another design studio",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fjallaOne.variable} antialiased`}
      >
        <PreLoader />
        <LocaleProvider>
          <NavbarWrapper />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
