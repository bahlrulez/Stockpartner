import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";
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
  metadataBase: new URL("https://stockwise.example.com"),
  title: {
    default: "StockWise — Indian Stock Discovery & Trading Dashboard",
    template: "%s | StockWise",
  },
  description: "A high-performance, mobile-first financial dashboard tracking top NSE India stocks. Enjoy secure API server caching, real-time market insights, and simulated trading views.",
  keywords: ["Indian Stocks", "NSE", "BSE", "Trading Dashboard", "Stock Market", "Finance", "Investment", "Nifty 50", "Live Quotes"],
  authors: [{ name: "StockWise Team" }],
  creator: "StockWise",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://stockwise.example.com",
    title: "StockWise — Indian Stock Discovery & Trading Dashboard",
    description: "A high-performance, mobile-first financial dashboard tracking top NSE India stocks.",
    siteName: "StockWise",
  },
  twitter: {
    card: "summary_large_image",
    title: "StockWise — Indian Stock Discovery & Trading Dashboard",
    description: "A high-performance, mobile-first financial dashboard tracking top NSE India stocks.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col transition-colors duration-500">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
