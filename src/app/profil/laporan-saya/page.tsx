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

  const { data: laporans, error } = await supabase
    .from('laporan')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <main className="bg-gradient-to-b from-white via-blue-50 to-blue-50 min-h-screen pt-28 pb-20">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

    {/* HEADER */}
    <section className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm px-6 py-6 sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
          Laporan Saya
        </h1>
        <p className="mt-2 text-slate-600 text-base max-w-xl text-balance">
          Riwayat semua laporan yang telah Anda kirimkan akan ditampilkan di sini.
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

    {/* LIST LAPORAN */}
    <section>
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4 text-center text-sm text-red-700 shadow-sm">
          Gagal memuat laporan: {error.message}
        </div>
      )}

      {!error && laporans && laporans.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {laporans.map((laporan: Laporan) => (
            <div
              key={laporan.id}
              className="transition-all hover:scale-[1.015] hover:ring-2 hover:ring-blue-400/30 rounded-xl"
            >
              <LaporanCard laporan={laporan} />
            </div>
          ))}
        </div>
      ) : (
        !error && (
          <div className="mt-16 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white/60 p-10 text-center shadow-sm">
            <MessageSquareWarning className="h-10 w-10 text-slate-400" />
            <h3 className="mt-3 text-lg font-semibold text-slate-900">
              Anda Belum Punya Laporan
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Semua laporan yang Anda buat akan muncul di sini.
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
