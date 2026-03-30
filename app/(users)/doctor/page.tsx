"use client";
"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Users, ClipboardList, Bell, Calendar, ArrowRight, TrendingUp, Clock, Search, Filter } from "lucide-react";
import Link from "next/link";
import StatCard from "@/components/StatCard";

const children = [
  { name: "Emma Johnson", age: 7, parent: "Sarah Johnson", status: "pending", lastSeen: "Mar 10, 2026", concern: "Reading difficulties" },
  { name: "Oliver Chen", age: 9, parent: "Wei Chen", status: "completed", lastSeen: "Mar 8, 2026", concern: "Attention span" },
  { name: "Sophia Martinez", age: 6, parent: "Ana Martinez", status: "pending", lastSeen: "Mar 12, 2026", concern: "Letter recognition" },
  { name: "Liam Park", age: 8, parent: "Jin Park", status: "urgent", lastSeen: "Mar 14, 2026", concern: "Multiple concerns" },
  { name: "Ava Thompson", age: 5, parent: "Mark Thompson", status: "completed", lastSeen: "Mar 6, 2026", concern: "Number skills" },
];

const notifications = [
  { text: "New assessment for Emma Johnson is ready for review", time: "1 hour ago", unread: true },
  { text: "Appointment with Wei Chen confirmed for Mar 20", time: "3 hours ago", unread: true },
  { text: "Ana Martinez requested a consultation", time: "1 day ago", unread: false },
  { text: "Monthly report generated successfully", time: "2 days ago", unread: false },
];

const upcomingAppointments = [
  { parent: "Sarah Johnson", child: "Emma", time: "10:00 AM", date: "Today", type: "Video Call" },
  { parent: "Wei Chen", child: "Oliver", time: "2:30 PM", date: "Tomorrow", type: "In-Person" },
  { parent: "Jin Park", child: "Liam", time: "11:00 AM", date: "Mar 22", type: "Video Call" },
];

type FilterType = "all" | "pending" | "completed" | "urgent";

const DoctorDashboard = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  const filtered = children.filter((c) => {
    const matchesFilter = filter === "all" || c.status === filter;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.parent.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Good morning, Dr. Smith 👋</h1>
          <p className="text-muted-foreground mt-1">You have {children.filter(c => c.status === "pending").length} pending and {children.filter(c => c.status === "urgent").length} urgent assessments to review.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Assigned Children" value="12" color="primary" />
        <StatCard icon={ClipboardList} label="Pending Reviews" value="5" change="2 urgent" color="accent" />
        <StatCard icon={Calendar} label="Appointments" value="3" change="This week" color="secondary" />
        <StatCard icon={TrendingUp} label="Completed" value="28" change="+6 this month" color="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Children List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="font-heading font-bold text-lg text-foreground">Assigned Children</h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-soft !pl-9 !py-2 text-sm w-full sm:w-48"
                />
              </div>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {(["all", "pending", "urgent", "completed"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f} {f !== "all" && `(${children.filter(c => c.status === f).length})`}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="card-soft text-center py-8">
                <p className="text-muted-foreground">No children match your search.</p>
              </div>
            ) : (
              filtered.map((child, i) => (
                <motion.div
                  key={child.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link href="/doctor/evaluations" className="card-soft-hover flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl font-heading font-bold flex items-center justify-center text-lg ${
                        child.status === "urgent"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-primary/10 text-primary"
                      }`}>
                        {child.name[0]}
                      </div>
                      <div>
                        <p className="font-heading font-bold text-foreground text-sm">{child.name}</p>
                        <p className="text-xs text-muted-foreground">Age {child.age} • {child.concern}</p>
                        <p className="text-xs text-muted-foreground">Parent: {child.parent} • Last seen: {child.lastSeen}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={
                        child.status === "completed" ? "badge-completed" :
                        child.status === "urgent" ? "badge-pending" :
                        "badge-pending"
                      }>
                        {child.status === "completed" ? "Reviewed" : child.status === "urgent" ? "Urgent" : "Pending"}
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5" /> Upcoming
              </h2>
              <Link href="/doctor/appointments" className="text-xs text-primary font-semibold hover:underline">View All</Link>
            </div>
            {upcomingAppointments.map((apt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="card-soft !p-4"
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-semibold text-foreground">{apt.parent}</p>
                  <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-medium">{apt.type}</span>
                </div>
                <p className="text-xs text-muted-foreground">Re: {apt.child} • {apt.date} at {apt.time}</p>
              </motion.div>
            ))}
          </div>

          {/* Notifications */}
          <div className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
              <Bell className="w-5 h-5" /> Notifications
            </h2>
            {notifications.map((n, i) => (
              <div key={i} className={`card-soft !p-4 ${n.unread ? "border-l-2 border-l-primary" : ""}`}>
                <p className="text-sm text-foreground">{n.text}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
