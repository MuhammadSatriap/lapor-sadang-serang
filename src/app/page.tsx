// File: src/app/page.tsx

'use client'; // <-- INI PERINTAH SANGAT PENTING!

import { useState, useEffect } from 'react';

export default function HomePage() {
  // 1. Siapkan sebuah "wadah" kosong untuk menyimpan waktu lokal
  const [waktuLokal, setWaktuLokal] = useState<string>('...');

  // 2. Gunakan useEffect untuk menjalankan kode HANYA di sisi browser
  useEffect(() => {
    // Kode di dalam sini tidak akan berjalan di server Vercel.
    // Ia akan berjalan setelah halaman dimuat di browser pengguna.
    setWaktuLokal(new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' }));
  }, []); // Array kosong `[]` berarti efek ini hanya berjalan sekali

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center">
      <h1 className="text-5xl font-extrabold text-blue-600">
        WORKSHOP LAPOR WARGA!
      </h1>
      <p className="mt-4 text-xl text-gray-700">
        Aplikasi ini sudah online berkat Vercel & GitHub!
        <br />
        (Waktu di browser Anda: {waktuLokal} WIB)
      </p>
    </main>
  );
}