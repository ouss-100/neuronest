"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Search,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { isSameDay, format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { getAppointmentsByDoctor, updateAppointmentStatus } from "@/server/appointmentActions";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

type FilterType = "all" | "confirmed" | "pending" | "cancelled" | "completed";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchAppointments = useCallback(async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    const res = await getAppointmentsByDoctor(session.user.id);
    if (res.success) {
      setAppointments(
        (res.appointments || []).map((a: any) => ({
          ...a,
          dateObj: new Date(a.appointmentDate),
        }))
      );
    }
    setLoading(false);
  }, [session?.user?.id]);

  useEffect(() => { 
    if (session?.user?.id) {
      fetchAppointments(); 
    }
  }, [fetchAppointments, session?.user?.id]);

  async function handleStatusChange(id: string, status: "confirmed" | "cancelled" | "completed") {
    setUpdatingId(id);
    const res = await updateAppointmentStatus(id, status);
    
    if (res.success && status === "confirmed") {
      toast.success("Appointment confirmed. Draft report created — view in Reports.");
    } else if (res.success) {
      toast.success(`Appointment marked as ${status}.`);
    } else {
      toast.error(res.message || "Failed to update appointment");
    }

    await fetchAppointments();
    setUpdatingId(null);
  }

  const appointmentDays = useMemo(
    () => appointments.filter((a) => a.status !== "cancelled").map((a) => a.dateObj),
    [appointments]
  );

  const filtered = appointments.filter((a) => {
    const parentName = `${a.parentId?.firstname ?? ""} ${a.parentId?.lastname ?? ""}`.toLowerCase();
    const matchesFilter = filter === "all" || a.status === filter;
    const matchesSearch = parentName.includes(search.toLowerCase());
    const matchesDate = !selectedDate || isSameDay(a.dateObj, selectedDate);
    return matchesFilter && matchesSearch && matchesDate;
  });

  const today = new Date();
  const todayCount = appointments.filter((a) => isSameDay(a.dateObj, today) && a.status !== "cancelled").length;
  const pendingCount = appointments.filter((a) => a.status === "pending").length;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground mt-1">Manage consultations with parents</p>
        </div>
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={fetchAppointments} title="Refresh">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { value: todayCount, label: "Today" },
          { value: appointments.filter((a) => a.status !== "cancelled").length, label: "Total Active" },
          { value: pendingCount, label: "Pending", color: "text-primary" },
          { value: appointments.filter((a) => a.status === "confirmed").length, label: "Confirmed", color: "text-secondary" },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 text-center rounded-[32px] border-border/50 shadow-[var(--shadow-soft)]">
            <p className={`text-2xl font-heading font-bold ${stat.color || "text-foreground"}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Calendar + Preview */}
      <Card className="p-4 sm:p-6 rounded-[32px] border-border/50 shadow-[var(--shadow-soft)]">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-shrink-0 flex justify-center lg:justify-start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              defaultMonth={new Date()}
              modifiers={{ booked: appointmentDays }}
              modifiersClassNames={{ booked: "font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-md" }}
              className="rounded-2xl border border-border/50 p-3 pointer-events-auto"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-heading font-bold text-foreground">
                  {selectedDate ? format(selectedDate, "EEEE, MMMM d") : "All upcoming dates"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {selectedDate
                    ? `${appointments.filter((a) => isSameDay(a.dateObj, selectedDate)).length} appointment(s)`
                    : "Pick a date to filter"}
                </p>
              </div>
              {selectedDate && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedDate(undefined)} className="rounded-full text-xs">
                  Clear
                </Button>
              )}
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {(selectedDate
                ? appointments.filter((a) => isSameDay(a.dateObj, selectedDate))
                : appointments.filter((a) => a.status !== "cancelled").slice(0, 4)
              ).map((a) => (
                <div key={a._id} className="flex items-center gap-3 p-3 rounded-2xl border border-border/50 bg-muted/30">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {a.parentId?.firstname ?? "Parent"} {a.parentId?.lastname ?? ""}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {format(a.dateObj, "MMM d")}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {format(a.dateObj, "h:mm a")}</span>
                    </p>
                  </div>
                  <Badge variant={a.status === "confirmed" ? "completed" : a.status === "cancelled" ? "muted" : "pending"} className="capitalize">
                    {a.status}
                  </Badge>
                </div>
              ))}
              {appointments.length === 0 && !loading && (
                <p className="text-sm text-muted-foreground text-center py-6">No appointments yet.</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by parent name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-2xl"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "confirmed", "pending", "cancelled", "completed"] as FilterType[]).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(f)}
              className="rounded-full capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {loading ? (
          <Card className="text-center py-10 rounded-[32px] border-border/50">
            <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Loading appointments...</p>
          </Card>
        ) : filtered.length === 0 ? (
          <Card className="text-center py-10 rounded-[32px] border-border/50 shadow-[var(--shadow-soft)]">
            <CalendarIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No appointments found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
          </Card>
        ) : (
          filtered.map((a, i) => (
            <motion.div
              key={a._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className={`p-6 rounded-[32px] border-border/50 shadow-[var(--shadow-soft)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5 ${a.status === "cancelled" ? "opacity-60" : ""}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-foreground text-sm">
                      {a.parentId?.firstname ?? "Parent"} {a.parentId?.lastname ?? ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Child age {a.childId?.age ?? "—"}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {format(a.dateObj, "MMM d, yyyy")}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {format(a.dateObj, "h:mm a")}</span>
                    </p>
                    {a.reason && <p className="text-xs text-muted-foreground mt-0.5 italic">"{a.reason}"</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={
                    a.status === "confirmed" ? "completed" :
                    a.status === "cancelled" ? "muted" :
                    a.status === "completed" ? "completed" :
                    "pending"
                  } className="capitalize">
                    {a.status}
                  </Badge>

                  {a.status === "pending" && (
                    <>
                      <Button
                        variant={"outline-primary" as any}
                        size="sm"
                        className="rounded-2xl text-xs"
                        disabled={updatingId === a._id}
                        onClick={() => handleStatusChange(a._id, "confirmed")}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {updatingId === a._id ? "..." : "Confirm"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-2xl text-xs text-destructive hover:text-destructive"
                        disabled={updatingId === a._id}
                        onClick={() => handleStatusChange(a._id, "cancelled")}
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Cancel
                      </Button>
                    </>
                  )}

                  {a.status === "confirmed" && (
                    <Button
                      variant={"accent" as any}
                      size="sm"
                      className="rounded-2xl text-xs"
                      disabled={updatingId === a._id}
                      onClick={() => handleStatusChange(a._id, "completed")}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {updatingId === a._id ? "..." : "Mark Complete"}
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
