import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/theme-provider";
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
    default: "Free SQL Tools Online | Database Tools - ChartDB",
    template: "%s",
  },
  description:
    "Free online SQL and database tools by ChartDB. SQL syntax checker, SQL validator, query formatter & more. Privacy-focused - all tools run in your browser.",
  keywords: [
    "SQL tools",
    "free SQL tools online",
    "database tools",
    "SQL syntax checker",
    "SQL validator",
    "SQL query tools",
    "ChartDB",
    "online SQL tools",
    "free database tools",
  ],
  authors: [{ name: "ChartDB", url: "https://chartdb.io" }],
  metadataBase: new URL("https://chartdb.io/tools"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chartdb.io/tools",
    siteName: "ChartDB Tools",
    title: "Free SQL Tools Online | Database Tools - ChartDB",
    description:
      "Free online SQL and database tools. SQL syntax checker, validator & more. Privacy-focused - runs in your browser.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free SQL Tools Online | Database Tools - ChartDB",
    description:
      "Free online SQL and database tools. SQL syntax checker, validator & more. Privacy-focused - runs in your browser.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://chartdb.io/tools",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
