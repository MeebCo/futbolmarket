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
  title: "Meebits Fútbol - Football Prediction Markets",
  description:
    "Trade prediction markets for the World Cup 2026 and Champions League. Buy and sell shares on match outcomes, tournament winners, and more — powered by Polymarket.",
  openGraph: {
    title: "Meebits Fútbol - Football Prediction Markets",
    description:
      "Trade prediction markets for World Cup 2026 and Champions League powered by Polymarket.",
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border py-6 text-center text-xs text-silver">
            <p>Meebits Fútbol - Powered by Polymarket Builder API</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
