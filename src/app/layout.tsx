import type { Metadata, Viewport } from "next";
import { Fjalla_One, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalFooter from "@/shared/components/layout/ConditionalFooter";
import AppNavbar from "@/shared/components/layout/AppNavbar";
import { LocaleProvider } from "@/shared/components/providers/LocaleProvider";
import LenisProvider from "@/shared/components/providers/LenisProvider";
import PageTransition from "@/shared/components/transitions/PageTransition";
import Preloader from "@/shared/components/transitions/Preloader";

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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fjallaOne.variable} antialiased`}
      >
        <LenisProvider>
          <Preloader />
          <LocaleProvider>
            <AppNavbar />
            <PageTransition>
              {children}
              <ConditionalFooter />
            </PageTransition>
          </LocaleProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
