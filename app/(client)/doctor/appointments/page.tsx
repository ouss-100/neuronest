"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Video, User, Plus } from "lucide-react";

const appointments = [
  {
    parent: "Sarah Johnson",
    child: "Emma",
    date: "Mar 20, 2026",
    time: "10:00 AM",
    type: "Video Call",
    status: "confirmed",
  },
  {
    parent: "Wei Chen",
    child: "Oliver",
    date: "Mar 22, 2026",
    time: "2:30 PM",
    type: "In-Person",
    status: "confirmed",
  },
  {
    parent: "Ana Martinez",
    child: "Sophia",
    date: "Mar 25, 2026",
    time: "11:00 AM",
    type: "Video Call",
    status: "pending",
  },
];

const DoctorAppointments = () => (
  <div className="space-y-6 max-w-4xl">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
          Appointments
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage consultations with parents
        </p>
      </div>
      <button className="btn-accent !px-5 !py-2.5 text-sm flex items-center gap-1.5">
        <Plus className="w-4 h-4" /> Schedule
      </button>
    </div>

    <div className="space-y-3">
      {appointments.map((a, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="card-soft-hover flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
              {a.type === "Video Call" ? (
                <Video className="w-6 h-6" />
              ) : (
                <User className="w-6 h-6" />
              )}
            </div>
            <div>
              <p className="font-heading font-bold text-foreground text-sm">
                {a.parent}
              </p>
              <p className="text-xs text-muted-foreground">
                Re: {a.child} • <Calendar className="w-3 h-3 inline" /> {a.date}{" "}
                • <Clock className="w-3 h-3 inline" /> {a.time}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={
                a.status === "confirmed" ? "badge-completed" : "badge-pending"
              }
            >
              {a.status === "confirmed" ? "Confirmed" : "Pending"}
            </span>
            <button className="btn-outline-primary !px-3 !py-1.5 text-xs">
              Details
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default DoctorAppointments;
