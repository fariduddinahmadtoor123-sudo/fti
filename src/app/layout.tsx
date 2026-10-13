import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FTI — Institutional Commodity Intelligence",
  description:
    "Institutional Gold (XAU/USD) and Crude Oil (WTI) signals with session liquidity, macro risk, and confluence scoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
