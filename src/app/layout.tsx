import type { Metadata } from "next";
import "./globals.css";
import PageTransitionWrapper from "@/components/PageTransitionWrapper";
import WalletProviderWrapper from "@/components/WalletProvider";

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
        <WalletProviderWrapper>
          <PageTransitionWrapper>
            {children}
          </PageTransitionWrapper>
        </WalletProviderWrapper>
      </body>
    </html>
  );
}
