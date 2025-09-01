import type { Metadata } from "next";
import "./globals.css";
import PageTransitionWrapper from "@/components/PageTransitionWrapper";

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
      <body className="font-pixel">
        <PageTransitionWrapper>
          {children}
        </PageTransitionWrapper>
      </body>
    </html>
  );
}
