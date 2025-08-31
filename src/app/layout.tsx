import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "$YAO",
  description: "The official $YAO memecoin. YAO YAO lets get this party started!",
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
