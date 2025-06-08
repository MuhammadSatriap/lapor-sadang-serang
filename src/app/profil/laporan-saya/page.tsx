// File: src/app/profil/laporan-saya/page.tsx

import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LaporanCard from '@/components/LaporanCard';
import { Laporan } from '@/types';
import { PlusCircle, MessageSquareWarning } from 'lucide-react';

export default async function LaporanSayaPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // LOGIKA UTAMA: Mengambil laporan dengan user_id yang cocok
  const { data: laporans, error } = await supabase
    .from('laporan')
    .select('*')
    .eq('user_id', user.id) // <-- Filter hanya untuk laporan milik user ini
    .order('created_at', { ascending: false });

  return (
    // Menggunakan layout dan style persis seperti desain Anda
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100">
      <div className="mx-auto max-w-7xl space-y-12 px-4 pt-28 pb-16 sm:px-6 lg:px-8">

        {/* HEADER - Teks diubah untuk konteks halaman ini */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Laporan Saya
            </h1>
            <p className="mt-1 text-slate-600">
              Riwayat semua laporan yang telah Anda kirimkan.
            </p>
          </div>
          <Link
            href="/lapor"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-105"
          >
            <PlusCircle className="h-5 w-5" />
            Buat Laporan Baru
          </Link>
        </section>

        {/* Filter tidak kita perlukan di halaman ini, jadi kita langsung ke daftar laporan */}

        {/* DAFTAR LAPORAN */}
        <section>
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-center text-sm text-red-700 border border-red-200">
              Gagal memuat laporan: {error.message}
            </div>
          )}

          {!error && laporans && laporans.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {laporans.map((laporan: Laporan) => (
                <LaporanCard key={laporan.id} laporan={laporan} />
              ))}
            </div>
          ) : (
            !error && (
              <div className="mt-12 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-10 text-center bg-white/50 shadow-sm">
                <MessageSquareWarning className="mx-auto h-10 w-10 text-slate-400" />
                <h3 className="mt-3 text-lg font-semibold text-slate-900">
                  Anda Belum Punya Laporan
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Semua laporan yang Anda buat akan muncul di sini.
                </p>
              </div>
            )
          )}
        </section>
      
      </div>
    </main>
  );
}