"use client";

import { useState, useEffect, useMemo } from "react";
import { MapPin, Stethoscope, Heart } from "lucide-react";
import SearchBar from "@/components/map/SearchBar";
import DoctorCard from "@/components/map/DoctorCard";
import DoctorProfile from "@/components/map/DoctorProfile";
import DoctorMap from "@/components/map/DoctorMap";
import { doctors, getDistance } from "@/data/doctors";
import type { Doctor } from "@/data/doctors";

export default function Index() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => setUserLocation([48.8566, 2.3522]),
    );
  }, []);

  const doctorsWithDistance = useMemo(() => {
    const loc = userLocation || [48.8566, 2.3522];
    return doctors
      .map((d) => ({
        ...d,
        distance: getDistance(loc[0], loc[1], d.latitude, d.longitude),
      }))
      .sort((a, b) => b.rating - a.rating || a.distance - b.distance);
  }, [userLocation]);

  const filtered = useMemo(() => {
    if (!search) return doctorsWithDistance;
    const q = search.toLowerCase();
    return doctorsWithDistance.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q),
    );
  }, [search, doctorsWithDistance]);

  const handleSelectDoctor = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setFlyTo([doc.latitude, doc.longitude]);
  };

  const getDistanceForDoctor = (doc: Doctor) => {
    const loc = userLocation || [48.8566, 2.3522];
    return getDistance(loc[0], loc[1], doc.latitude, doc.longitude);
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-full lg:w-[380px] xl:w-[420px] flex flex-col border-r border-border/30 bg-card shrink-0 max-h-[40vh] lg:max-h-none">
        {/* Header */}
        <div className="p-4 pb-3 border-b border-border/30">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
              <Heart
                className="h-5 w-5 text-primary"
                fill="currentColor"
                opacity={0.7}
              />
            </div>
            <div>
              <h1 className="font-bold text-foreground text-lg leading-tight">
                NeuroFind
              </h1>
              <p className="text-xs text-muted-foreground">
                Find the right specialist for your child ✨
              </p>
            </div>
          </div>
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {/* Results count */}
        <div className="px-4 py-2.5 flex items-center justify-between text-xs text-muted-foreground border-b border-border/20">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3" />
            {filtered.length} specialists nearby
          </span>
          {userLocation && (
            <span className="text-secondary text-[10px] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
              Location active
            </span>
          )}
        </div>

        {/* Doctor list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.map((doc) => (
            <DoctorCard
              key={doc.id}
              doctor={doc}
              distance={doc.distance}
              isSelected={selectedDoctor?.id === doc.id}
              onClick={() => handleSelectDoctor(doc)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-2xl mb-2">🔍</p>
              <p className="text-sm font-medium">No specialists found</p>
              <p className="text-xs mt-1">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </aside>

      {/* Map */}
      <main className="flex-1 relative min-h-[60vh] lg:min-h-0">
        <DoctorMap
          doctors={filtered}
          userLocation={userLocation}
          selectedDoctor={selectedDoctor}
          onSelectDoctor={handleSelectDoctor}
          flyTo={flyTo}
        />

        {selectedDoctor && (
          <DoctorProfile
            doctor={selectedDoctor}
            distance={getDistanceForDoctor(selectedDoctor)}
            onClose={() => setSelectedDoctor(null)}
          />
        )}
      </main>
    </div>
  );
}
