import type { Metadata } from "next";
import { Fraunces, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const urdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-urdu",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FTI — خوش آمدید",
  description: "FTI — نیا پروجیکٹ شروع۔ سب ڈومین کامیابی سے منسلک ہے۔",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ur" dir="rtl">
      <body className={`${display.variable} ${urdu.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
