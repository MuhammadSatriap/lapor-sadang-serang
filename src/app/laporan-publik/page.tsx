import Link from "next/link";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import LaporanCard from "@/components/LaporanCard";
import { Laporan } from "@/types";
import { PlusCircle, MessageSquareWarning, Filter } from "lucide-react";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PapanLaporanPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const kategoriFilter = resolvedParams.kategori as string | undefined;

  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("laporan")
    .select("*, profiles!inner(full_name)")
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
    <main className="bg-gradient-to-b from-white via-blue-50 to-blue-50 min-h-screen pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HEADER */}
        <section className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm px-6 py-6 sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
              📌 Papan Laporan Warga
            </h1>
            <p className="mt-2 text-slate-600 text-base max-w-xl text-balance">
              Laporan masyarakat untuk wilayah Sadang Serang, Bandung.
            </p>
          </div>
          <Link
            href="/lapor"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:scale-105 transition-transform"
          >
            <PlusCircle className="h-5 w-5" />
            Buat Laporan Baru
          </Link>
        </section>

        {/* FILTER */}
        <section>
          <div className="flex items-center gap-2 mb-3 text-slate-700">
            <Filter className="h-5 w-5" />
            <h2 className="text-xl font-semibold">
              Filter Berdasarkan Kategori
            </h2>
          </div>
          <div className="flex overflow-x-auto gap-3 pb-3 pt-3 pl-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
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
                  className={`rounded-full px-5 py-1.5 text-sm font-medium border transition-all duration-200 transform hover:scale-105 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-blue-700 shadow-md"
                      : "bg-white/80 text-gray-700 border-gray-200 hover:bg-blue-100 hover:border-blue-300"
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
            <div className="rounded-md bg-red-50 border border-red-200 p-4 text-center text-sm text-red-700 shadow-sm">
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
                  <div
                    key={laporan.id}
                    className="transition-transform hover:scale-[1.015]"
                  >
                    <LaporanCard laporan={laporan} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            !error && (
              <div className="mt-16 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white/60 p-10 text-center shadow-sm">
                <MessageSquareWarning className="h-10 w-10 text-slate-400" />
                <h3 className="mt-3 text-lg font-semibold text-slate-900">
                  Tidak Ada Laporan
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Tidak ada laporan yang cocok dengan filter{" "}
                  <strong>{kategoriFilter ?? "Semua"}</strong>.
                </p>
                <Link
                  href="/lapor"
                  className="mt-6 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700"
                >
                  <PlusCircle className="h-4 w-4" />
                  Buat Laporan Sekarang
                </Link>
              </div>
            )
          )}
        </section>
      </div>
    </main>
  );
}

export async function generateMetadata({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const kategoriFilter = resolvedParams.kategori as string | undefined;

  return {
    title: kategoriFilter
      ? `Laporan ${kategoriFilter} | Lapor Warga`
      : "Papan Laporan Warga",
    description: "Lihat semua laporan warga di wilayah Sadang Serang, Bandung.",
  };
}
