import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { site, absoluteUrl } from "@/lib/site";
import { themeInitScript } from "@/lib/theme";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  preload: false,
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: "%s | ShyRobin" },
  description: site.description,
  alternates: { types: { "application/rss+xml": absoluteUrl("/feed.xml") } },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "zh_CN",
    images: [
      { url: absoluteUrl("/og"), width: 1200, height: 630, alt: site.title },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [absoluteUrl("/og")],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
