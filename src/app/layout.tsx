import type { Metadata } from "next";
import { Noto_Nastaliq_Urdu, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const urdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-urdu",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Signal Board — On-demand Trading Signals",
  description:
    "Standalone on-demand trading signal dashboard using Twelve Data. Isolated from Agricart ERP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ur">
      <body className={`${sora.variable} ${urdu.variable} antialiased`}>
        <div className="shell">{children}</div>
      </body>
    </html>
  );
}
