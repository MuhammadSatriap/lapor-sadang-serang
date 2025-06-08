"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Tag,
  Calendar,
  AlertTriangle,
  User as UserIcon,
} from "lucide-react";

const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles: { [key: string]: string } = {
    Dilaporkan: "bg-yellow-100 text-yellow-800",
    Dikerjakan: "bg-blue-100 text-blue-800",
    Selesai: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      Status: {status}
    </span>
  );
};

export default function DetailLaporanClient({ laporan }: { laporan: any }) {
  const [isModalOpen, setModalOpen] = useState(false);

  const formatTanggal = (tanggal: string) => {
    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/laporan-publik"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Semua Laporan
        </Link>

        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
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
              />
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center bg-gray-200 md:h-96">
              <AlertTriangle className="h-16 w-16 text-gray-400" />
            </div>
          )}

          <div className="p-6 md:p-8">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                <Tag className="h-4 w-4" />
                {laporan.kategori}
              </span>
              <StatusBadge status={laporan.status} />
            </div>

            <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
              Laporan: {laporan.kategori}
            </h1>

            <p className="mt-4 text-lg text-slate-700 whitespace-pre-wrap">
              {laporan.deskripsi}
            </p>

            <div className="mt-8 border-t border-gray-200 pt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="mr-2 h-4 w-4" />
                <span>
                  Dilaporkan pada: {formatTanggal(laporan.created_at)}
                </span>
              </div>

              {laporan.profiles?.full_name && (
                <div className="flex items-center text-sm text-gray-500 mt-2">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={laporan.url_foto}
              alt="Foto Laporan"
              width={1200}
              height={800}
              className="w-full h-auto object-contain rounded-lg"
            />
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 hover:bg-opacity-80 rounded-full p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
