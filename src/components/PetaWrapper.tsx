'use client';

import dynamic from 'next/dynamic';
import { Laporan } from '@/types';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <p className="text-center">Memuat Peta...</p>,
});

type LaporanWithCoords = Laporan & {
    lat: number;
    lon: number;
    profiles: { full_name: string | null } | null;
  };
  
  type PetaWrapperProps = {
    laporans: LaporanWithCoords[];
  };
  

export default function PetaWrapper({ laporans }: PetaWrapperProps) {
  return <Map laporans={laporans} />;
}
