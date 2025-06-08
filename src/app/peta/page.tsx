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
    <main className="min-h-screen bg-slate-100 pt-24">
      <div className="mx-auto w-full h-full">
      <PetaWrapper laporans={JSON.parse(JSON.stringify(laporans || []))} />

      </div>
    </main>
  );
}
