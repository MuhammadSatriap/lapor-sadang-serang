// File: src/app/page.tsx (VERSI LANDING PAGE BARU)

import Image from "next/image";
import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import LaporanCard from "@/components/LaporanCard";
import { Laporan } from "@/types";
import { ArrowRight, Camera, Send, CheckCircle } from "lucide-react";

export default async function LandingPage() {
  const cookieStore = await cookies(); // ✅ fix di sini

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
      },
    }
  );

  // Ambil 3 laporan terbaru saja untuk ditampilkan sebagai preview
  const { data: laporans } = await supabase
    .from("laporan")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <>
      {/* ===== Bagian Hero Section ===== */}
      <section
        className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-white"
        style={{
          backgroundImage: `url('/hero-image.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center center", // Posisikan gambar di tengah
        }}
      >
        {/* PERBAIKAN #1: Overlay Gradien yang Lebih Gelap */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>

        <div className="relative z-10 mx-auto max-w-screen-xl px-4 py-8 text-center lg:py-16">
          <div className="mx-auto max-w-3xl">
            {/* PERBAIKAN #2: Menambahkan Bayangan Teks */}
            <h1
              className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl xl:text-6xl"
              style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
            >
              Suarakan Masalah, Bangun Perubahan.
            </h1>
            <p
              className="mb-6 max-w-2xl font-light text-gray-200 md:text-lg lg:mb-8 lg:text-xl"
              style={{ textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)" }}
            >
              Platform pelaporan warga untuk Sadang Serang yang lebih baik.
              Lihat masalah, foto, laporkan, dan pantau perkembangannya secara
              transparan.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
              <Link
                href="/lapor"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-center text-base font-medium text-white shadow-lg transition hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
              >
                Lapor Sekarang
                <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
              </Link>
              <Link
                href="/laporan-publik"
                className="inline-flex items-center justify-center rounded-lg border border-white bg-white/20 px-5 py-3 text-center text-base font-medium text-white shadow-lg backdrop-blur-sm transition hover:bg-white/30 focus:ring-4 focus:ring-gray-100"
              >
                Lihat Semua Laporan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Bagian Cara Kerja ===== */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-screen-xl px-4">
          <h2 className="mb-12 text-center text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Bagaimana Cara Kerjanya?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Kartu 1 */}
            <div className="rounded-xl bg-white p-8 text-center shadow-lg transition-transform duration-300 hover:-translate-y-2">
              {/* PERBAIKAN: Ikon di dalam lingkaran */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Camera className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-800">
                1. Foto & Amati
              </h3>
              <p className="mt-2 text-slate-600">
                Lihat masalah di sekitar Anda? Ambil foto yang jelas sebagai
                bukti.
              </p>
            </div>

            {/* Kartu 2 */}
            <div className="rounded-xl bg-white p-8 text-center shadow-lg transition-transform duration-300 hover:-translate-y-2">
              {/* PERBAIKAN: Ikon di dalam lingkaran */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Send className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-800">
                2. Lapor Online
              </h3>
              <p className="mt-2 text-slate-600">
                Isi formulir laporan singkat melalui aplikasi ini, kapan saja
                dan di mana saja.
              </p>
            </div>

            {/* Kartu 3 */}
            <div className="rounded-xl bg-white p-8 text-center shadow-lg transition-transform duration-300 hover:-translate-y-2">
              {/* PERBAIKAN: Ikon di dalam lingkaran */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-800">
                3. Pantau Proses
              </h3>
              <p className="mt-2 text-slate-600">
                Lihat status laporan Anda dan laporan warga lainnya secara
                transparan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Bagian Laporan Terbaru ===== */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-screen-xl px-4">
          <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight text-slate-900">
            Laporan Terbaru
          </h2>
          {laporans && laporans.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {laporans.map((laporan: Laporan) => (
                <LaporanCard key={laporan.id} laporan={laporan} />
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500">
              Belum ada laporan yang masuk.
            </p>
          )}
          <div className="mt-12 text-center">
            <Link
              href="/laporan-publik"
              className="font-semibold text-blue-600 hover:underline"
            >
              Lihat semua laporan &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
