"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, Video, User, Plus, Search, Phone, MapPin, MessageSquare, X } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const appointments = [
  { id: 1, parent: "Sarah Johnson", child: "Emma", date: "2026-05-19", time: "10:00 AM", type: "Video Call", status: "confirmed", concern: "Reading difficulties follow-up" },
  { id: 2, parent: "Wei Chen", child: "Oliver", date: "2026-05-21", time: "2:30 PM", type: "In-Person", status: "confirmed", concern: "Attention assessment review" },
  { id: 3, parent: "Ana Martinez", child: "Sophia", date: "2026-05-25", time: "11:00 AM", type: "Video Call", status: "pending", concern: "Initial consultation" },
  { id: 4, parent: "Jin Park", child: "Liam", date: "2026-05-27", time: "9:00 AM", type: "Phone Call", status: "pending", concern: "Urgent — multiple concerns flagged" },
  { id: 5, parent: "Mark Thompson", child: "Ava", date: "2026-06-02", time: "3:00 PM", type: "In-Person", status: "confirmed", concern: "Number skills follow-up" },
  { id: 6, parent: "Lisa Williams", child: "Noah", date: "2026-06-08", time: "10:30 AM", type: "Video Call", status: "cancelled", concern: "Rescheduled by parent" },
];

// Safely parse YYYY-MM-DD as a local date (avoid UTC shift from `new Date(str)`).
function parseLocalDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}


type FilterType = "all" | "confirmed" | "pending" | "cancelled";

const typeIcons: Record<string, React.ElementType> = {
  "Video Call": Video,
  "In-Person": User,
  "Phone Call": Phone,
};

const DoctorAppointments = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleParent, setScheduleParent] = useState("");
  const [scheduleType, setScheduleType] = useState("Video Call");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const appointmentsWithDate = useMemo(
    () => appointments.map((a) => ({ ...a, dateObj: parseLocalDate(a.date) })),
    []
  );


  const appointmentDays = useMemo(
    () => appointmentsWithDate.filter((a) => a.status !== "cancelled").map((a) => a.dateObj),
    [appointmentsWithDate]
  );

  const filtered = appointmentsWithDate.filter((a) => {
    const matchesFilter = filter === "all" || a.status === filter;
    const matchesSearch = a.parent.toLowerCase().includes(search.toLowerCase()) || a.child.toLowerCase().includes(search.toLowerCase());
    const matchesDate = !selectedDate || isSameDay(a.dateObj, selectedDate);
    return matchesFilter && matchesSearch && matchesDate;
  });

  const todayCount = 1;
  const weekCount = appointments.filter(a => a.status !== "cancelled").length;


  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground mt-1">Manage consultations with parents</p>
        </div>
        <Button variant={"accent" as any} onClick={() => setShowSchedule(true)} className="rounded-2xl">
          <Plus className="w-4 h-4" /> Schedule
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { value: todayCount, label: "Today" },
          { value: weekCount, label: "This Week" },
          { value: appointments.filter(a => a.status === "pending").length, label: "Pending", color: "text-primary" },
          { value: appointments.filter(a => a.type === "Video Call").length, label: "Video Calls", color: "text-secondary" },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 text-center rounded-[32px] border-border/50 shadow-[var(--shadow-soft)]">
            <p className={`text-2xl font-heading font-bold ${stat.color || "text-foreground"}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Calendar */}
      <Card className="p-4 sm:p-6 rounded-[32px] border-border/50 shadow-[var(--shadow-soft)]">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-shrink-0 flex justify-center lg:justify-start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              defaultMonth={new Date()}
              modifiers={{ booked: appointmentDays }}
              modifiersClassNames={{
                booked:
                  "font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-md",
              }}
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
                    ? `${appointmentsWithDate.filter((a) => isSameDay(a.dateObj, selectedDate)).length} appointment(s)`
                    : "Pick a date to filter"}
                </p>
              </div>
              {selectedDate && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedDate(undefined)} className="rounded-full">
                  <X className="w-3 h-3" /> Clear
                </Button>
              )}
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {(selectedDate
                ? appointmentsWithDate.filter((a) => isSameDay(a.dateObj, selectedDate))
                : appointmentsWithDate.filter((a) => a.status !== "cancelled").slice(0, 4)
              ).map((a) => {
                const IconComp = typeIcons[a.type] || User;
                return (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-border/50 bg-muted/30"
                  >
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{a.parent}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {format(a.dateObj, "MMM d")}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {a.time}</span>
                      </p>
                    </div>
                    <Badge variant={
                      a.status === "confirmed" ? "completed" :
                      a.status === "cancelled" ? "muted" : "pending"
                    } className="capitalize">{a.status}</Badge>
                  </div>
                );
              })}
              {selectedDate && appointmentsWithDate.filter((a) => isSameDay(a.dateObj, selectedDate)).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">No appointments on this date.</p>
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
            placeholder="Search by parent or child name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-2xl"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "confirmed", "pending", "cancelled"] as FilterType[]).map((f) => (
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
        {filtered.length === 0 ? (
          <Card className="text-center py-10 rounded-[32px] border-border/50 shadow-[var(--shadow-soft)]">
            <CalendarIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No appointments found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
          </Card>
        ) : (
          filtered.map((a, i) => {
            const IconComp = typeIcons[a.type] || User;
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className={`p-6 rounded-[32px] border-border/50 shadow-[var(--shadow-soft)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5 ${
                  a.status === "cancelled" ? "opacity-60" : ""
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      a.status === "cancelled"
                        ? "bg-muted text-muted-foreground"
                        : a.type === "Video Call"
                          ? "bg-secondary/10 text-secondary"
                          : a.type === "Phone Call"
                            ? "bg-primary/10 text-primary"
                            : "bg-accent/10 text-accent"
                    }`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-foreground text-sm">{a.parent}</p>
                      <p className="text-xs text-muted-foreground">
                        Re: {a.child} • {a.type}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {format(a.dateObj, "MMM d, yyyy")}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {a.time}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 italic">{a.concern}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      a.status === "confirmed" ? "completed" :
                      a.status === "cancelled" ? "muted" :
                      "pending"
                    }>
                      {a.status === "confirmed" ? "Confirmed" : a.status === "cancelled" ? "Cancelled" : "Pending"}
                    </Badge>
                    {a.status !== "cancelled" && (
                      <>
                        <Button variant="ghost" size="icon" className="rounded-xl" title="Message parent">
                          <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button variant={"outline-primary" as any} size="sm" className="rounded-2xl">Details</Button>
                      </>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Schedule Dialog */}
      <Dialog open={showSchedule} onOpenChange={setShowSchedule}>
        <DialogContent className="rounded-[32px] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Appointment</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowSchedule(false); }}>
            <div className="space-y-2">
              <Label>Parent</Label>
              <Select value={scheduleParent} onValueChange={setScheduleParent}>
                <SelectTrigger className="rounded-2xl">
                  <SelectValue placeholder="Select parent..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah">Sarah Johnson (Emma)</SelectItem>
                  <SelectItem value="wei">Wei Chen (Oliver)</SelectItem>
                  <SelectItem value="ana">Ana Martinez (Sophia)</SelectItem>
                  <SelectItem value="jin">Jin Park (Liam)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" className="rounded-2xl" />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input type="time" className="rounded-2xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={scheduleType} onValueChange={setScheduleType}>
                <SelectTrigger className="rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Video Call">Video Call</SelectItem>
                  <SelectItem value="In-Person">In-Person</SelectItem>
                  <SelectItem value="Phone Call">Phone Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea className="rounded-2xl resize-none" placeholder="Add any notes about the appointment..." />
            </div>
            <DialogFooter>
              <Button type="button" variant={"outline-primary" as any} onClick={() => setShowSchedule(false)} className="rounded-2xl">Cancel</Button>
              <Button type="submit" variant={"accent" as any} className="rounded-2xl">Schedule</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorAppointments;
