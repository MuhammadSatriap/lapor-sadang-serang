// File: src/app/lapor/page.tsx (Final dengan Geolocation & Server Action)
'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { createLaporan } from '@/app/actions';
import { Trash2, Send, LoaderCircle, MapPin } from 'lucide-react';

export default function LaporPage() {
  const [lokasi, setLokasi] = useState<{ lat: number; lon: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  // State untuk file, agar kita bisa tampilkan namanya di UI
  const [file, setFile] = useState<File | null>(null); 

  const handleGetLocation = () => {
    setIsGettingLocation(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLokasi({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setIsGettingLocation(false);
      },
      (error) => {
        setError(`Gagal mendapatkan lokasi: ${error.message}`);
        setIsGettingLocation(false);
      }
    );
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  // Fungsi ini sekarang hanya membungkus pemanggilan Server Action
  const submitAction = async (formData: FormData) => {
    if (lokasi) {
      formData.append('lat', lokasi.lat.toString());
      formData.append('lon', lokasi.lon.toString());
    }

    setIsLoading(true);
    const result = await createLaporan(formData);
    setIsLoading(false);

    if (result?.error) {
      setError(result.error);
      setSuccess(null);
    }
    if (result?.success) {
      setSuccess(result.success);
      setError(null);
      formRef.current?.reset();
      setFile(null);
      setLokasi(null);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-5 pt-25">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Buat Laporan Baru</h1>
          <p className="mt-2 text-slate-600">Sampaikan masalah yang Anda temukan.</p>
        </div>

        <form ref={formRef} action={submitAction} className="space-y-6">
          <div>
            <label htmlFor="kategori" className="block text-sm font-medium text-slate-700">Kategori Laporan</label>
            <select
              id="kategori" name="kategori" required
              className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Pilih Kategori...</option>
              <option value="Jalan Rusak">Jalan Rusak</option>
              <option value="Sampah Liar">Sampah Liar</option>
              <option value="Lampu Padam">Lampu Penerangan Padam</option>
              <option value="Saluran Air Tersumbat">Saluran Air Tersumbat</option>
              <option value="Gangguan Keamanan">Gangguan Keamanan</option>
            </select>
          </div>

          <div>
            <label htmlFor="deskripsi" className="block text-sm font-medium text-slate-700">Deskripsi Laporan</label>
            <div className="mt-1">
              <textarea
                id="deskripsi" name="deskripsi" rows={4} required
                className="block w-full rounded-md border-gray-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Jelaskan detail masalah yang Anda lihat, termasuk lokasi spesifik."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Lokasi Masalah</label>
            <div className="mt-1">
              <button
                type="button" onClick={handleGetLocation} disabled={isGettingLocation}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isGettingLocation ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <MapPin className="h-5 w-5" />}
                {isGettingLocation ? 'Mencari Lokasi...' : (lokasi ? 'Lokasi Didapatkan!' : 'Dapatkan Lokasi Saya')}
              </button>
              {lokasi && (<p className="mt-2 text-xs text-green-600">Lat: {lokasi.lat.toFixed(5)}, Lon: {lokasi.lon.toFixed(5)}</p>)}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Unggah Foto (Bukti)</label>
             <input 
              name="file" type="file" required
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept="image/png, image/jpeg"
            />
            {file && (
              <div className="mt-2 flex items-center justify-between rounded-md bg-slate-50 p-2 pl-4">
                <span className="truncate text-sm font-medium text-slate-700">{file.name}</span>
                <button type="button" onClick={() => { setFile(null); formRef.current?.reset(); }} className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          
          <div className="pt-2">
            <button
              type="submit" disabled={isLoading}
              className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {isLoading ? <LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
              {isLoading ? 'Mengirim Laporan...' : 'Kirim Laporan'}
            </button>
          </div>
          {error && (<div className="rounded-md bg-red-50 p-3"><p className="text-sm font-medium text-red-700">{error}</p></div>)}
          {success && (<div className="rounded-md bg-green-50 p-3"><p className="text-sm font-medium text-green-800">{success}</p></div>)}
        </form>

        <div className="mt-6 text-center">
           <Link href="/laporan-publik" className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:underline">
            &larr; Kembali ke Papan Laporan
           </Link>
        </div>
      </div>
    </main>
  );
}