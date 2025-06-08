export type Laporan = {
  id: string;
  created_at: string;
  kategori: string;
  deskripsi: string | null;
  url_foto: string | null;
  status: string;
  user_id: string | null;
  profiles: {
    full_name: string | null;
  } | null;
  lokasi: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  } | null;
};
