import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "./WalletProvider";
import { GuestProvider } from "./GuestProvider";
import { AppSessionProvider } from "./SessionProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Omnivael Universe",
  description: "Explore the Omnivael Universe: comics, short stories, and living lore.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppSessionProvider>
          <GuestProvider>
            <WalletProvider>{children}</WalletProvider>
          </GuestProvider>
        </AppSessionProvider>
      </body>
    </html>
  );
}
