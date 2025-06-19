// File: src/app/page.tsx (VERSI LANDING PAGE BARU)

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
    .select("*, profiles!inner(full_name)") // Tambah profiles biar konsisten sama page lain
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <>
      {/* ===== Bagian Hero Section ===== */}
      <section
        className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-white pt-20"
        style={{
          backgroundImage: `url('/hero-image.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent"></div>
        <div className="relative z-10 mx-auto max-w-screen-xl px-4 py-8 text-center lg:py-16 animate-fade-in">
          <div className="mx-auto max-w-3xl">
            <h1
              className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl xl:text-6xl animate-fade-in-up"
              style={{ textShadow: "2px 2px 6px rgba(0, 0, 0, 0.6)" }}
            >
              Suarakan Masalah, Bangun Perubahan CI/CD
            </h1>
            <p
              className="mb-6 max-w-2xl font-light text-gray-100 md:text-lg lg:mb-8 lg:text-xl animate-fade-in-up animation-delay-200"
              style={{ textShadow: "1px 1px 4px rgba(0, 0, 0, 0.5)" }}
            >
              Platform pelaporan warga untuk Sadang Serang yang lebih baik.
              Lihat masalah, foto, laporkan, dan pantau perkembangannya secara
              transparan.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4 animate-fade-in-up animation-delay-400">
              <Link
                href="/lapor"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:from-blue-700 hover:to-cyan-600 focus:ring-4 focus:ring-blue-300"
              >
                Lapor Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/laporan-publik"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white shadow-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-300 focus:ring-4 focus:ring-gray-100"
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
          <h2 className="mb-12 text-center text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl animate-fade-in">
            Bagaimana Cara Kerjanya?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-white p-8 text-center shadow-md ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Camera className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-800">
                1. Foto & Amati
              </h3>
              <p className="mt-2 text-slate-600">
                Lihat masalah di sekitar Anda? Ambil foto yang jelas sebagai bukti.
              </p>
            </div>
            <div className="rounded-xl bg-white p-8 text-center shadow-md ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Send className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-800">
                2. Lapor Online
              </h3>
              <p className="mt-2 text-slate-600">
                Isi formulir laporan singkat melalui aplikasi ini, kapan saja dan di mana saja.
              </p>
            </div>
            <div className="rounded-xl bg-white p-8 text-center shadow-md ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-800">
                3. Pantau Proses
              </h3>
              <p className="mt-2 text-slate-600">
                Lihat status laporan Anda dan laporan warga lainnya secara transparan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Bagian Laporan Terbaru ===== */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-screen-xl px-4">
          <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight text-slate-900 animate-fade-in">
            Laporan Terbaru
          </h2>
          {laporans && laporans.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {laporans.map((laporan: Laporan) => (
                <div key={laporan.id} className="animate-fade-in-up animation-delay-200">
                  <LaporanCard laporan={laporan} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 animate-fade-in">
              Belum ada laporan yang masuk.
            </p>
          )}
          <div className="mt-12 text-center animate-fade-in-up animation-delay-400">
            <Link
              href="/laporan-publik"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:from-blue-700 hover:to-cyan-600"
            >
              Lihat Semua Laporan
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
