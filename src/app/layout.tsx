import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header"; // <-- 1. Impor Head
import 'leaflet/dist/leaflet.css';



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lapor Warga Sadang Serang",
  description: "Platform pelaporan masalah lingkungan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header /> {/* <-- 2. Letakkan Header di sini */}
        {children}
        <div id="dropdown-portal"></div>
      </body>
    </html>
  );
}



