"use client";

import { useEffect, useState } from "react";
import {
  Baby,
  ClipboardList,
  Bell,
  TrendingUp,
  ArrowRight,
  Plus,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import { getParentDashboardStats } from "@/server/dashboardActions";
import { useSession } from "next-auth/react";

export default function ParentDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    async function loadStats() {
      if (!session?.user?.id) return;
      setLoading(true);
      const res = await getParentDashboardStats(session.user.id);
      if (res.success) {
        setStats(res.stats);
      }
      setLoading(false);
    }
    if (session?.user?.id) {
      loadStats();
    }
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
          Welcome back 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your children's progress.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Baby} label="Children" value={stats?.childrenCount?.toString() || "0"} color="primary" />
        <StatCard
          icon={ClipboardList}
          label="Assessments"
          value={stats?.assessmentsCount?.toString() || "0"}
          color="secondary"
        />
        <StatCard icon={TrendingUp} label="Latest Score" value={`${stats?.latestScore || 0}%`} color="accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-lg text-foreground">
              Results
            </h2>
            <Link href="/parent/results" className="btn-outline-primary !px-4 !py-2 text-sm flex items-center gap-1.5">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {stats?.assessments?.length === 0 ? (
            <div className="card-soft text-center py-10 text-muted-foreground">
              No results found.
            </div>
          ) : (
            stats?.assessments?.map((assessment: any) => (
              <Link
                key={assessment._id}
                href="/parent/results"
                className="card-soft-hover flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary font-heading font-bold flex items-center justify-center text-lg">
                    {assessment.score}%
                  </div>
                  <div>
                    <p className="font-heading font-bold text-foreground">
                      Developmental Screening
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(assessment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Appointments */}
        <div className="space-y-4">
          <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Appointments
          </h2>
          <div className="space-y-2">
            {stats?.appointments?.length === 0 ? (
              <div className="card-soft text-center text-muted-foreground py-4 text-sm">
                No upcoming appointments
              </div>
            ) : (
              stats?.appointments?.map((appt: any, i: number) => (
                <div key={i} className="card-soft !p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-foreground">Consultation</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(appt.appointmentDate).toLocaleDateString()} at {new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      appt.status === "completed" ? "bg-secondary/10 text-secondary" :
                      appt.status === "cancelled" ? "bg-accent/10 text-accent" :
                      "bg-primary/10 text-primary"
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                </div>
              ))
            )}
            <Link href="/parent/appointments" className="block text-center text-sm text-primary hover:underline mt-2">
              View all appointments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
