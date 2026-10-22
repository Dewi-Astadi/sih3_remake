import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-public-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | SIH3 BBWS Serayu Opak",
    default: "Portal SIH3 Wilayah Sungai Serayu Opak",
  },
  description:
    "Sistem Informasi Hidrologi, Hidrometeorologi, dan Hidrogeologi (SIH3) Balai Besar Wilayah Sungai Serayu Opak, Direktorat Jenderal Sumber Daya Air, Kementerian Pekerjaan Umum.",
  keywords: [
    "SIH3",
    "BBWS Serayu Opak",
    "Kementerian Pekerjaan Umum",
    "Ditjen SDA",
    "Hidrologi",
    "Hidrometeorologi",
    "Hidrogeologi",
    "TMA",
    "Curah Hujan",
    "Kualitas Air",
  ],
  authors: [{ name: "Balai Besar Wilayah Sungai Serayu Opak" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${publicSans.variable} font-sans h-full`}>
      <body className="flex min-h-screen flex-col bg-page text-ink antialiased">
        <a href="#main-content" className="skip-link">
          Lewati ke konten utama
        </a>
        <Navbar />
        <main id="main-content" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
