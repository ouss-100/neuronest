import { Star, MapPin, Heart } from "lucide-react";
import type { Doctor } from "@/types/doctor";

interface DoctorCardProps {
  doctor: Doctor;
  distance: number;
  isSelected: boolean;
  onClick: () => void;
}

const specialtyConfig: Record<string, { bg: string; text: string; emoji: string }> = {
  "Neurologist": { bg: "bg-primary/8", text: "text-primary", emoji: "🧠" },
  "Speech Therapist": { bg: "bg-secondary/8", text: "text-secondary", emoji: "💬" },
  "Child Psychologist": { bg: "bg-[hsl(340_45%_65%/0.08)]", text: "text-[hsl(340,45%,65%)]", emoji: "🧩" },
  "Pediatric Neurologist": { bg: "bg-accent/8", text: "text-accent", emoji: "🌟" },
};

export default function DoctorCard({ doctor, distance, isSelected, onClick }: DoctorCardProps) {
  const config = specialtyConfig[doctor.specialty] || { bg: "bg-primary/8", text: "text-primary", emoji: "🩺" };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left card-soft-hover cursor-pointer p-4 group ${
        isSelected
          ? "ring-2 ring-primary/40 border-primary/20 bg-primary/[0.02]"
          : ""
      }`}
    >
      <div className="flex gap-3">
        <div className={`w-12 h-12 rounded-2xl ${config.bg} flex items-center justify-center text-lg shrink-0`}>
          {config.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-card-foreground truncate text-sm">{doctor.name}</h3>
            <Heart className={`h-3.5 w-3.5 shrink-0 mt-0.5 transition-colors ${
              isSelected ? "fill-accent/60 text-accent" : "text-muted-foreground/30 group-hover:text-accent/40"
            }`} />
          </div>
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium mt-1 ${config.bg} ${config.text}`}>
            {doctor.specialty}
          </span>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              <span className="font-semibold text-card-foreground">{doctor.rating}</span>
              <span>({doctor.reviews})</span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {distance.toFixed(1)} km
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
