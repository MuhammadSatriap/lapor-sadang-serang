// File: src/app/actions.ts

'use server'; // <-- Tanda ini wajib ada untuk file Server Actions

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function updateLaporanStatus(laporanId: string, newStatus: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  );

  // Cek apakah user adalah admin sebelum melakukan update
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Anda harus login untuk melakukan aksi ini.' };
  }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') {
    return { error: 'Hanya admin yang bisa mengubah status laporan.' };
  }

  // Lakukan operasi UPDATE ke database
  const { error } = await supabase
    .from('laporan')
    .update({ status: newStatus })
    .eq('id', laporanId);

  if (error) {
    return { error: `Gagal mengupdate status: ${error.message}` };
  }

  // Perintahkan Next.js untuk mengambil ulang data di halaman admin
  // agar status baru langsung terlihat.
  revalidatePath('/admin');

  return { success: 'Status berhasil diupdate!' };
}

export async function deleteLaporan(laporanId: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  );

  // Cek apakah user adalah admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Anda harus login untuk melakukan aksi ini.' };
  }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') {
    return { error: 'Hanya admin yang bisa menghapus laporan.' };
  }

  // Lakukan operasi DELETE ke database
  const { error } = await supabase
    .from('laporan')
    .delete()
    .eq('id', laporanId);

  if (error) {
    return { error: `Gagal menghapus laporan: ${error.message}` };
  }

  // Refresh data di halaman admin dan laporan publik
  revalidatePath('/admin');
  revalidatePath('/laporan-publik');

  return { success: 'Laporan berhasil dihapus!' };
}

export async function createLaporan(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Anda harus login untuk membuat laporan.' };
  }

  const kategori = formData.get('kategori') as string;
  const deskripsi = formData.get('deskripsi') as string;
  const file = formData.get('file') as File;
  const lat = formData.get('lat') as string;
  const lon = formData.get('lon') as string;

  if (!kategori || !deskripsi || !file || !lat || !lon) {
    return { error: 'Semua data, termasuk lokasi dan foto, wajib diisi.' };
  }

  // 1. Upload file
  const fileName = `public/${Date.now()}_${file.name}`;

  const { error: uploadError } = await supabase.storage.from('foto-laporan').upload(fileName, file);
  if (uploadError) {
    return { error: `Gagal upload foto: ${uploadError.message}` };
  }

  // 2. Ambil URL
  const { data: urlData } = supabase.storage.from('foto-laporan').getPublicUrl(fileName);

  // 3. Insert ke database, termasuk lokasi dengan format PostGIS
  const { error: insertError } = await supabase
    .from('laporan')
    .insert([{ 
      kategori, 
      deskripsi, 
      url_foto: urlData.publicUrl,
      user_id: user.id,
      lokasi: `POINT(${lon} ${lat})`, // Format: POINT(longitude latitude)
    }]);

  if (insertError) {
    return { error: `Gagal menyimpan laporan: ${insertError.message}` };
  }

  revalidatePath('/laporan-publik');
  revalidatePath('/admin');

  return { success: 'Laporan berhasil dibuat!' };
}