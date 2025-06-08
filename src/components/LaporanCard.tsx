import { Laporan } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Tag, Clock, User } from "lucide-react";

type LaporanCardProps = {
  laporan: Laporan;
};

export default function LaporanCard({ laporan }: LaporanCardProps) {
  const formatTanggal = (tanggal: string) => {
    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Map status ke warna dan teks
  const statusStyles = {
    Dilaporkan: { text: "Dilaporkan", color: "bg-yellow-100 text-yellow-800" },
    Dikerjakan: { text: "Dikerjakan", color: "bg-blue-100 text-blue-800" },
    Selesai: { text: "Selesai", color: "bg-green-100 text-green-800" },
  };

  // Validasi status dengan fallback
  const statusKey =
    laporan.status && statusStyles[laporan.status as keyof typeof statusStyles]
      ? (laporan.status as keyof typeof statusStyles)
      : "unknown";
  const status =
    statusKey === "unknown"
      ? { text: "Unknown", color: "bg-gray-100 text-gray-800" }
      : statusStyles[statusKey];

  return (
    <Link
      href={`/lapor/${laporan.id}`}
      className="block group animate-fade-in-up"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-gray-100 transition-all duration-300 group-hover:shadow-xl group-hover:ring-blue-200 hover:-translate-y-1">
        {/* Gambar */}
        <div className="relative aspect-[4/3] w-full bg-gray-100">
          <Image
            src={laporan.url_foto ?? "/placeholder.jpg"}
            alt={`Foto laporan ${laporan.kategori}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Overlay untuk Kategori dan Status */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-xs font-semibold text-gray-800 shadow-sm backdrop-blur-sm">
              <Tag className="h-3 w-3" />
              {laporan.kategori}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${status.color}`}
            >
              {status.text}
            </span>
          </div>
        </div>

        {/* Konten */}
        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            <p className="mt-2 text-sm font-medium text-gray-700 line-clamp-2">
              {laporan.deskripsi ?? "Tanpa deskripsi"}
            </p>
            {laporan.lokasi ? (
              <p className="mt-2 text-sm font-medium text-gray-700 line-clamp-2">
                Lokasi: Lat {laporan.lokasi.coordinates[1].toFixed(5)}, Lng{" "}
                {laporan.lokasi.coordinates[0].toFixed(5)}
              </p>
            ) : (
              <p>Lokasi tidak tersedia</p>
            )}
          </div>
          <div className="mt-3 flex justify-between items-center border-t border-gray-100 pt-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTanggal(laporan.created_at)}
            </span>
            {laporan.profiles?.full_name && (
              <span className="inline-flex items-center gap-1">
                <User className="h-3 w-3" />
                {laporan.profiles.full_name}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
