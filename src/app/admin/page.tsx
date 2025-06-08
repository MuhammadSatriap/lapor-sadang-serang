// File: src/app/admin/page.tsx (Dengan Logika Paginasi)

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LaporanTable from '@/components/LaporanTable';
import Link from 'next/link'; // Impor Link
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

// Halaman admin sekarang menerima searchParams untuk membaca halaman dari URL
type PageProps = {
    searchParams: { 
      page?: string;
      q?: string; // <-- Tambahkan 'q' untuk query pencarian
    };
  };
  

export default async function AdminPage({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  );

  // Verifikasi Admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { redirect('/login'); }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') { redirect('/'); }

  // --- LOGIKA PAGINASI DIMULAI DI SINI ---
  const page = parseInt(searchParams.page || '1', 10);
  const searchQuery = searchParams.q || ''; // <-- Baca query pencarian dari URL
  const pageSize = 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('laporan')
    .select(`*, profiles (full_name)`, { count: 'exact' });

  // Jika ada query pencarian, tambahkan filter .or()
  if (searchQuery) {
    query = query.or(`kategori.ilike.%<span class="math-inline">\{searchQuery\}%,deskripsi\.ilike\.%</span>{searchQuery}%`);
  }

  // Tambahkan order dan range setelah semua filter
  query = query.order('created_at', { ascending: false }).range(from, to);



  // Ambil data laporan DAN total hitungan
  const { data: laporans, error, count } = await supabase
    .from('laporan')
    .select(`*, profiles (full_name)`, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to); // Ambil data sesuai jangkauan halaman
    
  const totalPages = count ? Math.ceil(count / pageSize) : 0;
  // --- AKHIR LOGIKA PAGINASI ---

  // ... (Logika stats cards tetap sama) ...
  const laporanBaru = laporans?.filter(l => l.status === 'Dilaporkan').length || 0;
  const laporanDikerjakan = laporans?.filter(l => l.status === 'Dikerjakan').length || 0;
  const laporanSelesai = laporans?.filter(l => l.status === 'Selesai').length || 0;

  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Admin</h1>
          <p className="mt-1 text-slate-600">Kelola semua laporan yang masuk di sini.</p>
        </div>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">Laporan Baru</dt>
                <dd className="mt-1 flex items-baseline justify-between">
                    <span className="text-3xl font-semibold tracking-tight text-yellow-500">{laporanBaru}</span>
                    <Clock className="h-8 w-8 text-yellow-400" />
                </dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">Sedang Dikerjakan</dt>
                <dd className="mt-1 flex items-baseline justify-between">
                    <span className="text-3xl font-semibold tracking-tight text-blue-500">{laporanDikerjakan}</span>
                    <AlertTriangle className="h-8 w-8 text-blue-400" />
                </dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">Telah Selesai</dt>
                <dd className="mt-1 flex items-baseline justify-between">
                    <span className="text-3xl font-semibold tracking-tight text-green-500">{laporanSelesai}</span>
                    <CheckCircle className="h-8 w-8 text-green-400" />
                </dd>
            </div>
        </section>
        
        {/* Melemparkan data laporans dan informasi paginasi ke komponen tabel */}
        <LaporanTable 
          laporans={laporans || []} 
          currentPage={page}
          totalPages={totalPages}
        />
      </div>
    </main>
  );
}