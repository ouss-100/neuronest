"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Users, ClipboardList, Bell, Calendar, ArrowRight, TrendingUp, Clock, Search } from "lucide-react";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import { getDoctorDashboardStats } from "@/server/dashboardActions";
import { useSession } from "next-auth/react";

type FilterType = "all" | "pending" | "completed";

export default function DoctorDashboard() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    async function loadStats() {
      if (!session?.user?.id) return;
      setLoading(true);
      const res = await getDoctorDashboardStats(session.user.id);
      if (res.success) {
        setStats(res.stats);
      }
      setLoading(false);
    }
    loadStats();
  }, [session?.user?.id]);

  const filteredChildren = stats?.children?.filter((c: any) => {
    const matchesFilter = filter === "all" || c.status === filter;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.parent.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Good morning 👋</h1>
          <p className="text-muted-foreground mt-1">
            You have {stats?.pendingReviews} pending appointments to review.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Assigned Children" value={stats?.assignedChildrenCount?.toString() || "0"} color="primary" />
        <StatCard icon={ClipboardList} label="Pending Appointments" value={stats?.pendingReviews?.toString() || "0"} color="accent" />
        <StatCard icon={Calendar} label="Upcoming Appts" value={stats?.appointmentsCount?.toString() || "0"} color="secondary" />
        <StatCard icon={TrendingUp} label="Completed" value={stats?.completedCount?.toString() || "0"} color="primary" />
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
                  placeholder="Search parent..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-soft !pl-9 !py-2 text-sm w-full sm:w-48"
                />
              </div>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {(["all", "pending", "completed"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f} {f !== "all" && `(${stats?.children?.filter((c: any) => c.status === f).length || 0})`}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredChildren.length === 0 ? (
              <div className="card-soft text-center py-8">
                <p className="text-muted-foreground">No children match your search.</p>
              </div>
            ) : (
              filteredChildren.map((child: any, i: number) => (
                <motion.div
                  key={child.name + i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link href="/doctor/evaluation" className="card-soft-hover flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl font-heading font-bold flex items-center justify-center text-lg ${
                        child.status === "pending"
                          ? "bg-accent/10 text-accent"
                          : "bg-primary/10 text-primary"
                      }`}>
                        {child.name[0]}
                      </div>
                      <div>
                        <p className="font-heading font-bold text-foreground text-sm">{child.name}</p>
                        <p className="text-xs text-muted-foreground">Age {child.age} • {child.concern}</p>
                        <p className="text-xs text-muted-foreground">Parent: {child.parent} • Appt: {child.lastSeen}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={child.status === "completed" ? "badge-completed" : "badge-pending"}>
                        {child.status === "completed" ? "Completed" : "Pending"}
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
            
            {stats?.upcomingAppointments?.length === 0 ? (
              <div className="card-soft text-center py-6 text-sm text-muted-foreground">
                No upcoming appointments.
              </div>
            ) : (
              stats?.upcomingAppointments?.map((apt: any, i: number) => (
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
                  <p className="text-xs text-muted-foreground">{apt.child} • {apt.date} at {apt.time}</p>
                </motion.div>
              ))
            )}
          </div>

          {/* Notifications */}
          <div className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
              <Bell className="w-5 h-5" /> Notifications
            </h2>
            {stats?.notifications?.length === 0 ? (
              <div className="card-soft text-center py-6 text-sm text-muted-foreground">
                No new notifications.
              </div>
            ) : (
              stats?.notifications?.map((n: any, i: number) => (
                <div key={i} className={`card-soft !p-4 ${n.unread ? "border-l-2 border-l-primary" : ""}`}>
                  <p className="text-sm text-foreground">{n.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
