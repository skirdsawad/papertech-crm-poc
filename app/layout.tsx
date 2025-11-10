import type { Metadata } from "next";
import { Figtree, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-figtree',
});

const notoSansThai = Noto_Sans_Thai({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["thai"],
  display: 'swap',
  variable: '--font-noto-sans-thai',
});

export const metadata: Metadata = {
  title: "PaperTech CRM POC",
  description: "CRM proof of concept for PaperTech",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} ${notoSansThai.variable} font-sans`}>{children}</body>
    </html>
  );
}
