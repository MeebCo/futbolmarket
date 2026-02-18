import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import { Header } from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FutbolMarket - World Cup 2026 Prediction Markets",
  description:
    "Trade prediction markets for FIFA World Cup 2026. Buy and sell shares on match outcomes, tournament winners, and more — powered by Polymarket.",
  openGraph: {
    title: "FutbolMarket - World Cup 2026 Prediction Markets",
    description:
      "Trade prediction markets for FIFA World Cup 2026 powered by Polymarket.",
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-500">
            <p>FutbolMarket - Powered by Polymarket Builder API</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
