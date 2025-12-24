import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Free Database Tools | ChartDB",
    template: "%s | ChartDB Tools",
  },
  description:
    "Free online database tools by ChartDB. SQL syntax checker, schema validators, and more. All tools run in your browser - your data never leaves your device.",
  keywords: [
    "SQL tools",
    "database tools",
    "SQL syntax checker",
    "ChartDB",
    "database schema",
    "free SQL tools",
  ],
  authors: [{ name: "ChartDB", url: "https://chartdb.io" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tools.chartdb.io",
    siteName: "ChartDB Tools",
    title: "Free Database Tools | ChartDB",
    description:
      "Free online database tools by ChartDB. SQL syntax checker, schema validators, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Database Tools | ChartDB",
    description:
      "Free online database tools by ChartDB. SQL syntax checker, schema validators, and more.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
