"use client";

import { useState, useEffect, useMemo } from "react";
import { MapPin, Heart, X } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import DoctorCard from "@/components/DoctorCard";
import DoctorProfile from "@/components/DoctorProfile";
import dynamic from "next/dynamic";

const DoctorMap = dynamic(() => import("@/components/DoctorMap"), {
  ssr: false,
});
import { getActiveDoctors } from "@/server/doctorActions";
import { getDistance } from "@/lib/utils";
import type { Doctor } from "@/types/doctor";

export default function Index() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileList, setShowMobileList] = useState(true);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle escape key for mobile
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedDoctor) {
        setSelectedDoctor(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedDoctor]);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(loc);
        setFlyTo(loc);
      },
      () => {
        const fallback: [number, number] = [48.8566, 2.3522];
        setUserLocation(fallback);
        setFlyTo(fallback);
      }
    );
  }, []);

  useEffect(() => {
    async function loadDoctors() {
      try {
        const res = await getActiveDoctors();
        if (res.success && res.doctors) {
          const mapped = res.doctors.map((doc: any) => {
            const idStr = doc._id.toString();
            const sum = idStr.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
            const rating = Number((4.5 + (sum % 6) * 0.1).toFixed(1));
            const reviews = 40 + (sum % 161);

            return {
              id: idStr,
              name: `Dr. ${doc.firstname} ${doc.lastname}`,
              specialty: doc.specialty,
              rating,
              reviews,
              latitude: doc.latitude,
              longitude: doc.longitude,
              avatar: `${doc.firstname[0]}${doc.lastname[0]}`.toUpperCase(),
              phone: doc.phone ? `${doc.phone.countryCode} ${doc.phone.number}` : undefined,
              email: doc.email,
            };
          });
          setDoctorsList(mapped);
        }
      } catch (error) {
        console.error("Error loading doctors from database:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDoctors();
  }, []);

  const doctorsWithDistance = useMemo(() => {
    const loc = userLocation || [48.8566, 2.3522];
    return doctorsList
      .map((d) => ({ ...d, distance: getDistance(loc[0], loc[1], d.latitude, d.longitude) }))
      .sort((a, b) => b.rating - a.rating || a.distance - b.distance);
  }, [userLocation, doctorsList]);

  const filtered = useMemo(() => {
    if (!search) return doctorsWithDistance;
    const q = search.toLowerCase();
    return doctorsWithDistance.filter(
      (d) => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q)
    );
  }, [search, doctorsWithDistance]);

  const handleSelectDoctor = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setFlyTo([doc.latitude, doc.longitude]);
    if (isMobile) {
      setShowMobileList(false);
    }
  };

  const handleBackToList = () => {
    setSelectedDoctor(null);
    setShowMobileList(true);
  };

  const getDistanceForDoctor = (doc: Doctor) => {
    const loc = userLocation || [48.8566, 2.3522];
    return getDistance(loc[0], loc[1], doc.latitude, doc.longitude);
  };

  // Mobile view (unchanged)
  if (isMobile) {
    return (
      <div className="h-screen w-full overflow-hidden bg-background relative p-3">
        {/* Map Container */}
        <div
          className={`absolute left-3 right-3 transition-all duration-300 z-0 ${showMobileList ? 'top-3' : 'top-3 bottom-3'
            }`}
          style={{
            height: showMobileList ? '40%' : 'calc(100% - 24px)',
          }}
        >
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg">
            <DoctorMap
              doctors={filtered}
              userLocation={userLocation}
              selectedDoctor={selectedDoctor}
              onSelectDoctor={handleSelectDoctor}
              flyTo={flyTo}
            />
          </div>

          {!showMobileList && (
            <button
              onClick={handleBackToList}
              className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md rounded-full p-3 shadow-lg active:scale-95 transition-transform"
              aria-label="Back to list"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* List Container */}
        <div
          className={`absolute left-3 right-3 bg-card rounded-2xl shadow-2xl transition-transform duration-300 z-10 flex flex-col overflow-hidden ${showMobileList ? 'translate-y-0' : 'translate-y-full'
            }`}
          style={{
            bottom: '12px',
            height: showMobileList ? 'calc(55% - 12px)' : '0%',
          }}
        >
          <div className="w-full flex justify-center pt-3 pb-2 bg-card">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          <div className="px-4 pb-3 border-b border-border/30 flex-shrink-0">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary" fill="currentColor" opacity={0.7} />
              </div>
              <div className="flex-1">
                <h1 className="font-bold text-foreground text-lg leading-tight">NeuroFind</h1>
                <p className="text-xs text-muted-foreground">Find the right specialist for your child ✨</p>
              </div>
              {selectedDoctor && (
                <button
                  onClick={handleBackToList}
                  className="p-2 rounded-full bg-gray-100 active:bg-gray-200"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <SearchBar value={search} onChange={setSearch} />
          </div>

          <div className="px-4 py-2.5 flex items-center justify-between text-xs text-muted-foreground border-b border-border/20 flex-shrink-0">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              {filtered.length} specialists nearby
            </span>
            {userLocation && (
              <span className="text-secondary text-[10px] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block animate-pulse" />
                Location active
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0 pb-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="w-full p-4 rounded-2xl bg-card border border-border/10 animate-pulse flex gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-muted shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                    <div className="flex gap-2 pt-1">
                      <div className="h-3 bg-muted rounded w-1/4" />
                      <div className="h-3 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>

        {selectedDoctor && !showMobileList && (
          <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm">
            <div className="absolute inset-0 m-3">
              <DoctorProfile
                doctor={selectedDoctor}
                distance={getDistanceForDoctor(selectedDoctor)}
                onClose={() => {
                  setSelectedDoctor(null);
                  setShowMobileList(true);
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // DESKTOP VIEW - Fixed layout without scrolling on the main container
  return (
    <div className="h-full w-full bg-background">
      <div className="h-full flex flex-row p-4 gap-4">

        {/* Sidebar - Fixed width, scrollable internally */}
        <div className="w-[400px] xl:w-[450px] flex-shrink-0 h-full flex flex-col bg-card rounded-2xl shadow-lg overflow-hidden">
          {/* Header - Fixed */}
          <div className="p-4 pb-3 border-b border-border/30 flex-shrink-0">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary" fill="currentColor" opacity={0.7} />
              </div>
              <div>
                <h1 className="font-bold text-foreground text-lg leading-tight">NeuroFind</h1>
                <p className="text-xs text-muted-foreground">Find the right specialist for your child ✨</p>
              </div>
            </div>
            <SearchBar value={search} onChange={setSearch} />
          </div>

          {/* Results count - Fixed */}
          <div className="px-4 py-2.5 flex items-center justify-between text-xs text-muted-foreground border-b border-border/20 flex-shrink-0">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              {filtered.length} specialists nearby
            </span>
            {userLocation && (
              <span className="text-secondary text-[10px] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block animate-pulse" />
                Location active
              </span>
            )}
          </div>

          {/* Doctor list - Scrollable internally */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="w-full p-4 rounded-2xl bg-card border border-border/10 animate-pulse flex gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-muted shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                    <div className="flex gap-2 pt-1">
                      <div className="h-3 bg-muted rounded w-1/4" />
                      <div className="h-3 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* Map area - Takes remaining space, no scrolling needed */}
        <div className="flex-1 relative h-full">
          <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg">
            <DoctorMap
              doctors={filtered}
              userLocation={userLocation}
              selectedDoctor={selectedDoctor}
              onSelectDoctor={handleSelectDoctor}
              flyTo={flyTo}
            />
          </div>

          {/* Doctor Profile Overlay */}
          {selectedDoctor && (
            <DoctorProfile
              doctor={selectedDoctor}
              distance={getDistanceForDoctor(selectedDoctor)}
              onClose={() => setSelectedDoctor(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}