// File: src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [waktuLokal, setWaktuLokal] = useState<string>('...');

  useEffect(() => {
    setWaktuLokal(new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' }));
  }, []);

  return (
    // Langkah 1: Memberi warna latar belakang ke seluruh halaman
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-4">
      
      {/* Langkah 2: Membuat container putih di tengah dengan bayangan */}
      <div className="w-full max-w-2xl rounded-xl bg-white p-8 text-center shadow-lg md:p-12">
        
        {/* Langkah 3: Mendekorasi Judul dengan Gradien */}
        <h1 className="bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl">
          Lapor Warga Sadang Serang
        </h1>

        {/* Langkah 4: Mendekorasi Paragraf Deskripsi */}
        <p className="mx-auto mt-6 max-w-lg text-lg text-slate-600">
          Lihat masalah di lingkungan Anda? Jangan diam saja. Laporkan sekarang juga dan mari kita bangun Sadang Serang yang lebih baik, bersama-sama.
        </p>
        
        {/* Langkah 5: Membuat Tombol Aksi yang Keren */}
        <div className="mt-10">
          <button
            className="transform rounded-md bg-blue-600 px-8 py-3 font-semibold text-white shadow-md transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          >
            Buat Laporan Baru
          </button>
        </div>

        <p className="mt-12 text-xs text-slate-400">
          Waktu Server Lokal: {waktuLokal} WIB
        </p>

      </div>
    </main>
  );
}