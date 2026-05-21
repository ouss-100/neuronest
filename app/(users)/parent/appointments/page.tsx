"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Baby,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Stethoscope,
} from "lucide-react";
import { getAppointmentsByParent } from "@/server/appointmentActions";
import { useSession } from "next-auth/react";
import { format } from "date-fns";

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending",
    color: "text-yellow-600 bg-yellow-50 border-yellow-200",
    icon: AlertCircle,
  },
  confirmed: {
    label: "Confirmed",
    color: "text-blue-600 bg-blue-50 border-blue-200",
    icon: CheckCircle,
  },
  completed: {
    label: "Completed",
    color: "text-green-600 bg-green-50 border-green-200",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-600 bg-red-50 border-red-200",
    icon: XCircle,
  },
};

export default function ParentAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    async function load() {
      const parentId = session?.user?.id;
      if (!parentId) return;
      setLoading(true);
      const res = await getAppointmentsByParent(parentId);
      if (res.success && res.appointments) {
        setAppointments(res.appointments);
      }
      setLoading(false);
    }
    load();
  }, [session?.user?.id, status]);

  const filtered =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  const counts = {
    all: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            My Appointments
          </h1>
          <p className="text-sm text-muted-foreground">
            Track and manage your scheduled consultations
          </p>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 flex-wrap"
      >
        {(["all", "pending", "confirmed", "completed", "cancelled"] as const).map(
          (key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                filter === key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/50"
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
              <span className="ml-1.5 text-xs opacity-70">
                ({counts[key]})
              </span>
            </button>
          )
        )}
      </motion.div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 text-muted-foreground"
        >
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No appointments found</p>
          <p className="text-sm mt-1">
            {filter === "all"
              ? "You haven't booked any appointments yet."
              : `No ${filter} appointments.`}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filtered.map((appt, i) => {
            const status = statusConfig[appt.status] ?? statusConfig.pending;
            const StatusIcon = status.icon;
            const doctor = appt.doctorId;
            const child = appt.childId;
            const date = appt.appointmentDate
              ? new Date(appt.appointmentDate)
              : null;

            return (
              <motion.div
                key={appt._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card-soft p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                {/* Date block */}
                <div className="flex-shrink-0 w-16 text-center hidden sm:block">
                  {date ? (
                    <>
                      <p className="text-2xl font-bold text-foreground leading-none">
                        {format(date, "dd")}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        {format(date, "MMM yyyy")}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">N/A</p>
                  )}
                </div>

                <div className="w-px h-12 bg-border hidden sm:block" />

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  {/* Doctor */}
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="font-semibold text-foreground truncate">
                      {doctor
                        ? `Dr. ${doctor.firstname} ${doctor.lastname}`
                        : "Doctor N/A"}
                    </span>
                    {doctor?.specialty && (
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        · {doctor.specialty}
                      </span>
                    )}
                  </div>

                  {/* Child */}
                  {child && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Baby className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>
                        Child · {child.age} year{child.age !== 1 ? "s" : ""} old
                      </span>
                    </div>
                  )}

                  {/* Time & reason */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    {date && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(date, "hh:mm a")}
                      </span>
                    )}
                    {appt.reason && (
                      <span className="truncate max-w-[240px]">
                        "{appt.reason}"
                      </span>
                    )}
                  </div>
                </div>

                {/* Status badge */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border flex-shrink-0 ${status.color}`}
                >
                  <StatusIcon className="w-3.5 h-3.5" />
                  {status.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
