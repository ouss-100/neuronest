"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import type { Doctor } from "@/data/doctors";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const specialtyMarkerColors: Record<string, string> = {
  "Neurologist": "hsl(220, 65%, 60%)",
  "Speech Therapist": "hsl(160, 45%, 55%)",
  "Child Psychologist": "hsl(340, 45%, 65%)",
  "Pediatric Neurologist": "hsl(32, 85%, 62%)",
};

function createDoctorIcon(specialty: string) {
  const color = specialtyMarkerColors[specialty] || "hsl(220, 65%, 60%)";
  return L.divIcon({
    className: "doctor-marker",
    html: `
      <div style="position:relative;width:40px;height:40px;">
        <div style="position:absolute;inset:0;background:${color};border-radius:50%;opacity:0.15;" class="marker-pulse"></div>
        <div style="position:absolute;inset:6px;background:${color};border-radius:50%;border:3px solid white;box-shadow:0 2px 12px rgba(0,0,0,0.12);display:flex;align-items:center;justify-content:center;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

const userIcon = L.divIcon({
  className: "user-marker",
  html: `
    <div style="position:relative;width:28px;height:28px;">
      <div style="position:absolute;inset:0;background:hsl(220, 65%, 60%);border-radius:50%;opacity:0.2;animation:marker-pulse 2.5s ease-out infinite;"></div>
      <div style="position:absolute;inset:5px;background:hsl(220, 65%, 60%);border-radius:50%;border:3px solid white;box-shadow:0 2px 10px rgba(0,0,0,0.15);"></div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function FlyTo({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap();
  const prevCenter = useRef(center);
  useEffect(() => {
    if (center[0] !== prevCenter.current[0] || center[1] !== prevCenter.current[1]) {
      map.flyTo(center, zoom || 15, { duration: 1.4, easeLinearity: 0.25 });
      prevCenter.current = center;
    }
  }, [center, zoom, map]);
  return null;
}

interface DoctorMapProps {
  doctors: Doctor[];
  userLocation: [number, number] | null;
  selectedDoctor: Doctor | null;
  onSelectDoctor: (doctor: Doctor) => void;
  flyTo: [number, number] | null;
}

export default function DoctorMap({ doctors, userLocation, selectedDoctor, onSelectDoctor, flyTo }: DoctorMapProps) {
  const center: [number, number] = userLocation || [48.8566, 2.3522];

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="h-full w-full rounded-2xl"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {flyTo && <FlyTo center={flyTo} />}

      {userLocation && (
        <Marker position={userLocation} icon={userIcon}>
          <Popup>
            <div className="text-center py-1">
              <span className="font-semibold text-sm">📍 You are here</span>
            </div>
          </Popup>
        </Marker>
      )}

      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={50}
        spiderfyOnMaxZoom
        showCoverageOnHover={false}
        iconCreateFunction={(cluster: any) => {
          const count = cluster.getChildCount();
          const size = count < 5 ? 44 : count < 10 ? 50 : 56;
          return L.divIcon({
            html: `<div style="background:hsl(220, 65%, 60%);color:white;border-radius:50%;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:${count < 5 ? 13 : 15}px;border:3px solid white;box-shadow:0 3px 12px rgba(0,0,0,0.12);font-family:'Inter',sans-serif;">${count}</div>`,
            className: "custom-cluster",
            iconSize: L.point(size, size),
          });
        }}
      >
        {doctors.map((doc) => (
          <Marker
            key={doc.id}
            position={[doc.latitude, doc.longitude]}
            icon={createDoctorIcon(doc.specialty)}
            eventHandlers={{ click: () => onSelectDoctor(doc) }}
          >
            <Popup>
              <div className="text-sm p-1">
                <p className="font-bold text-foreground">{doc.name}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{doc.specialty}</p>
                <div className="flex items-center gap-1 mt-1 text-xs">
                  <span>⭐</span>
                  <span className="font-semibold">{doc.rating}</span>
                  <span className="text-muted-foreground">({doc.reviews} reviews)</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
