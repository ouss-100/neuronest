"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

// Fix marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface Props {
  onSelect: (lat: number, lng: number) => void;
  position?: [number, number] | null; // 👈 new
}

// Move map when position changes
const ChangeView = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 13);
  }, [position, map]);
  return null;
};

const LocationMarker = ({ onSelect, position }: Props) => {
  const [pos, setPos] = useState<[number, number] | null>(position || null);
  

  useEffect(() => {
    if (position) setPos(position);
  }, [position]);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPos([lat, lng]);
      onSelect(lat, lng);
    },
  });

  return pos ? <Marker position={pos} /> : null;
};

export default function MapPicker({ onSelect, position }: Props) {
  return (
    <MapContainer
      center={position || [36.8065, 10.1815]}
      zoom={6}
      className="h-64 w-full rounded-xl z-0"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {position && <ChangeView position={position} />}
      <LocationMarker onSelect={onSelect} position={position} />
    </MapContainer>
  );
}
