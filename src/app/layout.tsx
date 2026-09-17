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
  openGraph: {
    title: "Student Development Council",
    description: siteDescription,
    url: "https://sdcwebsite.vercel.app",
    siteName: "Student Development Council",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}