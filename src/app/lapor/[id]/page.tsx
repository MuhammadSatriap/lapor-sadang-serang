import { createServerSupabaseClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import DetailLaporanClient from "./ClientView";

// Tipe untuk params
type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params; // Await params buat dapet id

  const supabase = await createServerSupabaseClient();
  const { data: laporan, error } = await supabase
    .from("laporan")
    .select("*, profiles!inner(full_name)")
    .eq("id", id)
    .single();

  if (error || !laporan) {
    notFound();
  }

  return <DetailLaporanClient laporan={laporan} />;
}