import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TROLL - Become a Troll Now",
  description: "The official $TROLL memecoin website. Learn how to buy, explore origins, watch shorts, and view charts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-pixel">{children}</body>
    </html>
  );
}
