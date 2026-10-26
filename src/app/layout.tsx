import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { JsonLd } from "@/components/seo/json-ld";
import { siteName } from "@/lib/content/site";
import { homeMetadata, siteUrl, titleSuffix } from "@/lib/seo";
import { siteStructuredData } from "@/lib/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...homeMetadata(),
  metadataBase: new URL(siteUrl),
  title: {
    default: "Student Development Council (SDC), IISER Bhopal",
    template: `%s | ${titleSuffix}`,
  },
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "education",
  formatDetection: { telephone: false },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#0b2438",
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Applies the stored theme before first paint so dark mode never flashes light. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem("sdc-theme")==="dark"){document.documentElement.classList.add("dark")}}catch(e){}})();`,
          }}
        />
        <JsonLd data={siteStructuredData()} />
      </head>
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
