import { useState } from "react";
import { Star, MapPin, X, Calendar, Navigation, ShieldCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import type { Doctor } from "@/types/doctor";
import { bookAppointment } from "@/server/appointmentActions";
import { toast } from "sonner";
import { MOCK_PARENT_ID } from "@/lib/constants";

interface DoctorProfileProps {
  doctor: Doctor;
  distance: number;
  onClose: () => void;
}

const specialtyConfig: Record<string, { bg: string; text: string; emoji: string }> = {
  "Neurologist": { bg: "bg-primary/8", text: "text-primary", emoji: "🧠" },
  "Speech Therapist": { bg: "bg-secondary/8", text: "text-secondary", emoji: "💬" },
  "Child Psychologist": { bg: "bg-[hsl(340_45%_65%/0.08)]", text: "text-[hsl(340,45%,65%)]", emoji: "🧩" },
  "Pediatric Neurologist": { bg: "bg-accent/8", text: "text-accent", emoji: "🌟" },
};

export default function DoctorProfile({ doctor, distance, onClose }: DoctorProfileProps) {
  const config = specialtyConfig[doctor.specialty] || { bg: "bg-primary/8", text: "text-primary", emoji: "🩺" };
  const [isBooking, setIsBooking] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingReason, setBookingReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const { data: session } = useSession();

  const handleBook = async () => {
    if (!bookingDate) return;
    setIsSubmitting(true);
    const res = await bookAppointment({
      doctorId: (doctor as any)._id || (doctor as any).id || "temp-doctor-id",
      parentId: session?.user?.id || MOCK_PARENT_ID,
      childId: undefined, // Let the backend default to the parent's child
      appointmentDate: new Date(bookingDate),
      reason: bookingReason || "Consultation",
    });
    if (res.success) {
      setBookingSuccess(true);
    } else {
      toast.error(res.message || "Failed to book appointment");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 z-[1000] animate-[slideUp_0.35s_ease-out]">
      <div className="card-soft p-5 max-w-lg mx-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-xl hover:bg-muted/60 transition-colors"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>

        <div className="flex gap-4">
          <div className={`w-16 h-16 rounded-2xl ${config.bg} flex items-center justify-center text-2xl shrink-0`}>
            {config.emoji}
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-lg text-card-foreground">{doctor.name}</h2>
            <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-medium mt-1 ${config.bg} ${config.text}`}>
              {doctor.specialty}
            </span>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-semibold text-card-foreground">{doctor.rating}</span>
                <span>({doctor.reviews} reviews)</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {distance.toFixed(1)} km
              </span>
            </div>
          </div>
        </div>

        {/* Trust badge */}
        <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-xl bg-secondary/5 text-secondary text-xs font-medium">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Verified specialist · Experienced with children</span>
        </div>

        {isBooking ? (
          <div className="mt-4 pt-4 border-t border-border/50">
            {bookingSuccess ? (
              <div className="text-center py-4 space-y-2">
                <ShieldCheck className="h-10 w-10 text-secondary mx-auto" />
                <p className="font-bold text-foreground">Appointment Requested!</p>
                <p className="text-xs text-muted-foreground">The doctor will review your request.</p>
                <button onClick={onClose} className="btn-outline-primary w-full mt-2 text-sm py-2">Close</button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full text-sm rounded-xl border border-border/50 p-2 bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Reason (Optional)</label>
                  <input
                    type="text"
                    value={bookingReason}
                    onChange={(e) => setBookingReason(e.target.value)}
                    placeholder="e.g. Follow-up consultation"
                    className="w-full text-sm rounded-xl border border-border/50 p-2 bg-background text-foreground"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setIsBooking(false)} className="btn-outline-primary flex-1 text-sm py-2">Cancel</button>
                  <button onClick={handleBook} disabled={isSubmitting || !bookingDate} className="btn-accent flex-1 text-sm py-2 flex items-center justify-center">
                    {isSubmitting ? "..." : "Confirm Booking"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-3 mt-4">
            <button onClick={() => setIsBooking(true)} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm">
              <Calendar className="h-4 w-4" />
              Book Appointment
            </button>
            <button className="btn-outline-primary flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm">
              <Navigation className="h-4 w-4" />
              Get Directions
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
