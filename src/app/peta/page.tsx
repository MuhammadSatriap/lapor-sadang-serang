import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import PetaWrapper from '@/components/PetaWrapper';

export default async function PetaPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
      },
    }
  );

  const { data: laporans, error } = await supabase
    .from('laporan_with_coords')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <p className="pt-24 text-center text-red-500">
        Gagal memuat data laporan: {error.message}
      </p>
    );
  }

  return (
<main className="min-h-screen bg-slate-100 pt-24 pb-20">
  <div className="mx-auto max-w-7xl px-6 space-y-6">
    <section className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm px-6 py-6 sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
          🗺️ Peta Laporan Warga
        </h1>
        <p className="mt-2 text-slate-600 text-base max-w-xl text-balance">
          Berikut adalah semua laporan warga dalam bentuk titik pada peta.
        </p>
      </div>
        </section>

        {/* MAP SECTION */}
        <div className="h-[calc(100vh-200px)]">
          {laporans.length > 0 ? (
            <PetaWrapper laporans={JSON.parse(JSON.stringify(laporans))} />
          ) : (
            <div className="text-center text-slate-500 mt-12">
              Tidak ada laporan yang tersedia untuk ditampilkan di peta.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
