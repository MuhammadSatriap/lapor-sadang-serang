// File: src/types/index.ts (Versi Baru)

export type Laporan = {
  id: string;
  created_at: string;
  kategori: string;
  deskripsi: string | null;
  url_foto: string | null;
  status: string;
  user_id: string | null; // <-- TAMBAHAN
  // 'profiles' bisa jadi objek atau null jika tidak ada join
  profiles: {
    full_name: string | null;
  } | null; // <-- TAMBAHAN PENTING
  lokasi: string | null; // <-- TAMBAHKAN BARIS INI
};