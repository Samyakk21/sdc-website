import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { siteDescription } from "@/lib/content/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sdcwebsite.vercel.app"),
  title: {
    default: "SDC | Student Development Council",
    template: "%s | Student Development Council",
  },
  description: siteDescription,
  themeColor: "#0b2438",
  openGraph: {
    title: "Student Development Council",
    description: siteDescription,
    url: "https://sdcwebsite.vercel.app",
    siteName: "Student Development Council",
    images: [
      {
        url: "https://sdcwebsite.vercel.app/images/sdc-hero.jpeg",
        width: 1402,
        height: 1404,
        alt: "Student Development Council",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://sdcwebsite.vercel.app/images/sdc-hero.jpeg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="fixed left-4 top-4 z-50 block -translate-y-96 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}