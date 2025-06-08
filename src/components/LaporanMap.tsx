"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ Perbaikan untuk menghindari ts(2790)
const iconProto = L.Icon.Default.prototype as {
  _getIconUrl?: () => string;
};

if (iconProto._getIconUrl) {
  delete iconProto._getIconUrl;
}

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

type LaporanMapProps = {
  coordinates: [number, number]; // [lng, lat]
};

export default function LaporanMap({ coordinates }: LaporanMapProps) {
  return (
    <MapContainer
      center={[coordinates[1], coordinates[0]]}
      zoom={17}
      scrollWheelZoom={false}
      className="w-full h-64 rounded-lg z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[coordinates[1], coordinates[0]]}>
        <Popup>Lokasi laporan</Popup>
      </Marker>
    </MapContainer>
  );
}
