// File: src/app/laporan-publik/page.tsx

import Link from "next/link";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import LaporanCard from "@/components/LaporanCard";
import { Laporan } from "@/types";
import { PlusCircle, MessageSquareWarning, Filter } from "lucide-react";

type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function PapanLaporanPage({ searchParams }: PageProps) {
  const supabase = await createServerSupabaseClient();
  const kategoriFilter = searchParams.kategori as string | undefined;

  let query = supabase
    .from("laporan")
    .select("*")
    .order("created_at", { ascending: false });

  if (kategoriFilter && kategoriFilter !== "Semua") {
    query = query.eq("kategori", kategoriFilter);
  }

  const { data: laporans, error } = await query;

  const daftarKategori = [
    "Semua",
    "Jalan Rusak",
    "Sampah Liar",
    "Lampu Padam",
    "Saluran Air Tersumbat",
    "Gangguan Keamanan",
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-slate-100 min-h-screen">
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 px-4 sm:px-6 md:px-8 pt-[88px] pb-16 max-w-7xl mx-auto space-y-12">
  
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b pb-6 border-slate-200">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              📌 Papan Laporan Warga
            </h1>
            <p className="mt-1 text-slate-500 text-base">
              Laporan masyarakat untuk wilayah Sadang Serang, Bandung.
            </p>
          </div>
          <Link
            href="/lapor"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-blue-700 hover:to-cyan-600 transition"
          >
            <PlusCircle className="h-5 w-5" />
            Buat Laporan Baru
          </Link>
        </div>

        {/* FILTER CARD */}
        <section>
          <div className="flex items-center gap-2 mb-3 text-slate-700">
            <Filter className="h-5 w-5" />
            <h2 className="text-xl font-semibold">
              Filter Berdasarkan Kategori
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {daftarKategori.map((kategori) => {
              const isActive =
                (kategori === "Semua" && !kategoriFilter) ||
                kategoriFilter === kategori;
              return (
                <Link
                  key={kategori}
                  href={
                    kategori === "Semua"
                      ? "/laporan-publik"
                      : `/laporan-publik?kategori=${kategori}`
                  }
                  className={`rounded-full px-5 py-1.5 text-sm font-medium border transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {kategori}
                </Link>
              );
            })}
          </div>
        </section>

        {/* DAFTAR LAPORAN */}
        <section>
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-center text-sm text-red-700 border border-red-200">
              Gagal memuat laporan: {error.message}
            </div>
          )}

          {!error && laporans && laporans.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Daftar Laporan Terbaru
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {laporans.map((laporan: Laporan) => (
                  <LaporanCard key={laporan.id} laporan={laporan} />
                ))}
              </div>
            </div>
          ) : (
            !error && (
              <div className="mt-12 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-10 text-center bg-white shadow-sm">
                <MessageSquareWarning className="h-10 w-10 text-slate-400" />
                <h3 className="mt-3 text-lg font-semibold text-slate-900">
                  Tidak Ada Laporan
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Tidak ada laporan yang cocok dengan filter{" "}
                  <strong>{kategoriFilter ?? "Semua"}</strong>.
                </p>
              </div>
            )
          )}
        </section>
      
    </main>
    </div>
  );
}
