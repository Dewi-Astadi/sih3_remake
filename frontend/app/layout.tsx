import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | SIH3 BBWS Serayu Opak",
    default: "SIH3 Serayu Opak - Sistem Informasi Hidrologi, Hidrometeorologi, & Hidrogeologi",
  },
  description:
    "Portal Satu Data Hidrologi, Hidrometeorologi, dan Hidrogeologi (SIH3) Balai Besar Wilayah Sungai Serayu Opak, Direktorat Jenderal Sumber Daya Air, Kementerian Pekerjaan Umum.",
  keywords: [
    "SIH3",
    "BBWS Serayu Opak",
    "Kementerian Pekerjaan Umum",
    "Ditjen SDA",
    "Hidrologi",
    "Hidrometeorologi",
    "Hidrogeologi",
    "AWLR",
    "ARR",
    "TMA",
    "Curah Hujan",
    "Sungai Progo",
    "Sungai Opak",
    "Sungai Serayu",
    "Sermo",
  ],
  authors: [{ name: "Balai Besar Wilayah Sungai Serayu Opak" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
        <Navbar />
        <main className="min-h-screen flex-1">{children}</main>
        <Footer />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
