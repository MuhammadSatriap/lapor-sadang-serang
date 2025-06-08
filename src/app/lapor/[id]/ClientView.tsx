"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Tag,
  Calendar,
  AlertTriangle,
  User as UserIcon,
} from "lucide-react";

// Dynamic import agar peta hanya di-render di client
const LaporanMap = dynamic(() => import("@/components/LaporanMap"), {
  ssr: false,
});

const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles: { [key: string]: string } = {
    Dilaporkan: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Dikerjakan: "bg-blue-100 text-blue-800 border-blue-200",
    Selesai: "bg-green-100 text-green-800 border-green-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold border transition-all duration-200 hover:scale-105 ${
        statusStyles[status] || "bg-gray-100 text-gray-800 border-gray-200"
      }`}
    >
      Status: {status}
    </span>
  );
};

type Laporan = {
  kategori: string;
  deskripsi: string;
  status: string;
  url_foto?: string;
  lokasi?: {
    coordinates: [number, number]; // atau { lat: number; lng: number } tergantung struktur kamu
  };
  created_at: string;
  profiles?: {
    full_name?: string;
  };
};

export default function DetailLaporanClient({ laporan }: { laporan: Laporan }) {

  const [isModalOpen, setModalOpen] = useState(false);

  const formatTanggal = (tangal: string) => {
    return new Date(tangal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="bg-gradient-to-b from-white via-blue-50 to-cyan-100 min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/laporan-publik"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:bg-blue-100 hover:rounded-full hover:px-3 hover:py-1 transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Semua Laporan
        </Link>

        <div className="overflow-hidden rounded-xl bg-white/90 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow duration-300">
          {laporan.url_foto ? (
            <div
              className="relative aspect-video w-full cursor-pointer"
              onClick={() => setModalOpen(true)}
            >
              <Image
                src={laporan.url_foto}
                alt={`Foto laporan ${laporan.kategori}`}
                fill
                className="object-cover rounded-t-xl"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/OhfPQAJAgP/jLdtMQAAAABJRU5ErkJggg=="
              />
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center bg-gray-200/80 rounded-t-xl md:h-96">
              <AlertTriangle className="h-16 w-16 text-gray-400" />
            </div>
          )}

          <div className="p-6 md:p-8">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 border border-blue-200 transition-all duration-200 hover:scale-105">
                <Tag className="h-4 w-4" />
                {laporan.kategori}
              </span>
              <StatusBadge status={laporan.status} />
            </div>

            <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Laporan: {laporan.kategori}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-gray-700 whitespace-pre-wrap">
              {laporan.deskripsi}
            </p>

            {/* Peta */}
            {laporan.lokasi && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Lokasi Kejadian</h2>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <LaporanMap coordinates={laporan.lokasi.coordinates} />
                </div>
              </div>
            )}

            <div className="mt-8 border-t border-gray-200 pt-4 space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="mr-2 h-4 w-4" />
                <span>
                  Dilaporkan pada: {formatTanggal(laporan.created_at)}
                </span>
              </div>

              {laporan.profiles?.full_name && (
                <div className="flex items-center text-sm text-gray-600">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Pelapor: {laporan.profiles.full_name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Image Preview */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 animate-fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={laporan.url_foto || "/placeholder.jpg"}
              alt="Foto Laporan"
              width={1200}
              height={800}
              className="w-full h-auto object-contain rounded-lg"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/OhfPQAJAgP/jLdtMQAAAABJRU5ErkJggg=="
            />
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-full p-2 shadow-md transition-all duration-200"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}