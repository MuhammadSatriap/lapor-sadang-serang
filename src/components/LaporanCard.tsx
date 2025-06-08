import { Laporan } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Tag } from "lucide-react";

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

  return (
    <Link href={`/lapor/${laporan.id}`} className="block group">
      <div className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-md transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">

        {/* Gambar */}
        <div className="relative h-48 w-full bg-gray-100">
          <Image
            src={laporan.url_foto ?? "/placeholder.jpg"}
            alt={`Foto laporan ${laporan.kategori}`}
            fill
            className="object-cover"
          />
        </div>

        {/* Konten */}
        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Tag className="h-4 w-4" />
              <span className="font-semibold">{laporan.kategori}</span>
            </div>

            <p className="mt-3 text-base text-gray-700 line-clamp-3">
              {laporan.deskripsi}
            </p>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-3 text-right text-xs text-gray-400">
            Dilaporkan pada {formatTanggal(laporan.created_at)}
          </div>
        </div>
      </div>
    </Link>
  );
}
