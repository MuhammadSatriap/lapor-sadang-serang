// File: src/components/Map.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Laporan } from '@/types';
import Link from 'next/link';

// Fix untuk ikon default Leaflet yang rusak dengan Next.js
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type MapProps = {
    laporans: ({
      lat: number;
      lon: number;
      profiles: { full_name: string | null } | null;
    } & Laporan)[];
  };
  

export default function Map({ laporans }: MapProps) {
  // Fungsi untuk parse koordinat dari format PostGIS "POINT(lon lat)"

  
  

  return (
    <MapContainer center={[-6.891680, 107.626695]} zoom={15 } scrollWheelZoom={true}  className="h-full w-full rounded-lg shadow-lg z-10">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {laporans.map((laporan) => {
        const position: [number, number] = [laporan.lat, laporan.lon];


        if (!position) return null;

        return (
          <Marker key={laporan.id} position={position} icon={markerIcon}>
            <Popup>
              <div className="font-sans">
                <h3 className="font-bold">{laporan.kategori}</h3>
                <p>{laporan.deskripsi?.substring(0, 50)}...</p>
                <Link href={`/lapor/${laporan.id}`} className="text-blue-600 font-semibold hover:underline mt-2 inline-block">
                  Lihat Detail &rarr;
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}