// File: src/app/lapor/[id]/page.tsx (Server Component)

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import DetailLaporanClient from "./ClientView";

type PageProps = {
  params: { id: string };
};

export default async function Page({ params }: PageProps) {
  const supabase = await createServerSupabaseClient();
  const { data: laporan, error } = await supabase
    .from("laporan")
    .select("*, profiles!inner(full_name)")
    .eq("id", params.id)
    .single();

  if (error || !laporan) {
    notFound();
  }

  return <DetailLaporanClient laporan={laporan} />;
}
