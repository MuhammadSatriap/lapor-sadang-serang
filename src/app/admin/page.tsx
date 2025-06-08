import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LaporanTable from "@/components/LaporanTable";
import { AlertTriangle, Clock, CheckCircle } from "lucide-react";

// Tipe untuk searchParams
type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AdminPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams; // Await searchParams
  const page = parseInt((resolvedParams.page as string) || "1", 10);
  const searchQuery = (resolvedParams.q as string) || ""; // Ambil query pencarian

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  );

  // Verifikasi Admin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/");

  // --- Logika Paginasi ---
  const pageSize = 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("laporan")
    .select(`*, profiles (full_name)`, { count: "exact" });

  // Tambah filter pencarian kalau ada
  if (searchQuery) {
    query = query.or(
      `kategori.ilike.%${searchQuery}%,deskripsi.ilike.%${searchQuery}%`
    );
  }

  // Tambah order dan range
  query = query.order("created_at", { ascending: false }).range(from, to);

  // Ambil data laporan dan total count dalam satu query
  const { data: laporans, error, count } = await query;

  if (error) {
    console.error("Error fetching laporans:", error);
    redirect("/error"); // Redirect ke halaman error kalau gagal
  }

  const totalPages = count ? Math.ceil(count / pageSize) : 0;

  // --- Hitung Stats ---
  const laporanBaru =
    laporans?.filter((l) => l.status === "Dilaporkan").length || 0;
  const laporanDikerjakan =
    laporans?.filter((l) => l.status === "Dikerjakan").length || 0;
  const laporanSelesai =
    laporans?.filter((l) => l.status === "Selesai").length || 0;

  return (
<main className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-100 pt-28 pb-12">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Dashboard Admin
          </h1>
          <p className="mt-2 text-gray-600">
            Kelola semua laporan warga di wilayah Sadang Serang, Bandung.
          </p>
        </div>

        {/* Statistik */}
        <section className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <dt className="text-sm text-gray-500">Laporan Baru</dt>
                <dd className="mt-1 text-3xl font-bold text-yellow-600">
                  {laporanBaru}
                </dd>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <dt className="text-sm text-gray-500">Sedang Dikerjakan</dt>
                <dd className="mt-1 text-3xl font-bold text-blue-600">
                  {laporanDikerjakan}
                </dd>
              </div>
              <AlertTriangle className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <dt className="text-sm text-gray-500">Telah Selesai</dt>
                <dd className="mt-1 text-3xl font-bold text-green-600">
                  {laporanSelesai}
                </dd>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </section>

        {/* Tabel Laporan */}
        <section className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Daftar Laporan
            </h2>
            {/* Tambahkan pencarian atau tombol lain di sini jika perlu */}
          </div>

          <LaporanTable
            laporans={laporans || []}
            currentPage={page}
            totalPages={totalPages}
          />
        </section>
      </div>
    </main>
  );
}

// Metadata (opsional, kalau lo butuh)
export async function generateMetadata({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const searchQuery = (resolvedParams.q as string) || "";

  return {
    title: searchQuery
      ? `Pencarian Laporan: ${searchQuery}`
      : "Dashboard Admin | Lapor Warga",
    description: "Kelola laporan warga di dashboard admin.",
  };
}
